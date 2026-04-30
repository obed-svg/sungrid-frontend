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
      <nav className="mt-5 flex gap-2 border-b border-zinc-800">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `px-4 py-3 text-sm ${isActive ? "border-b-2 border-cyan-500 text-white" : "text-zinc-400"}`
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

