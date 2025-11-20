# 📧 EMAIL-MARKETING-SYSTEM SPEZIFIKATION V18.5.0

**Status:** 🚧 In Entwicklung  
**Erstellt:** 2025-10-22  
**Compliance:** DSGVO, UWG, DIN 5008

---

## 🎯 ZIELSETZUNG

Automatisiertes, rechtssicheres Email-Marketing-System zur:

- Lead-Generierung durch Web-Scraping
- AI-generierte, personalisierte Mail-Templates
- DSGVO-konforme Kampagnen-Verwaltung
- Performance-Tracking & Optimierung

---

## 🏗️ ARCHITEKTUR

### FRONTEND-KOMPONENTEN

#### 1. Campaign Builder (`src/components/marketing/EmailCampaignBuilder.tsx`)

**Features:**

- Drag & Drop Template-Editor
- Zielgruppen-Segmentierung
- A/B-Test-Konfiguration
- Versand-Zeitplanung
- Preview für Desktop/Mobile

**Felder:**

```typescript
interface EmailCampaign {
  id: string;
  company_id: string;
  name: string;
  subject: string;
  preview_text: string;
  template_id: string;
  target_segment: string[];
  scheduled_at?: Date;
  status: "draft" | "scheduled" | "sending" | "sent" | "cancelled";
  ab_test_enabled: boolean;
  ab_variant_b_subject?: string;
  created_at: Date;
  updated_at: Date;
}
```

#### 2. Lead Scanner (`src/components/marketing/LeadScanner.tsx`)

**Features:**

- Web-URL-Eingabe
- Branchen-Filter
- Region-Filter
- Ergebnis-Preview
- Blacklist-Check
- DSGVO-Hinweis (Öffentliche Daten)

**Workflow:**

1. User gibt URLs/Branchen ein
2. AI scannt Webseiten nach Kontaktdaten
3. Automatische Deduplizierung
4. DSGVO-Status-Check
5. Import in Lead-Datenbank

#### 3. Template Generator (`src/components/marketing/EmailTemplateGenerator.tsx`)

**Features:**

- AI-gestützte Template-Generierung
- DIN 5008 konform
- Personalisierungs-Tokens
- Responsive Design
- Brand-Anpassung

**Template-Varianten:**

- Cold Outreach
- Follow-Up
- Newsletter
- Event-Einladung
- Danke-Mail
- Reaktivierung

#### 4. Campaign Dashboard (`src/components/marketing/CampaignDashboard.tsx`)

**Metriken:**

- Versandrate (Sent Rate)
- Öffnungsrate (Open Rate)
- Klickrate (Click Rate)
- Conversion Rate
- Bounce Rate
- Unsubscribe Rate
- Spam-Reports

---

## 🔧 BACKEND-FUNKTIONEN

### Edge Function: `web-lead-scanner`

**Datei:** `supabase/functions/web-lead-scanner/index.ts`

**Workflow:**

```typescript
1. URL-Validierung
2. Robots.txt-Check (Scraping erlaubt?)
3. HTML-Download
4. AI-Extraktion:
   - Firmenname
   - E-Mail-Adressen
   - Telefonnummern
   - Ansprechpartner
   - Branche
   - Region
5. Deduplizierung
6. DSGVO-Status-Check
7. Blacklist-Abgleich
8. Speicherung in leads-Tabelle
```

**API-Beispiel:**

```typescript
await supabase.functions.invoke("web-lead-scanner", {
  body: {
    urls: ["https://example-taxi.de"],
    filters: {
      industry: "Taxi & Mietwagen",
      region: "Bayern",
    },
  },
});
```

### Edge Function: `ai-email-generator`

**Datei:** `supabase/functions/ai-email-generator/index.ts`

**Input:**

```typescript
interface GenerationRequest {
  template_type: "cold_outreach" | "follow_up" | "newsletter";
  company_name: string;
  target_industry: string;
  tone: "formal" | "casual" | "professional";
  personalization_tokens: {
    recipient_name?: string;
    company_name?: string;
    [key: string]: any;
  };
}
```

**Output:**

```typescript
interface GeneratedEmail {
  subject: string;
  preview_text: string;
  html_body: string;
  plain_text_body: string;
  compliance_checks: {
    has_unsubscribe_link: boolean;
    has_imprint: boolean;
    has_privacy_link: boolean;
    din_5008_compliant: boolean;
  };
}
```

**System-Prompt:**

```
Du bist ein Experte für professionelles E-Mail-Marketing im B2B-Bereich.

VORGABEN:
1. DIN 5008 konform (Geschäftsbriefe)
2. DSGVO-konform (Widerrufsrecht, Impressum, Datenschutz)
3. UWG-konform (keine irreführende Werbung)
4. Personalisiert, aber nicht aufdringlich
5. Clear Call-to-Action
6. Mobile-optimiert

TEMPLATE-STRUKTUR:
- Betreffzeile (max. 50 Zeichen)
- Preview-Text (max. 90 Zeichen)
- Persönliche Anrede
- Problemstellung / Value Proposition
- Social Proof / Referenzen
- Call-to-Action
- Kontaktdaten
- Rechtliche Pflichtangaben

VERBOTE:
- Keine Superlative ("beste", "günstigste")
- Keine falschen Dringlichkeiten
- Keine versteckten Kosten
- Keine irreführenden Betreffzeilen
```

### Edge Function: `email-campaign-sender`

**Datei:** `supabase/functions/email-campaign-sender/index.ts`

**Features:**

- Rate-Limiting (max. 100 Mails/Minute)
- Retry-Logik bei Fehlern
- Bounce-Handling
- Unsubscribe-Handling
- Tracking-Pixel-Integration
- Link-Tracking

**Workflow:**

```typescript
1. Kampagne aus DB laden
2. Zielgruppe segmentieren
3. Für jede Mail:
   a. Personalisierung
   b. Tracking-Links einfügen
   c. Versand via Resend API
   d. Status-Update in DB
4. Fehler-Logging
5. Performance-Tracking
```

---

## 🗄️ DATENBANK-SCHEMA

### Tabelle: `email_campaigns`

```sql
CREATE TABLE email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) NOT NULL,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  preview_text TEXT,
  html_body TEXT NOT NULL,
  plain_text_body TEXT,
  target_segment JSONB,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'cancelled')),
  ab_test_enabled BOOLEAN DEFAULT false,
  ab_variant_b_subject TEXT,
  ab_variant_b_body TEXT,
  total_recipients INT DEFAULT 0,
  total_sent INT DEFAULT 0,
  total_delivered INT DEFAULT 0,
  total_opened INT DEFAULT 0,
  total_clicked INT DEFAULT 0,
  total_bounced INT DEFAULT 0,
  total_unsubscribed INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  archived BOOLEAN DEFAULT false
);
```

### Tabelle: `leads`

```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) NOT NULL,
  source TEXT, -- 'web_scraping', 'manual', 'import'
  source_url TEXT,
  company_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  contact_person TEXT,
  industry TEXT,
  region TEXT,
  status TEXT CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  gdpr_consent BOOLEAN DEFAULT false,
  gdpr_consent_date TIMESTAMP WITH TIME ZONE,
  blacklisted BOOLEAN DEFAULT false,
  blacklist_reason TEXT,
  last_contacted_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  archived BOOLEAN DEFAULT false
);
```

### Tabelle: `email_events`

```sql
CREATE TABLE email_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES email_campaigns(id),
  lead_id UUID REFERENCES leads(id),
  event_type TEXT CHECK (event_type IN ('sent', 'delivered', 'opened', 'clicked', 'bounced', 'unsubscribed', 'spam_report')),
  event_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabelle: `email_templates`

```sql
CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id),
  name TEXT NOT NULL,
  description TEXT,
  template_type TEXT CHECK (template_type IN ('cold_outreach', 'follow_up', 'newsletter', 'event', 'thank_you', 'reactivation')),
  subject TEXT NOT NULL,
  preview_text TEXT,
  html_body TEXT NOT NULL,
  plain_text_body TEXT,
  thumbnail_url TEXT,
  is_public BOOLEAN DEFAULT false,
  usage_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  archived BOOLEAN DEFAULT false
);
```

---

## 🔒 DSGVO-COMPLIANCE

### PFLICHT-ELEMENTE IN JEDER MAIL

#### 1. Abmelde-Link

```html
<a href="{{unsubscribe_link}}" style="color: #666;"> Abmelden </a>
```

#### 2. Impressum

```html
<p style="font-size: 12px; color: #666;">
  {{company_name}}<br />
  {{company_address}}<br />
  Geschäftsführer: {{ceo_name}}<br />
  HRB {{hrb_number}}, {{court}}<br />
  USt-IdNr.: {{vat_id}}
</p>
```

#### 3. Datenschutz-Link

```html
<a href="{{privacy_policy_url}}" style="color: #666;"> Datenschutzerklärung </a>
```

### EINWILLIGUNGS-MANAGEMENT

**Double-Opt-In-Prozess:**

```typescript
1. Lead gibt E-Mail ein
2. System sendet Bestätigungs-Mail
3. Lead klickt Bestätigungs-Link
4. System setzt gdpr_consent = true
5. System protokolliert Zeitpunkt & IP
6. Lead erhält Willkommens-Mail
```

**Widerrufs-Prozess:**

```typescript
1. Lead klickt Abmelde-Link
2. System setzt blacklisted = true
3. System protokolliert Zeitpunkt
4. System sendet Bestätigungs-Mail
5. Lead wird aus allen aktiven Kampagnen entfernt
```

---

## 📊 REPORTING & ANALYTICS

### Campaign-Performance-Dashboard

```typescript
interface CampaignMetrics {
  sent: number;
  delivered: number;
  delivery_rate: number; // (delivered / sent) * 100
  opened: number;
  open_rate: number; // (opened / delivered) * 100
  clicked: number;
  click_rate: number; // (clicked / opened) * 100
  ctr: number; // (clicked / delivered) * 100
  bounced: number;
  bounce_rate: number; // (bounced / sent) * 100
  unsubscribed: number;
  unsubscribe_rate: number; // (unsubscribed / delivered) * 100
  spam_reports: number;
  revenue_generated?: number;
  conversion_rate?: number;
}
```

### BENCHMARK-WERTE (B2B)

- Open Rate: 20-25% (Gut)
- Click Rate: 2-5% (Gut)
- Bounce Rate: <5% (Akzeptabel)
- Unsubscribe Rate: <0.5% (Gut)

---

## 🚀 IMPLEMENTIERUNGS-PLAN

### PHASE 1: FOUNDATION (Woche 1-2)

- [ ] Datenbank-Schema erstellen
- [ ] RLS-Policies einrichten
- [ ] Basic UI-Components
- [ ] Resend-Integration

### PHASE 2: LEAD-SCANNER (Woche 3-4)

- [ ] Web-Scraping Edge Function
- [ ] AI-Extraktion von Kontaktdaten
- [ ] Lead-Import-UI
- [ ] Blacklist-Management

### PHASE 3: TEMPLATE-GENERATOR (Woche 5-6)

- [ ] AI Email Template Generator
- [ ] DIN 5008 Compliance-Checks
- [ ] Template-Library
- [ ] Preview-Funktionalität

### PHASE 4: CAMPAIGN-MANAGEMENT (Woche 7-8)

- [ ] Campaign-Builder-UI
- [ ] Segmentierung-Engine
- [ ] A/B-Testing-Logik
- [ ] Scheduling-System

### PHASE 5: VERSAND & TRACKING (Woche 9-10)

- [ ] Email-Versand Edge Function
- [ ] Tracking-Pixel-Integration
- [ ] Link-Tracking
- [ ] Bounce-Handling

### PHASE 6: ANALYTICS (Woche 11-12)

- [ ] Performance-Dashboard
- [ ] Reporting-Engine
- [ ] Export-Funktionen
- [ ] Automatische Reports

---

## 💡 BEST PRACTICES

### EMAIL-SUBJECT-LINES

- ✅ Personalisiert: "{{first_name}}, Ihre Anfrage zu..."
- ✅ Klar & präzise: "10 Tipps für bessere Disposition"
- ✅ Benefit-fokussiert: "Sparen Sie 30% Verwaltungszeit"
- ❌ Clickbait: "Sie werden nicht glauben..."
- ❌ All-Caps: "JETZT BESTELLEN!"
- ❌ Zu lang: >50 Zeichen

### EMAIL-BODY

- ✅ Persönliche Anrede
- ✅ Kurze Absätze (max. 3 Sätze)
- ✅ Bullet-Points für Listen
- ✅ Clear Call-to-Action (Button)
- ✅ Responsive Design
- ❌ Zu viele Bilder
- ❌ Zu viele Links
- ❌ Zu lang (max. 500 Wörter)

### VERSAND-TIMING

- **B2B:** Di-Do, 09:00-11:00 oder 14:00-16:00
- **B2C:** Sa-So, 18:00-20:00
- **Newsletter:** Mi, 10:00
- **Follow-Up:** 3 Tage nach erstem Kontakt

---

## 🔗 VERKNÜPFTE DOKUMENTE

- [AI_SYSTEM_ARCHITECTURE_V18.5.0.md](./AI_SYSTEM_ARCHITECTURE_V18.5.0.md)
- [QUALITAETS_STANDARDS_V18.5.0.md](./QUALITAETS_STANDARDS_V18.5.0.md)
- [DSGVO_COMPLIANCE_CHECKLIST.md](./DSGVO_COMPLIANCE_CHECKLIST.md)

---

**Letzte Aktualisierung:** 2025-10-22 22:30 (DE)  
**Status:** 🚧 In Entwicklung  
**Compliance:** ✅ DSGVO, UWG, DIN 5008
