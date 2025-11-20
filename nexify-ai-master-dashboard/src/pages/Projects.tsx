import { useNeXifyAI } from "../hooks/useNeXifyAI";
import { FolderKanban, ExternalLink, GitBranch, Calendar } from "lucide-react";

export function Projects() {
  const { projects, loading, error } = useNeXifyAI();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">Lädt Projekte...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-600">
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Projekte</h1>
        <p className="mt-2 text-slate-600">Verwalte alle deine Projekte</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <FolderKanban className="w-5 h-5 text-slate-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{project.project_name}</h3>
                  <p className="text-sm text-slate-600">{project.project_code}</p>
                </div>
              </div>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  project.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {project.status}
              </span>
            </div>

            {project.description && (
              <p className="text-sm text-slate-600 mb-4">{project.description}</p>
            )}

            <div className="space-y-2 mb-4">
              {project.website_url && (
                <a
                  href={project.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
                >
                  <ExternalLink className="w-4 h-4" />
                  Website
                </a>
              )}
              {project.github_repo && (
                <a
                  href={`https://github.com/${project.github_repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
                >
                  <GitBranch className="w-4 h-4" />
                  Repository
                </a>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
              <div>
                <p className="text-xs text-slate-600">Sessions</p>
                <p className="text-lg font-semibold text-slate-900">{project.total_sessions}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600">Tasks</p>
                <p className="text-lg font-semibold text-slate-900">{project.total_tasks}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600">Components</p>
                <p className="text-lg font-semibold text-slate-900">{project.total_components}</p>
              </div>
            </div>

            {project.last_activity_at && (
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <Calendar className="w-3 h-3" />
                Letzte Aktivität: {new Date(project.last_activity_at).toLocaleDateString()}
              </div>
            )}
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <FolderKanban className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">Keine Projekte gefunden</p>
        </div>
      )}
    </div>
  );
}
