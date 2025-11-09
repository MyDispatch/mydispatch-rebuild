# V28.1 Dashboard Transformation Plan

**Datum:** 2025-11-09  
**Ziel:** Alle 15 Dashboards nach V28.1 Design transformieren  
**Status:** IN PROGRESS

---

## 🎯 Transformation-Ziele

### Design
- ✅ V28.1 Design System durchgehend
- ✅ Volle Breite nutzen (keine rechten/linken Sidebars außer Haupt-Sidebar)
- ✅ Perfekte Spacing-Konsistenz (`gap-6`, `p-6`, `space-y-4`)
- ✅ Moderne, ansprechende Layouts
- ✅ Leicht bedienbar

### Funktionalität
- ✅ Alle bestehenden Funktionen beibehalten
- ✅ Backend-Integration sicherstellen
- ✅ Frontend-State-Management validieren
- ✅ Performance optimieren

---

## 📋 Dashboard-Liste (15 Seiten)

### HAUPTBEREICH (3)
1. ✅ Dashboard (`/dashboard`) - Index.tsx
2. ⏳ Aufträge (`/auftraege`) - Auftraege.tsx
3. ⏳ Angebote (`/angebote`) - Angebote.tsx

### VERWALTUNG (6)
4. ⏳ Kunden (`/kunden`) - Kunden.tsx
5. ⏳ Fahrer & Fahrzeuge (`/fahrer-fahrzeuge`) - FahrerFahrzeuge.tsx
6. ⏳ Schichten & Zeiten (`/schichten`) - Schichten.tsx
7. ⏳ Rechnungen (`/rechnungen`) - Rechnungen.tsx
8. ⏳ Kostenstellen (`/kostenstellen`) - Kostenstellen.tsx
9. ⏳ Dokumente (`/dokumente`) - Dokumente.tsx

### GESCHÄFT (3)
10. ⏳ Partner-Netzwerk (`/partner-netzwerk`) - PartnerNetzwerk.tsx
11. ⏳ Statistiken (`/statistiken`) - Statistiken.tsx
12. ⏳ Landingpage-Editor (`/landingpage-editor`) - LandingpageEditor.tsx

### SYSTEM (2)
13. ⏳ Team-Chat (`/team-chat`) - TeamChat.tsx
14. ⏳ Einstellungen (`/einstellungen`) - Einstellungen.tsx

---

## 🎨 V28.1 Design-Vorgaben

### Layout-Struktur
```tsx
<StandardPageLayout
  title="Dashboard-Titel"
  subtitle="Beschreibung"
  stats={[...]}  // Optional: KPI-Stats
  background="orbs-light"  // V28.1 Background
>
  {/* Content - VOLLE BREITE */}
  <div className="space-y-6">
    {/* Section 1 */}
    <Card>
      <CardHeader>
        <CardTitle>Section Title</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Content */}
      </CardContent>
    </Card>

    {/* Section 2 */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Cards */}
    </div>
  </div>
</StandardPageLayout>
```

### Spacing-Standards
- **Container:** `space-y-6` (zwischen Sections)
- **Grid:** `gap-6` (Hauptgrids), `gap-4` (Subgrids)
- **Card-Content:** `p-6` (Standard), `p-4` (kompakt)
- **Listen:** `space-y-4` (Standard), `space-y-2` (kompakt)

### Color-System
- **Primary:** `bg-primary`, `text-primary`
- **Background:** `bg-background`, `bg-card`
- **Border:** `border-border`
- **Muted:** `bg-muted`, `text-muted-foreground`

---

## 🔧 Transformation-Template

### Schritt 1: Layout-Wrapper
```tsx
// ❌ ALT
<div className="container mx-auto p-4">
  {/* Content mit Sidebars */}
</div>

// ✅ NEU
<StandardPageLayout
  title="Dashboard-Titel"
  subtitle="Beschreibung"
  background="orbs-light"
>
  {/* Content - VOLLE BREITE */}
</StandardPageLayout>
```

### Schritt 2: Grid-Standardisierung
```tsx
// ❌ ALT
<div className="grid gap-4">  // Inkonsistent

// ✅ NEU
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">  // V28.1
```

### Schritt 3: Card-Standardisierung
```tsx
// ❌ ALT
<Card>
  <CardContent>  // Kein explizites Padding
    {/* Content */}
  </CardContent>
</Card>

// ✅ NEU
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent className="p-6">  // Explizites Padding
    {/* Content */}
  </CardContent>
</Card>
```

---

## 📊 Transformation-Strategie

### Phase 1: Master-Template (✅ FERTIG)
- StandardPageLayout mit V28.1 Design
- Spacing-Standards dokumentiert
- Component-Library bereit

### Phase 2: Hauptbereich (JETZT)
1. Dashboard - Bereits V28.1 compliant
2. Aufträge - Transformation erforderlich
3. Angebote - Transformation erforderlich

### Phase 3: Verwaltung
6 Dashboards parallel transformieren

### Phase 4: Geschäft
3 Dashboards parallel transformieren

### Phase 5: System
2 Dashboards parallel transformieren

---

## ✅ Checkliste pro Dashboard

- [ ] StandardPageLayout verwendet
- [ ] Volle Breite (keine zusätzlichen Sidebars)
- [ ] `gap-6` für Hauptgrids
- [ ] `p-6` für Card-Content
- [ ] `space-y-6` für Sections
- [ ] Responsive Breakpoints (`md:`, `lg:`)
- [ ] Alle Funktionen beibehalten
- [ ] Backend-Integration validiert
- [ ] TypeScript-Build erfolgreich
- [ ] Live-Test durchgeführt

---

## 🚀 Deployment-Plan

### Nach jeder Phase:
1. ✅ Git-Commit mit detaillierter Message
2. ✅ TypeScript-Build prüfen
3. ✅ Git-Push zu origin/master
4. ✅ Vercel Deploy-Hook triggern
5. ✅ Live-Validierung durchführen

### Deploy-Hook:
```bash
curl -X POST "https://api.vercel.com/v1/integrations/deploy/prj_j6exywYDPrstYDQvd2XEQMeIDQZt/7p943NLtid"
```

---

## 📝 Dokumentation

### Zu aktualisieren:
- [ ] V28_DASHBOARD_TRANSFORMATION.md (dieses Dokument)
- [ ] FINAL_PERFECTION_REPORT.md
- [ ] spacing-standards.md (bei Änderungen)
- [ ] Component-Dokumentation

---

**Status:** Phase 2 - Hauptbereich  
**Erstellt:** 2025-11-09 08:40  
**Letztes Update:** 2025-11-09 08:40
