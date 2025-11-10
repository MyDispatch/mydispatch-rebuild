// Lightweight Shim für '@sentry/react' zur Entschärfung von Build-Problemen.
// Alle Funktionen sind No-Ops, damit der Build und die Preview stabil laufen.

export function init(_opts?: Record<string, any>): void {}

export function captureException(_error: unknown, _hint?: Record<string, any>): void {}

export function browserTracingIntegration(): any {
  return {};
}

export function replayIntegration(_opts?: Record<string, any>): any {
  return {};
}

export default {
  init,
  captureException,
  browserTracingIntegration,
  replayIntegration,
};
