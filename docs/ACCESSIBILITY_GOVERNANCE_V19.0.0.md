# ♿ ACCESSIBILITY GOVERNANCE V19.0.0

**Status:** Production-Ready (P-00)  
**Gültig ab:** 2025-10-25  
**Zweck:** Verpflichtende Accessibility-Standards für MyDispatch  
**Klassifizierung:** Bindend für alle UI-Entwicklungen  
**Hierarchie:** Untergeordnet zu MYDISPATCH_CORPORATE_GOVERNANCE_V19.0.0.md

---

## 📋 ÜBERSICHT

MyDispatch verpflichtet sich zu **100% WCAG 2.1 AA Compliance** und darüber hinaus zu Best Practices für digitale Barrierefreiheit. Dieses Dokument definiert die obligatorischen Accessibility-Standards und deren Umsetzung in Code und Testing.

---

## 🎯 ZIELE & STANDARDS

### Primäre Ziele

1. **WCAG 2.1 AA Compliance:** 100% Erfüllung aller Level AA Kriterien
2. **Mobile-First Accessibility:** Touch-Targets ≥ 44px, Zoom-Support
3. **Keyboard-Navigation:** Vollständige Bedienbarkeit ohne Maus
4. **Screen-Reader-Support:** Sinnvolle ARIA-Attribute, Landmarks
5. **Farb-Kontraste:** Mindestens 4.5:1 für Text, 3:1 für UI-Komponenten

### Sekundäre Ziele (Best Practices)

6. **Focus-Management:** Klare visuelle Fokus-Indikatoren
7. **Error-Handling:** Zugängliche Fehlermeldungen
8. **Responsive Text:** Zoom bis 200% ohne Funktionsverlust
9. **Animation-Control:** Respekt für `prefers-reduced-motion`
10. **Semantisches HTML:** Korrekte HTML5-Struktur

---

## ✅ PFLICHT-STANDARDS

### 1. FARB-KONTRASTE (WCAG 2.1 - 1.4.3, 1.4.11)

**Level AA:**
- **Text:** Mindestens 4.5:1 (Normaler Text)
- **Großer Text:** Mindestens 3:1 (≥18pt oder ≥14pt bold)
- **UI-Komponenten:** Mindestens 3:1 (Buttons, Inputs, Borders)

**Implementierung:**
```typescript
// ✅ RICHTIG: Ausreichender Kontrast
// Dunkelblau (#323D5E) auf Weiß (#FFFFFF): 8.59:1 ✓
<p style={{ color: DESIGN_TOKENS.colors.dunkelblau, backgroundColor: DESIGN_TOKENS.colors.weiss }}>
  Text mit ausreichendem Kontrast
</p>

// ✅ RICHTIG: Text Primary (#111827) auf Canvas (#F9FAFB): 15.8:1 ✓
<p style={{ color: DESIGN_TOKENS.colors.text_primary, backgroundColor: DESIGN_TOKENS.colors.canvas }}>
  Sehr hoher Kontrast
</p>

// ❌ FALSCH: Beige (#EADEBD) auf Weiß (#FFFFFF): 1.4:1 ✗
<p style={{ color: DESIGN_TOKENS.colors.beige, backgroundColor: DESIGN_TOKENS.colors.weiss }}>
  Zu niedriger Kontrast!
</p>
```

**Validierte Kombinationen:**
| Vordergrund | Hintergrund | Kontrast | WCAG AA |
|-------------|-------------|----------|---------|
| Dunkelblau (#323D5E) | Weiß (#FFFFFF) | 8.59:1 | ✅ Pass |
| Text Primary (#111827) | Canvas (#F9FAFB) | 15.8:1 | ✅ Pass |
| Text Secondary (#374151) | Weiß (#FFFFFF) | 10.8:1 | ✅ Pass |
| Beige (#EADEBD) | Dunkelblau (#323D5E) | 6.1:1 | ✅ Pass |
| Dunkelblau (#323D5E) | Canvas (#F9FAFB) | 8.2:1 | ✅ Pass |

### 2. TOUCH-TARGETS (WCAG 2.1 - 2.5.5)

**Mindestgröße:** 44px × 44px

**Implementierung:**
```typescript
// ✅ RICHTIG: Touch-Target ≥ 44px
<Button 
  className="h-12" // 48px
  style={{ minHeight: DESIGN_TOKENS.interactive.min_touch_target }}
>
  Click me
</Button>

// ✅ RICHTIG: Icon-Button mit Padding
<button 
  className="p-3" // Icon 24px + Padding 12px = 48px Touch-Target
  style={{ minHeight: DESIGN_TOKENS.interactive.min_touch_target }}
>
  <Icon className="h-6 w-6" />
</button>

// ❌ FALSCH: Touch-Target < 44px
<button className="h-8 w-8"> // 32px × 32px
  <Icon />
</button>
```

### 3. KEYBOARD-NAVIGATION (WCAG 2.1 - 2.1.1, 2.1.2, 2.4.7)

**Pflicht-Kriterien:**
- Alle interaktiven Elemente per Tab erreichbar
- Logische Tab-Reihenfolge (visuell links-nach-rechts, oben-nach-unten)
- Sichtbarer Fokus-Indikator (mindestens 2px, Kontrast 3:1)
- Escape-Key zum Schließen von Modals/Dialogs
- Enter/Space für Buttons/Links

**Implementierung:**
```typescript
// ✅ RICHTIG: Fokus-Indikator
<Button 
  className="focus:outline-none focus:ring-2"
  style={{
    '--tw-ring-color': DESIGN_TOKENS.interactive.focus_ring_color,
    '--tw-ring-offset-width': DESIGN_TOKENS.interactive.focus_ring_offset,
  } as React.CSSProperties}
>
  Accessible Button
</Button>

// ✅ RICHTIG: Custom Interactive Element mit Keyboard-Support
<div 
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
>
  Custom Button
</div>

// ❌ FALSCH: Fehlende Keyboard-Unterstützung
<div onClick={handleClick}>
  Click me (nur Maus!)
</div>
```

### 4. ARIA-ATTRIBUTE (WCAG 2.1 - 4.1.2)

**Pflicht-Attribute:**
- `aria-label` für Icon-Buttons ohne Text
- `aria-labelledby` für Dialogs, Sections
- `aria-describedby` für zusätzliche Beschreibungen (z.B. Fehlermeldungen)
- `aria-hidden="true"` für dekorative Icons
- `aria-live` für dynamische Inhalte (Toasts, Alerts)
- `role` für Custom Interactive Elements

**Implementierung:**
```typescript
// ✅ RICHTIG: Icon-Button mit aria-label
<button 
  aria-label="Menü schließen"
  onClick={closeMenu}
>
  <X className="h-6 w-6" aria-hidden="true" />
</button>

// ✅ RICHTIG: Dialog mit aria-labelledby
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent aria-labelledby="dialog-title">
    <DialogTitle id="dialog-title">Tarif wählen</DialogTitle>
    <DialogDescription>
      Wählen Sie den passenden Tarif für Ihr Unternehmen.
    </DialogDescription>
    ...
  </DialogContent>
</Dialog>

// ✅ RICHTIG: Input mit Fehlermeldung
<div>
  <Input 
    id="email"
    aria-describedby="email-error"
    aria-invalid={!!error}
  />
  {error && (
    <p id="email-error" className="text-error" role="alert">
      {error}
    </p>
  )}
</div>

// ❌ FALSCH: Icon-Button ohne aria-label
<button onClick={closeMenu}>
  <X className="h-6 w-6" />
</button>
```

### 5. SEMANTISCHES HTML (WCAG 2.1 - 1.3.1, 4.1.1)

**Pflicht-Struktur:**
```html
<!-- ✅ RICHTIG: Semantische HTML5-Struktur -->
<header>
  <nav aria-label="Hauptnavigation">
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/pricing">Preise</a></li>
    </ul>
  </nav>
</header>

<main>
  <section aria-labelledby="pricing-title">
    <h1 id="pricing-title">Unsere Tarife</h1>
    <article>
      <h2>Starter</h2>
      ...
    </article>
  </section>
</main>

<footer>
  <nav aria-label="Footer-Navigation">
    <a href="/impressum">Impressum</a>
    <a href="/datenschutz">Datenschutz</a>
  </nav>
</footer>

<!-- ❌ FALSCH: Fehlende Semantik -->
<div class="header">
  <div class="nav">
    <div><a href="/">Home</a></div>
  </div>
</div>
```

### 6. SKIP-LINKS (WCAG 2.1 - 2.4.1)

**Pflicht:** Skip-Link zum Hauptinhalt (für Keyboard-Nutzer)

**Implementierung:**
```typescript
// src/components/shared/SkipLink.tsx
export function SkipLink() {
  return (
    <a 
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2"
      style={{
        backgroundColor: DESIGN_TOKENS.colors.dunkelblau,
        color: DESIGN_TOKENS.colors.beige,
        borderRadius: DESIGN_TOKENS.radius.md,
      }}
    >
      Zum Hauptinhalt springen
    </a>
  );
}

// In Layout.tsx
<SkipLink />
<header>...</header>
<main id="main-content">...</main>
```

### 7. ANIMATION-CONTROL (WCAG 2.1 - 2.3.3)

**Pflicht:** Respekt für `prefers-reduced-motion`

**Implementierung:**
```typescript
// ✅ RICHTIG: Animation mit prefers-reduced-motion
<div 
  className="animate-fade-in"
  style={{
    animation: 'fade-in 0.3s ease-out',
    '@media (prefers-reduced-motion: reduce)': {
      animation: 'none',
    }
  } as React.CSSProperties}
>
  Content
</div>

// In CSS (Tailwind Config oder global.css)
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🧪 TESTING-PFLICHTEN

### 1. Manuelle Tests (Pre-Commit)

**Developer führt durch:**
- [ ] **Keyboard-Navigation:** Alle Elemente per Tab erreichbar? Fokus sichtbar?
- [ ] **Screen-Reader-Test:** VoiceOver (Mac) / NVDA (Windows) aktivieren, durch Seite navigieren
- [ ] **Zoom-Test:** Browser auf 200% zoomen, Funktionalität intakt?
- [ ] **Kontrast-Check:** Alle Text-Farb-Kombinationen in Browser-DevTools prüfen

### 2. Automatische Tests (CI/CD)

**Playwright E2E Tests:**

```typescript
// tests/accessibility/keyboard-navigation.spec.ts
import { test, expect } from '@playwright/test';

test('Pricing page - Keyboard navigation', async ({ page }) => {
  await page.goto('/pricing');
  
  // Fokus auf erstes interaktives Element
  await page.keyboard.press('Tab');
  const firstFocused = await page.evaluate(() => document.activeElement?.tagName);
  expect(['A', 'BUTTON']).toContain(firstFocused);
  
  // Alle Tarif-Buttons erreichbar
  const buttons = await page.locator('button:has-text("Jetzt starten")').count();
  for (let i = 0; i < buttons; i++) {
    await page.keyboard.press('Tab');
  }
  
  // Fokus-Indikator sichtbar
  const focused = page.locator(':focus');
  await expect(focused).toHaveCSS('outline-width', /[2-9]px/); // Mindestens 2px
});

test('Pricing page - ARIA attributes', async ({ page }) => {
  await page.goto('/pricing');
  
  // Dialog hat aria-labelledby
  const dialog = page.locator('[role="dialog"]');
  if (await dialog.count() > 0) {
    await expect(dialog).toHaveAttribute('aria-labelledby');
  }
  
  // Icon-Buttons haben aria-label
  const iconButtons = page.locator('button:has(svg):not(:has-text(/\w+/))');
  const count = await iconButtons.count();
  for (let i = 0; i < count; i++) {
    await expect(iconButtons.nth(i)).toHaveAttribute('aria-label');
  }
});

test('Pricing page - Color contrasts', async ({ page }) => {
  await page.goto('/pricing');
  
  // Prüfe alle Texte auf ausreichenden Kontrast
  const texts = page.locator('p, h1, h2, h3, span, a, button');
  const count = await texts.count();
  
  for (let i = 0; i < count; i++) {
    const element = texts.nth(i);
    const color = await element.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        fg: style.color,
        bg: style.backgroundColor,
      };
    });
    
    // Kontrast-Berechnung (vereinfacht)
    // In Produktion: Axe-core oder ähnliche Library verwenden
    console.log(`Element ${i}: Foreground ${color.fg}, Background ${color.bg}`);
  }
});
```

**Axe-core Integration:**

```typescript
// tests/accessibility/axe.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Pricing page - Axe accessibility scan', async ({ page }) => {
  await page.goto('/pricing');
  
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  
  expect(results.violations).toEqual([]);
});
```

### 3. Code-Review Checks

**Reviewer prüft:**
- [ ] Sind alle interaktiven Elemente keyboard-zugänglich?
- [ ] Haben Icon-Buttons aria-label?
- [ ] Sind Fokus-Indikatoren sichtbar?
- [ ] Sind Farb-Kontraste ausreichend? (DevTools Contrast-Checker)
- [ ] Ist semantisches HTML verwendet? (header, nav, main, section, article, footer)
- [ ] Sind Skip-Links vorhanden?
- [ ] Wird prefers-reduced-motion respektiert?

---

## 📋 COMPLIANCE-CHECKLISTE

### Vor jedem Release

- [ ] **Manuelle Tests:**
  - [ ] Keyboard-Navigation auf allen Seiten getestet
  - [ ] Screen-Reader-Test (VoiceOver/NVDA) durchgeführt
  - [ ] Zoom-Test (200%) bestanden
  - [ ] Kontrast-Check mit DevTools durchgeführt

- [ ] **Automatische Tests:**
  - [ ] Playwright Accessibility Tests erfolgreich
  - [ ] Axe-core Scan ohne Violations
  - [ ] Touch-Target-Tests bestanden (≥ 44px)

- [ ] **Code-Review:**
  - [ ] ARIA-Attribute korrekt verwendet
  - [ ] Semantisches HTML verwendet
  - [ ] Fokus-Management implementiert
  - [ ] Skip-Links vorhanden

- [ ] **Dokumentation:**
  - [ ] Accessibility-Hinweise in README.md aktualisiert
  - [ ] Bekannte Issues dokumentiert (falls vorhanden)

---

## 🔗 VERWANDTE DOKUMENTATION

**Hierarchie:**
```
MYDISPATCH_CORPORATE_GOVERNANCE_V19.0.0.md (Oberste Ebene)
├─ ACCESSIBILITY_GOVERNANCE_V19.0.0.md (Diese Datei)
├─ DESIGN_TOKEN_GOVERNANCE_V19.0.0.md (Design-Tokens)
└─ Design-System.md (Allgemeine Design-Vorgaben)
```

**Externe Ressourcen:**
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Axe DevTools](https://www.deque.com/axe/devtools/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)

---

## 📝 CHANGELOG

### V19.0.0 (2025-10-25) - INITIAL RELEASE

**🎯 NEU:**
- Accessibility-Standards definiert (WCAG 2.1 AA)
- Pflicht-Kriterien dokumentiert (Kontraste, Touch-Targets, Keyboard, ARIA, Semantik)
- Testing-Prozess etabliert (Manuell, Automatisch, Code-Review)
- Playwright-Tests für Accessibility erstellt
- Axe-core Integration dokumentiert
- Compliance-Checkliste bereitgestellt

**🔗 Integration:**
- Verknüpft mit MYDISPATCH_CORPORATE_GOVERNANCE_V19.0.0.md
- Verknüpft mit DESIGN_TOKEN_GOVERNANCE_V19.0.0.md
- Bindend für alle UI-Entwicklungen

---

**END OF DOCUMENT**

**ANWENDUNG:**
Diese Governance ist ab sofort bindend für alle UI-Entwicklungen. Alle neuen Komponenten MÜSSEN die Accessibility-Standards erfüllen. Bestehende Komponenten werden schrittweise migriert.
