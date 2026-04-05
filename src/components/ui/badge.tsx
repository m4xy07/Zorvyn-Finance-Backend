import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: ReactNode;
  variant?: "neutral" | "success" | "warning" | "danger" | "info";
  className?: string;
}

const variantStyles = {
  neutral: "bg-[#f0f2ec] text-[#4e5648] border-[#dde1d6]",
  success: "bg-[#e7f6ee] text-[#137748] border-[#bde6cf]",
  warning: "bg-[#fff3df] text-[#94611a] border-[#f0d4a2]",
  danger: "bg-[#fff0f0] text-[#9e3737] border-[#efb5b5]",
  info: "bg-[#ebf2fd] text-[#2d5a95] border-[#c8d9f5]",
};

export function Badge({ children, variant = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
