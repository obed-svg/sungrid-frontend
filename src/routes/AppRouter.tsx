import { Navigate, Route, Routes } from "react-router-dom";
import { AdminAuditPage } from "@/pages/AdminAuditPage";
import { AdminPage } from "@/pages/AdminPage";
import { AdminProjectsPage } from "@/pages/AdminProjectsPage";
import { AdminUsersPage } from "@/pages/AdminUsersPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { HistoryPage } from "@/pages/HistoryPage";
import { LoginPage } from "@/pages/LoginPage";
import { ProjectDetailPage } from "@/pages/ProjectDetailPage";
import { ProtectedRoute } from "./ProtectedRoute";

export function AppRouter(): JSX.Element {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
        <Route path="/projects/:projectId/history" element={<HistoryPage />} />
      </Route>
      <Route element={<ProtectedRoute role="superadmin" />}>
        <Route path="/admin" element={<AdminPage />}>
          <Route index element={<Navigate to="/admin/users" replace />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="projects" element={<AdminProjectsPage />} />
          <Route path="audit" element={<AdminAuditPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

