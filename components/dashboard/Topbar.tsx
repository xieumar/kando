"use client";

import React from "react";
import { Search, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b-3 border-black bg-[#fffdf6] px-6 select-none">
      {/* Left / Search Input */}
      <div className="relative flex max-w-md flex-1 items-center">
        <div className="relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-black">
            <Search className="size-4 stroke-[3]" />
          </div>
          <input
            type="text"
            placeholder="Search tasks, projects, or documents..."
            className="h-10 w-full border-2 border-black bg-white pl-9 pr-4 text-xs font-bold text-black shadow-neo-sm placeholder:text-neutral-500 focus:bg-white focus:outline-none focus:ring-0"
          />
        </div>
      </div>

      {/* Right: Quick Action Buttons & Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Add Task Button (h-9 matching settings size-9) */}
        <Button
          variant="primary"
          className="hidden sm:flex h-9 px-4 text-xs gap-1.5 border-2 shadow-neo-sm active:translate-x-[2px] active:translate-y-[2px]"
        >
          <Plus className="size-4 stroke-[3]" />
          <span>Add Task</span>
        </Button>

        {/* Settings Button (size-9 = h-9 w-9) */}
        <button
          className="flex size-9 items-center justify-center border-2 border-black bg-[#fffdf6] shadow-neo-sm hover:bg-white active:translate-x-[1px] active:translate-y-[1px]"
          title="Quick Settings"
        >
          <Settings className="size-4.5 stroke-[2.5] text-black" />
        </button>

        {/* User Profile Avatar (h-9 matching settings) */}
        <div className="flex h-9 items-center gap-2 border-2 border-black bg-white px-1.5 shadow-neo-sm cursor-pointer hover:bg-neutral-50">
          <div className="flex size-6 items-center justify-center border border-black bg-[#00e599] font-black text-xs text-black">
            JM
          </div>
          <div className="hidden md:flex flex-col pr-1">
            <span className="font-extrabold text-xs uppercase leading-none text-black">
              Josh Maia
            </span>
            <span className="text-[9px] font-bold text-neutral-500 leading-tight">
              UI/UX Designer
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
