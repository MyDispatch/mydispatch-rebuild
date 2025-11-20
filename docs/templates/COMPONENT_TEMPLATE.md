# 🧩 COMPONENT TEMPLATE - MyDispatch

## Standard Component Pattern für alle neuen Components

---

## Template-Struktur

```typescript
/* ==================================================================================
   [COMPONENT NAME] - [KURZBESCHREIBUNG]
   ==================================================================================
   ✅ V26.1 Design System konform
   ✅ UNIFIED_DESIGN_TOKENS verwendet
   ✅ TypeScript strict mode
   ✅ Accessibility (ARIA) berücksichtigt
   ✅ Mobile-first responsive
   ================================================================================== */

import { ReactNode } from 'react';
import { UNIFIED_DESIGN_TOKENS } from '@/lib/design-system/unified-design-tokens';
import { cn } from '@/lib/utils';

// Lucide Icons (falls benötigt)
import { IconName } from 'lucide-react';

// Weitere Imports (V26 Components, UI Components, etc.)
import { V26Button } from '@/components/design-system/V26Button';

/* ==================================================================================
   TYPES & INTERFACES
   ================================================================================== */

interface ComponentNameProps {
  // Required Props
  title: string;
  description: string;
  
  // Optional Props
  icon?: typeof IconName;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  
  // Children / Content
  children?: ReactNode;
  
  // Callbacks
  onClick?: () => void;
  onHover?: () => void;
  
  // Disabled State
  disabled?: boolean;
  
  // Loading State (falls async)
  isLoading?: boolean;
}

/* ==================================================================================
   COMPONENT
   ================================================================================== */

export function ComponentName({
  title,
  description,
  icon: Icon,
  variant = 'primary',
  size = 'md',
  className,
  children,
  onClick,
  onHover,
  disabled = false,
  isLoading = false,
}: ComponentNameProps) {
  
  /* ==================================================================================
     STATE & HOOKS
     ================================================================================== */
  
  // const [isHovered, setIsHovered] = useState(false);
  // const { data, isLoading } = useQuery(...);
  
  /* ==================================================================================
     HELPER FUNCTIONS
     ================================================================================== */
  
  const handleClick = () => {
    if (disabled || isLoading) return;
    onClick?.();
  };
  
  /* ==================================================================================
     COMPUTED VALUES
     ================================================================================== */
  
  const sizeClasses = {
    sm: 'text-sm p-2',
    md: 'text-base p-4',
    lg: 'text-lg p-6',
  };
  
  const variantStyles = variant === 'primary'
    ? {
        backgroundColor: UNIFIED_DESIGN_TOKENS.colors.beige,
        color: UNIFIED_DESIGN_TOKENS.colors.dunkelblau,
      }
    : {
        backgroundColor: UNIFIED_DESIGN_TOKENS.colors.dunkelblau,
        color: UNIFIED_DESIGN_TOKENS.colors.beige,
      };
  
  /* ==================================================================================
     RENDER
     ================================================================================== */
  
  return (
    <div
      className={cn(
        'component-base-class',
        sizeClasses[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      style={variantStyles}
      onClick={handleClick}
      onMouseEnter={onHover}
      role="button"
      aria-label={title}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        {Icon && <Icon className="w-6 h-6" />}
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      
      {/* Description */}
      <p className="text-sm opacity-80 mb-4">{description}</p>
      
      {/* Content */}
      {children}
      
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
          <div className="animate-spin">Loading...</div>
        </div>
      )}
    </div>
  );
}
```

---

## Checklist vor Component-Erstellung

**IMMER vorher prüfen:**
- [ ] COMPONENT_REGISTRY.md gecheckt - Component existiert NICHT
- [ ] filesExplorer.md gecheckt - Pfad korrekt
- [ ] Design System gecheckt - Welche V26 Components kann ich nutzen?
- [ ] UNIFIED_DESIGN_TOKENS importiert (KEINE direkten Farben!)
- [ ] TypeScript interface definiert (KEINE implicit any!)
- [ ] Props sinnvoll strukturiert (required vs. optional)
- [ ] Accessibility berücksichtigt (ARIA, tabIndex, role)
- [ ] Mobile-responsive (className mit responsive Breakpoints)
- [ ] Error Handling vorhanden (disabled, loading states)

---

## Best Practices

### ✅ DO
- **UNIFIED_DESIGN_TOKENS** für alle Farben verwenden
- **V26-Components** wiederverwenden (V26Button, V26Badge, V26IconBox)
- **Explicit Types** für alle Props
- **cn()** für conditional classNames
- **Accessibility** (ARIA labels, keyboard navigation)
- **Error States** handhaben (disabled, loading)
- **Mobile-First** (responsive Breakpoints)

### ❌ DON'T
- Direkte Hex-Werte (#323D5E) → UNIFIED_DESIGN_TOKENS verwenden!
- Tailwind-Color-Classes (text-white) → Semantic Tokens!
- Implicit any Types → Explicit interfaces!
- Fehlende ARIA labels → Accessibility!
- Desktop-Only Design → Mobile-First!
- Keine Error Handling → disabled/loading States!

---

## File-Naming Convention

```
src/components/
├─ design-system/      # V26-Components
│  └─ V26ComponentName.tsx
├─ ui/                 # shadcn/ui
│  └─ component-name.tsx
├─ features/           # Feature-spezifisch
│  ├─ auth/
│  │  └─ LoginForm.tsx
│  └─ dashboard/
│     └─ DashboardWidget.tsx
└─ layout/             # Layout-Components
   └─ MainLayout.tsx
```

---

## Documentation Protocol

**Nach Component-Erstellung:**
1. ✅ In COMPONENT_REGISTRY.md eintragen
   - Path, Props, Status, Purpose
2. ✅ In filesExplorer.md aktualisieren
3. ✅ In CHANGELOG.md eintragen
4. ✅ Barrel Export erstellen (index.ts)
5. ✅ Usage-Example dokumentieren

**Barrel Export Beispiel:**
```typescript
// src/components/design-system/index.ts
export { V26Button } from './V26Button';
export { V26Badge } from './V26Badge';
export { ComponentName } from './ComponentName';
```

---

## Testing Template (zukünftig)

```typescript
import { render, screen } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName title="Test" description="Test Description" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
  
  it('handles click events', () => {
    const onClick = jest.fn();
    render(<ComponentName title="Test" description="Test" onClick={onClick} />);
    screen.getByRole('button').click();
    expect(onClick).toHaveBeenCalled();
  });
  
  it('respects disabled state', () => {
    const onClick = jest.fn();
    render(<ComponentName title="Test" description="Test" onClick={onClick} disabled />);
    screen.getByRole('button').click();
    expect(onClick).not.toHaveBeenCalled();
  });
});
```

---

**LAST UPDATE:** 2025-01-26  
**VERSION:** 1.0  
**STATUS:** ✅ TEMPLATE READY
