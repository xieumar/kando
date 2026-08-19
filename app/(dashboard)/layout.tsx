import React from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#fffdf6]">
      {/* Neobrutalist Navigation Sidebar */}
      <Sidebar />

      {/* Main Content View Container */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Top Header Bar */}
        <Topbar />

        {/* Dynamic Page Content Area */}
        <main className="flex flex-1 flex-col overflow-hidden bg-[#fffdf6] p-4 min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
}
