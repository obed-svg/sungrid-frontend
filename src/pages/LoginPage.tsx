import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";

interface LoginForm {
  username: string;
  password: string;
}

export function LoginPage(): JSX.Element {
  const navigate = useNavigate();
  const { login } = useAuth();
  const user = useAuthStore((state) => state.user);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit } = useForm<LoginForm>();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const submit = handleSubmit((values) => {
    setError(null);
    login.mutate(values, {
      onSuccess: () => navigate("/"),
      onError: (err) => setError(err instanceof Error ? err.message : "Login failed"),
    });
  });

  return (
    <div className="grid min-h-screen place-items-center bg-brand-blue-50 px-4">
      <form onSubmit={submit} className="panel w-full max-w-sm p-6">
        <img
          src="/branding/solenium-logo.png"
          alt="Solenium"
          className="h-16 w-auto object-contain"
        />
        <h1 className="mt-6 text-2xl font-bold text-brand-blue-950">SUN-GRID Control</h1>
        <p className="mt-2 text-sm text-slate-500">Secure operator access</p>
        <label className="mt-6 block">
          <span className="label">Username</span>
          <input className="field mt-2" autoComplete="username" {...register("username", { required: true })} />
        </label>
        <label className="mt-4 block">
          <span className="label">Password</span>
          <input className="field mt-2" type="password" autoComplete="current-password" {...register("password", { required: true })} />
        </label>
        {error && <p className="mt-4 border border-red-800 bg-red-950 p-3 text-sm text-red-100">{error}</p>}
        <Button className="mt-6 w-full" disabled={login.isPending} type="submit">
          {login.isPending ? "Signing in" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
