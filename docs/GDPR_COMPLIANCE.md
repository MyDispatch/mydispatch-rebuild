# 🔐 GDPR / DSGVO COMPLIANCE - MyDispatch

Dokumentation der DSGVO-Compliance für MyDispatch.

**Zweck:** DSGVO-konforme Datenverarbeitung sicherstellen.

---

## 📊 COMPLIANCE STATUS

**Last Review:** 2025-01-26 (Initial Setup)  
**Status:** 🔴 NON-COMPLIANT (noch kein Auth-System)  
**Compliance Level:** 20%  
**Next Review:** Nach Auth-Implementation

---

## 🎯 GDPR Principles (DSGVO-Grundsätze)

### 1. Data Minimization (Datenminimierung)

**Status:** 🟢 OK (noch keine User-Daten)  
**Regel:** Nur speichern was absolut nötig ist

**Implementation:**

```typescript
// ❌ FALSCH - zu viele Daten
interface User {
  id: string;
  email: string;
  password: string; // NIEMALS im Klartext!
  name: string;
  birthdate: Date; // Nur wenn wirklich nötig!
  address: string; // Nur wenn nötig!
  phone: string;
  socialSecurity: string; // ❌ NIEMALS!
}

// ✅ RICHTIG - minimal
interface User {
  id: string;
  email: string;
  // password_hash in Supabase Auth
  name: string;
  // Weitere Daten nur mit explizitem Consent & Business-Need
}
```

**Checklist:**

- [x] Nur notwendige Daten erfassen
- [ ] Business-Need für jedes Datenfeld dokumentieren
- [ ] Regelmäßige Überprüfung: Werden alle Daten noch benötigt?

---

### 2. Purpose Limitation (Zweckbindung)

**Status:** 🟡 TBD  
**Regel:** Daten nur für angegebenen Zweck nutzen

**Implementation:**

- In Privacy Policy klar kommunizieren
- Keine Nutzung für andere Zwecke ohne neue Einwilligung
- Tracking & Analytics nur mit Consent

**Required Documents:**

- [ ] Privacy Policy (Datenschutzerklärung) - FEHLT
- [ ] Terms of Service (Nutzungsbedingungen) - FEHLT
- [ ] Cookie Policy - FEHLT

---

### 3. Storage Limitation (Speicherbegrenzung)

**Status:** 🟡 TBD  
**Regel:** Daten nur so lange speichern wie nötig

**Retention Periods (geplant):**

- **Active Users:** Unbegrenzt (solange Account aktiv)
- **Inactive Users (>90 Tage):** Erinnerungs-Email
- **Inactive Users (>180 Tage):** Archivierungs-Ankündigung
- **Inactive Users (>365 Tage):** Automatische Löschung

**Implementation:**

```sql
-- Supabase Function für automatische Cleanup
CREATE OR REPLACE FUNCTION cleanup_inactive_users()
RETURNS void AS $$
BEGIN
  -- Lösche Users die >365 Tage inaktiv
  DELETE FROM auth.users
  WHERE last_sign_in_at < NOW() - INTERVAL '365 days'
  AND deletion_requested = false;

  -- Lösche zugehörige Daten
  DELETE FROM public.profiles
  WHERE user_id NOT IN (SELECT id FROM auth.users);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cron Job (täglich um 2 Uhr)
SELECT cron.schedule(
  'cleanup-inactive-users',
  '0 2 * * *',
  'SELECT cleanup_inactive_users();'
);
```

**Checklist:**

- [ ] Retention Periods definieren
- [ ] Automatic Cleanup implementieren
- [ ] User-Benachrichtigungen vor Löschung
- [ ] Logs für Löschungen

---

### 4. Accuracy (Richtigkeit)

**Status:** 🟡 TBD  
**Regel:** Daten müssen korrekt und aktuell sein

**Implementation:**

- User kann eigene Daten jederzeit korrigieren
- Validierung bei Eingabe
- Regelmäßige Aufforderung zur Aktualisierung

---

### 5. Integrity & Confidentiality (Integrität & Vertraulichkeit)

**Status:** 🟡 PARTIAL  
**Regel:** Daten müssen sicher sein

**Security Measures:**

- ✅ HTTPS only (TLS 1.3)
- ✅ Passwords: Supabase Auth (bcrypt/argon2)
- ✅ Sensitive Data: Encrypted at rest (Supabase)
- ✅ API Keys: Environment Variables
- ❌ Row-Level Security (RLS) - FEHLT
- ❌ Authentication - FEHLT
- ❌ Rate Limiting - FEHLT

**See:** `docs/SECURITY_AUDIT.md` für Details

---

### 6. Accountability (Rechenschaftspflicht)

**Status:** 🟡 TBD  
**Regel:** Nachweis der DSGVO-Compliance

**Documentation:**

- [x] Diese Datei (GDPR_COMPLIANCE.md)
- [ ] Privacy Policy
- [ ] Data Processing Agreement (mit Supabase)
- [ ] Audit Logs für GDPR-relevante Actions

---

## 🔑 GDPR User Rights (Betroffenenrechte)

### Right to Access (Art. 15 DSGVO)

**Status:** ❌ NICHT IMPLEMENTIERT  
**Regel:** User kann Auskunft über gespeicherte Daten verlangen

**Implementation (geplant):**

```typescript
async function exportUserData(userId: string) {
  // Alle User-Daten sammeln
  const userData = await supabase.auth.getUser();
  const profile = await supabase.from("profiles").select("*").eq("id", userId).single();
  const tours = await supabase.from("tours").select("*").eq("user_id", userId);

  // Export als JSON
  const exportData = {
    user: userData,
    profile: profile,
    tours: tours,
    exported_at: new Date().toISOString(),
  };

  return JSON.stringify(exportData, null, 2);
}
```

**UI:**

- "Daten exportieren" Button in User-Settings
- Download als JSON

---

### Right to Rectification (Art. 16 DSGVO)

**Status:** ❌ NICHT IMPLEMENTIERT  
**Regel:** User kann Daten korrigieren

**Implementation:**

- User-Settings mit Edit-Funktionen
- Validation bei Updates

---

### Right to Erasure / "Right to be Forgotten" (Art. 17 DSGVO)

**Status:** ❌ NICHT IMPLEMENTIERT (CRITICAL!)  
**Regel:** User kann Account-Löschung verlangen

**Workflow (geplant):**

1. User klickt "Account löschen"
2. Confirmation Dialog (sicher?)
3. 30-Tage Grace Period (Account deaktiviert)
4. Email-Bestätigung
5. Nach 30 Tagen: Vollständige Löschung

**Implementation:**

```typescript
async function deleteUserAccount(userId: string) {
  // 1. Markiere als deletion_requested
  await supabase.auth.updateUser({
    data: { deletion_requested: true, deletion_requested_at: new Date() },
  });

  // 2. Schedule Deletion (nach 30 Tagen)
  await supabase.from("scheduled_deletions").insert({
    user_id: userId,
    execute_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  // 3. Send Confirmation Email
  await sendEmail({
    to: user.email,
    subject: "Account-Löschung bestätigt",
    body: "Dein Account wird in 30 Tagen gelöscht. Du kannst die Löschung bis dahin abbrechen.",
  });
}

// Scheduled Job (täglich)
async function executeScheduledDeletions() {
  const deletions = await supabase
    .from("scheduled_deletions")
    .select("*")
    .lte("execute_at", new Date());

  for (const deletion of deletions.data) {
    // Lösche ALLE User-Daten
    await supabase.auth.admin.deleteUser(deletion.user_id);
    await supabase.from("profiles").delete().eq("id", deletion.user_id);
    await supabase.from("tours").delete().eq("user_id", deletion.user_id);
    // ... alle weiteren Tabellen

    // Log für Audit
    await supabase.from("gdpr_audit_log").insert({
      action: "account_deleted",
      user_id: deletion.user_id,
      timestamp: new Date(),
    });

    // Lösche scheduled_deletion Entry
    await supabase.from("scheduled_deletions").delete().eq("id", deletion.id);
  }
}
```

**Priority:** 🔴 CRITICAL - Vor Production PFLICHT!

---

### Right to Data Portability (Art. 20 DSGVO)

**Status:** ❌ NICHT IMPLEMENTIERT  
**Regel:** User kann Daten in maschinenlesbarem Format erhalten

**Implementation:** Siehe "Right to Access" (JSON-Export)

---

### Right to Object (Art. 21 DSGVO)

**Status:** 🟡 TBD  
**Regel:** User kann Datenverarbeitung widersprechen

**Implementation:**

- Opt-Out für Marketing-Emails
- Opt-Out für Analytics/Tracking
- Cookie-Einstellungen

---

### Right to Restrict Processing (Art. 18 DSGVO)

**Status:** 🟡 TBD  
**Regel:** User kann Verarbeitung einschränken

**Implementation:**

- Account temporär deaktivieren
- Datenverarbeitung pausieren

---

## 🍪 Cookies & Tracking

### Cookie Categories

**Status:** ❌ KEIN COOKIE-BANNER

**Essential Cookies (IMMER erlaubt):**

- Supabase Auth Token
- Session Cookie

**Analytical Cookies (Opt-in erforderlich):**

- Google Analytics (falls verwendet)
- Custom Analytics

**Marketing Cookies (Opt-in erforderlich):**

- Aktuell keine geplant

**Implementation (geplant):**

```tsx
// Cookie Banner Component
<CookieBanner
  essentialCookies={["supabase-auth-token"]}
  analyticalCookies={["_ga", "_gid"]}
  marketingCookies={[]}
  onAccept={(preferences) => {
    if (preferences.analytical) {
      initializeAnalytics();
    }
  }}
/>
```

**Priority:** 🟠 HIGH - Vor Public Launch

---

## 📄 Required Legal Documents

### 1. Privacy Policy (Datenschutzerklärung)

**Status:** ❌ FEHLT (CRITICAL!)  
**Required Content:**

- Welche Daten werden gesammelt?
- Warum werden sie gesammelt?
- Wie lange werden sie gespeichert?
- Wer hat Zugriff?
- Rechte der Betroffenen
- Kontakt Datenschutzbeauftragter

**Location:** `/legal/privacy` Route  
**Priority:** 🔴 CRITICAL - Vor Public Launch

---

### 2. Terms of Service (Nutzungsbedingungen)

**Status:** ❌ FEHLT  
**Required Content:**

- Nutzungsbedingungen
- Haftungsausschluss
- Gerichtsstand

**Location:** `/legal/terms` Route  
**Priority:** 🔴 CRITICAL - Vor Public Launch

---

### 3. Impressum

**Status:** ❌ FEHLT (PFLICHT für DE!)  
**Required Content:**

- Firmenname
- Anschrift
- Kontakt (Email, Telefon)
- Handelsregister
- Steuernummer
- Verantwortlich für Inhalt

**Location:** `/legal/imprint` Route  
**Priority:** 🔴 CRITICAL - Vor Public Launch (DE-Pflicht!)

---

### 4. Cookie Policy

**Status:** ❌ FEHLT  
**Required Content:**

- Welche Cookies werden verwendet?
- Zweck der Cookies
- Wie kann man Cookies ablehnen?

**Location:** `/legal/cookies` Route  
**Priority:** 🟠 HIGH

---

## 🔍 GDPR Audit Trail

### Audit Logging (geplant)

Alle GDPR-relevanten Aktionen protokollieren:

```typescript
interface GdprAuditLog {
  id: string;
  timestamp: Date;
  user_id: string;
  action:
    | "data_export"
    | "account_deletion"
    | "consent_given"
    | "consent_withdrawn"
    | "data_updated";
  details: string;
  ip_address: string; // Anonymisiert (erste 3 Oktette)
}

// Beispiel
await supabase.from("gdpr_audit_log").insert({
  user_id: userId,
  action: "data_export",
  details: "User exported all personal data",
  ip_address: anonymizeIP(req.ip),
  timestamp: new Date(),
});
```

**Priority:** 🟠 HIGH - Vor Production

---

## 📋 GDPR Feature Checklist

**Vor Production:**

- [ ] Privacy Policy erstellt
- [ ] Terms of Service erstellt
- [ ] Impressum erstellt
- [ ] Cookie Banner implementiert
- [ ] Consent Management implementiert
- [ ] Right to Access (Data Export) implementiert
- [ ] Right to Erasure (Account Deletion) implementiert
- [ ] Right to Rectification (Edit Profile) implementiert
- [ ] Data Retention Policies implementiert
- [ ] Automatic Cleanup Job implementiert
- [ ] GDPR Audit Logging implementiert
- [ ] RLS Policies für alle Tabellen
- [ ] Data Processing Agreement mit Supabase
- [ ] Datenschutzbeauftragter benannt (falls >20 Mitarbeiter)

---

## 🚀 GDPR Roadmap

### Phase 1: Critical (Vor Public Launch)

1. Privacy Policy / ToS / Impressum
2. Cookie Banner & Consent Management
3. Right to Erasure Implementation
4. Data Export Function

**ETA:** 1-2 Wochen  
**Priority:** 🔴 BLOCKING für Public Launch

### Phase 2: Full Compliance

5. GDPR Audit Logging
6. Data Retention Automation
7. Regular Compliance Audits

**ETA:** 1 Woche  
**Priority:** 🟠 HIGH

---

## 🔄 Update Protocol

**Quarterly GDPR Review:**

- Privacy Policy aktuell?
- Neue Datenverarbeitungen?
- Compliance-Status prüfen
- Audit Logs reviewen

---

**LAST UPDATE:** 2025-01-26 14:40 CET  
**COMPLIANCE LEVEL:** 20%  
**TARGET:** 100% (vor Public Launch)  
**NEXT REVIEW:** Nach Auth-Implementation
