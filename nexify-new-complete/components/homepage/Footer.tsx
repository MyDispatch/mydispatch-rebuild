import Link from "next/link";
// Footer minimal nach Vorlage: Linkzeile mittig

export function Footer() {
  return (
    <footer className="w-full border-t bg-background" aria-label="Seitenfuß">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="w-full flex items-center justify-center gap-6 text-xs text-slate-600">
          <Link href="/impressum" className="hover:underline">Impressum</Link>
          <Link href="/privacy" className="hover:underline">Datenschutz</Link>
          <Link href="/terms" className="hover:underline">AGB</Link>
          <Link href="/contact" className="hover:underline">Kontakt</Link>
        </div>
      </div>
    </footer>
  );
}
