"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ElementType;
  bgColor?: string;
  trendSparkline?: boolean;
  className?: string;
}

export function StatCard({
  title,
  value,
  change = "+10% more this week",
  icon: Icon,
  bgColor = "#a5f3fc",
  trendSparkline = true,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col justify-between border-3 border-black p-5 shadow-neo transition-all hover:-translate-y-0.5 hover:shadow-neo-lg select-none",
        className
      )}
      style={{ backgroundColor: bgColor }}
    >
      {/* Header: Icon & Big Number */}
      <div className="flex items-start justify-between">
        <div className="flex size-10 items-center justify-center border-2 border-black bg-white shadow-neo-sm">
          <Icon className="size-5 stroke-[2.5] text-black" />
        </div>
        <span className="font-black text-4xl tracking-tight text-black">
          {value}
        </span>
      </div>

      {/* Label & Trend */}
      <div className="mt-4 space-y-1">
        <h4 className="font-extrabold text-sm uppercase tracking-wider text-black">
          {title}
        </h4>
        <div className="flex items-center justify-between text-xs font-bold text-neutral-800">
          <span>{change}</span>
          {trendSparkline && (
            <TrendingUp className="size-4 stroke-[3] text-black" />
          )}
        </div>
      </div>

      {/* Decorative Sparkline Wave */}
      {trendSparkline && (
        <div className="mt-2 h-6 w-full overflow-hidden opacity-80">
          <svg
            className="h-full w-full"
            viewBox="0 0 100 25"
            preserveAspectRatio="none"
          >
            <path
              d="M0 20 Q 25 5, 50 15 T 100 8"
              fill="none"
              stroke="#000000"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
