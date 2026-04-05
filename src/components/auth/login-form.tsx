"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("admin@zorvyn.com");
  const [password, setPassword] = useState("Admin@12345");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Unable to sign in");
      }

      toast.success("Welcome back");
      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md rounded-2xl border border-indigo-400/20 bg-slate-900/70 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.5)] backdrop-blur"
    >
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.16em] text-indigo-300/80">Zorvyn Finance</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-100">Sign in to your workspace</h1>
        <p className="mt-2 text-sm text-slate-400">Role-based access secured with JWT sessions.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-xs uppercase tracking-[0.14em] text-slate-400">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-xs uppercase tracking-[0.14em] text-slate-400">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
            required
          />
        </div>
      </div>

      <Button type="submit" className="mt-6 w-full" disabled={loading}>
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <Spinner />
            Signing in
          </span>
        ) : (
          "Sign in"
        )}
      </Button>

      <p className="mt-4 text-xs text-slate-500">
        Demo users are seeded via `npm run seed` and managed by admin-only controls.
      </p>
    </motion.form>
  );
}

