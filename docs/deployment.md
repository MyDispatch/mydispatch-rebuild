# Deployment Hinweise

Diese App nutzt Vite und lädt Build-Chunks (ES-Module) relativ zum `base`-Pfad. Wenn die Anwendung unter einem Subpfad bereitgestellt wird (z. B. `https://example.com/master/`), muss der Basis-Pfad entsprechend gesetzt werden, damit dynamisch importierte Module korrekt geladen werden.

## Base Path konfigurieren

- Env-Variable: `VITE_BASE_PATH`
- Standard: `/`
- Beispiel für Deployment unter `/master/`:

```
VITE_BASE_PATH=/master/
```

Die Konfiguration ist in `vite.config.ts` hinterlegt und liest die Variable für alle Modi (`dev`, `build`, `preview`).

## Beispiele nach Plattform

- Vercel: In den Projekt-Einstellungen unter `Environment Variables` hinzufügen (`Production`, `Preview`, optional `Development`).
- Supabase Edge Functions/Static Hosting: In der Build-Umgebung die Variable setzen oder im `.env.production` hinterlegen.
- Self-Hosted (Nginx/Apache): Entweder Subpfad korrekt weiterleiten/umschreiben oder `VITE_BASE_PATH` gemäß Subpfad setzen.

## Fehlerbild und Lösung

Wenn im Browser folgende Meldung erscheint:

> `Failed to fetch dynamically imported module: https://domain.tld/assets/...`

und die App unter `https://domain.tld/master/` läuft, dann fehlt vermutlich der korrekte `base`-Pfad. Setze `VITE_BASE_PATH=/master/` und baue/deploye erneut.

