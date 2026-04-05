import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md rounded-3xl border border-[var(--border)] bg-white p-7 text-center shadow-[0_1px_2px_rgba(17,24,39,0.06),0_35px_70px_-48px_rgba(17,24,39,0.3)]">
        <p className="eyebrow">404</p>
        <h1 className="mt-2 text-2xl font-semibold text-[#1d2319]">Page Not Found</h1>
        <p className="mt-2 text-sm text-[#68705f]">
          The page or record you are trying to access does not exist.
        </p>
        <Link href="/dashboard" className="mt-5 inline-block">
          <Button>Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
