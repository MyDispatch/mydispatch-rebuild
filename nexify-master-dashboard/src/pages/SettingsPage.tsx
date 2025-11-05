import { useState } from "react";

import { toast } from "@/lib/toast";

type EnvConfig = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  agentApiUrl: string;
  githubTokenName: string;
};

const defaultConfig: EnvConfig = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL ?? "",
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? "",
  agentApiUrl: import.meta.env.VITE_MASTER_AGENT_API_URL ?? "",
  githubTokenName: "NEXIFY_MASTER_GH"
};

export default function SettingsPage() {
  const [config, setConfig] = useState<EnvConfig>(defaultConfig);

  const handleChange = (field: keyof EnvConfig, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    toast({
      title: "Konfiguration exportiert",
      description: "Speichere Werte als Vercel Secrets & Supabase Config",
      variant: "success"
    });
    console.table(config);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <header className="mb-4">
          <h2 className="text-sm font-semibold text-slate-100">Umgebungsvariablen</h2>
          <p className="text-xs text-slate-400">Diese Werte gehören in Vercel & lokale `.env` Dateien.</p>
        </header>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-xs text-slate-300">
            <span>VITE_SUPABASE_URL</span>
            <input
              value={config.supabaseUrl}
              onChange={(event) => handleChange("supabaseUrl", event.target.value)}
              placeholder="https://...supabase.co"
              className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            />
          </label>
          <label className="flex flex-col gap-2 text-xs text-slate-300">
            <span>VITE_SUPABASE_ANON_KEY</span>
            <input
              value={config.supabaseAnonKey}
              onChange={(event) => handleChange("supabaseAnonKey", event.target.value)}
              placeholder="eyJh..."
              className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            />
          </label>
          <label className="flex flex-col gap-2 text-xs text-slate-300">
            <span>VITE_MASTER_AGENT_API_URL</span>
            <input
              value={config.agentApiUrl}
              onChange={(event) => handleChange("agentApiUrl", event.target.value)}
              placeholder="https://api.nexify.cloud/master"
              className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            />
          </label>
          <label className="flex flex-col gap-2 text-xs text-slate-300">
            <span>GitHub Token Name</span>
            <input
              value={config.githubTokenName}
              onChange={(event) => handleChange("githubTokenName", event.target.value)}
              placeholder="NEXIFY_MASTER_GH"
              className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            />
          </label>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="mt-4 rounded-lg bg-primary-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-primary-400"
        >
          Werte sichern
        </button>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <header className="mb-4">
          <h2 className="text-sm font-semibold text-slate-100">Sicherheitsrichtlinien</h2>
          <p className="text-xs text-slate-400">Auszug aus Forget-Proof & Zero-Hallucination Protokollen.</p>
        </header>
        <ul className="space-y-2 text-xs text-slate-300">
          <li>• MFA für Master-Admin aktivieren (Supabase Auth + OTP).</li>
          <li>• Edge Functions mit Secret Scans überwachen.</li>
          <li>• Secrets Rotation alle 90 Tage (Vercel & Supabase).</li>
          <li>• Audit-Logs nach `docs/NEXIFYAI_MASTER_AUDIT.md` archivieren.</li>
          <li>• Cursor Remote Zugriff nur über genehmigte Tokens.</li>
        </ul>
      </section>
    </div>
  );
}
