# 🔒 GitHub Repository auf Privat stellen

## 📋 GEFUNDENES REPOSITORY

**Repository:** `mydispatch-rebuild`  
**URL:** https://github.com/u4231458123-droid/mydispatch-rebuild.git  
**Status:** ⚠️ ÖFFENTLICH (muss auf PRIVAT gestellt werden)

---

## 🚀 METHODE 1: GitHub Web Interface (SCHNELLSTE)

### Schritte:

1. Gehe zu: https://github.com/u4231458123-droid/mydispatch-rebuild/settings
2. Scrolle nach unten zu **"Danger Zone"**
3. Klicke auf **"Change visibility"**
4. Wähle **"Make private"**
5. Bestätige mit Repository-Name: `u4231458123-droid/mydispatch-rebuild`
6. ✅ FERTIG!

**Dauer:** ~30 Sekunden

---

## 🤖 METHODE 2: GitHub CLI (Automatisch)

### Voraussetzungen:

```bash
# GitHub CLI installieren (falls nicht vorhanden):
# Windows: winget install GitHub.cli
# Oder: https://cli.github.com/

# Authentifizieren:
gh auth login
```

### Kommando:

```bash
cd C:\Users\pcour\mydispatch-rebuild
gh repo edit u4231458123-droid/mydispatch-rebuild --visibility private
```

**Dauer:** ~10 Sekunden (nach Installation)

---

## 📝 METHODE 3: GitHub API (PowerShell Script)

### Script erstellen:

```powershell
# make-repo-private.ps1
$repo = "u4231458123-droid/mydispatch-rebuild"
$token = Read-Host "GitHub Personal Access Token (mit repo scope)" -AsSecureString
$tokenPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($token)
)

$headers = @{
    "Authorization" = "token $tokenPlain"
    "Accept" = "application/vnd.github.v3+json"
}

$body = @{
    private = $true
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://api.github.com/repos/$repo" `
    -Method PATCH `
    -Headers $headers `
    -Body $body `
    -ContentType "application/json"

Write-Host "✅ Repository ist jetzt PRIVAT!" -ForegroundColor Green
```

### Ausführen:

```powershell
.\scripts\make-repo-private.ps1
```

**Token erstellen:** https://github.com/settings/tokens (scope: `repo`)

---

## ✅ VERIFIKATION

Nach dem Wechsel:

```bash
# Repository-Status prüfen:
gh repo view u4231458123-droid/mydispatch-rebuild --json visibility

# Oder manuell prüfen:
# Gehe zu: https://github.com/u4231458123-droid/mydispatch-rebuild
# Sollte "Private" Badge zeigen
```

---

## 🚨 WICHTIG: Nach dem Wechsel

1. **Alle Collaborators informieren** (falls vorhanden)
2. **CI/CD Secrets prüfen** (GitHub Actions funktionieren weiter)
3. **Webhooks prüfen** (falls konfiguriert)
4. **Deployment-Pipelines prüfen** (Lovable Cloud, etc.)

---

**Erstellt:** 2025-01-31  
**Status:** ✅ READY TO EXECUTE
