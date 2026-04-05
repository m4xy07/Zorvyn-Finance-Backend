"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-2xl border border-[var(--danger)] bg-[var(--danger-soft)] p-5">
      <h2 className="text-lg font-semibold text-[var(--danger)]">Something went wrong</h2>
      <p className="mt-2 text-sm text-[var(--muted)]">{error.message || "Unexpected error"}</p>
      <Button className="mt-4" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
