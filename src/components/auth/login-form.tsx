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
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-md rounded-3xl border border-[var(--border)] bg-white p-7 shadow-[0_1px_2px_rgba(17,24,39,0.06),0_40px_80px_-45px_rgba(17,24,39,0.35)]"
    >
      <div className="mb-6">
        <p className="eyebrow">Zorvyn Finance</p>
        <h1 className="mt-2 text-2xl font-semibold text-[#1b2117]">Sign in to continue</h1>
        <p className="mt-2 text-sm text-[#66705f]">Secure workspace for role-based financial operations.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-[#6d7567]">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-[#6d7567]">Password</label>
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
    </motion.form>
  );
}
