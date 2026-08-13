import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full border-3 border-black bg-[#fffdf6] px-4 py-2 text-sm font-bold text-black shadow-neo-sm transition-all placeholder:text-neutral-400 focus:bg-white focus:shadow-neo focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Input };
