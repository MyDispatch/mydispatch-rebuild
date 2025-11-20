# GitKraken SSH Setup für MyDispatch

**Status:** ✅ **KOMPLETT KONFIGURIERT**

---

## 📋 Übersicht

GitKraken Desktop verwendet SSH-Keys für sichere Git-Operationen. Die Keys sind bereits generiert und in GitKraken konfiguriert.

---

## 🔑 SSH Keys

### Lokale Key-Dateien

- **Private Key:** `C:\Users\pcour\Desktop\MyDispatch_ALL\gitkraken_rsa`
- **Public Key:** `C:\Users\pcour\Desktop\MyDispatch_ALL\gitkraken_rsa.pub`
- **Algorithmus:** RSA (ssh-rsa)
- **Status:** ✅ Erfolgreich generiert (siehe GitKraken Desktop Screenshot)

### Public Key

```
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCSx/LrHg8EzFiDnSWFSt/OXQovBYDMO33cq8FYnms4dcnktSm8OpFLDuoe+Q707Me/uLDH0C4E5UcFYMPkpNY72BWvpWT1si0u8+JZVNbosyGLTCvPkyFh36CA4q/kh8rso/BSPPn3+F+uRZ+MqQwEG+FVUGF2MCjd6YhYFX4tSbYAA1Tuvse8DFegCRZ6sJ0xSaoa6SgzbpfBR7z53L+pMloI3QYEjjuqzCp/05+6K3ojiQj/pdAxFvsn8fuhJ4prE6eyHv/a7kVmQaLDa4ZA9O37rstSCL1wh7gOtSF9Pm6YMtP995U/vbD4THXEQZ0CutDTm91eRQLKVgSVknc3
```

---

## 🚀 GitKraken Desktop Konfiguration

### Aktuelle Einstellungen (laut Screenshot)

✅ **SSH Private Key:** `C:\Users\pcour\Desktop\MyDispatch_ALL\gitkraken_rsa`
✅ **SSH Public Key:** `C:\Users\pcour\Desktop\MyDispatch_ALL\gitkraken_rsa.pub`
✅ **Generate new Private/Public key:** Success (grüner Button)
✅ **Use default Git Credential Manager:** Enabled (Checkbox aktiv)

**Status:** Vollständig eingerichtet

---

## 🔗 Public Key zu GitHub hinzufügen

### ✅ STATUS: ERFOLGREICH HINZUGEFÜGT!

**GitHub SSH Key:** `GitKraken Pascal_Notebook`
**SHA256 Fingerprint:** `0yNVlWAKmjciRGn1WAyYmUboRrF6a7e50BB2MwwxdUs`
**Added:** Nov 8, 2025 by GitKraken
**Permissions:** Read/write
**Status:** Active, Never used (wird bei erstem Push verwendet)

---

### Für zukünftige Key-Verwaltung:

#### Schritt 1: Public Key kopieren

```powershell
# Public Key in Zwischenablage kopieren
Get-Content "C:\Users\pcour\Desktop\MyDispatch_ALL\gitkraken_rsa.pub" | Set-Clipboard
```

Oder manuell öffnen und kopieren:

```powershell
notepad "C:\Users\pcour\Desktop\MyDispatch_ALL\gitkraken_rsa.pub"
```

#### Schritt 2: Zu GitHub hinzufügen

1. **GitHub öffnen:** https://github.com/settings/keys
2. **"New SSH key"** klicken
3. **Title:** `GitKraken Desktop - MyDispatch Workstation`
4. **Key type:** Authentication Key
5. **Key:** Public Key einfügen (aus Zwischenablage)
6. **"Add SSH key"** klicken
7. **GitHub-Passwort** zur Bestätigung eingeben

#### Schritt 3: Verbindung testen (in GitKraken)

GitKraken Desktop verwaltet SSH-Verbindungen automatisch. Teste durch:

1. **GitKraken Desktop öffnen**
2. **Repository öffnen:** `mydispatch-rebuild`
3. **Änderung vornehmen** und committen
4. **Push zu GitHub** → sollte ohne Passwort funktionieren

**Manuelle SSH-Verbindung testen (optional):**

```powershell
ssh -T git@github.com
# Erwartete Ausgabe: Hi MyDispatch! You've successfully authenticated...
```

---

## 🔒 GitKraken CLI Integration

### ✅ GitKraken CLI installiert und authentifiziert!

**CLI Version:** 3.1.46 (Installer: 3.1.42)
**Authentifiziert als:** `u4231458123-droid`
**Installation:** `C:\Users\pcour\AppData\Local\Microsoft\WinGet\Links\gk.exe`

### Verfügbare Befehle

```powershell
# CLI Version prüfen
gk version

# Workspaces verwalten
gk workspace list
gk workspace create

# Work Items (Tasks) verwalten
gk work start "Task Name"
gk work commit -m "Message"
gk work pr create

# Issues verwalten
gk issue list
gk issue create

# AI-Features
gk ai commit
gk ai explain

# Graph anzeigen
gk graph
```

### Für Autonomous System

**Statt API Token:** GitKraken CLI bietet programmatischen Zugriff via Command-Line Interface.

**Verwendung in Edge Function:**

```typescript
// Supabase Edge Function mit gk CLI
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

// Work Item erstellen
await execAsync('gk work start "Autonomous Fix: Layout optimization"');

// Änderungen committen
await execAsync('gk work commit -m "fix: optimize dashboard layout"');

// Pull Request erstellen
await execAsync("gk work pr create");
```

**Alternative:** GitKraken Desktop bleibt primäres Tool für manuelle Reviews.

### ✅ Beispiel Cloud Patch

**Existierender Patch:** https://gitkraken.dev/link/drafts/a8dce15b-cd15-4fcc-9d8e-bf9593ef55ca?type=patch

**Cloud Patches via GitKraken Desktop erstellen:**

1. **Änderungen lokal vornehmen** (nicht committen!)
2. **GitKraken Desktop öffnen**
3. **WIP (Work in Progress)** Bereich → Rechtsklick auf Änderungen
4. **"Create Cloud Patch"** wählen
5. **Beschreibung eingeben** und hochladen
6. **Link teilen** oder selbst reviewen
7. **Patch anwenden** auf anderem Computer oder später

**Vorteile:**

- ✅ Änderungen ohne Commit teilen
- ✅ Von jedem Gerät abrufbar (Cloud-basiert)
- ✅ Review vor dem Commit
- ✅ Einfaches Zusammenarbeiten

---

## 🤖 Autonomous System Integration

### Edge Function: `create-gitkraken-patch`

**Lokation:** `supabase/functions/create-gitkraken-patch/index.ts`

**Aktualisierte Strategie:**

- **GitKraken Desktop Cloud Patches** für manuelle Reviews
- **GitKraken CLI** für programmatische Work Item Verwaltung
- **GitHub API** für Pull Request Erstellung (direkter und zuverlässiger)

**Verwendung:**

```typescript
const { data, error } = await supabase.functions.invoke("create-gitkraken-patch", {
  body: {
    task_id: "uuid-here",
    repository: "MyDispatch/mydispatch-rebuild",
    changes: "diff --git a/...",
    description: "Autonomous fixes: Layout optimizations",
    priority: 7,
    files_affected: ["src/pages/Dashboard.tsx"],
  },
});
```

**Rückgabe:**

```json
{
  "success": true,
  "patch": {
    "id": "patch_abc123",
    "url": "https://gitkraken.dev/link/drafts/patch_abc123",
    "status": "pending_review"
  }
}
```

---

## 📊 Workflow

### Autonomer Patch-Workflow

```
1. Autonomous Agent identifiziert Task (Level 3)
2. Generiert Code-Änderungen
3. Ruft create-gitkraken-patch Edge Function auf
4. Edge Function erstellt GitKraken Cloud Patch
5. E-Mail Benachrichtigung an courbois1981@gmail.com
6. Review Patch in GitKraken:
   → https://gitkraken.dev/link/drafts/...
7. Approve → Auto-merge to master
8. Lovable + Supabase + Vercel Deployment
9. Task Status → completed
```

### Manueller Patch-Workflow

```
1. Änderungen lokal vornehmen
2. GitKraken Desktop öffnen
3. "Create Cloud Patch" klicken
4. Beschreibung eingeben
5. Patch hochladen
6. Link teilen oder selbst reviewen
7. Approve → Merge
```

---

## 🐛 Troubleshooting

### Problem: SSH-Verbindung schlägt fehl

**Symptome:**

```
Permission denied (publickey)
```

**Lösung:**

```powershell
# 1. Public Key zu GitHub hinzufügen (siehe oben)

# 2. SSH Agent starten
Start-Service ssh-agent

# 3. Private Key hinzufügen
ssh-add "C:\Users\pcour\Desktop\MyDispatch_ALL\gitkraken_rsa"

# 4. Verbindung erneut testen
ssh -T git@github.com
```

### Problem: GitKraken kann nicht authentifizieren

**Checklist:**

- ✅ SSH Keys korrekt in GitKraken Desktop konfiguriert?
- ✅ Public Key zu GitHub hinzugefügt?
- ✅ Private Key-Dateiberechtigung korrekt? (nur User Lesezugriff)
- ✅ Git Credential Manager aktiviert?

**Lösung:**

1. GitKraken Desktop neu starten
2. SSH-Settings erneut prüfen
3. "Test Connection" in GitKraken ausführen

### Problem: Edge Function kann keine Patches erstellen

**Checklist:**

- ✅ `GITKRAKEN_API_TOKEN` in Supabase Secrets hinterlegt?
- ✅ API Token noch gültig? (Tokens können ablaufen)
- ✅ Rate Limit erreicht? (Max 10 Patches/Stunde)

**Logs prüfen:**

```sql
SELECT * FROM autonomous_execution_logs
WHERE execution_step = 'gitkraken_patch_creation'
ORDER BY timestamp DESC
LIMIT 10;
```

---

## 📚 Weitere Ressourcen

- **GitKraken Cloud Docs:** https://help.gitkraken.com/gitkraken-cloud/
- **GitHub SSH Docs:** https://docs.github.com/en/authentication/connecting-to-github-with-ssh
- **Autonomous System README:** `docs/AUTONOMOUS_SYSTEM_README.md`

---

**Status:** ✅ **Setup komplett - Bereit für autonome Entwicklung!**
