"use client";

import React from "react";
import { Plus } from "lucide-react";

interface AssetGroup {
  id: string;
  name: string;
  count: number;
  iconBg: string;
  iconText: string;
  iconLabel: string;
  sharedAvatars: string[];
}

const mockAssets: AssetGroup[] = [
  {
    id: "figma",
    name: "Figma Links",
    count: 6,
    iconBg: "#ff90e8",
    iconText: "#000000",
    iconLabel: "F",
    sharedAvatars: ["D", "J", "S"],
  },
  {
    id: "word",
    name: "Word Documents",
    count: 21,
    iconBg: "#5465ff",
    iconText: "#ffffff",
    iconLabel: "W",
    sharedAvatars: ["A", "M", "K"],
  },
  {
    id: "excel",
    name: "Excel Documents",
    count: 23,
    iconBg: "#00e599",
    iconText: "#000000",
    iconLabel: "X",
    sharedAvatars: ["R", "L", "T"],
  },
];

export function TeamAssetsWidget() {
  return (
    <div className="border-3 border-black bg-[#00e599]/20 p-5 shadow-neo select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b-3 border-black pb-3">
        <h3 className="font-extrabold text-sm uppercase tracking-wider text-black">
          Team Assets & Documents
        </h3>
        <button
          className="flex size-7 items-center justify-center border-2 border-black bg-white shadow-neo-sm hover:bg-neutral-100 active:translate-x-[1px] active:translate-y-[1px]"
          title="Add asset"
        >
          <Plus className="size-4 stroke-[3] text-black" />
        </button>
      </div>

      {/* Asset Items List */}
      <div className="mt-4 space-y-3">
        {mockAssets.map((asset) => (
          <div
            key={asset.id}
            className="flex items-center justify-between border-2 border-black bg-[#fffdf6] p-3 shadow-neo-sm hover:bg-white transition-colors"
          >
            {/* Left: Icon & Count */}
            <div className="flex items-center gap-3">
              <div
                className="flex size-9 items-center justify-center border-2 border-black font-black text-base shadow-neo-sm"
                style={{
                  backgroundColor: asset.iconBg,
                  color: asset.iconText,
                }}
              >
                {asset.iconLabel}
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xs text-black">
                  {asset.name}
                </span>
                <span className="font-black text-xl leading-none text-black">
                  {asset.count}
                </span>
              </div>
            </div>

            {/* Right: Stacked Avatars */}
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] font-extrabold uppercase text-neutral-600">
                Shared With
              </span>
              <div className="flex items-center -space-x-2">
                {asset.sharedAvatars.map((av, idx) => (
                  <div
                    key={idx}
                    className="flex size-6 items-center justify-center border-2 border-black bg-white text-[10px] font-black text-black shadow-neo-sm"
                  >
                    {av}
                  </div>
                ))}
                <div className="flex size-6 items-center justify-center border-2 border-black bg-[#ffc700] text-[9px] font-black text-black shadow-neo-sm">
                  +2
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
