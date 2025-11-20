# Landing-Page Legal-Texte Implementation V18.3.25

**Status:** ✅ Production Ready | **Datum:** 2025-01-18  
**Komponente:** `src/components/shared/LegalDialog.tsx`  
**Version:** V18.3.25 FINAL

---

## 🎯 Übersicht

Vollständig rechtssichere Implementierung von Impressum, Datenschutzerklärung und AGB für Taxi-/Mietwagenunternehmen auf Unternehmer-Landingpages.

**Compliance:**
- ✅ **DSGVO** (Art. 13, 14 - Informationspflichten)
- ✅ **TMG** (§ 5 Impressumspflicht)
- ✅ **PBefG** (Personenbeförderungsgesetz)
- ✅ **AI Act** (Art. 52 - KI-Transparenzpflicht)
- ✅ **eRecht24-konform**

---

## 📄 1. IMPRESSUM (§ 5 TMG)

### Implementierte Sections:

```tsx
✅ Angaben gemäß § 5 TMG
   - Firmenname
   - Vertretungsberechtigte Person(en)
   - Kontaktdaten (Email, Telefon)

✅ Umsatzsteuer-ID
   - Gemäß § 27a UStG

✅ Verantwortlich für Inhalt
   - § 55 Abs. 2 RStV

✅ EU-Streitschlichtung
   - Link zur EU-OS-Plattform
   - https://ec.europa.eu/consumers/odr

✅ Verbraucherstreitbeilegung
   - Hinweis auf Nicht-Teilnahme

✅ Haftung für Inhalte
   - § 7 Abs. 1 TMG
   - §§ 8 bis 10 TMG

✅ Haftung für Links
   - Externe Websites

✅ Urheberrecht
   - Deutsches Urheberrecht
```

### Rechtliche Basis:
- **TMG § 5:** Impressumspflicht für geschäftsmäßige Online-Dienste
- **RStV § 55:** Verantwortlichkeit für journalistisch-redaktionelle Inhalte
- **VSBG:** Verbraucherstreitbeilegungsgesetz

---

## 🔒 2. DATENSCHUTZERKLÄRUNG (DSGVO)

### Implementierte Sections:

```tsx
✅ 1. Datenschutz auf einen Blick
   - Allgemeine Hinweise
   - Wer ist verantwortlich?
   - Wie erfassen wir Daten?
   - Wofür nutzen wir Daten?
   - Welche Rechte haben Sie?

✅ 2. Hosting & Infrastruktur
   - Anbieter: Google Cloud Platform, Cloudflare
   - Serverstandort: Deutschland (Frankfurt), EU
   - Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO, Art. 28 DSGVO
   - AVV vorhanden
   - DSGVO-Zertifizierung

✅ 3. KI-Assistent & Chatbot
   - Anbieter: MyDispatch AI (Gemini 2.5 Flash, Claude Sonnet 4)
   - AI Act Art. 52 Transparenzpflicht
   - Hosting: Google Cloud (EU, DSGVO-konform)
   - Zweck: Support, Routing, Optimierung

✅ 4. Allgemeine Hinweise
   - Datenschutz-Commitment
   - Verantwortliche Stelle
   - Speicherdauer
   - Widerruf der Einwilligung
   - Beschwerderecht bei Aufsichtsbehörde
   - Recht auf Datenübertragbarkeit
   - SSL/TLS-Verschlüsselung
   - Auskunft, Löschung, Berichtigung

✅ 5. Datenerfassung auf dieser Website
   - Kontaktformular & Buchungsanfragen
   - Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)
   - Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)
   - Anfrage per Email/Telefon

✅ 6. Ihre Rechte (DSGVO)
   - Art. 15: Auskunftsrecht
   - Art. 16: Recht auf Berichtigung
   - Art. 17: Recht auf Löschung
   - Art. 18: Recht auf Einschränkung
   - Art. 21: Recht auf Widerspruch
   - Art. 20: Recht auf Datenübertragbarkeit
   - Art. 77: Beschwerderecht
```

### DSGVO-Compliance:

**Art. 13 DSGVO - Informationspflichten:**
- ✅ Name und Kontaktdaten des Verantwortlichen
- ✅ Zwecke und Rechtsgrundlagen der Verarbeitung
- ✅ Empfänger der Daten
- ✅ Speicherdauer
- ✅ Betroffenenrechte (Art. 15-21 DSGVO)
- ✅ Beschwerderecht bei Aufsichtsbehörde
- ✅ Widerrufsrecht

**Art. 28 DSGVO - Auftragsverarbeiter:**
- ✅ AVV mit Google Cloud Platform
- ✅ AVV mit Cloudflare
- ✅ EU-Datacenter (DSGVO-konform)

**AI Act (Art. 52) - KI-Transparenz:**
- ✅ Explizite Information über KI-Nutzung
- ✅ Verwendete Modelle transparent genannt
- ✅ Zweck der KI-Verarbeitung erklärt
- ✅ Datenschutz-Garantien dokumentiert

---

## 📜 3. AGB (Allgemeine Geschäftsbedingungen)

### Implementierte Paragraphen:

```tsx
✅ § 1 Geltungsbereich
   - AGB für Taxi-/Mietwagenverkehr (PBefG)
   - Einzelfahrten + wiederkehrende Aufträge
   - Ausschluss abweichender Kundenbedingungen

✅ § 2 Vertragsschluss
   - Buchung per Telefon/Email/Online
   - Taxi: Vertrag durch Einsteigen
   - Recht auf Ablehnung (außer Beförderungspflicht)

✅ § 3 Leistungsumfang
   - Sichere + pünktliche Beförderung
   - Fahrzeuge: gesetzlich zugelassen
   - Gepäck: üblicher Umfang inklusive
   - Tiere: nach Absprache

✅ § 4 Preise und Zahlung
   - Taxi: amtliche Tarife (Taxameter)
   - Mietwagen: Vorab-Vereinbarung
   - Zusatzleistungen: extra berechnet
   - Zahlung: bar, EC, Kreditkarte, Rechnung
   - Verzugszinsen bei Zahlungsverzug

✅ § 5 Stornierung und Nichterscheinen
   - > 24h: kostenfrei
   - < 24h: 50% Ausfallgebühr
   - No-Show: 100% oder 25€ Pauschale
   - Ausnahme: höhere Gewalt

✅ § 6 Haftung
   - Personenschäden: volle Haftung
   - Sachschäden: nur grobe Fahrlässigkeit/Vorsatz
   - Gepäck: nach PBefG
   - Verspätung: keine Haftung bei höherer Gewalt
   - Fundsachen: 6 Monate Aufbewahrung

✅ § 7 Pflichten des Fahrgasts
   - Pünktlichkeit (10 Min. Wartezeit kostenfrei)
   - Anweisungen des Fahrers befolgen
   - Rauch-/Alkohol-/Drogenverbot
   - Reinigungskosten bei Verschmutzung
   - Ausschluss bei Trunkenheit

✅ § 8 Beförderungsausschluss
   - Alkohol/Drogen-Einfluss
   - Waffen/gefährliche Gegenstände
   - Beleidigung/Bedrohung
   - Sicherheitsgefährdung
   - Verstoß gegen AGB

✅ § 9 Datenschutz
   - Verarbeitung gemäß DSGVO
   - Nur zur Vertragserfüllung
   - Verweis auf Datenschutzerklärung

✅ § 10 Schlussbestimmungen
   - Deutsches Recht
   - Gerichtsstand: Unternehmenssitz
   - Salvatorische Klausel
   - Änderungsvorbehalt (4 Wochen Frist)
```

### PBefG-Compliance:

**§ 51 PBefG - Beförderungspflicht:**
- ✅ Taxi: Beförderungspflicht im Pflichtfahrgebiet
- ✅ Mietwagen: kein Kontrahierungszwang
- ✅ Ausschluss bei Gefährdung

**Taxentarifverordnung:**
- ✅ Taxameter-Pflicht erwähnt
- ✅ Amtliche Tarife bindend
- ✅ Zusatzkosten transparent

---

## 🎨 UI/UX-Implementation

### Dialog-Komponente:

```tsx
<Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent className="max-w-4xl max-h-[85vh]">
    <DialogHeader className="pb-4 border-t">
      <DialogTitle className="text-2xl sm:text-3xl font-bold">
        <span className="w-1 h-8 bg-primary rounded-full" />
        {title}
      </DialogTitle>
    </DialogHeader>
    
    <ScrollArea className="max-h-[calc(85vh-8rem)] pr-4">
      {content}
    </ScrollArea>
  </DialogContent>
</Dialog>
```

**Features:**
- ✅ Max. 85vh Höhe (Mobile-optimiert)
- ✅ ScrollArea für lange Texte
- ✅ Primary-Color-Akzent
- ✅ Responsive Text-Größen
- ✅ Semantic HTML (section, h3, h4, p, ul)

---

### Content-Styling:

```tsx
// Sections
<section className="space-y-6">
  <h3 className="font-bold text-lg mb-3">Hauptüberschrift</h3>
  <h4 className="font-semibold text-base mt-4 mb-2">Unterüberschrift</h4>
  <p className="text-sm text-muted-foreground">Text...</p>
</section>

// Wichtige Hinweise (hervorgehoben)
<div className="bg-muted/30 p-4 rounded-lg mb-3">
  <p className="text-sm"><strong>Anbieter:</strong> ...</p>
</div>

// Listen
<ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
  <li>Punkt 1</li>
  <li>Punkt 2</li>
</ul>
```

---

## 📱 Responsive Design

### Mobile (< 768px):
- ✅ Text: `text-sm` (14px)
- ✅ Headlines: `text-base` bis `text-lg`
- ✅ Dialog: 90vw Breite
- ✅ Padding: `p-4`

### Tablet (768px - 1024px):
- ✅ Text: `text-base` (16px)
- ✅ Headlines: `text-lg` bis `text-xl`
- ✅ Dialog: 80vw Breite

### Desktop (> 1024px):
- ✅ Text: `text-base` (16px)
- ✅ Headlines: `text-xl` bis `text-3xl`
- ✅ Dialog: max-w-4xl (896px)

---

## 🔧 Usage Example

### In Unternehmer.tsx:

```tsx
import { LegalDialog } from '@/components/shared/LegalDialog';

// State
const [legalDialog, setLegalDialog] = useState<'impressum' | 'datenschutz' | 'agb' | null>(null);

// Footer
<footer>
  <button onClick={() => setLegalDialog('impressum')}>Impressum</button>
  <button onClick={() => setLegalDialog('datenschutz')}>Datenschutz</button>
  <button onClick={() => setLegalDialog('agb')}>AGB</button>
</footer>

// Dialog
{legalDialog && (
  <LegalDialog
    open={!!legalDialog}
    onOpenChange={() => setLegalDialog(null)}
    type={legalDialog}
    companyName={company.name}
    primaryColor={company.primary_color}
  />
)}
```

---

## ✅ Quality Checklist

### Content:
- [x] Alle Pflicht-Sections enthalten
- [x] Rechtlich korrekte Formulierungen
- [x] Aktuelle Gesetzesverweise
- [x] Datum automatisch generiert
- [x] Company-Name dynamisch

### Compliance:
- [x] DSGVO Art. 13, 14 erfüllt
- [x] TMG § 5 erfüllt
- [x] PBefG § 51 berücksichtigt
- [x] AI Act Art. 52 erfüllt
- [x] eRecht24-Standard

### UX:
- [x] Mobile-First Responsive
- [x] Scrollbar bei langen Texten
- [x] Touch-optimierte Buttons
- [x] Schnelle Load-Times
- [x] Semantic HTML

### Design:
- [x] Design-System-konform
- [x] Keine Inline-Styles (außer primaryColor)
- [x] Typografie-Hierarchie
- [x] Adequate Spacing
- [x] Color-Contrast WCAG AA

---

## 📞 Support

**Tech Lead:** MyDispatch Development Team  
**Legal Review:** eRecht24-Standard  
**Letzte Aktualisierung:** 2025-01-18  
**Nächste Review:** April 2025

---

**© 2025 MyDispatch - Legal-Texte Implementation V18.3.25**
