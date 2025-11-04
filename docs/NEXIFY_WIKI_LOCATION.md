# 📍 NeXify Wiki - Genauer Speicherort

**Status:** ✅ DOKUMENTIERT  
**Datum:** 2025-01-31  
**Zweck:** Automatisches Wiki-Laden beim nächsten Start

---

## 🎯 WIKI SPEICHERORT (ABSOLUTER PFAD)

### Haupt-Wiki-Dokument:
```
C:\Users\pcour\mydispatch-rebuild\docs\NEXIFY_WIKI_V1.0.md
```

### Relativer Pfad (vom Projekt-Root):
```
docs/NEXIFY_WIKI_V1.0.md
```

---

## 📚 VOLLSTÄNDIGE WIKI-DOKUMENTATION

### Core Dokumente (Priority 1 - IMMER laden):

1. **Haupt-Wiki:**
   ```
   docs/NEXIFY_WIKI_V1.0.md
   ```
   - 2,252 Zeilen
   - Komplettes Knowledge System
   - Critical Issues, Kernprinzipien, Supabase Tables

2. **Project Memory:**
   ```
   docs/PROJECT_MEMORY.md
   ```
   - Aktuelle Session-Kontext
   - Development Sessions
   - Technische Details

3. **Component Registry:**
   ```
   docs/COMPONENT_REGISTRY.md
   ```
   - 21+ aktive Komponenten
   - Deprecated Components
   - Usage Guides

4. **Lessons Learned:**
   ```
   docs/LESSONS_LEARNED.md
   ```
   - 13 Learnings
   - Anti-Patterns
   - Best Practices

5. **Design System Lock:**
   ```
   docs/DESIGN_SYSTEM_LOCK.md
   ```
   - V28.1 Mandatory Rules
   - Design Token System
   - Layout Freeze Protection

---

## 🤖 AUTOMATISCHES LADEN (LÖSUNG)

### Option 1: Cursor Memory (EMPFOHLEN)

**Cursor Memory File erstellen:**
```
.cursor/memory/nexify-wiki.md
```

**Inhalt:**
```markdown
# NeXify Wiki Auto-Load

Bei JEDEM Chat-Start automatisch laden:

1. docs/NEXIFY_WIKI_V1.0.md
2. docs/PROJECT_MEMORY.md
3. docs/COMPONENT_REGISTRY.md
4. docs/LESSONS_LEARNED.md
5. docs/DESIGN_SYSTEM_LOCK.md

Command: "Lade das NeXify Wiki"
```

### Option 2: Supabase Edge Function (BEREITS IMPLEMENTIERT)

**Edge Function:** `brain-query`  
**Endpoint:** `/functions/v1/brain-query`

**Request:**
```json
{
  "query": "session_init",
  "categories": ["design_system", "best_practice", "anti_pattern", "component_pattern"],
  "limit": 50,
  "include_code_snippets": true,
  "include_best_practices": true
}
```

**Fallback bei Fehler:**
- Lade `docs/NEXIFY_WIKI_V1.0.md` direkt
- Lade `docs/COMPONENT_REGISTRY.md`
- Lade `docs/LESSONS_LEARNED.md`

### Option 3: Cursor Rules File (PERMANENT)

**Cursor Rules erstellen:**
```
.cursorrules
```

**Inhalt:**
```
# NeXify Wiki Auto-Load Rules

Bei Chat-Start IMMER zuerst laden:
- docs/NEXIFY_WIKI_V1.0.md (Haupt-Wiki)
- docs/PROJECT_MEMORY.md (Session-Kontext)
- docs/COMPONENT_REGISTRY.md (Components)
- docs/LESSONS_LEARNED.md (Learnings)
- docs/DESIGN_SYSTEM_LOCK.md (Design Rules)

Trigger: "Lade das NeXify Wiki"
```

---

## 📋 WIKI-LOAD WORKFLOW

### Schritt-für-Schritt:

1. **User schreibt:** `"Lade das NeXify Wiki"`

2. **AI führt aus:**
   ```typescript
   // 1. Versuche Supabase Edge Function
   const { data } = await supabase.functions.invoke('brain-query', {
     body: { query: 'session_init' }
   });
   
   // 2. Falls Fehler: Fallback auf lokale Docs
   if (error) {
     await readFile('docs/NEXIFY_WIKI_V1.0.md');
     await readFile('docs/COMPONENT_REGISTRY.md');
     await readFile('docs/LESSONS_LEARNED.md');
     await readFile('docs/DESIGN_SYSTEM_LOCK.md');
   }
   
   // 3. Status-Report ausgeben
   console.log('✅ NEXIFY WIKI V1.0 LOADED');
   ```

3. **Kontext ist gesetzt:**
   - ✅ Zero-Hallucination Protocol aktiv
   - ✅ Design System V28.1 bekannt
   - ✅ Component Registry verfügbar
   - ✅ Lessons Learned geladen

---

## 🔍 VERIFIKATION

### Wiki-Location prüfen:
```bash
# PowerShell:
Test-Path "C:\Users\pcour\mydispatch-rebuild\docs\NEXIFY_WIKI_V1.0.md"

# Sollte zurückgeben: True
```

### Alle Core Docs prüfen:
```powershell
$docs = @(
    "docs/NEXIFY_WIKI_V1.0.md",
    "docs/PROJECT_MEMORY.md",
    "docs/COMPONENT_REGISTRY.md",
    "docs/LESSONS_LEARNED.md",
    "docs/DESIGN_SYSTEM_LOCK.md"
)

foreach ($doc in $docs) {
    if (Test-Path $doc) {
        Write-Host "✅ $doc" -ForegroundColor Green
    } else {
        Write-Host "❌ $doc FEHLT!" -ForegroundColor Red
    }
}
```

---

## 🚀 QUICK REFERENCE

**Für AI-Agenten:**
```
Wiki-Hauptdokument: docs/NEXIFY_WIKI_V1.0.md
Absoluter Pfad: C:\Users\pcour\mydispatch-rebuild\docs\NEXIFY_WIKI_V1.0.md
Trigger: "Lade das NeXify Wiki"
Fallback: Lokale Dateien laden (falls Edge Function fehlschlägt)
```

**Für Entwickler:**
```
Alle Wiki-Docs: docs/*.md
Haupt-Wiki: docs/NEXIFY_WIKI_V1.0.md
Entry-Prompt: docs/WIKI_ENTRY_PROMPT.md
Location-Doc: docs/NEXIFY_WIKI_LOCATION.md (diese Datei)
```

---

**Version:** 1.0.0  
**Erstellt:** 2025-01-31  
**Status:** ✅ PRODUCTION-READY




