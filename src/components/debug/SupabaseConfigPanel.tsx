import { useEffect, useState } from 'react';
import { getSupabaseEnv, setSupabaseEnvOverride, clearSupabaseEnvOverride, getOriginDiagnostics } from '@/integrations/supabase/env';

type Props = {
  onClose?: () => void;
};

export function SupabaseConfigPanel({ onClose }: Props) {
  const env = getSupabaseEnv();
  const [url, setUrl] = useState(env.url || '');
  const [anonKey, setAnonKey] = useState(env.anonKey || '');
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message?: string } | null>(null);
  const [diag, setDiag] = useState(getOriginDiagnostics(env.url));

  useEffect(() => {
    setResult(null);
    setDiag(getOriginDiagnostics(url));
  }, [url, anonKey]);

  async function testAndSave() {
    setTesting(true);
    setResult(null);
    try {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`${url}/auth/v1/settings`, {
        headers: { apikey: anonKey },
        signal: controller.signal,
      });
      clearTimeout(t);
      if (!res.ok) {
        setResult({ ok: false, message: 'Key/URL ungültig oder nicht passend.' });
        return;
      }
      // Persist overrides
      setSupabaseEnvOverride({ url, anonKey });
      setResult({ ok: true, message: 'Verbindung erfolgreich. Overrides gespeichert. Bitte Seite neu laden, damit alle Clients die neue Konfiguration nutzen.' });
    } catch (e) {
      setResult({ ok: false, message: 'Verbindungsversuch fehlgeschlagen (Timeout oder Netzwerk).' });
    } finally {
      setTesting(false);
    }
  }

  function clearOverrides() {
    clearSupabaseEnvOverride();
    setResult({ ok: true, message: 'Overrides entfernt.' });
    setTimeout(() => window.location.reload(), 500);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-xl border border-slate-700 bg-slate-900 p-4 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-slate-100 text-lg font-semibold">Supabase-Konfiguration</h2>
          <button className="text-slate-300 hover:text-white" onClick={onClose}>Schließen</button>
        </div>
        <p className="text-slate-400 text-sm mb-4">
          Trage hier die korrekte Projekt-URL und den Anon-Key aus dem Supabase-Dashboard ein. Änderungen werden lokal gespeichert und sofort aktiv.
        </p>
        <label className="block text-slate-300 text-sm mb-1">Projekt-URL</label>
        <input
          className="w-full rounded-md bg-slate-800 border border-slate-700 text-slate-100 px-3 py-2 mb-3"
          placeholder="https://<project>.supabase.co"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <div className="text-xs text-slate-400 mb-3">
          <div>Aktuelle Origin: <span className="text-slate-300">{diag.origin}</span></div>
          <div>Supabase Host: <span className="text-slate-300">{diag.supabaseHost ?? '-'}</span></div>
          {diag.notes.length > 0 && (
            <ul className="mt-1 list-disc pl-5">
              {diag.notes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          )}
        </div>
        <label className="block text-slate-300 text-sm mb-1">Anon/Public Key</label>
        <textarea
          className="w-full rounded-md bg-slate-800 border border-slate-700 text-slate-100 px-3 py-2 h-24 mb-3"
          placeholder="eyJ..."
          value={anonKey}
          onChange={(e) => setAnonKey(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <button
            className="rounded-lg px-4 py-2 bg-primary text-white hover:bg-primary/90"
            onClick={testAndSave}
            disabled={testing}
          >{testing ? 'Teste…' : 'Speichern & Testen'}</button>
          <button
            className="rounded-lg px-4 py-2 bg-slate-700 text-white hover:bg-slate-600"
            onClick={clearOverrides}
          >Overrides löschen</button>
        </div>
        {result && (
          <div className={`mt-3 text-sm ${result.ok ? 'text-green-400' : 'text-red-400'}`}>{result.message}</div>
        )}
        {result?.ok && (
          <div className="mt-3 flex items-center gap-2">
            <button
              className="rounded-lg px-3 py-1 bg-white/10 text-white hover:bg-white/20"
              onClick={() => window.location.reload()}
            >Seite neu laden</button>
            <a
              className="rounded-lg px-3 py-1 bg-primary/20 text-primary-foreground hover:bg-primary/30"
              href="/auth"
            >Zum Login</a>
          </div>
        )}
        {env.usingOverride && (
          <div className="mt-2 text-xs text-slate-400">Aktiv: Lokale Overrides</div>
        )}
      </div>
    </div>
  );
}
