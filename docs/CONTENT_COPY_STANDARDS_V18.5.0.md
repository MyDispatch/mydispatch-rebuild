# MyDispatch Content & Copy Standards
## Verbindliche Kommunikations-Vorgaben V18.5.0 - PRODUCTION READY

> **Status:** ✅ PRODUCTION READY  
> **Version:** 18.5.0  
> **Letzte Aktualisierung:** 2025-01-26  
> **Geltungsbereich:** Alle Texte, Formulare, Nachrichten im MyDispatch-System

---

## 🎯 MARKENIDENTITÄT

### Haupt-Slogan (Verbindlich)

**"Die führende Software für Taxi- und Mietwagenunternehmen, sowie Limusienenservices."**

### Sekundär-Slogan

**"simply arrive"** - MyDispatch - Die moderne Dispositions-Lösung

---

## 👔 ANREDE-SYSTEM (ABSOLUT ZWINGEND)

### Pflichtfelder in JEDEM Formular

```typescript
interface StandardContactForm {
  // PFLICHT-FELDER (NIEMALS optional!)
  anrede: 'Herr' | 'Frau' | 'Divers';
  titel?: 'Dr.' | 'Prof.' | 'Prof. Dr.' | 'Dr. med.' | 'Dr. jur.';
  vorname: string;
  nachname: string;
  email: string;
  
  // OPTIONAL
  firma?: string;
  telefon?: string;
  nachricht?: string;
}
```

### Anrede-Beispiele

```typescript
// ✅ RICHTIG - Vollständige Anrede
"Sehr geehrter Herr Dr. Müller,"
"Sehr geehrte Frau Prof. Schmidt,"
"Guten Tag," // Bei Divers

// ❌ FALSCH - Informelle Anrede
"Hallo Max,"
"Hi,"
"Hey Frau Müller,"
```

---

## 🗣️ TONALITÄT & SPRACHE (B2B PROFESSIONAL)

### Grundsätze

1. **Sie-Form:** AUSNAHMSLOS in allen Texten
2. **Fachmännisch:** Expertise und Professionalität
3. **Freundlich:** Aber nie anbiedernd
4. **Seriös:** Keine Umgangssprache
5. **Klar:** Präzise und verständlich
6. **Respektvoll:** Wertschätzende Kommunikation

### Formulierungs-Beispiele

```typescript
// ✅ RICHTIG - Professionell & Seriös
"Optimieren Sie Ihre Disposition mit MyDispatch"
"Effiziente Verwaltung Ihrer Fahrzeugflotte"
"Transparente Abrechnung und Reporting"
"Individuelle Beratung für Ihr Unternehmen"
"Maßgeschneiderte Lösungen für Ihre Anforderungen"

// ❌ FALSCH - Zu informell oder billig
"Hol dir jetzt MyDispatch!"
"Mega-Deal nur heute!"
"Nicht verpassen!"
"Jetzt zuschlagen!"
"Super günstig!"
```

---

## 🚫 VERBOTENE FORMULIERUNGEN (BLACKLIST)

### Kategorie: Billig-Werbung

- ❌ "30 Tage kostenlos testen"
- ❌ "Jetzt zuschlagen"
- ❌ "Nicht verpassen"
- ❌ "Limited Offer"
- ❌ "Nur heute"
- ❌ "Schnäppchen"
- ❌ "Billig", "günstig", "spottbillig"
- ❌ "Mega-Deal", "Hammer-Preis"

### Kategorie: Übertreibungen

- ❌ "Die beste Lösung auf dem Markt"
- ❌ "100% Garantie"
- ❌ "Absolut sicher"
- ❌ "Nie wieder Probleme"
- ❌ "Blitzschnell"
- ❌ "Kinderleicht"

### Kategorie: Falschversprechungen

- ❌ "Kostenlos für immer"
- ❌ "Keine versteckten Kosten" (wenn Tarife nicht transparent)
- ❌ "Unbegrenzt" (wenn Limits existieren)
- ❌ "Sofort verfügbar" (wenn Wartezeit)

### Kategorie: Technisches Kauderwelsch

- ❌ "Error 404"
- ❌ "Null Pointer Exception"
- ❌ "CORS-Fehler"
- ❌ "SQL Injection verhindert"

---

## ✅ ERLAUBTE & EMPFOHLENE FORMULIERUNGEN

### Produkt-Beschreibung

- ✅ "Die führende Software für Taxi- und Mietwagenunternehmen"
- ✅ "Professionelle Dispositions-Lösung"
- ✅ "Effiziente Verwaltung Ihrer Fahrzeugflotte"
- ✅ "Transparente Abrechnung und Reporting"
- ✅ "DSGVO-konforme Datenverwaltung"

### Call-to-Action (CTA)

- ✅ "Jetzt beraten lassen"
- ✅ "Termin vereinbaren"
- ✅ "Individuelle Demo anfragen"
- ✅ "Kontakt aufnehmen"
- ✅ "Mehr erfahren"

### Service-Beschreibung

- ✅ "Persönliche Beratung"
- ✅ "Maßgeschneiderte Lösungen"
- ✅ "Zuverlässiger Support"
- ✅ "Kontinuierliche Weiterentwicklung"
- ✅ "Rechtssichere Dokumentation"

---

## 📝 STANDARD-BUTTON-TEXTE

### Primäre Aktionen

| Aktion | Button-Text |
|--------|-------------|
| Speichern | "Speichern" |
| Erstellen | "Erstellen" |
| Hinzufügen | "Hinzufügen" |
| Bearbeiten | "Bearbeiten" |
| Löschen | "Löschen" |
| Abbrechen | "Abbrechen" |
| Bestätigen | "Bestätigen" |
| Senden | "Senden" |

### Sekundäre Aktionen

| Aktion | Button-Text |
|--------|-------------|
| Exportieren | "Als PDF exportieren" |
| Drucken | "Drucken" |
| Teilen | "Teilen" |
| Archivieren | "Archivieren" |
| Zurück | "Zurück" |
| Weiter | "Weiter" |
| Schließen | "Schließen" |

---

## 🔔 TOAST-NACHRICHTEN (SUCCESS / ERROR / INFO)

### Erfolgs-Meldungen

```typescript
// ✅ RICHTIG - Konstruktiv & Klar
toast({
  title: "Erfolgreich gespeichert",
  description: "Der Kunde wurde erfolgreich angelegt.",
  variant: "default",
});

toast({
  title: "Auftrag erstellt",
  description: "Der Fahrtauftrag wurde dem Fahrer zugewiesen.",
  variant: "default",
});

// ❌ FALSCH - Zu informell
toast({
  title: "Yay! Geklappt!",
  description: "Alles super gelaufen!",
  variant: "default",
});
```

### Fehler-Meldungen

```typescript
// ✅ RICHTIG - Hilfreich & Lösungsorientiert
toast({
  title: "Speichern fehlgeschlagen",
  description: "Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut.",
  variant: "destructive",
});

toast({
  title: "Keine Verbindung",
  description: "Die Verbindung zum Server konnte nicht hergestellt werden. Bitte prüfen Sie Ihre Internetverbindung.",
  variant: "destructive",
});

// ❌ FALSCH - Technisch & Unhilfreich
toast({
  title: "Error 500",
  description: "Internal Server Error",
  variant: "destructive",
});
```

### Info-Meldungen

```typescript
// ✅ RICHTIG - Informativ & Neutral
toast({
  title: "Hinweis",
  description: "Die Änderungen werden in Kürze wirksam.",
  variant: "default",
});

toast({
  title: "Aktualisierung verfügbar",
  description: "Eine neue Version von MyDispatch ist verfügbar.",
  variant: "default",
});
```

---

## 🚨 VALIDIERUNGS- & FEHLERMELDUNGEN

### Formular-Validierung

```typescript
// ✅ RICHTIG - Konstruktiv & Hilfreich
const validationMessages = {
  anrede: "Bitte wählen Sie eine Anrede aus.",
  vorname: "Bitte geben Sie Ihren Vornamen ein.",
  nachname: "Bitte geben Sie Ihren Nachnamen ein.",
  email: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
  telefon: "Bitte geben Sie eine gültige Telefonnummer ein.",
  pflichtfeld: "Dieses Feld ist erforderlich.",
  minLength: "Bitte geben Sie mindestens {min} Zeichen ein.",
  maxLength: "Bitte geben Sie maximal {max} Zeichen ein.",
};

// ❌ FALSCH - Unhöflich oder Technisch
const validationMessages = {
  email: "Falsche Email!",
  pflichtfeld: "Feld darf nicht leer sein!",
  minLength: "String too short",
};
```

---

## 💳 TARIF-KOMMUNIKATION (ULTRA-STRENG)

### Grundsätze

1. **Nur echte Tarife:** Keine erfundenen Angebote
2. **Transparenz:** Alle Kosten offen kommunizieren
3. **Keine Lockangebote:** Keine "Kostenlos testen" ohne echten Tarif
4. **Referenz:** Immer auf `docs/TARIFE_V18.5.0.md` verweisen

### Erlaubte Formulierungen

```typescript
// ✅ RICHTIG - Transparent & Ehrlich
"Unsere Tarife sind auf Ihre Unternehmensgröße abgestimmt."
"Kontaktieren Sie uns für ein individuelles Angebot."
"Transparente Preisgestaltung ohne versteckte Kosten."
"Tarife entsprechend Ihrer Anforderungen."

// ❌ FALSCH - Lockangebote
"30 Tage kostenlos testen!"
"Jetzt gratis starten!"
"Keine Kreditkarte erforderlich!"
"Für immer kostenlos!"
```

---

## 📋 PLATZHALTER-TEXTE (INPUTS)

### Standard-Platzhalter

```typescript
const placeholders = {
  // Persönliche Daten
  vorname: "z.B. Max",
  nachname: "z.B. Mustermann",
  email: "ihre.email@beispiel.de",
  telefon: "+49 123 456789",
  firma: "Ihre Firma GmbH",
  
  // Adressen
  strasse: "Musterstraße 123",
  plz: "12345",
  ort: "Berlin",
  land: "Deutschland",
  
  // Suche
  suche: "Suchen...",
  filter: "Filtern nach...",
  
  // Nachrichten
  nachricht: "Ihre Nachricht an uns...",
  kommentar: "Optionaler Kommentar...",
  notiz: "Interne Notiz...",
};
```

---

## ⚖️ RECHTLICHE FORMULIERUNGEN (DSGVO & AI ACT)

### DSGVO-Einwilligungstext

```typescript
const dsgvoConsent = `
Ich habe die <Link to="/datenschutz">Datenschutzerklärung</Link> zur Kenntnis genommen. 
Ich stimme zu, dass meine Angaben zur Kontaktaufnahme und für Rückfragen 
gespeichert werden. Diese Einwilligung kann ich jederzeit widerrufen.
`;
```

### AI Act Kennzeichnung

```typescript
const aiDisclaimer = `
Diese Antwort wurde durch künstliche Intelligenz generiert. 
Bitte prüfen Sie wichtige Informationen selbst nach.
`;
```

### Footer-Pflicht-Links

```typescript
const footerLinks = [
  { label: "Impressum", href: "/impressum" },
  { label: "Datenschutz", href: "/datenschutz" },
  { label: "AGB", href: "/agb" },
  { label: "Kontakt", href: "/kontakt" },
];
```

---

## 🛡️ BESTÄTIGUNGS-DIALOGE (KRITISCHE AKTIONEN)

### Löschen-Bestätigung

```typescript
// ✅ RICHTIG - Doppelte Bestätigung mit Konsequenz-Info
{
  title: "Eintrag wirklich löschen?",
  description: "Diese Aktion kann nicht rückgängig gemacht werden. Der Eintrag wird permanent gelöscht.",
  confirmText: "Endgültig löschen",
  cancelText: "Abbrechen",
}

// ❌ FALSCH - Zu knapp
{
  title: "Löschen?",
  description: "Sicher?",
  confirmText: "Ja",
  cancelText: "Nein",
}
```

### Archivieren-Bestätigung

```typescript
// ✅ RICHTIG - Informativ
{
  title: "Eintrag archivieren?",
  description: "Der Eintrag wird archiviert und ist standardmäßig nicht mehr sichtbar. Sie können ihn jederzeit wiederherstellen.",
  confirmText: "Archivieren",
  cancelText: "Abbrechen",
}
```

---

## 🔧 FORMULAR-ÄNDERUNGS-REGEL (KRITISCH!)

### ⚠️ ABSOLUTE VORGABE

**Bei bestehenden Dashboard-Formularen:**

1. ✅ **ERLAUBT:** Fehlende Pflichtfelder ergänzen (Anrede, Titel)
2. ❌ **VERBOTEN:** Bestehende Datenfelder löschen
3. ❌ **VERBOTEN:** Bestehende Datenfelder umbenennen
4. ❌ **VERBOTEN:** Bestehende Datenfelder ändern

### Beispiel: Ergänzung Anrede-Feld

```typescript
// VORHER (Bestehendes Formular)
interface CustomerForm {
  name: string;
  email: string;
  phone: string;
}

// NACHHER (Ergänzt, NICHT ersetzt!)
interface CustomerForm {
  // NEU ERGÄNZT
  anrede: 'Herr' | 'Frau' | 'Divers';
  titel?: string;
  
  // BESTEHEND - UNVERÄNDERT!
  name: string;
  email: string;
  phone: string;
}
```

### Bei Neu-Erstellung (Kein bestehendes Formular)

```typescript
// ✅ RICHTIG - Vollständiges Standard-Formular
interface NewContactForm {
  anrede: 'Herr' | 'Frau' | 'Divers'; // PFLICHT
  titel?: string; // OPTIONAL
  vorname: string; // PFLICHT
  nachname: string; // PFLICHT
  email: string; // PFLICHT
  telefon?: string; // OPTIONAL
  nachricht: string; // PFLICHT
}
```

---

## 📊 COMPLIANCE-CHECKLISTE (Vor Release)

### Content-Prüfung

- [ ] Alle Formulare haben Anrede-Feld (Herr/Frau/Divers)
- [ ] Alle Formulare haben optionales Titel-Feld
- [ ] Sie-Form durchgängig verwendet
- [ ] Keine Billig-Formulierungen
- [ ] Keine Falschversprechungen
- [ ] Tarif-Kommunikation korrekt (Referenz zu TARIFE_V18.5.0.md)
- [ ] DSGVO-Hinweise bei allen Formularen
- [ ] AI Act Kennzeichnung bei KI-Features
- [ ] Footer-Links (Impressum/Datenschutz/AGB) vorhanden
- [ ] Fehlermeldungen konstruktiv und hilfreich
- [ ] Toast-Nachrichten professionell formuliert
- [ ] Button-Texte eindeutig und klar

---

## 🎯 ZUSAMMENFASSUNG: ABSOLUTE PFLICHTEN

### Anrede & Titel

1. ✅ Anrede-Feld in JEDEM Formular (Herr/Frau/Divers)
2. ✅ Titel-Feld optional in JEDEM Formular
3. ✅ Sie-Form AUSNAHMSLOS

### Tonalität

1. ✅ B2B-Professionell & Seriös
2. ✅ Fachmännisch mit Expertise
3. ✅ Freundlich aber nie anbiedernd
4. ❌ Keine Billig-Werbung
5. ❌ Keine Falschversprechungen

### Formulare

1. ✅ Bestehende Formulare: NUR ergänzen (Anrede/Titel)
2. ❌ Bestehende Formulare: NIEMALS Felder löschen/ändern
3. ✅ Neue Formulare: Vollständiges Standard-Format

### Rechtlich

1. ✅ DSGVO-Hinweise bei allen Formularen
2. ✅ AI Act Kennzeichnung bei KI-Features
3. ✅ Footer-Links auf jeder Seite

---

## 📞 BEI VERSTÖSSEN

Jede Abweichung von diesen Vorgaben ist ein **FEHLER** und muss sofort korrigiert werden.

**Status:** PRODUCTION READY  
**Version:** 18.5.0  
**Gültig ab:** 2025-01-26  
**NIEMALS ÄNDERN OHNE PROJEKTLEITER-GENEHMIGUNG!**
