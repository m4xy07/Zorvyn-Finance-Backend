"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "border border-[color:var(--accent)] bg-[color:var(--accent)] text-[#02170b] hover:bg-[color:var(--accent-strong)] hover:border-[color:var(--accent-strong)]",
  secondary:
    "border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-muted)]",
  ghost: "border border-transparent bg-transparent text-[var(--muted)] hover:bg-[var(--surface-muted)]",
  danger:
    "border border-[color:color-mix(in_srgb,var(--danger),white_16%)] bg-[color:color-mix(in_srgb,var(--danger),black_70%)] text-[color:#ffdede] hover:bg-[color:color-mix(in_srgb,var(--danger),black_62%)]",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg)] disabled:cursor-not-allowed disabled:opacity-55",
          variantStyles[variant],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
