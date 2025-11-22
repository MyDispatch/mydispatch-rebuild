# 🎭 Demo-Accounts Anleitung

## Übersicht

MyDispatch verfügt über **2 vollständige Demo-Accounts** für Präsentationen und Tests:

| Account           | Email                        | Passwort          | Tarif    | Limits                |
| ----------------- | ---------------------------- | ----------------- | -------- | --------------------- |
| **Starter Demo**  | demo.starter@my-dispatch.de  | `De.25-STR_#mO_!` | Starter  | 3 Fahrer, 3 Fahrzeuge |
| **Business Demo** | demo.business@my-dispatch.de | `De.BsS_25#mO_!`  | Business | Unbegrenzt            |

---

## 🚀 Schnellstart

### 1. Migration ausführen (bereits erledigt nach Deployment)

```bash
# Migration wurde automatisch deployed via GitHub Integration
# Check: Supabase Dashboard → Database → Migrations
# Datei: 20251122000005_seed_demo_accounts.sql
```

### 2. Auth-User erstellen (EINMALIG nach Migration)

**Option A: Via Edge Function (Empfohlen)**

```bash
# Lokal testen
supabase functions invoke create-demo-users --no-verify-jwt

# Oder via curl (Production)
curl -X POST https://ygpwuiygivxoqtyoigtg.supabase.co/functions/v1/create-demo-users \
  -H "Content-Type: application/json"
```

**Option B: Manuell via Supabase Dashboard**

1. Supabase Dashboard → Authentication → Users → Add user
2. **Starter Account:**
   - Email: `demo.starter@my-dispatch.de`
   - Password: `De.25-STR_#mO_!`
   - Confirm Email: ✅ (Auto-confirm)
   - User Metadata: `{"company_id": "11111111-1111-1111-1111-111111111111"}`
3. **Business Account:**
   - Email: `demo.business@my-dispatch.de`
   - Password: `De.BsS_25#mO_!`
   - Confirm Email: ✅ (Auto-confirm)
   - User Metadata: `{"company_id": "22222222-2222-2222-2222-222222222222"}`

### 3. Login testen

```
URL: https://www.my-dispatch.de/auth
Login mit beiden Accounts testen
Dashboard sollte entsprechende Demo-Daten anzeigen
```

---

## 📊 Demo-Daten Details

### Starter Demo (demo.starter@my-dispatch.de)

**Firma:** Demo Taxi Starter GmbH (München)

**Feature-Limits:**

- ✅ Max. 3 Fahrer (aktuell: 2)
- ✅ Max. 3 Fahrzeuge (aktuell: 2)
- ✅ Max. 100 Buchungen/Monat
- ❌ Kein Kundenportal
- ✅ Basis-Statistiken
- ❌ Kein Finanzmodul

**Demo-Daten:**

- 2 Fahrer: Max Mustermann, Anna Schmidt
- 2 Fahrzeuge: Mercedes E-Klasse (M-AB 1234), VW Passat (M-CD 5678)
- 8 Kunden: Mix aus Privat- und Geschäftskunden
- 15 Buchungen: Verschiedene Status (pending, assigned, in_progress, completed)

**Test-Szenarien:**

1. ✅ Neuen Fahrer hinzufügen (Limit: 3)
2. ⚠️ 4. Fahrer hinzufügen → TariffGuard zeigt Upgrade-Hinweis
3. ✅ Neue Buchung erstellen
4. ✅ Statistiken anschauen (nur Basis-Version)
5. ❌ Finanzmodul nicht verfügbar

---

### Business Demo (demo.business@my-dispatch.de)

**Firma:** Demo Limousinen Service AG (Berlin)

**Feature-Limits:**

- ✅ Unbegrenzte Fahrer (aktuell: 8)
- ✅ Unbegrenzte Fahrzeuge (aktuell: 6)
- ✅ Unbegrenzte Buchungen
- ✅ Kundenportal aktiv
- ✅ Erweiterte Statistiken
- ✅ Vollständiges Finanzmodul

**Demo-Daten:**

- 8 Fahrer: Thomas Müller, Sarah Weber, Michael Schneider, Lisa Fischer, Daniel Wagner, Julia Becker, Sebastian Hoffmann, Laura Koch
- 6 Fahrzeuge: Mercedes S-Klasse, BMW 5er, Mercedes V-Klasse, Audi A6 Avant, Skoda Superb, Mercedes E-Klasse
- 25 Kunden: Mit Kundenportal-Zugang
- 40 Buchungen: Umfangreiche Buchungshistorie

**Test-Szenarien:**

1. ✅ Beliebig viele Fahrer/Fahrzeuge hinzufügen
2. ✅ Erweiterte Statistiken nutzen
3. ✅ Finanzmodul testen
4. ✅ Kundenportal aktivieren
5. ✅ Alle Premium-Features testen

---

## 🔒 Sicherheit

### Passwort-Verwaltung

**⚠️ WICHTIG:** Die Demo-Passwörter sind in dieser Dokumentation sichtbar. Für Production:

1. **Option 1 (Secure):** Passwörter separat speichern (z.B. 1Password, Keeper)
2. **Option 2 (Reset):** Demo-Accounts mit Password-Reset-Link einrichten
3. **Option 3 (Rotation):** Regelmäßig Passwörter ändern (z.B. monatlich)

### Auth-User-Erstellung

**Via Edge Function:** ✅ Empfohlen (Passwörter automatisch gehasht)
**Via Supabase Dashboard:** ✅ Akzeptabel (Passwörter manuell eingeben)
**Via SQL (auth.users):** ❌ **VERBOTEN** (Umgeht Hashing, Security-Risiko)

---

## 🛠️ Wartung

### Demo-Daten zurücksetzen (optional)

Falls Demo-Daten durch Tests verändert wurden:

**Option A: Migration erneut ausführen**

```bash
# 1. Demo-Companies + Daten löschen
DELETE FROM public.bookings WHERE company_id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
DELETE FROM public.customers WHERE company_id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
DELETE FROM public.vehicles WHERE company_id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
DELETE FROM public.drivers WHERE company_id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
DELETE FROM public.profiles WHERE company_id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
DELETE FROM public.companies WHERE id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');

# 2. Migration erneut ausführen
supabase db reset  # Lokal
# Oder via Supabase Dashboard → SQL Editor → 20251122000005_seed_demo_accounts.sql
```

**Option B: Nightly Reset Job (automatisch)**

```sql
-- Supabase Edge Function: nightly-demo-reset.ts
-- Cron: 0 3 * * * (täglich um 03:00 Uhr)
-- Setzt Demo-Daten auf Ausgangszustand zurück
```

---

## 📋 Checklist für Präsentationen

### Vor der Präsentation:

- [ ] Login mit beiden Accounts testen
- [ ] Dashboard lädt korrekt (keine Fehler)
- [ ] Fahrer/Fahrzeuge sichtbar
- [ ] Buchungen anzeigen
- [ ] Statistiken funktionieren

### Starter Demo Highlights:

- [ ] Fahrer hinzufügen (zeigt Limit-Warnung bei 3/3)
- [ ] TariffGuard-Komponente zeigen (Upgrade-Hinweis)
- [ ] Basis-Statistiken zeigen
- [ ] Fehlende Features markieren (Kundenportal, Finanzmodul)

### Business Demo Highlights:

- [ ] Viele Fahrer/Fahrzeuge zeigen
- [ ] Erweiterte Statistiken demonstrieren
- [ ] Kundenportal-Features
- [ ] Finanzmodul nutzen

---

## 🐛 Troubleshooting

### Problem: Login schlägt fehl

**Lösung:**

1. Supabase Dashboard → Authentication → Users prüfen
2. Email-Bestätigung: Muss auf ✅ stehen
3. User Metadata: `company_id` muss gesetzt sein
4. Profiles Tabelle: `user_id` muss mit `auth.users.id` übereinstimmen

### Problem: Dashboard zeigt keine Daten

**Lösung:**

1. SQL Editor: `SELECT * FROM companies WHERE id = '11111111-1111-1111-1111-111111111111';`
2. Wenn leer: Migration erneut ausführen
3. Browser DevTools Console: RLS-Fehler prüfen
4. Supabase Logs: API-Requests checken

### Problem: TariffGuard zeigt nicht

**Lösung:**

1. Prüfen: `useFeatureAccess` Hook funktioniert
2. `feature_limits` JSONB in `companies` Tabelle korrekt?
3. `useAuth().company` gibt Company-Objekt zurück?
4. Browser Console: React Query Cache prüfen

### Problem: Auth-User-Erstellung fehlgeschlagen

**Lösung:**

1. Edge Function Logs: `supabase functions logs create-demo-users`
2. Supabase Dashboard → Authentication → Configuration → Email Auth aktiviert?
3. Service Role Key korrekt in Edge Function Secrets?
4. Alternativ: Manuelle Erstellung via Dashboard (siehe oben)

---

## 📞 Support

Bei Problemen mit Demo-Accounts:

1. **Dokumentation prüfen:** Dieses Dokument + `DEFENSIVE_CODING_STANDARDS.md`
2. **Supabase Logs:** Dashboard → Logs → Database/API/Auth
3. **GitHub Issues:** https://github.com/MyDispatch/mydispatch-rebuild/issues
4. **Master Account:** info@my-dispatch.de (für dringende Fälle)

---

**Version:** 1.0 (2025-11-22)
**Autor:** NeXify AI Agent (Codepilot V33.4)
**Projekt:** MyDispatch V32.5
**Status:** ✅ Production-Ready
