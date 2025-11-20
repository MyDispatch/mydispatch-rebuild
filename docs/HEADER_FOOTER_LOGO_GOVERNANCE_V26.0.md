/* ==================================================================================
   HEADER/FOOTER/LOGO GOVERNANCE V26.0 - SYSTEMWEITE VORGABEN
   ==================================================================================
   Status: ZWINGEND BINDEND (P-00)
   Erstellt: 2025-01-26
   Letzte Änderung: 2025-01-26
   Bereich: DESIGN-FROZEN (Nur technische Optimierungen erlaubt)
   ================================================================================== */

# 🎯 ÜBERGEORDNETES ZIEL

Diese Governance definiert EINDEUTIG und ZWINGEND, welcher Header, Footer und welches Logo auf welchen Seiten verwendet werden MUSS.

**KRITISCHE REGEL:**
Es gibt EINEN einzigen, systemweit erlaubten Header/Footer-Typ für Marketing- und Auth-Seiten: **Der MarketingLayout-Header/Footer**.

---

## 📐 SYSTEM-ARCHITEKTUR: DREI BEREICHE

MyDispatch hat drei klar getrennte Bereiche mit unterschiedlichen Header/Footer/Logo-Regeln:

| Bereich | Header/Footer | Logo | Daten im Footer |
|---------|--------------|------|-----------------|
| **1. Marketing** | MarketingLayout | MyDispatch-Logo | MyDispatch (RideHub Solutions) |
| **2. Auth** | MarketingLayout | MyDispatch-Logo | MyDispatch (RideHub Solutions) |
| **3. Dashboard** | Dashboard-Header | Unternehmer-Logo | KEINE Footer-Daten (minimalistisch) |

---

## 🏛️ BEREICH 1: MARKETING-SEITEN

### Gültig für:
- `/` (Startseite)
- `/pricing` (Preise & Tarife)
- `/docs` (Dokumentation)
- `/faq` (FAQ)
- `/nexify-support` (NeXify IT-Service)
- `/contact` (Kontakt)
- `/impressum` (Impressum)
- `/datenschutz` (Datenschutz)
- `/agb` (AGB)
- `/terms` (Nutzungsbedingungen)

### Header-Vorgaben:
```typescript
// QUELLE: src/components/layout/MarketingLayout.tsx (Zeile 149-233)
<header 
  className="fixed top-0 z-30 bg-background"
  style={{
    left: sidebarExpanded ? '240px' : '64px', // Desktop only
    width: sidebarExpanded ? 'calc(100% - 240px)' : 'calc(100% - 64px)', // Desktop only
    boxShadow: DESIGN_TOKENS.elevation.sm,
    borderBottom: `1px solid ${DESIGN_TOKENS.colors.border.DEFAULT}`,
  }}
>
  <div style={{ padding: `0 ${DESIGN_TOKENS.spacing.lg} 0 ${DESIGN_TOKENS.spacing.xl}` }}>
    <div className="flex items-center justify-between" style={{ height: '64px' }}>
      {/* MyDispatch-Logo (ZWINGEND) */}
      <img 
        src={officialLogo} 
        alt="MyDispatch - simply arrive"
        onClick={() => navigate('/')}
        className="h-8 max-w-[120px] sm:max-w-[160px] md:max-w-[180px] object-contain drop-shadow-sm cursor-pointer hover:opacity-80"
      />
      
      {/* Action Buttons */}
      <div className="flex items-center" style={{ gap: DESIGN_TOKENS.spacing.md }}>
        <Button onClick={() => navigate('/auth?tab=signup')}>Registrieren</Button>
        <Button onClick={() => navigate('/auth?tab=login')}>Anmelden</Button>
      </div>
    </div>
  </div>
</header>
```

**KRITISCH:** Buttons MÜSSEN zu korrekten Tabs führen:
- "Registrieren" → `/auth?tab=signup`
- "Anmelden" → `/auth?tab=login`

### Footer-Vorgaben:
```typescript
// QUELLE: src/components/layout/MarketingLayout.tsx (Zeile 243-352)
<footer 
  className="fixed bottom-0 z-20 bg-background"
  style={{
    left: sidebarExpanded ? '240px' : '64px', // Desktop only
    width: sidebarExpanded ? 'calc(100% - 240px)' : 'calc(100% - 64px)', // Desktop only
    borderTop: `1px solid ${DESIGN_TOKENS.colors.border.DEFAULT}`,
  }}
>
  <div className="container mx-auto">
    <div className="flex items-center justify-between">
      {/* Copyright - MyDispatch Daten (ZWINGEND) */}
      <p style={{ fontSize: '12px', color: DESIGN_TOKENS.colors.text.secondary }}>
        © 2025 my-dispatch.de by RideHub Solutions
      </p>
      
      {/* Legal Links - MyDispatch Links (ZWINGEND) */}
      <div className="flex items-center" style={{ gap: DESIGN_TOKENS.spacing.xl }}>
        <Link to="/impressum">Impressum</Link>
        <Link to="/datenschutz">Datenschutz</Link>
        <Link to="/agb">AGB</Link>
        <Link to="/kontakt">Kontakt</Link>
      </div>
    </div>
  </div>
</footer>
```

### Logo-Vorgabe:
- **ZWINGEND**: `officialLogo` (MyDispatch-Logo)
- **QUELLE**: `@/assets/mydispatch-logo-official.png`
- **ALT-Text**: `"MyDispatch - simply arrive"`

### Footer-Daten:
- **Copyright**: `© 2025 my-dispatch.de by RideHub Solutions`
- **Links zu**: MyDispatch Impressum, Datenschutz, AGB, Kontakt

---

## 🔐 BEREICH 2: AUTH-SEITEN

### Gültig für:
- `/auth` (Login, Registrierung, Passwort-Reset)

### Header-Vorgaben:
```typescript
// SPEZIELL FÜR /auth - CUSTOM HEADER (KEIN MarketingLayout)
<header className="fixed top-0 w-full z-30 bg-background">
  <div className="flex items-center justify-between h-16 px-6">
    {/* MyDispatch-Logo (ZWINGEND) */}
    <img 
      src={officialLogo} 
      alt="MyDispatch - simply arrive"
      onClick={() => navigate('/')}
      className="h-8 max-w-[180px] object-contain cursor-pointer hover:opacity-80"
    />
    
    {/* Action Button - NUR "Startseite" (führt zu Home) */}
    <Button onClick={() => navigate('/')}>
      Startseite
    </Button>
  </div>
</header>
```

**KRITISCH:** 
- **KEIN** "Registrieren"-Button im Header (Nutzer ist bereits auf Auth-Seite!)
- **Button-Text MUSS "Startseite" lauten**
- **Button führt zur MyDispatch Home (`/`)** - NICHT zu /auth

### Footer-Vorgaben:
**IDENTISCH MIT MARKETING-FOOTER**
- Gleiche Struktur wie MarketingLayout-Footer (siehe oben)
- MyDispatch Daten im Copyright
- Links zu MyDispatch Rechtsseiten

### Logo-Vorgabe:
- **ZWINGEND**: `officialLogo` (MyDispatch-Logo)
- **QUELLE**: `@/assets/mydispatch-logo-official.png`
- **NIEMALS**: Unternehmer-Logo auf Auth-Seiten

### Footer-Daten:
- **Copyright**: `© 2025 my-dispatch.de by RideHub Solutions`
- **Links zu**: MyDispatch Impressum, Datenschutz, AGB, Kontakt
- **NIEMALS**: Unternehmer-Daten im Footer

### Begründung:
Auth-Seiten sind ÖFFENTLICH und NEUTRAL. Es gibt noch KEINEN Unternehmer-Kontext. Daher MUSS MyDispatch-Branding verwendet werden. Der "Anmelden"-Button führt zurück zur Startseite, da der Nutzer bereits auf der Auth-Seite ist.

---

## 🏢 BEREICH 3: DASHBOARD-SEITEN (Unternehmer-Portal)

### Gültig für:
- `/dashboard` (Alle Dashboard-Routen für eingeloggte Unternehmer)

### Header-Vorgaben:
```typescript
// QUELLE: src/components/layout/Header.tsx
<header 
  className="fixed top-0 z-30 bg-background"
  style={{
    left: sidebarExpanded ? '240px' : '64px',
    width: sidebarExpanded ? 'calc(100% - 240px)' : 'calc(100% - 64px)',
    boxShadow: DESIGN_TOKENS.elevation.sm,
    borderBottom: `1px solid ${DESIGN_TOKENS.colors.border.DEFAULT}`,
  }}
>
  <div className="flex items-center justify-between h-16 px-6">
    {/* Unternehmer-Logo (wenn vorhanden) ODER MyDispatch-Logo (Fallback) */}
    {company.logo_url ? (
      <img 
        src={company.logo_url} 
        alt={`${company.name} Logo`}
        className="h-8 max-w-[180px] object-contain"
      />
    ) : (
      <img 
        src={officialLogo} 
        alt="MyDispatch"
        className="h-8 max-w-[180px] object-contain"
      />
    )}
    
    {/* Action Buttons: Search, AI, Profile, Logout */}
  </div>
</header>
```

### Footer-Vorgaben:
```typescript
// QUELLE: src/components/layout/Footer.tsx
<footer 
  className="fixed bottom-0 z-20 bg-background"
  style={{
    left: sidebarExpanded ? '240px' : '64px',
    width: sidebarExpanded ? 'calc(100% - 240px)' : 'calc(100% - 64px)',
    borderTop: `1px solid ${DESIGN_TOKENS.colors.border.DEFAULT}`,
  }}
>
  <div className="container mx-auto px-6 py-2">
    <div className="flex items-center justify-between text-xs text-muted-foreground">
      {/* KEINE spezifischen Footer-Daten, nur minimalistisch */}
      <p>© 2025 MyDispatch</p>
      <div className="flex gap-4">
        <Link to="/impressum">Impressum</Link>
        <Link to="/datenschutz">Datenschutz</Link>
        <Link to="/agb">AGB</Link>
        <Link to="/contact">Kontakt</Link>
      </div>
    </div>
  </div>
</footer>
```

### Logo-Vorgabe:
- **PRIORITÄT 1**: Unternehmer-Logo (wenn `company.logo_url` vorhanden)
- **FALLBACK**: MyDispatch-Logo (`officialLogo`)
- **QUELLE Unternehmer**: `company.logo_url` aus Supabase
- **QUELLE MyDispatch**: `@/assets/mydispatch-logo-official.png`

### Footer-Daten:
- **Minimalistisch**: Keine detaillierten Unternehmer-Daten
- **Copyright**: `© 2025 MyDispatch` (generisch)
- **Links zu**: MyDispatch Rechtsseiten (NICHT Unternehmer-spezifisch)

### Begründung:
Im Dashboard ist der Nutzer eingeloggt und hat einen Unternehmer-Kontext. Das Logo SOLL das Unternehmer-Logo sein (wenn vorhanden). Der Footer bleibt minimalistisch und zeigt KEINE detaillierten Unternehmer-Kontaktdaten (Datenschutz!).

---

## 🏢 BEREICH 4: UNTERNEHMER-LANDINGPAGE

### Gültig für:
- `/unternehmen/:slug` (Öffentliche Landingpage eines Unternehmers)
- z.B. `/unternehmen/taxi-mueller`

### Header-Vorgaben:
```typescript
// UNTERNEHMER-LANDINGPAGE HEADER
<header className="fixed top-0 w-full z-30 bg-background">
  <div className="flex items-center justify-between h-16 px-6">
    {/* Unternehmer-Logo (wenn vorhanden) ODER Unternehmer-Name */}
    {company.logo_url ? (
      <img 
        src={company.logo_url} 
        alt={`${company.name} Logo`}
        className="h-8 max-w-[180px] object-contain"
      />
    ) : (
      <h1 className="text-xl font-bold text-foreground">
        {company.name}
      </h1>
    )}
    
    {/* Action Buttons - Registrieren & Anmelden */}
    <div className="flex items-center gap-3">
      <Button onClick={() => navigate(`/unternehmen/${slug}/auth?tab=signup`)}>
        Registrieren
      </Button>
      <Button onClick={() => navigate(`/unternehmen/${slug}/auth?tab=login`)}>
        Anmelden
      </Button>
    </div>
  </div>
</header>
```

**KRITISCH:** 
- Buttons führen zur **Unternehmer-Auth** (`/unternehmen/:slug/auth`)
- "Registrieren" → `?tab=signup`
- "Anmelden" → `?tab=login`

### Footer-Vorgaben:
```typescript
// UNTERNEHMER-LANDINGPAGE FOOTER
<footer className="fixed bottom-0 w-full z-20 bg-background border-t">
  <div className="container mx-auto px-6 py-2">
    <div className="flex items-center justify-between text-xs">
      {/* Powered by MyDispatch (ZWINGEND) */}
      <p className="text-muted-foreground">
        Powered by <Link to="/" className="text-foreground hover:underline">MyDispatch</Link>
      </p>
      
      {/* Unternehmer-Legal Links */}
      <div className="flex gap-4">
        <Link to={`/unternehmen/${slug}/impressum`}>Impressum</Link>
        <Link to={`/unternehmen/${slug}/datenschutz`}>Datenschutz</Link>
        <Link to={`/unternehmen/${slug}/agb`}>AGB</Link>
        <Link to={`/unternehmen/${slug}/kontakt`}>Kontakt</Link>
      </div>
    </div>
  </div>
</footer>
```

**KRITISCH:** 
- Footer MUSS "Powered by MyDispatch" enthalten
- "MyDispatch" MUSS zu MyDispatch Home (`/`) verlinkt sein

### Logo-Vorgabe:
- **PRIORITÄT 1**: Unternehmer-Logo (wenn `company.logo_url` vorhanden)
- **FALLBACK**: Unternehmer-Name (als H1-Text)
- **NIEMALS**: MyDispatch-Logo auf Unternehmer-Landingpage

### Footer-Daten:
- **Powered by**: `Powered by MyDispatch` (MyDispatch verlinkt zu `/`)
- **Links zu**: Unternehmer-Rechtsseiten (Impressum, Datenschutz, AGB, Kontakt des Unternehmers)

---

## 🏢 BEREICH 5: UNTERNEHMER-AUTH

### Gültig für:
- `/unternehmen/:slug/auth` (Login/Registrierung im Unternehmer-Kontext)

### Header-Vorgaben:
```typescript
// UNTERNEHMER-AUTH HEADER
<header className="fixed top-0 w-full z-30 bg-background">
  <div className="flex items-center justify-between h-16 px-6">
    {/* Unternehmer-Logo (wenn vorhanden) ODER Unternehmer-Name */}
    {company.logo_url ? (
      <img 
        src={company.logo_url} 
        alt={`${company.name} Logo`}
        className="h-8 max-w-[180px] object-contain"
      />
    ) : (
      <h1 className="text-xl font-bold text-foreground">
        {company.name}
      </h1>
    )}
    
    {/* Action Button - NUR "Startseite" (führt zu Unternehmer-Landingpage) */}
    <Button onClick={() => navigate(`/unternehmen/${slug}`)}>
      Startseite
    </Button>
  </div>
</header>
```

**KRITISCH:** 
- **KEIN** "Registrieren"-Button im Header (Nutzer ist bereits auf Auth-Seite!)
- **Button-Text MUSS "Startseite" lauten**
- **Button führt zur Unternehmer-Landingpage** (`/unternehmen/:slug`)

### Footer-Vorgaben:
```typescript
// UNTERNEHMER-AUTH FOOTER
<footer className="fixed bottom-0 w-full z-20 bg-background border-t">
  <div className="container mx-auto px-6 py-2">
    <div className="flex items-center justify-between text-xs">
      {/* Powered by MyDispatch (ZWINGEND) */}
      <p className="text-muted-foreground">
        Powered by <Link to="/" className="text-foreground hover:underline">MyDispatch</Link>
      </p>
      
      {/* Unternehmer-Legal Links */}
      <div className="flex gap-4">
        <Link to={`/unternehmen/${slug}/impressum`}>Impressum</Link>
        <Link to={`/unternehmen/${slug}/datenschutz`}>Datenschutz</Link>
        <Link to={`/unternehmen/${slug}/agb`}>AGB</Link>
        <Link to={`/unternehmen/${slug}/kontakt`}>Kontakt</Link>
      </div>
    </div>
  </div>
</footer>
```

**KRITISCH:** 
- Footer MUSS "Powered by MyDispatch" enthalten
- "MyDispatch" MUSS zu MyDispatch Home (`/`) verlinkt sein

### Logo-Vorgabe:
- **PRIORITÄT 1**: Unternehmer-Logo (wenn `company.logo_url` vorhanden)
- **FALLBACK**: Unternehmer-Name (als H1-Text)

### Footer-Daten:
- **Powered by**: `Powered by MyDispatch` (MyDispatch verlinkt zu `/`)
- **Links zu**: Unternehmer-Rechtsseiten

---

## 🏢 BEREICH 6: ALLE UNTERNEHMER-PORTALE

### Gültig für:
- Fahrer-Portal (`/fahrer-portal`)
- Kunden-Portal (`/kunden-portal`)
- Partner-Portal (`/partner-portal`)
- Alle anderen Portale im Unternehmer-Kontext

### Header-Vorgaben:
```typescript
// PORTAL HEADER
<header className="fixed top-0 w-full z-30 bg-background">
  <div className="flex items-center justify-between h-16 px-6">
    {/* Unternehmer-Logo (wenn vorhanden) ODER Unternehmer-Name */}
    {company.logo_url ? (
      <img 
        src={company.logo_url} 
        alt={`${company.name} Logo`}
        className="h-8 max-w-[180px] object-contain"
      />
    ) : (
      <h1 className="text-xl font-bold text-foreground">
        {company.name}
      </h1>
    )}
    
    {/* Portal-spezifische Actions (Profile, Logout, etc.) */}
  </div>
</header>
```

### Footer-Vorgaben:
```typescript
// PORTAL FOOTER
<footer className="fixed bottom-0 w-full z-20 bg-background border-t">
  <div className="container mx-auto px-6 py-2">
    <div className="flex items-center justify-between text-xs">
      {/* Powered by MyDispatch (ZWINGEND) */}
      <p className="text-muted-foreground">
        Powered by <Link to="/" className="text-foreground hover:underline">MyDispatch</Link>
      </p>
      
      {/* Portal-spezifische Links */}
      <div className="flex gap-4">
        <Link to="/hilfe">Hilfe</Link>
        <Link to="/datenschutz">Datenschutz</Link>
        <Link to="/kontakt">Kontakt</Link>
      </div>
    </div>
  </div>
</footer>
```

**KRITISCH:** 
- Footer MUSS "Powered by MyDispatch" enthalten
- "MyDispatch" MUSS zu MyDispatch Home (`/`) verlinkt sein

### Logo-Vorgabe:
- **PRIORITÄT 1**: Unternehmer-Logo (wenn `company.logo_url` vorhanden)
- **FALLBACK**: Unternehmer-Name (als H1-Text)

### Footer-Daten:
- **Powered by**: `Powered by MyDispatch` (MyDispatch verlinkt zu `/`)
- **Links zu**: Portal-spezifische Links (Hilfe, Datenschutz, Kontakt)

---

## 🚫 VERBOTENE PRAKTIKEN

### NIEMALS ERLAUBT:
1. ❌ **Unternehmer-Logo auf Marketing-Seiten**
   - Marketing-Seiten sind MyDispatch-Branding
2. ❌ **Unternehmer-Logo auf MyDispatch /auth-Seite**
   - MyDispatch Auth ist neutral, bevor ein Unternehmer-Kontext existiert
3. ❌ **Unternehmer-Daten im Footer auf Marketing/MyDispatch Auth-Seiten**
   - Footer-Daten auf Marketing/Auth gehören zu MyDispatch (RideHub Solutions)
4. ❌ **Fehlende "Powered by MyDispatch" auf Unternehmer-Bereichen**
   - ALLE Unternehmer-Bereiche MÜSSEN "Powered by MyDispatch" im Footer haben
   - "MyDispatch" MUSS zu `/` verlinkt sein
5. ❌ **"Registrieren"-Button auf Auth-Seiten**
   - Nutzer ist bereits auf Auth-Seite, kein zusätzlicher Registrieren-Button nötig
6. ❌ **Logo-Overflow**
   - Logo MUSS auf `max-w-[120px] sm:max-w-[160px] md:max-w-[180px]` beschränkt sein
7. ❌ **Fehlende Legal Links im Footer**
   - Footer MUSS IMMER Legal-Links enthalten
8. ❌ **Falsche Button-Navigation auf MyDispatch-Seiten**
   - "Registrieren" MUSS zu `/auth?tab=signup` führen
   - "Anmelden" MUSS zu `/auth?tab=login` führen
9. ❌ **Falscher Button-Text auf Auth-Seiten**
   - Button auf Auth-Seiten MUSS "Startseite" heißen (NICHT "Anmelden")
   - Gilt für MyDispatch Auth UND Unternehmer Auth

---

## ✅ PFLICHT-CHECKLISTE

### Marketing-Seiten:
- [ ] MarketingLayout-Header verwendet
- [ ] MarketingLayout-Footer verwendet
- [ ] MyDispatch-Logo (`officialLogo`)
- [ ] Footer-Copyright: `© 2025 my-dispatch.de by RideHub Solutions`
- [ ] Footer-Links zu MyDispatch Rechtsseiten
- [ ] "Registrieren"-Button führt zu `/auth?tab=signup`
- [ ] "Anmelden"-Button führt zu `/auth?tab=login`

### MyDispatch Auth-Seite:
- [ ] Custom Header (KEIN MarketingLayout)
- [ ] MyDispatch-Logo (`officialLogo`)
- [ ] KEIN "Registrieren"-Button im Header
- [ ] Button-Text: "Startseite" (NICHT "Anmelden")
- [ ] Button führt zu `/` (Home)
- [ ] MarketingLayout-Footer verwendet
- [ ] Footer-Copyright: `© 2025 my-dispatch.de by RideHub Solutions`
- [ ] Footer-Links zu MyDispatch Rechtsseiten
- [ ] KEIN Unternehmer-Logo
- [ ] KEINE Unternehmer-Daten im Footer

### Dashboard-Seiten:
- [ ] Dashboard-Header verwendet (aus `Header.tsx`)
- [ ] Dashboard-Footer verwendet (aus `Footer.tsx`)
- [ ] Unternehmer-Logo (wenn vorhanden) ODER MyDispatch-Logo (Fallback)
- [ ] Minimalistischer Footer ohne detaillierte Unternehmer-Daten
- [ ] Footer-Links zu MyDispatch Rechtsseiten

### Unternehmer-Landingpage:
- [ ] Custom Header mit Unternehmer-Logo/Name
- [ ] "Registrieren"-Button führt zu `/unternehmen/:slug/auth?tab=signup`
- [ ] "Anmelden"-Button führt zu `/unternehmen/:slug/auth?tab=login`
- [ ] Footer mit "Powered by MyDispatch" (verlinkt zu `/`)
- [ ] Footer-Links zu Unternehmer-Rechtsseiten

### Unternehmer-Auth:
- [ ] Custom Header mit Unternehmer-Logo/Name
- [ ] KEIN "Registrieren"-Button im Header
- [ ] Button-Text: "Startseite" (NICHT "Anmelden")
- [ ] Button führt zu `/unternehmen/:slug` (Landingpage)
- [ ] Footer mit "Powered by MyDispatch" (verlinkt zu `/`)
- [ ] Footer-Links zu Unternehmer-Rechtsseiten

### Alle Unternehmer-Portale:
- [ ] Custom Header mit Unternehmer-Logo/Name
- [ ] Footer mit "Powered by MyDispatch" (verlinkt zu `/`)
- [ ] Footer-Links zu Portal-spezifischen Seiten

---

## 📊 IMPLEMENTIERUNGS-MATRIX

| Seite/Bereich | Header-Komponente | Footer-Komponente | Logo | Footer-Daten | Action-Buttons |
|--------------|-------------------|-------------------|------|--------------|----------------|
| `/` (Home) | MarketingLayout | MarketingLayout | MyDispatch | MyDispatch | Registrieren → `/auth?tab=signup`, Anmelden → `/auth?tab=login` |
| `/pricing` | MarketingLayout | MarketingLayout | MyDispatch | MyDispatch | Registrieren → `/auth?tab=signup`, Anmelden → `/auth?tab=login` |
| `/auth` | **Custom** | **MarketingLayout** | **MyDispatch** | **MyDispatch** | **Startseite → `/` (Home)** |
| `/dashboard/*` | Dashboard Header | Dashboard Footer | Unternehmer (Fallback: MyDispatch) | Minimalistisch | Profile, Logout |
| `/unternehmen/:slug` | Custom | Custom | Unternehmer | Powered by MyDispatch | Registrieren → `/unternehmen/:slug/auth?tab=signup`, Anmelden → `/unternehmen/:slug/auth?tab=login` |
| `/unternehmen/:slug/auth` | Custom | Custom | Unternehmer | Powered by MyDispatch | Startseite → `/unternehmen/:slug` |
| Unternehmer-Portale | Custom | Custom | Unternehmer | Powered by MyDispatch | Portal-spezifisch |

---

## 🔒 DESIGN-FREEZE STATUS

**Dieser Bereich ist DESIGN-FROZEN.**

Nach Fertigstellung und Dokumentation sind AUSNAHMSLOS nur noch folgende Änderungen erlaubt:
- ✅ Technische Optimierungen (Performance, Barrierefreiheit)
- ✅ Bug-Fixes (Funktionale Fehler, Layout-Probleme)
- ✅ Sicherheits-Updates (z.B. XSS-Schutz, CSRF-Protection)
- ❌ Design-Änderungen (Farben, Typografie, Layout-Struktur)
- ❌ Neue UI-Komponenten ohne explizite Governance-Freigabe

---

## 📚 REFERENZEN

### Code-Quellen:
- **Marketing Header/Footer**: `src/components/layout/MarketingLayout.tsx` (Zeile 149-352)
- **Dashboard Header**: `src/components/layout/Header.tsx`
- **Dashboard Footer**: `src/components/layout/Footer.tsx`
- **MyDispatch-Logo**: `src/assets/mydispatch-logo-official.png`

### Verwandte Dokumentation:
- `docs/DESIGN_SYSTEM_FINAL_V26.md` - Allgemeine Design-System-Vorgaben
- `docs/V26_COMPONENT_LIBRARY_COMPLETE.md` - UI-Komponenten-Bibliothek
- `docs/MIGRATION_V26_AUTH_FINAL_LOG.md` - Auth-Seite Migration Log
- `docs/04-GOVERNANCE/Legal-Compliance.md` - Rechtliche Compliance

---

## 📝 CHANGELOG

### V26.2 (2025-01-26) - BUTTON-TEXT-STANDARDISIERUNG
- **ZWINGEND**: Button auf Auth-Seiten MUSS "Startseite" heißen
- **GEÄNDERT**: MyDispatch /auth Button: "Startseite" (statt "Anmelden")
- **GEÄNDERT**: Unternehmer-Auth Button: "Startseite" (statt "Anmelden")
- **BEGRÜNDUNG**: Klarere Benennung - Button führt zur Startseite, nicht zum Login

### V26.1 (2025-01-26) - ERWEITERTE GOVERNANCE
- **ERWEITERT**: 6 Bereiche statt 3 (Marketing, MyDispatch Auth, Dashboard, Unternehmer-Landingpage, Unternehmer-Auth, Unternehmer-Portale)
- **ERWEITERT**: "Powered by MyDispatch"-Regel für alle Unternehmer-Bereiche
- **ERWEITERT**: Button-Navigation-Regeln (Registrieren/Anmelden führen zu korrekten Tabs)
- **GEÄNDERT**: MyDispatch /auth hat Custom Header (KEIN "Registrieren"-Button, "Startseite" führt zu `/`)
- **GEÄNDERT**: Marketing-Seiten Buttons führen zu `/auth?tab=signup` und `/auth?tab=login`
- **NEU**: Unternehmer-Landingpage Header/Footer-Regeln
- **NEU**: Unternehmer-Auth Header/Footer-Regeln
- **NEU**: Unternehmer-Portale Header/Footer-Regeln
- **NEU**: Implementierungs-Matrix erweitert um Action-Buttons

### V26.0 (2025-01-26) - INITIAL GOVERNANCE
- Erstellt als systemweite, bindende Vorgabe
- Definiert drei Bereiche: Marketing, Auth, Dashboard
- Definiert Logo-Regeln pro Bereich
- Definiert Footer-Daten-Regeln pro Bereich
- Deprecated `AuthHeader.tsx` und `AuthFooter.tsx`
- Design-Freeze erklärt

---

**AUTOR:** NeXify AI Agent  
**GENEHMIGUNG:** Pascal (Inhaber MyDispatch)  
**STATUS:** Bindend (P-00)  
**GÜLTIG AB:** Sofort
