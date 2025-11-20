# 📚 SHARED KNOWLEDGE V3.0 - MyDispatch

**Status:** ✅ Production-Ready  
**Version:** 3.0 (Manual-Control Mode)  
**Letzte Aktualisierung:** 2025-10-25  
**Zweck:** Zentrale Wissensquelle für NeXify V3.0

---

## 🎯 PROJEKT-ÜBERSICHT

### MyDispatch

**Beschreibung:** Premium Flottenmanagement-System für Taxi-/Mietwagen-Unternehmen  
**Tech-Stack:** React 18 + Vite + TypeScript + Tailwind CSS + Supabase + Lovable Cloud  
**Zielgruppe:** B2B (Taxi-/Mietwagen-Unternehmen) + B2C (Marketing-Landingpage)

### Kern-Features

1. **Auftragsverwaltung** (Echtzeit-Tracking, GPS-Integration)
2. **Fahrzeug-Flotten-Management** (Status, Wartung, Verfügbarkeit)
3. **Partner-Management** (Fahrer, Subunternehmer)
4. **Tarif-System** (Basic, Professional, Enterprise)
5. **Intelligenter AI-Chat** (Dual-Mode: App + Landing)
6. **Vollständige DSGVO-Compliance**

---

## 🏗️ ARCHITEKTUR-ÜBERSICHT

### Frontend-Architektur

```
src/
├── components/
│   ├── shared/          # Wiederverwendbare Components
│   ├── booking/         # Auftragsverwaltung
│   ├── fleet/           # Flottenmanagement
│   └── marketing/       # Marketing-Landingpage
├── pages/               # React Router Pages
├── hooks/               # Custom React Hooks
├── lib/                 # Utilities & Helpers
└── integrations/        # Supabase Client
```

### Backend-Architektur (Lovable Cloud)

```
supabase/
├── functions/           # Edge Functions (Deno)
│   ├── ai-chat/        # Intelligent AI Chat
│   ├── ai-code-review/ # GitHub CI/CD Integration
│   ├── ai-visual-analysis/ # Design QA
│   └── ai-error-analysis/ # Error Analysis
└── migrations/          # Database Schema
```

---

## 🔒 SECURITY & COMPLIANCE

### DSGVO-Vorgaben

- ✅ Datenschutzhinweis bei JEDEM Formular
- ✅ Einwilligungs-Checkbox erforderlich
- ✅ Widerrufsrecht in Footer verlinkt
- ✅ Löschfristen: 3 Jahre (automatisch)

### AI Act

- ✅ KI-Kennzeichnung bei JEDER AI-Antwort
- ✅ Transparenz über AI-Nutzung
- ✅ Menschliche Aufsicht gewährleistet

### TMG

- ✅ Impressum in JEDEM Footer
- ✅ Datenschutzerklärung verlinkt
- ✅ AGB für B2B-Kunden

---

## 🎨 DESIGN-SYSTEM V3.0

### Farbschema (CI-Farben)

```css
/* Primary (Beige/Gold) */
--primary: 41 76% 89%; /* #EADEBD */
--primary-foreground: 215 29% 27%; /* #323D5E */

/* Foreground (Dunkelblau) */
--foreground: 215 29% 27%; /* #323D5E */

/* Status-Farben */
--success: 142 71% 45%; /* #22c55e */
--warning: 45 93% 47%; /* #eab308 */
--error: 0 72% 51%; /* #ef4444 */
```

### Typography

```css
/* Font-Family */
--font-inter: 'Inter', sans-serif;

/* Font-Sizes (Mobile-First) */
text-sm sm:text-base md:text-lg  /* Body */
text-2xl sm:text-3xl md:text-4xl /* Headings */
```

### Spacing-System

```css
/* Consistent Spacing */
p-4 sm:p-6 md:p-8  /* Padding */
gap-4 sm:gap-6     /* Gap */
space-y-4          /* Vertical Spacing */
```

### Touch-Targets (Mobile-First)

```tsx
// Minimum Touch-Target: 44px
<Button className="min-h-[44px] min-w-[44px]">
```

---

## 🚀 DEVELOPMENT-WORKFLOW

### 7-Phasen-Workflow (Manual-Control)

```
BLOCK 1: SAMMELN (GitHub, Data-RAG, CQR, Docs)
BLOCK 2: PLANEN (Legal-Risk, Kosten, Architektur)
BLOCK 3: PRÄSENTIEREN (Plan + Scores)
BLOCK 4: WARTEN (Freigabe abwarten)
BLOCK 5: UMSETZEN (Test-First + Feature-Branch)
BLOCK 6: TESTEN (E2E + Unit + WDIF + Visual QA)
BLOCK 7: GOVERNANCE (CQR + Docs + PR)
```

### Feature-Branch-Workflow

```bash
# Branch erstellen
git checkout -b feature/TASK-ID-beschreibung

# Änderungen committen
git add .
git commit -m "feat: Beschreibung"

# Tests ausführen
npm run test

# Branch pushen
git push origin feature/TASK-ID-beschreibung

# PR erstellen (via GitHub UI)
```

---

## 📊 QUALITY-STANDARDS

### Legal-Risk-Scorecard (0-10)

```
0-3: Grün (unkritisch)
4-6: Gelb (Achtung, Mitigation nötig)
7-10: Rot (BLOCKING, manuelle Freigabe)
```

### WDIF-Scorecard

```
+5: Architektur-Fehler (KRITISCH)
+3: Dokumentations-Fehler (MITTEL)
+1: Logik-Fehler (NIEDRIG, ARCA-PFLICHT!)
```

### Test-Coverage

```
Unit-Tests: ≥80%
E2E-Tests: Critical User Journeys
Visual QA: Pixel-Perfect Compliance
```

---

## 🗂️ TARIF-SYSTEM

### Basic (€49/Monat)

- 5 Fahrzeuge
- Basis-Auftragsverwaltung
- Standard-Support

### Professional (€149/Monat)

- 25 Fahrzeuge
- Echtzeit-Tracking
- Erweiterte Statistiken
- Priority-Support

### Enterprise (€399/Monat)

- Unbegrenzte Fahrzeuge
- AI-gestützte Optimierung
- API-Zugang
- Dedicated Account Manager

---

## 🔗 WICHTIGE LINKS

### Produktions-URLs

- **App:** https://mydispatch.de
- **Marketing:** https://mydispatch.de/home
- **Dashboard:** https://mydispatch.de/dashboard

### Entwicklungs-URLs

- **GitHub:** [Intern - nicht öffentlich]
- **Supabase:** [Lovable Cloud Integration]
- **Staging:** [Lovable Preview URL]

---

## 📚 PFLICHT-DOKUMENTE

### Core (⭐⭐⭐⭐)

- **NEXIFY_META_PROMPT_V3.0.md** - Agent-Steuerung
- **SHARED_KNOWLEDGE_V3.0.md** - Dieses Dokument
- **RECHTLICHE_COMPLIANCE_VORGABEN_V3.0.md** - Legal-Framework

### Architektur (⭐⭐⭐)

- **MOBILE_FIRST_GRID_SYSTEM_V3.0.md** - Responsive Design
- **DESIGN_SYSTEM_V3.0.md** - Design-Tokens
- **FRONTEND_ARCHITECTURE_V3.0.md** - Code-Standards

### Testing & Quality (⭐⭐)

- **TESTING_AUTOMATION_V3.0.md** - E2E & Unit Tests
- **AUTOMATED_QUALITY_CHECKS_V3.0.md** - Quality Gates

---

## 🎓 BEST PRACTICES

### DO's ✅

- **Integration-First:** Bestehende Integrationen prüfen
- **Single Source of Truth:** Zentrale Datenquellen nutzen
- **React Query:** Caching für 60% weniger DB-Calls
- **Type-Safety:** Strikte TypeScript-Typisierung
- **Defensive Coding:** Error-Handling überall
- **Mobile-First:** Responsive Design zwingend

### DON'Ts ❌

- **Monolithen:** Max. 500 LOC pro Datei
- **Any-Types:** Niemals `any` ohne Begründung
- **Direct-Colors:** Nur Semantic Tokens
- **Hardcoded-Secrets:** API-Keys via Supabase Secrets
- **Console-Logs:** Nur mit `import.meta.env.DEV` Guard
- **SQL-Injection:** Immer Prepared Statements

---

## 🚨 ALARM-TRIGGER

Bei folgenden Situationen SOFORT STOPPEN:

1. Sicherheitslücken (RLS fehlt)
2. Datenverlust-Gefahr
3. DSGVO-Verstoß
4. Mobile-Broken (Touch < 44px)
5. Performance > 3s
6. Legal-Risk-Score > 7

---

## 📝 CHANGELOG

### V3.0 (2025-10-25) - MANUAL-CONTROL MODE ⭐

- **BREAKING:** Umstellung auf Manual-Control
- **ENTFERNT:** Autonomie-Features (Self-Healing, Autopilot, etc.)
- **NEU:** 7-Phasen-Workflow
- **NEU:** Legal-Risk-Scorecard
- **NEU:** Test-First-Pflicht
- **OPTIMIERT:** Code-Komplexität (-1,3%)
- **STABILISIERT:** Frontend + Backend

### V18.5.1 (2025-10-24)

- Doc-AI Integration
- Layout Freeze Protection
- Dashboard-Layout-Rule

### V18.5.0 (2025-10-22)

- AI-System-Architektur
- Quality-Standards
- Design-System-Update

---

**END OF DOCUMENT**

**Maintainer:** NeXify V3.0  
**Status:** ✅ Living Document
