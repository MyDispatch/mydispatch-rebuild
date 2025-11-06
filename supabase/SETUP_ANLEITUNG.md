# 🚀 Supabase MyDispatch - Komplette Setup-Anleitung

**Projekt ID:** vsbqyqhzxmwezlhzdmfd  
**Datum:** 6. November 2025

## ✅ Bereits erledigt

- ✓ MCP-Konfiguration erstellt (`.vscode/mcp.json`)
- ✓ SQL-Skript für Master Users vorbereitet
- ✓ Setup-Skripte erstellt

---

## 📋 SCHRITT 1: RESEND_API_KEY konfigurieren

### Manual über Dashboard:

1. **Öffne:** https://supabase.com/dashboard/project/vsbqyqhzxmwezlhzdmfd/settings/functions

2. **Klicke auf:** Tab "Secrets"

3. **Klicke:** "Add new secret"

4. **Eingeben:**
   ```
   Name:  RESEND_API_KEY
   Value: re_WWtdb7JV_DJ9iJU4DJrc7ZLkFufufFxi5
   ```

5. **Klicke:** "Save"

---

## 📋 SCHRITT 2: Master Users erstellen

### Option A: Über SQL-Editor (Empfohlen)

1. **Öffne:** https://supabase.com/dashboard/project/vsbqyqhzxmwezlhzdmfd/sql/new

2. **Kopiere den Inhalt von:**
   ```
   C:\Users\pcour\Desktop\mydispatch-rebuild\supabase\setup_master_users.sql
   ```

3. **Füge ein** und klicke auf "Run"

### Option B: Über PowerShell mit Supabase CLI

```powershell
# Installiere Supabase CLI (falls noch nicht vorhanden)
npm install -g supabase

# Verbinde mit dem Projekt
supabase link --project-ref vsbqyqhzxmwezlhzdmfd

# Führe SQL aus
supabase db push
```

---

## 🔐 Master User Credentials

Nach erfolgreicher Ausführung des SQL-Skripts sind folgende Benutzer verfügbar:

### 1. Pascal Courbois (Primärer Admin)
- **Email:** courbois1981@gmail.com
- **Passwort:** 1def!xO2022!!
- **Rolle:** master

### 2. Pascal Nexify
- **Email:** pascal@nexify.ai
- **Passwort:** 1def!xO2022!!
- **Rolle:** master

### 3. Master Admin
- **Email:** master@nexify.ai
- **Passwort:** 1def!xO2022!!
- **Rolle:** master

---

## ✅ SCHRITT 3: Validierung

### Login testen:

1. **Öffne:** https://vsbqyqhzxmwezlhzdmfd.supabase.co

2. **Login mit:**
   - Email: `courbois1981@gmail.com`
   - Passwort: `1def!xO2022!!`

### Secrets überprüfen:

1. **Öffne:** https://supabase.com/dashboard/project/vsbqyqhzxmwezlhzdmfd/settings/functions

2. **Prüfe:** RESEND_API_KEY ist gesetzt

### Users überprüfen:

1. **Öffne:** https://supabase.com/dashboard/project/vsbqyqhzxmwezlhzdmfd/auth/users

2. **Prüfe:** Alle 3 Master Users sind vorhanden

---

## 📝 Konfigurationsdateien

Alle relevanten Dateien befinden sich in:
```
C:\Users\pcour\Desktop\mydispatch-rebuild\supabase\
```

- `setup_master_users.sql` - SQL für Master User Erstellung
- `.env.setup` - Umgebungsvariablen für Referenz
- `run_setup.ps1` - PowerShell Setup-Skript

---

## 🔗 Wichtige Links

| Funktion | URL |
|----------|-----|
| **Dashboard** | https://supabase.com/dashboard/project/vsbqyqhzxmwezlhzdmfd |
| **SQL Editor** | https://supabase.com/dashboard/project/vsbqyqhzxmwezlhzdmfd/sql/new |
| **Auth Users** | https://supabase.com/dashboard/project/vsbqyqhzxmwezlhzdmfd/auth/users |
| **Functions** | https://supabase.com/dashboard/project/vsbqyqhzxmwezlhzdmfd/settings/functions |
| **API Docs** | https://supabase.com/dashboard/project/vsbqyqhzxmwezlhzdmfd/api |

---

## 🎯 Nächste Schritte

Nach erfolgreichem Setup:

1. ✅ Teste Login mit allen 3 Master Accounts
2. ✅ Konfiguriere Email-Templates in Resend
3. ✅ Teste Email-Versand über Edge Functions
4. ✅ Richte RLS-Policies ein
5. ✅ Deploye Edge Functions

---

## 📞 Support

**Projekt:** MyDispatch Rebuild  
**Branch:** feature/nexify-ai-autonomous-build-session-2025-11-05  
**Resend Domain:** send.nexify-automate.com
