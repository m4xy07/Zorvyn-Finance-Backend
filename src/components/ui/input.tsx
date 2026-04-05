import * as React from "react";

import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-11 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

