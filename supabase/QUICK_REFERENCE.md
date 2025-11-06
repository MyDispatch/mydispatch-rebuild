# 🎯 Supabase MyDispatch - Quick Reference Card

## 🔑 Projekt-Credentials

```
Projekt ID:      vsbqyqhzxmwezlhzdmfd
URL:             https://vsbqyqhzxmwezlhzdmfd.supabase.co
Access Token:    sbp_c7ba28a3d0760fa168bc483b0a8d8b048dfe58a1
```

## 📧 Email-Konfiguration (Resend)

```
API Key:         re_WWtdb7JV_DJ9iJU4DJrc7ZLkFufufFxi5
Domain:          send.nexify-automate.com
Secret Name:     RESEND_API_KEY
```

## 👥 Master Users

| Email | Passwort | Rolle | Name |
|-------|----------|-------|------|
| courbois1981@gmail.com | 1def!xO2022!! | master | Pascal Courbois |
| pascal@nexify.ai | 1def!xO2022!! | master | Pascal Nexify |
| master@nexify.ai | 1def!xO2022!! | master | Master Admin |

## 🚀 Quick Commands

### Setup starten
```powershell
cd C:\Users\pcour\Desktop\mydispatch-rebuild\supabase
.\quick_start.ps1
```

### SQL ausführen
```powershell
# Im Browser öffnen und setup_master_users.sql kopieren
# Oder mit Supabase CLI:
supabase link --project-ref vsbqyqhzxmwezlhzdmfd
supabase db push
```

## 🔗 Dashboard Links

- **Main Dashboard:** https://supabase.com/dashboard/project/vsbqyqhzxmwezlhzdmfd
- **SQL Editor:** https://supabase.com/dashboard/project/vsbqyqhzxmwezlhzdmfd/sql/new
- **Auth Users:** https://supabase.com/dashboard/project/vsbqyqhzxmwezlhzdmfd/auth/users
- **Functions:** https://supabase.com/dashboard/project/vsbqyqhzxmwezlhzdmfd/settings/functions
- **API Docs:** https://supabase.com/dashboard/project/vsbqyqhzxmwezlhzdmfd/api

## 📁 Dateien

```
supabase/
├── setup_master_users.sql       # SQL für Master Users
├── .env.setup                   # Umgebungsvariablen
├── run_setup.ps1               # Setup-Skript
├── quick_start.ps1             # URLs öffnen
├── SETUP_ANLEITUNG.md          # Vollständige Anleitung
└── QUICK_REFERENCE.md          # Diese Datei
```

## ✅ Setup Checklist

- [ ] RESEND_API_KEY Secret gesetzt
- [ ] Master Users SQL ausgeführt
- [ ] Login mit courbois1981@gmail.com getestet
- [ ] Auth Users überprüft
- [ ] Edge Functions konfiguriert
- [ ] Email-Versand getestet

## 🎯 Test Login

1. Öffne: https://vsbqyqhzxmwezlhzdmfd.supabase.co
2. Email: courbois1981@gmail.com
3. Passwort: 1def!xO2022!!

---

**Erstellt:** 6. November 2025  
**Branch:** feature/nexify-ai-autonomous-build-session-2025-11-05
