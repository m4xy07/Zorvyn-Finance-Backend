import * as React from "react";

import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-10 w-full rounded-xl border border-[var(--border)] bg-white px-3 text-sm text-[#202519] placeholder:text-[#99a08f] shadow-[0_1px_1px_rgba(17,24,39,0.03)] transition focus:border-[#8bb2e6] focus:outline-none focus:ring-2 focus:ring-[#dce9fb]",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
