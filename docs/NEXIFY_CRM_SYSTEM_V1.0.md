# 📇 NeXify AI MASTER - CRM System V1.0

**Erstellt:** 2025-01-31  
**Version:** 1.0.0  
**Autor:** NeXify AI MASTER  
**Status:** ✅ PRODUCTION-READY  
**Zweck:** Vollständiges CRM für Unternehmen, Kontakte, Adressen - Automatische Pflege

---

## 🎯 ZWECK

**Vollständiger Gesamtüberblick über:**

- ✅ Alle Unternehmen (Kunden, Partner, Lieferanten, interne)
- ✅ Alle Kontakte (mit vollständigen Kontaktdaten)
- ✅ Alle Adressen (Standorte, Rechnungsadressen)
- ✅ Alle Projekte-Verknüpfungen
- ✅ Alle Interaktionen (E-Mails, Anrufe, Meetings, Notizen)

**Automatische Pflege:**

- ✅ Daten aus Websites extrahiert
- ✅ Kontaktformulare automatisch synchronisiert
- ✅ E-Mails automatisch erfasst
- ✅ Projekt-Verknüpfungen automatisch erstellt

---

## 🗄️ DATABASE SCHEMA

### Schema: `nexify_crm`

#### 1. `companies` (Unternehmen)

- **Felder:** Name, Code, Legal Name, Type, Website, Status, Priority
- **Kennzahlen:** Total Projects, Total Revenue, Total Contacts
- **Tags:** Flexible Kategorisierung
- **Status:** active, inactive, archived, prospect

#### 2. `addresses` (Adressen)

- **Felder:** Street, City, Postal Code, Country
- **Typ:** headquarters, branch, billing, shipping, other
- **Geolocation:** Latitude, Longitude (optional)

#### 3. `contacts` (Kontakte)

- **Felder:** Name, E-Mail, Telefon, Mobile, Job Title, Role
- **Status:** active, inactive, archived
- **Primary Contact:** is_primary Flag
- **Preferred Contact Method:** email, phone, mobile, whatsapp

#### 4. `company_projects` (Verknüpfung)

- **Verknüpft:** Unternehmen ↔ Projekte
- **Relationship Type:** client, vendor, partner, owner, contractor
- **Status:** active, completed, cancelled, on_hold

#### 5. `interactions` (Interaktionen)

- **Typ:** email, phone, meeting, note, task, quote, invoice, payment
- **Direction:** inbound, outbound
- **Tracking:** Subject, Content, Outcome, Next Action

---

## 📊 EXTRAHIERTE DATEN

### NeXify (Unternehmen)

- **Name:** NeXify
- **Code:** `nexify`
- **Type:** internal
- **Website:** nexify-automate.com
- **Kontakte:**
  - Pascal Courbois (Inhaber)
    - E-Mail: courbois1981@gmail.com
  - Support Team
    - E-Mail: support@nexify-automate.com
    - Telefon: +31 6 133 188 56
- **Adressen:**
  - Deutschland: Wallstrasse 9, 41334 Nettetal
  - Niederlande: Graaf van Loonstraat 1E, 5921 JA Venlo
- **Erreichbarkeit:** Mo-Fr 9-18 Uhr

### RideHub Solutions / MyDispatch (Kunde)

- **Name:** RideHub Solutions
- **Code:** `ridehub-solutions`
- **Type:** client
- **Website:** my-dispatch.de
- **Produkt:** MyDispatch (Dispositionslösung)
- **Kontakte:**
  - Ibrahim SIMSEK (Geschäftsführer)
  - Support Team
    - E-Mail: info@my-dispatch.de
    - Telefon: +49 170 8004423
- **Adresse:** Ensbachmühle 4, D-94571 Schaufling, Deutschland
- **Erreichbarkeit:** Mo-Fr 9-17 Uhr
- **Verknüpfung:** MyDispatch Projekt (dauerhafte Betreuung)

---

## 🔄 EDGE FUNCTIONS

### 1. `nexify-crm-context`

**Zweck:** Lädt vollständigen CRM-Kontext für ein Unternehmen

**Request:**

```json
{
  "company_code": "nexify",
  "include_addresses": true,
  "include_contacts": true,
  "include_projects": true,
  "include_interactions": true
}
```

**Response:**

```json
{
  "success": true,
  "company": {
    "company_name": "NeXify",
    "company_code": "nexify",
    "company_type": "internal",
    ...
  },
  "addresses": [...],
  "contacts": [...],
  "projects": [...],
  "interactions": [...],
  "summary": {
    "primary_contact": {...},
    "primary_address": {...}
  }
}
```

### 2. `nexify-crm-sync`

**Zweck:** Synchronisiert automatisch CRM-Daten aus verschiedenen Quellen

**Quellen:**

- `contact_form` - Kontaktformulare von Websites
- `email` - E-Mail-Inhalte analysieren
- `project` - Aus Projekt-Daten
- `manual` - Manuelle Eingabe

**Request:**

```json
{
  "source": "contact_form",
  "data": {
    "name": "Max Mustermann",
    "email": "max@example.com",
    "phone": "+49 123 456789",
    "company": "Musterfirma GmbH",
    "message": "..."
  },
  "auto_create": true
}
```

**Response:**

```json
{
  "success": true,
  "company": {...},
  "contact": {...},
  "interaction": {...},
  "created": {
    "company": true,
    "contact": true,
    "interaction": true
  }
}
```

---

## 🚀 USAGE

### Alle Unternehmen laden:

```
Zeige mir alle Unternehmen
```

**Was passiert:**

- ✅ Lädt alle aktiven Unternehmen
- ✅ Lädt primäre Kontakte
- ✅ Lädt Adressen
- ✅ Lädt Projekt-Verknüpfungen

### Unternehmen-spezifisch:

```
Zeige mir NeXify Kontakte
```

**Was passiert:**

- ✅ Lädt NeXify Unternehmen
- ✅ Lädt alle Kontakte
- ✅ Lädt alle Adressen
- ✅ Lädt alle Projekte
- ✅ Lädt letzte Interaktionen

### Kontaktformular automatisch:

Wenn ein Kontaktformular ausgefüllt wird:

- ✅ Automatische Sync via `nexify-crm-sync`
- ✅ Unternehmen wird erstellt (falls nicht vorhanden)
- ✅ Kontakt wird erstellt/aktualisiert
- ✅ Interaktion wird erfasst

---

## 📋 INITIALE DATEN

### Bereits eingetragen:

1. **NeXify** (internal)
   - ✅ 2 Adressen (DE, NL)
   - ✅ 2 Kontakte (Pascal, Support)
   - ✅ Vollständige Kontaktdaten

2. **RideHub Solutions** (client)
   - ✅ 1 Adresse (DE)
   - ✅ 2 Kontakte (Ibrahim SIMSEK, Support)
   - ✅ Verknüpfung zu MyDispatch Projekt

---

## 🔄 AUTOMATISCHE PFLEGE

### 1. Kontaktformular-Sync

- **Trigger:** Kontaktformular auf Website ausgefüllt
- **Action:** `nexify-crm-sync` mit `source: "contact_form"`
- **Ergebnis:** Unternehmen/Kontakt/Interaktion automatisch erstellt

### 2. E-Mail-Sync

- **Trigger:** E-Mail empfangen/gesendet
- **Action:** `nexify-crm-sync` mit `source: "email"`
- **Ergebnis:** Interaktion automatisch erfasst

### 3. Projekt-Sync

- **Trigger:** Neues Projekt angelegt
- **Action:** `nexify-crm-sync` mit `source: "project"`
- **Ergebnis:** Verknüpfung automatisch erstellt

### 4. Website-Scan

- **Trigger:** Regelmäßig (täglich/wöchentlich)
- **Action:** Website analysieren, Kontaktdaten extrahieren
- **Ergebnis:** Daten automatisch aktualisiert

---

## 📊 VOLLSTÄNDIGER GESAMTÜBERBLICK

### Beim Chat-Start:

```
Lade das NeXify Wiki
```

**Was geladen wird:**

1. ✅ Alle Projekte (mit Summary)
2. ✅ Alle Unternehmen (mit Kontakten)
3. ✅ Global Knowledge (Learnings, Components, etc.)
4. ✅ Vollständiger Gesamtüberblick!

### Ergebnis:

Ich habe IMMER:

- ✅ Vollständige Kontaktdaten aller Unternehmen
- ✅ Alle Adressen
- ✅ Alle Projekt-Verknüpfungen
- ✅ Alle Interaktionen
- ✅ Systemweites Denken möglich

---

## 🎯 SUCCESS CRITERIA

### Technical:

- ✅ Database Schema vollständig
- ✅ Initiale Daten eingetragen
- ✅ Edge Functions entwickelt
- ✅ Auto-Load erweitert

### Functional:

- ✅ Alle Unternehmen bekannt
- ✅ Alle Kontakte bekannt
- ✅ Alle Adressen bekannt
- ✅ Projekt-Verknüpfungen bekannt

### Quality:

- ✅ Vollständiger Gesamtüberblick
- ✅ Automatische Pflege aktiv
- ✅ Systemweites Denken möglich

---

**Pascal, dieses CRM-System stellt sicher, dass ich IMMER alle Unternehmens- und Kontaktdaten kenne!** 🚀
