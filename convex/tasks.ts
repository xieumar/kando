import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create task in column
export const createTask = mutation({
  args: {
    boardId: v.id("boards"),
    columnId: v.id("columns"),
    title: v.string(),
    description: v.optional(v.string()),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    assigneeIds: v.array(v.id("users")),
    tags: v.array(v.string()),
    dueDate: v.optional(v.number()),
    coverColor: v.optional(v.string()),
    estimatedHours: v.optional(v.number()),
    creatorId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const existingTasks = await ctx.db
      .query("tasks")
      .withIndex("by_column", (q) => q.eq("columnId", args.columnId))
      .collect();

    const column = await ctx.db.get(args.columnId);
    const order = existingTasks.length + 1;
    const now = Date.now();

    const taskId = await ctx.db.insert("tasks", {
      boardId: args.boardId,
      columnId: args.columnId,
      title: args.title,
      description: args.description,
      priority: args.priority,
      status: column ? column.name : "To Do",
      assigneeIds: args.assigneeIds,
      tags: args.tags,
      dueDate: args.dueDate,
      order,
      coverColor: args.coverColor,
      estimatedHours: args.estimatedHours,
      loggedHours: 0,
      isArchived: false,
      createdAt: now,
      updatedAt: now,
    });

    // Activity log
    await ctx.db.insert("activityLogs", {
      workspaceId: (await ctx.db.get(args.boardId))!.workspaceId,
      boardId: args.boardId,
      taskId,
      actorId: args.creatorId,
      action: "TASK_CREATED",
      details: `Created task "${args.title}"`,
      createdAt: now,
    });

    return taskId;
  },
});

// Get all active tasks for a board
export const getBoardTasks = query({
  args: { boardId: v.id("boards") },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_board", (q) => q.eq("boardId", args.boardId))
      .collect();

    return tasks.filter((t) => !t.isArchived);
  },
});

// Move task (Drag & Drop Reordering Mutation)
export const moveTask = mutation({
  args: {
    taskId: v.id("tasks"),
    targetColumnId: v.id("columns"),
    newOrder: v.number(),
    actorId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    if (!task) throw new Error("Task not found");

    const targetColumn = await ctx.db.get(args.targetColumnId);
    const prevColumnId = task.columnId;

    await ctx.db.patch(args.taskId, {
      columnId: args.targetColumnId,
      status: targetColumn ? targetColumn.name : task.status,
      order: args.newOrder,
      updatedAt: Date.now(),
    });

    // Log activity if column changed
    if (prevColumnId !== args.targetColumnId && args.actorId) {
      await ctx.db.insert("activityLogs", {
        workspaceId: (await ctx.db.get(task.boardId))!.workspaceId,
        boardId: task.boardId,
        taskId: task._id,
        actorId: args.actorId,
        action: "TASK_MOVED",
        details: `Moved "${task.title}" to ${targetColumn?.name || "new column"}`,
        createdAt: Date.now(),
      });
    }
  },
});

// Update task details
export const updateTask = mutation({
  args: {
    taskId: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    priority: v.optional(
      v.union(
        v.literal("low"),
        v.literal("medium"),
        v.literal("high"),
        v.literal("urgent")
      )
    ),
    assigneeIds: v.optional(v.array(v.id("users"))),
    tags: v.optional(v.array(v.string())),
    dueDate: v.optional(v.number()),
    coverColor: v.optional(v.string()),
    estimatedHours: v.optional(v.number()),
    loggedHours: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { taskId, ...updates } = args;
    await ctx.db.patch(taskId, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Delete task
export const deleteTask = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    // Delete subtasks
    const subtasks = await ctx.db
      .query("subtasks")
      .withIndex("by_task", (q) => q.eq("taskId", args.taskId))
      .collect();
    for (const sub of subtasks) {
      await ctx.db.delete(sub._id);
    }

    // Delete comments
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_task", (q) => q.eq("taskId", args.taskId))
      .collect();
    for (const comment of comments) {
      await ctx.db.delete(comment._id);
    }

    await ctx.db.delete(args.taskId);
  },
});
