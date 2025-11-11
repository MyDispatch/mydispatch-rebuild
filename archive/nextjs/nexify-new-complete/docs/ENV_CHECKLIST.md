# 🔐 ENV Checklist
Status: Production-Ready
Version: 1.0.0
Datum: 2025-11-10
Autor: Team MyDispatch

## Zusammenfassung
Erforderliche Umgebungsvariablen für lokale Entwicklung, Preview und Produktion. Werte niemals im Code offenlegen.

## Variablen (ohne Werte)
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `MCP_SUPABASE_ENDPOINT`

## Hinweise
- Secrets ausschließlich über Vercel-Project-Settings setzen.
- Lokale Entwicklung via `.env.local` (nicht commiten). 

