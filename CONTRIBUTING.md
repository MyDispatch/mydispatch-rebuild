# Contributing to MyDispatch

Thank you for considering contributing to MyDispatch! This document provides guidelines and workflows for contributing to the project.

---

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Commit Guidelines](#commit-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Testing](#testing)
8. [Documentation](#documentation)

---

## 🤝 Code of Conduct

- **Be respectful** and inclusive
- **No harassment** or discriminatory behavior
- **Constructive feedback** only
- **Professional communication** in all interactions

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ (`node --version`)
- **npm** v9+ (`npm --version`)
- **Git** configured (`git config --global user.name "Your Name"`)

### Initial Setup

```bash
# 1. Fork the repository (GitHub UI)
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/mydispatch-rebuild.git
cd mydispatch-rebuild

# 3. Add upstream remote
git remote add upstream https://github.com/MyDispatch/mydispatch-rebuild.git

# 4. Install dependencies
npm install

# 5. Create .env.local from template
cp .env.example .env.local
# Edit .env.local with your API keys

# 6. Start development server
npm run dev
```

### Verify Setup

```bash
# Type check
npm run type-check  # Should have 0 errors

# Linting
npm run lint        # Check ESLint rules

# Build
npm run build       # Should complete successfully

# Tests
npm run test        # Run unit tests
```

---

## 💻 Development Workflow

### 1. Create Feature Branch

```bash
# Always branch from latest master
git checkout master
git pull upstream master

# Create feature branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 2. Make Changes

- Write clean, readable code
- Follow existing patterns
- Add comments for complex logic
- Update types as needed

### 3. Test Locally

```bash
# During development
npm run dev         # Hot reload at localhost:5000

# Before committing
npm run type-check  # TypeScript validation
npm run lint:fix    # Auto-fix ESLint issues
npm run test        # Run unit tests
npm run build       # Ensure production build works
```

### 4. Commit Changes

```bash
git add .
git commit -m "feat: add new feature"  # See Commit Guidelines below
```

### 5. Push to Fork

```bash
git push origin feature/your-feature-name
```

### 6. Open Pull Request

- Go to GitHub
- Click "Compare & pull request"
- Fill out PR template (see below)
- Request review from maintainers

---

## 📝 Coding Standards

### TypeScript

```typescript
// ✅ GOOD: Explicit types, no 'any'
interface BookingData {
  id: string;
  customer_id: string;
  pickup_address: string;
}

function createBooking(data: BookingData): Promise<Booking> {
  // Implementation
}

// ❌ BAD: Implicit any, no types
function createBooking(data) {
  // Implementation
}
```

### React Components

```tsx
// ✅ GOOD: Functional component with typed props
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

export const Button = ({ label, onClick, variant = "primary" }: ButtonProps) => {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {label}
    </button>
  );
};

// ❌ BAD: No props interface, no TypeScript
export const Button = ({ label, onClick, variant }) => {
  // ...
};
```

### Design System V28.1

```tsx
// ✅ GOOD: Use semantic color tokens
<div className="bg-info-light text-info-text border-info-border">
  Information message
</div>

// ❌ BAD: Hardcoded Tailwind colors
<div className="bg-blue-50 text-blue-700 border-blue-200">
  Information message
</div>
```

### Supabase Patterns

```typescript
// ✅ GOOD: Company-scoped query with error handling
const { data, error } = await supabase.from("bookings").select("*").eq("company_id", companyId);

if (error) {
  logError({ message: "Failed to fetch bookings", context: { error } });
  throw error;
}

return data || [];

// ❌ BAD: No company_id filter (security violation)
const { data } = await supabase.from("bookings").select("*");
return data;
```

### Error Handling

```typescript
// ✅ GOOD: Defensive coding with fallbacks
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  logError({ message: "Operation failed", context: { error } });
  toast.error("Operation fehlgeschlagen");
  return null; // Graceful fallback
}

// ❌ BAD: Unhandled promise rejection
const result = await riskyOperation(); // Can crash app
```

---

## 📦 Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation only
- **style**: Code style (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring (no functionality change)
- **perf**: Performance improvement
- **test**: Add/update tests
- **chore**: Build process, dependencies, tooling

### Examples

```bash
# Simple feature
git commit -m "feat: add booking export to Excel"

# Bug fix with scope
git commit -m "fix(Dashboard): correct revenue calculation"

# Breaking change
git commit -m "feat!: migrate to V28.1 Design System

BREAKING CHANGE: All V26 components deprecated.
Migration guide: docs/V28_MIGRATION_GUIDE.md"

# With body
git commit -m "refactor: optimize database queries

- Use indexed columns for filters
- Batch requests where possible
- Add caching for static data

Reduces load time by 40%"
```

---

## 🔀 Pull Request Process

### PR Title Format

Same as commit format:

```
feat(Dashboard): add revenue chart
fix: resolve GPS position memory leak
docs: update README with new prerequisites
```

### PR Description Template

```markdown
## Description

Brief summary of changes.

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?

- [ ] Unit tests (`npm run test`)
- [ ] E2E tests (`npm run test:e2e`)
- [ ] Manual testing (describe scenario)

## Checklist

- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published

## Screenshots (if applicable)

Add screenshots for UI changes.

## Related Issues

Closes #123
Relates to #456
```

### Review Process

1. **Automated Checks**: Must pass (CI, linting, tests)
2. **Code Review**: 1+ approvals from maintainers
3. **Manual Testing**: By reviewer (if UI changes)
4. **Merge**: Squash and merge to master

---

## 🧪 Testing

### Unit Tests (Vitest)

```bash
# Run tests
npm run test

# Watch mode
npm run test:unit:watch

# Coverage
npm run test:coverage
```

#### Example Test

```typescript
// src/lib/utils/__tests__/formatCurrency.test.ts
import { describe, it, expect } from "vitest";
import { formatCurrency } from "../formatCurrency";

describe("formatCurrency", () => {
  it("formats positive amounts correctly", () => {
    expect(formatCurrency(1234.56)).toBe("1.234,56 €");
  });

  it("handles zero", () => {
    expect(formatCurrency(0)).toBe("0,00 €");
  });

  it("handles negative amounts", () => {
    expect(formatCurrency(-99.99)).toBe("-99,99 €");
  });
});
```

### E2E Tests (Playwright)

```bash
# Run E2E tests
npm run test:e2e

# Debug mode
npm run test:e2e:debug

# Headed mode (see browser)
npm run test:e2e:headed
```

#### Example E2E Test

```typescript
// tests/e2e/booking-flow.spec.ts
import { test, expect } from "@playwright/test";

test("create new booking", async ({ page }) => {
  await page.goto("/");
  await page.click('[data-testid="new-booking-button"]');

  await page.fill('[name="customer_name"]', "Max Mustermann");
  await page.fill('[name="pickup_address"]', "Hauptstraße 1");
  await page.click('[data-testid="submit-booking"]');

  await expect(page.locator(".toast-success")).toBeVisible();
});
```

---

## 📚 Documentation

### When to Update Docs

- **New features**: Add to README.md or create new doc in `docs/`
- **API changes**: Update relevant `docs/*.md` files
- **Configuration changes**: Update .env.example + README
- **Breaking changes**: Add migration guide

### Documentation Structure

```
docs/
├── guides/                  # User guides
│   ├── GETTING_STARTED.md
│   └── SECURITY_BEST_PRACTICES.md
├── architecture/            # System design
│   ├── DESIGN_SYSTEM_DOCUMENTATION_V28.1_FINAL.md
│   └── SUPABASE_BACKEND_AUDIT.md
├── API_DOCUMENTATION.md     # API reference
└── CHANGELOG.md             # Version history
```

### Writing Good Docs

- **Clear titles**: Descriptive, action-oriented
- **Code examples**: Show correct vs incorrect patterns
- **Visual aids**: Diagrams, screenshots where helpful
- **Keep updated**: Remove outdated info immediately

---

## 🎯 Quality Standards

### Before Opening PR

```bash
# Full quality check
npm run quality:check

# This runs:
# 1. npm run type-check  (TypeScript validation)
# 2. npm run lint        (ESLint)
# 3. npm run format:check (Prettier)
# 4. npm run test:unit   (Unit tests)
```

### Build Validation

```bash
# Test production build locally
npm run build
npm run preview
# → Visit http://localhost:5000 and test manually
```

---

## 🆘 Getting Help

- **Questions**: Open a GitHub Discussion
- **Bug Reports**: Create an Issue with reproduction steps
- **Feature Requests**: Open an Issue with use case
- **Urgent Issues**: Contact maintainers directly

---

## 👥 Maintainers

- **NeXify Team** (Pascal) - Lead Developer
  - Email: courbois1981@gmail.com
  - GitHub: @MyDispatch

---

## 📜 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for contributing to MyDispatch! 🚀**
