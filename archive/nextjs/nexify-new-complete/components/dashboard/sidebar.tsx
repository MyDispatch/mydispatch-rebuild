"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, FileText, Home, Settings, Users, User, Truck, CalendarCheck, ClipboardList } from "lucide-react";
import { useState } from "react";

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [mgmtOpen, setMgmtOpen] = useState(true);

  const NavLink = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`flex items-center gap-2 rounded px-3 py-2 text-sm transition-colors hover:bg-muted ${
          active ? "bg-muted text-foreground" : "text-muted-foreground"
        }`}
        aria-current={active ? "page" : undefined}
      >
        <Icon size={16} />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-72 translate-x-[-110%] border-r bg-background p-3 shadow md:static md:translate-x-0 ${
        open ? "translate-x-0" : ""
      }`}
      role="navigation"
      aria-label="Hauptnavigation"
    >
      <div className="mb-4 flex items-center justify-between px-2">
        <Link href="/" className="font-semibold text-primary">MyDispatch</Link>
        <button
          className="rounded px-2 py-1 text-xs text-muted-foreground md:hidden"
          onClick={onClose}
          aria-label="Sidebar schließen"
        >
          Schließen
        </button>
      </div>

      <div className="grid gap-1">
        <NavLink href="/dashboard" icon={Home} label="Dashboard" />

        <button
          className="flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted"
          onClick={() => setMgmtOpen((v) => !v)}
          aria-expanded={mgmtOpen}
          aria-controls="mgmt-group"
        >
          <span className="flex items-center gap-2"><ClipboardList size={16} /><span>Management</span></span>
          <ChevronDown className={`transition ${mgmtOpen ? "rotate-180" : "rotate-0"}`} />
        </button>
        <div id="mgmt-group" className={`${mgmtOpen ? "grid" : "hidden"} gap-1 pl-5"`}>
          <NavLink href="/bookings" icon={CalendarCheck} label="Buchungen" />
          <NavLink href="/drivers" icon={Truck} label="Fahrer" />
          <NavLink href="/customer" icon={Users} label="Kunden" />
        </div>

        <div className="mt-2 grid gap-1">
          <NavLink href="/entrepreneur" icon={User} label="Unternehmer" />
          <NavLink href="/settings" icon={Settings} label="Einstellungen" />
          <NavLink href="/legal/terms" icon={FileText} label="AGB" />
          <NavLink href="/legal/privacy" icon={FileText} label="Datenschutz" />
        </div>
      </div>
    </aside>
  );
}

