# 🔧 MyDispatch Scripts

## Checker CLI

### Installation
```bash
npm install
```

### Usage

**Code Check (specific files):**
```bash
npx tsx scripts/check-code.ts code src/pages/Index.tsx
```

**Code Check (full scan):**
```bash
npx tsx scripts/check-code.ts code
```

**Database Check:**
```bash
npx tsx scripts/check-code.ts db
```

**Full System Check:**
```bash
npx tsx scripts/check-code.ts full
```

### Environment Variables
Required:
- `SUPABASE_URL` (from .env or env variable)
- `SUPABASE_SERVICE_ROLE_KEY` (from Supabase Dashboard)

### NPM Scripts (add to package.json)
```json
{
  "scripts": {
    "check:code": "tsx scripts/check-code.ts code",
    "check:db": "tsx scripts/check-code.ts db",
    "check:full": "tsx scripts/check-code.ts full"
  }
}
```

Then use:
```bash
npm run check:code
npm run check:db
npm run check:full
```

### Exit Codes
- `0`: No critical issues found (or non-blocking warnings)
- `1`: Critical issues found (requires fix before deployment)

---

## CI/CD Integration

The Checker is automatically run in GitHub Actions on every push to `main`/`develop`.

See: `.github/workflows/ci.yml` (Line 32-40)
