# 📦 Component Library

> **Component-Dokumentation für MyDispatch**  
> **Version:** 18.5.0  
> **Letzte Aktualisierung:** 2025-01-26

---

## 🎯 Component-Philosophie

### Atomic Design Prinzip

```
Atoms (Button, Input, Icon)
    ↓
Molecules (SearchBar, FormField)
    ↓
Organisms (Navbar, Footer, Card)
    ↓
Templates (DashboardLayout)
    ↓
Pages (Home, Dashboard, Booking)
```

---

## 📁 Component-Struktur

### Verzeichnis-Organisation

```
src/components/
├── ui/                    # Shadcn Base Components (nicht editieren!)
│   ├── button.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   └── ...
├── design-system/         # Custom Design Components
│   ├── Icon.tsx          # Zentrale Icon-Komponente
│   ├── MarketingButton.tsx
│   └── ...
└── shared/               # Shared Business Components
    ├── Navbar.tsx
    ├── Footer.tsx
    ├── FeatureIconBox.tsx
    └── ...
```

---

## 🔘 UI Components (Shadcn)

### Button

**Location:** `src/components/ui/button.tsx`

```tsx
import { Button } from '@/components/ui/button';

// Variants
<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">🔍</Button>

// States
<Button disabled>Disabled</Button>
<Button loading>Loading...</Button>
```

### Input

```tsx
import { Input } from '@/components/ui/input';

<Input 
  type="text" 
  placeholder="Enter text..."
  className="max-w-sm"
/>

<Input 
  type="email" 
  placeholder="Email"
  required
/>
```

### Dialog (Modal)

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Modal</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Modal Title</DialogTitle>
      <DialogDescription>
        Modal description text.
      </DialogDescription>
    </DialogHeader>
    {/* Content */}
  </DialogContent>
</Dialog>
```

### Select

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### Toast (Notifications)

```tsx
import { useToast } from '@/hooks/use-toast';

const { toast } = useToast();

// Success
toast({
  title: "Success",
  description: "Action completed successfully.",
});

// Error
toast({
  title: "Error",
  description: "Something went wrong.",
  variant: "destructive",
});

// Warning
toast({
  title: "Warning",
  description: "Please check your input.",
});
```

---

## 🎨 Design System Components

### Icon (PFLICHT!)

**Location:** `src/components/design-system/Icon.tsx`

```tsx
import { Icon } from '@/components/design-system/Icon';

// ✅ RICHTIG - Über Icon-Komponente
<Icon name="Check" className="text-foreground" />
<Icon name="AlertCircle" className="text-muted-foreground" />

// ❌ FALSCH - Direkte Lucide-Imports
import { Check } from 'lucide-react';
<Check className="text-green-500" /> // VERBOTEN!
```

**Erlaubte Farben:**
- `text-foreground` (Standard)
- `text-muted-foreground` (Sekundär)
- `text-primary` (Akzent)
- `text-background` (Auf dunklen BGs)

### MarketingButton

**Location:** `src/components/design-system/MarketingButton.tsx`

```tsx
import { MarketingButton } from '@/components/design-system/MarketingButton';

// Hero-Section Buttons
<MarketingButton marketingVariant="hero-primary">
  Jetzt starten
</MarketingButton>

<MarketingButton marketingVariant="hero-secondary">
  Mehr erfahren
</MarketingButton>

// CTA-Section Buttons
<MarketingButton marketingVariant="cta-primary">
  Kostenlos testen
</MarketingButton>

<MarketingButton marketingVariant="cta-secondary">
  Demo buchen
</MarketingButton>
```

**Varianten:**
- `hero-primary` - Hero-Hauptbutton
- `hero-secondary` - Hero-Sekundärbutton
- `cta-primary` - CTA-Hauptbutton
- `cta-secondary` - CTA-Sekundärbutton

---

## 🔲 Shared Components

### FeatureIconBox

**Location:** `src/components/shared/FeatureIconBox.tsx`

```tsx
import { FeatureIconBox } from '@/components/shared/FeatureIconBox';
import { Car } from 'lucide-react';

<FeatureIconBox 
  icon={Car} 
  size="md" 
  className="mb-4"
/>
```

**Design:**
- `bg-secondary` (Blauer Hintergrund)
- `text-primary-foreground` (Helles Icon)
- Hover: `bg-secondary/90`
- Shadow: `shadow-md`

### Navbar

**Location:** `src/components/shared/Navbar.tsx`

```tsx
import { Navbar } from '@/components/shared/Navbar';

<Navbar />
```

**Features:**
- Responsive (Mobile: Hamburger-Menu)
- Logo + Navigation-Links
- CTA-Button (Login/Register)

### Footer

**Location:** `src/components/shared/Footer.tsx`

```tsx
import { Footer } from '@/components/shared/Footer';

<Footer />
```

**Features:**
- Impressum, Datenschutz, AGB (TMG-Pflicht!)
- Copyright-Hinweis
- Social-Media-Links

---

## 📝 Form Components

### Form mit React Hook Form

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input 
          {...register('email')} 
          placeholder="Email"
          type="email"
        />
        {errors.email && (
          <p className="text-status-error text-sm mt-1">
            {errors.email.message}
          </p>
        )}
      </div>
      
      <div>
        <Input 
          {...register('password')} 
          placeholder="Password"
          type="password"
        />
        {errors.password && (
          <p className="text-status-error text-sm mt-1">
            {errors.password.message}
          </p>
        )}
      </div>
      
      <Button type="submit">Login</Button>
    </form>
  );
}
```

---

## 🎯 Layout Components

### Container

```tsx
function Container({ children, className = '' }) {
  return (
    <div className={`container mx-auto px-4 sm:px-6 md:px-8 ${className}`}>
      {children}
    </div>
  );
}
```

### Grid

```tsx
function Grid({ children, cols = 3 }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${cols} gap-6`}>
      {children}
    </div>
  );
}
```

---

## 📊 Data Display Components

### Card

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text.</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here.</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Table

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map((row) => (
      <TableRow key={row.id}>
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.email}</TableCell>
        <TableCell>
          <Button size="sm">Edit</Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

## 🚨 Component-Regeln

### DO's ✅

1. **Semantic Tokens verwenden**
   ```tsx
   className="text-foreground bg-background"
   ```

2. **Icon-Komponente nutzen**
   ```tsx
   <Icon name="Check" className="text-foreground" />
   ```

3. **Mobile-First Spacing**
   ```tsx
   className="p-4 sm:p-6 md:p-8"
   ```

4. **Touch-Targets ≥ 44px**
   ```tsx
   <Button className="min-h-[44px] min-w-[44px]">
   ```

### DON'Ts ❌

1. **Keine direkten Farben**
   ```tsx
   className="text-white bg-black" // FALSCH!
   ```

2. **Keine direkten Lucide-Imports**
   ```tsx
   import { Check } from 'lucide-react'; // FALSCH!
   ```

3. **Keine Inline-Styles**
   ```tsx
   style={{ backgroundColor: '#eadebd' }} // FALSCH!
   ```

4. **Keine Custom-Button-Styles**
   ```tsx
   <button className="bg-[#eadebd]"> // FALSCH!
   ```

---

## ✅ Component Checklist

Vor jedem Commit:

```
[ ] Semantic Tokens verwendet (keine direkten Farben)
[ ] Icon-Komponente genutzt (keine direkten Lucide-Imports)
[ ] Mobile-First Spacing (gap-3 sm:gap-4)
[ ] Touch-Targets ≥ 44px
[ ] TypeScript-Typisierung vollständig
[ ] Props dokumentiert (TSDoc)
[ ] Accessibility geprüft (ARIA)
```

---

## 📚 Weitere Ressourcen

- [Design System](./Design-System.md) - Design-Tokens & Guidelines
- [Coding Standards](../03-DEVELOPMENT/Coding-Standards.md) - Code-Style
- [Shadcn/UI Docs](https://ui.shadcn.com/) - Offizielle Shadcn-Doku

---

## 📝 Changelog

### V18.5.0 (2025-01-26)
- Erstversion Component Library
- Alle UI-Components dokumentiert
- Design-System-Components integriert
- Best Practices & Checklists hinzugefügt

---

**KRITISCH:** Diese Component-Guidelines sind SYSTEMWEIT und AUSNAHMSLOS zu befolgen.
