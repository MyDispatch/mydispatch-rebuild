# 🔌 API DOCUMENTATION V18.3.29

## MyDispatch - RESTful API Reference

**Status:** Production-Ready  
**Letzte Aktualisierung:** 2025-10-21  
**Verantwortlich:** Senior Systemarchitekt  
**Klassifizierung:** Intern - Entwicklungsvorgabe

---

## 🎯 API-ÜBERSICHT

**Base URL:** `https://vsbqyqhzxmwezlhzdmfd.supabase.co`  
**Protocol:** HTTPS  
**Authentication:** JWT (Supabase Auth)  
**Content-Type:** `application/json`

---

## 🔐 AUTHENTICATION

### Login

```http
POST /auth/v1/token?grant_type=password
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com"
  }
}
```

---

### Refresh Token

```http
POST /auth/v1/token?grant_type=refresh_token
Content-Type: application/json

{
  "refresh_token": "..."
}
```

---

### Logout

```http
POST /auth/v1/logout
Authorization: Bearer {access_token}
```

---

## 📋 ORDERS ENDPOINTS

### List Orders

```http
GET /rest/v1/orders
Authorization: Bearer {access_token}
```

**Query Parameters:**

```
?status=eq.pending           # Filter by status
&pickup_date=gte.2025-01-01  # Date range
&customer_id=eq.{uuid}       # Filter by customer
&order=pickup_date.desc      # Sort
&limit=20                    # Pagination
&offset=0                    # Pagination
```

**Response:**

```json
[
  {
    "id": "uuid",
    "order_number": "ORD-001",
    "customer_id": "uuid",
    "driver_id": "uuid",
    "pickup_address": "Berliner Str. 1, 10115 Berlin",
    "delivery_address": "Hamburger Str. 2, 20095 Hamburg",
    "pickup_date": "2025-12-01",
    "delivery_date": "2025-12-02",
    "status": "pending",
    "notes": "Handle with care",
    "created_at": "2025-10-21T10:00:00Z",
    "updated_at": "2025-10-21T10:00:00Z"
  }
]
```

---

### Get Order

```http
GET /rest/v1/orders?id=eq.{uuid}
Authorization: Bearer {access_token}
```

**Response:**

```json
{
  "id": "uuid",
  "order_number": "ORD-001",
  "customer": {
    "id": "uuid",
    "company_name": "Test GmbH",
    "email": "test@test.de"
  },
  "driver": {
    "id": "uuid",
    "full_name": "Max Mustermann"
  }
  // ... rest of order data
}
```

---

### Create Order

```http
POST /rest/v1/orders
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "customer_id": "uuid",
  "pickup_address": "Berliner Str. 1, 10115 Berlin",
  "delivery_address": "Hamburger Str. 2, 20095 Hamburg",
  "pickup_date": "2025-12-01",
  "delivery_date": "2025-12-02",
  "notes": "Handle with care"
}
```

**Response:**

```json
{
  "id": "uuid",
  "order_number": "ORD-002",
  "status": "pending"
  // ... rest of created order
}
```

---

### Update Order

```http
PATCH /rest/v1/orders?id=eq.{uuid}
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "status": "assigned",
  "driver_id": "uuid"
}
```

---

### Delete Order

```http
DELETE /rest/v1/orders?id=eq.{uuid}
Authorization: Bearer {access_token}
```

---

## 👥 CUSTOMERS ENDPOINTS

### List Customers

```http
GET /rest/v1/customers
Authorization: Bearer {access_token}
```

**Response:**

```json
[
  {
    "id": "uuid",
    "company_name": "Test GmbH",
    "contact_name": "Max Mustermann",
    "email": "test@test.de",
    "phone": "+49 123 4567890",
    "address": "Test Str. 1",
    "created_at": "2025-10-21T10:00:00Z"
  }
]
```

---

### Create Customer

```http
POST /rest/v1/customers
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "company_name": "Test GmbH",
  "contact_name": "Max Mustermann",
  "email": "test@test.de",
  "phone": "+49 123 4567890",
  "address": "Test Str. 1"
}
```

---

## 🚗 DRIVERS ENDPOINTS

### List Drivers

```http
GET /rest/v1/drivers
Authorization: Bearer {access_token}
?status=eq.on_duty  # Optional filter
```

**Response:**

```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "license_number": "D123456789",
    "phone": "+49 123 4567890",
    "vehicle_type": "Van",
    "license_plate": "B-MD 1234",
    "status": "on_duty"
  }
]
```

---

### Update Driver Status

```http
PATCH /rest/v1/drivers?id=eq.{uuid}
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "status": "on_break"
}
```

---

## 💰 INVOICES ENDPOINTS

### List Invoices

```http
GET /rest/v1/invoices
Authorization: Bearer {access_token}
?payment_status=eq.pending
&invoice_date=gte.2025-01-01
```

**Response:**

```json
[
  {
    "id": "uuid",
    "invoice_number": "INV-001",
    "customer_id": "uuid",
    "order_id": "uuid",
    "invoice_date": "2025-10-21",
    "due_date": "2025-11-21",
    "payment_status": "pending",
    "subtotal": 100.0,
    "tax_rate": 19.0,
    "tax_amount": 19.0,
    "total_amount": 119.0,
    "notes": "Payment due in 30 days"
  }
]
```

---

### Create Invoice

```http
POST /rest/v1/invoices
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "customer_id": "uuid",
  "order_id": "uuid",
  "invoice_date": "2025-10-21",
  "due_date": "2025-11-21",
  "subtotal": 100.00,
  "tax_rate": 19.00,
  "notes": "Payment due in 30 days"
}
```

**Automatic Calculations:**

- `tax_amount` = `subtotal * (tax_rate / 100)`
- `total_amount` = `subtotal + tax_amount`

---

## 📊 ANALYTICS ENDPOINTS (RPC)

### Get Financial KPIs

```http
POST /rest/v1/rpc/get_financial_kpis
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "start_date": "2025-01-01",
  "end_date": "2025-12-31"
}
```

**Response:**

```json
{
  "total_revenue": 50000.0,
  "open_invoices_count": 5,
  "open_invoices_total": 5000.0,
  "profit_margin": 25.5,
  "avg_order_value": 150.0
}
```

---

### Get Revenue by Month

```http
POST /rest/v1/rpc/get_revenue_by_month
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "start_date": "2025-01-01",
  "end_date": "2025-12-31"
}
```

**Response:**

```json
[
  { "month": "2025-01", "revenue": 4500 },
  { "month": "2025-02", "revenue": 5200 },
  { "month": "2025-03", "revenue": 4800 }
]
```

---

## 🔔 EDGE FUNCTIONS

### Generate Invoice PDF

```http
POST /functions/v1/generate-invoice-pdf
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "invoice_id": "uuid"
}
```

**Response:**

```
Content-Type: application/pdf
Content-Disposition: attachment; filename="Rechnung_INV-001.pdf"

[PDF Binary Data]
```

---

### Send Payment Reminder

```http
POST /functions/v1/send-payment-reminder
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "invoice_id": "uuid"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Zahlungserinnerung gesendet an test@test.de"
}
```

---

## ❌ ERROR HANDLING

### Error Response Format

```json
{
  "code": "PGRST116",
  "details": "The result contains 0 rows",
  "hint": null,
  "message": "JSON object requested, multiple (or no) rows returned"
}
```

---

### HTTP Status Codes

| Code  | Meaning               | Usage                          |
| ----- | --------------------- | ------------------------------ |
| `200` | OK                    | Successful GET, PATCH, DELETE  |
| `201` | Created               | Successful POST                |
| `204` | No Content            | Successful DELETE (no body)    |
| `400` | Bad Request           | Invalid request data           |
| `401` | Unauthorized          | Missing/invalid auth token     |
| `403` | Forbidden             | Insufficient permissions (RLS) |
| `404` | Not Found             | Resource not found             |
| `409` | Conflict              | Duplicate resource             |
| `422` | Unprocessable Entity  | Validation error               |
| `500` | Internal Server Error | Server error                   |

---

### Common Error Codes

```json
// Missing Auth
{
  "code": "401",
  "message": "JWT expired"
}

// RLS Policy Violation
{
  "code": "403",
  "message": "new row violates row-level security policy"
}

// Validation Error
{
  "code": "23505",
  "message": "duplicate key value violates unique constraint",
  "details": "Key (order_number)=(ORD-001) already exists."
}

// Foreign Key Violation
{
  "code": "23503",
  "message": "insert or update on table \"orders\" violates foreign key constraint",
  "details": "Key (customer_id)=(invalid-uuid) is not present in table \"customers\"."
}
```

---

## 📈 RATE LIMITING

**Limits:**

- **Anonymous:** 60 requests / minute
- **Authenticated:** 300 requests / minute

**Headers:**

```http
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 250
X-RateLimit-Reset: 1698765432
```

---

## 🔍 QUERY OPERATORS (PostgREST)

### Comparison Operators

```
?column=eq.value        # Equal
?column=neq.value       # Not equal
?column=gt.value        # Greater than
?column=gte.value       # Greater or equal
?column=lt.value        # Less than
?column=lte.value       # Less or equal
?column=like.*value*    # LIKE pattern
?column=ilike.*value*   # ILIKE (case-insensitive)
?column=in.(val1,val2)  # IN list
?column=is.null         # IS NULL
```

---

### Logical Operators

```
?and=(cond1,cond2)      # AND
?or=(cond1,cond2)       # OR
?not.column=eq.value    # NOT
```

---

### Ordering & Pagination

```
?order=column.desc      # Sort descending
?order=col1.asc,col2.desc  # Multiple sorts
?limit=20               # Limit results
?offset=40              # Skip results (pagination)
```

---

### Example Complex Query

```http
GET /rest/v1/orders
  ?status=in.(pending,assigned)
  &pickup_date=gte.2025-01-01
  &pickup_date=lte.2025-12-31
  &order=pickup_date.desc
  &limit=50
  &offset=0
```

---

## 🧪 API TESTING

### cURL Examples

```bash
# Login
curl -X POST https://vsbqyqhzxmwezlhzdmfd.supabase.co/auth/v1/token?grant_type=password \
  -H "Content-Type: application/json" \
  -H "apikey: YOUR_ANON_KEY" \
  -d '{"email":"user@example.com","password":"password123"}'

# List Orders
curl -X GET https://vsbqyqhzxmwezlhzdmfd.supabase.co/rest/v1/orders \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "apikey: YOUR_ANON_KEY"

# Create Order
curl -X POST https://vsbqyqhzxmwezlhzdmfd.supabase.co/rest/v1/orders \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"customer_id":"uuid","pickup_address":"Test","delivery_address":"Test"}'
```

---

## 📚 RELATED RESOURCES

### Supabase Client (TypeScript)

```typescript
import { supabase } from "@/integrations/supabase/client";

// List orders
const { data, error } = await supabase
  .from("orders")
  .select("*, customer:customers(*), driver:drivers(*)")
  .eq("status", "pending")
  .order("pickup_date", { ascending: false });

// Create order
const { data, error } = await supabase
  .from("orders")
  .insert({
    customer_id: "uuid",
    pickup_address: "Test",
    delivery_address: "Test",
  })
  .select()
  .single();

// Update order
const { error } = await supabase.from("orders").update({ status: "assigned" }).eq("id", "uuid");
```

---

## 🔗 VERWANDTE DOKUMENTATION

- `docs/PFLICHTENHEFT_V18.3.29.md` - System Requirements
- `src/integrations/supabase/types.ts` - Auto-generated Types
- `src/lib/validation.ts` - Request Validation Schemas
- Supabase Docs: https://supabase.com/docs

---

**END OF DOCUMENT**

_Diese API-Dokumentation ist verbindlich für alle Backend-Integrationen in MyDispatch._
