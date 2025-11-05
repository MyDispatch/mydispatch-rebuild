import { PluginShelf } from "@/components/plugins/PluginShelf";

export default function PluginsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-lg font-semibold text-slate-100">Self-Extension & Plugins</h1>
        <p className="text-sm text-slate-400">
          Registriere Fähigkeiten mit Manifesten und verwalte Sandbox-Status, bevor der Master-Agent sie aktiviert.
        </p>
      </header>
      <PluginShelf />
    </div>
  );
}
