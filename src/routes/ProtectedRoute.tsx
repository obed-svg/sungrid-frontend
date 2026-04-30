import { Navigate, Outlet } from "react-router-dom";
import type { Role } from "@/api/types";
import { useAuthStore } from "@/store/authStore";

export function ProtectedRoute({ role = "viewer" }: { role?: Role }): JSX.Element {
  const user = useAuthStore((state) => state.user);
  const hasRole = useAuthStore((state) => state.hasRole);

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!hasRole(role)) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

