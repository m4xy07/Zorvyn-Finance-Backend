import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-indigo-400/20 bg-slate-900/60 p-4 shadow-[0_12px_35px_rgba(15,23,42,0.45)] backdrop-blur",
        className,
      )}
      {...props}
    />
  );
}

