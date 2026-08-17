"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface CalendarDay {
  day: string;
  date: number;
}

const weekDays: CalendarDay[] = [
  { day: "MON", date: 11 },
  { day: "TUE", date: 12 },
  { day: "WED", date: 13 },
  { day: "THUR", date: 14 },
  { day: "FRI", date: 15 },
  { day: "SAT", date: 16 },
  { day: "SUN", date: 17 },
];

interface ScheduleEvent {
  id: string;
  time: string;
  title: string;
  subtitle: string;
  bgColor: string;
}

const mockEvents: ScheduleEvent[] = [
  {
    id: "1",
    time: "9AM - 10AM",
    title: "MEETING WITH MANAGER",
    subtitle: "New Project Discussion",
    bgColor: "#ff90e8",
  },
  {
    id: "2",
    time: "12PM - 2PM",
    title: "MEETING WITH DEVELOPERS",
    subtitle: "Design Exploration",
    bgColor: "#a5f3fc",
  },
  {
    id: "3",
    time: "3.30PM - 4.30PM",
    title: "CLIENT DEMO & REVIEW",
    subtitle: "Kando Kanban Prototype",
    bgColor: "#ffc700",
  },
];

export function DailyScheduleWidget() {
  const [selectedDate, setSelectedDate] = useState<number>(14);

  return (
    <div className="border-3 border-black bg-[#a5f3fc]/20 p-5 shadow-neo select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b-3 border-black pb-3">
        <div className="flex items-center gap-2">
          <Clock className="size-4 stroke-[3] text-black" />
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-black">
            Daily Schedules For You
          </h3>
        </div>
        <span className="text-xs font-bold text-neutral-600">
          December, 2023
        </span>
      </div>

      {/* Horizontal Day Selector Pills */}
      <div className="mt-4 grid grid-cols-7 gap-1.5 text-center">
        {weekDays.map((item) => {
          const isSelected = item.date === selectedDate;
          return (
            <button
              key={item.date}
              onClick={() => setSelectedDate(item.date)}
              className={cn(
                "flex flex-col items-center justify-center border-2 border-black p-1.5 transition-all cursor-pointer",
                isSelected
                  ? "bg-black text-white shadow-neo-sm translate-y-[-2px]"
                  : "bg-white text-black hover:bg-neutral-100"
              )}
            >
              <span className="text-[9px] font-black uppercase tracking-widest">
                {item.day}
              </span>
              <span className="text-sm font-black">{item.date}</span>
            </button>
          );
        })}
      </div>

      {/* Scheduled Time Blocks */}
      <div className="mt-4 space-y-3">
        {mockEvents.map((evt) => (
          <div
            key={evt.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between border-2 border-black p-3.5 shadow-neo-sm transition-all hover:bg-white"
            style={{ backgroundColor: evt.bgColor }}
          >
            <div className="flex items-center gap-3">
              <span className="border-2 border-black bg-white px-2 py-1 text-xs font-black text-black shadow-neo-sm">
                {evt.time}
              </span>
              <div>
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-black">
                  {evt.title}
                </h4>
                <p className="text-[10px] font-bold text-neutral-700">
                  {evt.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
