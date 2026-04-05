import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: ReactNode;
  variant?: "neutral" | "success" | "warning" | "danger" | "info";
  className?: string;
}

const variantStyles = {
  neutral: "bg-[color:color-mix(in_srgb,var(--surface-muted),black_6%)] text-[var(--muted)] border-[var(--border)]",
  success: "bg-[var(--success-soft)] text-[color:color-mix(in_srgb,var(--accent),white_8%)] border-[color:color-mix(in_srgb,var(--accent),black_48%)]",
  warning: "bg-[var(--warning-soft)] text-[color:color-mix(in_srgb,var(--warning),white_8%)] border-[color:color-mix(in_srgb,var(--warning),black_42%)]",
  danger: "bg-[var(--danger-soft)] text-[color:color-mix(in_srgb,var(--danger),white_8%)] border-[color:color-mix(in_srgb,var(--danger),black_45%)]",
  info: "bg-[var(--info-soft)] text-[var(--info)] border-[color:color-mix(in_srgb,var(--info),black_44%)]",
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
