# FEATURE-ROADMAP V18.5.0

> **Version:** 18.5.0  
> **Status:** ✅ APPROVED  
> **Rollout-Strategie:** 1 Feature pro Monat (Business-Tarif)  
> **Zeitraum:** Feb 2025 - Dez 2027 (35 Monate)

---

## 🎯 STRATEGIE

### **Rollout-Prinzipien**
1. **Monatlicher Release-Zyklus:** Jedes Feature erhält 4 Wochen für Entwicklung, Testing, Marketing
2. **Business-Tarif First:** Alle neuen Features exklusiv für Business-Tarif (Upgrade-Anreiz)
3. **Marketing-getrieben:** Jedes Feature mit dedizierter Kampagne (Landing-Page, Social Media, Newsletter)
4. **Feedback-Integration:** Nach jedem Release 2 Wochen Beta-Feedback von Pilotkunden

---

## 📅 ROLLOUT-PLAN (35 FEATURES)

### **🚀 Q1 2025 (Feb - Apr)**

#### **Feb 2025: Multi-Stop-Routing** ⭐
- **Kategorie:** Booking-Features
- **Beschreibung:** Mehrere Zwischenstopps in einer Fahrt (max. 5 Stops)
- **Nutzen:** Effizienz für Fahrgäste, höhere Auslastung für Unternehmer
- **Technisch:** 
  - HERE Routing API mit Waypoints
  - Dynamische Preisberechnung pro Segment
  - UI: Drag-&-Drop-Route-Editor
- **Marketing:** "Die Revolution im Fahrtenverlauf: Ab jetzt bis zu 5 Zwischenstopps!"
- **Tarif-Gate:** `multi_stop_routing` (Business+)

#### **Mär 2025: Return-Trip-Discount** 
- **Kategorie:** Pricing-Features
- **Beschreibung:** Automatische Rabatte für Rückfahrten (10-20%)
- **Nutzen:** Kundenbindung, planbare Umsätze
- **Technisch:**
  - Auto-Detection von Hin-/Rückfahrt-Kombinationen
  - Discount-Engine in Pricing-Calculation
  - UI: Badge "Rückfahrt-Rabatt aktiv"
- **Marketing:** "Doppelt sparen: Bis zu 20% Rabatt auf Ihre Rückfahrt!"
- **Tarif-Gate:** `return_trip_discount` (Business+)

#### **Apr 2025: Recurring-Bookings**
- **Kategorie:** Booking-Features
- **Beschreibung:** Wiederkehrende Fahrten (täglich, wöchentlich, monatlich)
- **Nutzen:** Komfort für Pendler, planbare Einnahmen
- **Technisch:**
  - Cron-Job-basierte Booking-Automation
  - N8N-Workflow für Notifications
  - UI: Recurring-Scheduler mit iCal-Export
- **Marketing:** "Einmal buchen, dauerhaft fahren: Pendler-Abos jetzt verfügbar!"
- **Tarif-Gate:** `recurring_bookings` (Business+)

---

### **☀️ Q2 2025 (Mai - Jul)**

#### **Mai 2025: Group-Bookings**
- **Kategorie:** Booking-Features
- **Beschreibung:** Sammelfahrten für mehrere Kunden (2-8 Personen)
- **Nutzen:** Event-Fahrten, Flughafen-Shuttles
- **Technisch:**
  - Group-Leader-System
  - Split-Payment-Integration
  - UI: Group-Booking-Wizard
- **Marketing:** "Gemeinsam günstiger: Gruppenfahrten mit Smart-Payment!"
- **Tarif-Gate:** `group_bookings` (Business+)

#### **Jun 2025: VIP-Service-Levels**
- **Kategorie:** Booking-Features
- **Beschreibung:** Premium-Fahrzeuge mit erhöhten Preisen (Luxus-Klasse)
- **Nutzen:** Umsatz-Steigerung, Brand-Differenzierung
- **Technisch:**
  - Vehicle-Class-System (Standard/Premium/VIP)
  - Dynamic-Pricing-Multiplier (1.5x - 3x)
  - UI: Fahrzeug-Filter mit Fotos
- **Marketing:** "VIP-Erlebnis: Limousinen-Service auf Knopfdruck!"
- **Tarif-Gate:** `vip_service_levels` (Business+)

#### **Jul 2025: Split-Payment**
- **Kategorie:** Payment-Features
- **Beschreibung:** Aufteilen der Rechnung auf mehrere Zahlungsmethoden
- **Nutzen:** Flexibilität (z.B. 50% Karte, 50% Bar)
- **Technisch:**
  - Stripe Multi-Payment-Intent
  - UI: Payment-Split-Slider
- **Marketing:** "Zahlen wie Sie wollen: Split-Payment ab sofort möglich!"
- **Tarif-Gate:** `split_payment` (Business+)

---

### **🍂 Q3 2025 (Aug - Okt)**

#### **Aug 2025: Corporate-Accounts**
- **Kategorie:** Payment-Features
- **Beschreibung:** Firmen-Abos mit monatlicher Abrechnung
- **Nutzen:** B2B-Kunden, planbare Großaufträge
- **Technisch:**
  - Subscription-basierte Corporate-Billing
  - Employee-Access-Management
  - UI: Corporate-Dashboard
- **Marketing:** "B2B-Lösung: Firmenkonten mit Monatsabrechnung!"
- **Tarif-Gate:** `corporate_accounts` (Business+)

#### **Sep 2025: Tip-Integration**
- **Kategorie:** Payment-Features
- **Beschreibung:** Trinkgeld-System für Fahrer (optional)
- **Nutzen:** Fahrer-Motivation, Umsatz-Plus
- **Technisch:**
  - Stripe Tip-Field
  - Driver-Payout-Automation
  - UI: Tip-Slider (0% / 5% / 10% / 15%)
- **Marketing:** "Zufriedenheit belohnen: Trinkgeld-System jetzt live!"
- **Tarif-Gate:** `tip_integration` (Business+)

#### **Okt 2025: Invoice-Bundles**
- **Kategorie:** Payment-Features
- **Beschreibung:** Wöchentliche/Monatliche Sammelrechnungen
- **Nutzen:** Weniger Admin-Aufwand für Vielfahrer
- **Technisch:**
  - Batch-Invoice-Generation
  - PDF-Merge-Engine
  - UI: Billing-Period-Selector
- **Marketing:** "Schluss mit Rechnungs-Chaos: Sammelrechnungen on demand!"
- **Tarif-Gate:** `invoice_bundles` (Business+)

---

### **❄️ Q4 2025 (Nov - Dez)**

#### **Nov 2025: Loyalty-Points**
- **Kategorie:** Payment-Features
- **Beschreibung:** Bonuspunkte-System für Stammkunden
- **Nutzen:** Kundenbindung, Repeat-Business
- **Technisch:**
  - Points-Ledger-Tabelle
  - Redemption-Engine (100 Punkte = 1€ Discount)
  - UI: Points-Balance-Widget
- **Marketing:** "Treue zahlt sich aus: Bonuspunkte-System gestartet!"
- **Tarif-Gate:** `loyalty_points` (Business+)

#### **Dez 2025: Customer-Lifetime-Value**
- **Kategorie:** Analytics-Features
- **Beschreibung:** Umsatz-Prognose pro Kunde
- **Nutzen:** Sales-Forecasting, Marketing-ROI
- **Technisch:**
  - ML-Modell (Gemini 2.5 Pro)
  - Cohort-Analysis
  - UI: CLV-Dashboards
- **Marketing:** "Wissen, was Kunden wert sind: CLV-Analytics ab jetzt!"
- **Tarif-Gate:** `clv_analytics` (Business+)

---

### **🌸 Q1 2026 (Jan - Mär)**

#### **Jan 2026: Route-Optimization-Reports**
- **Kategorie:** Analytics-Features
- **Beschreibung:** Effizienz-Analysen (Zeit/Kosten-Einsparungen)
- **Nutzen:** Prozess-Optimierung, Kostensenkung
- **Technisch:**
  - HERE Traffic-Data-Integration
  - Benchmark-Comparison (Soll vs. Ist)
  - UI: Efficiency-Score-Cards
- **Marketing:** "Effizienz messen: Route-Optimization-Reports verfügbar!"
- **Tarif-Gate:** `route_optimization_reports` (Business+)

#### **Feb 2026: Driver-Performance-Dashboards**
- **Kategorie:** Analytics-Features
- **Beschreibung:** Fahrer-Vergleich mit KPIs (Pünktlichkeit, Bewertungen)
- **Nutzen:** Fahrer-Motivation, Qualitätssicherung
- **Technisch:**
  - KPI-Aggregation-Views
  - Leaderboard-System
  - UI: Driver-Ranking-Cards
- **Marketing:** "Top-Performer erkennen: Driver-Performance-Dashboards!"
- **Tarif-Gate:** `driver_performance_dashboards` (Business+)

#### **Mär 2026: Demand-Heatmaps**
- **Kategorie:** Analytics-Features
- **Beschreibung:** Geografische Nachfrage-Analysen
- **Nutzen:** Strategische Planung (wo mehr Fahrer benötigt)
- **Technisch:**
  - HERE Maps Heatmap-Layer
  - Time-based Demand-Analysis
  - UI: Interactive Map mit Hotspots
- **Marketing:** "Nachfrage sichtbar machen: Demand-Heatmaps live!"
- **Tarif-Gate:** `demand_heatmaps` (Business+)

---

### **☀️ Q2 2026 (Apr - Jun)**

#### **Apr 2026: Revenue-Forecasting**
- **Kategorie:** Analytics-Features
- **Beschreibung:** AI-basierte Umsatz-Prognosen (7/30/90 Tage)
- **Nutzen:** Finanzplanung, Budget-Sicherheit
- **Technisch:**
  - Gemini 2.5 Pro Time-Series-Forecasting
  - Historical-Data-Training
  - UI: Forecast-Charts mit Confidence-Intervals
- **Marketing:** "In die Zukunft blicken: AI-Umsatzprognosen starten!"
- **Tarif-Gate:** `revenue_forecasting` (Business+)

#### **Mai 2026: Dynamic-Pricing**
- **Kategorie:** AI-Features
- **Beschreibung:** Preise basierend auf Nachfrage/Verkehr
- **Nutzen:** Umsatz-Optimierung, Auslastungs-Steuerung
- **Technisch:**
  - Real-Time-Demand-Detection
  - Surge-Pricing-Algorithm (max. 2x)
  - UI: Price-Multiplier-Badge
- **Marketing:** "Smart-Pricing: Faire Preise durch intelligente Algorithmen!"
- **Tarif-Gate:** `dynamic_pricing` (Business+)

#### **Jun 2026: Predictive-Maintenance**
- **Kategorie:** AI-Features
- **Beschreibung:** Fahrzeug-Wartungs-Vorhersagen
- **Nutzen:** Ausfallzeiten minimieren, Kosten sparen
- **Technisch:**
  - Mileage-based Predictions
  - Maintenance-Schedule-Alerts
  - UI: Vehicle-Health-Score
- **Marketing:** "Keine Überraschungen mehr: Predictive-Maintenance live!"
- **Tarif-Gate:** `predictive_maintenance` (Business+)

---

### **🍂 Q3 2026 (Jul - Sep)**

#### **Jul 2026: Churn-Prediction**
- **Kategorie:** AI-Features
- **Beschreibung:** Kunden-Abwanderungs-Früherkennung
- **Nutzen:** Retention-Kampagnen, Umsatz-Sicherung
- **Technisch:**
  - ML-Churn-Model (Gemini 2.5 Pro)
  - Engagement-Score-Calculation
  - UI: At-Risk-Customer-List
- **Marketing:** "Kunden halten: Churn-Prediction ab jetzt verfügbar!"
- **Tarif-Gate:** `churn_prediction` (Business+)

#### **Aug 2026: Smart-Route-Suggestions**
- **Kategorie:** AI-Features
- **Beschreibung:** KI-optimierte Routen-Vorschläge
- **Nutzen:** Zeit-Ersparnis, Sprit-Einsparung
- **Technisch:**
  - HERE Real-Time-Traffic + AI
  - Alternative-Route-Ranking
  - UI: Route-Comparison-View
- **Marketing:** "Immer die beste Route: AI-Route-Suggestions starten!"
- **Tarif-Gate:** `smart_route_suggestions` (Business+)

#### **Sep 2026: Sentiment-Analysis**
- **Kategorie:** AI-Features
- **Beschreibung:** Kunden-Feedback automatisch analysieren
- **Nutzen:** Qualitätssicherung, Probleme früh erkennen
- **Technisch:**
  - Gemini 2.5 Flash Sentiment-Detection
  - Review-Aggregation
  - UI: Sentiment-Dashboard (😊😐😞)
- **Marketing:** "Kundenmeinung verstehen: Sentiment-Analysis live!"
- **Tarif-Gate:** `sentiment_analysis` (Business+)

---

### **❄️ Q4 2026 (Okt - Dez)**

#### **Okt 2026: Driver-App**
- **Kategorie:** Mobile-Features
- **Beschreibung:** Dedizierte App für Fahrer (Push-Notifications)
- **Nutzen:** Mobile-First-Experience, Echtzeit-Updates
- **Technisch:**
  - React Native (iOS/Android)
  - Push-Notifications (Firebase)
  - Offline-Sync (lokale DB)
- **Marketing:** "Unterwegs immer informiert: Driver-App ab jetzt!"
- **Tarif-Gate:** `driver_app` (Business+)

#### **Nov 2026: Customer-Portal-App**
- **Kategorie:** Mobile-Features
- **Beschreibung:** Kunden-App für Buchungen
- **Nutzen:** Mobile-Buchungen, höhere Conversion
- **Technisch:**
  - React Native (iOS/Android)
  - Apple Pay / Google Pay
  - GPS-basierte Pickup-Detection
- **Marketing:** "Buchen von unterwegs: Customer-App gelauncht!"
- **Tarif-Gate:** `customer_portal_app` (Business+)

#### **Dez 2026: Live-Tracking-Widget**
- **Kategorie:** Mobile-Features
- **Beschreibung:** Einbettbares Tracking für Websites
- **Nutzen:** Transparenz, White-Label-Lösung
- **Technisch:**
  - Embeddable iframe-Widget
  - Real-Time-GPS-Updates (WebSockets)
  - UI: Minimalistic Map-View
- **Marketing:** "Tracking auf Ihrer Website: Live-Widget verfügbar!"
- **Tarif-Gate:** `live_tracking_widget` (Business+)

---

### **🌸 Q1 2027 (Jan - Mär)**

#### **Jan 2027: Offline-Mode**
- **Kategorie:** Mobile-Features
- **Beschreibung:** App funktioniert ohne Internet
- **Nutzen:** Zuverlässigkeit in Gebieten mit schlechtem Empfang
- **Technisch:**
  - IndexedDB für lokale Datenhaltung
  - Sync-Queue für spätere Uploads
  - UI: Offline-Indicator
- **Marketing:** "Immer einsatzbereit: Offline-Mode aktiviert!"
- **Tarif-Gate:** `offline_mode` (Business+)

#### **Feb 2027: Voice-Commands**
- **Kategorie:** Mobile-Features
- **Beschreibung:** Sprachsteuerung für Fahrer
- **Nutzen:** Sicherheit (Hände am Lenkrad), Komfort
- **Technisch:**
  - Web Speech API
  - Voice-Command-Parser (Gemini 2.5 Flash)
  - UI: Voice-Button
- **Marketing:** "Hände frei, Blick auf die Straße: Voice-Commands!"
- **Tarif-Gate:** `voice_commands` (Business+)

#### **Mär 2027: Fleet-Telematics**
- **Kategorie:** Integration-Features
- **Beschreibung:** Direkte Integration mit Fahrzeug-Sensoren
- **Nutzen:** Live-Daten (Kraftstoff, Motorstatus)
- **Technisch:**
  - OBD-II-Adapter-Integration
  - Telemetry-Data-Stream
  - UI: Vehicle-Health-Dashboard
- **Marketing:** "Fahrzeuge verstehen: Fleet-Telematics live!"
- **Tarif-Gate:** `fleet_telematics` (Business+)

---

### **☀️ Q2 2027 (Apr - Jun)**

#### **Apr 2027: Payment-Gateway-Options**
- **Kategorie:** Integration-Features
- **Beschreibung:** Stripe, PayPal, Klarna, SEPA
- **Nutzen:** Zahlungs-Flexibilität, internationale Kunden
- **Technisch:**
  - Multi-Gateway-Adapter
  - Fallback-Chain (Primary/Secondary)
  - UI: Payment-Method-Selector
- **Marketing:** "Zahlen wie Sie wollen: 4 Zahlungsmethoden verfügbar!"
- **Tarif-Gate:** `payment_gateway_options` (Business+)

#### **Mai 2027: SMS-Notifications**
- **Kategorie:** Integration-Features
- **Beschreibung:** Bestätigungen per SMS
- **Nutzen:** Erreichbarkeit auch ohne App
- **Technisch:**
  - Twilio-Integration
  - SMS-Template-System
  - UI: SMS-Opt-In-Checkbox
- **Marketing:** "Immer informiert: SMS-Benachrichtigungen aktiv!"
- **Tarif-Gate:** `sms_notifications` (Business+)

#### **Jun 2027: WhatsApp-Business**
- **Kategorie:** Integration-Features
- **Beschreibung:** Buchungen via WhatsApp
- **Nutzen:** Kunden-Channel-Präferenz, Conversion
- **Technisch:**
  - WhatsApp Business API
  - Chatbot-Integration (Gemini 2.5 Flash)
  - UI: WhatsApp-Button
- **Marketing:** "Buchen per WhatsApp: Jetzt möglich!"
- **Tarif-Gate:** `whatsapp_business` (Business+)

---

### **🍂 Q3 2027 (Jul - Sep)**

#### **Jul 2027: Calendar-Sync**
- **Kategorie:** Integration-Features
- **Beschreibung:** Google Calendar / Outlook Integration
- **Nutzen:** Automatische Termin-Einträge
- **Technisch:**
  - iCal-Format-Export
  - OAuth-Integration (Google/Microsoft)
  - UI: "Add to Calendar"-Button
- **Marketing:** "Nie wieder Termine vergessen: Calendar-Sync live!"
- **Tarif-Gate:** `calendar_sync` (Business+)

#### **Aug 2027: Profit-Margin-Analysis**
- **Kategorie:** BI-Features
- **Beschreibung:** Gewinn-Analyse pro Auftrag
- **Nutzen:** Profitabilitäts-Transparenz
- **Technisch:**
  - Cost-Calculation-Engine (Sprit, Fahrer, Steuern)
  - Margin-Breakdown-Charts
  - UI: Profit-Margin-Cards
- **Marketing:** "Gewinn im Blick: Profit-Margin-Analysis verfügbar!"
- **Tarif-Gate:** `profit_margin_analysis` (Business+)

#### **Sep 2027: Cost-Center-Allocation**
- **Kategorie:** BI-Features
- **Beschreibung:** Kosten-Zuordnung automatisch
- **Nutzen:** Buchhaltungs-Effizienz
- **Technisch:**
  - Rule-based Cost-Center-Mapping
  - Export zu DATEV/Lexoffice
  - UI: Cost-Center-Dropdown
- **Marketing:** "Buchhaltung vereinfacht: Cost-Center-Allocation!"
- **Tarif-Gate:** `cost_center_allocation` (Business+)

---

### **❄️ Q4 2027 (Okt - Dez)**

#### **Okt 2027: Tax-Reports**
- **Kategorie:** BI-Features
- **Beschreibung:** Steuer-konforme Reports (Finanzamt-ready)
- **Nutzen:** Compliance, Zeit-Ersparnis
- **Technisch:**
  - ELSTER-XML-Export
  - USt-VA-Generator
  - UI: Tax-Report-Builder
- **Marketing:** "Finanzamt-ready: Tax-Reports ab sofort!"
- **Tarif-Gate:** `tax_reports` (Business+)

#### **Nov 2027: Driver-Payroll-Integration**
- **Kategorie:** BI-Features
- **Beschreibung:** Lohn-Abrechnung automatisiert
- **Nutzen:** HR-Effizienz, Fehler-Reduktion
- **Technisch:**
  - Payroll-API-Integration (DATEV/Lexware)
  - Hours-Tracking-System
  - UI: Payroll-Dashboard
- **Marketing:** "Lohnabrechnung automatisiert: Payroll-Integration live!"
- **Tarif-Gate:** `driver_payroll_integration` (Business+)

#### **Dez 2027: Partner-Commission-Tracking**
- **Kategorie:** BI-Features
- **Beschreibung:** Provisions-Abrechnung automatisch
- **Nutzen:** Partner-Transparenz, Abrechnungs-Genauigkeit
- **Technisch:**
  - Commission-Calculation-Engine
  - Partner-Payout-Automation
  - UI: Partner-Commission-Dashboard
- **Marketing:** "Fair & transparent: Partner-Commission-Tracking!"
- **Tarif-Gate:** `partner_commission_tracking` (Business+)

---

## 📊 FEATURE-KATEGORIEN (Übersicht)

| **Kategorie** | **Anzahl Features** | **Zeitraum** |
|---------------|---------------------|--------------|
| **Booking-Features** | 5 | Q1-Q2 2025 |
| **Payment-Features** | 5 | Q2-Q4 2025 |
| **Analytics-Features** | 5 | Q4 2025 - Q1 2026 |
| **AI-Features** | 5 | Q2-Q3 2026 |
| **Mobile-Features** | 5 | Q4 2026 - Q1 2027 |
| **Integration-Features** | 5 | Q1-Q2 2027 |
| **BI-Features** | 5 | Q3-Q4 2027 |

---

## 🎨 MARKETING-TEMPLATE (pro Feature)

### **Landing-Page-Struktur:**
```html
<!-- Hero-Section -->
<h1>[Feature-Name]: [Nutzen in 5 Wörtern]</h1>
<p>[1-Satz-Beschreibung]</p>
<button>Jetzt upgraden auf Business+</button>

<!-- Feature-Details -->
<section>
  <h2>Was ist [Feature-Name]?</h2>
  <p>[Ausführliche Erklärung mit Use-Cases]</p>
  <img src="screenshot-dashboard.png" alt="Dashboard-Screenshot">
</section>

<!-- Vorteile -->
<section>
  <h2>Vorteile für Ihr Unternehmen</h2>
  <ul>
    <li>✅ [Vorteil 1]</li>
    <li>✅ [Vorteil 2]</li>
    <li>✅ [Vorteil 3]</li>
  </ul>
</section>

<!-- Pricing -->
<section>
  <h2>Upgrade auf Business+</h2>
  <p>Alle Features inkl. [Feature-Name] für nur 99 €/Monat</p>
  <button>Jetzt upgraden</button>
</section>

<!-- FAQ -->
<section>
  <h2>Häufig gestellte Fragen</h2>
  <details>
    <summary>Wie funktioniert [Feature-Name]?</summary>
    <p>[Antwort]</p>
  </details>
</section>
```

### **Social-Media-Posts:**
```markdown
**LinkedIn:**
🚀 Neu bei MyDispatch: [Feature-Name]!
[Nutzen in 1 Satz]
Jetzt upgraden auf Business+: [Link]
#MyDispatch #TaxiSoftware #Innovation

**Twitter/X:**
🎉 [Feature-Name] ist live!
[Nutzen in 1 Satz]
Upgrade: [Short-Link]

**Instagram:**
[Screenshot-Karussell mit 3 Bildern]
Slide 1: "Neu: [Feature-Name]"
Slide 2: "So funktioniert's" (Erklärgrafik)
Slide 3: "Jetzt upgraden!" (CTA)
```

---

## ✅ SUCCESS METRICS (pro Feature)

### **Launch-Phase (Woche 1-4)**
- ✅ Feature-Dokumentation online
- ✅ Landing-Page live
- ✅ 3 Social-Media-Posts veröffentlicht
- ✅ Newsletter verschickt
- ✅ Beta-Test mit 10 Pilotkunden

### **Adoption-Phase (Monat 2-3)**
- ✅ >20% der Business-Kunden nutzen Feature
- ✅ <5 Support-Tickets pro Feature
- ✅ >4.5/5 Sterne User-Rating
- ✅ 5+ Upgrade-Conversions (Starter → Business)

### **Optimierung-Phase (Monat 4-6)**
- ✅ >50% der Business-Kunden nutzen Feature
- ✅ Feature in Top-3 der meist-genutzten Features
- ✅ Testimonials von 3+ Kunden gesammelt

---

**Version:** V18.5.0  
**Status:** ✅ APPROVED  
**Nächstes Review:** Nach jedem Feature-Release
