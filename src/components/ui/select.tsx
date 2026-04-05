import * as React from "react";

import { cn } from "@/lib/utils";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 text-sm text-[var(--text)] transition focus:border-[color:var(--accent)] focus:outline-none focus:ring-2 focus:ring-[color:color-mix(in_srgb,var(--accent),transparent_72%)]",
          className,
        )}
        {...props}
      />
    );
  },
);

Select.displayName = "Select";
