# Cursor Prompt Extensions - Setup Guide

## Status

⚠️ **PENDING KONFIGURATION:** Cursor Prompt Saver und Cursor Prompt Manager benötigen GitHub-Einstellungen

## Übersicht

Die Extensions "Cursor Prompt Saver" und "Cursor Prompt Manager" ermöglichen es, Prompts in GitHub Gists zu speichern und zu verwalten. Beide benötigen eine GitHub-Konfiguration.

## Schritt-für-Schritt Anleitung

### Schritt 1: GitHub Personal Access Token erstellen

1. Öffne GitHub → [Settings → Developer settings → Personal access tokens → Tokens (classic)](https://github.com/settings/tokens)
2. Klicke auf **"Generate new token (classic)"**
3. **Token Name:** `Cursor Prompt Extensions`
4. **Expiration:** Wähle deine bevorzugte Gültigkeitsdauer
5. **Scopes:** Wähle mindestens:
   - ✅ `gist` (erforderlich für Prompt-Speicherung)
   - Optional: `repo` (falls Repository-Verbindung gewünscht)
6. Klicke auf **"Generate token"**
7. **⚠️ WICHTIG:** Kopiere den Token sofort (er wird nur einmal angezeigt!)
   - Format: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Schritt 2: Cursor Prompt Saver konfigurieren

1. Öffne die **Command Palette** in Cursor:
   - Windows/Linux: `Ctrl+Shift+P`
   - macOS: `Cmd+Shift+P`

2. Tippe: `Configure Prompt Saver`

3. Führe den Befehl aus

4. Wenn nach GitHub Token gefragt wird:
   - Füge deinen GitHub Personal Access Token ein (aus Schritt 1)
   - Format: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

5. Optional: Wenn nach Gist ID gefragt wird:
   - Falls du bereits einen Gist hast, füge die ID ein
   - Sonst wird automatisch ein neuer Gist erstellt

6. Bestätige die Konfiguration

### Schritt 3: Cursor Prompt Manager konfigurieren

1. Öffne die **Command Palette** in Cursor:
   - Windows/Linux: `Ctrl+Shift+P`
   - macOS: `Cmd+Shift+P`

2. Tippe: `Configure Prompt Manager`

3. Führe den Befehl aus

4. Wenn nach GitHub Token gefragt wird:
   - Füge deinen GitHub Personal Access Token ein (aus Schritt 1)
   - Format: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

5. Optional: Wenn nach Gist ID gefragt wird:
   - Falls du bereits einen Gist hast, füge die ID ein
   - Sonst wird automatisch ein neuer Gist erstellt

6. Bestätige die Konfiguration

### Schritt 4: Testen

1. **Prompt speichern:**
   - Öffne einen Chat in Cursor
   - Nutze die Extension-Funktion zum Speichern eines Prompts
   - Prüfe, ob der Prompt im GitHub Gist erscheint

2. **Prompt laden:**
   - Nutze die Extension-Funktion zum Laden eines Prompts
   - Prüfe, ob der Prompt korrekt geladen wird

## Erwartete Einstellungen

Nach erfolgreicher Konfiguration sollten die Extensions folgende Einstellungen verwenden:

```json
{
  "cursorPromptSaver.githubToken": "ghp_xxxxxxxxxxxx",
  "cursorPromptSaver.gistId": "optional-gist-id",
  "cursorPromptSaver.autoSave": true,
  "cursorPromptManager.githubToken": "ghp_xxxxxxxxxxxx",
  "cursorPromptManager.gistId": "optional-gist-id",
  "cursorPromptManager.autoSync": true
}
```

**⚠️ SICHERHEITSHINWEIS:**

- GitHub Tokens sollten **NIEMALS** in Settings-Dateien committet werden!
- Die Extensions speichern Tokens normalerweise sicher in Cursor's Secret Storage
- Falls Token in Settings erscheinen, füge `.vscode/settings.json` und `.cursor/settings.json` zu `.gitignore` hinzu

## Projekt-spezifische Prompts

### Empfohlene Gist-Struktur

Für dieses Projekt sollten folgende Prompts gespeichert werden:

```
prompts/
  ├── neXify-wiki-v1.0.md          # Haupt-Wiki
  ├── cursor-rules.md               # .cursorrules
  ├── project-memory-v32.5.0.md     # Projekt-Gedächtnis
  ├── component-registry-v28.1.md   # Component Registry
  └── lessons-learned-v30.0.md      # Lessons Learned
```

### Wichtige Prompts für dieses Projekt

1. **NeXify Wiki V1.0** (`docs/NEXIFY_WIKI_V1.0.md`)
   - Haupt-Wiki mit allen Regeln und Best Practices
   - **IMMER bei Chat-Start laden!**

2. **Cursor Rules** (`.cursorrules`)
   - Auto-Load Konfiguration
   - Projekt-spezifische Regeln

3. **Project Memory V32.5.0** (`docs/PROJECT_MEMORY_V32.5.0.md`)
   - Projekt-Gedächtnis mit Entwicklungshistorie

## Troubleshooting

### Problem: "Please configure your GitHub settings"

**Lösung:**

- Führe die Schritte 2 und 3 oben aus
- Stelle sicher, dass der GitHub Token den `gist` Scope hat

### Problem: "Invalid GitHub token"

**Lösung:**

1. Prüfe, ob der Token korrekt kopiert wurde (keine Leerzeichen)
2. Prüfe, ob der Token noch gültig ist (nicht abgelaufen)
3. Prüfe, ob der Token den `gist` Scope hat
4. Erstelle einen neuen Token falls nötig

### Problem: "Gist not found"

**Lösung:**

- Lasse die Gist ID leer, damit ein neuer Gist erstellt wird
- Oder prüfe, ob die Gist ID korrekt ist

### Problem: Extensions funktionieren nicht nach Konfiguration

**Lösung:**

1. Starte Cursor neu
2. Prüfe die Extension-Einstellungen in den Cursor Settings
3. Prüfe, ob die Extensions aktiviert sind

## Nächste Schritte

Nach erfolgreicher Konfiguration:

1. ✅ Speichere wichtige Prompts (NeXify Wiki, Cursor Rules, etc.)
2. ✅ Teste das Laden und Speichern von Prompts
3. ✅ Konfiguriere Auto-Save/Sync falls gewünscht
4. ✅ Dokumentiere Gist-IDs für Team-Zugriff (optional)

## Weitere Ressourcen

- **Cursor Prompt Saver:** Extension Marketplace (falls verfügbar)
- **Cursor Prompt Manager:** Extension Marketplace (falls verfügbar)
- **GitHub Gists:** [https://gist.github.com](https://gist.github.com)
- **GitHub Personal Access Tokens:** [https://github.com/settings/tokens](https://github.com/settings/tokens)

---

**Erstellt:** 2025-11-04  
**Status:** ⏳ Konfiguration erforderlich  
**Zuletzt aktualisiert:** 2025-11-04
