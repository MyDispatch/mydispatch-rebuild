"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Header({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = query.trim();
    if (q.length) {
      router.push(`/dashboard?search=${encodeURIComponent(q)}`);
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-screen-2xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Sidebar umschalten" onClick={onToggleSidebar}>
            <Menu />
          </Button>
          <Link href="/" className="font-semibold text-primary">MyDispatch</Link>
          <nav className="ml-4 hidden items-center gap-3 md:flex">
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">Dashboard</Link>
            <Link href="/entrepreneur" className="text-sm text-muted-foreground hover:text-foreground">Unternehmer</Link>
            <Link href="/customer" className="text-sm text-muted-foreground hover:text-foreground">Kundenportal</Link>
            <Link href="/driver" className="text-sm text-muted-foreground hover:text-foreground">Fahrerportal</Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <form onSubmit={onSubmit} className="relative hidden items-center md:flex" role="search" aria-label="Suche">
            <Search className="absolute left-2 text-muted-foreground" size={16} />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-48 pl-7"
              placeholder="Suche"
              aria-label="Suche im Dashboard"
            />
          </form>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}

