# 🚨 SECURITY INCIDENT - API Keys Compromised

**Date:** 2025-11-21
**Severity:** CRITICAL
**Status:** ⚠️ REQUIRES IMMEDIATE ACTION

## Incident Summary

15+ production API keys and tokens were **publicly posted in a chat message**, compromising:

### Compromised Credentials

#### Supabase (HIGHEST PRIORITY)

- ✅ `SUPABASE_SERVICE_ROLE_KEY` - **ADMIN ACCESS** to entire database
- ✅ `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY` - Public anon key
- ✅ `SUPABASE_ACCESS_TOKEN` - Service role duplicate

**Impact:** Full database access, can bypass RLS, modify all data

#### GitHub (HIGH PRIORITY)

- ✅ `github_pat_11BYX22CY0XRwK5sqZ7V92_...` - Full repo access
- ✅ `github_pat_11BYX22CY0s0JHcH2Cy8GB_...` - Classic PAT
- ✅ `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` - Classic PAT

**Impact:** Read/write access to all repositories, can push code, delete branches

#### AI Services (HIGH PRIORITY)

- ✅ `VITE_OPENAI_KEY` - OpenAI API (sk-proj-...)
- ✅ `VITE_ANTHROPIC_API_KEY` - Claude API (sk-ant-api03-...)
- ✅ `VITE_OPENROUTER_API_KEY` - OpenRouter (sk-or-v1-...)
- ✅ `VITE_GOOGLE_API_KEY` - Google AI (AIzaSy...)

**Impact:** Unauthorized API usage, billing charges, data access

#### Other Services

- ✅ `VITE_RESEND_API_KEY` - Email sending (re*WWtdb7JV*...)
- ✅ `RAILWAY_TOKEN` - Railway deployment (b5a0e33b-...)
- ✅ `AI_GATEWAY_API_KEY` - AI Gateway (vck_72wJROn2...)
- ✅ `HUGGINGFACE_TOKEN` - Hugging Face (hf_quOWC...)
- ✅ `DAILY_API_KEY` - Daily.co video (e4397b97...)
- ✅ Vercel Token (4o3cHB4R5bPVzfp3fFiTLV77)
- ✅ GitKraken Key (7ad55e2b-6d49-46f4-ac79-17f4d0972a5e)

## Immediate Actions Required

### 1. Supabase (DO THIS FIRST)

#### Rotate Service Role Key

```bash
# 1. Go to: https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/settings/api
# 2. Click "Generate new service_role key"
# 3. Copy new key
# 4. Update .env.local locally
# 5. Update Vercel Environment Variables
# 6. Update Supabase Edge Function Secrets:
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="<NEW_KEY>"
```

#### Rotate Anon Key (if changed)

```bash
# Only if anon key changed during rotation
# Update .env.local
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=<NEW_ANON_KEY>

# Update Vercel
vercel env add VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY production
```

### 2. GitHub (SECOND PRIORITY)

#### Revoke All PATs

1. Go to: https://github.com/settings/tokens
2. Find tokens ending with `...Y0XRwK...`, `...H2Cy8GB...`, `...qHHbXhxar...`
3. Click "Revoke" on each
4. Generate new PAT with same scopes
5. Update `.env.local`:
   ```bash
   GITHUB_PAT=<NEW_TOKEN>
   ```

### 3. AI Services

#### OpenAI

```bash
# 1. Go to: https://platform.openai.com/api-keys
# 2. Revoke key: sk-proj-1J1ZTDSrdy...
# 3. Create new key
# 4. Update .env.local:
VITE_OPENAI_KEY=<NEW_KEY>
```

#### Anthropic (Claude)

```bash
# 1. Go to: https://console.anthropic.com/settings/keys
# 2. Revoke key: sk-ant-api03-cWWQpt5g6x...
# 3. Create new key
# 4. Update .env.local:
VITE_ANTHROPIC_API_KEY=<NEW_KEY>
```

#### OpenRouter

```bash
# 1. Go to: https://openrouter.ai/keys
# 2. Revoke key: sk-or-v1-db1295e423...
# 3. Create new key
# 4. Update .env.local:
VITE_OPENROUTER_API_KEY=<NEW_KEY>
```

#### Google AI

```bash
# 1. Go to: https://console.cloud.google.com/apis/credentials
# 2. Find key: AIzaSyAObsK-D4ztW645Mbxb95bUzYxGAhGbqKQ
# 3. Delete or regenerate
# 4. Update .env.local:
VITE_GOOGLE_API_KEY=<NEW_KEY>
```

### 4. Other Services

#### Resend (Email)

```bash
# 1. Go to: https://resend.com/api-keys
# 2. Revoke key: re_WWtdb7JV_DJ9iJU4DJrc7ZLkFufufFxi5
# 3. Create new key
# 4. Update .env.local + Supabase Secrets
```

#### Railway

```bash
# 1. Go to: https://railway.app/account/tokens
# 2. Revoke token: b5a0e33b-1335-4153-b585-38cb7f7bb94d
# 3. Generate new token
```

#### Vercel

```bash
# 1. Go to: https://vercel.com/account/tokens
# 2. Revoke token: 4o3cHB4R5bPVzfp3fFiTLV77
# 3. Generate new token
```

#### GitKraken

```bash
# 1. Go to: https://gitkraken.dev/settings/tokens
# 2. Revoke key: 7ad55e2b-6d49-46f4-ac79-17f4d0972a5e
# 3. Generate new token
```

## Post-Rotation Checklist

### Local Environment

- [ ] Update `.env.local` with ALL new keys
- [ ] Test local build: `npm run dev`
- [ ] Verify Supabase connection
- [ ] Verify API calls work

### Vercel Environment

- [ ] Update all `VITE_*` variables in Vercel Dashboard
- [ ] Trigger new deployment
- [ ] Verify production works

### Supabase Secrets (Edge Functions)

```bash
supabase secrets set RESEND_API_KEY="<NEW_KEY>"
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="<NEW_KEY>"
supabase secrets set OPENAI_API_KEY="<NEW_KEY>"
# ... etc for all Edge Function secrets
```

### Git Repository

- [ ] Verify `.env.local` is in `.gitignore` ✅ (already correct)
- [ ] Check git history: `git log --all --full-history -- .env*`
- [ ] Confirm no secrets ever committed ✅ (already verified)

## Prevention Measures

### Immediate

1. ✅ **NEVER post API keys in chat messages**
2. ✅ Use environment variable references instead: `process.env.VITE_SUPABASE_URL`
3. ✅ Use "Check .env.local file" instead of posting values

### Long-term

1. Enable 2FA on all service accounts
2. Use IP allowlisting where possible (Supabase, Vercel)
3. Set up key rotation schedules (quarterly)
4. Monitor API usage for anomalies
5. Use separate keys for dev/staging/prod

## Verification Commands

### Check if keys are working

```bash
# Test Supabase connection
curl -X GET "https://ygpwuiygivxoqtyoigtg.supabase.co/rest/v1/" \
  -H "apikey: <NEW_ANON_KEY>" \
  -H "Authorization: Bearer <NEW_ANON_KEY>"

# Test OpenAI
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer <NEW_OPENAI_KEY>"
```

### Monitor for unauthorized usage

- Supabase: Check "Logs" and "API" tabs in dashboard
- GitHub: Check "Security log" in settings
- OpenAI/Anthropic: Check usage dashboards

## Status Tracking

| Service                | Status     | Updated | Verified |
| ---------------------- | ---------- | ------- | -------- |
| Supabase Service Role  | ⚠️ PENDING | -       | -        |
| Supabase Anon Key      | ⚠️ PENDING | -       | -        |
| GitHub PAT (main)      | ⚠️ PENDING | -       | -        |
| GitHub PAT (classic 1) | ⚠️ PENDING | -       | -        |
| GitHub PAT (classic 2) | ⚠️ PENDING | -       | -        |
| OpenAI                 | ⚠️ PENDING | -       | -        |
| Anthropic              | ⚠️ PENDING | -       | -        |
| OpenRouter             | ⚠️ PENDING | -       | -        |
| Google AI              | ⚠️ PENDING | -       | -        |
| Resend                 | ⚠️ PENDING | -       | -        |
| Railway                | ⚠️ PENDING | -       | -        |
| Vercel                 | ⚠️ PENDING | -       | -        |
| GitKraken              | ⚠️ PENDING | -       | -        |
| AI Gateway             | ⚠️ PENDING | -       | -        |
| Hugging Face           | ⚠️ PENDING | -       | -        |
| Daily.co               | ⚠️ PENDING | -       | -        |

## Timeline

- **2025-11-21 ~15:00**: Keys posted in chat message
- **2025-11-21 ~15:05**: Incident detected
- **2025-11-21 ~15:10**: This document created
- **NEXT**: User must rotate all keys manually

## Notes

- **VITE_SENTRY_DSN**: ✅ Not present in .env.local (correctly removed in V33.3)
- All keys in `.env.local` match posted keys exactly
- No keys ever committed to git (verified via git history)
- Incident limited to chat exposure only

---

**PRIORITY:** Complete key rotation within next 24 hours
**RESPONSIBLE:** User (u4231458123@gmail.com)
**FOLLOW-UP:** Update this document with completion dates
