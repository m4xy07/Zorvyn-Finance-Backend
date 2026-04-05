import { ThemeToggle } from "@/components/theme/theme-toggle";
import { LoginForm } from "@/components/auth/login-form";
import { redirectIfAuthenticated } from "@/lib/server-auth";

export default async function LoginPage() {
  await redirectIfAuthenticated();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute left-[-140px] top-[-120px] h-[360px] w-[360px] rounded-full bg-[color:color-mix(in_srgb,var(--accent),transparent_78%)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-180px] right-[-120px] h-[420px] w-[420px] rounded-full bg-[color:rgba(70,120,255,0.2)] blur-3xl" />

      <div className="absolute right-5 top-5">
        <ThemeToggle />
      </div>

      <LoginForm />
    </div>
  );
}
