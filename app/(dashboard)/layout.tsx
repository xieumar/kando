import React from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";

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
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-[#fffdf6] p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
