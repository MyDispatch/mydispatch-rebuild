# 📋 PFLICHTDOKUMENTE-MATRIX V18.3
**MyDispatch Compliance-Framework für Personenbeförderungsgewerbe**

---

## 🎯 Executive Summary

Diese Matrix definiert **ALLE rechtlich erforderlichen Dokumente** für das Personenbeförderungsgewerbe in Deutschland. Sie ist die Grundlage für:
- ✅ Rechtssicheren Betrieb (PBefG, StVG, StVZO-Konformität)
- ✅ Automatische Überwachung (Expiry-Tracking)
- ✅ Proaktive Warnungen (7/14/30/60/90 Tage vorher)
- ✅ Dashboard-Integration (Compliance-Widget)

---

## 📚 TEIL 1: FAHRER-DOKUMENTE

### 1.1 KRITISCH (Betriebsverbot ohne!)

| Dokument | Datenbank-Spalte | Rechtliche Basis | Gültigkeitsdauer | Warn-Stufen | Status |
|----------|------------------|------------------|------------------|-------------|---------|
| **Führerschein** | `license_expiry_date` | StVG § 2 | 10-15 Jahre | 7/14/30/60 Tage | ✅ LIVE |
| **P-Schein** | `p_schein_expiry_date` | PBefG § 48 | 5 Jahre | 7/14/30/60/90 Tage | ✅ NEU V18.3 |
| **Gesundheitszeugnis** | `medical_certificate_expiry` | PBefG § 48 Abs. 4 | 5 Jahre (über 60J: 3 Jahre) | 14/30/60 Tage | ✅ NEU V18.3 |

**Details P-Schein (Personenbeförderungsschein):**
- **PFLICHT für:** Taxi, Mietwagen, Krankentransport, Linienverkehr
- **Voraussetzungen:**
  - Mindestalter 21 Jahre
  - Besitz Führerschein Klasse B (mind. 2 Jahre)
  - Ortskundeprüfung (bei Taxi)
  - Gesundheitszeugnis
  - Führungszeugnis (nicht älter als 3 Monate)
- **Kosten:** ~300-500€
- **Ausstellung:** Straßenverkehrsamt
- **Verlängerung:** Vor Ablauf beantragen (Bearbeitungszeit beachten!)

**Details Gesundheitszeugnis:**
- **Untersuchung durch:** Betriebsarzt / Amtsarzt
- **Inhalt:** Sehtest, Hörtest, körperliche/geistige Eignung
- **Kosten:** ~100-150€
- **Gültigkeit:** 
  - Bis 60 Jahre: 5 Jahre
  - Ab 60 Jahre: 3 Jahre
  - Ab 65 Jahre: jährlich

### 1.2 WICHTIG (Behördliche Anforderungen)

| Dokument | Datenbank-Spalte | Rechtliche Basis | Gültigkeitsdauer | Warn-Stufen | Status |
|----------|------------------|------------------|------------------|-------------|---------|
| **Führungszeugnis** | `police_clearance_expiry` | PBefG § 48 Abs. 4 | Keine (aber Aktualität 3 Monate) | 30/60 Tage | ✅ NEU V18.3 |
| **Fahrgast-Unfallversicherung** | document_type: `fahrgast_unfallversicherung` | PBefG § 21 | 1 Jahr | 30/60 Tage | ✅ NEU V18.3 |

**Details Führungszeugnis:**
- **Art:** Erweitertes Führungszeugnis nach § 30a BZRG
- **Zweck:** Nachweis Zuverlässigkeit
- **Bestellung:** Bürgeramt / Online
- **Kosten:** 13€
- **Gültigkeit:** Keine formale, aber behördliche Anforderung max. 3 Monate alt

### 1.3 OPTIONAL (Unternehmens-Compliance)

| Dokument | Zweck | Status |
|----------|-------|--------|
| **Fahrerausweis** | Firmen-interner Ausweis | Optional |
| **Schulungs-Zertifikate** | Kundenservice, Erste Hilfe | Empfohlen |
| **Datenschutz-Schulung** | DSGVO-Konformität | Empfohlen |

---

## 🚗 TEIL 2: FAHRZEUG-DOKUMENTE

### 2.1 KRITISCH (Betriebsverbot ohne!)

| Dokument | Datenbank-Spalte | Rechtliche Basis | Gültigkeitsdauer | Warn-Stufen | Status |
|----------|------------------|------------------|------------------|-------------|---------|
| **TÜV (HU)** | `tuev_expiry_date` | StVZO § 29 | 2 Jahre (neu: 3 Jahre) | 7/14/30 Tage | ✅ LIVE |
| **Versicherung (Haftpflicht)** | `insurance_end_date` | PflVG § 1 | 1 Jahr | 7/14/30/60 Tage | ✅ LIVE |
| **Taxameter-Eichung** | `taxameter_calibration_expiry` | Eichgesetz § 33 | 1-2 Jahre | 14/30/60 Tage | ✅ NEU V18.3 |

**Details Taxameter-Eichung:**
- **PFLICHT für:** Nur Taxis (nicht Mietwagen!)
- **Durchführung:** Eichamt
- **Kosten:** ~150-250€
- **Gültigkeit:** 
  - Erstprüfung: 2 Jahre
  - Nachfolgeprüfung: 1 Jahr
- **Bußgeld bei Verstoß:** bis 5.000€

### 2.2 WICHTIG (Behördliche Anforderungen)

| Dokument | Datenbank-Spalte | Rechtliche Basis | Gültigkeitsdauer | Warn-Stufen | Status |
|----------|------------------|------------------|------------------|-------------|---------|
| **Zulassungsbescheinigung Teil I** | `registration_part_1_expiry` | FZV § 11 | Unbegrenzt (aber Aktualität!) | 30 Tage | ✅ NEU V18.3 |
| **Zulassungsbescheinigung Teil II** | document_type: `zulassung_teil_2` | FZV § 11 | Unbegrenzt | - | ✅ NEU V18.3 |
| **Mietwagenvertrag** | `rental_agreement_expiry` | PBefG § 49 | Vertragslaufzeit | 30/60 Tage | ✅ NEU V18.3 |

**Details Mietwagenvertrag:**
- **Erforderlich bei:** Fahrzeug ist gemietet (nicht Eigentum)
- **Inhalt:** Versicherungsnachweis, Laufzeit, Konditionen
- **Aufbewahrung:** Im Fahrzeug mitführen

### 2.3 OPTIONAL (Unternehmens-Compliance)

| Dokument | Zweck | Status |
|----------|-------|--------|
| **Wartungsplan** | Herstellervorgaben | Empfohlen |
| **Fahrzeugbuch** | Fahrtennachweise (Steuer) | Empfohlen |
| **Winterreifen-Nachweis** | Saisonale Pflicht | Saisonal |

---

## 🏢 TEIL 3: UNTERNEHMENS-DOKUMENTE

### 3.1 KRITISCH (Betriebsverbot ohne!)

| Dokument | Datenbank-Spalte | Rechtliche Basis | Gültigkeitsdauer | Warn-Stufen | Status |
|----------|------------------|------------------|------------------|-------------|---------|
| **PBefG-Genehmigung** | `pbefg_permit_expiry` | PBefG § 13 | Unbefristet / 5 Jahre | 7/14/30/60/90 Tage | ✅ NEU V18.3 |
| **Betriebshaftpflicht** | `liability_insurance_expiry` | PBefG § 21 | 1 Jahr | 7/14/30/60 Tage | ✅ NEU V18.3 |
| **Gewerbeanmeldung** | `business_registration_expiry` | GewO § 14 | Unbegrenzt (aber Aktualität!) | 30 Tage | ✅ NEU V18.3 |

**Details PBefG-Genehmigung (Konzession):**
- **Arten:**
  - Taxi-Konzession (unbefristet)
  - Mietwagen-Genehmigung (unbefristet)
  - Linienverkehr (befristet 5-10 Jahre)
- **Voraussetzungen:**
  - Fachliche Eignung (IHK-Prüfung)
  - Finanzielle Leistungsfähigkeit (Eigenkapital-Nachweis)
  - Betriebssitz im Konzessionsgebiet
- **Kosten:** 500-2.000€
- **Ausstellung:** Verkehrsamt / Regierungspräsidium

**KRITISCH:** Ohne gültige PBefG-Genehmigung = Illegale Personenbeförderung!
- **Bußgeld:** bis 20.000€
- **Straftat:** Bei Gewerbsmäßigkeit (§ 15 PBefG)

**Details Betriebshaftpflicht:**
- **Deckungssumme:** Mind. 1 Mio. € pro Person
- **Umfang:** Personenschäden, Sachschäden, Vermögensschäden
- **Kosten:** ~500-1.500€/Jahr (je nach Flottengröße)

### 3.2 WICHTIG (GmbH/UG-spezifisch)

| Dokument | Datenbank-Spalte | Rechtliche Basis | Gültigkeitsdauer | Warn-Stufen | Status |
|----------|------------------|------------------|------------------|-------------|---------|
| **Handelsregister-Auszug** | `commercial_register_number` | HGB § 8 | Keine (aber Aktualität 3 Monate) | 30/60 Tage | ✅ NEU V18.3 |
| **Gesellschaftsvertrag** | document_type: `gesellschaftsvertrag` | GmbHG § 3 | Unbegrenzt | - | 🔄 TODO |
| **Geschäftsführer-Bestellung** | document_type: `geschaeftsfuehrer` | GmbHG § 6 | Unbegrenzt | - | 🔄 TODO |

**Details Handelsregister-Auszug:**
- **Zweck:** Nachweis Unternehmensform, Vertretungsberechtigung
- **Bezug:** Online (handelsregister.de) oder Amtsgericht
- **Kosten:** 9€ (Online), 15€ (beglaubigt)
- **Aktualität:** Behörden fordern meist nicht älter als 3 Monate

### 3.3 OPTIONAL (Compliance-Empfehlungen)

| Dokument | Zweck | Status |
|----------|-------|--------|
| **Qualitätsmanagement-Zertifikat** | ISO 9001 | Optional |
| **Umwelt-Zertifikat** | ISO 14001 | Optional |
| **Arbeitsschutz-Nachweis** | BG-Prüfung | Empfohlen |

---

## 👥 TEIL 4: KUNDEN-DOKUMENTE (Business)

### 4.1 WICHTIG (B2B-Kunden)

| Dokument | Datenbank-Spalte | Zweck | Gültigkeitsdauer | Status |
|----------|------------------|-------|------------------|--------|
| **Handelsregister-Auszug** | document_type: `customer_handelsregister` | Bonität, Vertretung | 3 Monate | ✅ NEU V18.3 |
| **USt-IdNr. Validierung** | document_type: `ust_id_validation` | Reverse-Charge | Keine | ✅ NEU V18.3 |
| **Bonitätsauskunft** | document_type: `creditworthiness` | Zahlungsfähigkeit | 1 Jahr | 🔄 TODO |

**Details USt-IdNr. Validierung:**
- **Zweck:** Reverse-Charge bei innergemeinschaftlichen Leistungen
- **Prüfung:** BZSt-Online-Portal (mias.bff-online.de)
- **Speicherung:** Bestätigungsnummer aufbewahren (10 Jahre Aufbewahrungspflicht!)

---

## 📊 TEIL 5: AUTOMATISIERUNGS-MATRIX

### 5.1 Reminder-System (Aktuell Implementiert)

| Entity | Dokument | Trigger | Reminder-Tage | Status |
|--------|----------|---------|---------------|--------|
| Fahrer | Führerschein | license_expiry_date | 7, 14, 30, 60 | ✅ LIVE |
| Fahrer | P-Schein | p_schein_expiry_date | 7, 14, 30, 60, 90 | ✅ V18.3 |
| Fahrer | Gesundheitszeugnis | medical_certificate_expiry | 14, 30, 60 | ✅ V18.3 |
| Fahrzeug | TÜV | tuev_expiry_date | 7, 14, 30 | ✅ LIVE |
| Fahrzeug | Versicherung | insurance_end_date | 7, 14, 30, 60 | ✅ LIVE |
| Fahrzeug | Taxameter-Eichung | taxameter_calibration_expiry | 14, 30, 60 | ✅ V18.3 |
| Unternehmen | PBefG-Genehmigung | pbefg_permit_expiry | 7, 14, 30, 60, 90 | ✅ V18.3 |
| Unternehmen | Betriebshaftpflicht | liability_insurance_expiry | 7, 14, 30, 60 | ✅ V18.3 |

### 5.2 Dashboard-Widget (Geplant Sprint 49)

```typescript
// DashboardComplianceWidget.tsx - NEU

interface ComplianceStatus {
  expired: number;       // ROT - Sofort handeln!
  critical: number;      // ORANGE - < 7 Tage
  warning: number;       // GELB - < 30 Tage
  ok: number;           // GRÜN - > 30 Tage
}

<Card>
  <CardHeader>
    <CardTitle>Compliance-Status</CardTitle>
  </CardHeader>
  <CardContent>
    {expired > 0 && (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>KRITISCH: {expired} Dokumente abgelaufen!</AlertTitle>
        <AlertDescription>Betriebsverbot droht!</AlertDescription>
      </Alert>
    )}
    
    {/* Breakdown nach Entity-Type */}
    <ComplianceBreakdown 
      drivers={driverCompliance}
      vehicles={vehicleCompliance}
      company={companyCompliance}
    />
  </CardContent>
</Card>
```

### 5.3 Materialized View (Performance)

```sql
-- BEREITS IMPLEMENTIERT V18.3!
CREATE MATERIALIZED VIEW mv_document_expiry_dashboard AS
SELECT
  company_id,
  entity_type,
  document_type,
  status,
  COUNT(*) AS count,
  ARRAY_AGG(entity_id) AS entity_ids,
  ARRAY_AGG(entity_name) AS entity_names,
  ARRAY_AGG(expiry_date ORDER BY expiry_date) AS expiry_dates
FROM v_all_expiring_documents
WHERE status IN ('expired', 'critical', 'warning')
GROUP BY company_id, entity_type, document_type, status;
```

**Performance:**
- ✅ Tägliches Refresh (Cron-Job)
- ✅ Indexed (company_id, entity_type, document_type, status)
- ✅ Aggregierte Counts (statt Einzelabfragen)

---

## 🔔 TEIL 6: BENACHRICHTIGUNGS-STRATEGIE

### 6.1 E-Mail-Benachrichtigungen

| Warn-Stufe | Zeitpunkt | Empfänger | Priorität | Status |
|------------|-----------|-----------|-----------|--------|
| **KRITISCH** | 7 Tage | Admin + Betroffener | Hoch | 🔄 TODO (Sprint 49) |
| **WICHTIG** | 14 Tage | Admin | Mittel | 🔄 TODO |
| **VORWARNUNG** | 30 Tage | Admin | Normal | 🔄 TODO |
| **INFORMATION** | 60/90 Tage | Admin | Niedrig | 🔄 TODO |

**E-Mail-Templates:**
- ✅ `license-expiry-reminder.html` (Führerschein)
- 🔄 `p-schein-expiry-reminder.html` (P-Schein) - NEU
- 🔄 `medical-certificate-reminder.html` (Gesundheitszeugnis) - NEU
- 🔄 `pbefg-permit-critical.html` (PBefG-Genehmigung) - NEU

### 6.2 SMS-Benachrichtigungen (Optional - Business+)

**Nur für KRITISCHE Dokumente (< 7 Tage):**
- Führerschein
- P-Schein
- PBefG-Genehmigung
- Versicherung

**Kosten:** ~0,07€ pro SMS (Bulk-Tarif)

### 6.3 Push-Benachrichtigungen (PWA)

**Geplant Sprint 50:**
- Browser-Notifications (Service Worker)
- Nur mit User-Consent (DSGVO!)
- Konfigurierbar (Einstellungen)

---

## 📈 TEIL 7: STATISTIKEN & REPORTING

### 7.1 Compliance-Dashboard-KPIs

```typescript
// Dashboard-Stats Hook erweitern

interface ComplianceStats {
  // Gesamt-Compliance-Quote
  overallComplianceRate: number; // 0-100%
  
  // Nach Kategorie
  driverCompliance: number;
  vehicleCompliance: number;
  companyCompliance: number;
  
  // Kritische Counts
  expiredDocuments: number;
  expiringNext7Days: number;
  expiringNext30Days: number;
  
  // Top-Risiken
  highestRiskEntity: {
    type: 'driver' | 'vehicle' | 'company';
    id: string;
    name: string;
    expiredCount: number;
  };
}
```

### 7.2 Compliance-Reports (Monatlich)

**Automatischer Report per E-Mail:**
- Compliance-Quote des Monats
- Neu ablaufende Dokumente (nächste 90 Tage)
- Kritische Vorfälle (abgelaufene Dokumente)
- Handlungsempfehlungen

**PDF-Export:** 🔄 TODO (Sprint 51)

---

## ⚠️ TEIL 8: RECHTLICHE KONSEQUENZEN (Verstoß-Matrix)

| Dokument | Verstoß | Bußgeld | Betriebsverbot | Straftat |
|----------|---------|---------|----------------|----------|
| **Führerschein abgelaufen** | Fahren ohne gültige Fahrerlaubnis | bis 5.000€ | Ja | Ja (§ 21 StVG) |
| **P-Schein abgelaufen** | Personenbeförderung ohne Schein | bis 5.000€ | Ja | Nein |
| **TÜV überzogen** | Fahren ohne gültige HU | bis 75€ | Ja (>8 Monate) | Nein |
| **Versicherung abgelaufen** | Fahren ohne Versicherung | bis 180 Tagessätze | Ja | Ja (§ 6 PflVG) |
| **PBefG-Genehmigung fehlt** | Illegale Personenbeförderung | bis 20.000€ | Ja | Ja (§ 15 PBefG) |
| **Taxameter nicht geeicht** | Verstoß gegen Eichgesetz | bis 5.000€ | Ja | Nein |

**KRITISCH:** Versicherung + PBefG-Genehmigung sind **STRAFTATEN**!

---

## 🚀 TEIL 9: ROADMAP (Sprint 49-52)

### Sprint 49: Dashboard-Integration
- [ ] ComplianceWidget auf Dashboard
- [ ] v_all_expiring_documents Hook
- [ ] Status-Breakdown nach Entity
- [ ] Quick-Actions (Dokument hochladen)

### Sprint 50: Benachrichtigungs-System
- [ ] E-Mail-Reminder (Resend)
- [ ] SMS-Reminder (Optional - Business+)
- [ ] Push-Notifications (PWA)
- [ ] Notification-Preferences (Einstellungen)

### Sprint 51: Reporting & Export
- [ ] Compliance-Report (PDF)
- [ ] Monatlicher Auto-Report
- [ ] Export-Funktion (Excel)
- [ ] Historie (Compliance-Verlauf)

### Sprint 52: Optimierungen
- [ ] OCR für Dokumente (Auto-Extract Expiry-Date)
- [ ] Bulk-Document-Upload
- [ ] Document-Versionierung
- [ ] Expiry-Forecast (3/6/12 Monate)

---

## ✅ CHECKLISTE: Compliance-Review

**Täglich:**
- [ ] Dashboard-Widget prüfen (Expired/Critical)
- [ ] Kritische Reminders bearbeiten (< 7 Tage)

**Wöchentlich:**
- [ ] Alle Warnings prüfen (< 30 Tage)
- [ ] Fehlende Dokumente anfordern

**Monatlich:**
- [ ] Compliance-Report generieren
- [ ] Ablaufende Dokumente (90 Tage) listen
- [ ] Verlängerungen/Neuausstellungen planen

**Jährlich:**
- [ ] Alle Dokumente auf Aktualität prüfen
- [ ] Archivierte Dokumente bereinigen (>2 Jahre)
- [ ] Compliance-Prozesse optimieren

---

## 📚 REFERENZEN

**Gesetze & Verordnungen:**
- [PBefG - Personenbeförderungsgesetz](https://www.gesetze-im-internet.de/pbefg/)
- [StVG - Straßenverkehrsgesetz](https://www.gesetze-im-internet.de/stvg/)
- [StVZO - Straßenverkehrs-Zulassungs-Ordnung](https://www.gesetze-im-internet.de/stvzo_2012/)
- [PflVG - Pflichtversicherungsgesetz](https://www.gesetze-im-internet.de/pflvg/)
- [GewO - Gewerbeordnung](https://www.gesetze-im-internet.de/gewo/)

**Behörden:**
- Straßenverkehrsamt (P-Schein, Führerschein)
- Verkehrsamt / Regierungspräsidium (PBefG-Genehmigung)
- IHK (Fachkundeprüfung)
- Eichamt (Taxameter)

**Kosten-Übersicht (pro Jahr):**
- Führerschein-Verlängerung: ~50€ (alle 10-15 Jahre)
- P-Schein-Verlängerung: ~100€ (alle 5 Jahre)
- Gesundheitszeugnis: ~150€ (alle 3-5 Jahre)
- TÜV: ~100€ (alle 2 Jahre)
- Versicherung: ~800€ (jährlich, pro Fahrzeug)
- Taxameter-Eichung: ~200€ (jährlich, nur Taxi)
- PBefG-Konzession: ~500€ (Erstantrag, dann unbefristet)
- Betriebshaftpflicht: ~1.000€ (jährlich)

**GESAMT ca. 2.900€ pro Jahr und Fahrzeug (Taxi-Unternehmen)**

---

*Version: V18.3*
*Datum: 18.01.2025*
*Status: 🟢 LIVE - Basis implementiert, Erweiterungen geplant*
*Rechtstand: Januar 2025 (Deutschland)*
