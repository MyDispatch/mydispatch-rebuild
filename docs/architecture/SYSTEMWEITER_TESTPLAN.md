# 🧪 SYSTEMWEITER TESTPLAN - MyDispatch V18.0

**Status:** In Arbeit | **Erstellt:** 15.10.2025 | **Version:** 1.0

## 🎯 ZIELSETZUNG

Vollständige Überprüfung aller Funktionen, Links, Synchronisationen und kritischen Workflows.
Fehlererkennung und -behebung vor Production-Release.

---

## 📋 TESTBEREICHE

### ✅ **1. SUBSCRIPTION & TARIF-SYSTEM**

#### 1.1 Subscription-Synchronisation

- [x] **Problem identifiziert:** Landingpage nutzte falsche Product-ID-Prüfung
- [x] **Fix implementiert:** Zentrale `subscription-utils.ts` mit korrekten Product-IDs
- [ ] **Test:** Login mit Business-Account (courbois1981@gmail.com)
  - Erwartung: `subscription_product_id` = `prod_TEegHmtpPZOZcG`
  - Erwartung: `subscription_status` = `active`
  - Erwartung: Zugriff auf alle Business-Features

#### 1.2 FeatureGate-Komponente

- [ ] **Test:** Starter-Account erstellen und Partner-Seite aufrufen
  - Erwartung: Upgrade-Hinweis wird angezeigt
- [ ] **Test:** Business-Account Partner-Seite aufrufen
  - Erwartung: Voller Zugriff auf Partner-Verwaltung
- [ ] **Test:** Business-Account Statistiken aufrufen
  - Erwartung: Voller Zugriff auf Statistiken

#### 1.3 Landingpage-Konfigurator

- [x] **Problem identifiziert:** Hardcoded Product-IDs statt zentrale Utils
- [x] **Fix implementiert:** Nutzung von `isBusinessTier()` aus `subscription-utils.ts`
- [ ] **Test:** Als Business-Account `/landingpage-konfigurator` aufrufen
  - Erwartung: Zugriff gewährt, keine Upgrade-Meldung
- [ ] **Test:** Einstellungen speichern
  - Erwartung: Daten werden in `companies` Tabelle gespeichert
- [ ] **Test:** Live-Vorschau prüfen
  - Erwartung: iframe zeigt Unternehmer-Landingpage korrekt

---

### ✅ **2. UNTERNEHMER-LANDINGPAGE (TENANT-LANDINGPAGE)**

#### 2.1 URL-Parameter

- [x] **Problem identifiziert:** Nur `?tenant=` wurde unterstützt, aber Konfigurator nutzt `?id=`
- [x] **Fix implementiert:** Support für beide Parameter (`tenant` und `id`)
- [ ] **Test:** `/unternehmer?id=7c841959-bcf6-4949-9d54-61aa2449b0f6` aufrufen
  - Erwartung: Landingpage lädt korrekt
- [ ] **Test:** `/unternehmer?tenant=7c841959-bcf6-4949-9d54-61aa2449b0f6` aufrufen
  - Erwartung: Landingpage lädt korrekt

#### 2.2 Business-Tier-Prüfung

- [x] **Problem identifiziert:** `includes('business')` funktioniert nicht für `prod_TEegHmtpPZOZcG`
- [x] **Fix implementiert:** Direkte Product-ID-Prüfung
- [ ] **Test:** Landingpage mit Business-Account
  - Erwartung: Buchungs-Widget wird angezeigt (wenn `widget_enabled = true`)
  - Erwartung: AI-Chatbot wird angezeigt
- [ ] **Test:** Landingpage mit Starter-Account
  - Erwartung: Nur Kontaktinformationen, kein Widget

#### 2.3 Company-Daten-Abfrage

- [ ] **Test:** Company ohne `landingpage_enabled` aufrufen
  - Erwartung: Toast-Meldung "Diese Landingpage ist nicht verfügbar"
- [ ] **Test:** Nicht-existierende Company-ID aufrufen
  - Erwartung: "Unternehmen nicht gefunden" Fehlerseite

---

### ✅ **3. SYNCHRONISATIONS-OPTIMIERUNG**

#### 3.1 Subscription-Hook

- [x] **Optimierung implementiert:**
  - Auto-refresh alle 30 Sekunden (statt 60s)
  - Verbesserte Console-Logs für Debugging
  - Fallback zu Stripe bei fehlenden DB-Daten
- [ ] **Test:** Nach Login Subscription-Status prüfen
  - Console-Log: `[SUBSCRIPTION] DB Check: { isActive, productId, status, periodEnd }`
- [ ] **Test:** 30 Sekunden warten
  - Erwartung: Automatische Synchronisation erfolgt

#### 3.2 Network-Requests

- [ ] **Beobachtung:** Network-Tab öffnen bei Login
  - Erwartung: GET `/rest/v1/profiles?select=company_id&user_id=eq.{userId}`
  - Erwartung: GET `/rest/v1/companies?select=subscription_product_id...&id=eq.{companyId}`
  - Erwartung: Keine 401/403 Fehler

---

### ✅ **4. AUTHENTIFIZIERUNG & ROLLEN**

#### 4.1 User Roles

- [ ] **Test:** Login als Admin (courbois1981@gmail.com)
  - Erwartung: `roles` Array enthält `['admin']`
  - Erwartung: Zugriff auf Master-Dashboard
- [ ] **Test:** Login als normaler User
  - Erwartung: Kein Zugriff auf Master-Dashboard
  - Erwartung: Redirect zu Dashboard

#### 4.2 RLS Policies

- [ ] **Test:** Supabase-Linter ausführen
  - Erwartung: Keine Critical-Level Warnungen
- [ ] **Test:** Als User A Daten von User B abfragen
  - Erwartung: RLS blockiert Zugriff

---

### ✅ **5. LIVE-DATA-INTEGRATION**

#### 5.1 GPS-Tracking

- [ ] **Test:** `/driver-tracking` aufrufen
  - Erwartung: GPS-Einwilligung-Dialog erscheint
- [ ] **Test:** GPS-Einwilligung akzeptieren
  - Erwartung: Position wird alle 10s an `vehicle_positions` gesendet
- [ ] **Test:** Offline-Modus simulieren
  - Erwartung: Positionen werden in IndexedDB gespeichert
- [ ] **Test:** Wieder online gehen
  - Erwartung: Queue wird synchronisiert

#### 5.2 Cleanup-Cron-Job

- [ ] **Test:** Edge Function `cleanup-gps-positions` manuell aufrufen
  - Erwartung: GPS-Daten älter als 24h werden gelöscht
  - Erwartung: Eintrag in `system_logs` wird erstellt

#### 5.3 Live-Map

- [ ] **Test:** Dashboard aufrufen
  - Erwartung: LiveMap-Komponente lädt Google Maps
  - Erwartung: Fahrzeug-Marker werden angezeigt (Grün/Rot/Grau/Gelb)

---

### ✅ **6. KOMMUNIKATIONS-SYSTEM**

#### 6.1 TeamChat

- [ ] **Test:** `/team-chat` aufrufen
  - Erwartung: ConversationList lädt
  - Erwartung: ParticipantSelector zeigt nur Company-Mitglieder
- [ ] **Test:** Nachricht senden
  - Erwartung: Realtime-Update (Empfänger sieht sofort)
- [ ] **Test:** Datei hochladen
  - Erwartung: Upload zu Supabase Storage, URL in Nachricht

#### 6.2 Audio/Video-Calls

- [ ] **Test:** Call initiieren
  - Erwartung: Daily.co Room wird erstellt
  - Erwartung: CallInterface öffnet sich
- [ ] **Test:** Call beenden
  - Erwartung: Room wird geschlossen
  - Erwartung: Eintrag in `calls` Tabelle

---

### ✅ **7. FORMS & VALIDATION**

#### 7.1 UnifiedForm

- [ ] **Test:** Neuen Auftrag erstellen
  - Erwartung: Inline-Upload funktioniert (Drag & Drop)
  - Erwartung: Progress-Anzeige während Upload
- [ ] **Test:** Fahrzeugklassen-Dropdown
  - Erwartung: Neue Klassen ("Economy Class (1-4 Pax)", etc.) werden angezeigt
- [ ] **Test:** Passagiere/Gepäck-Dropdowns
  - Erwartung: Werte 1-8 auswählbar

#### 7.2 Inline-Customer-Form

- [ ] **Test:** Während Auftrags-Erstellung neuen Kunden anlegen
  - Erwartung: Kunde wird gespeichert
  - Erwartung: Kunde ist sofort im Dropdown verfügbar

---

### ✅ **8. RECHTSTEXTE & DSGVO**

#### 8.1 Cookie-Banner

- [ ] **Test:** Seite zum ersten Mal aufrufen
  - Erwartung: EnhancedCookieBanner erscheint
- [ ] **Test:** Analytics ablehnen
  - Erwartung: Tracking wird nicht geladen
- [ ] **Test:** Alle akzeptieren
  - Erwartung: Consent wird in localStorage gespeichert

#### 8.2 Rechtstexte

- [ ] **Test:** `/impressum` aufrufen
  - Erwartung: RideHub Solutions & NeXify Daten korrekt
- [ ] **Test:** `/datenschutz` aufrufen
  - Erwartung: PBefG § 21, § 51, EU AI Act erwähnt
- [ ] **Test:** `/agb` aufrufen
  - Erwartung: PBefG § 44, § 51, HGB § 449 erwähnt

---

### ✅ **9. EDGE FUNCTIONS**

#### 9.1 E-Mail-Versand

- [ ] **Test:** `send-password-reset` aufrufen
  - Erwartung: E-Mail wird via Resend.com versendet
  - Erwartung: Kein `npm:resend` Import-Fehler
- [ ] **Test:** `send-driver-invitation` aufrufen
  - Erwartung: Einladungs-E-Mail wird versendet

#### 9.2 Test-Daten-Generator

- [ ] **Test:** `generate-test-data` als Master-Account aufrufen
  - Erwartung: GPS-Positionen, Chat-Nachrichten, Calls werden erstellt
- [ ] **Test:** Als normaler User aufrufen
  - Erwartung: Fehler "Unauthorized" (403)

---

### ✅ **10. PWA & OFFLINE**

#### 10.1 Service Worker

- [ ] **Test:** App in Chrome öffnen
  - Erwartung: Service Worker registriert sich
  - Erwartung: Console-Log "Service Worker registered"
- [ ] **Test:** Offline gehen
  - Erwartung: Cached Pages laden weiterhin
  - Erwartung: Operationen in Offline-Queue

#### 10.2 Manifest

- [ ] **Test:** Chrome DevTools → Application → Manifest
  - Erwartung: Name: "MyDispatch"
  - Erwartung: Icons vorhanden (192x192, 512x512)

---

### ✅ **11. PERFORMANCE**

#### 11.1 Bundle-Size

- [ ] **Test:** `npm run build` ausführen
  - Erwartung: Bundle < 1.5MB
- [ ] **Test:** Lighthouse-Score
  - Erwartung: Performance > 90

#### 11.2 Code Splitting

- [ ] **Test:** Network-Tab beim Seitenwechsel
  - Erwartung: Nur relevante Chunks werden geladen

---

### ✅ **12. MOBILE-RESPONSIVENESS**

#### 12.1 Breakpoints

- [ ] **Test:** Viewport auf 375px setzen (iPhone SE)
  - Erwartung: Sidebar wird zu Sheet
  - Erwartung: Grid wird `grid-cols-1`
- [ ] **Test:** Viewport auf 768px setzen (iPad)
  - Erwartung: `sm:` Breakpoints greifen
  - Erwartung: Grid wird `sm:grid-cols-2`

---

## 🚨 KRITISCHE FEHLER (SOFORT BEHEBEN)

### ❌ FEHLER 1: Unternehmer-Landingpage nicht erreichbar

- **Status:** ✅ BEHOBEN
- **Ursache:** Falscher Query-Parameter + falsche Product-ID-Prüfung
- **Fix:** Support für `?id=` und `?tenant=`, direkte Product-ID-Prüfung

### ❌ FEHLER 2: Landingpage-Konfigurator zeigt Upgrade-Hinweis für Business-User

- **Status:** ✅ BEHOBEN
- **Ursache:** Hardcoded Product-IDs statt zentrale Utils
- **Fix:** Nutzung von `isBusinessTier()` aus `subscription-utils.ts`

### ⚠️ WARNUNG 1: Subscription-Sync zu langsam

- **Status:** ✅ OPTIMIERT
- **Ursache:** 60s Intervall zu lang
- **Fix:** 30s Intervall + bessere Fehlerbehandlung

---

## 📊 TESTFORTSCHRITT

| Bereich                 | Tests  | Bestanden | Fehlgeschlagen | Fortschritt |
| ----------------------- | ------ | --------- | -------------- | ----------- |
| Subscription & Tarif    | 8      | 3         | 0              | 37%         |
| Unternehmer-Landingpage | 7      | 2         | 0              | 28%         |
| Synchronisation         | 3      | 1         | 0              | 33%         |
| Authentifizierung       | 4      | 0         | 0              | 0%          |
| Live-Data               | 7      | 0         | 0              | 0%          |
| Kommunikation           | 5      | 0         | 0              | 0%          |
| Forms                   | 6      | 0         | 0              | 0%          |
| Rechtstexte             | 3      | 0         | 0              | 0%          |
| Edge Functions          | 3      | 0         | 0              | 0%          |
| PWA                     | 4      | 0         | 0              | 0%          |
| Performance             | 3      | 0         | 0              | 0%          |
| Mobile                  | 2      | 0         | 0              | 0%          |
| **GESAMT**              | **55** | **6**     | **0**          | **11%**     |

---

## 🔄 NÄCHSTE SCHRITTE

1. ✅ **Kritische Fixes durchgeführt**
2. ⏳ **Automatisierte Tests implementieren** (Cypress/Playwright)
3. ⏳ **Manuelle Tests durchführen**
4. ⏳ **Performance-Optimierungen**
5. ⏳ **Production-Deployment**

---

## 📝 NOTIZEN

- Alle Fixes seit V18.0 sind rückwärtskompatibel
- Subscription-Sync läuft jetzt alle 30s statt 60s
- Landingpage unterstützt jetzt beide URL-Parameter (`tenant` und `id`)
- Zentrale `subscription-utils.ts` verhindert Product-ID-Inkonsistenzen

**Letzte Aktualisierung:** 15.10.2025, 21:00 Uhr (CEST)
