import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto flex w-full max-w-screen-2xl flex-col items-center justify-between gap-3 px-4 py-4 text-sm md:flex-row">
        <p className="text-muted-foreground">© {new Date().getFullYear()} MyDispatch. Alle Rechte vorbehalten.</p>
        <nav className="flex items-center gap-4">
          <Link className="text-muted-foreground hover:text-foreground" href="/legal/terms">AGB</Link>
          <Link className="text-muted-foreground hover:text-foreground" href="/legal/privacy">Datenschutz</Link>
          <Link className="text-muted-foreground hover:text-foreground" href="/protected">Geschützter Bereich</Link>
        </nav>
      </div>
    </footer>
  );
}

