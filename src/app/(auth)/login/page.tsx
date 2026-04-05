import { LoginForm } from "@/components/auth/login-form";
import { redirectIfAuthenticated } from "@/lib/server-auth";

export default async function LoginPage() {
  await redirectIfAuthenticated();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.18),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(79,70,229,0.12),transparent_45%),#020617] px-4">
      <LoginForm />
    </div>
  );
}

