"use client";

import React, { useState } from "react";
import {
  Plus,
  MoreHorizontal,
  AlertTriangle,
  Edit3,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function KanbanColumn({
  column,
  children,
  isDraggedOver,
  onAddTask,
  onEditColumn,
  onDeleteColumn,
  onDragOver,
  onDragLeave,
  onDrop,
}: {
  column: KanbanColumnData;
  children?: React.ReactNode;
  isDraggedOver?: boolean;
  onAddTask?: (columnId: string) => void;
  onEditColumn?: (column: KanbanColumnData) => void;
  onDeleteColumn?: (columnId: string) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const taskCount = column.tasks?.length || 0;
  const isWipExceeded = column.wipLimit ? taskCount > column.wipLimit : false;

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={cn(
        "w-72 shrink-0 border-3 border-black bg-[#fffdf6] p-3 shadow-neo flex flex-col h-full max-h-full overflow-hidden transition-all select-none min-h-0",
        isWipExceeded && "ring-3 ring-[#ff6b6b] shadow-neo-lg",
        isDraggedOver && "bg-[#00e599]/15 border-dashed ring-3 ring-black"
      )}
    >
      {/* Column Header Bar */}
      <div className="relative border-b-2 border-black pb-2 mb-2 shrink-0">
        <div className="flex items-center justify-between">
          {/* Color Indicator & Title & Count */}
          <div className="flex items-center gap-2">
            <span
              className="size-3 border-2 border-black shadow-neo-sm"
              style={{ backgroundColor: column.color }}
            />
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-black">
              {column.name}
            </h3>
            <span
              className={cn(
                "flex size-4.5 items-center justify-center border-2 border-black text-[9px] font-black shadow-neo-sm",
                isWipExceeded
                  ? "bg-[#ff6b6b] text-white"
                  : "bg-black text-white"
              )}
            >
              {taskCount}
            </span>
          </div>

          {/* Action Triggers */}
          <div className="flex items-center gap-1">
            {/* Quick Add Task Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onAddTask) onAddTask(column._id);
              }}
              className="flex size-6 items-center justify-center border-2 border-black bg-white shadow-neo-sm hover:bg-[#ff90e8] active:translate-x-[1px] active:translate-y-[1px] transition-colors cursor-pointer"
              title="Add task to column"
            >
              <Plus className="size-3.5 stroke-[3] text-black" />
            </button>

            {/* Column Options Menu Button */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
                className="flex size-6 items-center justify-center border-2 border-black bg-white shadow-neo-sm hover:bg-neutral-100 active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                title="Column menu"
              >
                <MoreHorizontal className="size-3.5 stroke-[2.5] text-black" />
              </button>

              {/* Action Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 top-8 z-30 w-40 border-3 border-black bg-white p-1.5 shadow-neo">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      if (onEditColumn) onEditColumn(column);
                    }}
                    className="flex w-full items-center gap-2 px-2 py-1.5 text-xs font-extrabold uppercase hover:bg-[#ff90e8] text-black cursor-pointer"
                  >
                    <Edit3 className="size-3.5 stroke-[2.5]" />
                    <span>Edit Column</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      if (onDeleteColumn) onDeleteColumn(column._id);
                    }}
                    className="flex w-full items-center gap-2 px-2 py-1.5 text-xs font-extrabold uppercase hover:bg-[#ff6b6b] hover:text-white text-black cursor-pointer"
                  >
                    <Trash2 className="size-3.5 stroke-[2.5]" />
                    <span>Delete Column</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* WIP Limit Alert Banner */}
        {column.wipLimit && (
          <div className="mt-1 flex items-center justify-between">
            <span className="text-[9px] font-extrabold uppercase text-neutral-600">
              WIP Limit: {taskCount}/{column.wipLimit}
            </span>

            {isWipExceeded && (
              <Badge variant="coral" className="gap-1 text-[8px] px-1 py-0">
                <AlertTriangle className="size-2.5 stroke-[3]" />
                <span>EXCEEDED!</span>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Task Cards Stack Container */}
      <div className="flex-1 space-y-2 overflow-y-auto overflow-x-hidden p-0.5 w-full min-h-0">
        {children}
      </div>
    </div>
  );
}
