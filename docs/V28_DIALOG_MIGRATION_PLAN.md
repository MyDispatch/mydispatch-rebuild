# 🔄 V28 DIALOG MIGRATION PLAN

> **Erstellt:** 2025-01-28  
> **Zweck:** Systematische Migration aller Dialogs zu V28Dialog  
> **Status:** 📋 PLANNING

---

## 🎯 MISSION

Alle bestehenden Dialog-Komponenten im System zu V28Dialog migrieren.

**Ziel:** 100% V28.1 Compliance für alle Popups/Dialogs

---

## 📊 IST-ANALYSE

### ✅ Bereits V28.1-konform

| Component | Path | Status | Notes |
|-----------|------|--------|-------|
| TariffFeatureDialog | `src/components/pricing/TariffFeatureDialog.tsx` | ✅ V28.1 | Referenz-Implementierung |
| V28Dialog | `src/components/design-system/V28Dialog.tsx` | ✅ V28.1 | Master-Komponente |

### ⏳ Zu migrieren

| Component | Path | Priority | Complexity | Estimated Time |
|-----------|------|----------|------------|----------------|
| DocumentationModal | `src/components/docs/DocumentationModal.tsx` | 🔴 HIGH | LOW | 30min |
| Confirmation Dialogs | Various | 🟡 MEDIUM | LOW | 1-2h |
| Form Dialogs | Various | 🟡 MEDIUM | MEDIUM | 2-3h |
| Custom Modals | Various | 🟠 LOW | VARIES | 3-5h |

---

## 🔍 SEARCH QUERY

Finde alle Dialog-Verwendungen:

```bash
# Suche nach ui/dialog Imports
grep -r "from '@/components/ui/dialog'" src/ --exclude-dir=design-system

# Suche nach Dialog* Komponenten
grep -r "Dialog" src/ --include="*.tsx" --include="*.ts"

# Suche nach Modal-Komponenten
grep -r "Modal" src/ --include="*.tsx"

# Suche nach Radix Dialog Primitive
grep -r "@radix-ui/react-dialog" src/
```

---

## 📋 MIGRATION WORKFLOW

### PHASE 1: DOKUMENTATION (✅ DONE)
- [x] V28Dialog Komponente erstellt
- [x] POPUP_SYSTEM_V28.1.md dokumentiert
- [x] Migration Plan erstellt

### PHASE 2: SEARCH & AUDIT (⏳ TODO)

**Schritt 1:** Alle Dialog-Komponenten finden
```bash
npm run search:dialogs
```

**Schritt 2:** Audit-Liste erstellen
- Datei: `docs/DIALOG_AUDIT_LIST.md`
- Format:
  ```markdown
  | Component | Path | Type | Priority | Notes |
  |-----------|------|------|----------|-------|
  | ... | ... | ... | ... | ... |
  ```

**Schritt 3:** Komplexität bewerten
- LOW: Einfache Dialogs (nur Text, 1-2 Buttons)
- MEDIUM: Mittelkomplexe Dialogs (Forms, Listen)
- HIGH: Komplexe Dialogs (Multi-Step, Tabs, große Content-Bereiche)

### PHASE 3: MIGRATION (⏳ TODO)

**Pro Dialog:**

1. **Backup erstellen**
   ```bash
   cp src/path/to/Component.tsx src/path/to/Component.tsx.backup
   ```

2. **V28Dialog Import**
   ```tsx
   // VORHER
   import { Dialog, DialogContent, DialogHeader, ... } from '@/components/ui/dialog';

   // NACHHER
   import { V28Dialog } from '@/components/design-system/V28Dialog';
   import { V28Button } from '@/components/design-system/V28Button';
   ```

3. **Props Mapping**
   ```tsx
   // VORHER
   <Dialog open={open} onOpenChange={setOpen}>
     <DialogContent>
       <DialogHeader>
         <DialogTitle>Title</DialogTitle>
         <DialogDescription>Description</DialogDescription>
       </DialogHeader>
       <div>Content</div>
       <DialogFooter>
         <Button>Action</Button>
       </DialogFooter>
     </DialogContent>
   </Dialog>

   // NACHHER
   <V28Dialog
     open={open}
     onOpenChange={setOpen}
     title="Title"
     description="Description"
     icon={<IconComponent />}
     actions={
       <V28Button variant="primary" size="lg">
         Action
       </V28Button>
     }
   >
     <div>Content</div>
   </V28Dialog>
   ```

4. **Colors zu PRIMARY_COLORS_V28**
   ```tsx
   // VORHER
   style={{ background: '#F1F5F9', color: '#1E293B' }}

   // NACHHER
   import { PRIMARY_COLORS_V28 } from '@/lib/design-system/unified-design-tokens-v28';
   style={{ background: PRIMARY_COLORS_V28.slate50, color: PRIMARY_COLORS_V28.slate900 }}
   ```

5. **Buttons zu V28Button**
   ```tsx
   // VORHER
   <Button variant="default" size="lg">
     Action
   </Button>

   // NACHHER
   <V28Button variant="primary" size="lg">
     Action
   </V28Button>
   ```

6. **Testing**
   - [ ] Visuell: Alle States (Open, Close, Scroll)
   - [ ] Mobile: Touch-Targets, Responsiveness
   - [ ] Desktop: Layout, Hover-States
   - [ ] Accessibility: Keyboard, Screen Reader
   - [ ] Functionality: Actions funktionieren

7. **Cleanup**
   ```bash
   # Backup löschen (wenn alles funktioniert)
   rm src/path/to/Component.tsx.backup
   ```

8. **Dokumentation**
   - In `DIALOG_AUDIT_LIST.md` als ✅ markieren
   - CHANGELOG.md updaten

### PHASE 4: ENFORCEMENT (⏳ TODO)

**ESLint Rule implementieren:**

```javascript
// .eslintrc.js
{
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '@/components/ui/dialog',
            message: 'Use V28Dialog from @/components/design-system/V28Dialog instead',
          },
        ],
      },
    ],
  },
}
```

**Pre-Commit Hook:**

```bash
#!/bin/bash
# .husky/pre-commit

echo "🔍 Checking Dialog Compliance..."

if grep -r "from '@/components/ui/dialog'" src/ --exclude-dir=design-system --quiet; then
  echo "❌ ERROR: Direct ui/dialog import detected!"
  echo "   Use V28Dialog from @/components/design-system/V28Dialog"
  exit 1
fi

echo "✅ Dialog compliance check passed"
```

### PHASE 5: VERIFICATION (⏳ TODO)

**Final Checks:**
- [ ] Keine ui/dialog Imports mehr (außer in V28Dialog)
- [ ] Alle Dialogs nutzen PRIMARY_COLORS_V28
- [ ] Alle Buttons sind V28Button
- [ ] Mobile-Optimierung geprüft
- [ ] Accessibility geprüft
- [ ] Performance geprüft

---

## 🚀 QUICK MIGRATION SCRIPT

```bash
#!/bin/bash
# migrate-dialog.sh
# Usage: ./migrate-dialog.sh src/path/to/Component.tsx

COMPONENT_PATH=$1

if [ -z "$COMPONENT_PATH" ]; then
  echo "Usage: ./migrate-dialog.sh <component-path>"
  exit 1
fi

echo "🔄 Migrating $COMPONENT_PATH to V28Dialog..."

# Backup
cp "$COMPONENT_PATH" "$COMPONENT_PATH.backup"

# Replace imports
sed -i "s|from '@/components/ui/dialog'|from '@/components/design-system/V28Dialog'|g" "$COMPONENT_PATH"
sed -i "s|from '@/components/ui/button'|from '@/components/design-system/V28Button'|g" "$COMPONENT_PATH"

# Replace component names
sed -i 's|<Dialog|<V28Dialog|g' "$COMPONENT_PATH"
sed -i 's|</Dialog>|</V28Dialog>|g' "$COMPONENT_PATH"
sed -i 's|<Button|<V28Button|g' "$COMPONENT_PATH"
sed -i 's|</Button>|</V28Button>|g' "$COMPONENT_PATH"

echo "✅ Migration done! Please review changes manually."
echo "   Backup saved at: $COMPONENT_PATH.backup"
```

---

## 📊 PROGRESS TRACKING

### Completion Metrics

| Phase | Status | Progress | ETA |
|-------|--------|----------|-----|
| 1. Documentation | ✅ DONE | 100% | - |
| 2. Search & Audit | ⏳ TODO | 0% | 1h |
| 3. Migration | ⏳ TODO | 0% | 5-10h |
| 4. Enforcement | ⏳ TODO | 0% | 2h |
| 5. Verification | ⏳ TODO | 0% | 1h |

**Gesamtfortschritt:** 20% (Phase 1 done)

**Geschätzte Restzeit:** 9-14 Stunden

---

## 🔗 RELATED DOCUMENTS

- [POPUP_SYSTEM_V28.1.md](./POPUP_SYSTEM_V28.1.md)
- [V28.1 Design System](./DESIGN_SYSTEM_V28.1.md)
- [PHASE2_IMPLEMENTATION_CHECKLIST.md](./PHASE2_IMPLEMENTATION_CHECKLIST.md)

---

**Version:** 1.0  
**Last Update:** 2025-01-28  
**Status:** 📋 PLANNING
