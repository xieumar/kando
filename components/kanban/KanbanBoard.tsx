"use client";

import React, { useState } from "react";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("all");

  const handleTaskMove = (
    taskId: string,
    targetColumnId: string,
    newOrder: number
  ) => {
    // Optimistic local state update
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

    if (onTaskMove) {
      onTaskMove(taskId, targetColumnId, newOrder);
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
    <div className="flex flex-col h-full space-y-4 select-none">
      {/* Board Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-3 border-black bg-[#fffdf6] p-4 shadow-neo">
        {/* Title & Icon */}
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center border-3 border-black bg-[#ff90e8] text-xl shadow-neo-sm">
            {boardState.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-xl uppercase tracking-wider text-black">
                {boardState.name}
              </h1>
            </div>
            <p className="text-xs font-bold text-neutral-600">
              {boardState.description}
            </p>
          </div>
        </div>

        {/* Board Actions & Filters */}
        <div className="flex items-center gap-3">
          {/* Search Filter */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 size-4 stroke-[3] text-black" />
            <input
              type="text"
              placeholder="Search board tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-44 border-2 border-black bg-white pl-9 pr-3 text-xs font-bold text-black shadow-neo-sm focus:w-60 focus:outline-none transition-all placeholder:text-neutral-400"
            />
          </div>

          {/* Priority Filter */}
          <div className="flex items-center border-2 border-black bg-white px-2 py-1 shadow-neo-sm">
            <SlidersHorizontal className="size-3.5 stroke-[2.5] text-black mr-1.5" />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="bg-transparent text-xs font-extrabold uppercase text-black focus:outline-none cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Add Column Trigger */}
          <Button
            size="sm"
            variant="outline"
            onClick={onAddColumn}
            className="h-9 text-xs gap-1 border-2"
          >
            <Plus className="size-4 stroke-[3]" />
            <span>Add Column</span>
          </Button>

          {/* Add Task Trigger */}
          <Button
            size="sm"
            variant="primary"
            onClick={() => onAddTask && onAddTask()}
            className="h-9 text-xs gap-1 border-2"
          >
            <Plus className="size-4 stroke-[3]" />
            <span>New Task</span>
          </Button>
        </div>
      </div>

      {/* Kanban Columns Horizontal Canvas */}
      <div className="flex flex-1 gap-6 overflow-x-auto pb-4 pt-1 items-start min-h-[calc(100vh-220px)]">
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
