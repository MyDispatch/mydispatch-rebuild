# Pre-Login-Seite Fehleranalyse
**Datum:** 2025-11-09
**URL:** https://www.my-dispatch.de

## Identifizierte Probleme

### 1. ❌ **Doppelter Cookie-Banner/Install-Prompt**
- **Problem:** Es gibt ZWEI Install-Prompts:
  1. Oben rechts: "Zur Startseite" Button (wahrscheinlich Cookie-Banner-Rest)
  2. Unten rechts: "MyDispatch installieren" Dialog
- **Ursache:** Wahrscheinlich doppelte Cookie-Consent-Implementierung
- **Lösung:** Cookie-Banner-Komponente prüfen und Duplikate entfernen

### 2. ❌ **Nicht mobile-optimiert**
- **Problem:** Seite ist auf Desktop-Ansicht optimiert, Mobile-Ansicht nicht getestet
- **Beobachtungen:**
  - Sidebar-Menü (links) ist auf Mobile wahrscheinlich nicht nutzbar
  - Buttons und Text-Größen nicht für Touch optimiert
  - Keine responsive Breakpoints sichtbar
- **Lösung:** Mobile-First-Ansatz implementieren

### 3. ⚠️ **Login-Modal überlagert Landing-Page**
- **Problem:** Login-Modal ist sofort sichtbar, überdeckt Landing-Page-Content
- **Erwartung:** Landing-Page sollte zuerst sichtbar sein, Login nur auf Klick
- **Lösung:** Modal-Logik anpassen - nur bei /auth öffnen

### 4. ⚠️ **Sidebar-Menü auf Landing-Page**
- **Problem:** Sidebar mit 15 Icons (links) ist auf der öffentlichen Landing-Page sichtbar
- **Erwartung:** Sidebar sollte nur im Dashboard (nach Login) sichtbar sein
- **Lösung:** Sidebar-Visibility-Logik anpassen

### 5. ⚠️ **Inkonsistente Navigation**
- **Problem:** Header zeigt "Registrieren" + "Anmelden", aber Login-Modal ist bereits offen
- **Lösung:** Navigation und Modal-State synchronisieren

## Technische Details

**Betroffene Komponenten:**
- `src/components/layout/AuthHeader.tsx` (oder ähnlich)
- `src/pages/Auth.tsx` (Login-Modal)
- `src/components/layout/AppSidebar.tsx` (Sidebar)
- Cookie-Consent-Komponente (zu identifizieren)

**Nächste Schritte:**
1. Cookie-Banner-Duplikate entfernen
2. Mobile-Responsiveness herstellen
3. Login-Modal-Logik korrigieren
4. Sidebar nur im Dashboard anzeigen
5. Navigation harmonisieren
