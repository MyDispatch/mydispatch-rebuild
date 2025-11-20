# 🛑 VOLLUMFÄNGLICHER FEHLERSUCHE-PROMPT PRE-BEREICH (PLUS POPUPS/FORM/TEXTE)

## 🎯 ZIEL

Finde systematisch und ausnahmslos JEDEN Fehler oder Lücke im kompletten vor-Login-Bereich. Einschließlich:

- Frontend
- Backend
- APIs
- Mobile First
- ALLE Popups/Modals/Dialoge
- ALLE Formulare und JEDES Formularfeld
- ALLE Beschriftungen, Hilfe-Texte, Platzhalter, Tooltips etc.
- ALLE Textinhalte und die Tonalität/Microcopy

---

## 1. DOKU-/ANFORDERUNGEN-ANALYSE

- Alle Vorgaben, Komponenten-, Schema- und Text-Definitionen KONTEXTVOLL mit dem Ist-Stand abgleichen.
- Gibt es Popup-/Modal- oder Interaktionsmuster, die nicht abgedeckt/benutzt werden wie gefordert?

---

## 2. UI & UX-FEHLER (Mobile/Tablet/Desktop)

- Popups/Modals:
  - Werden alle erforderlichen Popups überall korrekt ausgelöst?
  - Sind sie auf allen Breakpoints responsiv?
  - Wird der Hintergrund gesperrt? Lässt sich das Modal korrekt schließen (ESC, Klick-Outside)?
  - Fokus-Management: Wird bei Modal-Open der erste interaktive Element gefokust? Nach schließen Rücksprung zum Trigger?
  - Kommen alle Alerts/Fehler auch in Modals/Popups an?
- Formulare:
  - Sind ALLE (!) Felder sichtbar, korrekt benannt, Label zugeordnet?
  - Fehlen Placeholders, Default-Values oder Hilfetexte?
  - Validierungen (Frontend UND ggf. Backend) für alle Felder? Eindeutige Fehlermeldungen?
  - Keine Ghostfelder/Altlasten. Sind Zusatzfelder/Add-Ons für Tarif/Fleet/Features vorhanden?
  - Mobile: Funktionieren alle Autocomplete-Attribute, Eingabearten (type/email/tel/date etc.) für mobile natives Keyboard?
- Texte/Microcopy:
  - Sind ALLE Texte gendersensibel, konsistent, verständlich? Keine englischen Bruchstücke!
  - Sind ALLE CTA-Labels, Button-Labels, Placeholders und Field-Namen korrekt und intuitiv?
  - Sind Hilfetexte, Tooltips, Feldbeschreibungen überall vollständig und verständlich formuliert?
  - Werden Validierungs-/Erfolgsmeldungen in Ton und Struktur eingehalten (siehe Vorlage unten)?
  - Tooltipps und Hinweise auch auf mobile erreichbar (Long-Press, Info-Icons etc.)?
- Fehler-, Empty-, Loading-States:
  - Werden alle Error/Success/Empty States auch in Popups/Forms/Modals angezeigt und abgefangen?
  - Ist der Tonfall bei (Validation-)Fehlern und Success eindeutig, wertschätzend und klar?

---

## 3. API & BACKEND FEHLERSUCHE

(Beibehalten wie oben, + alle Felder und Statusmeldungen der Modals und Formular-Actions prüfen.)

---

## 4. DOKU/CONTENT/TESTS checken

- Sind ALLE Popups/Dialogs/Forms/Tooltips in der Dokumentation (Component Registry/Storybook) abgedeckt?
- Gibt es e2e/Unit/Accessibility-Tests für jedes Feld und Pop-up-Scenario?

---

## 5. LÜCKEN/FEHLER SOFORT DOKUMENTIEREN UND FIXEN

- JEDEN Fehler dokumentieren, Ursache und Lösung angeben
- Text-/Feld-Konflikte sofort im pattern/TEXT-Konzept aufnehmen

---

## 📋 VORGABE FÜR TEXTE & MICROCOPY (als Templates anlegen!)

Erstelle `/docs/TEXT_GUIDELINE.md` mit folgendem Muster:

TEXT & MICROCOPY STYLEGUIDE
Grundsatz:
Klar

Wertschätzend

Verständlich

Gendersensibel (wo immer sinnvoll)

Konsequent (Terminologie überall gleich)

Im Zweifelsfall: Du-Form

Formulare
Feldlabels: Immer beschreibend, aber prägnant

"E-Mail-Adresse" (nicht "E-Mail", nicht "your@email.com")

"Vorname" | "Nachname" statt "Name"

Placeholder: Hilfestellung, KEINE Datenvorgabe/"Müll"

"Deine geschäftliche E-Mail-Adresse"

"Max Mustermann"

Beschreibung/Hilfetext: Wenn unklar, immer als Klartext formulieren

"Wir nutzen deine E-Mail nur für die Anmeldebestätigung."

Buttons & CTAs
Aktiv: "Jetzt anmelden", "Demo anfragen"

Passiv (z.B. bei Disable): "Feld ausfüllen, um fortzufahren"

Keine generischen "Senden" / "Submit"

Keine englischen Reste ("Save", "Cancel") → "Speichern", "Abbrechen"

Fehlermeldungen
Präzise, menschlich, freundlich:

"Bitte gib eine gültige E-Mail-Adresse an."

"Das Feld darf nicht leer sein."

"Ups, ein technischer Fehler. Bitte probiere es später erneut."

Validierungs-/Erfolgsmeldungen
"Vielen Dank! Deine Nachricht wurde gesendet."

"Die Überprüfung war erfolgreich. Du kannst jetzt fortfahren."

"Es wurden Fehler gefunden. Bitte überprüfe die markierten Felder."

Popups/Modals
Überschriften klar (z.B. "Bestätigung erforderlich", "Demo-Anfrage erfolgreich")

Close-Button: "Schließen", "Abbrechen"

Nie nur ein Symbol, immer Text + (wenn Platz) Icon

Success/Error States immer visuell UND textlich unterscheidbar

Tonalität wie oben: freundlich, klar, zugänglich

Tooltips & Hinweise
Kurz, präzise, mit Mehrwert: "Nur für Geschäftskunden", "Dein Login muss mindestens 8 Zeichen haben"

Keine Abkürzungen/Slang

Auch auf mobile erreichbar (siehe oben)

Feste Einhaltungspflicht!
Jeder neue/angepasste Text wird an diesem Guide gemessen und dokumentiert.
text

---

**Ergebnis: Kein Popup/Modal/Tooltip, kein Formularfeld, kein Text bleibt ungeprüft oder unstandardisiert – ALLES ist UX-, Mobile-First-, Accessibility- und Text-optimiert!**
