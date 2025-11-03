# 🚀 QUICK-ACTIONS REGISTRY GUIDE

**Version:** V1.0  
**Datum:** 2025-10-29  
**Phase:** 3 - Quick-Actions Standardization

---

## 🎯 ÜBERSICHT

Die **Quick-Actions Registry** ist die **EINZIGE Quelle** für alle Quick-Action-Definitionen im gesamten System.

**REGEL:** Jede Page hat **GENAU 2 strategische Quick-Actions!**

---

## 📦 REGISTRY-STRUKTUR

```
src/config/quick-actions-registry.ts
├─ ENTREPRENEUR_QUICK_ACTIONS (14 Pages)
├─ CUSTOMER_QUICK_ACTIONS (2 Pages)
├─ DRIVER_QUICK_ACTIONS (5 Pages)
└─ Helper Functions
```

---

## 🔧 USAGE

### **1. Import Registry**

```typescript
import { 
  getQuickActionsForPage,
  type Portal,
  type QuickAction 
} from '@/config/quick-actions-registry';
```

---

### **2. Get Quick-Actions for Page**

```typescript
const actions = getQuickActionsForPage('entrepreneur', 'auftraege', {
  'create-booking': () => openBookingDialog(),
  'export-bookings': () => exportBookings(),
});
```

**Parameters:**
- `portal`: `'entrepreneur' | 'customer' | 'driver'`
- `page`: Page identifier (e.g., `'auftraege'`, `'kunden'`, `'dashboard'`)
- `handlers`: Object mapping action IDs to handler functions

**Returns:**
```typescript
Array<QuickAction & { onClick: () => void }>
```

---

### **3. Render Quick-Actions**

```typescript
// In PageHeader or similar
{actions.map((action) => (
  <Button
    key={action.id}
    variant={action.variant}
    onClick={action.onClick}
  >
    <action.icon className="h-4 w-4 mr-2" />
    {action.label}
  </Button>
))}
```

---

## 📋 AVAILABLE PORTALS & PAGES

### **Entrepreneur Portal**
- `dashboard` - Dashboard
- `auftraege` - Aufträge
- `kunden` - Kunden
- `fahrer` - Fahrer
- `fahrzeuge` - Fahrzeuge
- `rechnungen` - Rechnungen
- `schichtzettel` - Schichten
- `dokumente` - Dokumente
- `kostenstellen` - Kostenstellen
- `partner` - Partner-Netzwerk
- `statistiken` - Statistiken
- `kommunikation` - Team-Chat
- `office` - E-Mail & Vorlagen
- `einstellungen` - Einstellungen

### **Customer Portal**
- `portal-dashboard` - Dashboard
- `portal-bookings` - Buchungen

### **Driver Portal**
- `driver-dashboard` - Dashboard
- `driver-rides` - Fahrten
- `driver-shifts` - Schichten
- `driver-documents` - Dokumente
- `driver-vehicles` - Fahrzeuge

---

## ✅ EXAMPLE: Aufträge Page

```typescript
// src/pages/Auftraege.tsx
import { useState } from 'react';
import { getQuickActionsForPage } from '@/config/quick-actions-registry';
import { Button } from '@/components/ui/button';

export function AuftraegePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Get Quick-Actions
  const quickActions = getQuickActionsForPage('entrepreneur', 'auftraege', {
    'create-booking': () => setIsDialogOpen(true),
    'export-bookings': () => exportBookings(),
  });
  
  return (
    <div>
      <PageHeader
        title="Aufträge"
        actions={
          <div className="flex gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant={action.variant}
                onClick={action.onClick}
              >
                <action.icon className="h-4 w-4 mr-2" />
                {action.label}
              </Button>
            ))}
          </div>
        }
      />
      
      {/* Page Content */}
    </div>
  );
}
```

---

## 🚨 CRITICAL RULES

### **❌ VERBOTEN:**
```typescript
// ❌ Hardcoded Quick-Actions
<Button onClick={openDialog}>Neuer Auftrag</Button>
<Button onClick={exportData}>Export</Button>

// ❌ Mehr als 2 Quick-Actions
const actions = [action1, action2, action3]; // FALSCH!

// ❌ Custom Quick-Action außerhalb Registry
const customAction = { label: 'Custom', onClick: () => {} }; // FALSCH!
```

### **✅ RICHTIG:**
```typescript
// ✅ Quick-Actions aus Registry
const actions = getQuickActionsForPage('entrepreneur', 'auftraege', {
  'create-booking': openDialog,
  'export-bookings': exportData,
});

// ✅ Genau 2 Actions
actions.length === 2; // KORREKT!

// ✅ Zentral definiert
// Alle Actions in quick-actions-registry.ts
```

---

## 🔄 NEUE QUICK-ACTION HINZUFÜGEN

### **1. Registry erweitern**

```typescript
// src/config/quick-actions-registry.ts
export const ENTREPRENEUR_QUICK_ACTIONS = {
  // ... bestehende Pages
  
  // Neue Page
  'neue-seite': [
    {
      id: 'primary-action',
      label: 'Primäre Aktion',
      icon: Plus,
      variant: 'default' as const,
      description: 'Beschreibung der Aktion',
    },
    {
      id: 'secondary-action',
      label: 'Sekundäre Aktion',
      icon: Download,
      variant: 'outline' as const,
      description: 'Beschreibung der Aktion',
    },
  ],
} as const;
```

### **2. Handler definieren**

```typescript
// In Component
const handlers = {
  'primary-action': () => handlePrimaryAction(),
  'secondary-action': () => handleSecondaryAction(),
};

const actions = getQuickActionsForPage('entrepreneur', 'neue-seite', handlers);
```

---

## 📊 BEST PRACTICES

### **1. Action Naming**
- **Primäre Action:** Immer `create-*` oder `new-*`
- **Sekundäre Action:** Meist `export-*`, `settings`, oder `view-*`

### **2. Icon Selection**
- **Create:** `Plus`, `UserPlus`
- **Export:** `Download`
- **Settings:** `Settings`
- **View:** `List`, `Eye`

### **3. Variant Selection**
- **Primäre Action:** `variant: 'default'` (gefüllt, auffällig)
- **Sekundäre Action:** `variant: 'outline'` (transparent, subtil)

### **4. Handler Functions**
- **Immer async-ready:** Actions können async sein
- **Error Handling:** Fehler in Handlers abfangen
- **Toasts:** Erfolg/Fehler mit Toasts kommunizieren

---

## 🧪 TESTING

```typescript
import { describe, it, expect } from 'vitest';
import { getQuickActionsForPage } from '@/config/quick-actions-registry';

describe('Quick-Actions Registry', () => {
  it('should return exactly 2 actions per page', () => {
    const actions = getQuickActionsForPage('entrepreneur', 'auftraege', {
      'create-booking': () => {},
      'export-bookings': () => {},
    });
    
    expect(actions).toHaveLength(2);
  });
  
  it('should call handler on action click', () => {
    const handler = vi.fn();
    const actions = getQuickActionsForPage('entrepreneur', 'auftraege', {
      'create-booking': handler,
      'export-bookings': () => {},
    });
    
    actions[0].onClick();
    expect(handler).toHaveBeenCalledOnce();
  });
});
```

---

## 🎯 SUCCESS CRITERIA

- ✅ **GENAU 2 Quick-Actions** pro Page
- ✅ **Alle Actions zentral** in Registry
- ✅ **Keine hardcoded** Quick-Actions in Components
- ✅ **Type-Safe** Handler Mapping
- ✅ **Portal-Specific** Actions

---

**LAST UPDATE:** 2025-10-29  
**STATUS:** ✅ Produktionsreif  
**USAGE:** Mandatory für alle Pages
