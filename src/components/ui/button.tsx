"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-indigo-500 text-white shadow-[0_8px_30px_rgba(79,70,229,0.35)] hover:bg-indigo-400 disabled:bg-indigo-800",
  secondary:
    "bg-slate-800 text-slate-100 border border-slate-700 hover:bg-slate-700",
  ghost: "bg-transparent text-slate-200 hover:bg-slate-800",
  danger: "bg-rose-600 text-white hover:bg-rose-500",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
          variantStyles[variant],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

