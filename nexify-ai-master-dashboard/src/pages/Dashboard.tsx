import { useNeXifyAI } from '../hooks/useNeXifyAI'
import { Activity, CheckCircle2, Clock, AlertCircle } from 'lucide-react'

export function Dashboard() {
  const { agentStatus, projects, loading, error } = useNeXifyAI()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">Lädt...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-600">
        <AlertCircle className="w-5 h-5" />
        <span>{error}</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-slate-600">
          Willkommen im NeXifyAI MASTER Dashboard
        </p>
      </div>

      {/* Agent Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Agent Status</p>
              <p className={`mt-2 text-2xl font-bold ${
                agentStatus.online ? 'text-green-600' : 'text-red-600'
              }`}>
                {agentStatus.online ? 'Online' : 'Offline'}
              </p>
            </div>
            <div className={`p-3 rounded-full ${
              agentStatus.online ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <Activity className={`w-6 h-6 ${
                agentStatus.online ? 'text-green-600' : 'text-red-600'
              }`} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Aktivität</p>
              <p className="mt-2 text-2xl font-bold text-slate-900 capitalize">
                {agentStatus.activity}
              </p>
            </div>
            <div className="p-3 rounded-full bg-slate-100">
              <Clock className="w-6 h-6 text-slate-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Aktive Projekte</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {projects.length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <CheckCircle2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Projects */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Aktive Projekte</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-slate-900">{project.project_name}</h3>
              <p className="mt-1 text-sm text-slate-600">{project.description}</p>
              <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
                <span>{project.total_sessions} Sessions</span>
                <span>{project.total_tasks} Tasks</span>
              </div>
            </div>
          ))}
        </div>
        {projects.length === 0 && (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <p className="text-slate-600">Keine aktiven Projekte gefunden</p>
          </div>
        )}
      </div>
    </div>
  )
}
