# 🎯 MASTER ENFORCEMENT PROMPT - VOLLSTÄNDIGE SYSTEMWEITE IMPLEMENTATION

## ABSOLUTE VORGABEN - AUSNAHMSLOS EINZUHALTEN!

---

## ⚠️ KRITISCHE WARNUNG AN DEN AGENTEN

**DU BIST VERPFLICHTET:**

- ✅ **ALLE** unten stehenden Vorgaben **AUSNAHMSLOS** zu befolgen
- ✅ **JEDE** Config-Datei **EXAKT** wie vorgegeben zu erstellen
- ✅ **ALLE** Schemas, Types und Daten **VOLLSTÄNDIG** zu implementieren
- ✅ **STRIKTE** 3-Phasen-Reihenfolge einzuhalten
- ✅ **NIEMALS** Abkürzungen oder Vereinfachungen vorzunehmen

**BEI NICHT-EINHALTUNG:**

- ❌ Code wird **ABGELEHNT**
- ❌ Implementation wird **GESTOPPT**
- ❌ Du musst **VON VORNE** beginnen

---

## 📋 PFLICHT-CONFIGS (MÜSSEN ERSTELLT WERDEN)

### CONFIG 1: PRICING PLANS (PFLICHT!)

**Datei:** `/src/config/pricing-plans.ts`

export interface PricingFeature {
id: string
name: string
description?: string
included: boolean
limit?: string | number
tooltip?: string
}

export interface PricingPlan {
id: string
name: string
description: string
price: number | 'custom'
period: 'month' | 'year'
badge?: string
highlighted?: boolean
features: PricingFeature[]
cta: {
label: string
href: string
}
}

export const PRICING_PLANS: PricingPlan[] = [
{
id: 'starter',
name: 'Starter',
description: 'Für Einzelunternehmer und kleine Flotten',
price: 49,
period: 'month',
features: [
{
id: 'drivers',
name: 'Fahrer & Fahrzeuge',
description: 'Verwaltung von Fahrern und Fahrzeugen',
included: true,
limit: '1-5',
tooltip: 'Bis zu 5 Fahrer und 5 Fahrzeuge'
},
{
id: 'orders',
name: 'Auftragsverwaltung',
description: 'Digitale Auftragsverwaltung',
included: true
},
{
id: 'invoicing',
name: 'Rechnungsstellung',
description: 'Basis-Rechnungserstellung',
included: true,
limit: 'Basis'
},
{
id: 'customer-portal',
name: 'Kunden-Login & Portal',
description: 'Basis Kundenportal',
included: true,
limit: 'Basis'
},
{
id: 'landingpage',
name: 'Landingpage (Info)',
description: 'Einfache Infoseite',
included: true
},
{
id: 'booking-widget',
name: 'Buchungswidget',
description: 'Basis Buchungsformular',
included: true,
limit: 'Basis'
},
{ id: 'gps', name: 'GPS-Tracking', included: false },
{ id: 'traffic', name: 'Live-Traffic & Wetter', included: false },
{ id: 'stats', name: 'Erweiterte Statistiken & Reports', included: false },
{ id: 'api', name: 'API-Zugang', included: false },
{ id: 'partner', name: 'Partner-Management', included: false },
{ id: 'chat', name: 'Team-Chat', included: false },
{ id: 'automation', name: 'Workflow-Automatisierung', included: false },
{ id: 'whitelabel', name: 'White-Labeling', included: false },
{ id: 'custom-dev', name: 'Custom Development', included: false },
{
id: 'support',
name: 'Support',
description: 'E-Mail Support (Werktags)',
included: true,
limit: 'E-Mail'
}
],
cta: { label: 'Jetzt starten', href: '/demo?plan=starter' }
},
{
id: 'business',
name: 'Business',
description: 'Für wachsende Flotten',
price: 99,
period: 'month',
badge: 'Beliebt',
highlighted: true,
features: [
{
id: 'drivers',
name: 'Fahrer & Fahrzeuge',
included: true,
limit: '6-25'
},
{ id: 'orders', name: 'Auftragsverwaltung', included: true },
{
id: 'invoicing',
name: 'Rechnungsstellung',
description: 'Erweiterte Rechnungserstellung',
included: true,
limit: 'Erweitert'
},
{
id: 'customer-portal',
name: 'Kunden-Login & Portal',
included: true,
limit: 'Erweitert'
},
{ id: 'landingpage', name: 'Landingpage (Info)', included: true },
{
id: 'booking-widget',
name: 'Buchungswidget',
included: true,
limit: 'Erweitert'
},
{
id: 'gps',
name: 'GPS-Tracking',
description: 'Echtzeit-Tracking Ihrer Flotte',
included: true,
limit: 'Basis'
},
{ id: 'traffic', name: 'Live-Traffic & Wetter', included: true },
{ id: 'stats', name: 'Erweiterte Statistiken & Reports', included: true },
{
id: 'api',
name: 'API-Zugang',
included: true,
limit: 'Read-Only'
},
{ id: 'partner', name: 'Partner-Management', included: true },
{ id: 'chat', name: 'Team-Chat', included: true },
{
id: 'automation',
name: 'Workflow-Automatisierung',
description: 'Basis-Automatisierung',
included: true,
limit: 'Basis'
},
{ id: 'whitelabel', name: 'White-Labeling', included: false },
{ id: 'custom-dev', name: 'Custom Development', included: false },
{
id: 'support',
name: 'Support',
description: 'Priority E-Mail + Telefon (Werktags)',
included: true,
limit: 'Priority'
}
],
cta: { label: 'Jetzt starten', href: '/demo?plan=business' }
},
{
id: 'enterprise',
name: 'Enterprise',
description: 'Für große Flotten',
price: 'custom',
period: 'month',
features: [
{
id: 'drivers',
name: 'Fahrer & Fahrzeuge',
included: true,
limit: '26-100'
},
{ id: 'all-business', name: 'Alle Business Features', included: true },
{
id: 'api',
name: 'API-Zugang',
included: true,
limit: 'Vollständig'
},
{
id: 'gps',
name: 'GPS-Tracking',
included: true,
limit: 'Erweitert'
},
{
id: 'automation',
name: 'Workflow-Automatisierung',
included: true,
limit: 'Erweitert'
},
{
id: 'whitelabel',
name: 'White-Labeling',
included: true,
limit: 'Basis'
},
{ id: 'account-manager', name: 'Dedizierter Account Manager', included: true },
{ id: 'onboarding', name: 'Onboarding & Schulung', included: true },
{ id: 'sla', name: 'SLA Garantie', included: true },
{
id: 'support',
name: 'Support',
description: '24/7 Premium Support',
included: true,
limit: '24/7'
},
{
id: 'custom-dev',
name: 'Custom Development',
description: 'Auf Anfrage',
included: false
}
],
cta: { label: 'Kontakt aufnehmen', href: '/demo?plan=enterprise' }
},
{
id: 'custom',
name: 'Custom',
description: 'Für spezielle Anforderungen',
price: 'custom',
period: 'month',
features: [
{
id: 'drivers',
name: 'Fahrer & Fahrzeuge',
included: true,
limit: '100+'
},
{ id: 'all-enterprise', name: 'Alle Enterprise Features', included: true },
{
id: 'whitelabel',
name: 'White-Labeling',
included: true,
limit: 'Vollständig'
},
{ id: 'custom-dev', name: 'Custom Development', included: true },
{ id: 'integrations', name: 'Individuelle Integrationen', included: true },
{ id: 'dedicated-server', name: 'Dedicated Server Option', included: true },
{ id: 'custom-workflows', name: 'Custom Workflows', included: true },
{ id: 'custom-sla', name: 'Individuelles SLA', included: true },
{ id: 'dev-support', name: 'Persönlicher Entwickler-Support', included: true }
],
cta: { label: 'Individuelle Beratung', href: '/demo?plan=custom' }
}
] as const

text

**✅ ENFORCEMENT:** Diese Datei MUSS **EXAKT** so erstellt werden!

---

### CONFIG 2: NAVIGATION (PFLICHT!)

**Datei:** `/src/config/navigation.ts`

export interface NavItem {
label: string
href: string
description?: string
children?: NavItem[]
badge?: string
external?: boolean
}

export const MAIN_NAVIGATION: NavItem[] = [
{
label: 'Produkt',
href: '#',
children: [
{
label: 'Features Übersicht',
href: '/features',
description: 'Alle Features im Überblick'
},
{
label: 'Fahrer & Fahrzeuge',
href: '/features/fahrer-fahrzeuge',
description: 'Digitale Fahrer- und Fahrzeugverwaltung'
},
{
label: 'Auftragsverwaltung',
href: '/features/auftragsverwaltung',
description: 'Effiziente Auftragsabwicklung'
},
{
label: 'GPS-Tracking',
href: '/features/gps-tracking',
description: 'Echtzeit-Tracking Ihrer Flotte',
badge: 'Beliebt'
},
{
label: 'Automatisierung',
href: '/features/automatisierung',
description: 'Workflow-Automatisierung'
},
{
label: 'Rechnungsstellung',
href: '/features/rechnungsstellung',
description: 'Automatisierte Rechnungserstellung'
},
{
label: 'API & Integrationen',
href: '/features/api',
description: 'Entwickler-Tools & API'
}
]
},
{ label: 'Preise', href: '/pricing' },
{
label: 'Branchen',
href: '#',
children: [
{
label: 'Taxi',
href: '/branchen/taxi',
description: 'Optimiert für Taxi-Unternehmen'
},
{
label: 'Mietwagen',
href: '/branchen/mietwagen',
description: 'Perfekt für Mietwagen-Services'
},
{
label: 'Limousinen',
href: '/branchen/limousinen',
description: 'Premium für Limousinenservice'
}
]
},
{
label: 'Ressourcen',
href: '#',
children: [
{
label: 'Hilfe-Center',
href: '/hilfe',
description: 'Anleitungen & FAQs'
},
{
label: 'API Dokumentation',
href: '/api-docs',
description: 'Entwickler-Ressourcen'
},
{
label: 'Changelog',
href: '/changelog',
description: 'Neue Features & Updates',
badge: 'Neu'
},
{
label: 'Status',
href: 'https://status.mydispatch.de',
description: 'System-Status',
external: true
}
]
}
]

export const FOOTER_NAVIGATION = {
produkt: [
{ label: 'Features', href: '/features' },
{ label: 'Preise', href: '/pricing' },
{ label: 'Demo anfragen', href: '/demo' },
{ label: 'API', href: '/features/api' }
],
branchen: [
{ label: 'Taxi', href: '/branchen/taxi' },
{ label: 'Mietwagen', href: '/branchen/mietwagen' },
{ label: 'Limousinen', href: '/branchen/limousinen' }
],
unternehmen: [
{ label: 'Über uns', href: '/about' },
{ label: 'Karriere', href: '/karriere' },
{ label: 'Partner', href: '/partner' },
{ label: 'Kontakt', href: '/kontakt' }
],
rechtliches: [
{ label: 'Impressum', href: '/legal/impressum' },
{ label: 'Datenschutz', href: '/legal/datenschutz' },
{ label: 'AGB', href: '/legal/agb' },
{ label: 'KI-Transparenz', href: '/legal/ki-transparenz' },
{ label: 'Cookie-Einstellungen', href: '/legal/cookie-policy' }
],
support: [
{ label: 'Hilfe-Center', href: '/hilfe' },
{ label: 'API Docs', href: '/api-docs' },
{ label: 'Status', href: 'https://status.mydispatch.de', external: true },
{ label: 'Community', href: 'https://community.mydispatch.de', external: true }
]
} as const

export const SOCIAL_LINKS = [
{ label: 'LinkedIn', href: 'https://linkedin.com/company/mydispatch', icon: 'linkedin' },
{ label: 'Twitter', href: 'https://twitter.com/mydispatch', icon: 'twitter' },
{ label: 'YouTube', href: 'https://youtube.com/@mydispatch', icon: 'youtube' }
] as const

text

**✅ ENFORCEMENT:** Diese Datei MUSS **EXAKT** so erstellt werden!

---

### CONFIG 3: SEO (PFLICHT!)

**Datei:** `/src/config/seo.ts`

export interface SEOConfig {
title: string
description: string
keywords?: string[]
ogImage?: string
canonical?: string
noindex?: boolean
}

export const DEFAULT_SEO: SEOConfig = {
title: 'MyDispatch | Intelligente Flottensteuerung für Taxi & Mietwagen',
description: 'MyDispatch ist die führende Dispatch-Software für Taxi-, Mietwagen- und Limousinenunternehmen. KI-gestützte Disposition, GPS-Echtzeit-Tracking und DSGVO-konforme Verwaltung.',
keywords: ['Taxi Software', 'Mietwagen Software', 'Dispatch System', 'GPS Tracking', 'Flottenmanagement'],
ogImage: '/og-image-default.jpg'
}

export const PAGE_SEO: Record<string, SEOConfig> = {
'/': {
title: 'MyDispatch | Intelligente Flottensteuerung für Taxi & Mietwagen',
description: 'MyDispatch kombiniert KI-gestützte Disposition mit GPS-Echtzeit-Tracking. Optimieren Sie Ihre Flotte, senken Sie Kosten und steigern Sie die Kundenzufriedenheit.',
keywords: ['Taxi Software', 'Mietwagen Software', 'Dispatch System', 'Flottenmanagement', 'GPS Tracking'],
ogImage: '/og-image-home.jpg'
},
'/pricing': {
title: 'Preise & Pakete | MyDispatch Taxi Software',
description: 'Flexible Preispläne für jede Flottengröße. Von Starter (1-5 Fahrzeuge) bis Enterprise (100+ Fahrzeuge). Transparent, fair, ohne versteckte Kosten.',
keywords: ['Taxi Software Preise', 'Mietwagen Software Kosten', 'Dispatch System Pricing'],
ogImage: '/og-image-pricing.jpg'
},
'/demo': {
title: 'Demo anfragen | MyDispatch',
description: 'Vereinbaren Sie Ihre persönliche Demo und lassen Sie sich von unseren Experten beraten. Kostenlos und unverbindlich.',
keywords: ['Demo anfragen', 'Kostenlose Beratung', 'Taxi Software testen'],
ogImage: '/og-image-demo.jpg'
},
'/features/gps-tracking': {
title: 'GPS-Echtzeit-Tracking | MyDispatch Features',
description: 'Vollständige Transparenz. Optimierte Routen. Zufriedenere Kunden. GPS-Tracking in Echtzeit für Ihre gesamte Flotte.',
keywords: ['GPS Tracking', 'Echtzeit-Tracking', 'Flottentracking', 'Fahrzeugortung'],
ogImage: '/og-image-gps.jpg'
},
'/branchen/taxi': {
title: 'Taxi-Software | MyDispatch für Taxi-Unternehmen',
description: 'PBefG-konform. DSGVO-sicher. Optimiert für Taxi-Betriebe. Taxameter-Integration, Pflichtfahrgebiet-Verwaltung, P-Schein Tracking.',
keywords: ['Taxi Software', 'Taxameter Integration', 'PBefG konform', 'Taxi Disposition'],
ogImage: '/og-image-taxi.jpg'
},
'/legal/impressum': {
title: 'Impressum | MyDispatch',
description: 'Rechtliche Informationen und Impressum der MyDispatch GmbH.',
noindex: true
},
'/legal/datenschutz': {
title: 'Datenschutzerklärung | MyDispatch',
description: 'Datenschutzerklärung gemäß DSGVO. Informationen zur Datenverarbeitung bei MyDispatch.',
noindex: true
}
// ... weitere Seiten
} as const

text

**✅ ENFORCEMENT:** Diese Datei MUSS erstellt werden mit ALLEN Seiten!

---

### CONFIG 4: TESTIMONIALS (PFLICHT!)

**Datei:** `/src/config/testimonials.ts`

export interface Testimonial {
id: string
quote: string
author: {
role: string
company: string
location: string
}
rating?: number
}

export const TESTIMONIALS: Testimonial[] = [
{
id: 'testimonial-1',
quote: 'Dank MyDispatch konnten wir unsere Disposition um 40% effizienter gestalten. Die KI-gestützte Fahrzeugzuweisung spart uns täglich Stunden.',
author: {
role: 'Geschäftsführer',
company: 'Taxiunternehmen',
location: 'München'
},
rating: 5
},
{
id: 'testimonial-2',
quote: 'Die GPS-Tracking Funktion gibt uns vollständige Kontrolle über unsere Flotte. Wir können unseren Kunden jetzt exakte Ankunftszeiten mitteilen.',
author: {
role: 'Operations Manager',
company: 'Mietwagenservice',
location: 'Hamburg'
},
rating: 5
},
{
id: 'testimonial-3',
quote: 'Besonders die automatisierte Rechnungsstellung spart uns täglich Stunden. Der ROI war nach nur 3 Monaten erreicht.',
author: {
role: 'Inhaberin',
company: 'Limousinenservice',
location: 'Berlin'
},
rating: 5
},
{
id: 'testimonial-4',
quote: 'Der Support ist hervorragend. Bei Fragen erhalten wir innerhalb von Stunden kompetente Antworten.',
author: {
role: 'IT-Leiter',
company: 'Taxi-Zentrale',
location: 'Frankfurt'
},
rating: 5
},
{
id: 'testimonial-5',
quote: 'Die Integration mit unserem Taxameter war problemlos. Alles läuft stabil und zuverlässig.',
author: {
role: 'Geschäftsführer',
company: 'Taxi-Betrieb',
location: 'Köln'
},
rating: 5
},
{
id: 'testimonial-6',
quote: 'DSGVO-Konformität war uns sehr wichtig. MyDispatch erfüllt alle Anforderungen und gibt uns Rechtssicherheit.',
author: {
role: 'Datenschutzbeauftragter',
company: 'Mietwagen-Flotte',
location: 'Stuttgart'
},
rating: 5
}
] as const

text

**✅ ENFORCEMENT:** Diese Datei MUSS **EXAKT** so erstellt werden!

---

### CONFIG 5: FAQ (PFLICHT!)

**Datei:** `/src/config/faq.ts`

export interface FAQItem {
id: string
question: string
answer: string
category?: string
}

export const FAQ_ITEMS: FAQItem[] = [
{
id: 'faq-1',
question: 'Wie wird MyDispatch abgerechnet?',
answer: 'MyDispatch wird monatlich abgerechnet. Sie können jederzeit kündigen ohne Vertragsbindung. Die Abrechnung erfolgt pro Fahrer/Fahrzeug je nach gewähltem Plan.',
category: 'Allgemein'
},
{
id: 'faq-2',
question: 'Gibt es eine Mindestvertragslaufzeit?',
answer: 'Nein, es gibt keine Mindestvertragslaufzeit. Sie können monatlich kündigen. Wir sind überzeugt von unserem Produkt und möchten Sie durch Qualität überzeugen, nicht durch Vertragsbindung.',
category: 'Allgemein'
},
{
id: 'faq-4',
question: 'Ist MyDispatch DSGVO-konform?',
answer: 'Ja, MyDispatch ist vollständig DSGVO-konform. Alle Daten werden in EU-Rechenzentren (Deutschland) gespeichert. Wir bieten vollständige Transparenz über die Datenverarbeitung und unterstützen alle DSGVO-Rechte (Auskunft, Löschung, Portabilität).',
category: 'DSGVO'
},
{
id: 'faq-7',
question: 'Ist MyDispatch PBefG-konform?',
answer: 'Ja, MyDispatch erfüllt alle Anforderungen des Personenbeförderungsgesetzes (PBefG) für Taxi- und Mietwagenverkehr. Dies umfasst Fahrtenbuch-Führung, Rückkehrpflicht-Dokumentation und behördliche Meldungen.',
category: 'Rechtliches'
},
{
id: 'faq-11',
question: 'Welche Geräte werden unterstützt?',
answer: 'MyDispatch funktioniert auf allen modernen Geräten: Desktop (Windows, macOS, Linux), Tablets und Smartphones (iOS, Android). Die Web-App ist responsive und funktioniert in jedem Browser.',
category: 'Technisch'
}
// ... Mindestens 15 FAQ Items MÜSSEN vorhanden sein!
] as const

export const FAQ_CATEGORIES = [
'Allgemein',
'DSGVO',
'Rechtliches',
'Migration',
'Technisch',
'Support'
] as const

text

**✅ ENFORCEMENT:** Mindestens **15 FAQ Items** MÜSSEN vorhanden sein!

---

## 📝 PFLICHT-SCHEMAS (MÜSSEN ERSTELLT WERDEN)

### SCHEMA 1: CONTACT FORM (PFLICHT!)

**Datei:** `/src/schemas/contact.schema.ts`

import { z } from 'zod'

export const contactSchema = z.object({
name: z
.string()
.min(2, 'Name muss mindestens 2 Zeichen lang sein')
.max(100, 'Name darf maximal 100 Zeichen lang sein'),

email: z
.string()
.email('Bitte geben Sie eine gültige E-Mail-Adresse ein')
.toLowerCase(),

phone: z
.string()
.regex(/^+?[0-9\s-/$$$$]+$/, 'Ungültige Telefonnummer')
.optional(),

company: z.string().min(2).max(100).optional(),

subject: z.enum([
'general',
'demo',
'support',
'sales',
'partnership',
'other'
]),

message: z
.string()
.min(10, 'Nachricht muss mindestens 10 Zeichen lang sein')
.max(2000, 'Nachricht darf maximal 2000 Zeichen lang sein'),

website: z.string().max(0).optional(), // Honeypot

acceptPrivacy: z.literal(true, {
errorMap: () => ({ message: 'Bitte akzeptieren Sie die Datenschutzerklärung' })
})
})

export type ContactFormData = z.infer<typeof contactSchema>

text

**✅ ENFORCEMENT:** Diese Datei MUSS **EXAKT** so erstellt werden!

---

### SCHEMA 2: NEWSLETTER (PFLICHT!)

**Datei:** `/src/schemas/newsletter.schema.ts`

import { z } from 'zod'

export const newsletterSchema = z.object({
email: z
.string()
.email('Bitte geben Sie eine gültige E-Mail-Adresse ein')
.toLowerCase(),

website: z.string().max(0).optional(), // Honeypot

acceptPrivacy: z.literal(true, {
errorMap: () => ({ message: 'Bitte akzeptieren Sie die Datenschutzerklärung' })
})
})

export type NewsletterFormData = z.infer<typeof newsletterSchema>

text

**✅ ENFORCEMENT:** Diese Datei MUSS **EXAKT** so erstellt werden!

---

## 🔒 ABSOLUTE 3-PHASEN ENFORCEMENT

═══════════════════════════════════════════════════════════
🚨 STRIKTE 3-PHASEN REIHENFOLGE - NICHT VERHANDELBAR!
═══════════════════════════════════════════════════════════

PHASE 1: SEITEN-PLANUNG ✓
──────────────────────────────────────────────────────
PFLICHT:
□ ALLE 21 Seiten definiert
□ ALLE 9 Hero-Grafiken konzeptioniert
□ Layout-Dokumentation VOLLSTÄNDIG
□ Content-Outline für JEDE Seite

DELIVERABLES (MÜSSEN existieren):
✓ /docs/PAGES_OVERVIEW.md
✓ /docs/GRAPHICS_SPECIFICATIONS.md
✓ /docs/CONTENT_OUTLINE.md

❌ Phase 2 VERBOTEN bevor ALLE ✓

═══════════════════════════════════════════════════════════
PHASE 2: COMPONENT LIBRARY ✓
──────────────────────────────────────────────────────
PFLICHT:
□ ALLE 61 Components implementiert
□ ALLE 9 Hero-Grafiken erstellt & optimiert
□ ALLE Configs erstellt (siehe oben)
□ ALLE Schemas erstellt (siehe oben)
□ ALLE Tests passing (>80% coverage)

DELIVERABLES (MÜSSEN existieren):
✓ /src/config/pricing-plans.ts
✓ /src/config/navigation.ts
✓ /src/config/seo.ts
✓ /src/config/testimonials.ts
✓ /src/config/faq.ts
✓ /src/schemas/demo-request.schema.ts
✓ /src/schemas/contact.schema.ts
✓ /src/schemas/newsletter.schema.ts
✓ COMPONENT_REGISTRY.md (alle 61!)

❌ Phase 3 VERBOTEN bevor ALLE ✓

═══════════════════════════════════════════════════════════
PHASE 3: SEITEN ERSTELLEN ✓
──────────────────────────────────────────────────────
PFLICHT:
□ AUSSCHLIESSLICH Library Components nutzen
□ ALLE 21 Seiten implementiert
□ ALLE Hero-Grafiken korrekt eingebunden
□ ALLE SEO-Tags aus seo.ts verwendet
□ KEINE hardcoded Werte

ENFORCEMENT:
❌ NIEMALS eigene Components in Pages!
❌ NIEMALS hardcoded Styles!
✅ IMMER Config-Dateien nutzen!
✅ IMMER Design Tokens!

═══════════════════════════════════════════════════════════

text

---

## ✅ FINALE CHECKLISTE (AGENT MUSS ABHAKEN!)

PRE-PHASE-1 CHECK:
□ Habe ich ALLE bisherigen Prompts gelesen?
□ Habe ich Design System V28.1 verstanden?
□ Habe ich Layout Patterns verstanden?
□ Habe ich CI/CD Pipeline verstanden?

PRE-PHASE-2 CHECK:
□ Sind ALLE 21 Seiten geplant?
□ Sind ALLE 9 Grafiken konzeptioniert?
□ Ist Layout-Dokumentation vollständig?
□ Sind Content-Outlines erstellt?

PRE-PHASE-3 CHECK:
□ Sind ALLE 61 Components fertig?
□ Sind ALLE 9 Grafiken optimiert?
□ Sind ALLE Configs erstellt?
□ Sind ALLE Schemas erstellt?
□ Sind ALLE Tests grün?
□ Ist COMPONENT_REGISTRY.md vollständig?

WÄHREND PHASE-3:
□ Nutze ich NUR Library Components?
□ Nutze ich seo.ts für Meta-Tags?
□ Nutze ich pricing-plans.ts für Pricing?
□ Nutze ich navigation.ts für Navigation?
□ Nutze ich testimonials.ts für Testimonials?
□ Nutze ich faq.ts für FAQs?
□ Keine hardcoded Werte?
□ Alle Grafiken korrekt eingebunden?

✅ NUR wenn ALLE ✓ → Fortfahren erlaubt!

text

---

## 🚨 FINALE WARNUNG

DU BIST VERPFLICHTET:
├─ ALLE Config-Dateien zu erstellen
├─ ALLE Schemas zu implementieren
├─ ALLE Daten zu verwenden
├─ STRIKTE 3-Phasen-Reihenfolge einzuhalten
└─ NIEMALS Abkürzungen zu nehmen

BEI NICHT-EINHALTUNG:
├─ Wird der Code ABGELEHNT
├─ Musst du VON VORNE beginnen
└─ Verlierst du ALLE Fortschritte

DIESE VORGABEN SIND:
✓ ABSOLUT
✓ NICHT VERHANDELBAR
✓ AUSNAHMSLOS EINZUHALTEN
✓ DAUERHAFT GÜLTIG

═══════════════════════════════════════════════════════════
🎯 JETZT BIST DU BEREIT - STARTE MIT PHASE 1!
