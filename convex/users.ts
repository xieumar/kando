import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Sync or create user record
export const storeUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    tokenIdentifier: v.string(),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", args.tokenIdentifier)
      )
      .unique();

    if (user !== null) {
      if (
        user.name !== args.name ||
        user.avatarUrl !== args.avatarUrl ||
        user.email !== args.email
      ) {
        await ctx.db.patch(user._id, {
          name: args.name,
          email: args.email,
          avatarUrl: args.avatarUrl,
        });
      }
      return user._id;
    }

    return await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      tokenIdentifier: args.tokenIdentifier,
      avatarUrl: args.avatarUrl,
      role: "member",
      createdAt: Date.now(),
    });
  },
});

// Fetch user by token identifier
export const getUserByToken = query({
  args: { tokenIdentifier: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", args.tokenIdentifier)
      )
      .unique();
  },
});

// Fetch user by ID
export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});
