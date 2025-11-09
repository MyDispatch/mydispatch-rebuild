# Kritische Probleme - Analyse & Lösungen

**Datum:** 09.11.2025  
**Status:** 🔴 IN BEARBEITUNG

---

## 1. Login-Redirect-Problem

**Problem:** Login führt auf `/master` statt `/dashboard`

**Analyse:**
- ✅ `getLoginRedirectRoute()` ist korrekt implementiert (Zeile 172: `return '/dashboard'`)
- ✅ Auth.tsx hat korrekte Master-Check-Logik (Zeilen 270-283)
- ⚠️ **ROOT CAUSE:** User wird fälschlicherweise als Master erkannt

**Mögliche Ursachen:**
1. `user_roles`-Tabelle enthält falsche `role='master'`-Einträge
2. E-Mail-Adresse matched eine der hardcodierten Master-E-Mails
3. Profile.role ist auf 'master' gesetzt

**Lösung:**
```typescript
// Auth.tsx - Zeile 273-276
// VORHER: Zu breite E-Mail-Prüfung
const isMaster = userRoles?.role === 'master' ||
                normalizedEmailForCheck === 'pascal@nexify.ai' ||
                normalizedEmailForCheck === 'master@nexify.ai' ||
                normalizedEmailForCheck === 'courbois1981@gmail.com';

// NACHHER: Nur explizite Master-Rolle aus DB
const isMaster = userRoles?.role === 'master';
```

**Action Items:**
- [ ] Hardcodierte E-Mail-Checks entfernen
- [ ] Nur `user_roles`-Tabelle als Single Source of Truth verwenden
- [ ] Supabase `user_roles`-Tabelle prüfen und bereinigen

---

## 2. Sidebar-Menü nicht linksbündig

**Problem:** Menü ist zentriert statt linksbündig im collapsed state

**Analyse:**
- ❌ AppSidebar.tsx Zeile 224: `!expanded && "justify-center"`
- ✅ Sollte sein: `!expanded && "justify-start"`

**Lösung:**
- ✅ **BEREITS BEHOBEN** in AppSidebar.tsx

---

## 3. Dashboard-Fremdbereiche

**Problem:** Dashboard hat Fremdbereiche

**Analyse:**
- ✅ Dashboard.tsx nutzt `StandardPageLayout`
- ✅ Nutzt `StatCard`-Pattern (konsistent)
- ✅ Nutzt V28 Design System
- ❓ **UNKLAR:** Welche spezifischen "Fremdbereiche" gemeint sind?

**Benötigte Informationen:**
- Welche Bereiche sind "fremd"?
- Was sollte stattdessen angezeigt werden?
- Screenshots oder konkrete Beschreibung?

**Vermutung:**
- Möglicherweise "Quick Actions" oder "Recent Activity"?
- Möglicherweise Right Sidebar?

**Action Items:**
- [ ] User-Feedback einholen: Welche Bereiche sind fremd?
- [ ] Screenshots vergleichen: Vorher/Nachher
- [ ] Dashboard gemäß NeXify WiKi-Vorgaben anpassen

---

## 4. Landingpages funktionieren nicht

**Problem:** Landingpages für Unternehmer funktionieren nicht

**Analyse:**
- ✅ `Unternehmer.tsx` ist korrekt implementiert
- ✅ Nutzt `usePublicCompany` Hook
- ✅ Slug-basierte URL-Struktur (`/:slug`)
- ✅ Legacy-Support (`/unternehmer?tenant=id`)

**Mögliche Ursachen:**
1. Routing-Konfiguration fehlt
2. `companies_public_info` View in Supabase fehlt
3. RLS-Policies blockieren Public Access
4. `landingpage_enabled` ist false

**Action Items:**
- [ ] Routing-Konfiguration prüfen (`routes.config.tsx`)
- [ ] Supabase View `companies_public_info` prüfen
- [ ] RLS-Policies für Public Access prüfen
- [ ] Test-Company mit `landingpage_enabled=true` erstellen

---

## 5. Pre-Login vs. Intern Sidebar-Inkonsistenz

**Problem:** Sidebar-Menü pre-login unterscheidet sich von intern

**Analyse:**
- ❓ **UNKLAR:** Es gibt keine "Pre-Login Sidebar"
- ✅ `AppSidebar.tsx` ist nur für eingeloggte User
- ✅ Pre-Login-Seiten haben `AuthHeader` (kein Sidebar)

**Vermutung:**
- Möglicherweise ist `AuthHeader` vs. `AppSidebar` gemeint?
- Möglicherweise ist Marketing-Navigation vs. Dashboard-Navigation gemeint?

**Action Items:**
- [ ] User-Feedback einholen: Welche Sidebar ist gemeint?
- [ ] `AuthHeader.tsx` und `AppSidebar.tsx` vergleichen
- [ ] Konsistenz herstellen (Logo, Abstände, Typografie)

---

## 6. Zusammenfassung

**Behobene Probleme:**
- ✅ Sidebar-Menü linksbündig ausgerichtet

**Offene Probleme:**
- ⏳ Login-Redirect (Lösung identifiziert, muss implementiert werden)
- ⏳ Dashboard-Fremdbereiche (unklar, benötigt Feedback)
- ⏳ Landingpages (Routing/RLS prüfen)
- ⏳ Pre-Login vs. Intern Sidebar (unklar, benötigt Feedback)

**Nächste Schritte:**
1. Login-Redirect-Fix implementieren
2. Routing-Konfiguration prüfen
3. Supabase RLS-Policies prüfen
4. User-Feedback einholen für unklare Probleme
