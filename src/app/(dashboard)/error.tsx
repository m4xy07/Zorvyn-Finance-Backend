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
    <div className="rounded-2xl border border-rose-500/30 bg-rose-900/10 p-5">
      <h2 className="text-lg font-semibold text-rose-200">Something went wrong</h2>
      <p className="mt-2 text-sm text-rose-100/80">{error.message || "Unexpected error"}</p>
      <Button className="mt-4" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}

