# 🎨 PORTAL THEMES GUIDE

**Version:** V1.0  
**Datum:** 2025-10-29  
**Phase:** 6 - Portal-Specific Harmonization

---

## 🎯 ÜBERSICHT

Das **Portal Theme System** stellt sicher, dass alle 3 Portale (Unternehmer, Kunden, Fahrer) ein **einheitliches, aber Portal-spezifisches** Theming haben.

**REGEL:** NIEMALS Portal-Theming hardcoden - IMMER `portal-themes.ts` nutzen!

---

## 🎨 VERFÜGBARE PORTALE

### **1. Entrepreneur Portal (Unternehmer-Dashboard)**

- **Primary Color:** `#3B82F6` (Blue)
- **Accent Color:** `#10B981` (Green)
- **Layout:** Sidebar-based

### **2. Customer Portal (Kunden-Portal)**

- **Primary Color:** `#EADEBD` (Beige) _configurable per company!_
- **Accent Color:** `#D4AF37` (Gold)
- **Layout:** Minimal

### **3. Driver Portal (Fahrer-Portal)**

- **Primary Color:** `#8B5CF6` (Purple)
- **Accent Color:** `#EC4899` (Pink)
- **Layout:** Mobile-first

---

## 📦 USAGE

### **1. Import**

```typescript
import {
  getPortalTheme,
  getPortalThemeClasses,
  applyPortalTheme,
  type PortalType,
} from "@/config/portal-themes";
```

---

### **2. Get Portal Theme**

```typescript
const theme = getPortalTheme("entrepreneur");

console.log(theme.primaryColor); // '#3B82F6'
console.log(theme.layout); // 'sidebar'
```

---

### **3. Get Portal Theme Classes**

```typescript
const themeClasses = getPortalThemeClasses('customer');

// Use in components
<Button className={themeClasses.button.primary}>
  Primäre Aktion
</Button>

<Card className={themeClasses.card}>
  Card Content
</Card>
```

**Returns:**

```typescript
{
  button: {
    primary: string;
    outline: string;
    ghost: string;
  }
  card: string;
  background: string;
  text: string;
}
```

---

### **4. Apply Portal Theme**

```typescript
const buttonClasses = applyPortalTheme('driver', {
  button: true,
  card: false,
});

<Button className={buttonClasses}>
  Action
</Button>
```

---

## 🎯 COMPONENT INTEGRATION

### **Example: UniversalDownload**

```typescript
<UniversalDownload
  type="csv"
  data={data}
  portal="customer" // Automatically applies Customer Portal theme
/>
```

**Internal Implementation:**

```typescript
className={cn(
  'gap-2',
  // Portal-Specific Theming
  portal === 'customer' && 'bg-[#EADEBD] hover:bg-[#D4C9A8] text-gray-900',
  portal === 'driver' && 'bg-purple-600 hover:bg-purple-700 text-white',
  className
)}
```

---

### **Example: UniversalUpload**

```typescript
<UniversalUpload
  accept={['image/*']}
  maxSize={5}
  portal="driver" // Automatically applies Driver Portal theme
  onUpload={uploadFiles}
/>
```

---

### **Example: Custom Component**

```typescript
import { getPortalThemeClasses } from '@/config/portal-themes';

function CustomComponent({ portal }: { portal: PortalType }) {
  const theme = getPortalThemeClasses(portal);

  return (
    <div>
      <Button className={theme.button.primary}>
        Primäre Aktion
      </Button>

      <Card className={theme.card}>
        <CardContent>
          Portal-spezifischer Content
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 🎨 THEME CUSTOMIZATION

### **Per-Company Customization (Customer Portal)**

```typescript
// For Kundenportal: Primary Color kann per Company angepasst werden!
const customTheme = {
  ...PORTAL_THEMES.customer,
  primaryColor: companySettings.primaryColor || "#EADEBD",
};
```

**Use Case:** Jedes Unternehmen kann im Kundenportal seine eigene Brand-Farbe setzen.

---

## 📋 THEME STRUCTURE

```typescript
interface PortalTheme {
  name: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  layout: "sidebar" | "minimal" | "mobile-first";
  buttonStyle: {
    default: string;
    hover: string;
    active: string;
  };
  cardStyle: {
    background: string;
    border: string;
    shadow: string;
  };
}
```

---

## 🚨 CRITICAL RULES

### **❌ VERBOTEN:**

```typescript
// ❌ Hardcoded Portal-Theming
<Button className="bg-blue-600 text-white">
  Entrepreneur Action
</Button>

<Button className="bg-[#EADEBD] text-gray-900">
  Customer Action
</Button>

// ❌ Custom Portal-Theming außerhalb Registry
const customTheme = { primaryColor: '#FF0000' }; // FALSCH!
```

### **✅ RICHTIG:**

```typescript
// ✅ Portal-Theming aus Registry
<Button className={getPortalThemeClasses('entrepreneur').button.primary}>
  Entrepreneur Action
</Button>

<UniversalDownload portal="customer" type="csv" data={data} />

// ✅ Theme-Customization via Registry
const theme = getPortalTheme('customer');
```

---

## 🔄 NEUE PORTAL HINZUFÜGEN

### **1. Theme Definition**

```typescript
// src/config/portal-themes.ts
export const PORTAL_THEMES: Record<PortalType, PortalTheme> = {
  // ... bestehende Portale

  // Neues Portal
  admin: {
    name: "Admin-Portal",
    primaryColor: "#DC2626", // Red
    accentColor: "#F59E0B", // Orange
    backgroundColor: "#F9FAFB",
    textColor: "#111827",
    borderColor: "#E5E7EB",
    layout: "sidebar",
    buttonStyle: {
      default: "bg-red-600 hover:bg-red-700 text-white",
      hover: "hover:bg-red-700",
      active: "active:bg-red-800",
    },
    cardStyle: {
      background: "bg-white",
      border: "border border-red-200",
      shadow: "shadow hover:shadow-lg",
    },
  },
};
```

### **2. Type Update**

```typescript
export type PortalType = "entrepreneur" | "customer" | "driver" | "admin";
```

---

## 🧪 TESTING

```typescript
import { describe, it, expect } from "vitest";
import { getPortalTheme, getPortalThemeClasses } from "@/config/portal-themes";

describe("Portal Themes", () => {
  it("should return correct theme for entrepreneur", () => {
    const theme = getPortalTheme("entrepreneur");
    expect(theme.primaryColor).toBe("#3B82F6");
    expect(theme.layout).toBe("sidebar");
  });

  it("should return correct theme classes", () => {
    const classes = getPortalThemeClasses("customer");
    expect(classes.button.primary).toContain("bg-[#EADEBD]");
  });

  it("should detect dark mode correctly", () => {
    const isDark = isPortalDarkMode("entrepreneur");
    expect(isDark).toBe(false);
  });
});
```

---

## 🎯 SUCCESS CRITERIA

- ✅ **Alle Portale** haben einheitliches Theming
- ✅ **KEINE hardcoded** Portal-Colors
- ✅ **Type-Safe** Theme Access
- ✅ **Einfache Customization** (per Company)
- ✅ **Konsistentes** Button/Card-Styling

---

**LAST UPDATE:** 2025-10-29  
**STATUS:** ✅ Produktionsreif  
**USAGE:** Mandatory für alle Portal-Components
