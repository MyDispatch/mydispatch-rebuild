# NEXIFY API – Edge Function Gateway

Robuste API für Wiki- und Komponenten-Daten. Bereitgestellt über Supabase Edge Function `nexify-api`.

## Basis-URL

- `https://<PROJECT_REF>.supabase.co/functions/v1/nexify-api`

## Authentifizierung

- Öffentliche Lese-Endpunkte akzeptieren Anfragen ohne Session.
- Empfohlen: Sende den Anon-Key in den Headers:
  - `apikey: <VITE_SUPABASE_ANON_KEY>`
  - `Authorization: Bearer <VITE_SUPABASE_ANON_KEY>`
- Admin-Endpunkte erfordern ein gültiges JWT mit `app_metadata.role = 'admin'`.

## Endpunkte

### 1) GET `/wiki/session-init`

- Lädt komprimierte Session-Daten für das NeXify Wiki.
- Antwort:

```json
{
  "success": true,
  "data": {
    "session_data": {
      "recent_learnings": [],
      "critical_issues": [],
      "active_components": [],
      "best_practices": [],
      "automation_patterns": []
    }
  },
  "requestId": "..."
}
```

- Beispiel:

```bash
curl -s \
  -H "apikey: $VITE_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $VITE_SUPABASE_ANON_KEY" \
  https://$PROJECT_REF.supabase.co/functions/v1/nexify-api/wiki/session-init
```

### 2) GET `/wiki/search`

- Query-Parameter: `q`, optional `limit`, `categories`
- Beispiel:

```bash
curl -s "https://$PROJECT_REF.supabase.co/functions/v1/nexify-api/wiki/search?q=component&limit=5"
```

### 3) GET `/components/active`

- Liefert verifizierte aktive Komponenten.

### 4) GET `/issues/critical`

- Liefert nicht gelöste kritische Issues.

### 5) GET `/best-practices/top`

- Top Best Practices nach Nutzung.

### 6) GET `/admin/summary` (auth)

- Erfordert `Authorization: Bearer <JWT>` mit `app_metadata.role = 'admin'`.
- Liefert Gesamtzahlen (Knowledge Base, aktive Komponenten, offene Issues).

## Fehlerstruktur

```json
{ "success": false, "error": "Message", "requestId": "..." }
```

## Performance

- Parallelisierte DB-Queries, limitierte Selektionsfelder
- Caching-Header `Cache-Control: public, max-age=30` für GET-Antworten
- Schlanke JSON-Payloads

## Sicherheit

- CORS sicher: `Access-Control-Allow-Origin: *`, kontrollierte Headers/Methods
- Token-Verifikation serverseitig via Supabase Admin-Client
- Kein Zugriff auf schreibende Endpunkte in dieser Version

## Tests

- Siehe `scripts/test-nexify-api.js` (lokaler Curl-ähnlicher Aufruf)
- Optional: `tests/unit/nexify-api.test.ts` für automatisierte Checks

