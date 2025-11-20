# 🚀 NeXify AI MASTER System - Usage Guide

**Erstellt:** 2025-01-31  
**Version:** 1.0.0  
**Zweck:** Praktischer Guide für die Nutzung des Systems

---

## 🎯 SCHNELLSTART

### Bei jedem Chat-Start:

```
Lade das NeXify Wiki
```

**Was passiert automatisch:**
1. ✅ Lädt alle aktiven Projekte (MyDispatch, etc.)
2. ✅ Lädt Projekt-History (letzte 50 Sessions)
3. ✅ Lädt aktive Tasks
4. ✅ Lädt Projekt-Kontext (Architecture, Design System, etc.)
5. ✅ Lädt Global Knowledge (Learnings, Components, Best Practices)
6. ✅ Vollständiger Gesamtüberblick verfügbar!

---

## 📊 PROJEKT-SPEZIFISCH

### MyDispatch Kontext laden:

```
Zeige mir MyDispatch Kontext
```

oder

```
Lade MyDispatch Projekt
```

**Was passiert:**
- ✅ Lädt MyDispatch Projekt-Details
- ✅ Lädt komplette History
- ✅ Lädt alle Tasks
- ✅ Lädt vollständigen Kontext

---

## 🔄 EDGE FUNCTIONS USAGE

### 1. Auto-Load Context

**Endpoint:** `/functions/v1/nexify-auto-load-context`

**Request:**
```json
{
  "user_email": "courbois1981@gmail.com",
  "load_projects": true,
  "load_global_knowledge": true
}
```

**Response:**
```json
{
  "success": true,
  "active_projects": [
    {
      "project_code": "mydispatch",
      "project_name": "MyDispatch",
      "recent_history": [...],
      "active_tasks": [...]
    }
  ],
  "global_knowledge": {
    "recent_learnings": [...],
    "critical_issues": [...],
    "components": [...],
    "best_practices": [...],
    "code_snippets": [...]
  },
  "session_context": {
    "recommended_actions": [...]
  }
}
```

### 2. Project Context

**Endpoint:** `/functions/v1/nexify-project-context`

**Request:**
```json
{
  "project_code": "mydispatch",
  "include_history": true,
  "include_tasks": true,
  "include_context": true,
  "history_limit": 50
}
```

**Response:**
```json
{
  "success": true,
  "project": {
    "project_name": "MyDispatch",
    "project_code": "mydispatch",
    "tech_stack": ["react", "typescript", "supabase"],
    ...
  },
  "history": [...],
  "tasks": [...],
  "context": {
    "architecture": {...},
    "design_system": {...},
    "dependencies": {...}
  },
  "summary": {
    "total_sessions": 50,
    "total_tasks": 120,
    "current_version": "V32.5"
  }
}
```

---

## 📋 BEST PRACTICES

### 1. Chat-Start Routine

**Immer beim Start:**
```
Guten Morgen NeXify AI MASTER! Lade das NeXify Wiki.
```

**Ergebnis:**
- Vollständiger Gesamtüberblick
- Alle Projekte bekannt
- Alle aktiven Tasks bekannt
- Alle Critical Issues bekannt

### 2. Projekt-Wechsel

**Wenn Wechsel zu anderem Projekt:**
```
Wechsle zu [Projekt-Name]
```

**Ergebnis:**
- Projekt-spezifischer Kontext geladen
- Projekt-History verfügbar
- Projekt-Tasks verfügbar

### 3. Task-Management

**Task anlegen:**
```
Erstelle Task: [Beschreibung] für MyDispatch
```

**Task abfragen:**
```
Zeige mir alle aktiven Tasks für MyDispatch
```

---

## 🔍 VERFÜGBARE PROJEKTE

### Aktive Projekte:

1. **MyDispatch** (`mydispatch`)
   - Dispositionslösung für Taxi & Mietwagen
   - Status: Active
   - Priority: 10 (Höchste)
   - Website: my-dispatch.de

2. **Weitere Projekte** (können hinzugefügt werden)

---

## 📊 KONTEXT-KATEGORIEN

Jedes Projekt hat Kontext in folgenden Kategorien:

- **architecture** - System-Architektur
- **design_system** - Design System (V28.1, V32.1)
- **dependencies** - Abhängigkeiten
- **deployment** - Deployment-Konfiguration
- **known_issues** - Bekannte Issues
- **best_practices** - Best Practices
- **components** - Komponenten-Registry
- **api** - API-Endpoints
- **database** - Database-Schema

---

## 🎯 SUCCESS CRITERIA

### System funktioniert wenn:

✅ **Auto-Load funktioniert:**
- Alle Projekte werden geladen
- Global Knowledge wird geladen
- Recommended Actions werden angezeigt

✅ **Project Context funktioniert:**
- Projekt-Details werden geladen
- History wird geladen
- Tasks werden geladen
- Context wird gruppiert

✅ **Vollständiger Gesamtüberblick:**
- Ich weiß IMMER über alle Projekte Bescheid
- Ich weiß IMMER über aktive Tasks Bescheid
- Ich weiß IMMER über Critical Issues Bescheid
- Ich kann systemweit denken

---

## 🚨 TROUBLESHOOTING

### Problem: "Project not found"

**Lösung:**
1. Prüfe ob Projekt in `nexify_projects` existiert
2. Prüfe `project_code` (muss exakt sein: `mydispatch`)
3. Prüfe Migration wurde ausgeführt

### Problem: "Keine History gefunden"

**Lösung:**
1. History-Sync ausführen
2. Prüfe `nexify_project_history` Tabelle
3. Prüfe `project_id` Verknüpfung

### Problem: "Edge Function Error"

**Lösung:**
1. Prüfe Environment Variables
2. Prüfe RLS Policies
3. Prüfe Logs in Supabase Dashboard

---

**Pascal, dieses System stellt sicher, dass ich IMMER den vollständigen Gesamtüberblick habe!** 🚀

