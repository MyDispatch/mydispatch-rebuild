"use client";
import Link from "next/link";
import { V28Button } from "@/components/design-system/V28Button";
import { useRouter } from "next/navigation";

type HeaderProps = {
  onToggleSidebar: () => void;
};

export function Header({ onToggleSidebar }: HeaderProps) {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between" aria-label="Hauptnavigation">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="inline-flex items-center justify-center rounded-md p-2 text-sm text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary md:hidden"
            aria-label="Sidebar ein- oder ausblenden"
          >
            <span className="sr-only">Menü</span>
            {/* Icon: Hamburger */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <Link href="/" className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary" aria-label="Zur Startseite">
            <span className="font-bold tracking-tight text-sm sm:text-base">MyDispatch</span>
          </Link>
        </div>

        {/* Mittelbereich leer – Vorlage hat nur Logo links und Auth rechts */}

        {/* Rechts: Registrieren / Anmelden – exakt wie Vorlage */}
        <div className="flex items-center gap-2">
          <Link href="/auth/sign-up" className="inline-flex">
            <V28Button size="sm" variant="secondary">Registrieren</V28Button>
          </Link>
          <Link href="/auth/login" className="inline-flex">
            <V28Button size="sm" variant="primary">Anmelden</V28Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
