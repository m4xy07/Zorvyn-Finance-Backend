import * as React from "react";

import { cn } from "@/lib/utils";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "h-11 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 text-sm text-slate-100 focus:border-indigo-400 focus:outline-none",
          className,
        )}
        {...props}
      />
    );
  },
);

Select.displayName = "Select";

