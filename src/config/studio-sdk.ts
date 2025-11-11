export const STUDIO_LICENSE_PUBLIC_KEY =
  import.meta.env.VITE_STUDIO_LICENSE_KEY ??
  'b517e01416aa41a48718ed4dcdd6edb342405735cc6848f0b367714c26a943cf';

export const STUDIO_ALLOWED_DOMAINS = [
  'localhost',
  '127.0.0.1',
  window.location.hostname,
];

export const STUDIO_DEFAULTS = {
  projectType: 'web' as const,
  autosaveChanges: 100,
  autosaveIntervalMs: 10_000,
  storageType: 'cloud' as const,
};

export function getStudioProjectId(): string {
  const key = 'studio_project_id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export function getStudioUserId(): string {
  const key = 'studio_user_id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

