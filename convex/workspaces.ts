import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create workspace + default board + columns
export const createWorkspace = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    icon: v.string(),
    accentColor: v.string(),
    ownerId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Check if slug already exists
    const existing = await ctx.db
      .query("workspaces")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (existing) {
      throw new Error(`Workspace slug "${args.slug}" is already taken.`);
    }

    const now = Date.now();
    const workspaceId = await ctx.db.insert("workspaces", {
      name: args.name,
      slug: args.slug,
      description: args.description,
      icon: args.icon,
      accentColor: args.accentColor,
      ownerId: args.ownerId,
      createdAt: now,
    });

    // Add owner as workspace member
    await ctx.db.insert("workspaceMembers", {
      workspaceId,
      userId: args.ownerId,
      role: "owner",
      joinedAt: now,
    });

    // Create default board for workspace
    const boardId = await ctx.db.insert("boards", {
      workspaceId,
      name: "Main Kanban",
      description: "Default project board",
      icon: "📋",
      accentColor: "#FF90E8",
      isArchived: false,
      order: 1,
      createdAt: now,
    });

    // Create default columns
    const defaultColumns = [
      { name: "Backlog", color: "#FFC700", order: 1, wipLimit: 10 },
      { name: "In Progress", color: "#FF90E8", order: 2, wipLimit: 5 },
      { name: "Review", color: "#7C3AED", order: 3, wipLimit: 5 },
      { name: "Done", color: "#00E599", order: 4 },
    ];

    for (const col of defaultColumns) {
      await ctx.db.insert("columns", {
        boardId,
        name: col.name,
        color: col.color,
        wipLimit: col.wipLimit,
        order: col.order,
        createdAt: now,
      });
    }

    // Log activity
    await ctx.db.insert("activityLogs", {
      workspaceId,
      boardId,
      actorId: args.ownerId,
      action: "WORKSPACE_CREATED",
      details: `Created workspace "${args.name}"`,
      createdAt: now,
    });

    return { workspaceId, boardId };
  },
});

// Fetch workspace by slug
export const getWorkspaceBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const workspace = await ctx.db
      .query("workspaces")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!workspace) return null;

    const owner = await ctx.db.get(workspace.ownerId);
    const members = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspace._id))
      .collect();

    return {
      ...workspace,
      owner,
      memberCount: members.length,
    };
  },
});

// List workspaces for user
export const getUserWorkspaces = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const memberships = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const workspaces = await Promise.all(
      memberships.map(async (m) => {
        const ws = await ctx.db.get(m.workspaceId);
        return ws ? { ...ws, memberRole: m.role } : null;
      })
    );

    return workspaces.filter(Boolean);
  },
});

// Update workspace settings
export const updateWorkspace = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
    accentColor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { workspaceId, ...updates } = args;
    await ctx.db.patch(workspaceId, updates);
  },
});
