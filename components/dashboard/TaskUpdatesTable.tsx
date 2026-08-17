"use client";

import React, { useState } from "react";
import { Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TaskUpdate {
  sn: number;
  project: string;
  taskName: string;
  assignedOn: string;
  assignedBy: {
    name: string;
    avatarBg: string;
  };
  dueDate: string;
  status: "Inprogress" | "Done" | "Pending";
}

const mockUpdates: TaskUpdate[] = [
  {
    sn: 1,
    project: "Let's Vibe",
    taskName: "Banner Design",
    assignedOn: "Dec 15, 2023",
    assignedBy: { name: "Daniel", avatarBg: "#00e599" },
    dueDate: "Dec 17, 2023",
    status: "Inprogress",
  },
  {
    sn: 2,
    project: "Ceevest",
    taskName: "Login Design",
    assignedOn: "Dec 15, 2023",
    assignedBy: { name: "Daniel", avatarBg: "#00e599" },
    dueDate: "Dec 17, 2023",
    status: "Inprogress",
  },
  {
    sn: 3,
    project: "Me Mart",
    taskName: "Cart Design",
    assignedOn: "Dec 15, 2023",
    assignedBy: { name: "Daniel", avatarBg: "#00e599" },
    dueDate: "Dec 19, 2023",
    status: "Inprogress",
  },
  {
    sn: 4,
    project: "Kando App",
    taskName: "Convex Realtime Sync",
    assignedOn: "Dec 18, 2023",
    assignedBy: { name: "Josh", avatarBg: "#ff90e8" },
    dueDate: "Dec 21, 2023",
    status: "Done",
  },
  {
    sn: 5,
    project: "Laross Site",
    taskName: "Pricing Tier Cards",
    assignedOn: "Dec 20, 2023",
    assignedBy: { name: "Sarah", avatarBg: "#ffc700" },
    dueDate: "Dec 23, 2023",
    status: "Pending",
  },
];

export function TaskUpdatesTable() {
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const filteredTasks =
    filterStatus === "All"
      ? mockUpdates
      : mockUpdates.filter((t) => t.status === filterStatus);

  return (
    <div className="border-3 border-black bg-[#fffdf6] p-5 shadow-neo select-none">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-3 border-black pb-4">
        <div>
          <h3 className="font-extrabold text-base uppercase tracking-wider text-black">
            Tasks Updates
          </h3>
          <span className="text-xs font-bold text-neutral-600">
            December, 2023
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Filter Selector */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-9 cursor-pointer appearance-none border-2 border-black bg-white px-3 pr-8 text-xs font-extrabold uppercase tracking-wider text-black shadow-neo-sm focus:outline-none"
            >
              <option value="All">All Status</option>
              <option value="Inprogress">Inprogress</option>
              <option value="Done">Done</option>
              <option value="Pending">Pending</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-2.5 size-4 stroke-[3] text-black" />
          </div>

          <Button
            size="sm"
            variant="primary"
            className="h-9 px-3 text-xs gap-1"
          >
            <Plus className="size-4 stroke-[3]" />
            <span>Add Task</span>
          </Button>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-black text-xs font-black uppercase tracking-wider text-black">
              <th className="py-2.5 px-3">S/N</th>
              <th className="py-2.5 px-3">Project</th>
              <th className="py-2.5 px-3">Task Name</th>
              <th className="py-2.5 px-3">Assigned On</th>
              <th className="py-2.5 px-3">Assigned By</th>
              <th className="py-2.5 px-3">Due Date</th>
              <th className="py-2.5 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-neutral-200 text-xs font-bold text-black">
            {filteredTasks.map((task) => (
              <tr
                key={task.sn}
                className="hover:bg-neutral-50 transition-colors"
              >
                <td className="py-3 px-3 font-mono font-black">{task.sn}</td>
                <td className="py-3 px-3 font-extrabold">{task.project}</td>
                <td className="py-3 px-3">{task.taskName}</td>
                <td className="py-3 px-3 text-neutral-600">
                  {task.assignedOn}
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex size-6 items-center justify-center border-2 border-black font-black text-[10px] text-black"
                      style={{ backgroundColor: task.assignedBy.avatarBg }}
                    >
                      {task.assignedBy.name[0]}
                    </div>
                    <span>{task.assignedBy.name}</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-neutral-600">{task.dueDate}</td>
                <td className="py-3 px-3 text-center">
                  <Badge
                    variant={
                      task.status === "Done"
                        ? "mint"
                        : task.status === "Inprogress"
                          ? "default"
                          : "secondary"
                    }
                  >
                    {task.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
