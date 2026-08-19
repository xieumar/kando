"use client";

import React, { useState } from "react";
import { X, Save, Palette, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const colorOptions = [
  { name: "Yellow", value: "#ffc700" },
  { name: "Pink", value: "#ff90e8" },
  { name: "Purple", value: "#7c3aed" },
  { name: "Mint", value: "#00e599" },
  { name: "Blue", value: "#5465ff" },
  { name: "Cyan", value: "#a5f3fc" },
  { name: "Coral", value: "#ff6b6b" },
];

export function EditColumnModal({
  isOpen,
  column,
  onClose,
  onUpdateColumn,
}: {
  isOpen: boolean;
  column: KanbanColumnData | null;
  onClose: () => void;
  onUpdateColumn: (
    columnId: string,
    name: string,
    color: string,
    wipLimit?: number
  ) => void;
}) {
  const [name, setName] = useState(column?.name || "");
  const [color, setColor] = useState(column?.color || "#ff90e8");
  const [wipLimit, setWipLimit] = useState<string>(
    column?.wipLimit ? String(column.wipLimit) : ""
  );

  if (!isOpen || !column) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedWip = wipLimit.trim() ? parseInt(wipLimit, 10) : undefined;
    onUpdateColumn(column._id, name.trim(), color, parsedWip);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-md border-4 border-black bg-[#fffdf6] p-6 shadow-neo-xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-3 border-black pb-3">
          <div className="flex items-center gap-2">
            <div
              className="flex size-7 items-center justify-center border-2 border-black font-black text-xs text-black shadow-neo-sm"
              style={{ backgroundColor: color }}
            >
              ✎
            </div>
            <h2 className="font-black text-base uppercase tracking-wider text-black">
              Edit Column
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex size-7 items-center justify-center border-2 border-black bg-white shadow-neo-sm hover:bg-[#ff6b6b] hover:text-white transition-colors"
          >
            <X className="size-4 stroke-[3]" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Column Name Input */}
          <div>
            <label className="block text-xs font-black uppercase text-black mb-1">
              Column Title <span className="text-[#ff6b6b]">*</span>
            </label>
            <Input
              type="text"
              required
              placeholder="e.g. In Review, Testing, QA..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-2 font-bold"
            />
          </div>

          {/* Color Selection Palette */}
          <div>
            <label className="flex items-center gap-1 text-xs font-black uppercase text-black mb-2">
              <Palette className="size-3.5 stroke-[2.5]" />
              <span>Column Accent Color</span>
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {colorOptions.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`size-8 border-2 border-black shadow-neo-sm transition-all ${
                    color === c.value
                      ? "scale-110 ring-3 ring-black font-black"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* WIP Limit Input */}
          <div>
            <label className="flex items-center gap-1 text-xs font-black uppercase text-black mb-1">
              <ShieldAlert className="size-3.5 stroke-[2.5]" />
              <span>WIP Limit (Optional)</span>
            </label>
            <Input
              type="number"
              min="1"
              max="99"
              placeholder="e.g. 5 (Leave empty for no limit)"
              value={wipLimit}
              onChange={(e) => setWipLimit(e.target.value)}
              className="border-2 font-bold"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 border-t-2 border-black pt-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-9 px-4 text-xs font-extrabold border-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="h-9 px-4 text-xs font-extrabold gap-1.5 border-2"
            >
              <Save className="size-4 stroke-[2.5]" />
              <span>Save Changes</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
