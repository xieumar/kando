"use client";

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Plus,
  Search,
  SlidersHorizontal,
  Kanban,
  List,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { KanbanColumn } from "@/components/kanban/KanbanColumn";
import { KanbanCard } from "@/components/kanban/KanbanCard";
import { useKanbanDragAndDrop } from "@/hooks/useKanbanDragAndDrop";
import { mockBoard } from "@/lib/mock-data";

export function KanbanBoard({
  initialBoard = mockBoard,
  onAddTask,
  onAddColumn,
  onTaskMove,
}: KanbanBoardProps & {
  onTaskMove?: (
    taskId: string,
    targetColumnId: string,
    newOrder: number
  ) => void;
}) {
  const [boardState, setBoardState] = useState<KanbanBoardData>(initialBoard);
  const [activeView, setActiveView] = useState<"board" | "list" | "timeline">(
    "board"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("all");

  // Convex real-time optimistic task movement mutation
  const moveTaskMutation = useMutation(api.tasks.moveTask);

  const handleTaskMove = async (
    taskId: string,
    targetColumnId: string,
    newOrder: number
  ) => {
    // 1. Optimistic Local Client State Update for instant UI reordering
    setBoardState((prev) => {
      if (!prev.columns) return prev;

      let movedTask: KanbanTask | undefined;

      // Remove task from source column
      const updatedColumns = prev.columns.map((col) => {
        const found = col.tasks?.find((t) => t._id === taskId);
        if (found) {
          movedTask = { ...found, columnId: targetColumnId, order: newOrder };
          return {
            ...col,
            tasks: col.tasks?.filter((t) => t._id !== taskId),
          };
        }
        return col;
      });

      // Insert task into target column
      if (movedTask) {
        return {
          ...prev,
          columns: updatedColumns.map((col) => {
            if (col._id === targetColumnId) {
              return {
                ...col,
                tasks: [...(col.tasks || []), movedTask!],
              };
            }
            return col;
          }),
        };
      }

      return prev;
    });

    // 2. Trigger parent callback if provided
    if (onTaskMove) {
      onTaskMove(taskId, targetColumnId, newOrder);
    }

    // 3. Persist mutation to Convex Realtime Database (if valid Convex ID)
    try {
      if (
        taskId &&
        !taskId.startsWith("task_") &&
        !targetColumnId.startsWith("col_")
      ) {
        await moveTaskMutation({
          taskId: taskId as any,
          targetColumnId: targetColumnId as any,
          newOrder,
        });
      }
    } catch (error) {
      console.warn(
        "Convex sync in offline/mock mode for task movement:",
        error
      );
    }
  };

  const {
    draggedOverColumnId,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useKanbanDragAndDrop({ onTaskMove: handleTaskMove });

  return (
    <div className="flex flex-col flex-1 h-full w-full overflow-hidden select-none space-y-3 min-h-0">
      {/* ClickUp-Style Compact Top Toolbar */}
      <div className="flex flex-col gap-2 border-b-2 border-black pb-2 shrink-0">
        {/* Row 1: Breadcrumb, View Tabs & Main Actions */}
        <div className="flex items-center justify-between gap-3">
          {/* Left: Title & View Tabs */}
          <div className="flex items-center gap-4">
            {/* Board Title & Icon */}
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center border-2 border-black bg-[#ff90e8] text-sm font-black shadow-neo-sm">
                {boardState.icon}
              </span>
              <h1 className="font-black text-sm uppercase tracking-wider text-black">
                {boardState.name}
              </h1>
            </div>

            {/* View Selector Tabs (ClickUp Style) */}
            <div className="flex items-center border-2 border-black bg-white shadow-neo-sm">
              <button
                onClick={() => setActiveView("board")}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-black uppercase transition-colors ${
                  activeView === "board"
                    ? "bg-[#ffc700] text-black"
                    : "hover:bg-neutral-100 text-neutral-700"
                }`}
              >
                <Kanban className="size-3.5 stroke-[2.5]" />
                <span>Board</span>
              </button>
              <button
                onClick={() => setActiveView("list")}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-black uppercase border-l-2 border-black transition-colors ${
                  activeView === "list"
                    ? "bg-[#ffc700] text-black"
                    : "hover:bg-neutral-100 text-neutral-700"
                }`}
              >
                <List className="size-3.5 stroke-[2.5]" />
                <span>List</span>
              </button>
              <button
                onClick={() => setActiveView("timeline")}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-black uppercase border-l-2 border-black transition-colors ${
                  activeView === "timeline"
                    ? "bg-[#ffc700] text-black"
                    : "hover:bg-neutral-100 text-neutral-700"
                }`}
              >
                <Calendar className="size-3.5 stroke-[2.5]" />
                <span>Timeline</span>
              </button>
            </div>
          </div>

          {/* Right: Board CTAs */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onAddColumn}
              className="h-8 px-2.5 text-xs gap-1 border-2"
            >
              <Plus className="size-3.5 stroke-[3]" />
              <span>Add Column</span>
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => onAddTask && onAddTask()}
              className="h-8 px-3 text-xs gap-1 border-2"
            >
              <Plus className="size-3.5 stroke-[3]" />
              <span>New Task</span>
            </Button>
          </div>
        </div>

        {/* Row 2: Slim Filter Bar (ClickUp Style) */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-2 size-3.5 stroke-[3] text-black" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-7 w-36 border-2 border-black bg-white pl-8 pr-2 text-xs font-bold text-black shadow-neo-sm focus:w-48 focus:outline-none transition-all placeholder:text-neutral-400"
              />
            </div>

            {/* Priority Filter */}
            <div className="flex items-center border-2 border-black bg-white px-2 py-0.5 shadow-neo-sm h-7">
              <SlidersHorizontal className="size-3 stroke-[2.5] text-black mr-1" />
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="bg-transparent text-[10px] font-extrabold uppercase text-black focus:outline-none cursor-pointer"
              >
                <option value="all">Group: Status</option>
                <option value="urgent">Priority: Urgent</option>
                <option value="high">Priority: High</option>
                <option value="medium">Priority: Medium</option>
                <option value="low">Priority: Low</option>
              </select>
            </div>
          </div>

          <span className="text-[11px] font-bold text-neutral-500">
            {boardState.columns?.reduce(
              (acc, col) => acc + (col.tasks?.length || 0),
              0
            )}{" "}
            Tasks Total
          </span>
        </div>
      </div>

      {/* ClickUp-Style Full Height Horizontal Kanban Canvas */}
      <div className="flex flex-1 gap-5 overflow-x-auto overflow-y-hidden pb-4 pt-1 px-1 items-stretch min-h-0">
        {boardState.columns?.map((column) => (
          <KanbanColumn
            key={column._id}
            column={column}
            isDraggedOver={draggedOverColumnId === column._id}
            onAddTask={onAddTask}
            onDragOver={(e) => handleDragOver(e, column._id)}
            onDragLeave={(e) => handleDragLeave(e, column._id)}
            onDrop={(e) => handleDrop(e, column._id)}
          >
            {column.tasks?.map((task) => (
              <KanbanCard
                key={task._id}
                task={task}
                columnColor={column.color}
                onDragStart={(e) => handleDragStart(e, task._id)}
                onDragEnd={handleDragEnd}
              />
            ))}
          </KanbanColumn>
        ))}
      </div>
    </div>
  );
}
