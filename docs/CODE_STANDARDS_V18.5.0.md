# CODE-STANDARDS V18.5.0 (PROFESSIONAL)

> **Version:** 18.5.0  
> **Status:** ✅ VERBINDLICH  
> **Letzte Aktualisierung:** 2025-01-26

---

## 🎯 MISSION: PROFESSIONAL CODE ONLY

**AB SOFORT:** Keine Code-Spielereien, nur professioneller, fehlerfreier Code!

---

## 📚 PROJEKT-STRUKTUR (VERBINDLICH)

```
src/
├── components/
│   ├── ui/                    # Shadcn Base Components (NICHT ändern!)
│   ├── shared/                # Wiederverwendbare Komponenten
│   ├── forms/                 # Formular-Komponenten
│   ├── dashboard/             # Dashboard-Widgets
│   ├── layout/                # Layout-Komponenten (Header, Sidebar, Footer)
│   ├── tables/                # Tabellen-Komponenten
│   ├── mobile/                # Mobile-spezifische Komponenten
│   └── booking/               # Buchungs-spezifische Komponenten
│
├── lib/
│   ├── design-system.ts       # Design-Token-Definitionen
│   ├── format-utils.ts        # Formatierungen (Datum, Währung, etc.)
│   ├── validation-utils.ts    # Zod-Schemas, Validierungen
│   ├── error-handler.ts       # Zentrales Error-Handling
│   ├── supabase-utils.ts      # Supabase Helper (CompanyQuery, SoftDelete)
│   ├── tariff-utils.ts        # Tarif-Logik
│   └── api-clients/           # API-Client-Wrapper
│       ├── here-api-client.ts
│       ├── weather-client.ts
│       └── stripe-client.ts
│
├── hooks/
│   ├── use-auth.tsx           # Authentifizierung
│   ├── use-company.tsx        # Firmendaten
│   ├── use-bookings.tsx       # Buchungen (React Query)
│   ├── use-drivers.tsx        # Fahrer (React Query)
│   ├── use-vehicles.tsx       # Fahrzeuge (React Query)
│   └── use-device-type.tsx    # Mobile/Desktop Detection
│
├── pages/                     # Route-Komponenten
│   ├── Index.tsx              # Dashboard
│   ├── Auftraege.tsx          # Aufträge
│   ├── Fahrer.tsx             # Fahrer & Fahrzeuge
│   └── ...
│
├── integrations/
│   └── supabase/
│       ├── client.ts          # Supabase Client (AUTO-GENERATED!)
│       └── types.ts           # Supabase Types (AUTO-GENERATED!)
│
└── types/
    ├── database.ts            # Datenbank-Types (erweitert)
    ├── api-responses.ts       # API-Response-Types
    └── domain.ts              # Domain-Models (Business-Logic)
```

---

## 💎 CODE-QUALITÄTS-STANDARDS

### 1. TYPESCRIPT BEST PRACTICES

#### ✅ IMMER Type-Safe

```typescript
// ❌ FALSCH - any verwenden
const handleSubmit = (data: any) => {
  console.log(data.firstName); // Kein Type-Check!
};

// ✅ RICHTIG - Explizite Types
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
}

const handleSubmit = (data: FormData) => {
  console.log(data.firstName); // ✅ Type-Safe
};
```

#### ✅ IMMER Zod für Runtime-Validation

```typescript
// src/lib/validation-utils.ts
import { z } from "zod";

export const BookingFormSchema = z.object({
  pickup_address: z.string().min(5, "Adresse zu kurz").max(500, "Adresse zu lang"),
  pickup_time: z
    .string()
    .refine((val) => new Date(val) > new Date(), "Pickup-Zeit muss in der Zukunft liegen"),
  passengers: z.number().min(1).max(8),
  price: z.number().min(0),
});

export type BookingFormData = z.infer<typeof BookingFormSchema>;

// Verwendung in Komponenten
const form = useForm<BookingFormData>({
  resolver: zodResolver(BookingFormSchema),
});
```

#### ✅ NIEMALS Inline-Types

```typescript
// ❌ FALSCH
const fetchBookings = async (): Promise<
  {
    id: string;
    pickup_time: string;
    status: "pending" | "confirmed";
  }[]
> => {
  // ...
};

// ✅ RICHTIG - Separate Type-Definitionen
// src/types/domain.ts
export interface Booking {
  id: string;
  pickup_time: string;
  status: BookingStatus;
  price: number;
  customer?: Customer;
  driver?: Driver;
}

export type BookingStatus = "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";

// src/lib/api-clients/booking-client.ts
export const fetchBookings = async (): Promise<Booking[]> => {
  // ...
};
```

---

### 2. REACT PATTERNS (VERBINDLICH)

#### ✅ Custom Hooks für Logik

```typescript
// ❌ FALSCH - Logik in Komponente
const BookingForm = () => {
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    setLoading(true);
    supabase
      .from("bookings")
      .select("*")
      .then(({ data }) => setBookings(data))
      .finally(() => setLoading(false));
  }, []);

  // ...
};

// ✅ RICHTIG - Custom Hook mit React Query
// src/hooks/use-bookings.tsx
export const useBookings = () => {
  const { profile } = useAuth();

  return useQuery({
    queryKey: ["bookings", profile?.company_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("company_id", profile.company_id)
        .order("pickup_time", { ascending: false });

      if (error) throw error;
      return data as Booking[];
    },
    enabled: !!profile?.company_id,
    staleTime: 30000, // 30s Cache
  });
};

// Verwendung
const BookingForm = () => {
  const { data: bookings, isLoading } = useBookings();
  // ...
};
```

#### ✅ useMemo für teure Berechnungen

```typescript
// ❌ FALSCH - Neu berechnen bei jedem Render
const BookingList = ({ bookings }: { bookings: Booking[] }) => {
  const filteredBookings = bookings.filter(b => b.status === 'pending'); // Bei jedem Render!

  return <div>{filteredBookings.map(...)}</div>;
};

// ✅ RICHTIG - useMemo
const BookingList = ({ bookings }: { bookings: Booking[] }) => {
  const filteredBookings = useMemo(
    () => bookings.filter(b => b.status === 'pending'),
    [bookings]
  );

  return <div>{filteredBookings.map(...)}</div>;
};
```

#### ✅ useCallback für Event-Handler

```typescript
// ❌ FALSCH - Neue Funktion bei jedem Render
const BookingForm = () => {
  const handleSubmit = (data: FormData) => {
    console.log(data);
  };

  return <Button onClick={handleSubmit}>Submit</Button>; // Re-render!
};

// ✅ RICHTIG - useCallback
const BookingForm = () => {
  const handleSubmit = useCallback((data: FormData) => {
    console.log(data);
  }, []); // Nur einmal erstellt

  return <Button onClick={handleSubmit}>Submit</Button>;
};
```

---

### 3. ZENTRALISIERTE UTILS (PFLICHT!)

#### ✅ Formatierung IMMER via Utils

```typescript
// ❌ FALSCH - Inline-Formatierung
const BookingCard = ({ booking }: { booking: Booking }) => {
  return (
    <div>
      <p>{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(booking.price)}</p>
      <p>{format(new Date(booking.pickup_time), 'dd.MM.yyyy HH:mm', { locale: de })}</p>
    </div>
  );
};

// ✅ RICHTIG - Utils verwenden
// src/lib/format-utils.ts
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

export const formatDateTime = (date: string | Date): string => {
  return format(new Date(date), 'dd.MM.yyyy HH:mm', { locale: de });
};

// Verwendung
const BookingCard = ({ booking }: { booking: Booking }) => {
  return (
    <div>
      <p>{formatCurrency(booking.price)}</p>
      <p>{formatDateTime(booking.pickup_time)}</p>
    </div>
  );
};
```

---

### 4. API-CLIENT-LAYER (ZENTRALISIERT)

````typescript
// src/lib/api-clients/here-api-client.ts

/**
 * HERE Maps API Client
 *
 * @module here-api-client
 * @description Zentralisierter Client für alle HERE Maps API-Calls
 *
 * @example
 * ```typescript
 * const route = await calculateRoute(origin, destination);
 * console.log(`Distanz: ${route.distance}m, Dauer: ${route.duration}s`);
 * ```
 */

import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";

/**
 * Route-Daten von HERE Maps
 */
export interface RouteData {
  /** Distanz in Metern */
  distance: number;
  /** Dauer in Sekunden */
  duration: number;
  /** Verkehrsbedingte Verzögerung in Sekunden */
  trafficDelay: number;
  /** Basis-Dauer ohne Verkehr */
  baseDuration: number;
  /** Polyline für Karten-Darstellung */
  polyline: string;
  /** Turn-by-Turn Anweisungen */
  instructions: TurnByTurnAction[];
  /** Geplante Abfahrtszeit */
  departureTime: string;
  /** Voraussichtliche Ankunftszeit */
  arrivalTime: string;
}

export interface TurnByTurnAction {
  action: "depart" | "arrive" | "turn" | "continue";
  direction?: "left" | "right" | "straight";
  street?: string;
  distance: number;
  duration: number;
}

/**
 * Berechnet die optimale Route zwischen zwei Punkten
 *
 * @param origin - Start-Koordinaten
 * @param destination - Ziel-Koordinaten
 * @param options - Optionale Parameter
 * @returns RouteData mit Distanz, Dauer, Traffic
 *
 * @throws {Error} Wenn Route nicht berechnet werden kann
 *
 * @example
 * ```typescript
 * const route = await calculateRoute(
 *   { lat: 48.1351, lng: 11.5820 }, // München
 *   { lat: 52.5200, lng: 13.4050 }, // Berlin
 *   { avoidTolls: true }
 * );
 * ```
 */
export const calculateRoute = async (
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  options?: {
    departureTime?: string;
    avoidTolls?: boolean;
    vehicleType?: "car" | "truck";
  }
): Promise<RouteData> => {
  try {
    logger.info("[HERE-API] Calculating route", { origin, destination, options });

    const { data, error } = await supabase.functions.invoke("calculate-route", {
      body: {
        origin,
        destination,
        ...options,
      },
    });

    if (error) {
      logger.error("[HERE-API] Route calculation failed", error);
      throw new Error(`Route-Berechnung fehlgeschlagen: ${error.message}`);
    }

    logger.info("[HERE-API] Route calculated successfully", {
      distance: data.distance,
      duration: data.duration,
    });

    return data as RouteData;
  } catch (error) {
    logger.error("[HERE-API] Unexpected error", error);
    throw error;
  }
};

/**
 * Geocodiert eine Adresse zu GPS-Koordinaten
 *
 * @param address - Vollständige Adresse (z.B. "Marienplatz 1, 80331 München")
 * @returns GPS-Koordinaten
 *
 * @throws {Error} Wenn Adresse nicht gefunden wird
 *
 * @example
 * ```typescript
 * const coords = await geocodeAddress("Marienplatz 1, München");
 * console.log(`Lat: ${coords.lat}, Lng: ${coords.lng}`);
 * ```
 */
export const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number }> => {
  try {
    const { data, error } = await supabase.functions.invoke("geocode", {
      body: { address },
    });

    if (error) throw new Error(`Geocoding fehlgeschlagen: ${error.message}`);

    return { lat: data.lat, lng: data.lng };
  } catch (error) {
    logger.error("[HERE-API] Geocoding failed", error);
    throw error;
  }
};
````

---

### 5. ERROR-HANDLING (ZENTRALISIERT)

````typescript
// src/lib/error-handler.ts

/**
 * Zentrales Error-Handling für MyDispatch
 *
 * @module error-handler
 */

import { toast } from "@/hooks/use-toast";
import * as Sentry from "@sentry/react";
import { logger } from "./logger";

/**
 * Behandelt Fehler systemweit
 *
 * @param error - Fehler-Objekt
 * @param userMessage - Benutzerfreundliche Fehlermeldung
 * @param options - Zusätzliche Optionen
 *
 * @example
 * ```typescript
 * try {
 *   await createBooking(data);
 * } catch (error) {
 *   handleError(error, 'Buchung konnte nicht erstellt werden', {
 *     context: { bookingData: data }
 *   });
 * }
 * ```
 */
export const handleError = (
  error: unknown,
  userMessage: string,
  options?: {
    showToast?: boolean;
    context?: Record<string, any>;
  }
): void => {
  const { showToast = true, context } = options || {};

  // 1. Strukturiertes Logging
  logger.error(userMessage, error as Error, context);

  // 2. Sentry-Reporting (Production)
  if (import.meta.env.PROD) {
    Sentry.captureException(error, {
      tags: {
        component: "error-handler",
      },
      extra: {
        userMessage,
        context,
      },
    });
  }

  // 3. User-Toast
  if (showToast) {
    toast({
      title: "Fehler",
      description: userMessage,
      variant: "destructive",
    });
  }
};

/**
 * Behandelt Erfolgs-Meldungen
 *
 * @param message - Erfolgs-Nachricht
 * @param options - Zusätzliche Optionen
 */
export const handleSuccess = (
  message: string,
  options?: {
    context?: Record<string, any>;
  }
): void => {
  logger.info(message, options?.context);

  toast({
    title: "Erfolg",
    description: message,
    variant: "default",
  });
};
````

---

### 6. DESIGN-SYSTEM COMPLIANCE (PFLICHT!)

```typescript
// ❌ FALSCH - Direkte Farben
<div className="bg-white text-black">
<Button className="bg-[#4CAF50] text-white">

// ✅ RICHTIG - Semantic Tokens
<div className="bg-background text-foreground">
<Button className="bg-primary text-primary-foreground">

// ❌ FALSCH - Keine Responsive Typography
<h1 className="text-3xl">

// ✅ RICHTIG - Responsive Typography
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">

// ❌ FALSCH - Icons ohne Design-System
<User className="w-5 h-5 text-blue-500" />

// ✅ RICHTIG - Icons mit Design-System
import { iconSizes } from '@/lib/design-system';
<User className={cn(iconSizes.md, "text-foreground")} />
```

---

## 🧪 CODE-REVIEW CHECKLISTE

**VOR JEDEM COMMIT:**

- [ ] 0 TypeScript Errors (`npm run type-check`)
- [ ] Alle Funktionen haben JSDoc-Kommentare
- [ ] Alle Types sind explizit definiert (kein `any`)
- [ ] Utils verwendet statt Inline-Formatierung
- [ ] Design-System Tokens verwendet (keine direkten Farben)
- [ ] Mobile-Responsive (Breakpoints: sm, md, lg, xl)
- [ ] Error-Handling mit `handleError` / `handleSuccess`
- [ ] React Query für API-Calls (kein direktes `supabase.from()` in Komponenten)
- [ ] Custom Hooks für wiederverwendbare Logik
- [ ] `useMemo` / `useCallback` für Performance
- [ ] Zod-Schema für Formulare

---

## 📦 KOMPONENTEN-TEMPLATE

````typescript
/**
 * BookingCard - Zeigt eine Buchung als Card an
 *
 * @component
 * @example
 * ```tsx
 * <BookingCard
 *   booking={booking}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 * />
 * ```
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusIndicator } from '@/components/shared/StatusIndicator';
import { formatCurrency, formatDateTime } from '@/lib/format-utils';
import { Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { spacing, iconSizes } from '@/lib/design-system';
import type { Booking } from '@/types/domain';

interface BookingCardProps {
  /** Buchungs-Objekt */
  booking: Booking;
  /** Callback bei Edit-Klick */
  onEdit?: (booking: Booking) => void;
  /** Callback bei Delete-Klick */
  onDelete?: (booking: Booking) => void;
  /** Optionale CSS-Klasse */
  className?: string;
}

export const BookingCard = ({
  booking,
  onEdit,
  onDelete,
  className,
}: BookingCardProps) => {
  return (
    <Card className={cn('hover-lift', className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{booking.customer?.name || 'Unbekannt'}</span>
          <StatusIndicator status={booking.status} type="booking" />
        </CardTitle>
      </CardHeader>
      <CardContent className={cn('space-y-2', spacing.md)}>
        <p className="text-sm text-muted-foreground">
          {formatDateTime(booking.pickup_time)}
        </p>
        <p className="text-sm">{booking.pickup_address}</p>
        <p className="text-lg font-semibold">
          {formatCurrency(booking.price)}
        </p>

        <div className="flex gap-2 mt-4">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(booking)}
            >
              <Edit className={iconSizes.sm} />
              Bearbeiten
            </Button>
          )}
          {onDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(booking)}
            >
              <Trash2 className={iconSizes.sm} />
              Löschen
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
````

---

## 🚀 DEPLOYMENT-READY CHECKLIST

- [ ] **TypeScript:** 0 Errors
- [ ] **ESLint:** 0 Errors
- [ ] **Bundle Size:** <1.5MB
- [ ] **Lighthouse:** Score >90
- [ ] **Security Scan:** 0 CRITICAL Issues
- [ ] **Design-System:** 0 Violations
- [ ] **Mobile-Test:** iPhone/Android OK
- [ ] **Dokumentation:** JSDoc auf allen Public Functions

---

**Version:** V18.5.0  
**Nächstes Review:** Bei jedem Pull Request (CI/CD)
