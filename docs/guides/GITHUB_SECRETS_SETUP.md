# GitHub Secrets Setup für MyDispatch CI/CD Pipeline

## Erforderliche Secrets für GitHub Actions

### 1. Vercel Deployment Secrets

```
VERCEL_TOKEN: <your-vercel-token>
VERCEL_ORG_ID: <your-vercel-org-id>
VERCEL_PROJECT_ID: <your-vercel-project-id>
```

**Wie man diese erhält:**

1. Gehe zu https://vercel.com/account/tokens
2. Erstelle ein neuen Token mit Scope "Full Access"
3. Kopiere den Token als `VERCEL_TOKEN`
4. Gehe zu https://vercel.com/account/settings und kopiere die Org ID
5. Gehe zu Projekt-Settings und kopiere die Project ID

### 2. Supabase Secrets

```
SUPABASE_URL: https://ygpwuiygivxoqtyoigtg.supabase.co
SUPABASE_ANON_KEY: <your-supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY: <your-supabase-service-role-key>
```

**Wie man diese erhält:**

1. Gehe zu https://app.supabase.com/project/ygpwuiygivxoqtyoigtg/settings/api
2. Kopiere die URL und die Keys

### 3. Environment Secrets

```
NODE_ENV: production
VITE_API_URL: https://ygpwuiygivxoqtyoigtg.supabase.co
VITE_SUPABASE_ANON_KEY: <your-supabase-anon-key>
```

### 4. Optional: Slack Integration

```
SLACK_WEBHOOK_URL: <your-slack-webhook-url>
```

## Setup-Anleitung

### Schritt 1: GitHub Repository Settings öffnen

1. Gehe zu https://github.com/MyDispatch/mydispatch-rebuild
2. Klicke auf "Settings"
3. Wähle "Secrets and variables" → "Actions"

### Schritt 2: Secrets hinzufügen

1. Klicke auf "New repository secret"
2. Gib den Namen ein (z.B. `VERCEL_TOKEN`)
3. Gib den Wert ein
4. Klicke "Add secret"

### Schritt 3: Verify Secrets

```bash
# Teste die Secrets mit diesem Workflow:
# .github/workflows/test-secrets.yml
```

## Sicherheitsrichtlinien

- ✅ Speichere Secrets NIEMALS in der Versionskontrolle
- ✅ Verwende unterschiedliche Tokens für verschiedene Umgebungen
- ✅ Rotiere Tokens regelmäßig (monatlich empfohlen)
- ✅ Verwende Secrets nur in GitHub Actions, nicht lokal
- ✅ Überprüfe regelmäßig, welche Secrets aktiv sind

## Troubleshooting

### Fehler: "Context access might be invalid"

- Stelle sicher, dass die Secrets in GitHub Settings konfiguriert sind
- Überprüfe die genaue Schreibweise der Secret-Namen
- Warte 5 Minuten nach dem Hinzufügen von Secrets

### Fehler: "Deployment failed"

- Überprüfe, ob die Vercel-Tokens gültig sind
- Stelle sicher, dass das Vercel-Projekt existiert
- Überprüfe die Vercel-Logs für detaillierte Fehler

## Automatisierte Secrets-Verwaltung

Für maximale Sicherheit können Secrets auch automatisiert verwaltet werden:

```bash
# Mit GitHub CLI
gh secret set VERCEL_TOKEN --body "your-token"
gh secret set VERCEL_ORG_ID --body "your-org-id"
gh secret set VERCEL_PROJECT_ID --body "your-project-id"
```

## Nächste Schritte

Nach dem Setup:

1. ✅ Teste die CI/CD Pipeline mit einem Test-Commit
2. ✅ Überprüfe die GitHub Actions Logs
3. ✅ Verifiziere die Vercel Deployment
4. ✅ Konfiguriere Slack-Benachrichtigungen (optional)
