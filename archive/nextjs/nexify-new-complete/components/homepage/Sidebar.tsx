"use client";
import Link from "next/link";

type SidebarProps = {
  open?: boolean;
  onClose?: () => void;
};

export function Sidebar({ open = false, onClose }: SidebarProps) {
  return (
    <aside
      className={
        "bg-white border-r w-14 shrink-0 h-full overflow-y-auto text-slate-600" +
        (open ? " fixed inset-y-0 left-0 z-40 md:relative" : " hidden md:block")
      }
      aria-label="Sekundäre Navigation"
      role="complementary"
    >
      {/* Offcanvas overlay for mobile */}
      {open && (
        <button
          type="button"
          aria-label="Sidebar schließen"
          onClick={onClose}
          className="md:hidden fixed inset-0 bg-black/30"
        />
      )}

      <div className="h-full flex flex-col items-center">
        <div className="w-full h-16 border-b flex items-center justify-center">
          <span className="sr-only">Navigation</span>
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" className="text-slate-500">
            <circle cx="12" cy="12" r="10" fill="currentColor" className="opacity-10" />
            <path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        <nav className="flex-1 w-full py-3 space-y-1" aria-label="Funktionen">
          {[
            { href: "/bookings", label: "Buchungen", icon: (
              <path d="M3 7h18M5 11h14M7 15h10" />
            ) },
            { href: "/clients", label: "Kunden", icon: (
              <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0" />
            ) },
            { href: "/drivers", label: "Fahrer", icon: (
              <path d="M5 19h14l-1-7H6l-1 7Zm3-7V7h8v5" />
            ) },
            { href: "/vehicles", label: "Fahrzeuge", icon: (
              <path d="M3 13h18l-2-5H5l-2 5Zm2 5h2m10 0h2" />
            ) },
            { href: "/invoices", label: "Rechnungen", icon: (
              <path d="M7 4h10v16l-5-3-5 3V4Zm2 4h6M9 10h6M9 14h6" />
            ) },
            { href: "/analytics", label: "Analytics", icon: (
              <path d="M5 17v-4m4 4V7m4 10V9m4 8V5" />
            ) },
            { href: "/settings", label: "Einstellungen", icon: (
              <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8-3a8 8 0 1 1-16 0 8 8 0 0 1 16 0" />
            ) },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative flex items-center justify-center mx-auto w-12 h-12 rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <span className="sr-only">{item.label}</span>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-slate-600">
                {item.icon}
                <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.5" className="opacity-10" />
              </svg>
            </Link>
          ))}
        </nav>

        <div className="mt-auto w-full border-t py-3 flex items-center justify-center">
          <Link href="/help" className="group w-12 h-12 rounded-lg flex items-center justify-center hover:bg-slate-100">
            <span className="sr-only">Hilfe & Support</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-slate-600">
              <path d="M12 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M9.09 9a3 3 0 1 1 5.82 1c0 2-3 2-3 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </Link>
        </div>
      </div>
    </aside>
  );
}
