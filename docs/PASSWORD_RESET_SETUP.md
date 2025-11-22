# Password Reset Setup - Supabase Configuration

## Problem

User berichtet: "Password Vergessen > funktioniert nicht"

## Root Cause Analysis

Die Password-Reset-Funktion ist **im Code vollständig implementiert** (`Auth.tsx` + `ResetPassword.tsx`), aber erfordert **Supabase-Dashboard-Konfiguration**.

## Frontend Implementation Status ✅

- ✅ `Auth.tsx` (Zeilen 486-518): `supabase.auth.resetPasswordForEmail()` mit `redirectTo`
- ✅ `ResetPassword.tsx`: Token-Validation, Password-Update, Auto-Login
- ✅ Route `/auth/reset-password` in `routes.config.tsx` (Zeile 77-78)

## Required Supabase Configuration

### 1. Email Templates (Critical)

**Location:** Supabase Dashboard → Authentication → Email Templates → "Reset Password"

**Default Template:**

```html
<h2>Reset Password</h2>
<p>Follow this link to reset your password:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
```

**✅ Recommended MyDispatch Template:**

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #334155;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .header {
        background: linear-gradient(135deg, #64748b 0%, #334155 100%);
        color: white;
        padding: 30px;
        text-align: center;
        border-radius: 8px 8px 0 0;
      }
      .content {
        background: white;
        padding: 30px;
        border: 1px solid #e2e8f0;
        border-radius: 0 0 8px 8px;
      }
      .button {
        display: inline-block;
        background: #64748b;
        color: white;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 6px;
        margin: 20px 0;
        font-weight: 600;
      }
      .footer {
        text-align: center;
        margin-top: 30px;
        color: #94a3b8;
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1 style="margin: 0; font-size: 24px;">MyDispatch</h1>
        <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Passwort zurücksetzen</p>
      </div>
      <div class="content">
        <h2 style="color: #334155; margin-top: 0;">Passwort zurücksetzen</h2>
        <p>Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts gestellt.</p>
        <p>Klicken Sie auf den folgenden Button, um ein neues Passwort festzulegen:</p>

        <p style="text-align: center;">
          <a href="{{ .ConfirmationURL }}" class="button">Neues Passwort festlegen</a>
        </p>

        <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
          <strong>Wichtig:</strong> Dieser Link ist 24 Stunden gültig.
        </p>

        <p style="color: #64748b; font-size: 14px;">
          Falls Sie diese Anfrage nicht gestellt haben, können Sie diese E-Mail ignorieren. Ihr
          Passwort bleibt unverändert.
        </p>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />

        <p style="color: #94a3b8; font-size: 12px; margin-bottom: 0;">
          Link funktioniert nicht? Kopieren Sie diese URL in Ihren Browser:<br />
          <span style="word-break: break-all;">{{ .ConfirmationURL }}</span>
        </p>
      </div>
      <div class="footer">
        <p>
          © 2025 RideHub Solutions | MyDispatch<br />
          Ensbachmühle 4, D-94571 Schaufling, Deutschland
        </p>
        <p>
          Bei Fragen kontaktieren Sie uns:
          <a href="mailto:info@my-dispatch.de" style="color: #64748b;">info@my-dispatch.de</a>
        </p>
      </div>
    </div>
  </body>
</html>
```

**Configuration Steps:**

1. Navigate to: https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/auth/templates
2. Select **"Reset Password"** template
3. Replace with above HTML template
4. **CRITICAL:** Click **"Save"** (bottom-right)

### 2. Redirect URL Whitelist (Critical)

**Location:** Supabase Dashboard → Authentication → URL Configuration → "Redirect URLs"

**Required URLs:**

```
https://www.my-dispatch.de/auth/reset-password
https://mydispatch-rebuild.vercel.app/auth/reset-password
http://localhost:5173/auth/reset-password
```

**Configuration Steps:**

1. Navigate to: https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/auth/url-configuration
2. Add all 3 URLs (one per line)
3. Click **"Save"**

**Note:** Supabase validates redirect URLs for security. If URL not whitelisted, `resetPasswordForEmail()` returns **silent error** (no exception, but no email sent).

### 3. Email Provider (Critical)

**Location:** Supabase Dashboard → Project Settings → Authentication → SMTP Settings

**Options:**

- ✅ **Supabase Default SMTP** (Limited: 3 emails/hour, not for production)
- ✅ **Custom SMTP** (Recommended: Resend, SendGrid, AWS SES)

**Current Setup (MyDispatch):**

- Already has Resend API key in `api_keys` table
- Should configure **Custom SMTP** with Resend

**Resend SMTP Configuration:**

1. Navigate to: https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/settings/auth
2. Scroll to **"SMTP Settings"**
3. Enable **"Use Custom SMTP Server"**
4. **SMTP Host:** `smtp.resend.com`
5. **SMTP Port:** `587` (TLS) or `465` (SSL)
6. **SMTP User:** `resend` (literal string)
7. **SMTP Password:** `<Resend API Key>` (get from https://resend.com/api-keys)
8. **Sender Email:** `info@my-dispatch.de` (must be verified in Resend)
9. **Sender Name:** `MyDispatch`
10. Click **"Save"**

**Resend API Key Retrieval:**

```sql
-- Run in Supabase SQL Editor
SELECT api_key FROM api_keys WHERE service_name = 'resend' AND active = true LIMIT 1;
```

### 4. Test Email Deliverability

**Steps:**

1. Go to: Supabase Dashboard → Authentication → Email Templates
2. Click **"Send Test Email"** (bottom-left)
3. Enter test email (e.g., `courbois1981@gmail.com` or `info@my-dispatch.de`)
4. Check inbox (also spam folder!)

**Troubleshooting:**

- ❌ **No email received:** Check SMTP credentials, verify sender email in Resend
- ❌ **Email in spam:** Add SPF/DKIM records in DNS (Resend provides instructions)
- ❌ **Link doesn't work:** Check redirect URL whitelist

## Testing Password Reset Flow

### 1. Request Password Reset

1. Navigate to: https://www.my-dispatch.de/auth
2. Click **"Passwort vergessen?"**
3. Enter email: `courbois1981@gmail.com` (Master Account)
4. Click **"E-Mail senden"**
5. ✅ **Expected:** Toast "E-Mail versendet"

### 2. Check Email

1. Open inbox for `courbois1981@gmail.com`
2. Look for email from `info@my-dispatch.de` (or `noreply@mail.app.supabase.io` if using default SMTP)
3. Subject: "Reset Password" (or German: "Passwort zurücksetzen")
4. ✅ **Expected:** Email contains button/link "Neues Passwort festlegen"

### 3. Click Reset Link

1. Click button in email
2. ✅ **Expected:** Redirects to `https://www.my-dispatch.de/auth/reset-password?token=...`
3. ✅ **Expected:** Page shows "Neues Passwort setzen" form

### 4. Set New Password

1. Enter new password (must meet requirements: 8+ chars, uppercase, lowercase, digit, special char)
2. Enter same password in "Passwort bestätigen"
3. Click **"Passwort speichern"**
4. ✅ **Expected:** Toast "Passwort aktualisiert"
5. ✅ **Expected:** Auto-redirect to `/dashboard` after 2 seconds

### 5. Verify Login with New Password

1. Sign out from dashboard
2. Return to `/auth`
3. Login with email + **new password**
4. ✅ **Expected:** Successful login → Dashboard

## Common Issues & Solutions

### Issue 1: "E-Mail versendet" but no email received

**Root Cause:** SMTP not configured or sender email not verified
**Solution:**

1. Check Supabase SMTP settings (see Section 3 above)
2. Verify sender email in Resend: https://resend.com/domains
3. Add SPF/DKIM records to `my-dispatch.de` DNS

**DNS Records (Required for Resend):**

```
TXT record: my-dispatch.de → "v=spf1 include:_spf.resend.com ~all"
DKIM (3 records): Check Resend Dashboard → Domains → my-dispatch.de → DNS Records
```

### Issue 2: "Ungültiger Link" after clicking email button

**Root Cause:** Redirect URL not whitelisted in Supabase
**Solution:**

1. Add `https://www.my-dispatch.de/auth/reset-password` to whitelist (see Section 2)
2. Wait 5 minutes for Supabase to apply changes
3. Request new password reset email (old link stays invalid)

### Issue 3: Password reset works, but login fails

**Root Cause:** Browser cached old session or password requirements not met
**Solution:**

1. Clear browser cache/cookies
2. Try incognito/private window
3. Check password meets all requirements (Auth.tsx validation):
   - Min 8 characters ✅
   - Uppercase letter (A-Z) ✅
   - Lowercase letter (a-z) ✅
   - Digit (0-9) ✅
   - Special character (!@#$%^&\*) ✅

### Issue 4: Email arrives late (5-10 minutes delay)

**Root Cause:** Using Supabase default SMTP (rate-limited)
**Solution:** Switch to custom SMTP (Resend) - see Section 3

### Issue 5: Email goes to spam

**Root Cause:** Missing SPF/DKIM DNS records
**Solution:**

1. Add DNS records from Resend Dashboard
2. Wait 24-48h for DNS propagation
3. Check spam score: https://www.mail-tester.com/

## Code References

### Auth.tsx (Password Reset Request)

**File:** `src/pages/Auth.tsx`
**Lines:** 486-518

```typescript
const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);

  const formData = new FormData(e.currentTarget);
  const email = formData.get("email") as string;

  try {
    const validation = EmailSchema.safeParse(email);
    if (!validation.success) {
      toast({
        title: "Validierungsfehler",
        description: "Ungültige E-Mail-Adresse",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;

    toast({
      title: "E-Mail versendet",
      description: "Bitte prüfen Sie Ihr Postfach.",
    });
  } catch (error: any) {
    toast({
      title: "Fehler",
      description: (error as Error)?.message,
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};
```

### ResetPassword.tsx (Password Reset Completion)

**File:** `src/pages/ResetPassword.tsx`
**Lines:** 97-127

```typescript
const onSubmit = async (data: ResetPasswordForm) => {
  try {
    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: data.password,
    });

    if (error) throw error;

    toast({
      title: "Passwort aktualisiert",
      description: "Ihr Passwort wurde erfolgreich geändert. Sie werden weitergeleitet...",
    });

    // Wait 2 seconds, then redirect to dashboard
    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
  } catch (error: any) {
    console.error("Password reset error:", error);
    toast({
      title: "Fehler",
      description: error?.message || "Passwort konnte nicht aktualisiert werden.",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};
```

### Routes Configuration

**File:** `src/config/routes.config.tsx`
**Lines:** 77-78

```typescript
{
  path: '/auth/reset-password',
  component: lazy(() => import('@/pages/ResetPassword')),
  ...
}
```

## Summary

**Frontend Implementation:** ✅ 100% Complete

- Password reset request form (Auth.tsx)
- Token validation (ResetPassword.tsx)
- Password update with validation
- Auto-redirect after success

**Backend Requirements:** ⚠️ Requires Supabase Dashboard Configuration

1. ✅ Email Template (use provided HTML)
2. ✅ Redirect URL Whitelist (add 3 URLs)
3. ✅ SMTP Configuration (use Resend with existing API key)
4. ✅ DNS Records (SPF/DKIM for deliverability)

**Testing:** Follow 5-step testing procedure (see Section "Testing Password Reset Flow")

**Next Steps for User:**

1. **IMMEDIATE:** Configure Supabase Email Template (Section 1)
2. **IMMEDIATE:** Add Redirect URLs to whitelist (Section 2)
3. **RECOMMENDED:** Switch to Resend SMTP (Section 3)
4. **OPTIONAL:** Add DNS records for better deliverability (Section 3)
5. **VERIFY:** Run 5-step testing procedure

---

**Version:** 1.0
**Last Updated:** 2025-01-22
**Author:** Codepilot V33.4 AI Agent
**Status:** Password Reset Code ✅ Complete | Supabase Config ⚠️ Required
