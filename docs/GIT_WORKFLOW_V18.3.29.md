# 🔀 GIT WORKFLOW V18.3.29

## MyDispatch - Version Control Standards

**Status:** Production-Ready  
**Letzte Aktualisierung:** 2025-10-21  
**Verantwortlich:** Senior Systemarchitekt  
**Klassifizierung:** Intern - Entwicklungsvorgabe

---

## 🎯 ZWECK

Dieses Dokument definiert den **verbindlichen Git-Workflow** für MyDispatch. Alle Code-Contributions MÜSSEN diesem Workflow folgen.

**Ziel:** Maximale Code-Qualität, Nachvollziehbarkeit, Teamwork-Effizienz.

---

## 🌳 BRANCHING-STRATEGIE (GitHub Flow)

### Branch-Typen

```
main (protected)
├── develop (default branch)
│   ├── feature/orders-filter
│   ├── feature/invoice-pdf-generation
│   ├── bugfix/xss-vulnerability
│   └── hotfix/critical-auth-issue
```

---

### Branch-Namen-Konvention

```bash
# Feature Branches
feature/descriptive-name
feature/AUTH-123-user-login  # mit Ticket-Nummer

# Bugfix Branches
bugfix/descriptive-name
bugfix/MYDISP-456-table-overflow

# Hotfix Branches (für Production)
hotfix/critical-issue-name
hotfix/security-patch-xss

# Dokumentation
docs/update-readme
docs/api-documentation

# Refactoring
refactor/component-structure
refactor/simplify-validation
```

**Regeln:**

- Kleinbuchstaben + Bindestriche (kebab-case)
- Präfix: `feature/`, `bugfix/`, `hotfix/`, `docs/`, `refactor/`
- Beschreibend, aber kurz (max. 50 Zeichen)
- Optional: Ticket-Nummer

---

## 📝 COMMIT-MESSAGE-STANDARDS (Conventional Commits)

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

---

### Types

| Type       | Verwendung               | Beispiel                                   |
| ---------- | ------------------------ | ------------------------------------------ |
| `feat`     | Neues Feature            | `feat(orders): add filter by status`       |
| `fix`      | Bugfix                   | `fix(auth): resolve session timeout issue` |
| `docs`     | Dokumentation            | `docs(readme): update installation steps`  |
| `style`    | Code-Formatierung        | `style(button): fix indentation`           |
| `refactor` | Code-Umstrukturierung    | `refactor(validation): simplify schema`    |
| `perf`     | Performance-Optimierung  | `perf(queries): add index on orders table` |
| `test`     | Tests hinzufügen/ändern  | `test(orders): add unit tests for filter`  |
| `build`    | Build-System             | `build(deps): upgrade react to 18.3`       |
| `ci`       | CI/CD                    | `ci(github): add automated testing`        |
| `chore`    | Wartungsarbeiten         | `chore(deps): update dependencies`         |
| `revert`   | Commit rückgängig machen | `revert: revert feat(orders)`              |

---

### Scope (optional)

**Module/Komponente:**

- `auth`, `orders`, `dashboard`, `invoices`
- `validation`, `sanitize`, `utils`
- `ui`, `design-system`

---

### Subject

**Regeln:**

- Imperativ, Präsens: "add", nicht "added" oder "adds"
- Kleinbuchstaben (außer Eigennamen)
- Kein Punkt am Ende
- Max. 50 Zeichen

**Beispiele:**

```
✅ feat(orders): add export to CSV functionality
✅ fix(auth): resolve token refresh race condition
✅ docs(api): document invoice endpoints
✅ refactor(validation): extract common schemas
❌ Added new feature
❌ Fix bug.
❌ Updated the invoice table component with new columns and styling
```

---

### Body (optional, empfohlen)

**Verwendung:**

- Erkläre das "Warum", nicht das "Was"
- Max. 72 Zeichen pro Zeile
- Leerzeile nach Subject

**Beispiel:**

```
fix(orders): prevent duplicate order creation

The order creation endpoint was missing a uniqueness check,
allowing users to create duplicate orders by double-clicking
the submit button.

This fix adds client-side debouncing and server-side validation
to prevent duplicate order_numbers.
```

---

### Footer (optional)

**Breaking Changes:**

```
feat(api): change invoice endpoint response format

BREAKING CHANGE: The invoice API now returns `total_amount` instead of `amount`.
Update all API consumers to use the new field name.
```

**Issue References:**

```
fix(auth): resolve session timeout

Closes #123
Refs #456
```

---

### Vollständige Beispiele

```bash
# Feature
feat(invoices): add PDF download functionality

Implements PDF generation using jsPDF library.
Users can now download invoices directly from the table.

Closes #234

# Bugfix
fix(dashboard): correct KPI calculation for revenue

The revenue KPI was including cancelled orders.
This fix filters out cancelled orders from the calculation.

Fixes MYDISP-123

# Refactoring
refactor(validation): consolidate order schemas

Extracted common validation logic into reusable schemas
to reduce code duplication across order-related forms.

# Documentation
docs(api): document authentication flow

Added detailed documentation for JWT-based authentication,
including token refresh and logout procedures.

# Performance
perf(queries): optimize invoice list query

Added composite index on (customer_id, invoice_date)
to speed up filtered invoice queries.

Query time reduced from 450ms to 120ms.
```

---

## 🔄 WORKFLOW-PROZESS

### 1. Feature-Entwicklung

```bash
# 1. Sync mit develop
git checkout develop
git pull origin develop

# 2. Neuen Feature-Branch erstellen
git checkout -b feature/invoice-pdf-download

# 3. Entwicklung (mehrere Commits möglich)
git add src/components/invoices/
git commit -m "feat(invoices): implement PDF generator"

git add tests/invoices/
git commit -m "test(invoices): add PDF generation tests"

# 4. Push zu Remote
git push origin feature/invoice-pdf-download

# 5. Pull Request erstellen (auf GitHub)
# Siehe "Pull Request Guidelines" unten
```

---

### 2. Pull Request (PR) Guidelines

**PR-Titel:**

- Gleiche Konvention wie Commit-Messages
- Beispiel: `feat(invoices): add PDF download functionality`

**PR-Beschreibung (Template):**

```markdown
## Was wurde geändert?

Beschreibung der Änderungen

## Warum?

Begründung/Business-Value

## Wie testen?

1. Schritt 1
2. Schritt 2

## Checkliste

- [ ] Tests geschrieben
- [ ] Dokumentation aktualisiert
- [ ] Code-Review durchgeführt
- [ ] Design-System-konform
- [ ] Accessibility geprüft
- [ ] Mobile getestet

## Screenshots (falls UI-Änderung)

[Screenshots hier einfügen]

Closes #123
```

---

### 3. Code-Review-Prozess

**Reviewer-Checkliste:**

- [ ] Code folgt Coding-Standards (docs/CODING_STANDARDS_V18.3.29.md)
- [ ] Komponenten verwenden Design-System
- [ ] Input-Validation & Sanitization vorhanden
- [ ] Tests vorhanden und passing
- [ ] Keine Console-Logs (außer in catch-Blöcken)
- [ ] Keine `any` Types
- [ ] Performance-Implikationen geprüft
- [ ] Accessibility berücksichtigt

**Approval-Regel:**

- Mindestens 1 Approval vor Merge
- CI/CD Pipeline muss grün sein

---

### 4. Merge-Strategie

```bash
# Merge-Optionen (je nach Situation):

# 1. Merge Commit (Standard für Feature-Branches)
git checkout develop
git merge --no-ff feature/invoice-pdf-download
git push origin develop

# 2. Squash Merge (für viele kleine Commits)
git merge --squash feature/invoice-pdf-download
git commit -m "feat(invoices): add PDF download functionality"

# 3. Rebase (für kleine, atomare Changes)
git checkout feature/invoice-pdf-download
git rebase develop
git push --force-with-lease
```

**Empfehlung für MyDispatch:**

- **Features:** Squash Merge (saubere History)
- **Bugfixes:** Merge Commit (Traceability)
- **Hotfixes:** Direct Merge (Schnelligkeit)

---

## 🚨 HOTFIX-PROZESS

```bash
# 1. Von main branchen (nicht develop!)
git checkout main
git pull origin main
git checkout -b hotfix/critical-xss-fix

# 2. Fix implementieren
git add src/lib/sanitize.ts
git commit -m "fix(security): patch XSS vulnerability"

# 3. Testen
npm run test
npm run build

# 4. Merge zu main UND develop
git checkout main
git merge --no-ff hotfix/critical-xss-fix
git push origin main

git checkout develop
git merge --no-ff hotfix/critical-xss-fix
git push origin develop

# 5. Tag erstellen (Version Bump)
git tag -a v18.3.30 -m "Hotfix: XSS vulnerability patch"
git push origin v18.3.30

# 6. Hotfix-Branch löschen
git branch -d hotfix/critical-xss-fix
git push origin --delete hotfix/critical-xss-fix
```

---

## 🏷️ TAGGING & RELEASES

### Semantic Versioning

```
MAJOR.MINOR.PATCH

v18.3.29

MAJOR: Breaking Changes
MINOR: New Features (backward-compatible)
PATCH: Bugfixes (backward-compatible)
```

---

### Release-Prozess

```bash
# 1. Prepare Release
git checkout develop
git pull origin develop

# 2. Update Version (package.json, CHANGELOG.md)
npm version minor  # auto-creates tag

# 3. Merge to main
git checkout main
git merge develop
git push origin main
git push origin --tags

# 4. Deploy (via CI/CD)
# Automatic deployment triggered by tag push
```

---

### Release Notes (CHANGELOG.md)

```markdown
## [18.3.29] - 2025-10-21

### Added

- **Invoices:** PDF download functionality (#234)
- **Dashboard:** Real-time KPI updates (#245)
- **Validation:** Comprehensive Zod schemas (#256)

### Fixed

- **Auth:** Session timeout race condition (#267)
- **Orders:** Duplicate order creation bug (#278)

### Changed

- **Design System:** Updated icon colors (#289)
- **Performance:** Optimized invoice queries (#290)

### Deprecated

- None

### Removed

- None

### Security

- **Critical:** XSS vulnerability patched (#301)
```

---

## 🛡️ PROTECTED BRANCHES

### Branch Protection Rules (GitHub)

**`main` Branch:**

- ✅ Require pull request before merging
- ✅ Require approvals (min. 1)
- ✅ Require status checks to pass (CI/CD)
- ✅ Require conversation resolution before merging
- ✅ Require linear history
- ❌ Allow force pushes (NEVER!)
- ❌ Allow deletions

**`develop` Branch:**

- ✅ Require pull request before merging
- ✅ Require status checks to pass
- ✅ Require conversation resolution
- ❌ Allow force pushes (except for maintainers with `--force-with-lease`)

---

## 🚫 ANTI-PATTERNS (VERMEIDEN!)

```bash
# ❌ FALSCH: Direkt auf main/develop committen
git checkout main
git commit -m "quick fix"  # NIEMALS!

# ❌ FALSCH: Force Push auf protected branches
git push --force origin main  # GEFÄHRLICH!

# ❌ FALSCH: Unklare Commit-Messages
git commit -m "fix"
git commit -m "WIP"
git commit -m "test"

# ❌ FALSCH: Zu große Commits (zu viele Dateien)
git commit -am "Refactor everything"

# ❌ FALSCH: Credentials im Repo
git add .env  # NIEMALS Secrets committen!

# ✅ RICHTIG: .gitignore prüfen
cat .gitignore | grep .env
```

---

## 🔧 USEFUL GIT COMMANDS

### Rewrite History (vor Push!)

```bash
# Letzten Commit ändern
git commit --amend -m "fix(auth): correct commit message"

# Letzten Commit zum vorherigen hinzufügen
git add forgotten-file.ts
git commit --amend --no-edit

# Mehrere Commits zusammenfassen (Interactive Rebase)
git rebase -i HEAD~3
# Im Editor: "pick" zu "squash" ändern
```

---

### Stashing (temporäre Änderungen)

```bash
# Änderungen temporär speichern
git stash save "WIP: invoice validation"

# Stash anzeigen
git stash list

# Stash wiederherstellen
git stash pop

# Stash löschen
git stash drop
```

---

### Undoing Changes

```bash
# Unstage file (ohne Änderungen zu verlieren)
git reset HEAD file.ts

# Discard local changes
git checkout -- file.ts

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1  # VORSICHT!

# Revert commit (creates new commit)
git revert <commit-hash>
```

---

## 🔍 CODE-REVIEW-TIPPS

### Als Author

1. **Self-Review:** Prüfe deinen PR selbst zuerst
2. **Small PRs:** Max. 400 Zeilen (besser: 200)
3. **Context:** Erkläre "Warum" im PR-Body
4. **Screenshots:** Bei UI-Änderungen immer!
5. **Tests:** Zeige, dass Tests passing sind

---

### Als Reviewer

1. **Constructive:** Feedback immer konstruktiv formulieren
2. **Ask Questions:** "Warum X statt Y?" statt "X ist falsch"
3. **Nitpicks markieren:** Kennzeichne kleinere Anmerkungen als `nit:`
4. **Approve schnell:** Blockiere nicht unnötig
5. **Code testen:** Checke Branch lokal aus wenn möglich

---

## 🤖 AUTOMATION (GitHub Actions)

### Pre-Commit Hook (.husky/pre-commit)

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Lint-Staged
npm run lint-staged

# Type-Check
npm run type-check

# Prevent direct commits to main/develop
branch="$(git symbolic-ref HEAD 2>/dev/null)" || exit 0
branch=${branch##refs/heads/}

if [ "$branch" = "main" ] || [ "$branch" = "develop" ]; then
  echo "❌ Direct commits to $branch are not allowed!"
  echo "Please create a feature branch."
  exit 1
fi
```

---

### CI/CD Pipeline (.github/workflows/ci.yml)

```yaml
name: CI Pipeline

on:
  pull_request:
    branches: [develop, main]
  push:
    branches: [develop, main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm audit
```

---

## ✅ DAILY WORKFLOW CHECKLISTE

**Morgens:**

- [ ] `git checkout develop`
- [ ] `git pull origin develop`
- [ ] `npm install` (falls package.json geändert)

**Während Entwicklung:**

- [ ] Kleine, atomare Commits
- [ ] Klare Commit-Messages (Conventional Commits)
- [ ] Tests schreiben
- [ ] Self-Review vor Push

**Vor Feierabend:**

- [ ] Alle Änderungen committen oder stashen
- [ ] Branch pushen (Backup!)
- [ ] PR erstellen wenn Feature fertig

---

## 🔗 VERWANDTE DOKUMENTATION

- `docs/CODING_STANDARDS_V18.3.29.md` - Code-Qualität
- `docs/BESTÄTIGUNGS_PROMPT_V18.3.29.md` - Master Prompt
- `.husky/pre-commit` - Pre-Commit Hooks
- `.github/workflows/` - CI/CD Pipelines

---

**END OF DOCUMENT**

_Dieser Git-Workflow ist verbindlich für alle Entwickler im MyDispatch-Projekt._
