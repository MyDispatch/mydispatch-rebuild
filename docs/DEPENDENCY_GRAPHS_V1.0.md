# 🔗 DEPENDENCY GRAPHS V1.0

**Version:** 1.0.0  
**Datum:** 2025-01-31  
**Status:** ✅ PRODUCTION-READY

---

## 📋 Inhaltsverzeichnis

1. [Frontend → Backend Complete Flow](#1-frontend--backend-complete-flow)
2. [TanStack Query Hook Chain](#2-tanstack-query-hook-chain)
3. [Critical Path Failures](#3-critical-path-failures)
4. [External API Dependencies](#4-external-api-dependencies)
5. [Edge Function Dependency Chain](#5-edge-function-dependency-chain)
6. [Database Schema Dependencies](#6-database-schema-dependencies)

---

## 1. Frontend → Backend Complete Flow

### Booking Creation Flow (Complete)

```mermaid
graph TB
    subgraph Frontend
        A[BookingForm.tsx]
        B[useCreateBooking Hook]
        C[Form Validation Zod]
    end
    
    subgraph API Layer
        D[src/lib/api/bookings.ts]
        E[createBooking Function]
        F[Type Validation]
    end
    
    subgraph Backend
        G[Supabase Client]
        H[bookings Table]
        I[RLS Policy Check]
        J[Trigger Functions]
    end
    
    subgraph Notifications
        K[Edge Function: send-booking-email]
        L[Resend API]
    end
    
    A --> C
    C --> B
    B --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L
    
    style A fill:#3b82f6
    style D fill:#10b981
    style H fill:#f59e0b
    style I fill:#ef4444
    style K fill:#8b5cf6
```

### Authentication Flow

```mermaid
graph LR
    subgraph User Interface
        A[Login Form]
        B[Auth.tsx]
    end
    
    subgraph Auth Layer
        C[Supabase Auth]
        D[JWT Generation]
        E[Session Storage]
    end
    
    subgraph State Management
        F[useAuthStore]
        G[Global State]
    end
    
    subgraph Protected Routes
        H[ProtectedRoute.tsx]
        I[Dashboard]
    end
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    
    style C fill:#ef4444
    style F fill:#3b82f6
    style H fill:#10b981
```

---

## 2. TanStack Query Hook Chain

### useBookings Hook Dependency Chain

```mermaid
graph TB
    subgraph Component
        A[BookingsList.tsx]
        B[useBookings Call]
    end
    
    subgraph TanStack Query
        C[Query Client]
        D[Cache Layer]
        E[Refetch Logic]
    end
    
    subgraph API Layer
        F[src/lib/api/bookings.ts]
        G[getBookings Function]
        H[Filter Logic]
    end
    
    subgraph Database
        I[Supabase Client]
        J[SELECT Query]
        K[RLS Filtering]
        L[bookings Table]
    end
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L
    
    D -.Cache Hit.-> A
    L -.Data Response.-> A
    
    style C fill:#f59e0b
    style D fill:#10b981
    style K fill:#ef4444
```

### Mutation Flow (useCreateBooking)

```mermaid
sequenceDiagram
    participant Component
    participant Hook as useCreateBooking
    participant TanStack as TanStack Query
    participant API as API Layer
    participant DB as Database
    participant Cache as Query Cache
    
    Component->>Hook: mutateAsync(data)
    Hook->>TanStack: Execute Mutation
    TanStack->>API: createBooking(data)
    API->>DB: INSERT query
    DB-->>API: Success + ID
    API-->>TanStack: Return created booking
    TanStack->>Cache: Invalidate bookings query
    TanStack->>Cache: Add new booking to cache
    Cache-->>Component: Trigger re-render
    TanStack-->>Hook: Success callback
    Hook-->>Component: Toast notification
```

---

## 3. Critical Path Failures

### What Breaks If X Fails?

```mermaid
graph TB
    subgraph Failure Points
        A[Supabase Down]
        B[RLS Policy Error]
        C[API Layer Bug]
        D[Network Timeout]
        E[Auth Token Expired]
    end
    
    subgraph Cascading Failures
        F[All DB Queries Fail]
        G[401 Unauthorized Errors]
        H[Component Error State]
        I[Retry Mechanism]
        J[Redirect to Login]
    end
    
    A --> F
    B --> G
    C --> H
    D --> I
    E --> J
    
    F --> H
    G --> J
    
    style A fill:#ef4444
    style E fill:#ef4444
    style J fill:#f59e0b
```

### Authentication Failure Chain

```mermaid
graph LR
    A[Auth Token Expired] --> B[API Call Fails]
    B --> C[401 Error]
    C --> D[useAuthStore Detects]
    D --> E[Clear User State]
    E --> F[Redirect to /auth]
    F --> G[Show Login Form]
    
    style A fill:#ef4444
    style C fill:#ef4444
    style F fill:#f59e0b
```

### Database Connection Failure

```mermaid
graph TB
    A[Database Connection Lost] --> B[Supabase Client Error]
    B --> C{Retry Count}
    C -->|<3| D[Exponential Backoff]
    C -->|>=3| E[Circuit Breaker Open]
    D --> F[Retry Connection]
    E --> G[Show Error Message]
    E --> H[Queue Failed Requests]
    
    F -.Success.-> I[Normal Operation]
    F -.Fail.-> C
    
    style A fill:#ef4444
    style E fill:#f59e0b
    style I fill:#10b981
```

---

## 4. External API Dependencies

### Complete External API Map

```mermaid
graph TB
    subgraph MyDispatch App
        A[Frontend]
    end
    
    subgraph External Services
        B[Google Maps API]
        C[Lovable AI Gateway]
        D[Stripe API]
        E[Resend API]
    end
    
    subgraph Edge Functions
        F[geocoding-service]
        G[ai-chat-handler]
        H[payment-webhook]
        I[send-email]
    end
    
    A --> F
    A --> G
    A --> H
    A --> I
    
    F --> B
    G --> C
    H --> D
    I --> E
    
    style B fill:#34a853
    style C fill:#8b5cf6
    style D fill:#635bff
    style E fill:#ef4444
```

### API Health Check Flow

```mermaid
sequenceDiagram
    participant App
    participant HealthCheck as Health Check Service
    participant Google as Google Maps
    participant Lovable as Lovable AI
    participant Stripe
    participant Resend
    
    App->>HealthCheck: Check all APIs
    
    par Parallel Health Checks
        HealthCheck->>Google: GET /maps/api/geocode
        HealthCheck->>Lovable: POST /v1/chat/completions
        HealthCheck->>Stripe: GET /v1/account
        HealthCheck->>Resend: GET /emails
    end
    
    Google-->>HealthCheck: 200 OK
    Lovable-->>HealthCheck: 200 OK
    Stripe-->>HealthCheck: 200 OK
    Resend-->>HealthCheck: 200 OK
    
    HealthCheck-->>App: All services healthy
```

---

## 5. Edge Function Dependency Chain

### Edge Function → Database → External API

```mermaid
graph TB
    subgraph Client Request
        A[Frontend Call]
    end
    
    subgraph Edge Function
        B[send-booking-email]
        C[Fetch Booking Data]
        D[Generate Email Template]
    end
    
    subgraph Database
        E[bookings Table]
        F[customers Table]
        G[RLS Check]
    end
    
    subgraph External API
        H[Resend API]
        I[Email Delivery]
    end
    
    A --> B
    B --> C
    C --> E
    C --> F
    E --> G
    F --> G
    G --> D
    D --> H
    H --> I
    
    style B fill:#8b5cf6
    style G fill:#ef4444
    style H fill:#f59e0b
```

### Edge Function Environment Dependencies

```mermaid
graph LR
    subgraph Edge Function Runtime
        A[index.ts]
    end
    
    subgraph Required Secrets
        B[SUPABASE_URL]
        C[SUPABASE_SERVICE_ROLE_KEY]
        D[RESEND_API_KEY]
        E[LOVABLE_API_KEY]
    end
    
    subgraph Validation
        F[Environment Check]
        G[Secret Validation]
    end
    
    A --> F
    F --> B
    F --> C
    F --> D
    F --> E
    
    B --> G
    C --> G
    D --> G
    E --> G
    
    G -.Missing Secret.-> H[500 Error]
    G -.All Valid.-> I[Function Execution]
    
    style H fill:#ef4444
    style I fill:#10b981
```

---

## 6. Database Schema Dependencies

### Table Relationships

```mermaid
erDiagram
    bookings ||--o{ customers : has
    bookings ||--o{ drivers : assigned_to
    bookings ||--o{ vehicles : uses
    bookings ||--o{ partners : via
    bookings ||--o{ invoices : generates
    
    customers ||--o{ addresses : has_multiple
    drivers ||--o{ shifts : works
    drivers ||--o{ vehicles : drives
    
    companies ||--o{ bookings : owns
    companies ||--o{ drivers : employs
    companies ||--o{ vehicles : owns
```

### RLS Policy Dependencies

```mermaid
graph TB
    subgraph User Request
        A[SELECT bookings]
    end
    
    subgraph RLS Policies
        B[Policy: Users can view their own bookings]
        C[Check: auth.uid = user_id]
        D[Policy: Admins can view all]
        E[Check: role = 'admin']
    end
    
    subgraph Database
        F[bookings Table]
        G[Filtered Results]
    end
    
    A --> B
    B --> C
    A --> D
    D --> E
    
    C --> F
    E --> F
    F --> G
    
    C -.Unauthorized.-> H[403 Error]
    E -.Not Admin.-> H
    
    style C fill:#f59e0b
    style H fill:#ef4444
    style G fill:#10b981
```

---

## 🎯 Usage Guidelines

### When to Use Which Diagram?

1. **Frontend → Backend Flow** → Use for understanding complete request lifecycle
2. **TanStack Query Chain** → Use for debugging caching issues
3. **Critical Path Failures** → Use for incident response planning
4. **External API Map** → Use for API health monitoring
5. **Edge Function Chain** → Use for debugging serverless functions
6. **Database Schema** → Use for understanding data relationships

### How to Update Diagrams

1. **Install Mermaid CLI** (optional for local preview):
   ```bash
   npm install -g @mermaid-js/mermaid-cli
   ```

2. **Edit Markdown**: Diagrams are Mermaid code blocks
3. **Preview**: Use VS Code Mermaid extension or [mermaid.live](https://mermaid.live/)
4. **Commit**: Diagrams render automatically in GitHub/Lovable docs

---

## 📊 Dependency Complexity Metrics

| Dependency Type | Count | Criticality | Monitoring |
|----------------|-------|-------------|------------|
| Frontend Components | 150+ | Medium | Component Registry |
| API Layer Modules | 7 | High | Unit Tests |
| Database Tables | 18 | Critical | RLS Linter |
| Edge Functions | 12 | High | Health Checks |
| External APIs | 4 | Critical | Uptime Monitor |
| RLS Policies | 45+ | Critical | Security Scan |

**Total Tracked Dependencies:** 236+

---

**© 2025 NeXify - Alle Rechte vorbehalten**
