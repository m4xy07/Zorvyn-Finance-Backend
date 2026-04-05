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
    <div className="rounded-2xl border border-[#efb6b6] bg-[#fff4f4] p-5">
      <h2 className="text-lg font-semibold text-[#9e3737]">Something went wrong</h2>
      <p className="mt-2 text-sm text-[#8f4b4b]">{error.message || "Unexpected error"}</p>
      <Button className="mt-4" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
