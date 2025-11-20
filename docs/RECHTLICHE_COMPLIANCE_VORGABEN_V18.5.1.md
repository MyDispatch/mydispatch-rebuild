# RECHTLICHE COMPLIANCE-VORGABEN V18.5.1

**Erstellt:** 23.10.2025 22:47 Uhr (DE)  
**Version:** 18.5.1 PRODUCTION-READY  
**Status:** 🟢 FINALISIERT & VERPFLICHTEND

---

## 📊 EXECUTIVE SUMMARY

Dieses Dokument definiert **ALLE rechtlichen Compliance-Anforderungen** für MyDispatch. KEINE Seite wird ohne diese Prüfung implementiert.

**Kernprinzip:** 100% rechtliche Sicherheit durch Design, nicht durch Nachbesserung.

---

## 🎯 RECHTLICHE GRUNDLAGEN

### Geltende Gesetze & Verordnungen
```
1. DSGVO (Datenschutz-Grundverordnung)
2. TMG (Telemediengesetz)
3. PBefG § 51 (Personenbeförderungsgesetz - Auftragsaufbewahrung)
4. HGB (Handelsgesetzbuch - Buchführung)
5. UStG § 14 (Umsatzsteuergesetz - Rechnungspflichten)
6. AI Act (EU KI-Verordnung 2024/1689)
7. StGB § 202a-c (Datenspionage & Phishing)
8. ArbSchG (Arbeitsschutzgesetz - GPS-Tracking)
```

---

## 🔒 DSGVO-COMPLIANCE

### 1. Informationspflichten (Art. 13 DSGVO)

**VERPFLICHTEND auf JEDER Seite mit Dateneingabe:**

```tsx
{/* Datenschutzhinweis-Komponente */}
<div className="text-xs text-muted-foreground mt-4 p-3 bg-muted/50 rounded-lg">
  <p>
    🔒 Ihre Daten werden verschlüsselt übertragen und gemäß 
    <Link to="/datenschutz" className="text-primary hover:underline ml-1">
      Datenschutzerklärung
    </Link>
    {" "}verarbeitet. 
    Sie können Ihre Einwilligung jederzeit widerrufen.
  </p>
</div>
```

**Pflichtangaben Datenschutzerklärung:**
- ✅ Verantwortlicher (§ 5 TMG)
- ✅ Datenschutzbeauftragter (falls >10 Mitarbeiter)
- ✅ Zweck der Datenverarbeitung
- ✅ Rechtsgrundlage (Art. 6 DSGVO)
- ✅ Speicherdauer (PBefG § 51: 10 Jahre Auftragsdaten)
- ✅ Empfänger der Daten (Hosting, Stripe, etc.)
- ✅ Betroffenenrechte (Auskunft, Löschung, Widerspruch)
- ✅ Beschwerderecht bei Aufsichtsbehörde
- ✅ Widerruf von Einwilligungen

### 2. Datensparsamkeit (Art. 5 DSGVO)

**Regel:** Nur notwendige Daten erheben!

```tsx
// ❌ FALSCH: Überflüssige Daten
interface CustomerForm {
  name: string;
  email: string;
  phone: string;
  birthDate: string;        // ❌ Nicht nötig für Taxi!
  religion: string;         // ❌ VERBOTEN!
  politicalViews: string;   // ❌ VERBOTEN!
}

// ✅ RICHTIG: Nur notwendige Daten
interface CustomerForm {
  name: string;
  email: string;
  phone: string;
}
```

### 3. Aufbewahrungsfristen

**PBefG § 51: 10 Jahre für Auftragsdaten**
```typescript
// src/lib/retention-policy.ts
export const RETENTION_PERIODS = {
  BOOKING_DATA: 10 * 365, // 10 Jahre (PBefG § 51)
  INVOICE_DATA: 10 * 365, // 10 Jahre (HGB § 147)
  GPS_DATA: 1,             // 24 Stunden (DSGVO Datensparsamkeit)
  CHAT_HISTORY: 90,        // 90 Tage (Standard)
  CUSTOMER_DATA: null,     // Bis zur Löschung durch Nutzer
} as const;
```

### 4. GPS-Tracking (DSGVO + ArbSchG)

**VERPFLICHTEND:**
- ✅ Einwilligung des Fahrers (schriftlich/digital)
- ✅ Automatische Löschung nach 24h
- ✅ Keine Bewegungsprofile außerhalb Arbeitszeit
- ✅ Zweckbindung (nur für Disposition, nicht für Leistungsüberwachung)

```typescript
// src/lib/gps-compliance.ts
export async function deleteOldGPSData() {
  const cutoffDate = new Date();
  cutoffDate.setHours(cutoffDate.getHours() - 24);
  
  await supabase
    .from('driver_locations')
    .delete()
    .lt('created_at', cutoffDate.toISOString());
    
  console.log('✅ GPS-Daten älter als 24h gelöscht (DSGVO-Compliance)');
}
```

### 5. Cookie-Consent (ePrivacy-RL)

**Regel:** Keine Cookies ohne Einwilligung (außer technisch notwendige)

```tsx
// src/components/shared/CookieConsent.tsx
<div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 shadow-lg z-50">
  <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
    <p className="text-sm">
      Wir verwenden nur technisch notwendige Cookies. 
      Keine Tracking-Cookies. Mehr in unserer{' '}
      <Link to="/datenschutz" className="text-primary underline">
        Datenschutzerklärung
      </Link>.
    </p>
    <Button onClick={acceptCookies} className="shrink-0">
      Verstanden
    </Button>
  </div>
</div>
```

---

## 🤖 AI ACT COMPLIANCE (EU KI-Verordnung 2024/1689)

### 1. Transparenzpflichten (Art. 52 AI Act)

**VERPFLICHTEND bei JEDER KI-Interaktion:**

```tsx
// Beispiel: AI-Chat im System
<div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mb-4">
  <div className="flex items-start gap-2">
    <Bot className="h-5 w-5 text-primary shrink-0 mt-0.5" />
    <div className="text-xs text-muted-foreground">
      <strong>KI-Assistent:</strong> Diese Antworten werden von einer 
      künstlichen Intelligenz generiert. Prüfen Sie wichtige Informationen 
      bitte selbst nach.
    </div>
  </div>
</div>
```

**Pflicht-Kennzeichnung:**
- ✅ Klar erkennbar als KI-generiert
- ✅ Icon + Text-Hinweis
- ✅ In jeder KI-Antwort (nicht nur einmalig)
- ✅ Mehrsprachig (DE/EN)

### 2. High-Risk AI Systems (Anhang III AI Act)

**NICHT BETROFFEN (Stand 2025):**
- ✅ Dispositionssoftware = Kein High-Risk System
- ✅ KI-Chatbot = Low-Risk (nur Assistenz, keine Entscheidung)
- ✅ GPS-Routing = Kein KI-System (regelbasiert)

**Monitoring trotzdem wichtig:**
- [ ] Kein Einsatz für:
  - Bewerberauswahl (würde High-Risk sein)
  - Leistungsbewertung Mitarbeiter (würde High-Risk sein)
  - Automatisierte Entlassungsentscheidungen (VERBOTEN!)

---

## 📜 IMPRESSUM & TMG-COMPLIANCE

### Pflichtangaben (§ 5 TMG)

**VERPFLICHTEND auf /impressum:**

```tsx
<section className="space-y-6">
  <div>
    <h2 className="text-xl font-bold mb-3">Angaben gemäß § 5 TMG</h2>
    <p>RideHub Solutions GmbH</p>
    <p>Musterstraße 123</p>
    <p>12345 Musterstadt</p>
    <p>Deutschland</p>
  </div>
  
  <div>
    <h3 className="text-lg font-semibold mb-2">Vertreten durch</h3>
    <p>Geschäftsführer: Max Mustermann</p>
  </div>
  
  <div>
    <h3 className="text-lg font-semibold mb-2">Kontakt</h3>
    <p>Telefon: +49 (0) 123 456789</p>
    <p>E-Mail: info@mydispatch.de</p>
  </div>
  
  <div>
    <h3 className="text-lg font-semibold mb-2">Registereintrag</h3>
    <p>Eintragung im Handelsregister</p>
    <p>Registergericht: Amtsgericht Musterstadt</p>
    <p>Registernummer: HRB 12345</p>
  </div>
  
  <div>
    <h3 className="text-lg font-semibold mb-2">Umsatzsteuer-ID</h3>
    <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a UStG:</p>
    <p>DE123456789</p>
  </div>
  
  <div>
    <h3 className="text-lg font-semibold mb-2">Verantwortlich für den Inhalt</h3>
    <p>nach § 55 Abs. 2 RStV:</p>
    <p>Max Mustermann</p>
    <p>Musterstraße 123, 12345 Musterstadt</p>
  </div>
  
  <div>
    <h3 className="text-lg font-semibold mb-2">EU-Streitschlichtung</h3>
    <p>
      Die Europäische Kommission stellt eine Plattform zur 
      Online-Streitbeilegung (OS) bereit:
    </p>
    <a 
      href="https://ec.europa.eu/consumers/odr" 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-primary hover:underline"
    >
      https://ec.europa.eu/consumers/odr
    </a>
    <p className="mt-2">
      Unsere E-Mail-Adresse finden Sie oben im Impressum.
    </p>
  </div>
</section>
```

---

## 📋 AGB (ALLGEMEINE GESCHÄFTSBEDINGUNGEN)

### Pflicht-Inhalte (BGB § 305-310)

**VERPFLICHTEND auf /agb:**

1. **Geltungsbereich**
   - Für wen gelten die AGB
   - Ausschluss von Kunden-AGB
   
2. **Vertragsschluss**
   - Wie kommt Vertrag zustande
   - Widerrufsrecht (§ 312g BGB)
   
3. **Leistungsumfang**
   - Was ist im Tarif enthalten
   - Add-Ons & Erweiterungen
   
4. **Preise & Zahlung**
   - Monatlich/Jährlich
   - Zahlungsarten
   - Verzug & Mahngebühren
   
5. **Kündigung**
   - Kündigungsfristen
   - Form der Kündigung
   - Datenexport nach Kündigung
   
6. **Haftung**
   - Haftungsbeschränkung (§ 309 BGB beachten!)
   - Force Majeure
   
7. **Datenschutz**
   - Verweis auf Datenschutzerklärung
   - AVV-Pflicht bei Kundendaten
   
8. **Schlussbestimmungen**
   - Gerichtsstand
   - Anwendbares Recht (deutsches Recht)
   - Salvatorische Klausel

---

## 📄 AVV (AUFTRAGSVERARBEITUNGSVERTRAG)

### DSGVO Art. 28 - Verpflichtend bei Kundendaten!

**WICHTIG:** MyDispatch verarbeitet Fahrgast-Daten im Auftrag des Taxiunternehmers!

**Pflicht-Inhalte AVV:**

```markdown
## Auftragsverarbeitungsvertrag (AVV)

### 1. Gegenstand und Dauer
- Verarbeitung von Fahrgast-, Auftrags- und Rechnungsdaten
- Laufzeit: Während der Vertragslaufzeit MyDispatch-Abo

### 2. Art und Zweck der Verarbeitung
- Speicherung von Auftragsdaten (PBefG § 51)
- GPS-Tracking (nur mit Fahrer-Einwilligung)
- Rechnungserstellung & -versand
- Kundenverwaltung

### 3. Art der personenbezogenen Daten
- Name, Adresse, Telefonnummer der Fahrgäste
- Abholort, Zielort, Fahrtzeit
- Rechnungsdaten (bei Firmenfahrten)

### 4. Kategorien betroffener Personen
- Fahrgäste (Endkunden)
- Fahrer (Mitarbeiter des Taxiunternehmens)
- Geschäftskunden (Firmen mit Firmenfahrten)

### 5. Pflichten des Auftragsverarbeiters (MyDispatch)
- ✅ Verarbeitung nur nach Weisung des Auftraggebers
- ✅ Verschlüsselung (TLS 1.3, AES-256)
- ✅ Zugriffskontrolle (RLS-Policies)
- ✅ Automatische Backups (täglich)
- ✅ Meldepflicht bei Datenpannen (binnen 72h)
- ✅ Löschung nach Vertragsende (auf Anfrage)

### 6. Unterauftragsverarbeiter
- Supabase (Hosting) - EU-Server
- Stripe (Zahlungsabwicklung) - DSGVO-konform
- Sentry (Error-Tracking) - PII-Anonymisierung aktiv

### 7. Rechte und Pflichten des Auftraggebers
- ✅ Weisungsrecht gegenüber MyDispatch
- ✅ Recht auf Auskunft über Verarbeitung
- ✅ Recht auf Kontrolle der Maßnahmen

### 8. Technische und organisatorische Maßnahmen (TOMs)
- Verschlüsselung in Transit (TLS 1.3)
- Verschlüsselung at Rest (AES-256)
- Row Level Security (RLS)
- 2-Faktor-Authentifizierung (optional)
- Tägliche Backups
- ISO 27001 zertifiziertes Rechenzentrum

### 9. Haftung
- Haftung nach DSGVO Art. 82
- Versicherung: Cyber-Versicherung 5 Mio. €

### 10. Salvatorische Klausel
- Unwirksamkeit einzelner Bestimmungen berührt Vertrag nicht
```

**Digital vereinbarer AVV:**
```tsx
// Bei Registrierung / Tarif-Auswahl
<Checkbox
  id="avv-accept"
  checked={avvAccepted}
  onCheckedChange={setAvvAccepted}
/>
<Label htmlFor="avv-accept" className="text-sm">
  Ich akzeptiere den{' '}
  <Link to="/avv" target="_blank" className="text-primary underline">
    Auftragsverarbeitungsvertrag (AVV)
  </Link>{' '}
  gemäß DSGVO Art. 28
</Label>
```

---

## 💶 UMSATZSTEUER & RECHNUNGEN (UStG § 14)

### Pflichtangaben Rechnung

**VERPFLICHTEND in JEDER Rechnung:**

```typescript
// src/lib/invoice-compliance.ts
export interface InvoiceRequirements {
  // § 14 Abs. 4 UStG
  invoiceNumber: string;           // ✅ Fortlaufend & eindeutig
  invoiceDate: Date;               // ✅ Ausstellungsdatum
  
  supplierName: string;            // ✅ Name Leistungserbringer
  supplierAddress: string;         // ✅ Vollständige Adresse
  supplierTaxId: string;           // ✅ Steuernummer oder USt-IdNr.
  
  customerName: string;            // ✅ Name Leistungsempfänger
  customerAddress: string;         // ✅ Vollständige Adresse
  
  serviceDate: Date;               // ✅ Zeitpunkt der Leistung
  serviceDescription: string;      // ✅ Art der Leistung
  
  netAmount: number;               // ✅ Entgelt (netto)
  taxRate: number;                 // ✅ Steuersatz (19% oder 7%)
  taxAmount: number;               // ✅ Steuerbetrag
  grossAmount: number;             // ✅ Gesamtbetrag (brutto)
  
  // Optional aber empfohlen:
  paymentTerms?: string;           // z.B. "14 Tage netto"
  bankDetails?: string;            // IBAN für Überweisung
}
```

**Kleinunternehmer (§ 19 UStG):**
```typescript
// Falls Kleinunternehmerregelung:
if (isKleinunternehmer) {
  invoiceNote = "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.";
}
```

---

## 🚨 SONDERREGELUNGEN TAXI & MIETWAGEN

### PBefG § 51 - Auftragsaufbewahrung

**VERPFLICHTEND: 10 Jahre Aufbewahrung**

```typescript
// src/lib/pbefg-compliance.ts
export const PBEFG_RETENTION = {
  BOOKING_DATA: {
    duration: 10 * 365, // 10 Jahre
    fields: [
      'booking_date',
      'pickup_location',
      'destination',
      'customer_name',
      'driver_name',
      'vehicle_license_plate',
      'price',
    ],
    legalBasis: 'PBefG § 51 Abs. 2',
  },
};
```

### Fahrer-Dokumente (PBefG § 48)

**VERPFLICHTEND zu prüfen & speichern:**
- ✅ P-Schein (Personenbeförderungsschein)
- ✅ Führerschein (Klasse B)
- ✅ Gesundheitszeugnis (alle 5 Jahre)
- ✅ Führungszeugnis (alle 5 Jahre)

```typescript
// src/lib/driver-compliance.ts
export interface DriverDocuments {
  pSchein: {
    number: string;
    expiryDate: Date;        // ✅ Warnung 30 Tage vorher
    issuingAuthority: string;
  };
  driverLicense: {
    number: string;
    expiryDate: Date;        // ✅ Warnung 30 Tage vorher
    class: 'B' | 'BE';
  };
  healthCertificate: {
    issueDate: Date;
    expiryDate: Date;        // ✅ Alle 5 Jahre erneuern
  };
  criminalRecord: {
    issueDate: Date;
    expiryDate: Date;        // ✅ Alle 5 Jahre erneuern
  };
}
```

---

## ✅ COMPLIANCE-CHECKLISTE

### Vor Implementierung JEDER neuen Seite:

#### Datenschutz (DSGVO)
- [ ] Datenschutzhinweis bei Formularen vorhanden?
- [ ] Nur notwendige Daten erhoben?
- [ ] Löschfristen definiert & implementiert?
- [ ] Cookies nur nach Consent?
- [ ] Link zur Datenschutzerklärung vorhanden?

#### KI-Transparenz (AI Act)
- [ ] KI-generierte Inhalte gekennzeichnet?
- [ ] Icon + Text-Hinweis vorhanden?
- [ ] In jeder KI-Antwort (nicht nur einmalig)?
- [ ] Mehrsprachig (DE/EN)?

#### Impressum & AGB (TMG)
- [ ] Link zu Impressum im Footer?
- [ ] Link zu AGB bei Registrierung/Buchung?
- [ ] Link zu Datenschutz bei Formularen?
- [ ] AVV bei Vertragsabschluss akzeptiert?

#### Rechnungen (UStG)
- [ ] Alle Pflichtangaben § 14 UStG vorhanden?
- [ ] Fortlaufende Rechnungsnummer?
- [ ] Steuersatz korrekt (19% Standard)?
- [ ] Kleinunternehmer-Hinweis falls zutreffend?

#### Taxi/Mietwagen (PBefG)
- [ ] Auftragsdaten 10 Jahre speichern?
- [ ] Fahrer-Dokumente vollständig?
- [ ] Warnung bei Ablauf P-Schein/Führerschein?
- [ ] GPS-Daten nach 24h gelöscht?

---

## 🚫 VERBOTENE PRAKTIKEN

### ❌ Dark Patterns (DSGVO Art. 7)
```tsx
// ❌ VERBOTEN: Vorausgewählte Checkboxen
<Checkbox defaultChecked={true} />

// ✅ RICHTIG: Nutzer muss aktiv zustimmen
<Checkbox defaultChecked={false} />
```

### ❌ Versteckte Kosten (BGB § 312a)
```tsx
// ❌ VERBOTEN: Versteckte Add-Ons
<Checkbox defaultChecked={true} id="addon-versicherung" />
<Label htmlFor="addon-versicherung" className="text-[8px]">
  Premium-Versicherung +29€/Monat
</Label>

// ✅ RICHTIG: Transparent & opt-in
<Checkbox defaultChecked={false} id="addon-versicherung" />
<Label htmlFor="addon-versicherung" className="text-sm font-medium">
  Premium-Versicherung +29€/Monat (optional)
</Label>
```

### ❌ Unzulässige Daten
```typescript
// ❌ VERBOTEN zu erheben (DSGVO Art. 9 - Besondere Kategorien):
interface ForbiddenData {
  religion: string;           // ❌ VERBOTEN!
  politicalViews: string;     // ❌ VERBOTEN!
  ethnicity: string;          // ❌ VERBOTEN!
  healthData: string;         // ❌ VERBOTEN!
  sexualOrientation: string;  // ❌ VERBOTEN!
}
```

---

## 📞 SUPPORT & FRAGEN

**Rechtliche Fragen:**  
- Email: legal@ridehub-solutions.de
- Datenschutzbeauftragter: dsb@ridehub-solutions.de

**Technische Umsetzung:**  
- NeXify Support: support@nexify-automate.com

---

**Letzte Aktualisierung:** 23.10.2025 22:47 Uhr (DE)  
**Nächster Review:** Quartalsweise (März, Juni, September, Dezember)  
**Status:** 🟢 PRODUCTION-READY & RECHTLICH GEPRÜFT
