# MCP (Model Context Protocol) Konfiguration für VSCode

## Übersicht

Diese Datei dokumentiert die MCP-Server-Konfiguration für die Verbindung mit GitHub, Supabase und anderen Services.

## Konfigurationsdateien

- `.cursor/mcp-config.json` - MCP-Konfiguration für Cursor IDE
- `.vscode/mcp-config.json` - MCP-Konfiguration für VSCode mit Cline/anderen MCP-Extensions

## Konfigurierte MCP-Server

### 1. GitHub MCP Server
Ermöglicht direkten Zugriff auf GitHub-Repositories, Issues, Pull Requests und mehr.

**Erforderliche Umgebungsvariable:**
- `GITHUB_TOKEN` - GitHub Personal Access Token

**Token erstellen:**
1. Gehe zu GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Klicke auf "Generate new token (classic)"
3. Wähle folgende Scopes:
   - `repo` (Full control of private repositories)
   - `read:org` (Read org and team membership)
   - `workflow` (Update GitHub Action workflows)
4. Kopiere den Token und setze ihn als Umgebungsvariable

### 2. Supabase MCP Server
Ermöglicht direkten Zugriff auf Supabase-Datenbank, Storage und Edge Functions.

**Erforderliche Umgebungsvariablen:**
- `VITE_SUPABASE_URL` - Deine Supabase-Projekt-URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service Role Key (nicht der Anon Key!)

**Hinweis:** 
- Die `VITE_SUPABASE_URL` sollte bereits in `.env.local` gesetzt sein
- Der `SUPABASE_SERVICE_ROLE_KEY` ist in den Supabase-Projekteinstellungen unter "API" → "Project API keys" zu finden

### 3. Filesystem MCP Server
Ermöglicht sicheren Dateisystemzugriff innerhalb des Projektverzeichnisses.

**Keine Konfiguration erforderlich.**

### 4. Tavily MCP Server
Web-Such-API für aktuelle Informationen und Recherche.

**API-Key ist bereits konfiguriert.**

## Einrichtung

### Für Cursor IDE:

1. Kopiere `.env.local.example` zu `.env.local`
2. Füge deine echten API-Keys in `.env.local` ein
3. Starte Cursor neu
4. Die MCP-Server werden automatisch geladen

### Für VSCode mit Cline/MCP-Extension:

1. Installiere die Cline-Extension (oder eine andere MCP-kompatible Extension)
2. Kopiere `.env.local.example` zu `.env.local`
3. Füge deine echten API-Keys in `.env.local` ein
4. Die Extension sollte `.vscode/mcp-config.json` automatisch erkennen
5. Starte VSCode neu

## Umgebungsvariablen setzen

### Linux/macOS:

```bash
# In ~/.bashrc oder ~/.zshrc
export GITHUB_TOKEN="ghp_dein_token_hier"
export VITE_SUPABASE_URL="https://deinprojekt.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="dein_service_role_key_hier"
```

### Windows (PowerShell):

```powershell
# Temporär für die aktuelle Session
$env:GITHUB_TOKEN="ghp_dein_token_hier"
$env:VITE_SUPABASE_URL="https://deinprojekt.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="dein_service_role_key_hier"

# Permanent (Systemumgebungsvariablen)
[System.Environment]::SetEnvironmentVariable("GITHUB_TOKEN", "ghp_dein_token_hier", "User")
[System.Environment]::SetEnvironmentVariable("VITE_SUPABASE_URL", "https://deinprojekt.supabase.co", "User")
[System.Environment]::SetEnvironmentVariable("SUPABASE_SERVICE_ROLE_KEY", "dein_service_role_key_hier", "User")
```

### .env.local (Empfohlen für lokale Entwicklung):

```bash
# GitHub
GITHUB_TOKEN=ghp_dein_token_hier

# Supabase
VITE_SUPABASE_URL=https://vsbqyqhzxmwezlhzdmfd.supabase.co
VITE_SUPABASE_ANON_KEY=dein_anon_key_hier
SUPABASE_SERVICE_ROLE_KEY=dein_service_role_key_hier

# Weitere API-Keys...
```

## Troubleshooting

### MCP-Server startet nicht

1. Überprüfe, ob die Umgebungsvariablen korrekt gesetzt sind:
   ```bash
   echo $GITHUB_TOKEN
   echo $VITE_SUPABASE_URL
   ```

2. Überprüfe die MCP-Server-Installation:
   ```bash
   npx @modelcontextprotocol/server-github --version
   npx @modelcontextprotocol/server-supabase --version
   ```

3. Überprüfe die Logs in der IDE (Cursor/VSCode Developer Tools)

### Verbindung zu GitHub funktioniert nicht

1. Überprüfe, ob der GitHub Token gültig ist
2. Überprüfe die erforderlichen Scopes des Tokens
3. Stelle sicher, dass der Token nicht abgelaufen ist

### Verbindung zu Supabase funktioniert nicht

1. Überprüfe die Supabase-URL (sollte mit `https://` beginnen)
2. Stelle sicher, dass du den **Service Role Key** verwendest, nicht den Anon Key
3. Überprüfe die Supabase-Projekt-ID in der URL

## Sicherheitshinweise

⚠️ **WICHTIG:**

1. **NIE** den `SUPABASE_SERVICE_ROLE_KEY` in Git committen!
2. **NIE** den `GITHUB_TOKEN` in Git committen!
3. Verwende immer `.env.local` für lokale Entwicklung (ist in `.gitignore`)
4. Für Production verwende Umgebungsvariablen des Hosting-Providers
5. Der Service Role Key hat volle Admin-Rechte - behandle ihn wie ein Passwort!

## Weitere Informationen

- [Model Context Protocol (MCP) Dokumentation](https://github.com/anthropics/model-context-protocol)
- [GitHub MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/github)
- [Supabase MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/supabase)
- [Cursor MCP Integration](https://docs.cursor.com/context/model-context-protocol)

## Support

Bei Problemen:
1. Überprüfe die Logs in der IDE
2. Überprüfe die MCP-Konfigurationsdateien auf Syntaxfehler
3. Stelle sicher, dass alle erforderlichen npm-Pakete installiert sind
4. Starte die IDE neu nach Konfigurationsänderungen
