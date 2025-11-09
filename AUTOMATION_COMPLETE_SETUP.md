# 🤖 MyDispatch Vollständige Automatisierungs-Setup

## Übersicht

Dieses Dokument beschreibt die vollständige Automatisierungs-Pipeline für MyDispatch mit:
- ✅ GitHub Actions CI/CD
- ✅ GitKraken AI Automation
- ✅ Supabase Migrations & Functions
- ✅ Vercel Deployment
- ✅ Quality Gates & Security Checks

---

## 1. GITHUB ACTIONS PIPELINE

### 1.1 CI Pipeline (.github/workflows/ci.yml)
**Trigger**: Push auf main/develop, Pull Requests

**Jobs**:
- **Lint**: ESLint, TypeScript Type Checking
- **Build**: Vite Production Build
- **Test**: Unit Tests (Vitest), E2E Tests (Playwright)
- **Security**: npm audit, dependency checks
- **Performance**: Lighthouse checks

### 1.2 Deploy Pipeline (.github/workflows/deploy.yml)
**Trigger**: Push auf main, manual workflow_dispatch

**Jobs**:
- **Deploy**: Vercel Production Deployment
- **Post-Deploy Tests**: Smoke Tests, Production E2E Tests

### 1.3 Supabase Pipeline (.github/workflows/supabase-deploy.yml)
**Trigger**: Changes in supabase/ folder

**Jobs**:
- **Migrations**: Database migrations
- **Functions**: Edge Functions deployment
- **RLS Audit**: Row Level Security policy verification

---

## 2. GITKRAKEN AI CONFIGURATION

### 2.1 Konfigurationsdatei
**Datei**: `.gitkraken-ai-config.json`

**Features**:
- Automatische Commit-Message-Generierung
- Branch-Naming-Konventionen
- Pull Request Auto-Generation
- Code Review Automation
- Quality Gate Enforcement

### 2.2 Automation Rules

#### Auto-Commit
```json
{
  "enabled": true,
  "conditions": [
    "lintPassed",
    "buildSucceeded",
    "testsPassedOrSkipped"
  ]
}
```

#### Auto-Push
```json
{
  "enabled": true,
  "conditions": [
    "commitSucceeded",
    "noConflicts"
  ],
  "branches": ["main", "develop"]
}
```

#### Auto-Pull Request
```json
{
  "enabled": true,
  "targetBranch": "main",
  "requireReview": true,
  "reviewers": ["courbois1981@gmail.com"]
}
```

---

## 3. QUALITY GATES

### 3.1 Lint Quality Gate
- **Max Errors**: 0
- **Max Warnings**: 100
- **Block on Failure**: true

### 3.2 Build Quality Gate
- **Timeout**: 300 seconds
- **Block on Failure**: true

### 3.3 Test Quality Gate
- **Min Coverage**: 70%
- **Block on Failure**: false

### 3.4 Security Quality Gate
- **Check Dependencies**: true
- **Block on Critical**: true

---

## 4. DEPLOYMENT STRATEGY

### 4.1 Staging Deployment
- **Branch**: develop
- **Environment**: staging
- **Trigger**: Push to develop

### 4.2 Production Deployment
- **Branch**: main
- **Environment**: production
- **Trigger**: Pull Request Merge
- **Requires Approval**: true
- **Approvers**: courbois1981@gmail.com

---

## 5. SETUP-ANLEITUNG

### 5.1 GitHub Secrets konfigurieren

```bash
# Vercel Secrets
gh secret set VERCEL_TOKEN --body "your-vercel-token"
gh secret set VERCEL_ORG_ID --body "your-vercel-org-id"
gh secret set VERCEL_PROJECT_ID --body "your-vercel-project-id"

# Supabase Secrets
gh secret set SUPABASE_ACCESS_TOKEN --body "your-supabase-token"
gh secret set SUPABASE_SERVICE_ROLE_KEY --body "your-service-role-key"
```

### 5.2 GitKraken AI aktivieren

1. Öffne GitKraken
2. Gehe zu Settings → AI
3. Aktiviere "AI-Powered Features"
4. Konfiguriere OpenAI API Key
5. Lade `.gitkraken-ai-config.json` hoch

### 5.3 Vercel Integration

1. Gehe zu https://vercel.com/integrations/github
2. Installiere Vercel GitHub Integration
3. Verbinde MyDispatch Repository
4. Konfiguriere Environment Variables

### 5.4 Supabase Integration

1. Gehe zu Supabase Project Settings
2. Generiere Access Token
3. Speichere als GitHub Secret `SUPABASE_ACCESS_TOKEN`

---

## 6. WORKFLOW-BEISPIELE

### 6.1 Feature Development Workflow

```bash
# 1. Erstelle Feature Branch (GitKraken AI)
git checkout -b feat/new-feature

# 2. Entwickle Feature
# ... code changes ...

# 3. GitKraken AI generiert Commit Message
git add .
git commit  # GitKraken AI schlägt Message vor

# 4. GitKraken AI pusht automatisch
# (wenn lint, build, tests erfolgreich)

# 5. GitKraken AI erstellt Pull Request
# (mit automatischer Description)

# 6. GitHub Actions CI läuft automatisch
# - Lint
# - Build
# - Tests
# - Security Checks

# 7. Nach Approval: Auto-Deploy zu Staging
# (develop branch)

# 8. Nach Merge zu main: Auto-Deploy zu Production
# (mit Approval)
```

### 6.2 Hotfix Workflow

```bash
# 1. Erstelle Hotfix Branch
git checkout -b hotfix/critical-bug

# 2. Fix implementieren
# ... code changes ...

# 3. Commit & Push (automatisch)
git add .
git commit

# 4. GitKraken AI erstellt Hotfix PR
# (mit kritischer Priorität)

# 5. GitHub Actions läuft sofort
# 6. Nach Approval: Sofort zu Production
```

---

## 7. MONITORING & NOTIFICATIONS

### 7.1 GitHub Actions Status
- Alle Workflows sind in `.github/workflows/` definiert
- Status ist sichtbar in GitHub Actions Tab
- Logs sind verfügbar für jede Workflow-Run

### 7.2 Slack Integration (optional)
```json
{
  "slack": {
    "enabled": false,
    "webhook": "${SLACK_WEBHOOK_URL}",
    "channel": "#deployments",
    "notifyOn": [
      "deploymentSuccess",
      "deploymentFailure",
      "testFailure"
    ]
  }
}
```

### 7.3 Email Notifications
- Deployment Success/Failure
- Critical Errors
- Security Alerts

---

## 8. TROUBLESHOOTING

### Problem: GitHub Actions schlägt fehl
**Lösung**:
1. Überprüfe GitHub Secrets
2. Überprüfe Workflow-Logs
3. Verifiziere Vercel/Supabase Tokens

### Problem: GitKraken AI funktioniert nicht
**Lösung**:
1. Überprüfe OpenAI API Key
2. Überprüfe `.gitkraken-ai-config.json`
3. Starte GitKraken neu

### Problem: Deployment schlägt fehl
**Lösung**:
1. Überprüfe Build-Logs
2. Überprüfe Environment Variables
3. Überprüfe Vercel Project Settings

---

## 9. SICHERHEIT

### 9.1 Secrets Management
- ✅ Alle Secrets in GitHub Secrets speichern
- ✅ Tokens regelmäßig rotieren (monatlich)
- ✅ Keine Secrets in Code committen
- ✅ Verwende `.env.local` für lokale Entwicklung

### 9.2 Access Control
- ✅ Nur autorisierte Reviewer können mergen
- ✅ Production Deployment erfordert Approval
- ✅ Alle Deployments sind geloggt
- ✅ Security Checks blockieren kritische Fehler

---

## 10. NÄCHSTE SCHRITTE

1. ✅ GitHub Secrets konfigurieren
2. ✅ GitKraken AI Setup
3. ✅ Vercel Integration
4. ✅ Supabase Integration
5. ✅ Teste CI/CD Pipeline mit Test-Commit
6. ✅ Konfiguriere Slack (optional)
7. ✅ Dokumentiere Team-Prozesse

---

## 11. KONTAKT & SUPPORT

**Projekt**: MyDispatch
**Repository**: https://github.com/MyDispatch/mydispatch-rebuild
**Maintainer**: courbois1981@gmail.com

Für Fragen oder Probleme:
1. Überprüfe diese Dokumentation
2. Überprüfe GitHub Actions Logs
3. Kontaktiere den Maintainer
