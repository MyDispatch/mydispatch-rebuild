# 🔑 Secrets Registry
Status: Production-Ready
Version: 1.1.0
Datum: 2025-11-11
Autor: Engineering

## Zusammenfassung
Zentrale, Jira‑freie Registry für System‑/API‑Schlüssel‑Metadaten. Keine Klartext‑Secrets. Dient der Nachvollziehbarkeit (Owner, Zweck, Rotation, Speicherort), nicht der Speicherung der Werte.

## Details
- Keine Speicherung von Secret‑Werten im Repository (Policy: strikt untersagt).
- Erfasst werden ausschließlich Metadaten je Secret:
  - Name/Key: technisch eindeutige Bezeichnung
  - Scope: System/Service (z. B. Supabase, Stripe, Maps)
  - Owner: verantwortliche Person/Rolle
  - Speicherort: `.env`, CI Secret Store, Vault
  - Rotation: Intervall, letztes Rotationsdatum
  - Fallback: Verhalten bei fehlendem Secret
  - Referenz: Codepfade/Docs
- Audit‑Trail über Changelogs und Commit‑Historie gemäß Dokumentationspflege‑Policy.

### Metadaten‑Schema (Beispiel)
```
id: SEC-0001
name: SUPABASE_SERVICE_ROLE_KEY
scope: supabase
owner: Engineering
storage: GitHub Actions Secrets (SUPABASE_SERVICE_ROLE_KEY)
rotation: 90 Tage
last_rotated: 2025-10-01
fallback: read-only mode (kein Persist)
references:
  - path: supabase/functions/wiki-sync/index.ts
  - path: .github/workflows/docs-sync.yml
  - path: scripts/docs-sync.js
```

## Validierung
- Secret‑Werte sind nur in sicheren Speichern (CI‑Secrets, Vault, lokale `.env`) abgelegt.
- CI‑Workflows greifen ausschließlich über Secret‑Mechanismen zu.
- Dry‑Runs ohne Secrets funktionieren (lesende Pfade, Fallbacks).
- Regelmäßige Rotation dokumentiert; fehlende Werte führen nicht zu Build‑Leaks.

## Referenzen
- `docs/DOCUMENTATION_MAINTENANCE_POLICY_V1.1.md` – Repo‑native Audit‑Trails, MD‑2024
- `.github/workflows/docs-sync.yml` – Docs‑Sync CI mit Secrets
- `supabase/functions/wiki-sync/index.ts` – Edge Function (Read/Write)
- `scripts/docs-sync.js` – Parser & Sync (ESM)
