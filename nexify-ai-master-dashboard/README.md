# 🚀 NeXifyAI MASTER Dashboard

Eigenständiges Dashboard für NeXifyAI MASTER Bot mit vollumfänglicher Integration, Forget-Proof System und allen erforderlichen Funktionen.

## 🎯 Features

- ✅ **NeXifyAI MASTER Integration** - Vollumfängliche Verbindung zum Cloud Agent
- ✅ **Forget-Proof System** - Niemals vergessendes Gedächtnis
- ✅ **Chat-Interface** - Direkte Kommunikation mit NeXifyAI MASTER
- ✅ **Projekt-Management** - Alle Projekte im Überblick
- ✅ **Admin-Panel** - Vollständige System-Verwaltung
- ✅ **PWA** - Als Desktop-App installierbar
- ✅ **Real-time Updates** - Echtzeit-Status-Updates

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Environment Variables

Erstelle eine `.env.local` Datei:

```bash
cp .env.example .env.local
```

Fülle die Umgebungsvariablen aus:
- `VITE_SUPABASE_URL` - Deine Supabase Project URL
- `VITE_SUPABASE_ANON_KEY` - Dein Supabase Anon Key

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## 📁 Projekt-Struktur

```
nexify-ai-master-dashboard/
├── src/
│   ├── components/      # React Komponenten
│   ├── pages/          # Seiten
│   ├── lib/            # Utilities & API Clients
│   ├── hooks/          # Custom Hooks
│   └── types/          # TypeScript Types
├── supabase/           # Supabase Migrations & Functions
└── public/             # Statische Assets
```

## 🗄️ Database

Das Dashboard nutzt ein getrenntes Schema (`nexify_ai_master_dashboard`) im gleichen Supabase-Projekt.

### Migration ausführen

```bash
# Supabase CLI
supabase migration up
```

## 🔧 Integration

### NeXifyAI MASTER

Das Dashboard kommuniziert mit NeXifyAI MASTER über:
- Supabase Edge Functions
- Real-time Subscriptions
- REST API

### Forget-Proof System

Automatisches Laden des vollständigen Kontexts bei jedem Start:
- Alle Projekte
- Global Knowledge
- CRM-Daten
- Projekt-History

## 📱 PWA

Das Dashboard ist als PWA installierbar:
- Installierbar auf Desktop
- Offline-Funktionalität
- Service Worker für Caching

## 🚀 Deployment

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables in Vercel

Setze die gleichen Environment Variables wie in `.env.local` in der Vercel-Konfiguration.

## 📝 Credentials

- **Benutzername:** courbois1981@gmail.com
- **Passwort:** 1def!xO2022!!

## 🔒 Sicherheit

- RLS (Row Level Security) aktiviert
- Master-User hat vollen Zugriff
- Alle API-Calls authentifiziert

## 📚 Dokumentation

Siehe `docs/NEXIFYAI_MASTER_DASHBOARD_ANFORDERUNGEN.md` für vollständige Spezifikation.

---

**Status:** ✅ IN DEVELOPMENT  
**Version:** 0.1.0
