import * as React from "react";
import { cn } from "@/lib/utils";

export interface StickerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "starburst" | "tape" | "badge" | "sparkle" | "default";
  color?: "pink" | "yellow" | "mint" | "purple" | "blue" | "coral" | "cyan";
  rotation?: number;
}

const colorClasses = {
  pink: "bg-[#ff90e8] text-black",
  yellow: "bg-[#ffc700] text-black",
  mint: "bg-[#00e599] text-black",
  purple: "bg-[#7c3aed] text-white",
  blue: "bg-[#5465ff] text-white",
  coral: "bg-[#ff6b6b] text-white",
  cyan: "bg-[#a5f3fc] text-black",
};

export function Sticker({
  variant = "starburst",
  color = "yellow",
  rotation = -4,
  className,
  children,
  ...props
}: StickerProps) {
  const rotationStyle = { transform: `rotate(${rotation}deg)` };

  if (variant === "starburst") {
    return (
      <div
        className={cn(
          "inline-flex select-none items-center justify-center border-3 border-black p-3 font-extrabold text-xs uppercase tracking-wider shadow-neo",
          colorClasses[color],
          className
        )}
        style={rotationStyle}
        {...props}
      >
        <svg className="mr-1.5 size-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 0l3.09 8.26L24 12l-8.91 3.74L12 24l-3.09-8.26L0 12l8.91-3.74z" />
        </svg>
        {children || "STIKR!"}
      </div>
    );
  }

  if (variant === "tape") {
    return (
      <div
        className={cn(
          "inline-block select-none border-y-2 border-black/30 bg-amber-100/80 px-4 py-1 font-mono text-xs text-neutral-800 shadow-sm backdrop-blur-sm opacity-90",
          className
        )}
        style={rotationStyle}
        {...props}
      >
        {children || "// CONFIDENTIAL"}
      </div>
    );
  }

  if (variant === "badge") {
    return (
      <div
        className={cn(
          "inline-flex select-none items-center justify-center rounded-full border-3 border-black px-4 py-1.5 font-black text-xs uppercase tracking-widest shadow-neo-sm",
          colorClasses[color],
          className
        )}
        style={rotationStyle}
        {...props}
      >
        {children || "VERIFIED ★"}
      </div>
    );
  }

  if (variant === "sparkle") {
    return (
      <div
        className={cn("inline-block select-none", className)}
        style={rotationStyle}
        {...props}
      >
        <svg className="size-8 fill-black" viewBox="0 0 24 24">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex select-none items-center justify-center border-2 border-black px-3 py-1 font-bold text-xs shadow-neo-sm",
        colorClasses[color],
        className
      )}
      style={rotationStyle}
      {...props}
    >
      {children || "KANDO"}
    </div>
  );
}
