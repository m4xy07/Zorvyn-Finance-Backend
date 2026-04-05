import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md rounded-2xl border border-indigo-400/20 bg-slate-900/60 p-6 text-center">
        <h1 className="text-2xl font-semibold text-slate-100">Not Found</h1>
        <p className="mt-2 text-sm text-slate-400">
          The page or record you are trying to access does not exist.
        </p>
        <Link href="/dashboard" className="mt-5 inline-block">
          <Button>Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}

