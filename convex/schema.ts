import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    avatarUrl: v.optional(v.string()),
    tokenIdentifier: v.string(),
    role: v.union(v.literal("admin"), v.literal("member")),
    createdAt: v.number(),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_email", ["email"]),

  workspaces: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    icon: v.string(),
    accentColor: v.string(),
    ownerId: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_owner", ["ownerId"]),

  workspaceMembers: defineTable({
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
    role: v.union(
      v.literal("owner"),
      v.literal("admin"),
      v.literal("member"),
      v.literal("viewer")
    ),
    joinedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_user", ["userId"])
    .index("by_workspace_user", ["workspaceId", "userId"]),

  boards: defineTable({
    workspaceId: v.id("workspaces"),
    name: v.string(),
    description: v.optional(v.string()),
    icon: v.string(),
    accentColor: v.string(),
    isArchived: v.boolean(),
    order: v.number(),
    createdAt: v.number(),
  }).index("by_workspace", ["workspaceId"]),

  columns: defineTable({
    boardId: v.id("boards"),
    name: v.string(),
    color: v.string(),
    wipLimit: v.optional(v.number()),
    order: v.number(),
    createdAt: v.number(),
  })
    .index("by_board", ["boardId"])
    .index("by_board_order", ["boardId", "order"]),

  tasks: defineTable({
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
    status: v.string(),
    assigneeIds: v.array(v.id("users")),
    tags: v.array(v.string()),
    dueDate: v.optional(v.number()),
    order: v.number(),
    coverColor: v.optional(v.string()),
    estimatedHours: v.optional(v.number()),
    loggedHours: v.optional(v.number()),
    isArchived: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_board", ["boardId"])
    .index("by_column", ["columnId"])
    .index("by_column_order", ["columnId", "order"]),

  subtasks: defineTable({
    taskId: v.id("tasks"),
    title: v.string(),
    isCompleted: v.boolean(),
    order: v.number(),
  }).index("by_task", ["taskId"]),

  comments: defineTable({
    taskId: v.id("tasks"),
    authorId: v.id("users"),
    content: v.string(),
    createdAt: v.number(),
  }).index("by_task", ["taskId"]),

  activityLogs: defineTable({
    workspaceId: v.id("workspaces"),
    boardId: v.id("boards"),
    taskId: v.optional(v.id("tasks")),
    actorId: v.id("users"),
    action: v.string(),
    details: v.string(),
    createdAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_board", ["boardId"]),
});
