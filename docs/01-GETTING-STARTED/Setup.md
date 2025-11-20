# 🚀 Setup Guide

> **Installation und Konfiguration von MyDispatch**  
> **Version:** 18.5.0  
> **Letzte Aktualisierung:** 2025-01-26

---

## 📋 Voraussetzungen

### System Requirements
- Node.js >= 18.x
- npm oder Bun Package Manager
- Git
- VS Code (empfohlen)

### Accounts (Optional)
- GitHub Account (für CI/CD)
- Supabase Account (für Backend)

---

## 🔧 Installation

### 1. Repository klonen

```bash
git clone https://github.com/yourusername/mydispatch.git
cd mydispatch
```

### 2. Dependencies installieren

```bash
npm install
# oder
bun install
```

### 3. Environment Variables

Erstelle `.env` Datei (wird automatisch von Lovable Cloud bereitgestellt):

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

### 4. Development Server starten

```bash
npm run dev
# oder
bun dev
```

App läuft auf: `http://localhost:8080`

---

## 🧪 Testing Setup

### Playwright installieren

```bash
npm install --save-dev @playwright/test
npx playwright install --with-deps
```

### Tests ausführen

```bash
# E2E Tests
npm run test:e2e

# Compliance Tests
npm run test:compliance

# Alle Tests
npm run test
```

---

## 🎨 VS Code Setup (Empfohlen)

### Extensions installieren

1. **ESLint** - Code Linting
2. **Prettier** - Code Formatting
3. **Tailwind CSS IntelliSense** - Tailwind Autocomplete
4. **TypeScript and JavaScript** - TS Support

### Workspace Settings

Erstelle `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

---

## 🗄️ Database Setup (Supabase)

### Lokale Entwicklung

```bash
# Supabase CLI installieren
npm install -g supabase

# Supabase initialisieren
supabase init

# Lokale DB starten
supabase start
```

### Migrationen anwenden

```bash
# Neue Migration erstellen
supabase migration new your_migration_name

# Migrationen ausführen
supabase db push
```

---

## 🔐 Secrets Management

### GitHub Secrets konfigurieren

Für CI/CD Pipeline:

1. Gehe zu GitHub Repository → Settings → Secrets
2. Füge hinzu:
   - `TEST_USER_EMAIL`
   - `TEST_USER_PASSWORD`

### Lokale Secrets

Nutze `.env.local` für lokale Entwicklung (nicht committen!):

```env
# .env.local
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=test123
```

---

## 📦 Build & Deployment

### Production Build

```bash
npm run build
```

Output: `dist/`

### Preview Production Build

```bash
npm run preview
```

### Deployment

Via Lovable Cloud:
- Automatisches Deployment bei Push zu `main`
- Staging-Umgebung bei Pull Requests

---

## 🐛 Troubleshooting

### "Port 8080 already in use"

```bash
# Linux/Mac
lsof -ti:8080 | xargs kill -9

# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### "Module not found"

```bash
rm -rf node_modules package-lock.json
npm install
```

### Playwright Browser Issues

```bash
npx playwright install --with-deps chromium
```

---

## 🎯 Next Steps

Nach erfolgreichem Setup:

1. [Quick Reference](./Quick-Reference.md) - Häufige Commands
2. [Coding Standards](../03-DEVELOPMENT/Coding-Standards.md) - Code Guidelines
3. [Component Library](../02-ARCHITECTURE/Component-Library.md) - UI Components

---

## 📚 Weitere Ressourcen

- [Lovable Docs](https://docs.lovable.dev)
- [Vite Docs](https://vitejs.dev)
- [Supabase Docs](https://supabase.com/docs)

---

**Fragen? Erstelle ein Issue oder frage im Team-Chat!**
