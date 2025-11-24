import { NavLink } from "react-router-dom";

import { useAuthStore } from "@/stores/authStore";

const navItems = [
  { label: "Command Center", to: "/dashboard", icon: "⚡" },
  { label: "Einstellungen", to: "/settings", icon: "⚙️" },
  { label: "Audit", to: "/audit", icon: "🛡️" },
  { label: "Plugins", to: "/plugins", icon: "🧩" }
];

export function SidebarNavigation() {
  const session = useAuthStore((state) => state.session);

  return (
    <aside className="hidden w-64 flex-shrink-0 border-r border-slate-800 bg-slate-950/80 lg:flex">
      <div className="flex h-full w-full flex-col">
        <div className="flex items-center gap-3 border-b border-slate-800 px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500 text-lg">NM</div>
          <div>
            <p className="text-sm font-semibold text-slate-100">NeXifyAI MASTER</p>
            <p className="text-xs text-slate-400">Master-Admin Console</p>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-primary-500/20 text-primary-100"
                    : "text-slate-300 hover:bg-slate-800/70 hover:text-slate-100"
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-slate-800 px-6 py-4 text-xs text-slate-400">
          <p>{session?.email ?? "Unbekannt"}</p>
          <p>Rollen: {session?.roles.join(", ") ?? "-"}</p>
        </div>
      </div>
    </aside>
  );
}
