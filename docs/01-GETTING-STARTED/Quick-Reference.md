# ⚡ Quick Reference

> **Die wichtigsten Commands und Shortcuts**  
> **Version:** 18.5.0  
> **Letzte Aktualisierung:** 2025-01-26

---

## 📦 Package Management

```bash
# Dependencies installieren
npm install

# Dependency hinzufügen
npm install <package>

# Dev Dependency hinzufügen
npm install --save-dev <package>

# Dependencies aktualisieren
npm update

# Veraltete Packages prüfen
npm outdated
```

---

## 🚀 Development

```bash
# Dev Server starten (Port 8080)
npm run dev

# Production Build
npm run build

# Preview Production Build
npm run preview

# Type Check
npm run type-check

# Linting
npm run lint

# Format Code
npm run format
```

---

## 🧪 Testing

```bash
# Alle Tests
npm run test

# E2E Tests
npm run test:e2e

# E2E Tests (headed mode)
npm run test:e2e:ui

# Compliance Tests
npm run test:compliance

# Design Token Check
npm run test:design-tokens

# Specific Test File
npx playwright test tests/e2e/auth.spec.ts
```

---

## 🗄️ Database (Supabase)

```bash
# Lokale DB starten
supabase start

# Lokale DB stoppen
supabase stop

# Migration erstellen
supabase migration new <name>

# Migrationen ausführen
supabase db push

# Migrationen zurückrollen
supabase db reset

# Remote DB Diff
supabase db diff

# Types generieren
supabase gen types typescript --local > src/integrations/supabase/types.ts
```

---

## 🔍 Code Search & Navigation

### VS Code Shortcuts

```
Cmd/Ctrl + P          - Datei öffnen
Cmd/Ctrl + Shift + F  - Globale Suche
Cmd/Ctrl + Click      - Zu Definition springen
F12                   - Zu Definition
Shift + F12           - Alle Referenzen finden
Cmd/Ctrl + .          - Quick Fix
```

### Projekt-weite Suche

```bash
# Alle TODOs finden
grep -r "TODO" src/

# Bestimmtes Pattern finden
grep -r "className.*text-white" src/

# Mit Zeilennummern
grep -rn "useEffect" src/
```

---

## 🎨 Design System

### Semantic Tokens (IMMER verwenden)

```tsx
// ✅ RICHTIG
className="text-foreground bg-background"
className="text-primary bg-primary"

// ❌ FALSCH
className="text-white bg-black"
className="text-[#EADEBD]"
```

### Icon-Komponente

```tsx
// ✅ RICHTIG
<Icon name="Check" className="text-foreground" />

// ❌ FALSCH
import { Check } from 'lucide-react';
<Check className="text-green-500" />
```

### Button-Varianten

```tsx
// Standard Buttons
<Button variant="default">Click</Button>
<Button variant="secondary">Click</Button>
<Button variant="outline">Click</Button>

// Marketing Buttons
<MarketingButton marketingVariant="hero-primary">
  Jetzt starten
</MarketingButton>
```

---

## 📝 Häufige Tasks

### Neue Component erstellen

```bash
# 1. Datei erstellen
touch src/components/ui/MyComponent.tsx

# 2. Template kopieren
cat > src/components/ui/MyComponent.tsx << 'EOF'
import { cn } from '@/lib/utils';

interface MyComponentProps {
  className?: string;
}

export function MyComponent({ className }: MyComponentProps) {
  return (
    <div className={cn("", className)}>
      {/* Content */}
    </div>
  );
}
EOF
```

### Neue Page erstellen

```bash
# 1. Datei erstellen
touch src/pages/MyPage.tsx

# 2. Route hinzufügen in App.tsx
# 3. SEO Head hinzufügen
# 4. Layout wrapper verwenden
```

### Database Table hinzufügen

```bash
# 1. Migration erstellen
supabase migration new add_table_xyz

# 2. SQL schreiben
# 3. RLS Policies definieren
# 4. Migration ausführen
supabase db push

# 5. Types neu generieren
supabase gen types typescript --local > src/integrations/supabase/types.ts
```

---

## 🔥 Hot Commands (täglich verwendet)

```bash
# Dev starten + Test
npm run dev & npm run test:e2e

# Full Check (vor Commit)
npm run type-check && npm run lint && npm run test:design-tokens

# Quick Fix (Format + Lint)
npm run format && npm run lint -- --fix

# DB Reset + Seed
supabase db reset
```

---

## 🐛 Debug Commands

```bash
# React Query DevTools
# Automatisch in Dev Mode verfügbar

# Network Inspector
# Browser DevTools → Network Tab

# React DevTools
# Browser Extension installieren

# Playwright Debug Mode
npx playwright test --debug

# Playwright UI Mode
npx playwright test --ui
```

---

## 📊 Performance

```bash
# Bundle Size analysieren
npm run build
npx vite-bundle-visualizer

# Lighthouse Audit
npm run lighthouse

# Performance Tests
npm run test:performance
```

---

## 🔐 Security

```bash
# Security Audit
npm audit

# Fix Security Issues
npm audit fix

# Supabase Security Linter
supabase test db

# RLS Policies testen
supabase test db --file supabase/tests/rls.test.sql
```

---

## 💡 Pro Tips

### Git Aliases

```bash
# Füge in ~/.gitconfig hinzu:
[alias]
  st = status
  co = checkout
  br = branch
  ci = commit
  unstage = reset HEAD --
  last = log -1 HEAD
```

### NPM Scripts Kombinieren

```bash
# package.json
{
  "scripts": {
    "dev:test": "concurrently \"npm run dev\" \"npm run test:e2e\""
  }
}
```

### VS Code Tasks

Erstelle `.vscode/tasks.json` für Quick Actions.

---

## 📚 Weitere Docs

- [Setup Guide](./Setup.md) - Komplette Installation
- [Coding Standards](../03-DEVELOPMENT/Coding-Standards.md) - Code Guidelines
- [Testing](../03-DEVELOPMENT/Testing.md) - Test Strategy

---

**Fehlt etwas? Erstelle einen PR oder Issue!**
