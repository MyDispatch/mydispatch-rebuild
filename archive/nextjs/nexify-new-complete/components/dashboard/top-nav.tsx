import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-screen-2xl items-center justify-between px-4">
        <Link href="/" className="font-semibold">MyDispatch</Link>
        <nav className="flex items-center gap-2">
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">Dashboard</Link>
          <Link href="/entrepreneur" className="text-sm text-muted-foreground hover:text-foreground">Unternehmer</Link>
          <Link href="/customer" className="text-sm text-muted-foreground hover:text-foreground">Kundenportal</Link>
          <Link href="/driver" className="text-sm text-muted-foreground hover:text-foreground">Fahrerportal</Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" aria-label="Mehr Aktionen">
                Aktionen <ChevronDown className="ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/settings">Einstellungen</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/protected">Geschützter Bereich</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
}
