"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Kanban,
  FolderKanban,
  CalendarDays,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  color: string;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    color: "#ff90e8",
  },
  {
    label: "Kanban Board",
    href: "/workspace/default/board",
    icon: Kanban,
    color: "#ffc700",
  },
  {
    label: "Projects",
    href: "/projects",
    icon: FolderKanban,
    color: "#00e599",
  },
  {
    label: "Schedule",
    href: "/schedule",
    icon: CalendarDays,
    color: "#a5f3fc",
  },
  {
    label: "Team",
    href: "/team",
    icon: Users,
    color: "#5465ff",
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    color: "#7c3aed",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r-3 border-black bg-[#fffdf6] transition-all duration-200 ease-in-out select-none z-30",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Top Nav Header & Workspace Switcher (h-16 matching Topbar height) */}
      <div className="flex h-16 items-center border-b-3 border-black bg-[#fffdf6] px-3">
        <div className="flex w-full items-center justify-between gap-2">
          <div
            onClick={() => collapsed && setCollapsed(false)}
            className={cn(
              "flex flex-1 items-center gap-2.5 border-2 border-black bg-[#fffdf6] px-2 py-1 shadow-neo-sm transition-all",
              collapsed
                ? "justify-center p-1.5 cursor-pointer hover:bg-white active:translate-x-[1px] active:translate-y-[1px]"
                : "cursor-pointer hover:bg-white"
            )}
            title={
              collapsed ? "Click K to expand sidebar" : "Workspace options"
            }
          >
            <div className="flex size-7 shrink-0 items-center justify-center border-2 border-black bg-[#ff90e8] font-black text-xs text-black shadow-neo-sm">
              K
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-extrabold text-[11px] uppercase tracking-wider truncate leading-tight text-black">
                  Kando Studio
                </span>
              </div>
            )}
            {!collapsed && (
              <ChevronsUpDown className="size-3.5 shrink-0 text-neutral-600 stroke-[2.5]" />
            )}
          </div>

          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="flex size-7 shrink-0 items-center justify-center border-2 border-black bg-[#fffdf6] shadow-neo-sm hover:bg-white active:translate-x-[1px] active:translate-y-[1px]"
              title="Collapse sidebar"
            >
              <ChevronLeft className="size-4 stroke-[3]" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1.5 p-3 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 border-2 border-transparent px-3 py-2.5 font-extrabold uppercase text-xs tracking-wider transition-all",
                isActive
                  ? "border-black shadow-neo-sm text-black"
                  : "hover:border-black hover:bg-white hover:shadow-neo-sm text-neutral-700",
                collapsed && "justify-center px-2"
              )}
              style={{
                backgroundColor: isActive ? item.color : undefined,
              }}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={cn(
                  "size-5 shrink-0 stroke-[2.5]",
                  isActive ? "text-black" : "group-hover:text-black"
                )}
              />
              {!collapsed && (
                <span className="flex-1 truncate">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Settings & Expand Button when Collapsed */}
      <div className="border-t-3 border-black p-3 space-y-1.5 bg-neutral-50">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 border-2 border-transparent px-3 py-2 font-bold uppercase text-xs tracking-wider hover:border-black hover:bg-white hover:shadow-neo-sm text-neutral-700",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? "Settings" : undefined}
        >
          <Settings className="size-5 shrink-0 stroke-[2.5]" />
          {!collapsed && <span>Settings</span>}
        </Link>

        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="flex w-full items-center justify-center border-2 border-black bg-[#fffdf6] p-2 shadow-neo-sm hover:bg-white active:translate-x-[1px] active:translate-y-[1px]"
            title="Expand sidebar"
          >
            <ChevronRight className="size-4 stroke-[3]" />
          </button>
        )}
      </div>
    </aside>
  );
}
