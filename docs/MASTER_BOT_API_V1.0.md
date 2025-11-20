# 🤖 Master Bot API v1.0

**Status:** ✅ LIVE  
**Endpoint:** `https://vsbqyqhzxmwezlhzdmfd.supabase.co/functions/v1/bot-webhook`  
**Datum:** 2025-01-30

---

## 📋 ÜBERSICHT

Die Master Bot API ermöglicht externen Bots und Automatisierungen den Zugriff auf das MyDispatch Master System. Die API ist vollständig RESTful und nutzt JSON für Request/Response-Payloads.

---

## 🔐 AUTHENTIFIZIERUNG

### API Key

Alle Requests benötigen einen gültigen API Key im Header:

```http
x-api-key: bot_live_<your_key_here>
```

### API Key anfordern

1. Kontaktiere den System-Administrator
2. Key wird in Supabase Secrets hinterlegt
3. Key wird dir sicher übermittelt

**⚠️ WICHTIG:** Speichere den API Key sicher! Er gewährt vollen Zugriff auf System-Funktionen.

---

## 📡 VERFÜGBARE ACTIONS

### 1. **get-companies** - Alle Firmen abrufen

Holt alle registrierten Firmen mit Status und Subscription.

**Request:**

```json
{
  "action": "get-companies",
  "params": {}
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "companies": [
      {
        "id": "uuid",
        "name": "Taxi Berlin GmbH",
        "email": "info@taxi-berlin.de",
        "company_status": "active",
        "subscription_status": "active"
      }
    ]
  }
}
```

---

### 2. **get-system-health** - System-Status abrufen

Gibt aktuelle System-Metriken zurück.

**Request:**

```json
{
  "action": "get-system-health",
  "params": {}
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "total_companies": 42,
    "active_bookings": 127,
    "timestamp": "2025-01-30T14:30:00Z"
  }
}
```

---

### 3. **trigger-backup** - Datenbank-Backup starten

Startet manuelles Backup der Datenbank.

**Request:**

```json
{
  "action": "trigger-backup",
  "params": {}
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "backup_id": "uuid",
    "status": "started"
  }
}
```

---

### 4. **get-logs** - System-Logs abrufen

Holt die neuesten System-Logs.

**Request:**

```json
{
  "action": "get-logs",
  "params": {
    "limit": 20
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "uuid",
        "severity": "error",
        "message": "Database connection timeout",
        "component": "bookings-service",
        "created_at": "2025-01-30T14:25:00Z"
      }
    ]
  }
}
```

---

### 5. **run-security-scan** - Sicherheitsscan ausführen

Führt vollständigen Sicherheitsscan durch.

**Request:**

```json
{
  "action": "run-security-scan",
  "params": {}
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "critical_issues": 2,
    "issues": [
      {
        "severity": "critical",
        "title": "RLS nicht aktiviert auf Tabelle X",
        "solution": "ALTER TABLE X ENABLE ROW LEVEL SECURITY;"
      }
    ],
    "status": "warning"
  }
}
```

---

## 💻 CODE-BEISPIELE

### Python

```python
import requests

BOT_WEBHOOK_URL = "https://vsbqyqhzxmwezlhzdmfd.supabase.co/functions/v1/bot-webhook"
API_KEY = "bot_live_your_key_here"

def call_master_action(action: str, params: dict = None):
    """
    Ruft eine Master Bot API Action auf

    Args:
        action: Name der Action (z.B. "get-companies")
        params: Optionale Parameter für die Action

    Returns:
        Response-Data als Dictionary
    """
    response = requests.post(
        BOT_WEBHOOK_URL,
        json={"action": action, "params": params or {}},
        headers={"x-api-key": API_KEY}
    )
    response.raise_for_status()
    return response.json()

# Beispiel: Companies abrufen
result = call_master_action("get-companies")
print(f"Found {len(result['data']['companies'])} companies")

# Beispiel: Security Scan
scan_result = call_master_action("run-security-scan")
if scan_result['data']['critical_issues'] > 0:
    print(f"⚠️  {scan_result['data']['critical_issues']} critical issues found!")
    for issue in scan_result['data']['issues']:
        print(f"  - {issue['title']}")
```

---

### JavaScript/Node.js

```javascript
const BOT_WEBHOOK_URL = "https://vsbqyqhzxmwezlhzdmfd.supabase.co/functions/v1/bot-webhook";
const API_KEY = "bot_live_your_key_here";

async function callMasterAction(action, params = {}) {
  const response = await fetch(BOT_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify({ action, params }),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

// Beispiel: System Health
const health = await callMasterAction("get-system-health");
console.log(`Active Bookings: ${health.data.active_bookings}`);

// Beispiel: Backup starten
const backup = await callMasterAction("trigger-backup");
console.log(`Backup started: ${backup.data.backup_id}`);
```

---

### cURL

```bash
# Companies abrufen
curl -X POST https://vsbqyqhzxmwezlhzdmfd.supabase.co/functions/v1/bot-webhook \
  -H "Content-Type: application/json" \
  -H "x-api-key: bot_live_your_key_here" \
  -d '{"action": "get-companies", "params": {}}'

# System Health
curl -X POST https://vsbqyqhzxmwezlhzdmfd.supabase.co/functions/v1/bot-webhook \
  -H "Content-Type: application/json" \
  -H "x-api-key: bot_live_your_key_here" \
  -d '{"action": "get-system-health", "params": {}}'

# Security Scan
curl -X POST https://vsbqyqhzxmwezlhzdmfd.supabase.co/functions/v1/bot-webhook \
  -H "Content-Type: application/json" \
  -H "x-api-key: bot_live_your_key_here" \
  -d '{"action": "run-security-scan", "params": {}}'
```

---

## ⚠️ ERROR HANDLING

### HTTP Status Codes

| Code | Bedeutung    | Action                            |
| ---- | ------------ | --------------------------------- |
| 200  | Erfolg       | Request erfolgreich verarbeitet   |
| 400  | Bad Request  | Ungültige Action oder Parameter   |
| 401  | Unauthorized | Fehlender oder ungültiger API Key |
| 500  | Server Error | Interner Server-Fehler            |

### Error Response Format

```json
{
  "success": false,
  "error": "Unknown action: invalid-action"
}
```

---

## 🔄 RATE LIMITS

- **Max Requests:** 100 pro Minute
- **Timeout:** 30 Sekunden pro Request
- Bei Überschreitung: HTTP 429 (Too Many Requests)

---

## 📊 LOGGING

Alle Bot-Actions werden automatisch geloggt in der `master_logs` Tabelle:

```sql
SELECT * FROM master_logs
WHERE action_type = 'bot_webhook'
ORDER BY created_at DESC;
```

---

## 🛡️ SECURITY BEST PRACTICES

1. ✅ **API Key niemals im Code committen**
2. ✅ **Verwende Umgebungsvariablen** (`process.env.BOT_API_KEY`)
3. ✅ **Rotiere Keys regelmäßig** (empfohlen: alle 90 Tage)
4. ✅ **Logge alle API Calls** für Audit-Trail
5. ✅ **Nutze HTTPS** für alle Requests

---

## 📚 WEITERE RESOURCES

- [Master Dashboard Specification](./MASTER_DASHBOARD_SPECIFICATION_V40.11_COMPLETE.md)
- [Edge Functions Dokumentation](./EDGE_FUNCTIONS_GUIDE.md)
- [Security Guidelines](./SECURITY_GUIDELINES.md)

---

**Version:** 1.0.0  
**Datum:** 2025-01-30  
**Kontakt:** Master System Administrator
