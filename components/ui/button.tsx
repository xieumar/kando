import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex cursor-pointer select-none items-center justify-center whitespace-nowrap font-bold uppercase tracking-wider transition-all duration-100 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-3 border-black bg-[#ff90e8] text-black shadow-neo hover:bg-[#ff75e3] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
        primary:
          "border-3 border-black bg-[#ff90e8] text-black shadow-neo hover:bg-[#ff75e3] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
        secondary:
          "border-3 border-black bg-[#ffc700] text-black shadow-neo hover:bg-[#e6b300] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
        mint: "border-3 border-black bg-[#00e599] text-black shadow-neo hover:bg-[#00cc88] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
        purple:
          "border-3 border-black bg-[#7c3aed] text-white shadow-neo hover:bg-[#6d28d9] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
        blue: "border-3 border-black bg-[#5465ff] text-white shadow-neo hover:bg-[#3d50ff] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
        coral:
          "border-3 border-black bg-[#ff6b6b] text-white shadow-neo hover:bg-[#ff5252] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
        dark: "border-3 border-black bg-black text-white shadow-neo-pink hover:bg-neutral-900 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
        outline:
          "border-3 border-black bg-[#fffdf6] text-black shadow-neo hover:bg-neutral-100 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
        ghost:
          "border-2 border-transparent bg-transparent text-black hover:border-black hover:bg-[#fffdf6] active:translate-x-[2px] active:translate-y-[2px]",
        destructive:
          "border-3 border-black bg-[#ff6b6b] text-white shadow-neo hover:bg-[#ff5252] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
        link: "text-black underline underline-offset-4 hover:text-[#7c3aed]",
      },
      size: {
        default: "h-11 px-5 text-sm",
        sm: "h-8 border-2 px-3 text-xs shadow-neo-sm active:translate-x-[2px] active:translate-y-[2px]",
        lg: "h-14 border-4 px-8 text-base shadow-neo-lg active:translate-x-[6px] active:translate-y-[6px]",
        icon: "size-10 border-3 p-0 shadow-neo active:translate-x-[4px] active:translate-y-[4px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
