import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addComment = mutation({
  args: {
    taskId: v.id("tasks"),
    authorId: v.id("users"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const commentId = await ctx.db.insert("comments", {
      taskId: args.taskId,
      authorId: args.authorId,
      content: args.content,
      createdAt: Date.now(),
    });

    return commentId;
  },
});

export const getTaskComments = query({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_task", (q) => q.eq("taskId", args.taskId))
      .collect();

    const commentsWithAuthor = await Promise.all(
      comments.map(async (c) => {
        const author = await ctx.db.get(c.authorId);
        return {
          ...c,
          author,
        };
      })
    );

    return commentsWithAuthor.sort((a, b) => a.createdAt - b.createdAt);
  },
});
