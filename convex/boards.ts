import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create board in workspace
export const createBoard = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    name: v.string(),
    description: v.optional(v.string()),
    icon: v.string(),
    accentColor: v.string(),
    creatorId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const existingBoards = await ctx.db
      .query("boards")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    const now = Date.now();
    const order = existingBoards.length + 1;

    const boardId = await ctx.db.insert("boards", {
      workspaceId: args.workspaceId,
      name: args.name,
      description: args.description,
      icon: args.icon,
      accentColor: args.accentColor,
      isArchived: false,
      order,
      createdAt: now,
    });

    // Create default columns for new board
    const defaultColumns = [
      { name: "To Do", color: "#FFC700", order: 1 },
      { name: "In Progress", color: "#FF90E8", order: 2 },
      { name: "Done", color: "#00E599", order: 3 },
    ];

    for (const col of defaultColumns) {
      await ctx.db.insert("columns", {
        boardId,
        name: col.name,
        color: col.color,
        order: col.order,
        createdAt: now,
      });
    }

    // Log activity
    await ctx.db.insert("activityLogs", {
      workspaceId: args.workspaceId,
      boardId,
      actorId: args.creatorId,
      action: "BOARD_CREATED",
      details: `Created board "${args.name}"`,
      createdAt: now,
    });

    return boardId;
  },
});

// Get all active boards in workspace
export const getWorkspaceBoards = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const boards = await ctx.db
      .query("boards")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    return boards
      .filter((b) => !b.isArchived)
      .sort((a, b) => a.order - b.order);
  },
});

// Get board details with column count
export const getBoardById = query({
  args: { boardId: v.id("boards") },
  handler: async (ctx, args) => {
    const board = await ctx.db.get(args.boardId);
    if (!board) return null;

    const columns = await ctx.db
      .query("columns")
      .withIndex("by_board", (q) => q.eq("boardId", args.boardId))
      .collect();

    return {
      ...board,
      columns: columns.sort((a, b) => a.order - b.order),
    };
  },
});

// Update board details
export const updateBoard = mutation({
  args: {
    boardId: v.id("boards"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
    accentColor: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { boardId, ...updates } = args;
    await ctx.db.patch(boardId, updates);
  },
});

// Archive/unarchive board
export const toggleArchiveBoard = mutation({
  args: { boardId: v.id("boards") },
  handler: async (ctx, args) => {
    const board = await ctx.db.get(args.boardId);
    if (!board) throw new Error("Board not found");

    await ctx.db.patch(args.boardId, {
      isArchived: !board.isArchived,
    });
  },
});
