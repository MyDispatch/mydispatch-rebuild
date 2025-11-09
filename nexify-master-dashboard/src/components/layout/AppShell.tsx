import { Outlet } from "react-router-dom";

import { SidebarNavigation } from "@/components/layout/SidebarNavigation";
import { Topbar } from "@/components/layout/Topbar";

function AppShell() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <SidebarNavigation />
      <div className="flex w-full flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-slate-950">
          <div className="mx-auto w-full max-w-7xl px-4 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppShell;
