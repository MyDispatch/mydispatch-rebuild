# SYSTEM-VORGABEN: Zentrales Auth & Login-System V18.2

**STATUS: FINAL - NICHT MEHR ÄNDERN!**

## 🔒 KRITISCHE ARCHITEKTUR-REGEL

Es gibt **NUR EINEN** zentralen Login für ALLE Benutzergruppen:
- Unternehmer
- Kunden  
- Fahrer

Route: `/auth`

## Auth-System Architektur

### 1. Login-Route: `/auth`

**Parameter:**
- `company` (optional): Company-ID für gebrandete Ansicht
- `mode` (optional): `customer` für Kunden-Login/-Registrierung
- `tab` (optional): `login`, `signup`, `reset` für initial aktiven Tab

**Beispiele:**
```
/auth                              → Unternehmer-Login (ungebrandet)
/auth?company=X                    → Unternehmer-Login (gebrandet)
/auth?company=X&mode=customer      → Kunden-Login (gebrandet)
/auth?company=X&mode=customer&tab=signup → Kunden-Registrierung
```

### 2. Login-Logik (handleLogin)

Nach erfolgreichem Login wird automatisch weitergeleitet:

```typescript
1. Prüfe: Hat User Profile in profiles-Tabelle?
   → JA: navigate('/dashboard') // Unternehmer/Fahrer
   
2. Prüfe: Hat User Eintrag in customers mit has_portal_access=true?
   → JA: 
     - sessionStorage.setItem('portal_mode', 'true')
     - sessionStorage.setItem('portal_customer_id', customerId)
     - sessionStorage.setItem('portal_company_id', companyId)
     - navigate('/portal')
   
3. Sonst: Fehlermeldung "Kein Zugang gefunden"
```

### 3. Registrierung

**A) Unternehmer-Registrierung** (`mode` nicht gesetzt):
- Tarif-Auswahl: Starter oder Business
- Stripe Checkout für Abonnement
- Erstellt: Company + Profile + user_roles (admin)

**B) Kunden-Registrierung** (`mode=customer`):
- Keine Tarif-Auswahl
- Kostenlos
- Erstellt: Customer-Eintrag mit `has_portal_access=true`
- Verknüpft mit `company_id` aus URL

### 4. BookingWidget Integration

```typescript
// Login-Button
window.location.href = `/auth?company=${companyId}&mode=customer&tab=login`;

// Registrierungs-Button
window.location.href = `/auth?company=${companyId}&mode=customer&tab=signup`;
```

### 5. PortalRoute

```typescript
// Prüft sessionStorage für Portal-Zugang
const portalMode = sessionStorage.getItem('portal_mode');
const customerId = sessionStorage.getItem('portal_customer_id');

if (!portalMode || !customerId) {
  navigate('/auth?mode=customer');
}
```

### 6. Unternehmer-Landingpage

**Login-Button-Logik:**
```typescript
{hasCustomerPortal ? (
  <a href={`/auth?company=${company.id}&mode=customer`}>Login</a>
) : (
  <a href={`/auth?company=${company.id}`}>Login</a>
)}
```

## Tab-Sichtbarkeit

| Szenario | Login | Signup | Reset |
|----------|-------|--------|-------|
| Nicht gebrandet | ✅ | ✅ | ✅ |
| Gebrandet + mode=customer | ✅ | ✅ | ✅ |
| Gebrandet (kein mode) | ✅ | ❌ | ✅ |

## Validation Schemas

```typescript
// Login
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Unternehmer-Registrierung
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  companyName: z.string().min(2),
  taxId: z.string().min(5),
  tariff: z.enum(['starter', 'business']),
});

// Kunden-Registrierung
const customerRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().optional(),
});
```

## ⚠️ NIEMALS:

1. ❌ Separate Auth-Seiten für verschiedene Benutzergruppen erstellen
2. ❌ `/portal/auth` Route nutzen (nur Redirect zu `/auth?mode=customer`)
3. ❌ Login-Logik duplizieren
4. ❌ Manuelle Weiterleitung ohne Profile/Customer-Check
5. ❌ Portal-Zugang ohne sessionStorage-Prüfung

## ✅ IMMER:

1. ✅ Zentrale `/auth` Route nutzen
2. ✅ URL-Parameter für Kontext (`company`, `mode`, `tab`)
3. ✅ Nach Login: Profile/Customer-Check für Weiterleitung
4. ✅ sessionStorage für Portal-Session
5. ✅ Validation vor Auth-Operationen

---

**Letzte Aktualisierung:** 2025-10-18
**Version:** V18.2
**Status:** 🔒 FINAL - SYSTEM-KRITISCH
