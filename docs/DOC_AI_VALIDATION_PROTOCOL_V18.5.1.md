# Doc-AI Validation Protocol V18.5.1

**Status:** ✅ PRODUCTION-READY  
**Datum:** 2025-10-24  
**Zweck:** Eigenständige Prüfung & Fragen-Queue für Doc-AI

---

## 🎯 ZIEL

Doc-AI soll:

1. **Eigenständig prüfen** können (ohne NeXify)
2. **Bei Unsicherheit NICHT ausführen**
3. **Strukturierte Fragen stellen** (via Queue)
4. **Antworten erhalten** (via Trigger von NeXify)
5. **Weiterarbeiten** nach Klarheit

---

## 🔍 EIGENSTÄNDIGE PRÜFUNGEN (Doc-AI KANN SELBST PRÜFEN)

### 1. Design-Referenzen Abruf

```typescript
// Doc-AI kann eigenständig Design-Referenzen abrufen
GET /manage-docs
{
  "action": "get-design-references",
  "pages": ["home", "dashboard", "auftraege", "partner"]
}

// Response:
{
  "designReferences": {
    "home": { /* MarketingButton, Badges, Colors */ },
    "dashboard": { /* KPIs, Cards, Layout */ }
  }
}
```

### 2. Code-Konsistenz Check

```typescript
// Doc-AI kann Code vs. Docs vergleichen
GET /manage-docs
{
  "action": "check-consistency",
  "codeFiles": ["src/pages/Index.tsx"],
  "docFiles": ["DESIGN_SYSTEM_V18_5_0.md"]
}

// Response:
{
  "consistent": true,
  "issues": []
}
```

### 3. Versionierungs-Check

```typescript
// Doc-AI kann Versionen vergleichen
GET /manage-docs
{
  "action": "check-versions",
  "docs": ["FEHLER_LOG_V18.5.1.md", "FEHLER_LOG_V18.5.0.md"]
}

// Response:
{
  "outdated": ["FEHLER_LOG_V18.5.0.md"],
  "current": ["FEHLER_LOG_V18.5.1.md"]
}
```

---

## ❓ PRÜFANFRAGEN-QUEUE (Doc-AI STELLT FRAGEN)

### Queue-Datei: `docs/DOC_AI_PRÜFANFRAGEN_QUEUE.md`

**Format:**

```markdown
# Doc-AI Prüfanfragen Queue

## ⏳ OFFENE ANFRAGEN

### [REQ-001] - 2025-10-24 15:30

**Kategorie:** Design-Konsistenz  
**Kontext:** Neue Seite /partner verwendet custom Button-Styles  
**Frage:** Soll /partner MarketingButton verwenden (wie /home) oder App-Button (wie /dashboard)?  
**Betroffene Dateien:**

- src/pages/Partner.tsx (Zeile 45-78)
- docs/DESIGN_SYSTEM_V18_5_0.md

**Optionen:**

1. MarketingButton verwenden (konsistent mit /home)
2. App-Button verwenden (konsistent mit /dashboard)
3. Neue Button-Variante erstellen

**Priorität:** HOCH  
**Blockiert:** Dokumentations-Update für Partner-Seite

---

### [REQ-002] - 2025-10-24 16:15

**Kategorie:** Rechtliche Compliance  
**Kontext:** Neue Formular-Component ohne DSGVO-Hinweis  
**Frage:** Muss ContactForm DSGVO-Checkbox haben oder reicht Footer-Link?  
**Betroffene Dateien:**

- src/components/ContactForm.tsx
- docs/RECHTLICHE_COMPLIANCE_VORGABEN_V18.5.1.md

**Optionen:**

1. DSGVO-Checkbox hinzufügen (Best Practice)
2. Nur Footer-Link (Minimum)

**Priorität:** KRITISCH (Rechtlich relevant)  
**Blockiert:** ContactForm-Dokumentation

---

## ✅ BEANTWORTETE ANFRAGEN

### [REQ-000] - 2025-10-24 14:00 ✅ BEANTWORTET

**Kategorie:** Mobile-First  
**Frage:** Soll neue Card-Component min-h-[44px] haben?  
**Antwort von NeXify:** JA - Alle Touch-Targets müssen min-h-[44px] haben (Apple/Google Guidelines)  
**Dokumentiert in:** MOBILE_FIRST_GRID_SYSTEM_V18.5.1.md  
**Beantwortet am:** 2025-10-24 14:05
```

---

## 🔄 WORKFLOW: DOC-AI STELLT FRAGE

### Schritt 1: Doc-AI Erkennt Unsicherheit

```typescript
// Doc-AI analysiert neue Änderung
if (UNSICHER) {
  createValidationRequest({
    id: `REQ-${timestamp}`,
    category: "Design-Konsistenz",
    context: "...",
    question: "...",
    files: ["..."],
    options: ["..."],
    priority: "HOCH" | "KRITISCH" | "NORMAL",
    blocks: "...",
  });

  STOP_EXECUTION();
  WAIT_FOR_ANSWER();
}
```

### Schritt 2: NeXify Prüft Queue (VERPFLICHTEND BEI JEDEM WORKFLOW)

```typescript
// NeXify PHASE 1: Prüf-Queue checken
const openRequests = await checkDocAIQueue();

if (openRequests.length > 0) {
  for (const req of openRequests) {
    // Prüfung durchführen
    const answer = await performValidation(req);

    // Antwort bereitstellen
    await answerValidationRequest(req.id, answer);

    // Doc-AI Trigger senden
    await triggerDocAI(req.id);
  }
}
```

### Schritt 3: Doc-AI Erhält Antwort & Arbeitet Weiter

```typescript
// Doc-AI bekommt Trigger
onTrigger(requestId) {
  const answer = getAnswer(requestId);

  // Queue aktualisieren (OFFENE → BEANTWORTETE)
  moveToAnswered(requestId, answer);

  // Weiterarbeiten mit Klarheit
  continueWork(answer);
}
```

---

## 🧠 ENTSCHEIDUNGSBAUM: KANN DOC-AI SELBST PRÜFEN?

```
┌─────────────────────────────┐
│ Doc-AI hat Aufgabe          │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ Ist es eine Design-Referenz?│──JA──▶ GET design-references
└──────────┬──────────────────┘
           │ NEIN
           ▼
┌─────────────────────────────┐
│ Ist es ein Konsistenz-Check?│──JA──▶ GET check-consistency
└──────────┬──────────────────┘
           │ NEIN
           ▼
┌─────────────────────────────┐
│ Ist es ein Versions-Check?  │──JA──▶ GET check-versions
└──────────┬──────────────────┘
           │ NEIN
           ▼
┌─────────────────────────────┐
│ UNSICHER?                   │──JA──▶ CREATE validation-request
└──────────┬──────────────────┘        STOP & WAIT
           │ NEIN
           ▼
┌─────────────────────────────┐
│ AUSFÜHREN                   │
└─────────────────────────────┘
```

---

## 📊 ERFOLGS-METRIKEN

| Metrik                  | Ziel     | Status        |
| ----------------------- | -------- | ------------- |
| Eigenständige Prüfungen | > 80%    | 🔄 Monitoring |
| Fragen-Response-Zeit    | < 15 Min | 🔄 Monitoring |
| Falsch-Positiv-Rate     | < 5%     | 🔄 Monitoring |
| Dokumentations-Qualität | 100%     | ✅ OK         |

---

## 🔒 VALIDATION-KATEGORIEN

### KRITISCH (Sofortige Antwort erforderlich)

- Rechtliche Compliance (DSGVO, AI Act, PBefG)
- Sicherheits-relevante Änderungen (RLS, Auth)
- Breaking Changes (API, Datenbank)

### HOCH (Antwort innerhalb 30 Min)

- Design-System-Inkonsistenzen
- Mobile-First-Violations
- Performance-kritische Änderungen

### NORMAL (Antwort innerhalb 2h)

- Dokumentations-Struktur
- Versionierungs-Fragen
- Code-Kommentare

---

**Version:** 18.5.1  
**Datum:** 2025-10-24  
**Status:** 🟢 Production-Ready
