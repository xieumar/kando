"use client";

import React from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { TaskUpdatesTable } from "@/components/dashboard/TaskUpdatesTable";
import { TeamAssetsWidget } from "@/components/dashboard/TeamAssetsWidget";
import { DailyScheduleWidget } from "@/components/dashboard/DailyScheduleWidget";
import { CheckSquare, Folder, Clock, Users } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="border-3 border-black bg-[#ff90e8] p-6 shadow-neo">
        <h1 className="font-black text-2xl uppercase tracking-wider text-black">
          Dashboard Overview
        </h1>
        <p className="font-bold text-sm text-black">
          Welcome back, Josh! Let&apos;s be productive today.
        </p>
      </div>

      {/* Metric Stat Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Tasks Assigned"
          value="10"
          change="+10% more this week"
          icon={CheckSquare}
          bgColor="#a5f3fc"
        />
        <StatCard
          title="Projects Active"
          value="05"
          change="+2 new this month"
          icon={Folder}
          bgColor="#fffdf6"
        />
        <StatCard
          title="Hours Logged"
          value="08"
          change="32.5 hrs remaining"
          icon={Clock}
          bgColor="#ff90e8"
        />
        <StatCard
          title="Team Members"
          value="14"
          change="3 active now"
          icon={Users}
          bgColor="#00e599"
        />
      </div>

      {/* Main Grid: Task Updates & Team Assets / Schedule */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Columns: Recent Task Updates Table */}
        <div className="lg:col-span-2">
          <TaskUpdatesTable />
        </div>

        {/* Right 1 Column: Team Assets & Daily Schedule */}
        <div className="space-y-6 lg:col-span-1">
          <TeamAssetsWidget />
          <DailyScheduleWidget />
        </div>
      </div>
    </div>
  );
}
