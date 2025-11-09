import { useState } from "react";

import { toast } from "@/lib/toast";

type Plugin = {
  id: string;
  name: string;
  version: string;
  status: "active" | "staging" | "disabled";
  capabilities: string[];
};

const initialPlugins: Plugin[] = [
  {
    id: "plugin-cursor-remote",
    name: "Cursor Remote Control",
    version: "0.1.0",
    status: "staging",
    capabilities: ["cursor.remoteCommands", "cursor.fileSystem"]
  },
  {
    id: "plugin-supabase-audit",
    name: "Supabase Audit Guard",
    version: "1.3.2",
    status: "active",
    capabilities: ["supabase.policyCheck", "supabase.metricIngest"]
  }
];

export function PluginShelf() {
  const [plugins, setPlugins] = useState<Plugin[]>(initialPlugins);
  const [manifestInput, setManifestInput] = useState(
    [
      "{",
      '  "id": "plugin-new",',
      '  "name": "Neues Plugin",',
      '  "version": "0.0.1",',
      '  "status": "staging",',
      '  "capabilities": ["example.capability"]',
      "}"
    ].join("\n")
  );

  const handleRegister = () => {
    try {
      const manifest = JSON.parse(manifestInput) as Plugin;
      if (!manifest.id || !manifest.name) {
        throw new Error("Manifest benötigt mindestens id und name");
      }

      setPlugins((prev) => {
        const existing = prev.find((plugin) => plugin.id === manifest.id);
        if (existing) {
          return prev.map((plugin) => (plugin.id === manifest.id ? { ...plugin, ...manifest } : plugin));
        }
        return [...prev, { ...manifest, status: manifest.status ?? "staging" }];
      });

      toast({
        title: "Plugin registriert",
        description: `${manifest.name} (${manifest.version})`,
        variant: "success"
      });
    } catch (error) {
      toast({
        title: "Manifest ungültig",
        description: (error as Error)?.message ?? "Syntax prüfen",
        variant: "error"
      });
    }
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">Plugin Registry</h3>
          <p className="text-xs text-slate-400">Sandboxed Erweiterungen für den Master-Agenten.</p>
        </div>
        <span className="rounded-full border border-slate-700 px-3 py-1 text-[11px] uppercase tracking-wide text-slate-300">
          {plugins.length} Plugins
        </span>
      </header>
      <div className="grid gap-4 lg:grid-cols-[1.4fr,1fr]">
        <div className="space-y-3">
          {plugins.map((plugin) => (
            <article key={plugin.id} className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-slate-100">{plugin.name}</h4>
                  <p className="text-xs text-slate-400">{plugin.id}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-wide ${
                    plugin.status === "active"
                      ? "bg-emerald-500/15 text-emerald-200"
                      : plugin.status === "staging"
                        ? "bg-amber-500/15 text-amber-200"
                        : "bg-slate-700/40 text-slate-300"
                  }`}
                >
                  {plugin.status}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-400">Version {plugin.version}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] uppercase tracking-wide text-slate-300">
                {plugin.capabilities.map((capability) => (
                  <span key={capability} className="rounded-lg bg-slate-800 px-2 py-1">
                    {capability}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
        <div className="flex h-full flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">Manifest registrieren</p>
          <textarea
            value={manifestInput}
            onChange={(event) => setManifestInput(event.target.value)}
            rows={12}
            className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-3 text-xs text-slate-100 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
          />
          <button
            type="button"
            onClick={handleRegister}
            className="rounded-lg bg-primary-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-primary-400"
          >
            Manifest anwenden
          </button>
        </div>
      </div>
    </section>
  );
}
