# 📚 V26.0 COMPONENT LIBRARY - VOLLSTÄNDIGE DOKUMENTATION

> **Version:** V26.0 "BALANCED"  
> **Status:** ✅ PRODUCTION-READY & LOCKED  
> **Letzte Aktualisierung:** 2025-01-26

---

## 🎯 ÜBERSICHT

Die V26.0 Component Library ist die zentrale Sammlung aller standardisierten UI-Komponenten für das MyDispatch-System. Alle Komponenten folgen den KERNFARBEN und sind WCAG 2.1 AA konform.

**WICHTIG:** Diese Komponenten sind ab sofort **GESPERRT** gegen Design-Änderungen. Nur technische Optimierungen und Bug-Fixes sind erlaubt.

---

## 📦 KOMPONENTEN-ÜBERSICHT

### Core Components

| Component    | Zweck                          | Status    | Datei            |
| ------------ | ------------------------------ | --------- | ---------------- |
| `V26Button`  | Primäre & Sekundäre Buttons    | ✅ LOCKED | `V26Button.tsx`  |
| `V26IconBox` | Icon-Container mit Hintergrund | ✅ LOCKED | `V26IconBox.tsx` |
| `V26InfoBox` | Info-/Warn-/Legal-Hinweise     | ✅ LOCKED | `V26InfoBox.tsx` |

### Auth Components

| Component          | Zweck                        | Status    | Datei                  |
| ------------------ | ---------------------------- | --------- | ---------------------- |
| `V26AuthCard`      | Container für Auth-Formulare | ✅ LOCKED | `V26AuthCard.tsx`      |
| `V26AuthInput`     | Eingabefelder für Auth       | ✅ LOCKED | `V26AuthInput.tsx`     |
| `V26TariffCard`    | Tarifauswahl-Karten          | ✅ LOCKED | `V26TariffCard.tsx`    |
| `V26Checkbox`      | Checkboxen mit Label         | ✅ LOCKED | `V26Checkbox.tsx`      |
| `V26TabNavigation` | Tab-Navigation               | ✅ LOCKED | `V26TabNavigation.tsx` |
| `V26Link`          | Standardisierte Links        | ✅ LOCKED | `V26Link.tsx`          |
| `V26Logo`          | Logo-Component               | ✅ LOCKED | `V26Logo.tsx`          |

---

## 🎨 KERNFARBEN-SYSTEM

Alle Komponenten verwenden ausschließlich diese Farben:

```typescript
export const KERNFARBEN = {
  dunkelblau: "#323D5E", // Primär
  beige: "#EADEBD", // Sekundär/Akzent
  weiss: "#FFFFFF", // Basis
  canvas: "#F9FAFB", // Hintergrund
  text_primary: "#111827", // H1, H2, H3, Preise
  text_secondary: "#374151", // Body-Text
  text_tertiary: "#6B7280", // Sub-Text
  border_neutral: "#E5E7EB", // Standard-Border
  border_neutral_soft: "rgba(229, 231, 235, 0.8)", // Soft-Border
};
```

---

## 📖 KOMPONENTEN-DETAILS

### V26Button

**Zweck:** Primäre und sekundäre Call-to-Action Buttons

**Varianten:**

- `primary`: Dunkelblau mit Beige-Text
- `secondary`: Weiß mit Dunkelblau-Border

**Props:**

```typescript
interface V26ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  className?: string;
  type?: "button" | "submit" | "reset";
}
```

**Verwendung:**

```tsx
<V26Button variant="primary" onClick={handleSubmit}>
  Jetzt starten
</V26Button>
```

---

### V26AuthInput

**Zweck:** Standardisierte Eingabefelder für Auth-Seiten

**Features:**

- Min-Height: 44px (Touch-Target)
- Focus-Ring: Dunkelblau
- Optional: Label

**Props:**

```typescript
interface V26AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}
```

**Verwendung:**

```tsx
<V26AuthInput label="E-Mail" type="email" placeholder="name@firma.de" required />
```

---

### V26TariffCard

**Zweck:** Tarifauswahl-Karten für Registrierung

**Features:**

- Selected State: Ring + Shadow (Dunkelblau)
- Unselected State: Border (border_neutral_soft)
- Hover: Border-Änderung + translateY(-2px)
- Selected Indicator: **UNTEN RECHTS** (Check-Icon)

**Props:**

```typescript
interface V26TariffCardProps {
  name: string;
  price: number;
  icon: LucideIcon;
  features: string[];
  limitations?: string[];
  isSelected: boolean;
  onClick: () => void;
  badge?: string;
  className?: string;
}
```

**Verwendung:**

```tsx
<V26TariffCard
  name="Starter"
  price={39}
  icon={Rocket}
  features={["Feature 1", "Feature 2"]}
  limitations={["Limit 1"]}
  isSelected={selectedTariff === "starter"}
  onClick={() => setSelectedTariff("starter")}
  badge="Beliebt"
/>
```

---

### V26Checkbox

**Zweck:** Standardisierte Checkboxen mit Label

**Features:**

- Touch-Target: 44px+
- Check-Icon bei Selected
- ReactNode als Label unterstützt

**Props:**

```typescript
interface V26CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string | React.ReactNode;
  error?: string;
}
```

**Verwendung:**

```tsx
<V26Checkbox name="consent" label="Ich akzeptiere die AGB" />
```

---

### V26TabNavigation

**Zweck:** Tab-Navigation mit KERNFARBEN

**Features:**

- Responsive Grid Layout
- Touch-Target: 44px+
- Active State: Dunkelblau mit Beige-Text

**Props:**

```typescript
interface V26TabNavigationProps {
  tabs: V26TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

interface V26TabItem {
  id: string;
  label: string | ReactNode;
}
```

**Verwendung:**

```tsx
<V26TabNavigation
  tabs={[
    { id: "login", label: "Anmelden" },
    { id: "signup", label: "Registrieren" },
  ]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
/>
```

---

### V26Link

**Zweck:** Standardisierte Links mit Hover-Effekt

**Features:**

- Underline mit Hover-Animation
- Focus-Ring
- Unterstützt React Router & externe Links

**Props:**

```typescript
interface V26LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to?: string;
  external?: boolean;
  children: React.ReactNode;
}
```

**Verwendung:**

```tsx
{
  /* Internal Link */
}
<V26Link to="/datenschutz">Datenschutz</V26Link>;

{
  /* External Link */
}
<V26Link to="https://example.com" external>
  Externe Seite
</V26Link>;
```

---

### V26Logo

**Zweck:** Standardisiertes Logo-Component

**Features:**

- 3 Größen: sm, md, lg
- Optional: Custom Logo-URL
- Fallback: Truck-Icon + Text

**Props:**

```typescript
interface V26LogoProps {
  companyName?: string;
  logoUrl?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
}
```

**Verwendung:**

```tsx
<V26Logo companyName="MyDispatch" size="md" onClick={() => navigate("/")} />
```

---

### V26InfoBox

**Zweck:** Standardisierte Hinweis-Boxen

**Typen:**

- `info`: Standard-Hinweis (blau)
- `warning`: Warnung (orange)
- `legal`: Rechtlicher Hinweis (blau)

**Props:**

```typescript
interface V26InfoBoxProps {
  children: ReactNode;
  type?: "info" | "warning" | "legal";
  title?: string;
  className?: string;
}
```

**Verwendung:**

```tsx
<V26InfoBox type="legal" title="DSGVO-Hinweis">
  <p>Mit der Anmeldung akzeptieren Sie...</p>
</V26InfoBox>
```

---

### V26AuthCard

**Zweck:** Container für Auth-Formulare

**Features:**

- Gradient: Weiß → Beige (5% Opacity)
- Border: Dunkelblau (20% Opacity)
- Hover: Border auf 40% Opacity

**Props:**

```typescript
interface V26AuthCardProps {
  children: ReactNode;
  className?: string;
}
```

**Verwendung:**

```tsx
<V26AuthCard className="w-full max-w-4xl">{/* Form content */}</V26AuthCard>
```

---

### V26IconBox

**Zweck:** Icon-Container mit farbigem Hintergrund

**Größen:**

- `sm`: 32px
- `md`: 40px
- `lg`: 48px

**Props:**

```typescript
interface V26IconBoxProps {
  icon: LucideIcon;
  size?: "sm" | "md" | "lg";
  className?: string;
}
```

**Verwendung:**

```tsx
<V26IconBox icon={Rocket} size="lg" />
```

---

## 🚫 VERBOTENE PRAKTIKEN

### ❌ NIEMALS

1. **Direkte Farben verwenden**

   ```tsx
   // ❌ FALSCH
   <div style={{ color: '#FFFFFF', backgroundColor: '#323D5E' }}>

   // ✅ RICHTIG
   <div style={{ color: KERNFARBEN.beige, backgroundColor: KERNFARBEN.dunkelblau }}>
   ```

2. **Custom Button-Stile**

   ```tsx
   // ❌ FALSCH
   <button className="bg-blue-500 text-white px-4 py-2">

   // ✅ RICHTIG
   <V26Button variant="primary">
   ```

3. **Eigene Tab-Navigation**

   ```tsx
   // ❌ FALSCH
   <div className="flex gap-2">
     <button className="...">Tab 1</button>
   </div>

   // ✅ RICHTIG
   <V26TabNavigation tabs={...} />
   ```

4. **Eigene Link-Stile**

   ```tsx
   // ❌ FALSCH
   <Link className="underline text-blue-600">

   // ✅ RICHTIG
   <V26Link to="/path">
   ```

---

## ✅ DESIGN-SYSTEM COMPLIANCE

### Checkliste für neue Komponenten

- [ ] Verwendet ausschließlich KERNFARBEN
- [ ] Touch-Targets ≥ 44px (Mobile-First)
- [ ] WCAG 2.1 AA Kontraste eingehalten
- [ ] Hover-States definiert
- [ ] Focus-Ring implementiert
- [ ] Responsive Typography verwendet
- [ ] Accessibility: ARIA-Labels, Keyboard-Navigation
- [ ] Dokumentation erstellt
- [ ] In index.ts exportiert

---

## 📊 MIGRATION STATUS

### Migrierte Bereiche

| Bereich    | Status    | Components verwendet                                                                                             |
| ---------- | --------- | ---------------------------------------------------------------------------------------------------------------- |
| `/auth`    | ✅ LOCKED | V26AuthCard, V26AuthInput, V26TariffCard, V26Button, V26InfoBox, V26Checkbox, V26TabNavigation, V26Link, V26Logo |
| `/pricing` | ✅ LOCKED | V26Button, V26InfoBox (ursprüngliche Master-Vorlage)                                                             |

---

## 🔒 DESIGN-FREEZE

**Ab 2025-01-26 sind folgende Bereiche gegen Design-Änderungen gesperrt:**

1. **KERNFARBEN** (src/lib/design-system/pricing-colors.ts)
2. **V26 Component Library** (src/components/design-system/)
3. **/auth Bereich** (src/pages/Auth.tsx)
4. **/pricing Bereich** (src/pages/Pricing.tsx)

**Erlaubt sind nur:**

- ✅ Technische Optimierungen (Performance, A11y)
- ✅ Bug-Fixes
- ✅ Security-Updates
- ❌ Design-Änderungen
- ❌ Layout-Neuerungen
- ❌ Farb-Änderungen

---

## 📚 VERWANDTE DOKUMENTATION

- `KERNFARBEN`: src/lib/design-system/pricing-colors.ts
- `Design System`: docs/DESIGN_SYSTEM_FINAL_V26.md
- `Auth Migration`: docs/MIGRATION_V26_AUTH_LOG.md
- `Component Library`: docs/V26_COMPONENT_LIBRARY.md

---

**END OF DOCUMENT**
