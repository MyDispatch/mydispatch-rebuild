# V28 Sidebar Feature Navigation

**Datum:** 2025-01-30  
**Status:** ✅ IMPLEMENTIERT (V28.1 OPTIMIERT)

---

## STRUKTUR

### Desktop Sidebar
1. **Standard-Navigation** (6 Items): Home, Pricing, Docs, FAQ, NeXify, Contact
2. **Visual Separator** (1px bg-slate-200)
3. **"Features" Header** (nur bei sidebarExpanded)
4. **Feature-Navigation** (8 Items) ⬅️ REDUZIERT von 9
5. **Legal Section** (am Ende)

### Mobile Sheet
- Gleiche Struktur wie Desktop
- Feature-Section mit eigenem Separator
- Scroll-fähig mit `.scrollbar-hide`

---

## FEATURE-LINKS (8 ITEMS)

| Feature | Icon | Route | Page-Key |
|---------|------|-------|----------|
| Auftragsverwaltung | `ClipboardList` | `/features/core/auftragsverwaltung` | `auftragsverwaltung` |
| Fuhrpartverwaltung | `Truck` | `/features/core/fahrer-fahrzeuge` | `fahrer-fahrzeuge` |
| ~~Fahrermanagement~~ | ~~`Users`~~ | **ENTFERNT** | Duplikat-Route ❌ |
| Rechnungswesen | `Receipt` | `/features/core/rechnungsstellung` | `rechnungsstellung` |
| Partner-Netzwerk | `Handshake` | `/features/business/partner-management` | `partner` |
| Live-Statistiken | `TrendingUp` | `/features/business/statistiken` | `statistiken` |
| DSGVO & Sicherheit | `Shield` | `/features/enterprise/support` | `dsgvo` |
| Kunden-Portal | `Globe` | `/features/business/kunden-portal` | `kundenportal` |
| Live-Traffic | `Navigation` | `/features/business/live-traffic` | `traffic` |

**Begründung Reduktion:** Fahrermanagement und Fuhrpartverwaltung führten zur gleichen Route → Duplikat entfernt

---

## BUTTON-STYLES (V28.1 - HEADER-KONFORM)

### Inactive Links
- **Border-Radius:** `rounded-md` (nicht `rounded-lg`)
- **Font-Weight:** `font-medium`
- **Background:** `bg-transparent`
- **Hover:** `hover:bg-slate-100`
- **Transition:** `duration-200`

### Active Links
- **Border-Radius:** `rounded-lg`
- **Font-Weight:** `font-semibold`
- **Background:** `bg-slate-600`
- **Text:** `text-white`
- **Border:** `border border-slate-600`
- **Shadow:** `shadow-sm`
- **Hover:** `hover:bg-slate-700`

**✅ IDENTISCH mit Header Auth-Buttons (Registrieren/Anmelden)**

---

## ICON-STANDARD

**Alle Icons:**
- Library: Lucide React
- Farben: `text-slate-900` (default), `text-white` (active)
- Size: `h-5 w-5`
- Keine Ampelfarben
- Keine Custom Colors

---

## SCROLLBAR-GOVERNANCE (V28.1)

### Desktop Sidebar
- ✅ `.scrollbar-hide` auf Standard-Navigation (`<nav>`)
- ✅ `.scrollbar-hide` auf Feature-Navigation (`<nav>`)
- ✅ **KEINE sichtbaren Scrollbars** (MANDATORY)

### Mobile Sheet
- ✅ `.scrollbar-hide` auf Standard-Navigation
- ✅ `.scrollbar-hide` auf Feature-Navigation
- ✅ Gleiche Scrollbar-Regeln wie Desktop

**Viewport-Kalkulation (Collapsed):**
- 6 Standard-Items × 50px = 300px
- 8 Feature-Items × 50px = 400px
- Toggle + Separator = 104px
- **Total: 804px** → Passt in 1000px Viewport ✅

---

## MOBILE-VERHALTEN

- Hamburger-Menu öffnet Sheet
- Feature-Section mit Separator (`border-top`)
- Gleiche Icons & Links wie Desktop
- Active-State-Highlighting funktioniert
- `.scrollbar-hide` verhindert sichtbare Scrollbars

---

## ACCESSIBILITY

- ✅ aria-label für alle Buttons
- ✅ Keyboard-Navigation
- ✅ Focus-Management
- ✅ Active-State visuell erkennbar

---

## ÄNDERUNGSHISTORIE

### V28.1 (2025-01-30)
- ✅ Fahrermanagement entfernt (Duplikat-Route)
- ✅ Button-Styles harmonisiert (Header-konform)
- ✅ `.scrollbar-hide` auf alle `<nav>` Elemente
- ✅ `duration-200` statt `duration-300` (Performance)
- ✅ `ring-2` entfernt, `border + shadow-sm` hinzugefügt

### V28.0 (2025-01-30)
- ✅ Initial Implementation (9 Feature-Items)
- ✅ Separator-Section hinzugefügt
- ✅ Mobile-Sheet-Integration

---

**LAST UPDATE:** 2025-01-30 (V28.1)
