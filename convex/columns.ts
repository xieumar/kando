import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create column in board
export const createColumn = mutation({
  args: {
    boardId: v.id("boards"),
    name: v.string(),
    color: v.string(),
    wipLimit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const existingCols = await ctx.db
      .query("columns")
      .withIndex("by_board", (q) => q.eq("boardId", args.boardId))
      .collect();

    const order = existingCols.length + 1;

    return await ctx.db.insert("columns", {
      boardId: args.boardId,
      name: args.name,
      color: args.color,
      wipLimit: args.wipLimit,
      order,
      createdAt: Date.now(),
    });
  },
});

// Get columns for board
export const getBoardColumns = query({
  args: { boardId: v.id("boards") },
  handler: async (ctx, args) => {
    const columns = await ctx.db
      .query("columns")
      .withIndex("by_board", (q) => q.eq("boardId", args.boardId))
      .collect();

    return columns.sort((a, b) => a.order - b.order);
  },
});

// Update column details
export const updateColumn = mutation({
  args: {
    columnId: v.id("columns"),
    name: v.optional(v.string()),
    color: v.optional(v.string()),
    wipLimit: v.optional(v.number()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { columnId, ...updates } = args;
    await ctx.db.patch(columnId, updates);
  },
});

// Reorder columns
export const reorderColumns = mutation({
  args: {
    columnOrders: v.array(
      v.object({
        columnId: v.id("columns"),
        order: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const item of args.columnOrders) {
      await ctx.db.patch(item.columnId, { order: item.order });
    }
  },
});

// Delete column
export const deleteColumn = mutation({
  args: { columnId: v.id("columns") },
  handler: async (ctx, args) => {
    // Delete all tasks in column
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_column", (q) => q.eq("columnId", args.columnId))
      .collect();

    for (const task of tasks) {
      await ctx.db.delete(task._id);
    }

    await ctx.db.delete(args.columnId);
  },
});
