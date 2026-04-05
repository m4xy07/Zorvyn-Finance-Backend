import * as React from "react";

import { cn } from "@/lib/utils";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "min-h-[112px] w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-[#202519] placeholder:text-[#99a08f] shadow-[0_1px_1px_rgba(17,24,39,0.03)] transition focus:border-[#8bb2e6] focus:outline-none focus:ring-2 focus:ring-[#dce9fb]",
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
