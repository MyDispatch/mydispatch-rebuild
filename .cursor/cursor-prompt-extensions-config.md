# Cursor Prompt Extensions - Konfigurationsanleitung

## Status

⚠️ **PENDING:** Cursor Prompt Saver und Cursor Prompt Manager benötigen GitHub-Konfiguration

## Erforderliche Konfiguration

### 1. GitHub Personal Access Token (PAT)

**Erforderlich für beide Extensions:**

- Scope: `gist` (für Prompt-Speicherung)
- Optional: `repo` (falls Repository-Verbindung gewünscht)

**Erstellen:**

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token (classic)"
3. Name: `Cursor Prompt Extensions`
4. Scopes: ✅ `gist` (und optional `repo`)
5. Token kopieren und sicher speichern

### 2. Cursor Prompt Saver Konfiguration

**Vorgehen:**

1. Command Palette öffnen: `Ctrl+Shift+P`
2. Befehl suchen: `Configure Prompt Saver`
3. GitHub Token eingeben (PAT mit `gist` Scope)
4. Optional: Gist ID angeben (falls vorhanden, sonst wird neuer Gist erstellt)

**Erwartete Einstellungen:**

```json
{
  "cursorPromptSaver.githubToken": "ghp_xxxxxxxxxxxx",
  "cursorPromptSaver.gistId": "optional-gist-id",
  "cursorPromptSaver.autoSave": true
}
```

### 3. Cursor Prompt Manager Konfiguration

**Vorgehen:**

1. Command Palette öffnen: `Ctrl+Shift+P`
2. Befehl suchen: `Configure Prompt Manager`
3. GitHub Token eingeben (PAT mit `gist` Scope)
4. Optional: Gist ID angeben (falls vorhanden, sonst wird neuer Gist erstellt)

**Erwartete Einstellungen:**

```json
{
  "cursorPromptManager.githubToken": "ghp_xxxxxxxxxxxx",
  "cursorPromptManager.gistId": "optional-gist-id",
  "cursorPromptManager.autoSync": true
}
```

## Automatische Konfiguration (Optional)

Falls die Extensions die Einstellungen in `.vscode/settings.json` oder `.cursor/settings.json` speichern, können diese hier hinzugefügt werden.

**⚠️ WICHTIG:** GitHub Tokens sollten **NIEMALS** direkt in Settings-Dateien committet werden!

- Nutze Environment Variables oder Cursor Secrets
- Oder konfiguriere über die Command Palette (empfohlen)

## Nächste Schritte

1. ✅ GitHub PAT erstellen (siehe oben)
2. ⏳ Command Palette öffnen (`Ctrl+Shift+P`)
3. ⏳ `Configure Prompt Saver` ausführen
4. ⏳ `Configure Prompt Manager` ausführen
5. ✅ Testen: Prompt speichern und laden

## Projekt-Kontext

**Repository:** `https://github.com/u4231458123-droid/mydispatch-rebuild.git`

**Verwendete Prompts:**

- NeXify Wiki V1.0 (docs/NEXIFY_WIKI_V1.0.md)
- Cursor Rules (.cursorrules)
- Weitere Projekt-Prompts in `docs/`

**Empfohlene Gist-Struktur:**

```
prompts/
  ├── neXify-wiki-v1.0.md
  ├── cursor-rules.md
  └── project-prompts.md
```

---

**Erstellt:** 2025-11-04
**Status:** ⏳ Konfiguration erforderlich
