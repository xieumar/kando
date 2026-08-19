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
  columnColor = "#000000",
  onClick,
  onDragStart,
  onDragEnd,
}: {
  task: KanbanTask;
  columnColor?: string;
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
      className="group relative flex w-full box-border shrink-0 flex-col border-2 border-black bg-white p-2.5 shadow-neo-sm hover:shadow-neo transition-all cursor-grab active:cursor-grabbing select-none"
      style={{
        borderLeftWidth: "5px",
        borderLeftColor: columnColor,
      }}
    >
      {/* Top Header: Priority Badge & Task ID */}
      <div className="flex items-center justify-between mb-1">
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
          className="text-[8px] px-1 py-0 font-black uppercase"
        >
          {task.priority}
        </Badge>
        <span className="font-mono text-[9px] font-bold text-neutral-400">
          #{task._id.slice(-4)}
        </span>
      </div>

      {/* Task Title */}
      <h4 className="font-extrabold text-xs text-black leading-snug group-hover:text-[#7c3aed] transition-colors">
        {task.title}
      </h4>

      {/* Task Description (Compact single line) */}
      {task.description && (
        <p className="mt-0.5 text-[10px] text-neutral-600 line-clamp-1 font-medium">
          {task.description}
        </p>
      )}

      {/* Tag Pills */}
      {task.tags && task.tags.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="border border-black bg-[#fffdf6] px-1 py-0 text-[8px] font-extrabold uppercase text-black"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Card Footer Meta & Avatars */}
      <div className="mt-2 flex items-center justify-between border-t border-neutral-200 pt-1.5 text-[9px] font-bold text-neutral-700">
        {/* Indicators: Subtasks, Comments, Due Date */}
        <div className="flex items-center gap-2">
          {/* Subtask Progress */}
          {task.subtaskCount !== undefined && task.subtaskCount > 0 && (
            <div
              className={cn(
                "flex items-center gap-0.5",
                task.completedSubtaskCount === task.subtaskCount
                  ? "text-[#00e599]"
                  : "text-neutral-700"
              )}
              title="Subtasks completed"
            >
              <CheckSquare className="size-2.5 stroke-[2.5]" />
              <span>
                {task.completedSubtaskCount || 0}/{task.subtaskCount}
              </span>
            </div>
          )}

          {/* Comment Count */}
          {task.commentCount !== undefined && task.commentCount > 0 && (
            <div
              className="flex items-center gap-0.5 text-neutral-700"
              title="Comments"
            >
              <MessageSquare className="size-2.5 stroke-[2.5]" />
              <span>{task.commentCount}</span>
            </div>
          )}

          {/* Due Date */}
          {formattedDueDate && (
            <div
              className={cn(
                "flex items-center gap-0.5 px-1 py-0 border border-black text-[8px]",
                isOverdue
                  ? "bg-[#ff6b6b] text-white"
                  : "bg-neutral-100 text-black"
              )}
              title={isOverdue ? "Overdue task!" : "Due date"}
            >
              {isOverdue ? (
                <AlertCircle className="size-2.5 stroke-[2.5]" />
              ) : (
                <Calendar className="size-2.5 stroke-[2.5]" />
              )}
              <span>{formattedDueDate}</span>
            </div>
          )}
        </div>

        {/* Stacked Assignee Avatars */}
        {task.assignees && task.assignees.length > 0 && (
          <div className="flex items-center -space-x-1">
            {task.assignees.map((user) => (
              <div
                key={user._id}
                className="flex size-4.5 items-center justify-center border border-black bg-[#ff90e8] font-black text-[8px] text-black shadow-neo-sm"
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
