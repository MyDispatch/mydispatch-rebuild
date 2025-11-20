# 🚀 Deployment-Anleitung für NeXifyAI MASTER Dashboard

## 📋 Voraussetzungen

1. **Vercel Account** mit Zugriff auf `courbois1981@gmail.com`
2. **Supabase Projekt** mit den erforderlichen Tabellen
3. **GitHub Repository** (optional, aber empfohlen)

## 🔧 Schritt 1: Supabase Setup

### 1.1 Migration ausführen

```bash
# Supabase CLI installieren (falls nicht vorhanden)
npm install -g supabase

# Login
supabase login

# Link zum Projekt
supabase link --project-ref your-project-ref

# Migration ausführen
supabase migration up
```

### 1.2 Edge Functions deployen

```bash
# Edge Function deployen
supabase functions deploy nexify-ai-master-command
```

### 1.3 Environment Variables in Supabase

Setze folgende Secrets in Supabase Dashboard:

- `SUPABASE_URL` (automatisch gesetzt)
- `SUPABASE_SERVICE_ROLE_KEY` (für Edge Functions)

## 🔧 Schritt 2: Vercel Deployment

### 2.1 Vercel CLI Setup

```bash
# Vercel CLI installieren
npm install -g vercel

# Login
vercel login
# Email: courbois1981@gmail.com
# Passwort: 1def!xO2022!!
```

### 2.2 Projekt deployen

```bash
cd nexify-ai-master-dashboard

# Initial Deployment
vercel

# Production Deployment
vercel --prod
```

### 2.3 Environment Variables in Vercel

Setze folgende Environment Variables im Vercel Dashboard:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_NEXIFY_MASTER_API_URL=https://your-project.supabase.co/functions/v1
VITE_MASTER_USER_EMAIL=courbois1981@gmail.com
```

**Wichtig:** Nach dem Setzen der Environment Variables, neuen Deployment ausführen!

## 🔧 Schritt 3: GitHub Repository (Optional)

### 3.1 Repository erstellen

```bash
cd nexify-ai-master-dashboard

# Git initialisieren
git init

# Remote hinzufügen
git remote add origin https://github.com/your-username/nexify-ai-master-dashboard.git

# Commit & Push
git add .
git commit -m "Initial commit: NeXifyAI MASTER Dashboard"
git push -u origin main
```

### 3.2 Vercel mit GitHub verbinden

1. Gehe zu Vercel Dashboard
2. Import Project
3. Wähle GitHub Repository
4. Vercel erstellt automatisch Deployments bei jedem Push

## ✅ Verifizierung

Nach dem Deployment sollte das Dashboard verfügbar sein unter:

- **Production:** `https://nexify-ai-master-dashboard.vercel.app`
- **Preview:** Jeder Branch hat eine eigene Preview-URL

## 🔐 Sicherheit

- ✅ RLS (Row Level Security) aktiviert
- ✅ Master-User hat vollen Zugriff
- ✅ Environment Variables in Vercel gesichert
- ✅ Supabase Service Role Key nur in Supabase Secrets

## 📝 Post-Deployment Checklist

- [ ] Dashboard lädt ohne Fehler
- [ ] NeXifyAI MASTER verbindet erfolgreich
- [ ] Chat-Interface funktioniert
- [ ] Projekte werden geladen
- [ ] Forget-Proof System lädt Kontext
- [ ] PWA installierbar
- [ ] Edge Functions funktionieren
- [ ] Environment Variables korrekt gesetzt

## 🐛 Troubleshooting

### Problem: "Supabase credentials missing"

**Lösung:** Prüfe Environment Variables in Vercel Dashboard

### Problem: "Edge Function not found"

**Lösung:** Edge Function deployen: `supabase functions deploy nexify-ai-master-command`

### Problem: "RLS Policy violation"

**Lösung:** Prüfe RLS Policies in Supabase Dashboard

### Problem: "PWA nicht installierbar"

**Lösung:** Prüfe Service Worker und Manifest in `public/` Verzeichnis

---

**Status:** ✅ READY FOR DEPLOYMENT
