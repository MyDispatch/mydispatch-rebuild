# Doc-Management AI Integration V18.5.1

**Status:** ✅ IMPLEMENTIERT  
**Datum:** 2025-10-24  
**Edge Function:** `manage-docs`  
**AI-Modell:** Claude Sonnet 4.5 (via Lovable AI Gateway)

---

## 🎯 ZWECK

Der Doc-Management AI Agent ist ausschließlich für die Strukturierung, Aktualisierung und Pflege der MyDispatch-Dokumentation verantwortlich.

### Kernaufgaben

1. **Dokumentations-Struktur** - Logische & professionelle Organisation
2. **Veraltete Docs** - Identifikation & Konsolidierung
3. **Design-Referenzen** - Extraktion aus fertigen Seiten (/home, /dashboard)
4. **Konsistenz-Checks** - Code ↔ Docs Synchronisation
5. **Automatische Sortierung** - Nach Priorität & Relevanz

---

## 🏗️ ARCHITEKTUR

### Edge Function: `manage-docs`

```typescript
POST /functions/v1/manage-docs
{
  "action": "analyze" | "update" | "validate" | "sync-design",
  "docs": {
    "filename.md": "content...",
    ...
  },
  "designReferences": {
    "home": "...",
    "dashboard": "..."
  }
}
```

### AI-Modell Configuration

- **Modell:** `google/gemini-2.5-flash` (via Lovable AI)
- **Temperature:** 0.3 (konsistente Strukturierung)
- **Max Tokens:** 4096
- **System Prompt:** Spezialisiert auf Doc-Management

---

## 📋 VERWENDUNG

### 1. Dokumentations-Analyse

```typescript
const response = await supabase.functions.invoke('manage-docs', {
  body: {
    action: 'analyze',
    docs: {
      'FEHLER_LOG_V18.5.1.md': '...',
      'APP_PAGE_TEMPLATE_V18.5.1.md': '...'
    }
  }
});

// Response:
{
  "analysis": "...",
  "recommendations": ["Update version X", "Merge Y with Z"],
  "updates": {},
  "designConsistency": { "status": "ok", "issues": [] }
}
```

### 2. Design-Synchronisation

```typescript
const response = await supabase.functions.invoke("manage-docs", {
  body: {
    action: "sync-design",
    designReferences: {
      home: homePageCode,
      dashboard: dashboardCode,
      header: headerCode,
      footer: footerCode,
    },
  },
});

// Response: Aktualisierte Design-Vorgaben in Docs
```

### 3. Automatische Validierung

```typescript
const response = await supabase.functions.invoke("manage-docs", {
  body: {
    action: "validate",
    docs: allDocFiles,
  },
});

// Response: Konsistenz-Check-Ergebnisse
```

---

## 🔒 DESIGN-REFERENZEN (MASTER)

Der AI Agent kennt die folgenden Master-Referenzen:

### /home (Marketing-Design)

- Buttons: MarketingButton mit Varianten
- Badges: CI-Colors (#EADEBD, #323D5E)
- Typography: Headline-Styles mit Line-Break-System
- Colors: HSL-basiert, keine direkten Farben

### /dashboard (App-Design)

- KPIs: PageHeaderWithKPIs + KPIGenerator
- Cards: Shadcn Cards mit h-full
- Layout: 12-Column Grid (8 cols + 4 cols)
- Spacing: gap-4 lg:gap-6, space-y-6 sm:space-y-8

### Header/Footer

- **MASTER:** Nur /home ist korrekt implementiert
- Farben: bg-primary, text-foreground
- Logo: max-w-[140px] sm:max-w-[180px]

---

## 🔄 WORKFLOW-INTEGRATION

### NeXify Workflow V18.5.1

**Phase 1: Code-Audit**

1. Fehler identifizieren
2. **NEU:** Doc-AI konsultieren (Referenzen prüfen)
3. Erkenntnisse dokumentieren

**Phase 3: Implementation**

1. Code ändern
2. **NEU:** Doc-AI Update triggern (automatische Sync)
3. Dokumentation aktualisiert

### Automatische Trigger

Der Doc-AI wird automatisch aufgerufen bei:

- Neuen Fehler-Reports (FEHLER_LOG_V18.5.1.md)
- Design-Änderungen (DESIGN_SYSTEM_V18_5_0.md)
- Neuen Seiten (APP_PAGE_TEMPLATE_V18.5.1.md)

---

## 📊 ERFOLGS-METRIKEN

| Metrik         | Ziel | Status        |
| -------------- | ---- | ------------- |
| Doc-Konsistenz | 100% | 🔄 Monitoring |
| Veraltete Docs | 0    | 🔄 Monitoring |
| Design-Sync    | 100% | 🔄 Monitoring |
| Response-Zeit  | < 5s | ✅ OK         |

---

## 🚀 NÄCHSTE SCHRITTE

1. **Frontend-Integration** - React Hook für Doc-AI Calls
2. **Automatische Cron-Jobs** - Tägliche Konsistenz-Checks
3. **Versionierung** - Git-Integration für Doc-Updates
4. **Dashboard** - Doc-Health-Status im Admin-Bereich

---

**Version:** 18.5.1  
**Datum:** 2025-10-24  
**Status:** 🟢 Production-Ready
