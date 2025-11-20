import { Settings, Users, Database, Activity, Shield } from "lucide-react";

export function Admin() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Admin Panel</h1>
        <p className="mt-2 text-slate-600">System-Verwaltung und Konfiguration</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Management */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-slate-700" />
            <h2 className="text-xl font-semibold text-slate-900">User Management</h2>
          </div>
          <p className="text-sm text-slate-600 mb-4">Verwalte Benutzer und Berechtigungen</p>
          <button className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800">
            Öffnen
          </button>
        </div>

        {/* System Config */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-6 h-6 text-slate-700" />
            <h2 className="text-xl font-semibold text-slate-900">System Config</h2>
          </div>
          <p className="text-sm text-slate-600 mb-4">System-Konfiguration anpassen</p>
          <button className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800">
            Öffnen
          </button>
        </div>

        {/* Database */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-6 h-6 text-slate-700" />
            <h2 className="text-xl font-semibold text-slate-900">Database</h2>
          </div>
          <p className="text-sm text-slate-600 mb-4">Database-Verwaltung und Backups</p>
          <button className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800">
            Öffnen
          </button>
        </div>

        {/* Monitoring */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-6 h-6 text-slate-700" />
            <h2 className="text-xl font-semibold text-slate-900">Monitoring</h2>
          </div>
          <p className="text-sm text-slate-600 mb-4">System-Monitoring und Logs</p>
          <button className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800">
            Öffnen
          </button>
        </div>

        {/* Security */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-slate-700" />
            <h2 className="text-xl font-semibold text-slate-900">Security</h2>
          </div>
          <p className="text-sm text-slate-600 mb-4">Sicherheits-Einstellungen</p>
          <button className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800">
            Öffnen
          </button>
        </div>
      </div>
    </div>
  );
}
