# Vercel Deploy-Hook

**Projekt:** mydispatch-rebuild

**Deploy-Hook URL:**
```
https://api.vercel.com/v1/integrations/deploy/prj_j6exywYDPrstYDQvd2XEQMeIDQZt/7p943NLtid
```

## Verwendung

**Manuelles Deployment triggern:**
```bash
curl -X POST "https://api.vercel.com/v1/integrations/deploy/prj_j6exywYDPrstYDQvd2XEQMeIDQZt/7p943NLtid"
```

**Response:**
```json
{
  "job": {
    "id": "2uu4uWP73rA9TQXEGfP9",
    "state": "PENDING",
    "createdAt": 1762694872872
  }
}
```

## Wann verwenden?

- Auto-Deploy funktioniert nicht
- Sofortiges Deployment erforderlich
- GitHub-Webhook ist inaktiv
- Nach kritischen Fixes

## Projekt-Info

- **Project ID:** `prj_j6exywYDPrstYDQvd2XEQMeIDQZt`
- **Org ID:** `team_jO6cawqC6mFroPHujn47acpU`
- **Project Name:** `mydispatch-rebuild`
- **Production URL:** https://www.my-dispatch.de

---

**Erstellt:** 2025-11-09  
**Status:** Aktiv
