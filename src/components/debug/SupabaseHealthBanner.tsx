import { useEffect, useState } from 'react';
import { getSupabaseEnv } from '@/integrations/supabase/env';
import { SupabaseConfigPanel } from './SupabaseConfigPanel';

interface Status {
  ok: boolean;
  message?: string;
}

export function SupabaseHealthBanner() {
  const [status, setStatus] = useState<Status>({ ok: true });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const { url, anonKey, isOfflineDev, usedDefaultAnon } = getSupabaseEnv();

    async function check() {
      if (isOfflineDev) {
        // In Offline-Dev keine rote Warnung zeigen, sondern still ausblenden
        setStatus({ ok: true });
        return;
      }
      if (!url || !anonKey) {
        setStatus({ ok: false, message: 'Supabase-URL oder Anon-Key fehlt. Bitte .env.local prüfen.' });
        return;
      }
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(`${url}/auth/v1/settings`, { headers: { apikey: anonKey }, signal: controller.signal });
        clearTimeout(timeout);
        if (!res.ok) {
          setStatus({ ok: false, message: usedDefaultAnon ? 'Default-Publishable Key aktiv. Bitte echten Projekt-Anon-Key setzen.' : 'Supabase Anon-Key ist ungültig oder passt nicht zum Projekt.' });
        } else {
          setStatus({ ok: true });
        }
      } catch (e) {
        setStatus({ ok: false, message: 'Verbindung zu Supabase fehlgeschlagen oder Zeitüberschreitung.' });
      }
    }

    check();
  }, []);

  if (status.ok) return null;

  return (
    <div className="w-full bg-red-600 text-white text-sm px-4 py-2">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div>
          <strong>Systemkonfiguration fehlerhaft:</strong> {status.message}
          <span className="ml-2">Bitte korrekten Anon-Key aus dem Supabase-Dashboard des Projekts eintragen.</span>
          <div className="text-white/80 text-xs mt-1">
            Origin: {typeof window !== 'undefined' ? window.location.origin : 'unknown'}
          </div>
        </div>
        <button
          className="rounded-md bg-white/10 px-3 py-1 text-white hover:bg-white/20"
          onClick={() => setOpen(true)}
        >Key jetzt eintragen</button>
      </div>
      {open && <SupabaseConfigPanel onClose={() => setOpen(false)} />}
    </div>
  );
}
