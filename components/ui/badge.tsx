import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "group/badge inline-flex items-center justify-center border-2 border-black px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wider shadow-neo-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black select-none",
  {
    variants: {
      variant: {
        default: "bg-[#ff90e8] text-black",
        primary: "bg-[#ff90e8] text-black",
        secondary: "bg-[#ffc700] text-black",
        mint: "bg-[#00e599] text-black",
        purple: "bg-[#7c3aed] text-white",
        blue: "bg-[#5465ff] text-white",
        coral: "bg-[#ff6b6b] text-white",
        cyan: "bg-[#a5f3fc] text-black",
        dark: "bg-black text-white",
        destructive: "bg-[#ff6b6b] text-white",
        outline: "bg-[#fffdf6] text-black",
        ghost:
          "border-transparent bg-transparent text-black hover:border-black",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
