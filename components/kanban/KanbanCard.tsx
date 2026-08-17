"use client";

import React, { useState, useMemo } from "react";
import {
  CheckSquare,
  MessageSquare,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function KanbanCard({
  task,
  onClick,
  onDragStart,
  onDragEnd,
}: {
  task: KanbanTask;
  onClick?: (task: KanbanTask) => void;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void;
}) {
  const [now] = useState(() => Date.now());

  const isOverdue = task.dueDate ? task.dueDate < now : false;

  const formattedDueDate = useMemo(() => {
    if (!task.dueDate) return null;
    return new Date(task.dueDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }, [task.dueDate]);

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={() => onClick?.(task)}
      className="group relative flex w-full box-border shrink-0 flex-col border-2 border-black bg-white p-3.5 shadow-neo-sm hover:shadow-neo transition-all cursor-grab active:cursor-grabbing select-none"
      style={{
        borderLeftWidth: task.coverColor ? "6px" : "2px",
        borderLeftColor: task.coverColor || "#000000",
      }}
    >
      {/* Top Header: Priority Badge & Task ID */}
      <div className="flex items-center justify-between mb-2">
        <Badge
          variant={
            task.priority === "urgent"
              ? "coral"
              : task.priority === "high"
                ? "default"
                : task.priority === "medium"
                  ? "secondary"
                  : "mint"
          }
          className="text-[9px] px-1.5 py-0 font-extrabold uppercase"
        >
          {task.priority}
        </Badge>
        <span className="font-mono text-[10px] font-bold text-neutral-500">
          #{task._id.slice(-4)}
        </span>
      </div>

      {/* Task Title */}
      <h4 className="font-extrabold text-xs text-black leading-snug group-hover:text-[#7c3aed] transition-colors">
        {task.title}
      </h4>

      {/* Task Description */}
      {task.description && (
        <p className="mt-1 text-[11px] text-neutral-600 line-clamp-2 font-medium">
          {task.description}
        </p>
      )}

      {/* Tag Pills */}
      {task.tags && task.tags.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="border border-black bg-[#fffdf6] px-1.5 py-0.2 text-[9px] font-bold uppercase text-black"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Card Footer Meta & Avatars */}
      <div className="mt-3 flex items-center justify-between border-t border-neutral-200 pt-2 text-[10px] font-bold text-neutral-700">
        {/* Indicators: Subtasks, Comments, Due Date */}
        <div className="flex items-center gap-2.5">
          {/* Subtask Progress */}
          {task.subtaskCount !== undefined && task.subtaskCount > 0 && (
            <div
              className={cn(
                "flex items-center gap-1",
                task.completedSubtaskCount === task.subtaskCount
                  ? "text-[#00e599]"
                  : "text-neutral-700"
              )}
              title="Subtasks completed"
            >
              <CheckSquare className="size-3 stroke-[2.5]" />
              <span>
                {task.completedSubtaskCount || 0}/{task.subtaskCount}
              </span>
            </div>
          )}

          {/* Comment Count */}
          {task.commentCount !== undefined && task.commentCount > 0 && (
            <div
              className="flex items-center gap-1 text-neutral-700"
              title="Comments"
            >
              <MessageSquare className="size-3 stroke-[2.5]" />
              <span>{task.commentCount}</span>
            </div>
          )}

          {/* Due Date */}
          {formattedDueDate && (
            <div
              className={cn(
                "flex items-center gap-1 px-1 py-0.5 border border-black",
                isOverdue
                  ? "bg-[#ff6b6b] text-white"
                  : "bg-neutral-100 text-black"
              )}
              title={isOverdue ? "Overdue task!" : "Due date"}
            >
              {isOverdue ? (
                <AlertCircle className="size-3 stroke-[2.5]" />
              ) : (
                <Calendar className="size-3 stroke-[2.5]" />
              )}
              <span>{formattedDueDate}</span>
            </div>
          )}
        </div>

        {/* Stacked Assignee Avatars */}
        {task.assignees && task.assignees.length > 0 && (
          <div className="flex items-center -space-x-1.5">
            {task.assignees.map((user) => (
              <div
                key={user._id}
                className="flex size-5 items-center justify-center border border-black bg-[#ff90e8] font-black text-[9px] text-black shadow-neo-sm"
                title={user.name}
              >
                {user.name[0]}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
