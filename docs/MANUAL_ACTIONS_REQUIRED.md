# 📋 MANUELLE AKTIONEN ERFORDERLICH

**Status**: ⚠️ Benutzer-Aktion erforderlich
**Timestamp**: 2025-11-05 09:52 CET

## 🔧 SUPABASE EDGE FUNCTION DEPLOYEN

### Schritt 1: Supabase Dashboard öffnen
1. Navigiere zu: https://supabase.com/dashboard
2. Wähle Projekt: **mydispatch-rebuild**
3. Gehe zu: **Edge Functions** (linke Sidebar)

### Schritt 2: Function deployen
1. Klicke auf **"brain-query"** (oder erstelle neu falls nicht vorhanden)
2. Kopiere den Code aus: `supabase/functions/brain-query/index.ts`
3. Klicke **"Deploy"**
4. Warte auf Bestätigung

### Schritt 3: Testen
1. Öffne Browser Console (F12)
2. Lade App neu: http://localhost:5173
3. Prüfe ob CORS-Error verschwunden ist
4. Prüfe ob NeXify Wiki lädt

## 🔧 GITHUB ACTIONS AKTIVIEREN

### Schritt 1: Repository Settings
1. Gehe zu: https://github.com/[your-org]/mydispatch-rebuild
2. Klicke: **Settings** → **Actions** → **General**
3. Aktiviere: **"Allow all actions and reusable workflows"**
4. Speichere

### Schritt 2: Workflow aktivieren
1. Gehe zu: **Actions** Tab
2. Workflow **"auto-commit.yml"** sollte automatisch aktiv sein
3. Optional: Manuell triggern via **"Run workflow"**

## ✅ VALIDIERUNG

Nach beiden Schritten:
- ✅ CORS-Errors in Console verschwunden
- ✅ NeXify Wiki lädt erfolgreich
- ✅ GitHub Actions zeigt grüne Runs
- ✅ Auto-Commit funktioniert täglich

**Alle anderen Punkte sind bereits automatisiert!**

