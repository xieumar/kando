import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createSubtask = mutation({
  args: {
    taskId: v.id("tasks"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("subtasks")
      .withIndex("by_task", (q) => q.eq("taskId", args.taskId))
      .collect();

    return await ctx.db.insert("subtasks", {
      taskId: args.taskId,
      title: args.title,
      isCompleted: false,
      order: existing.length + 1,
    });
  },
});

export const getTaskSubtasks = query({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const subtasks = await ctx.db
      .query("subtasks")
      .withIndex("by_task", (q) => q.eq("taskId", args.taskId))
      .collect();

    return subtasks.sort((a, b) => a.order - b.order);
  },
});

export const toggleSubtask = mutation({
  args: { subtaskId: v.id("subtasks") },
  handler: async (ctx, args) => {
    const sub = await ctx.db.get(args.subtaskId);
    if (!sub) throw new Error("Subtask not found");

    await ctx.db.patch(args.subtaskId, {
      isCompleted: !sub.isCompleted,
    });
  },
});

export const deleteSubtask = mutation({
  args: { subtaskId: v.id("subtasks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.subtaskId);
  },
});
