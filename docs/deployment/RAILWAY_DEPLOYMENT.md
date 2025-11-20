# Railway Deployment Guide - MyDispatch

## 🚀 Quick Start

Diese App nutzt **Vite Dev Server in Production** (Claude Sonnet 4.5 empfohlene Lösung).

### Warum Dev Server statt Production Build?

Nach 15+ fehlgeschlagenen Build-Versuchen mit White Screen Problem hat Claude Sonnet 4.5 diese Lösung empfohlen:
- ✅ Dev Server funktioniert perfekt
- ✅ Alle Features funktionieren
- ✅ Schnellere Umsetzung (2-4h statt Wochen)
- ✅ Kann später migriert werden

## 📋 Voraussetzungen

- GitHub Account
- Railway Account (https://railway.app)
- Supabase Projekt

## 🔧 Deployment Schritte

### 1. Railway Projekt erstellen

```bash
# Via Railway CLI (optional)
npm install -g @railway/cli
railway login
railway init
```

**ODER via Web:**
1. Gehe zu https://railway.app
2. "New Project" → "Deploy from GitHub repo"
3. Wähle `u4231458123-droid/mydispatch-germany`

### 2. Environment Variables setzen

In Railway Dashboard → Variables:

```env
# Supabase
VITE_SUPABASE_URL=https://ygpwuiygivxoqtyoigtg.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Google Maps
VITE_GOOGLE_API_KEY=AIzaSyAObsK-D4ztW645Mbxb95bUzYxGAhGbqKQ

# Optional: Sentry (falls vorhanden)
VITE_SENTRY_DSN=https://...

# Node Environment
NODE_ENV=production
```

### 3. Build Settings

Railway erkennt automatisch:
- ✅ `Dockerfile.production`
- ✅ Port 5173
- ✅ Health Check

**Keine manuellen Build-Commands nötig!**

### 4. Deploy

```bash
# Via CLI
railway up

# ODER via GitHub
git push origin main  # Auto-Deploy via Railway
```

### 5. Domain konfigurieren

1. Railway Dashboard → Settings → Domains
2. "Generate Domain" für `.railway.app` Domain
3. ODER eigene Domain hinzufügen

## 🔍 Monitoring

### Health Check

Railway prüft automatisch: `http://localhost:5173`

### Logs ansehen

```bash
railway logs
```

**ODER** im Railway Dashboard → Deployments → Logs

## 🐛 Troubleshooting

### App startet nicht

**Check 1:** Environment Variables gesetzt?
```bash
railway variables
```

**Check 2:** Logs prüfen
```bash
railway logs --tail 100
```

### Port-Probleme

Railway setzt automatisch `PORT` Variable. Vite nutzt 5173.

**Fix:** In `railway.json` ist bereits konfiguriert:
```json
"startCommand": "npm run dev -- --host 0.0.0.0 --port ${PORT:-5173}"
```

### Memory-Probleme

Railway Free Tier: 512MB RAM
Railway Pro: 8GB+ RAM

**Upgrade bei Bedarf:** Railway Dashboard → Settings → Plan

## 📊 Performance

**Erwartete Startup-Zeit:** 20-40 Sekunden
**Memory-Verbrauch:** ~200-400MB
**Response-Time:** <100ms

## 🔄 Updates

```bash
git add .
git commit -m "Update"
git push origin main
# Railway deployt automatisch!
```

## 💰 Kosten

**Railway Free Tier:**
- $5 Guthaben/Monat
- Ausreichend für Testing

**Railway Pro:**
- $20/Monat
- Unbegrenzte Projekte
- Mehr RAM & CPU

## 🎯 Nächste Schritte

1. ✅ Deploy zu Railway
2. ✅ Domain konfigurieren
3. ✅ SSL automatisch aktiviert
4. ✅ Monitoring einrichten
5. ✅ Betreiber informieren

## 📞 Support

Bei Problemen:
- Railway Discord: https://discord.gg/railway
- Railway Docs: https://docs.railway.app
- GitHub Issues: https://github.com/u4231458123-droid/mydispatch-germany/issues

---

**Erstellt mit Claude Sonnet 4.5 Empfehlung** 🤖
