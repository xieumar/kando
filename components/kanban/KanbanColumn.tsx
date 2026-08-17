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
  onAddTask,
  onEditColumn,
  onDeleteColumn,
}: {
  column: KanbanColumnData;
  children?: React.ReactNode;
  onAddTask?: (columnId: string) => void;
  onEditColumn?: (column: KanbanColumnData) => void;
  onDeleteColumn?: (columnId: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const taskCount = column.tasks?.length || 0;
  const isWipExceeded = column.wipLimit ? taskCount > column.wipLimit : false;

  return (
    <div
      className={cn(
        "w-80 shrink-0 border-3 border-black bg-[#fffdf6] p-4 shadow-neo flex flex-col max-h-[calc(100vh-240px)] transition-all select-none",
        isWipExceeded && "ring-3 ring-[#ff6b6b] shadow-neo-lg"
      )}
    >
      {/* Column Header Bar */}
      <div className="relative border-b-3 border-black pb-3 mb-3">
        {/* Color Bar Accent */}
        <div
          className="h-2.5 w-full border-2 border-black mb-2 shadow-neo-sm"
          style={{ backgroundColor: column.color }}
        />

        <div className="flex items-center justify-between">
          {/* Title & Count */}
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-black">
              {column.name}
            </h3>
            <span
              className={cn(
                "flex size-5 items-center justify-center border-2 border-black text-[10px] font-black shadow-neo-sm",
                isWipExceeded
                  ? "bg-[#ff6b6b] text-white"
                  : "bg-black text-white"
              )}
            >
              {taskCount}
            </span>
          </div>

          {/* Action Triggers */}
          <div className="flex items-center gap-1.5">
            {/* Quick Add Task Button */}
            <button
              onClick={() => {
                if (onAddTask) onAddTask(column._id);
              }}
              className="flex size-7 items-center justify-center border-2 border-black bg-white shadow-neo-sm hover:bg-[#ff90e8] active:translate-x-[1px] active:translate-y-[1px] transition-colors"
              title="Add task to column"
            >
              <Plus className="size-4 stroke-[3] text-black" />
            </button>

            {/* Column Options Menu Button */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex size-7 items-center justify-center border-2 border-black bg-white shadow-neo-sm hover:bg-neutral-100 active:translate-x-[1px] active:translate-y-[1px]"
                title="Column menu"
              >
                <MoreHorizontal className="size-4 stroke-[2.5] text-black" />
              </button>

              {/* Action Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 top-9 z-30 w-44 border-3 border-black bg-white p-1.5 shadow-neo">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      if (onEditColumn) onEditColumn(column);
                    }}
                    className="flex w-full items-center gap-2 px-2.5 py-1.5 text-xs font-extrabold uppercase hover:bg-[#ff90e8] text-black"
                  >
                    <Edit3 className="size-3.5 stroke-[2.5]" />
                    <span>Edit Column</span>
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      if (onDeleteColumn) onDeleteColumn(column._id);
                    }}
                    className="flex w-full items-center gap-2 px-2.5 py-1.5 text-xs font-extrabold uppercase hover:bg-[#ff6b6b] hover:text-white text-black"
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
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-neutral-600">
              WIP Limit: {taskCount}/{column.wipLimit}
            </span>

            {isWipExceeded && (
              <Badge variant="coral" className="gap-1 text-[9px] px-1.5 py-0">
                <AlertTriangle className="size-3 stroke-[3]" />
                <span>EXCEEDED!</span>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Task Cards Stack Container */}
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">{children}</div>
    </div>
  );
}
