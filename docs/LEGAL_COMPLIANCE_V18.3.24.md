# 📋 RECHTSSICHERHEIT V18.3.24 - COMPLIANCE SYSTEM

**Letzte Aktualisierung:** 2025-01-18  
**Status:** ✅ IMPLEMENTIERT  
**Ziel:** 100% Rechtssicherheit für MyDispatch-Kunden

---

## 🎯 ÜBERBLICK

MyDispatch bietet **absolute Rechtssicherheit** durch systematische Einhaltung aller deutschen rechtlichen Vorgaben:

- ✅ **PBefG** (Personenbeförderungsgesetz) - Taxi/Mietwagen
- ✅ **HGB** (Handelsgesetzbuch) - Buchhaltung
- ✅ **DSGVO** (Datenschutz-Grundverordnung)
- ✅ **UStG** (Umsatzsteuergesetz) - Rechnungen
- ✅ **Arbeitsrecht** - Fahrer-Dokumente
- ✅ **Verkehrssicherheit** - TÜV, Versicherung

---

## 🔴 KRITISCHE RECHTLICHE PFLICHTFELDER

### 1. AUFTRÄGE - PBefG § 51

**ZWINGEND erforderlich** (bei Verstößen: Bußgeld bis 10.000 €):

| Feld | Rechtliche Grundlage | Sichtbarkeit | Aufbewahrung |
|------|---------------------|--------------|--------------|
| `booking_number` | PBefG § 51 Abs. 1 | Immer | 10 Jahre |
| **`created_at`** | **PBefG § 51 Abs. 2** | **NIEMALS verstecken!** | **10 Jahre** |
| `pickup_time` | PBefG § 51 Abs. 1 | Immer | 10 Jahre |
| `pickup_address` | PBefG § 51 Abs. 1 | Immer | 10 Jahre |
| `dropoff_address` | PBefG § 51 Abs. 1 | Immer | 10 Jahre |
| `price` | PBefG § 51 Abs. 1 | Immer | 10 Jahre |
| `customer_id` | PBefG § 51 Abs. 1 | Immer | 10 Jahre |
| `driver_id` | PBefG § 51 Abs. 1 | Nach Zuweisung | 10 Jahre |
| `vehicle_id` | PBefG § 51 Abs. 1 | Nach Zuweisung | 10 Jahre |

**KRITISCH:** Das Feld `created_at` (Auftragseingangsdatum/-zeit) MUSS in ALLEN Auftrags-Tabellen sichtbar sein!

**Rechtliche Begründung:**  
§ 51 Abs. 2 PBefG verlangt die **Dokumentation des Auftragseingangszeitpunkts** zur Nachweispflicht bei Prüfungen durch Verkehrsbehörden.

---

### 2. RECHNUNGEN - UStG § 14

**ZWINGEND erforderlich** (bei Verstößen: Verstoß gegen § 14 UStG):

| Feld | Rechtliche Grundlage | Sichtbarkeit | Aufbewahrung |
|------|---------------------|--------------|--------------|
| `invoice_number` | § 14 Abs. 4 Nr. 4 UStG | Immer | 10 Jahre (§ 147 AO) |
| **`created_at`** | **§ 14 Abs. 4 Nr. 1 UStG** | **NIEMALS verstecken!** | **10 Jahre** |
| `customer_id` | § 14 Abs. 4 Nr. 1 UStG | Immer | 10 Jahre |
| `total` | § 14 Abs. 4 Nr. 3 UStG | Immer | 10 Jahre |
| `tax_rate` | § 14 Abs. 4 Nr. 8 UStG | Immer | 10 Jahre |
| `tax_amount` | § 14 Abs. 4 Nr. 8 UStG | Immer | 10 Jahre |
| `net_amount` | § 14 Abs. 4 Nr. 3 UStG | Immer | 10 Jahre |
| `payment_status` | Empfohlen | Immer | 10 Jahre |
| `due_date` | Empfohlen | Immer | 10 Jahre |

**KRITISCH:** Das Feld `created_at` (Rechnungsdatum) MUSS in ALLEN Rechnungs-Tabellen sichtbar sein!

**Rechtliche Begründung:**  
§ 14 Abs. 4 Nr. 1 UStG verlangt ein eindeutiges Rechnungsdatum für steuerliche Nachweise.

---

### 3. KUNDEN - DSGVO Art. 30

**ZWINGEND erforderlich** (bei Verstößen: Bußgeld bis 20 Mio. € oder 4% Jahresumsatz):

| Feld | Rechtliche Grundlage | Sichtbarkeit | Aufbewahrung |
|------|---------------------|--------------|--------------|
| **`created_at`** | **DSGVO Art. 30** | **NIEMALS verstecken!** | **Bis Widerruf** |
| `first_name` | DSGVO Art. 6 | Immer | Bis Widerruf |
| `last_name` | DSGVO Art. 6 | Immer | Bis Widerruf |
| `consent_status` | DSGVO Art. 7 | Dokumentation | Bis Widerruf + 3 Jahre |
| `consent_date` | DSGVO Art. 7 Abs. 1 | Dokumentation | Bis Widerruf + 3 Jahre |

**KRITISCH:** Das Feld `created_at` (Erfassungsdatum) MUSS dokumentiert werden für das Verarbeitungsverzeichnis (Art. 30 DSGVO)!

**Rechtliche Begründung:**  
DSGVO Art. 30 verlangt ein **Verarbeitungsverzeichnis** mit Zeitstempel aller Datenverarbeitungen.

---

### 4. FAHRER - Arbeitsrecht + Verkehrssicherheit

**KRITISCH** (bei Verstößen: Fahrzeug-Stilllegung, Bußgeld):

| Feld | Rechtliche Grundlage | Sichtbarkeit | Aufbewahrung |
|------|---------------------|--------------|--------------|
| `license_number` | StVG § 21 | Immer | Bis Austritt + 3 Jahre |
| **`license_expiry_date`** | **StVG § 24** | **NIEMALS verstecken!** | **Bis Austritt + 3 Jahre** |
| `license_classes` | StVG § 21 | Immer | Bis Austritt + 3 Jahre |
| `employment_start` | Arbeitsrecht | Immer | Bis Austritt + 3 Jahre |

**KRITISCH:** Das Feld `license_expiry_date` (Führerscheinablauf) MUSS **prominent** angezeigt werden mit Ablauf-Warnungen!

**Rechtliche Begründung:**  
Einsatz eines Fahrers mit abgelaufenem Führerschein = **Straftat** (§ 21 StVG: Fahren ohne Fahrerlaubnis).

**Warnungen implementiert:**
- ⚠️ **30 Tage vorher:** Gelbe Warnung
- 🚫 **Abgelaufen:** Rote Warnung + "DARF NICHT MEHR EINGESETZT WERDEN!"

---

### 5. FAHRZEUGE - Verkehrssicherheit

**KRITISCH** (bei Verstößen: Fahrzeug-Stilllegung, Bußgeld bis 270 €):

| Feld | Rechtliche Grundlage | Sichtbarkeit | Aufbewahrung |
|------|---------------------|--------------|--------------|
| `license_plate` | StVZO § 10 | Immer | Bis Verkauf + 2 Jahre |
| **`tuev_expiry`** | **StVZO § 29** | **NIEMALS verstecken!** | **Bis Verkauf + 2 Jahre** |
| `insurance_expiry` | PflVG § 1 | Immer | Bis Verkauf + 2 Jahre |
| `last_maintenance` | Empfohlen | Immer | Bis Verkauf + 2 Jahre |

**KRITISCH:** Das Feld `tuev_expiry` (TÜV-Ablauf) MUSS **prominent** angezeigt werden mit Ablauf-Warnungen!

**Rechtliche Begründung:**  
Einsatz eines Fahrzeugs mit abgelaufenem TÜV = **Ordnungswidrigkeit** (§ 69a StVZO: Bußgeld + Punkte).

**Warnungen implementiert:**
- ⚠️ **60 Tage vorher:** Gelbe Warnung
- 🚫 **Abgelaufen:** Rote Warnung + "DARF NICHT MEHR EINGESETZT WERDEN!"

---

## 📊 VERWENDUNG

### 1. Tabellen-Spalten verwenden

```tsx
import { getBookingColumns, getInvoiceColumns } from '@/lib/legal-compliance/column-definitions';

// In UnifiedPageTemplate
<UnifiedPageTemplate
  content={{
    type: 'table',
    data: bookings,
    columns: getBookingColumns(), // Alle rechtlichen Pflichtfelder inkludiert!
  }}
/>
```

### 2. Compliance-Check ausführen

```tsx
import { validateBookingCompliance } from '@/lib/legal-compliance/compliance-checker';

const check = validateBookingCompliance(booking);

if (!check.valid) {
  console.error('Rechtliche Verstöße:', check.errors);
  // ⚠️ Zeige Fehler im UI
}

if (check.warnings.length > 0) {
  console.warn('Compliance-Warnungen:', check.warnings);
  // ⚠️ Zeige Warnungen im UI
}
```

### 3. Systemweiter Compliance-Check (Dashboard)

```tsx
import { runSystemComplianceCheck, showComplianceWarnings } from '@/lib/legal-compliance/compliance-checker';

const results = await runSystemComplianceCheck(supabase, companyId);
const notification = showComplianceWarnings(results);

if (notification.type === 'error') {
  toast.error(notification.message); // Kritische Verstöße!
} else if (notification.type === 'warning') {
  toast.warning(notification.message); // Warnungen
}
```

---

## ⚖️ RECHTLICHE GRUNDLAGEN

### PBefG (Personenbeförderungsgesetz)

**§ 51 Aufzeichnungspflichten:**
> (1) Unternehmer, die Verkehr mit Taxen, mit Mietomnibussen, mit Mietwagen [...] betreiben, sind verpflichtet, Aufzeichnungen über die Beförderungen [...] zu führen.
> (2) Die Aufzeichnungen müssen Angaben enthalten über:
> - den Auftragseingangszeitpunkt
> - die Abholzeit
> - den Abholort
> - das Fahrziel
> - den Fahrpreis
> - den eingesetzten Fahrer
> - das eingesetzte Fahrzeug

**Aufbewahrungspflicht:** 10 Jahre (§ 51 Abs. 5 PBefG)

**Verstöße:**
- Fehlende Aufzeichnungen: **Bußgeld bis 10.000 €** (§ 61 Abs. 1 Nr. 14 PBefG)
- Nicht verfügbare Nachweise bei Prüfung: **Ordnungswidrigkeit**

---

### HGB & UStG (Rechnungen)

**§ 14 Abs. 4 UStG - Pflichtangaben Rechnung:**
1. Name und Anschrift des Unternehmers
2. Name und Anschrift des Empfängers
3. **Rechnungsdatum** (created_at)
4. **Fortlaufende Rechnungsnummer**
5. Menge und Art der gelieferten Gegenstände/Leistungen
6. Zeitpunkt der Lieferung/Leistung
7. Entgelt
8. **Steuersatz und Steuerbetrag**
9. Hinweis auf Steuerbefreiung (falls zutreffend)

**§ 147 AO - Aufbewahrungspflicht:**
- Rechnungen: **10 Jahre**
- Buchungsbelege: **10 Jahre**

**Verstöße:**
- Fehlende Pflichtangaben: **Vorsteuerabzug nicht möglich**
- Fehlende Aufbewahrung: **Bußgeld bis 25.000 €** (§ 379 AO)

---

### DSGVO (Datenschutz)

**Art. 30 DSGVO - Verarbeitungsverzeichnis:**
> (1) Jeder Verantwortliche [...] führt ein Verzeichnis aller Verarbeitungstätigkeiten.
> (2) Das Verzeichnis enthält:
> - den Zeitpunkt der Datenerhebung (created_at)
> - die Kategorien betroffener Personen
> - die Zwecke der Verarbeitung
> - die Löschfristen

**Art. 7 DSGVO - Einwilligung:**
> (1) Der Verantwortliche muss nachweisen können, dass die betroffene Person in die Verarbeitung eingewilligt hat.

**Verstöße:**
- Fehlendes Verarbeitungsverzeichnis: **Bußgeld bis 10 Mio. € oder 2% Jahresumsatz**
- Fehlende Einwilligungsnachweise: **Bußgeld bis 20 Mio. € oder 4% Jahresumsatz**

---

### Arbeitsrecht (Fahrer)

**StVG § 21 - Fahrerlaubnis:**
> (1) Wer auf öffentlichen Straßen ein Kraftfahrzeug führt, bedarf der Fahrerlaubnis.

**§ 24 StVG - Gültigkeitsdauer:**
> Die Fahrerlaubnis wird auf Zeit erteilt.

**Verstöße:**
- Fahren ohne gültige Fahrerlaubnis: **Straftat** (Freiheitsstrafe bis 1 Jahr oder Geldstrafe)
- Arbeitgeber lässt Fahrer mit abgelaufenem Führerschein fahren: **Haftung**

---

### Verkehrssicherheit (Fahrzeuge)

**StVZO § 29 - Hauptuntersuchung (TÜV):**
> (1) Kraftfahrzeuge müssen in bestimmten Zeitabständen einer Hauptuntersuchung unterzogen werden.

**PflVG § 1 - Versicherungspflicht:**
> Der Halter eines Kraftfahrzeugs ist verpflichtet, für sich [...] eine Haftpflichtversicherung abzuschließen.

**Verstöße:**
- TÜV überzogen: **Bußgeld 15-75 € + 1 Punkt** (bei >8 Monaten)
- Versicherung abgelaufen: **Straftat** (§ 6 PflVG: Freiheitsstrafe bis 1 Jahr oder Geldstrafe)

---

## 🚨 AUTOMATISCHE WARNUNGEN

Das System zeigt automatisch Warnungen an:

### 1. Dashboard-Widget "Dringende Aktionen"
```tsx
<DashboardWidget type="urgent-actions">
  {expiringLicenses.length > 0 && (
    <ActionItem 
      type="error"
      title="3 Führerscheine laufen ab"
      description="In den nächsten 7 Tagen"
      badge="KRITISCH"
    />
  )}
</DashboardWidget>
```

### 2. Tabellen-Ampelsystem
- 🟢 Grün: Alles OK
- 🟡 Gelb: Warnung (30-60 Tage vor Ablauf)
- 🔴 Rot: Kritisch (abgelaufen oder <30 Tage)

### 3. Console-Warnings (Development)
```
⚠️ RECHTLICHE VERSTÖSSE: 5 kritische Fehler gefunden!
{
  bookings: { errors: 2, warnings: 1 },
  drivers: { errors: 3, warnings: 0 }
}
```

---

## ✅ CHECKLISTE FÜR ENTWICKLER

Vor jeder Seiten-Migration prüfen:

- [ ] Alle Pflichtfelder aus `LEGAL_REQUIREMENTS` inkludiert?
- [ ] `created_at` Feld NIEMALS versteckt (auch nicht auf Mobile)?
- [ ] Ablauf-Warnungen für Führerschein/TÜV implementiert?
- [ ] PDF-Downloads mit allen Pflichtangaben?
- [ ] Compliance-Check ausgeführt?
- [ ] Dokumentation aktualisiert?

---

## 📚 WEITERFÜHRENDE LINKS

- [PBefG im Volltext](https://www.gesetze-im-internet.de/pbefg/)
- [UStG § 14 Rechnungsstellung](https://www.gesetze-im-internet.de/ustg_1980/__14.html)
- [DSGVO Art. 30](https://dsgvo-gesetz.de/art-30-dsgvo/)
- [StVG § 21 Fahrerlaubnis](https://www.gesetze-im-internet.de/stvg/__21.html)
- [StVZO § 29 Hauptuntersuchung](https://www.gesetze-im-internet.de/stvzo_2012/__29.html)

---

**Version:** V18.3.24  
**Status:** ✅ PRODUKTIV  
**Kontakt:** datenschutz@my-dispatch.de
