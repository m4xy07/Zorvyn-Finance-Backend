"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "border border-[#0f172a] bg-[#111827] text-white hover:bg-[#1f2937] shadow-[0_1px_2px_rgba(15,23,42,0.18)]",
  secondary:
    "border border-[var(--border)] bg-white text-[#1e2418] hover:bg-[#f6f7f3] shadow-[0_1px_0_rgba(17,24,39,0.04)]",
  ghost: "border border-transparent bg-transparent text-[#4c5345] hover:bg-[#eef1e8]",
  danger: "border border-[#ef9a9a] bg-[#fff6f6] text-[#912e2e] hover:bg-[#ffeded]",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7ea8df] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f6ef] disabled:cursor-not-allowed disabled:opacity-55",
          variantStyles[variant],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
