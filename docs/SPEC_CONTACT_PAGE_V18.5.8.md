# 📧 CONTACT PAGE SPECIFICATION V18.5.8

**Status:** 📋 Spezifikation  
**Route:** `/kontakt`  
**Letzte Aktualisierung:** 2025-10-24  
**Verantwortlich:** NeXify AI Development Agent  
**Klassifizierung:** Marketing (ÖFFENTLICH)

---

## 📊 EXECUTIVE SUMMARY

### Zweck
Die Contact Page dient der **direkten Kontaktaufnahme** mit dem MyDispatch-Team für Sales, Support und Anfragen.

### Zielgruppe
- Interessenten (Pre-Sales-Anfragen)
- Bestehende Kunden (Support)
- Enterprise-Anfragen (Custom-Lösungen)
- Medien & Presse

### Kernbotschaft
> "Wir sind für Sie da. Kontaktieren Sie uns per E-Mail, Telefon oder Kontaktformular."

---

## 🏗️ ARCHITEKTUR-ENTSCHEIDUNGEN

### Layout
```typescript
Layout: MarketingLayout
Grid: FORM-GRID (2 Spalten Desktop, 1 Spalte Mobile)
Responsive: Mobile-First (3 Breakpoints: sm, md, lg)
```

### Component-Struktur
```typescript
const PageStructure = {
  Header: 'MarketingHeader',
  Sections: [
    'ContactHeroSection',        // Hero + Intro
    'ContactFormSection',        // Haupt-Kontaktformular
    'ContactMethodsSection',     // Alternative Kontaktmethoden
    'FAQContactSection',         // FAQs zu Kontakt/Support
    'LocationSection',           // Adresse & Map (optional)
  ],
  Footer: 'MarketingFooter',
};
```

---

## 📐 MOBILE-FIRST WIREFRAMES

### Mobile (375px)
```
┌─────────────────────────────────┐
│  [Logo]          [Menü ☰]       │
├─────────────────────────────────┤
│  HERO                           │
│  H1: Kontaktieren Sie uns       │
│  P: Wir helfen Ihnen gerne      │
├─────────────────────────────────┤
│  KONTAKTFORMULAR                │
│  ┌───────────────────────────┐ │
│  │ [Name]                    │ │ ← h-11
│  │ [E-Mail]                  │ │ ← h-11
│  │ [Betreff]                 │ │ ← h-11
│  │ [Nachricht (Textarea)]    │ │
│  │                           │ │
│  │ 🔒 Datenschutzhinweis     │ │
│  │                           │ │
│  │ [Absenden]                │ │ ← min-h-[44px]
│  └───────────────────────────┘ │
├─────────────────────────────────┤
│  ALTERNATIVE KONTAKTMETHODEN    │
│  📧 info@mydispatch.de          │
│  📞 +49 (0) 123 456789          │
│  💬 Live-Chat (Mo-Fr 9-18h)     │
├─────────────────────────────────┤
│  FAQ                            │
│  • Wie erreiche ich Support?    │
│  • Wann bekomme ich Antwort?    │
│  • Gibt es einen Live-Chat?     │
└─────────────────────────────────┘
```

### Desktop (1920px)
```
┌───────────────────────────────────────────────────┐
│  [Logo]      Features  Preise  Docs  Kontakt      │
├───────────────────────────────────────────────────┤
│  HERO (zentriert)                                 │
│  H1: Kontaktieren Sie uns                         │
│  P: Wir sind für Sie da. Per E-Mail, Telefon     │
│     oder Kontaktformular.                         │
├─────────────────┬─────────────────────────────────┤
│  FORMULAR       │  KONTAKTMETHODEN                │
│  ─────────      │  ──────────────                 │
│  [Name]         │  📧 E-Mail                      │
│  [E-Mail]       │  info@mydispatch.de             │
│  [Betreff]      │                                 │
│  [Nachricht]    │  📞 Telefon                     │
│                 │  +49 (0) 123 456789             │
│  🔒 Datenschutz │  Mo-Fr: 9:00-18:00 Uhr          │
│                 │                                 │
│  [Absenden]     │  💬 Live-Chat                   │
│                 │  Mo-Fr: 9:00-18:00 Uhr          │
│                 │                                 │
│                 │  📍 Adresse                     │
│                 │  Musterstraße 123               │
│                 │  12345 Musterstadt              │
└─────────────────┴─────────────────────────────────┘
```

---

## 🎨 COMPONENT-BREAKDOWN

### Neu zu erstellen
- [ ] `ContactHeroSection.tsx` (5min)
  - Kurz & einladend

- [ ] `ContactFormSection.tsx` (20min)
  - Formular mit Validation (react-hook-form + zod)
  - Fields: Name, E-Mail, Betreff, Nachricht
  - DSGVO-Hinweis (VERPFLICHTEND!)
  - Submit → Supabase Edge Function
  - Success-Toast
  - Error-Handling

- [ ] `ContactMethodsSection.tsx` (10min)
  - E-Mail (Copy-Button)
  - Telefon (Click-to-Call)
  - Live-Chat-Link (falls implementiert)
  - Adresse

- [ ] `FAQContactSection.tsx` (5min)
  - 3-5 Kontakt-spezifische FAQs

- [ ] `LocationSection.tsx` (Optional, 10min)
  - Adresse
  - Google Maps Embed (optional)

### Wiederverwendbar
- [x] `MarketingHeader`
- [x] `MarketingFooter`
- [x] `Input` (shadcn/ui)
- [x] `Textarea` (shadcn/ui)
- [x] `Button` (shadcn/ui)
- [x] `Label` (shadcn/ui)
- [x] `Card`

---

## 🔒 RECHTLICHE COMPLIANCE (KRITISCH!)

### DSGVO Art. 13 (VERPFLICHTEND!)
**KRITISCH:** Kontaktformular MUSS Datenschutzhinweis haben!

```tsx
// VERPFLICHTENDER Datenschutzhinweis
<div className="text-xs text-muted-foreground mt-4 p-3 bg-muted/50 rounded-lg">
  <p>
    🔒 Ihre Daten werden verschlüsselt übertragen und gemäß unserer{' '}
    <Link to="/datenschutz" className="text-primary hover:underline">
      Datenschutzerklärung
    </Link>
    {' '}verarbeitet. Sie können Ihre Einwilligung jederzeit widerrufen.
  </p>
</div>
```

### TMG § 5
- [x] Impressum-Link im Footer
- [x] Datenschutz-Link im Footer

### DSGVO Art. 6 (Rechtsgrundlage)
```typescript
// Datenspeicherung nur mit Einwilligung!
const handleSubmit = async (data) => {
  // Einwilligung wird durch Formular-Absendung erteilt
  // (Explizite Checkbox NICHT nötig, da Kontaktaufnahme freiwillig)
  
  await supabase
    .from('contact_inquiries')
    .insert({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      created_at: new Date().toISOString(),
      // IP-Adresse NICHT speichern (Datensparsamkeit!)
    });
};
```

### Datensparsamkeit (Art. 5 DSGVO)
```typescript
// ✅ NUR notwendige Daten erheben
interface ContactFormData {
  name: string;       // ✅ Notwendig für Antwort
  email: string;      // ✅ Notwendig für Antwort
  subject: string;    // ✅ Notwendig für Kategorisierung
  message: string;    // ✅ Notwendig für Anfrage
}

// ❌ NICHT erheben:
// - Telefonnummer (optional, nur wenn Nutzer will)
// - Adresse (nicht nötig)
// - IP-Adresse (nicht nötig)
// - Browser-Details (nicht nötig)
```

### Compliance-Matrix
```typescript
const ContactPageCompliance = {
  DSGVO: {
    datenschutzhinweis: true,   // VERPFLICHTEND!
    rechtsgrundlage: 'Art. 6 Abs. 1 lit. a (Einwilligung)',
    datensparsamkeit: true,     // Nur Name, E-Mail, Betreff, Nachricht
    speicherdauer: '3 Jahre',   // Nach Bearbeitung
  },
  TMG: {
    impressum: true,
    datenschutz: true,
  },
};
```

---

## 🔍 SEO-STRATEGIE

### Primary Keywords
- MyDispatch Kontakt
- MyDispatch Support
- MyDispatch E-Mail
- MyDispatch Telefon

### Meta-Tags
```html
<title>Kontakt – MyDispatch Support & Anfragen</title>
<meta 
  name="description" 
  content="Kontaktieren Sie MyDispatch per E-Mail, Telefon oder Kontaktformular. 
           Wir helfen Ihnen gerne bei Fragen zu unserer Software."
/>
```

---

## 📝 CONTENT-STRUKTUR

### Hero-Section
**H1:** "Kontaktieren Sie uns"
**P:** "Wir sind für Sie da. Ob Fragen zu unserer Software, Support-Anfragen oder Feedback – wir helfen Ihnen gerne."

### Kontaktformular
**Felder:**
1. **Name** (Pflicht)
   - Label: "Ihr Name"
   - Placeholder: "Max Mustermann"
   - Validation: Min. 2 Zeichen

2. **E-Mail** (Pflicht)
   - Label: "Ihre E-Mail-Adresse"
   - Placeholder: "max@example.com"
   - Validation: Gültige E-Mail

3. **Betreff** (Pflicht)
   - Label: "Betreff"
   - Placeholder: "Worum geht es?"
   - Validation: Min. 5 Zeichen

4. **Nachricht** (Pflicht)
   - Label: "Ihre Nachricht"
   - Placeholder: "Wie können wir Ihnen helfen?"
   - Validation: Min. 20 Zeichen
   - Rows: 6

**Datenschutzhinweis (VERPFLICHTEND!):**
```
🔒 Ihre Daten werden verschlüsselt übertragen und gemäß unserer 
Datenschutzerklärung verarbeitet. Sie können Ihre Einwilligung 
jederzeit widerrufen.
```

**Button:** "Nachricht absenden"

### Alternative Kontaktmethoden

#### 📧 E-Mail
**Label:** "E-Mail-Adresse"
**Wert:** info@mydispatch.de
**Aktion:** Copy-Button

#### 📞 Telefon
**Label:** "Telefon"
**Wert:** +49 (0) 123 456789
**Zeiten:** Mo-Fr: 9:00-18:00 Uhr
**Aktion:** Click-to-Call (Mobile)

#### 💬 Live-Chat
**Label:** "Live-Chat"
**Zeiten:** Mo-Fr: 9:00-18:00 Uhr
**Aktion:** Chat öffnen (falls implementiert)

#### 📍 Adresse
**Label:** "Postanschrift"
**Wert:**
```
RideHub Solutions GmbH
Musterstraße 123
12345 Musterstadt
Deutschland
```

### FAQ-Section
**H2:** "Häufig gestellte Fragen"

1. **Wie schnell erhalte ich eine Antwort?**  
   In der Regel innerhalb von 24 Stunden (Werktags).

2. **Gibt es einen Live-Chat?**  
   Ja, Mo-Fr von 9:00-18:00 Uhr.

3. **Kann ich telefonisch Support erhalten?**  
   Ja, für Business- und Enterprise-Kunden.

4. **Wo finde ich die Dokumentation?**  
   Unter [/docs](/docs) finden Sie alle Hilfe-Artikel.

5. **Wie kontaktiere ich den Enterprise-Sales?**  
   Per E-Mail an enterprise@mydispatch.de

---

## 🔧 BACKEND: EDGE FUNCTION

### Supabase Edge Function: `contact-form`

**File:** `supabase/functions/contact-form/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { name, email, subject, message } = await req.json();

    // Validation
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: 'Alle Felder sind Pflichtfelder' }),
        { status: 400 }
      );
    }

    // Supabase Client
    const supabaseUrl = Deno.env.get('VITE_SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Insert into DB
    const { error } = await supabase
      .from('contact_inquiries')
      .insert({
        name,
        email,
        subject,
        message,
        created_at: new Date().toISOString(),
      });

    if (error) throw error;

    // Optional: Send Email (via Resend, SendGrid, etc.)
    // await sendNotificationEmail({ name, email, subject, message });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Vielen Dank! Wir melden uns in Kürze.' 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Ein Fehler ist aufgetreten' }),
      { status: 500 }
    );
  }
});
```

### Datenbank-Tabelle: `contact_inquiries`

```sql
CREATE TABLE contact_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'new', -- new, in_progress, resolved
  resolved_at TIMESTAMPTZ,
  notes TEXT
);

-- RLS (Row Level Security)
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Policy: Nur Service-Role kann lesen/schreiben
-- (Contact-Form nutzt Service-Role-Key via Edge Function)
CREATE POLICY "Service role full access"
  ON contact_inquiries
  FOR ALL
  USING (auth.role() = 'service_role');

-- Index für Performance
CREATE INDEX idx_contact_inquiries_created_at 
  ON contact_inquiries(created_at DESC);
```

---

## 🎯 IMPLEMENTIERUNGS-ZEITPLAN

```yaml
ContactHeroSection:          5min
ContactFormSection:         20min
ContactMethodsSection:      10min
FAQContactSection:           5min
LocationSection (optional): 10min
Edge Function:              15min
DB-Migration:               10min
Integration & Testing:      10min
──────────────────────────────────
GESAMT:                     85min
```

---

## ✅ TESTING-CHECKLISTE

### Formular-Tests
- [ ] Validation funktioniert (Pflichtfelder)
- [ ] Submit → Edge Function → DB
- [ ] Success-Toast wird angezeigt
- [ ] Error-Handling funktioniert
- [ ] E-Mail-Format validiert

### DSGVO-Tests (KRITISCH!)
- [ ] Datenschutzhinweis sichtbar
- [ ] Link zu Datenschutzerklärung funktioniert
- [ ] Nur notwendige Daten erhoben
- [ ] Keine IP-Adresse gespeichert

### Responsive-Tests
- [ ] Mobile: Formular 1 Spalte
- [ ] Desktop: Formular + Kontaktmethoden 2 Spalten
- [ ] Touch-Targets ≥ 44px

### Accessibility-Tests
- [ ] Labels mit Inputs verbunden
- [ ] Error-Messages ARIA-konform
- [ ] Kontrast ≥ 4.5:1

---

## 🔗 VERWANDTE DOKUMENTATION

- **RECHTLICHE_COMPLIANCE_VORGABEN_V18.5.1.md** - DSGVO Art. 13 Pflichten
- **MOBILE_FIRST_GRID_SYSTEM_V18.5.1.md** - Form-Grid Pattern

---

## 📝 CHANGELOG

### V18.5.8 (2025-10-24)
- **ERSTELLT:** Contact Page Spezifikation
- **KRITISCH:** DSGVO Art. 13 Datenschutzhinweis VERPFLICHTEND!

---

**Version:** 18.5.8  
**Status:** 📋 SPECIFICATION - BEREIT FÜR IMPLEMENTIERUNG

**END OF DOCUMENT**
