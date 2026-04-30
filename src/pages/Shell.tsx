import type { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logout } from "@/api/auth";
import { useIdleTimeout } from "@/hooks/useIdleTimeout";
import { useTelemetrySocket } from "@/hooks/useTelemetrySocket";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/Button";

export function Shell({ children }: { children: ReactNode }): JSX.Element {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const clear = useAuthStore((state) => state.clear);

  useTelemetrySocket(Boolean(user));
  useIdleTimeout(user?.role, () => {
    void logout().finally(() => {
      clear();
      navigate("/login");
    });
  });

  const signOut = () => {
    void logout().finally(() => {
      clear();
      navigate("/login");
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-brand-blue-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-3 text-lg font-bold text-brand-blue-950">
            <span className="grid size-9 place-items-center bg-brand-blue-600 text-sm text-white">SG</span>
            <span>SUN-GRID Control</span>
          </Link>
          <nav className="flex items-center gap-2 text-sm">
            <NavLink
              className={({ isActive }) =>
                `px-3 py-2 font-semibold ${
                  isActive ? "bg-brand-blue-50 text-brand-blue-800" : "text-slate-600 hover:text-brand-blue-800"
                }`
              }
              to="/"
            >
              Dashboard
            </NavLink>
            {user?.role === "superadmin" && (
              <NavLink
                className={({ isActive }) =>
                  `px-3 py-2 font-semibold ${
                    isActive ? "bg-brand-blue-50 text-brand-blue-800" : "text-slate-600 hover:text-brand-blue-800"
                  }`
                }
                to="/admin"
              >
                Admin
              </NavLink>
            )}
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-slate-500 sm:block">{user?.username} / {user?.role}</span>
            <Button variant="ghost" onClick={signOut}>Logout</Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
