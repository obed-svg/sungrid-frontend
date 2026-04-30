import { NavLink, Outlet } from "react-router-dom";
import { Shell } from "./Shell";

const tabs = [
  { to: "/admin/users", label: "Users" },
  { to: "/admin/projects", label: "Projects" },
  { to: "/admin/audit", label: "Audit" },
];

export function AdminPage(): JSX.Element {
  return (
    <Shell>
      <h1 className="text-2xl font-bold">Admin</h1>
      <nav className="mt-5 flex gap-2 border-b border-brand-blue-200">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `px-4 py-3 text-sm font-semibold ${
                isActive
                  ? "border-b-2 border-brand-blue-600 text-brand-blue-950"
                  : "text-slate-500 hover:text-brand-blue-800"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-6">
        <Outlet />
      </div>
    </Shell>
  );
}

