import * as React from "react";

import { cn } from "@/lib/utils";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "h-10 w-full rounded-xl border border-[var(--border)] bg-white px-3 text-sm text-[#202519] shadow-[0_1px_1px_rgba(17,24,39,0.03)] transition focus:border-[#8bb2e6] focus:outline-none focus:ring-2 focus:ring-[#dce9fb]",
          className,
        )}
        {...props}
      />
    );
  },
);

Select.displayName = "Select";
