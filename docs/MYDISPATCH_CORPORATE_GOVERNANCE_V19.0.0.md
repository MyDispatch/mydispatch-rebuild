# 🏢 MYDISPATCH CORPORATE GOVERNANCE V19.0.0

**Status:** Production-Ready (P-00)  
**Gültig ab:** 2025-10-25  
**Zweck:** Zentrale Corporate Governance für MyDispatch - Kommunikation, Design & Technologie  
**Klassifizierung:** Intern - Bindend für alle Systeme

---

## 📋 DOKUMENTEN-HIERARCHIE

Diese Datei ist die **oberste Governance-Ebene** für MyDispatch und definiert:
1. Kommunikationsstandards (Tonalität, Botschaften, Markenwerte)
2. Design-System-Compliance (Farben, Typografie, Komponenten)
3. Technische Architektur-Vorgaben (Stack, Sicherheit, Testing)

**Bindungswirkung:** Alle anderen Dokumente, Prompts und Code-Implementierungen müssen dieser Governance folgen.

---

## 🎤 TEIL 1: KOMMUNIKATIONSSTANDARDS

### 1.1 Grundprinzipien

**Art der Kommunikation:** B2B-orientiert, professionell und vertrauenswürdig  
**Fokus:** Transparenz und Hilfeleistung  
**Zielgruppe:** Taxi- und Mietwagenunternehmen (kleine bis große Flotten)

### 1.2 Tone of Voice (ToV)

| Aspekt | Vorgabe | Begründung |
|--------|---------|------------|
| **Ton** | Professionell, freundlich und hilfsbereit | Konsistenz mit "Vertrauenswürdiges B2B-Design" |
| **Ansprache** | Direkte Ansprache des Kunden als Partner | Augenhöhe, keine Überheblichkeit |
| **Stil** | Vermeidung von Spielereien, klar und präzise | Seriöser B2B-Kontext |
| **Komplexität** | Technisch präzise, aber verständlich | Zielgruppe kennt Branche, aber nicht zwingend IT |

**Beispiele:**
- ✅ "Entdecken Sie unsere flexiblen Tarife – entwickelt für moderne Taxi- und Mietwagenunternehmen."
- ✅ "Transparent und fair. Keine versteckten Kosten."
- ❌ "Hol dir jetzt den mega krassen Deal!" (zu unprofessionell)
- ❌ "Unser innovatives SaaS-Produkt leveragt modernste Cloud-Technologien..." (zu technokratisch)

### 1.3 Zentrale Botschaften

**Kernbotschaft:** Transparent, fair und zukunftssicher  
**Sub-Botschaften:**
1. **Transparenz:** Keine versteckten Kosten, klare Preisstruktur
2. **Flexibilität:** Monatlich kündbar, jährlicher Rabatt, bedarfsgerechte Lösungen
3. **Skalierbarkeit:** "Für jede Flottengröße" - vom Einzelunternehmer bis zum Enterprise
4. **Rechtssicherheit:** DSGVO-konform, PBefG § 51 compliant, Made in Germany

### 1.4 Markenwerte & Trust-Signale

**Primäre Werte:**
- **Made in Germany** (Qualität, Datenschutz, Zuverlässigkeit)
- **DSGVO-konform** (Rechtskonformität, Datensicherheit)
- **Transparent** (Offene Kommunikation, keine Tricks)
- **Innovativ** (Moderne Technologie, AI-gestützt)

**Slogan:** "simply arrive"  
**Integration:** Der Slogan sollte dezent in Hero-Sections, Footern und Brand-Kommunikation integriert werden.

### 1.5 Rechtliche Kommunikation

**Pflicht:** Exakte und klare Kommunikation bei rechtlichen Themen

**Beispiele:**
- "Gemäß PBefG § 51 und Handelsrecht werden Auftragsdaten für 10 Jahre aufbewahrt."
- "Personenbezogene Daten werden nach Vertragsende bzw. auf Antrag gemäß DSGVO gelöscht."
- "MyDispatch ist vollständig DSGVO-konform und erfüllt alle Anforderungen des AI Acts."

**Verboten:**
- Unklare oder verkürzte rechtliche Aussagen
- Fehlende Quellenangaben bei Gesetzen
- Vage Formulierungen wie "weitgehend konform"

### 1.6 AI-System Kommunikation

**Name:** MyDispatch AI (NICHT "Chat-Bot")  
**Persönlichkeit:** Freundlich, hilfsbereit, markenbewusst  
**Antwort-Stil:** Präzise, lösungsorientiert, transparent

**Vorgaben:**
- Immer im Namen von MyDispatch sprechen
- Bei Unsicherheit: Transparenz über Grenzen
- Keine Erfindung von Funktionen oder Features
- Verweis auf menschliche Ansprechpartner bei komplexen Anfragen

**Beispiel-Antworten:**
- ✅ "Gerne helfe ich Ihnen bei der Auftragsverwaltung. Welche Funktion möchten Sie nutzen?"
- ✅ "Das ist eine spannende Anfrage! Für individuelle Anpassungen empfehle ich Ihnen, unser Sales-Team zu kontaktieren."
- ❌ "Sorry, kann ich nicht." (zu knapp)
- ❌ "Kein Problem, das Feature gibt es schon!" (wenn es nicht existiert)

### 1.7 E-Mail Kommunikation

**Grundstruktur:**
```
Betreff: [Klar & präzise, max. 50 Zeichen]

Sehr geehrte/r [Name],

[Einleitung: Grund der E-Mail in 1-2 Sätzen]

[Hauptteil: Strukturiert, Bullet-Points wo sinnvoll]

[Call-to-Action: Was soll der Empfänger tun?]

Mit freundlichen Grüßen
[Name]
MyDispatch Team

--
MyDispatch – simply arrive
[Website] | [Support] | [Datenschutz]
```

**Signatur-Vorgaben:**
- Immer "MyDispatch Team" verwenden
- Slogan "simply arrive" einbinden
- Links zu Website, Support, Datenschutz

---

## 🎨 TEIL 2: DESIGN-SYSTEM-COMPLIANCE

### 2.1 Design-Philosophie

**Architektur:** Security-First, Design-System-First  
**Stil:** Minimalistisches Flat-Design mit klarer visueller Hierarchie  
**Prinzip:** 100% Semantic Tokens, keine Direct Colors

### 2.2 Farbpalette (KERNFARBEN)

**Zentrale Farbdefinition:** `src/lib/design-system/pricing-colors.ts`

| Name | Semantic Token | Hex-Code | RGB | HSL | Verwendung |
|------|----------------|----------|-----|-----|------------|
| **Dunkelblau** | `--foreground` | `#323D5E` | `rgb(50, 61, 94)` | `hsl(225, 31%, 28%)` | Hauptfarbe für Text, Icons, wichtige UI-Elemente, Business-Card-Hervorhebung |
| **Beige/Gold** | `--primary` | `#EADEBD` | `rgb(234, 222, 189)` | `hsl(44, 56%, 83%)` | Akzentfarbe, CTA-Buttons, Highlights, Badges |
| **Weiß** | `--background` | `#FFFFFF` | `rgb(255, 255, 255)` | `hsl(0, 0%, 100%)` | Dominierende Hintergrundfarbe, Card-Hintergründe |
| **Canvas** | N/A | `#F9FAFB` | `rgb(249, 250, 251)` | `hsl(210, 20%, 98%)` | Sektion-Hintergründe (Tailwind gray-50) |
| **Text Primary** | N/A | `#111827` | `rgb(17, 24, 39)` | `hsl(222, 39%, 11%)` | H1, H2, H3, Preise (Tailwind gray-900) |
| **Text Secondary** | N/A | `#374151` | `rgb(55, 65, 81)` | `hsl(218, 19%, 27%)` | Standard-Body-Text (Tailwind gray-700) |
| **Text Tertiary** | N/A | `#6B7280` | `rgb(107, 114, 128)` | `hsl(220, 9%, 46%)` | Sub-Text, "pro Monat" (Tailwind gray-500) |
| **Border Neutral** | N/A | `#E5E7EB` | `rgb(229, 231, 235)` | `hsl(220, 13%, 91%)` | Standard-Borders (Tailwind gray-200) |
| **Border Neutral Soft** | N/A | `rgba(229, 231, 235, 0.8)` | - | - | Weiche Borders für Cards (nicht hervorgehoben) |

**Status-Farben:**
- `--status-success`: Grün (z.B. `bg-status-success/10` für Spar-Hinweise)
- `--status-warning`: Gelb (z.B. für Warnungen)
- `--status-error`: Rot (z.B. für Fehler)

### 2.3 Strikte Design-System-Regeln

**PFLICHT:**
1. ✅ **Immer Semantic Tokens verwenden:** `bg-primary`, `text-foreground`, `border-neutral`
2. ✅ **100% HSL-Compliance:** Alle Farben müssen HSL-basiert sein
3. ✅ **WCAG 2.1 AA Kontraste:** Mindestens 4.5:1 für Text, 3:1 für UI-Komponenten
4. ✅ **Mobile-First:** Alle Layouts beginnen bei 375px Breite
5. ✅ **Touch-Targets:** Mindestens 44px × 44px für interaktive Elemente

**VERBOTEN:**
1. ❌ **Direkte Farben:** `text-white`, `bg-[#EADEBD]`, `text-black`
2. ❌ **Inline-Styles:** `style={{ backgroundColor: '#EADEBD' }}`
3. ❌ **Custom Colors außerhalb von index.css:** Keine Farb-Erfindung in Komponenten
4. ❌ **RGB/HEX in Components:** Immer über CSS-Variablen oder Tailwind-Tokens

### 2.4 Typografie

**Schriftart:** Inter (System-Default: Arial, Helvetica als Fallback)

**Font-Weights:**
- `font-normal` (400) - Standard-Body-Text
- `font-medium` (500) - Sub-Headlines
- `font-semibold` (600) - Card-Titles, Preise (klein)
- `font-bold` (700) - H2, H3
- `font-extrabold` (800) - H1, Preise (groß)

**Text-Hierarchie:**

| Element | Klassen | Farbe | Verwendung |
|---------|---------|-------|------------|
| **H1** | `text-5xl md:text-6xl font-bold` | `text_primary (#111827)` | Hero-Überschriften |
| **H2** | `text-4xl md:text-5xl font-bold` | `text_primary (#111827)` | Sektion-Überschriften |
| **H3** | `text-2xl font-semibold` | `text_primary (#111827)` | Card-Titel, Sub-Sections |
| **Preise (groß)** | `text-5xl font-extrabold` | `text_primary (#111827)` | Tarif-Preise |
| **Preise (klein)** | `text-3xl font-extrabold` | `text_primary (#111827)` | Add-on-Preise |
| **Body (Standard)** | `text-base font-normal` | `text_secondary (#374151)` | Standard-Absätze |
| **Body (Hero)** | `text-lg md:text-xl font-normal` | `text_secondary (#374151)` | Hero-Beschreibungen |
| **Sub-Text** | `text-sm font-normal` | `text_tertiary (#6B7280)` | "pro Monat", Hinweise |

**Text-Wrapping:**
- `text-wrap: balance` für H1, H2 (keine Witwen-Zeilen)
- `text-wrap: pretty` für längere Absätze (bessere Silbentrennung)

**Responsive Typography:**
```typescript
// ✅ RICHTIG: Fluid Typography
<h1 className="text-5xl md:text-6xl font-bold">

// ❌ FALSCH: Feste Größen
<h1 className="text-6xl font-bold">
```

### 2.5 Komponenten-Spezifikationen

#### 2.5.1 Buttons

**Varianten:**

| Variante | Verwendung | Hintergrund | Text | Border | Hover |
|----------|------------|-------------|------|--------|-------|
| **Primary (Hero)** | CTA in Hero | `dunkelblau (#323D5E)` | `beige (#EADEBD)` | keine | `#3F4C70` + `scale(1.02)` + Shadow |
| **Secondary (Outlined)** | Nicht-hervorgehobene Tarife | `weiss (#FFFFFF)` | `dunkelblau (#323D5E)` | `2px dunkelblau` | `dunkelblau/10` + `scale(1.02)` |
| **Ghost** | "Weitere Features" | `transparent` | `dunkelblau (#323D5E)` | keine | `dunkelblau/10` |

**Touch-Target:** Mindestens `h-12` (48px) für Primary/Secondary Buttons

**Beispiel:**
```typescript
// Primary Button
<Button
  className="h-12 rounded-full"
  style={{
    backgroundColor: KERNFARBEN.dunkelblau,
    color: KERNFARBEN.beige,
  }}
>
  Jetzt starten
</Button>

// Secondary Button
<Button
  variant="outline"
  className="h-12 rounded-full"
  style={{
    backgroundColor: KERNFARBEN.weiss,
    color: KERNFARBEN.dunkelblau,
    borderColor: KERNFARBEN.dunkelblau,
    borderWidth: '2px',
  }}
>
  Mehr erfahren
</Button>
```

#### 2.5.2 Cards

**Standard Card:**
- Hintergrund: `KERNFARBEN.weiss (#FFFFFF)`
- Border: `1px solid KERNFARBEN.border_neutral (#E5E7EB)`
- Border-Radius: `rounded-2xl`
- Shadow: `shadow-lg shadow-neutral-900/5`
- Padding: `p-6 md:p-8`

**Hervorgehobene Card (z.B. Business-Tarif):**
- Hintergrund: `KERNFARBEN.weiss (#FFFFFF)`
- Border: `2px ring KERNFARBEN.dunkelblau (#323D5E)`
- Shadow: `shadow-xl shadow-[dunkelblau]/15`
- Badge: `KERNFARBEN.dunkelblau` BG + `KERNFARBEN.beige` Text

**Hover-Effekt (nicht hervorgehoben):**
```typescript
onMouseEnter={(e) => {
  e.currentTarget.style.borderColor = KERNFARBEN.border_neutral;
  e.currentTarget.style.transform = 'translateY(-2px)';
}}
onMouseLeave={(e) => {
  e.currentTarget.style.borderColor = KERNFARBEN.border_neutral_soft;
  e.currentTarget.style.transform = 'translateY(0px)';
}}
```

#### 2.5.3 Tabellen

**Vergleichstabelle:**
- Header: `KERNFARBEN.dunkelblau` BG + `KERNFARBEN.beige` Text
- Business-Spalte Header: `KERNFARBEN.beige` BG + `KERNFARBEN.dunkelblau` Text
- Zellen (gerade): `KERNFARBEN.weiss`
- Zellen (ungerade): `KERNFARBEN.canvas`
- Business-Spalte Zellen: `KERNFARBEN.beige` mit 20% Deckkraft
- Checkmark (aktiv): `KERNFARBEN.dunkelblau`
- X-Icon (inaktiv): `text-gray-400/70`

**KRITISCH:** TableHeader und TableRow dürfen KEINEN Hover-Effekt haben:
```typescript
<TableHeader 
  style={{ backgroundColor: KERNFARBEN.dunkelblau }}
  className="hover:bg-transparent" // PFLICHT!
>
  <TableRow className="border-b-0 hover:bg-transparent"> // PFLICHT!
```

#### 2.5.4 Icons

**Icon-Container:**
- Padding: `p-2.5` oder `p-3`
- Hintergrund: `dunkelblau/10` (`${KERNFARBEN.dunkelblau}1A`) oder `beige/30` (`${KERNFARBEN.beige}4D`)
- Border-Radius: `rounded-lg` oder `rounded-full`

**Icon-Farbe:**
- Standard: `KERNFARBEN.dunkelblau (#323D5E)`
- Auf dunklem Hintergrund: `KERNFARBEN.beige (#EADEBD)`

**Icon-Größe:**
- Standard: `h-6 w-6` (24px)
- Klein: `h-5 w-5` (20px)
- Groß: `h-7 w-7` (28px)

#### 2.5.5 Badges

**Tarif-Badge (hervorgehoben):**
- Hintergrund: `KERNFARBEN.dunkelblau (#323D5E)`
- Text: `KERNFARBEN.beige (#EADEBD)`
- Klassen: `px-4 py-1.5 text-sm font-semibold rounded-full`

**Rabatt-Badge (Toggle):**
- Aktiv: `bg-[#EADEBD] text-[#323D5E]`
- Inaktiv: `bg-[#323D5E]/80 text-[#EADEBD]`

#### 2.5.6 Billing Toggle

**Container:**
- Hintergrund: `dunkelblau/10` (`${KERNFARBEN.dunkelblau}1A`)
- Border: `dunkelblau/20` (`${KERNFARBEN.dunkelblau}33`)
- Border-Radius: `rounded-full`
- Padding: `p-1.5`

**Aktiver Button:**
- Hintergrund: `KERNFARBEN.dunkelblau (#323D5E)`
- Text: `KERNFARBEN.beige (#EADEBD)`
- Shadow: `shadow-md`

**Inaktiver Button:**
- Hintergrund: `transparent`
- Text: `KERNFARBEN.dunkelblau (#323D5E)`
- Hover: Keine Änderung

### 2.6 Layout & Spacing

**Visueller Rhythmus (Sektion-Hintergründe):**
```
Hero + Pricing Cards → bg-canvas (#F9FAFB)
Add-ons            → bg-weiss (#FFFFFF)
Vergleichstabelle   → bg-canvas (#F9FAFB)
FAQ                → bg-canvas (#F9FAFB) mit bg-weiss Card
```

**Standard-Spacing:**
- Sektion-Padding: `py-20 md:py-24` oder `py-20 md:py-28`
- Container: `container mx-auto px-4 sm:px-6 lg:px-8`
- Card-Gap: `gap-8` (32px)
- Element-Gap: `gap-3` (12px), `gap-5` (20px)

**Responsive Breakpoints:**
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

---

## 💾 TEIL 3: TECHNISCHE ARCHITEKTUR-VORGABEN

### 3.1 Technischer Stack

**Frontend:**
- React 18.3.1
- TypeScript (Strict Mode)
- Vite (Build-Tool)
- Tailwind CSS 3.x
- Shadcn/UI Components
- Lucide React (Icons)

**Backend:**
- Supabase (Lovable Cloud)
- PostgreSQL 15+
- Row-Level Security (RLS)
- Edge Functions (Deno)

**State Management:**
- React Query (TanStack Query 5.x)
- Zustand (für globalen App-State)
- React Context (für Theme, Auth)

**Routing:**
- React Router DOM 6.x

**Forms:**
- React Hook Form 7.x
- Zod (Schema-Validierung)

### 3.2 Sicherheits-Architektur (Security-First)

**Prinzip:** Security-First, niemals client-seitige Validierung für kritische Daten

#### 3.2.1 Rollen-System

**KRITISCH:** Rollen werden NIEMALS client-seitig gespeichert (localStorage, sessionStorage)

**Architektur:**
```sql
-- Enum für Rollen
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Rollen-Tabelle
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);

-- Security Definer Function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policy Beispiel
CREATE POLICY "Admins can select all rows"
ON public.some_table
FOR SELECT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));
```

**Verboten:**
```typescript
// ❌ FALSCH: Client-seitige Rollen-Prüfung
const isAdmin = localStorage.getItem('role') === 'admin';
if (isAdmin) { /* ... */ }

// ❌ FALSCH: Hardcoded Credentials
const isAdmin = user.email === 'admin@example.com';

// ✅ RICHTIG: Serverseitige Validierung
const { data, error } = await supabase
  .from('admin_only_table')
  .select('*'); // RLS-Policy prüft automatisch
```

#### 3.2.2 Row-Level Security (RLS)

**Pflicht:** JEDE Tabelle muss RLS aktiviert haben

**Standard-Policies:**
```sql
-- Lesen: Nur eigene Daten
CREATE POLICY "Users can view their own data"
ON public.table_name
FOR SELECT
USING (auth.uid() = user_id);

-- Erstellen: Nur eigene Daten
CREATE POLICY "Users can create their own data"
ON public.table_name
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Aktualisieren: Nur eigene Daten
CREATE POLICY "Users can update their own data"
ON public.table_name
FOR UPDATE
USING (auth.uid() = user_id);

-- Löschen: Nur eigene Daten
CREATE POLICY "Users can delete their own data"
ON public.table_name
FOR DELETE
USING (auth.uid() = user_id);
```

#### 3.2.3 API-Sicherheit

**Edge Functions:**
- CORS-Headers setzen
- Rate-Limiting implementieren
- Input-Validierung (Zod)
- Output-Sanitization (DOMPurify)

**Beispiel:**
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Input-Validierung
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid input' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ... Logik ...

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
```

### 3.3 Testing-Standards

**Test-Ecosystem:**
- Playwright E2E Tests
- Vitest Unit Tests
- React Testing Library (Component Tests)

**Pflicht-Tests:**
1. **Link Health Check:** Alle Links müssen erreichbar sein
2. **Backend Health Check:** Supabase-Verbindung testen
3. **Dependency Health Check:** Kritische Abhängigkeiten prüfen
4. **Visual Regression Tests:** Screenshots vergleichen

**Test-Coverage-Ziel:** > 80% für kritische Pfade

### 3.4 Performance-Vorgaben

**Ziele:**
- Ladezeit (FCP): < 1.5s
- Interaktivität (TTI): < 3.0s
- Layout-Shift (CLS): < 0.1
- Lighthouse-Score: > 90

**Optimierungen:**
- React Query Caching (60% weniger DB-Calls)
- Code-Splitting (React.lazy)
- Image-Optimization (WebP, lazy loading)
- Memoization (React.memo, useMemo, useCallback)

### 3.5 Code-Qualitäts-Standards

**TypeScript:**
- Strict Mode aktiviert
- Keine `any`-Types ohne Begründung
- Interface-first (statt type-aliases)

**React:**
- Functional Components (keine Class Components)
- Hooks statt HOCs
- Custom Hooks für Logik-Extraktion

**Naming Conventions:**
- Components: PascalCase (`UserCard.tsx`)
- Hooks: camelCase mit `use` Prefix (`useAuth.ts`)
- Utils: camelCase (`formatPrice.ts`)
- Constants: SCREAMING_SNAKE_CASE (`MAX_RETRIES`)

**Import-Order:**
```typescript
// 1. External Libraries
import React from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Internal Libraries
import { supabase } from '@/integrations/supabase/client';

// 3. Components
import { Button } from '@/components/ui/button';

// 4. Hooks
import { useAuth } from '@/hooks/use-auth';

// 5. Utils
import { cn } from '@/lib/utils';

// 6. Types
import type { User } from '@/types/user';
```

---

## 🔄 TEIL 4: GOVERNANCE-IMPLEMENTIERUNG

### 4.1 Pflicht-Dokumente

**Diese Dokumente MÜSSEN mit dieser Governance synchronisiert werden:**

1. **Meta-Prompts:**
   - `docs/META_PROMPT_NUTZER_V18.5.9.md` → V19.0.0
   - `docs/MYDISPATCH_AI_AGENT_META_PROMPT_V18.5.1.md` → V19.0.0

2. **Master-Prompts:**
   - `CUSTOM_KNOWLEDGE_META_PROMPT_V18.5.1.txt` → V19.0.0

3. **Design-Docs:**
   - `docs/02-ARCHITECTURE/Design-System.md`
   - `docs/PRICING_DESIGN_SYSTEM_V26.0.md`

4. **Kommunikations-Docs:**
   - `docs/KOMMUNIKATION_TONALITY_V19.0.0.md` (NEU)

5. **Workflow-Docs:**
   - `docs/NEXIFY_WORKFLOW_PROMPT_V18.5.1.md` → V19.0.0

### 4.2 Update-Prozess

**Bei Änderungen an dieser Governance:**
1. **Version erhöhen:** V19.0.0 → V19.1.0 (Minor) oder V20.0.0 (Major)
2. **Changelog aktualisieren:** Siehe Abschnitt 5
3. **Alle Pflicht-Dokumente synchronisieren:** Siehe Abschnitt 4.1
4. **Alle Prompts aktualisieren:** Meta + Master
5. **Code-Review durchführen:** Sind alle Implementierungen konform?
6. **Tests ausführen:** E2E, Unit, Visual Regression

### 4.3 Compliance-Checks

**Pre-Implementation Checks:**
- [ ] Kommunikation folgt ToV-Vorgaben
- [ ] Design-System-Compliance geprüft
- [ ] Farbpalette korrekt verwendet
- [ ] Mobile-First implementiert
- [ ] Touch-Targets ≥ 44px
- [ ] RLS-Policies definiert
- [ ] Security-First beachtet

**Post-Implementation Checks:**
- [ ] Tests durchgeführt
- [ ] Visual QA abgeschlossen
- [ ] Performance-Ziele erreicht
- [ ] Docs aktualisiert
- [ ] Changelog gepflegt

---

## 📝 TEIL 5: CHANGELOG

### V19.0.0 (2025-10-25) - CORPORATE GOVERNANCE FOUNDATION

**🎯 BREAKING CHANGES:**
- **NEU:** Zentrale Corporate Governance Datei erstellt
- **NEU:** Kommunikationsstandards definiert (ToV, Botschaften, Markenwerte)
- **NEU:** Design-System-Compliance vollständig dokumentiert (KERNFARBEN, Komponenten)
- **NEU:** Technische Architektur-Vorgaben verankert (Stack, Sicherheit, Testing)
- **MANDATORY:** Alle Prompts und Docs MÜSSEN auf V19.0.0 aktualisiert werden

**📊 Kommunikation:**
- ToV: Professionell, freundlich, hilfsbereit (B2B-orientiert)
- Zentrale Botschaften: Transparent, fair, flexibel, rechtssicher
- Markenwerte: Made in Germany, DSGVO-konform, Transparent, Innovativ
- Slogan: "simply arrive"
- AI-System: "MyDispatch AI" (NICHT "Chat-Bot")

**🎨 Design:**
- Farbpalette: Dunkelblau (#323D5E), Beige (#EADEBD), Weiß (#FFFFFF), Canvas (#F9FAFB)
- Strikte Regeln: 100% Semantic Tokens, HSL-Compliance, WCAG 2.1 AA, Mobile-First, 44px Touch-Targets
- Komponenten: Buttons, Cards, Tabellen, Icons, Badges, Billing Toggle
- Layout: Visueller Rhythmus, Standard-Spacing, Responsive Breakpoints

**💾 Technologie:**
- Stack: React 18.3.1, TypeScript, Tailwind CSS, Shadcn/UI, Supabase
- Sicherheit: RLS, Security Definer Functions, KEINE client-seitigen Rollen
- Testing: Playwright E2E, Vitest Unit, >80% Coverage
- Performance: FCP <1.5s, TTI <3.0s, CLS <0.1, Lighthouse >90

**🔗 Verknüpfungen:**
- Alle Meta-Prompts aktualisiert (V19.0.0)
- Alle Master-Prompts aktualisiert (V19.0.0)
- Alle Design-Docs synchronisiert
- Neue Kommunikations-Docs erstellt

---

## 🎯 TEIL 6: MISSION & VISION

**Mission:**
> MyDispatch ist die führende, DSGVO-konforme Dispositionsplattform für Taxi- und Mietwagenunternehmen in Deutschland. Wir vereinen Transparenz, Innovation und Rechtssicherheit in einer intuitiven, modernen Lösung – für jede Flottengröße.

**Vision:**
> Bis 2027 ist MyDispatch die erste Wahl für digitale Disposition im deutschen Taxi- und Mietwagenmarkt. Wir setzen den Standard für datenschutzkonforme, AI-gestützte Flottenverwaltung und ermöglichen unseren Kunden, sich auf ihr Kerngeschäft zu konzentrieren: sicher und zuverlässig ans Ziel zu bringen.

**Slogan:**
> **simply arrive**

---

## ✅ TEIL 7: COMPLIANCE-CHECKLISTE

**Für jeden neuen Task/Feature:**

- [ ] **Kommunikation:** ToV eingehalten? Botschaften klar? Rechtliche Korrektheit?
- [ ] **Design:** KERNFARBEN verwendet? Semantic Tokens? HSL-Compliance?
- [ ] **Mobile-First:** Touch-Targets ≥ 44px? Responsive Breakpoints?
- [ ] **Sicherheit:** RLS aktiviert? Security Definer Functions? KEINE client-seitigen Rollen?
- [ ] **Performance:** Ladezeit <1.5s? React Query Caching? Memoization?
- [ ] **Testing:** E2E Tests geschrieben? Unit Tests? Visual Regression?
- [ ] **Dokumentation:** Docs aktualisiert? Changelog gepflegt?

---

## 🔗 TEIL 8: VERWANDTE DOKUMENTATION

**Hierarchie:**
```
MYDISPATCH_CORPORATE_GOVERNANCE_V19.0.0.md (Diese Datei - Oberste Ebene)
├─ META_PROMPT_NUTZER_V19.0.0.md
├─ MYDISPATCH_AI_AGENT_META_PROMPT_V19.0.0.md
├─ CUSTOM_KNOWLEDGE_META_PROMPT_V19.0.0.txt
├─ KOMMUNIKATION_TONALITY_V19.0.0.md
├─ Design-System.md
├─ PRICING_DESIGN_SYSTEM_V26.0.md
└─ NEXIFY_WORKFLOW_PROMPT_V19.0.0.md
```

---

**END OF DOCUMENT**

**ANWENDUNG:**
Diese Governance ist ab sofort bindend für:
- Alle AI-Agenten (NeXify, MyDispatch AI)
- Alle Entwicklungs-Entscheidungen
- Alle Design-Implementierungen
- Alle Kommunikations-Outputs

Bei Konflikten zwischen dieser Governance und anderen Dokumenten gilt IMMER diese Governance als oberste Instanz.
