# UI COMPONENTS LIBRARY V18.5.0

> **Version:** 18.5.0  
> **Status:** ✅ PRODUCTION-READY  
> **Letzte Aktualisierung:** 2025-10-22

---

## 🎯 ÜBERSICHT

Vollständige UI-Komponenten-Bibliothek für MyDispatch mit allen erforderlichen Elementen für hochwertige, harmonische Seiten.

---

## 📚 KOMPONENTEN-KATEGORIEN

### 1. BASE COMPONENTS (shadcn/ui)
Pfad: `src/components/ui/`

#### Buttons
```tsx
import { Button } from '@/components/ui/button';

// Varianten
<Button variant="default">Standard</Button>
<Button variant="secondary">Sekundär</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="link">Link</Button>

// Größen
<Button size="sm">Klein</Button>
<Button size="default">Standard</Button>
<Button size="lg">Groß</Button>
<Button size="icon">Icon</Button>
```

#### Cards
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Titel</CardTitle>
    <CardDescription>Beschreibung</CardDescription>
  </CardHeader>
  <CardContent>Inhalt</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

#### Inputs
```tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

<div>
  <Label htmlFor="email">E-Mail</Label>
  <Input id="email" type="email" placeholder="max@mustermann.de" />
</div>

<Textarea placeholder="Beschreibung..." />
```

#### Selects & Dropdowns
```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Wählen Sie..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

#### Dialogs & Modals
```tsx
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Dialog öffnen</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Titel</DialogTitle>
      <DialogDescription>Beschreibung</DialogDescription>
    </DialogHeader>
    {/* Content */}
  </DialogContent>
</Dialog>
```

#### Badges
```tsx
import { Badge } from '@/components/ui/badge';

<Badge>Standard</Badge>
<Badge variant="secondary">Sekundär</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Destructive</Badge>
```

#### Tabs
```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Inhalt Tab 1</TabsContent>
  <TabsContent value="tab2">Inhalt Tab 2</TabsContent>
</Tabs>
```

#### Tables
```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Max Mustermann</TableCell>
      <TableCell>Aktiv</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

### 2. SHARED COMPONENTS
Pfad: `src/components/shared/`

#### StatusIndicator
```tsx
import { StatusIndicator } from '@/components/shared/StatusIndicator';

// Automatische Ampel-Farben
<StatusIndicator status="active" /> // Grün
<StatusIndicator status="pending" /> // Gelb
<StatusIndicator status="inactive" /> // Rot
```

#### EmptyState
```tsx
import { EmptyState } from '@/components/shared/EmptyState';

<EmptyState 
  icon={FileX}
  title="Keine Aufträge"
  description="Erstellen Sie Ihren ersten Auftrag"
  actionLabel="Auftrag erstellen"
  onAction={() => {}}
/>
```

#### BulkActionBar
```tsx
import { BulkActionBar } from '@/components/shared/BulkActionBar';

<BulkActionBar
  selectedCount={5}
  actions={[
    { label: 'PDF exportieren', icon: Download, onClick: handleExport },
    { label: 'Status ändern', icon: RefreshCw, onClick: handleStatus },
  ]}
  onClear={() => {}}
/>
```

#### DetailDialog
```tsx
import { DetailDialog } from '@/components/shared/DetailDialog';

<DetailDialog
  open={open}
  onOpenChange={setOpen}
  title="Details"
  entity={data}
  fields={[
    { label: 'Name', value: data.name },
    { label: 'Status', value: <StatusIndicator status={data.status} /> },
  ]}
  actions={[
    { label: 'Bearbeiten', icon: Edit, onClick: handleEdit },
  ]}
/>
```

#### SearchableSelect
```tsx
import { SearchableSelect } from '@/components/shared/SearchableSelect';

<SearchableSelect
  options={customers.map(c => ({ value: c.id, label: c.name }))}
  value={selectedCustomer}
  onChange={setSelectedCustomer}
  placeholder="Kunde suchen..."
/>
```

---

### 3. DESIGN SYSTEM COMPONENTS
Pfad: `src/components/design-system/`

#### HeroSection
```tsx
import { HeroSection } from '@/components/design-system';

<HeroSection
  badge="Made in Germany"
  title="MyDispatch"
  subtitle="Die führende Software"
  description="Professionelle Disposition..."
  primaryAction={{ label: "Abonnieren", onClick: () => {} }}
  secondaryAction={{ label: "Demo", onClick: () => {} }}
  videoUrl="https://..."
/>
```

#### KPICard
```tsx
import { KPICard } from '@/components/design-system';

<KPICard
  title="Umsatz heute"
  value="2.450 €"
  trend={12.5}
  icon={Euro}
/>
```

#### QuickActions
```tsx
import { QuickActions } from '@/components/design-system';

<QuickActions
  actions={[
    { label: 'Neuer Auftrag', icon: Plus, onClick: () => {} },
    { label: 'Neuer Kunde', icon: UserPlus, onClick: () => {} },
  ]}
/>
```

#### DashboardGrid
```tsx
import { DashboardGrid } from '@/components/design-system';

<DashboardGrid>
  <KPICard {...} />
  <KPICard {...} />
  <KPICard {...} />
</DashboardGrid>
```

#### MarketingButton (NEU)
```tsx
import { MarketingButton } from '@/components/design-system/MarketingButton';

// Hero-Buttons
<MarketingButton marketingVariant="hero-primary">Jetzt abonnieren</MarketingButton>
<MarketingButton marketingVariant="hero-secondary">Demo ansehen</MarketingButton>

// CTA-Buttons
<MarketingButton marketingVariant="cta-primary">Starten</MarketingButton>
<MarketingButton marketingVariant="cta-secondary">Mehr erfahren</MarketingButton>
```

---

### 4. FORM COMPONENTS
Pfad: `src/components/forms/`

#### PersonFormFields
```tsx
import { PersonFormFields } from '@/components/forms/PersonFormFields';

<PersonFormFields
  formData={formData}
  setFormData={setFormData}
  fieldPrefix="customer"
/>
```

#### AddressInput
```tsx
import { AddressInput } from '@/components/forms/AddressInput';

<AddressInput
  value={address}
  onChange={setAddress}
  onAddressSelect={(place) => console.log(place)}
/>
```

#### InlineCustomerForm
```tsx
import { InlineCustomerForm } from '@/components/forms/InlineCustomerForm';

<InlineCustomerForm
  onCustomerCreated={(customer) => console.log(customer)}
  companyId={companyId}
/>
```

---

### 5. LAYOUT COMPONENTS
Pfad: `src/components/layout/`

#### MainLayout
```tsx
import { MainLayout } from '@/components/layout/MainLayout';

<MainLayout>
  {/* App-Inhalt */}
</MainLayout>
```

#### MarketingLayout
```tsx
import { MarketingLayout } from '@/components/layout/MarketingLayout';

<MarketingLayout currentPage="home">
  {/* Marketing-Inhalt */}
</MarketingLayout>
```

#### StandardPageLayout
```tsx
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';

<StandardPageLayout
  title="Aufträge"
  actions={[
    { label: 'Neu', icon: Plus, onClick: () => {} }
  ]}
>
  {/* Page-Inhalt */}
</StandardPageLayout>
```

---

## 🎨 FARB-SYSTEM

### Semantic Tokens (IMMER verwenden)
```tsx
// Text-Farben
className="text-foreground"     // Haupttext
className="text-muted-foreground" // Sekundärtext
className="text-primary"         // Primärfarbe (Gold)
className="text-destructive"     // Fehler

// Hintergrund-Farben
className="bg-background"  // Haupthintergrund
className="bg-card"        // Card-Hintergrund
className="bg-primary"     // Primärfarbe
className="bg-muted"       // Gedämpfter Hintergrund

// Status-Farben (NUR für Badges/StatusIndicator)
className="bg-status-success"  // Grün
className="bg-status-warning"  // Gelb
className="bg-status-error"    // Rot
```

### Verbotene Patterns ❌
```tsx
// NIEMALS direkte Farben!
className="text-white"     // ❌
className="bg-blue-500"    // ❌
className="text-[#EADEBD]" // ❌
```

---

## 📐 SPACING & LAYOUT

### Standard-Gaps
```tsx
gap-2  // 8px - Enge Abstände
gap-4  // 16px - Standard
gap-6  // 24px - Großzügig
gap-8  // 32px - Sehr großzügig
```

### Container-Padding
```tsx
px-4 sm:px-6 lg:px-8  // Responsive Standard-Padding
```

### Grid-Layouts
```tsx
// Mobile-First Grid
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
```

---

## 🔤 TYPOGRAFIE

### Headings
```tsx
className="text-3xl sm:text-4xl md:text-5xl font-bold" // H1
className="text-2xl sm:text-3xl md:text-4xl font-bold" // H2
className="text-xl sm:text-2xl md:text-3xl font-bold" // H3
```

### Body Text
```tsx
className="text-base sm:text-lg"        // Großer Body
className="text-sm sm:text-base"        // Standard Body
className="text-xs sm:text-sm"          // Kleiner Text
```

### Fluid Typography (CSS)
```css
.text-display { font-size: var(--font-5xl); }
.text-heading-1 { font-size: var(--font-4xl); }
.text-body { font-size: var(--font-base); }
```

---

## 🎬 ANIMATIONEN

### Hover-Effekte
```tsx
className="hover:scale-105 transition-transform duration-300"
className="hover:-translate-y-1 transition-transform duration-200"
className="hover:shadow-xl transition-shadow duration-300"
```

### Fade-In Animationen
```tsx
className="animate-fade-in"
className="animate-scale-in"
className="animate-slide-in-right"
```

---

## 📱 RESPONSIVE DESIGN

### Breakpoints
```tsx
sm:  // 640px
md:  // 768px
lg:  // 1024px
xl:  // 1280px
2xl: // 1536px
```

### Mobile-First Pattern
```tsx
className="text-sm sm:text-base md:text-lg lg:text-xl"
className="px-4 sm:px-6 lg:px-8"
className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
```

### Touch-Targets
```tsx
// PFLICHT für mobile Buttons
className="min-h-[44px] min-w-[44px]"
```

---

## 🛡️ ACCESSIBILITY

### ARIA Labels
```tsx
<Button aria-label="Auftrag erstellen">
  <Plus />
</Button>
```

### Alt-Texte
```tsx
<img src="..." alt="MyDispatch Logo - simply arrive" />
```

### Keyboard Navigation
```tsx
// Automatisch durch shadcn/ui Components
<Dialog> // ESC zum Schließen
<Select> // Arrow-Keys Navigation
```

---

## 📊 CHARTS & VISUALISIERUNG

### Recharts Integration
```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" />
  </LineChart>
</ResponsiveContainer>
```

---

## 🎯 BEST PRACTICES

### DO's ✅
1. **Semantic Tokens verwenden**: `text-foreground` statt `text-gray-900`
2. **Mobile-First**: Immer von klein zu groß denken
3. **Touch-Targets**: Mindestens 44x44px für Buttons
4. **Komponenten wiederverwenden**: Nicht neu erfinden
5. **TypeScript**: Alle Props typisieren

### DON'Ts ❌
1. **Direkte Farben**: NIEMALS `text-white`, `bg-blue-500`
2. **Inline-Styles**: Nur Tailwind-Klassen
3. **Fixed Widths**: Nur responsive Werte
4. **Monolithische Files**: Komponenten aufteilen
5. **Missing Alt-Texte**: Immer für Bilder

---

## 📦 INSTALLATION NEUER KOMPONENTEN

### shadcn/ui Component hinzufügen
```bash
npx shadcn-ui@latest add [component-name]
```

### Beispiele
```bash
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add command
```

---

## 🔗 VERKNÜPFTE DOKUMENTE

- [DESIGN_SYSTEM_V18.5.0.md](./DESIGN_SYSTEM_V18.5.0.md) - Vollständiges Design-System
- [QUALITAETS_STANDARDS_V18.5.0.md](./QUALITAETS_STANDARDS_V18.5.0.md) - Qualitätsanforderungen
- [ICON_SYSTEM_V18.3.24.md](./ICON_SYSTEM_V18.3.24.md) - Icon-Verwendung

---

**Letzte Aktualisierung:** 2025-10-22 22:30 (DE)  
**Version:** 18.5.0  
**Status:** ✅ PRODUCTION-READY
