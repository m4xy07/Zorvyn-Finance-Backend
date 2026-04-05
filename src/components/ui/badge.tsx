import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: ReactNode;
  variant?: "neutral" | "success" | "warning" | "danger" | "info";
  className?: string;
}

const variantStyles = {
  neutral: "bg-slate-800 text-slate-200 border-slate-700",
  success: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  warning: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  danger: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  info: "bg-indigo-500/20 text-indigo-200 border-indigo-500/30",
};

export function Badge({ children, variant = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

