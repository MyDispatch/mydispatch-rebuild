# ⚖️ Legal Compliance

> **Rechtliche Vorgaben für MyDispatch**  
> **Version:** 18.5.0  
> **Letzte Aktualisierung:** 2025-01-26

---

## 🎯 Übersicht

MyDispatch unterliegt folgenden rechtlichen Rahmenbedingungen:

1. **DSGVO** - Datenschutz-Grundverordnung (EU)
2. **AI Act** - EU-Verordnung über Künstliche Intelligenz
3. **TMG** - Telemediengesetz (Deutschland)
4. **PBefG** - Personenbeförderungsgesetz
5. **BGB** - Bürgerliches Gesetzbuch (Vertragsrecht)

---

## 🔒 DSGVO-Compliance

### Pflicht-Elemente auf JEDER Seite

#### 1. Datenschutz-Hinweis bei Formularen

```tsx
// ✅ RICHTIG - DSGVO-Hinweis bei jedem Formular
<form onSubmit={handleSubmit}>
  <Input name="email" />
  <Input name="phone" />

  <p className="text-xs text-muted-foreground">
    Ihre Daten werden DSGVO-konform verarbeitet.
    Weitere Informationen: <Link to="/datenschutz">Datenschutzerklärung</Link>
  </p>

  <Checkbox required>
    <Label>
      Ich stimme der <Link to="/datenschutz">Datenschutzerklärung</Link> zu
    </Label>
  </Checkbox>
</form>

// ❌ FALSCH - Kein DSGVO-Hinweis
<form onSubmit={handleSubmit}>
  <Input name="email" />
  <Button>Absenden</Button>
</form>
```

#### 2. Footer-Links (TMG-Pflicht)

```tsx
// ✅ RICHTIG - Impressum/Datenschutz/AGB in JEDEM Footer
<footer>
  <nav>
    <Link to="/impressum">Impressum</Link>
    <Link to="/datenschutz">Datenschutz</Link>
    <Link to="/agb">AGB</Link>
  </nav>
</footer>
```

#### 3. Cookie-Consent-Banner

```tsx
// ✅ RICHTIG - Cookie-Banner mit granularen Optionen
<CookieConsent
  onAccept={(preferences) => {
    // Analytics nur wenn akzeptiert
    if (preferences.analytics) {
      initAnalytics();
    }
  }}
  categories={["necessary", "functional", "analytics", "marketing"]}
/>
```

### Datenverarbeitung

#### Minimale Datenerhebung

```tsx
// ✅ RICHTIG - Nur notwendige Daten erheben
interface BookingData {
  pickup_address: string;
  dropoff_address: string;
  pickup_time: Date;
  passengers: number;
  // Keine optionalen Felder ohne Begründung!
}

// ❌ FALSCH - Unnötige Datenerhebung
interface BookingData {
  pickup_address: string;
  dropoff_address: string;
  birthdate: Date; // Nicht nötig für Buchung!
  social_security: string; // Absolut verboten!
}
```

#### Datenlöschung & Archivierung

```sql
-- ✅ RICHTIG - Automatische Löschung nach Aufbewahrungsfrist
CREATE OR REPLACE FUNCTION cleanup_old_bookings()
RETURNS void AS $$
BEGIN
  -- Lösche Buchungen älter als 10 Jahre (gesetzliche Aufbewahrungspflicht)
  DELETE FROM bookings
  WHERE created_at < NOW() - INTERVAL '10 years';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Auskunftsrecht (DSGVO Art. 15)

```tsx
// ✅ RICHTIG - User kann eigene Daten exportieren
async function exportUserData(userId: string) {
  const { data, error } = await supabase.from("bookings").select("*").eq("user_id", userId);

  // Export als JSON
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });

  downloadFile(blob, "my-data.json");
}
```

---

## 🤖 AI Act Compliance

### KI-Kennzeichnung (PFLICHT!)

```tsx
// ✅ RICHTIG - KI-Kennzeichnung bei JEDER KI-Antwort
<div className="ai-response">
  <Badge className="mb-2">
    <Icon name="Bot" className="h-3 w-3" />
    KI-generierte Antwort
  </Badge>
  <p>{aiResponse}</p>
  <p className="text-xs text-muted-foreground mt-2">
    Diese Antwort wurde von einem KI-System generiert und kann Fehler enthalten.
  </p>
</div>
```

### Transparenz über AI-Nutzung

```tsx
// ✅ RICHTIG - Disclaimer in Settings
<Card>
  <CardHeader>
    <CardTitle>KI-Assistenz</CardTitle>
  </CardHeader>
  <CardContent>
    <p>MyDispatch nutzt KI-Systeme für:</p>
    <ul>
      <li>Routenoptimierung (Google/Gemini 2.5 Flash)</li>
      <li>Nachfrageprognose (Gemini 2.5 Pro)</li>
      <li>Customer Support Chat (Gemini 2.5 Flash)</li>
    </ul>
    <p className="text-sm text-muted-foreground mt-4">
      Alle KI-Entscheidungen können von Menschen überprüft und korrigiert werden.
    </p>
  </CardContent>
</Card>
```

---

## 📱 PBefG (Personenbeförderungsgesetz)

### Pflicht-Informationen für Taxi-Buchungen

```tsx
// ✅ RICHTIG - Alle Pflichtangaben gemäß PBefG
interface BookingConfirmation {
  booking_number: string; // Eindeutige Auftrags-Nr
  driver_name: string; // Fahrername
  vehicle_license_plate: string; // Kennzeichen
  estimated_arrival_time: Date; // Voraussichtliche Ankunft
  fare_estimate: number; // Preisschätzung
  payment_method: string; // Zahlungsweise
  company_name: string; // Unternehmen
  company_license_number: string; // Lizenz-Nr (PBefG)
}
```

### Dokumentationspflichten

```sql
-- ✅ RICHTIG - Aufbewahrung von Fahrtaufzeichnungen (10 Jahre)
CREATE TABLE booking_audit_log (
  id UUID PRIMARY KEY,
  booking_id UUID NOT NULL,
  action TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id UUID,
  details JSONB
);

-- RLS Policy für Audit-Logs (nur Admins)
CREATE POLICY "Only admins can view audit logs"
ON booking_audit_log FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));
```

---

## 💳 Zahlungsverkehr & Rechnungsstellung

### Rechnungs-Pflichtangaben (§14 UStG)

```tsx
// ✅ RICHTIG - Alle Pflichtangaben auf Rechnung
interface InvoiceData {
  invoice_number: string; // Fortlaufende Nummer
  invoice_date: Date; // Rechnungsdatum
  company_name: string; // Leistungserbringer
  company_address: string; // Vollständige Adresse
  tax_id: string; // Steuernummer
  vat_id?: string; // USt-IdNr (bei B2B)

  customer_name: string;
  customer_address: string;

  line_items: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    vat_rate: number; // 19% oder 7%
    line_total: number;
  }>;

  subtotal: number;
  vat_amount: number;
  total: number;

  payment_terms: string; // "Zahlbar innerhalb 14 Tagen"
  bank_details: {
    iban: string;
    bic: string;
    bank_name: string;
  };
}
```

### Aufbewahrungspflicht (10 Jahre)

```tsx
// ✅ RICHTIG - Soft-Delete statt Hard-Delete
async function archiveInvoice(invoiceId: string) {
  await supabase
    .from("invoices")
    .update({
      archived: true,
      archived_at: new Date().toISOString(),
    })
    .eq("id", invoiceId);
}

// ❌ FALSCH - Löschen von Rechnungen
async function deleteInvoice(invoiceId: string) {
  await supabase.from("invoices").delete().eq("id", invoiceId); // VERBOTEN! Aufbewahrungspflicht!
}
```

---

## 🔐 Multi-Tenancy & Datentrennung

### RLS Policies (ZWINGEND!)

```sql
-- ✅ RICHTIG - Company-basierte RLS
CREATE POLICY "Users can only see own company bookings"
ON bookings FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM profiles WHERE user_id = auth.uid()
  )
);

-- ❌ FALSCH - Keine RLS = Datenleck!
-- ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
```

### Partner-Datenzugriff

```sql
-- ✅ RICHTIG - Explizite Freigabe nötig
CREATE POLICY "Partner can view shared bookings"
ON bookings FOR SELECT
USING (
  is_partner_booking = true
  AND EXISTS (
    SELECT 1 FROM partner_connections pc
    WHERE (pc.company_a_id = company_id OR pc.company_b_id = company_id)
    AND pc.share_bookings = true
    AND pc.status = 'active'
  )
);
```

---

## 📊 Compliance-Monitoring

### Automatische Prüfungen (CI/CD)

```yaml
# .github/workflows/compliance.yml
name: Legal Compliance Check

on: [push, pull_request]

jobs:
  compliance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      # 1. DSGVO: Prüfe Datenschutz-Hinweise
      - name: Check Privacy Notices
        run: |
          if ! grep -r "Datenschutzerklärung" src/pages/; then
            echo "ERROR: Missing privacy notice"
            exit 1
          fi

      # 2. AI Act: Prüfe KI-Kennzeichnung
      - name: Check AI Disclosure
        run: |
          if grep -r "ai-response" src/ && ! grep -r "KI-generiert" src/; then
            echo "ERROR: Missing AI disclosure"
            exit 1
          fi

      # 3. Security: Supabase RLS Linter
      - name: Run Supabase Security Linter
        run: supabase test db
```

---

## ⚠️ Kritische Fehler vermeiden

### DON'Ts (VERBOTEN)

```tsx
// ❌ 1. Keine öffentlichen Personendaten
export const DRIVERS = [
  { name: "Max Mustermann", phone: "+49123456789" } // DSGVO-Verstoß!
];

// ❌ 2. Keine Hardcoded Credentials
const DB_PASSWORD = "supersecret123"; // NIEMALS!

// ❌ 3. Keine unverschlüsselten Backups
await backup.create({ encrypted: false }); // Datenleck-Risiko!

// ❌ 4. Keine KI-Antworten ohne Kennzeichnung
<div>{aiResponse}</div> // AI Act Verstoß!

// ❌ 5. Keine fehlenden Consent-Checkboxen
<form>
  <Input name="email" />
  <Button>Submit</Button> // Wo ist die Einwilligung?!
</form>
```

---

## 📚 Weitere Ressourcen

- [Security Guidelines](./Security.md)
- [Quality Gates](./Quality-Gates.md)
- [DSGVO Volltext](https://dsgvo-gesetz.de)
- [AI Act Volltext](https://eur-lex.europa.eu)

---

## 📝 Changelog

### V18.5.0 (2025-01-26)

- Erstversion basierend auf bestehenden Compliance-Docs
- DSGVO, AI Act, PBefG, TMG Guidelines konsolidiert
- Code-Beispiele hinzugefügt
- CI/CD Integration dokumentiert

---

**KRITISCH:** Bei Unsicherheiten IMMER rechtlichen Rat einholen!
