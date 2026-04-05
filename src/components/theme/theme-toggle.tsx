"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/components/theme/theme-provider";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-full border px-3 text-xs font-medium transition",
        "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--muted)] hover:border-[var(--border-strong)] hover:text-[var(--text)]",
      )}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <span
        className={cn(
          "relative inline-flex h-5 w-9 items-center rounded-full border transition",
          isDark
            ? "border-[color:color-mix(in_srgb,var(--accent),black_30%)] bg-[var(--accent-soft)]"
            : "border-[var(--border)] bg-[var(--surface)]",
        )}
      >
        <span
          className={cn(
            "absolute h-4 w-4 rounded-full bg-[var(--accent)] shadow transition",
            isDark ? "translate-x-[17px]" : "translate-x-[2px] bg-[var(--muted)]",
          )}
        />
      </span>
      {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
      {isDark ? "Light" : "Dark"}
    </button>
  );
}
