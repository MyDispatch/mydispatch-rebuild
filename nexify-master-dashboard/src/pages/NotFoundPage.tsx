import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center text-slate-200">
      <h1 className="text-2xl font-semibold">Seite nicht gefunden</h1>
      <p className="mt-2 max-w-md text-sm text-slate-400">
        Die angeforderte Ressource existiert nicht. Kehre zum Dashboard zurück oder nutze das Command Center, um einen
        neuen Auftrag zu starten.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-400"
      >
        Zurück zum Dashboard
      </Link>
    </div>
  );
}
