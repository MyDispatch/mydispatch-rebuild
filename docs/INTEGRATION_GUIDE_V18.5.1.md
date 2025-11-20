# Integration Guide V18.5.1

**Datum:** 2025-10-23  
**Status:** ✅ Production-Ready

---

## 🎯 VALIDATION HOOKS - INTEGRATION

### Automatische Validierung aktivieren

**Option 1: ValidatedPageWrapper (Empfohlen)**
```tsx
import { ValidatedPageWrapper } from '@/components/layout/ValidatedPageWrapper';

const MyPage = () => {
  return (
    <ValidatedPageWrapper
      gridPattern="DASHBOARD-GRID"
      hasForm={true}
      hasAI={false}
    >
      {/* Page Content */}
    </ValidatedPageWrapper>
  );
};
```

**Option 2: Hooks direkt verwenden**
```tsx
import {
  useGridPatternValidation,
  useLegalComplianceValidation,
  useTouchTargetValidation,
} from '@/hooks/validation';

const MyPage = () => {
  // Validation Hooks (nur in Development)
  useGridPatternValidation('DASHBOARD-GRID');
  useLegalComplianceValidation({ hasForm: true });
  useTouchTargetValidation();
  
  return (/* Page Content */);
};
```

---

## 🚀 PERFORMANCE HOOKS - INTEGRATION

### Memoization für teure Berechnungen

```tsx
import { useMemoizedData, useSortedList } from '@/hooks/performance';

const BookingsPage = () => {
  const { data: bookings } = useBookings();
  
  // ✅ Memoization: Nur bei Änderung neu sortieren
  const sortedBookings = useSortedList(
    bookings,
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  
  return (/* Render sortedBookings */);
};
```

### Memoization für Event-Handler

```tsx
import { useMemoizedCallback } from '@/hooks/performance';

const BookingsPage = () => {
  const handleDelete = useMemoizedCallback(
    async (id: string) => {
      await deleteBooking(id);
    },
    [deleteBooking]
  );
  
  return (
    <Button onClick={() => handleDelete(booking.id)}>
      Löschen
    </Button>
  );
};
```

---

## 📊 REACT QUERY - INTEGRATION

### Query-Keys Factory verwenden

```tsx
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/react-query';

const BookingsPage = () => {
  const { data } = useQuery({
    queryKey: queryKeys.bookings.list({ status: 'active' }),
    queryFn: async () => {
      const { data } = await supabase
        .from('bookings')
        .select('*')
        .eq('status', 'active');
      return data;
    },
  });
};
```

### Query-Options Presets verwenden

```tsx
import { useQuery } from '@tanstack/react-query';
import { queryKeys, realtimeQueryOptions } from '@/lib/react-query';

// Real-Time Daten (kurzer Cache, häufiges Refetch)
const { data } = useQuery({
  queryKey: queryKeys.bookings.list(),
  queryFn: fetchBookings,
  ...realtimeQueryOptions, // ✅ 30s Cache, Auto-Refetch
});

// Statische Daten (langer Cache, kein Refetch)
import { staticQueryOptions } from '@/lib/react-query';

const { data: prices } = useQuery({
  queryKey: queryKeys.statistics.revenue('2025'),
  queryFn: fetchRevenue,
  ...staticQueryOptions, // ✅ 1h Cache, kein Refetch
});
```

---

## ✅ CHECKLISTE FÜR NEUE PAGES

### Pre-Implementation:
- [ ] Grid-Pattern definiert? (HERO/TARIF/DASHBOARD/MOBILE)
- [ ] Formular vorhanden? → DSGVO-Hinweis nötig
- [ ] KI-Feature? → AI Act Kennzeichnung nötig
- [ ] Footer benötigt? → Impressum/Datenschutz/AGB Links

### Implementation:
- [ ] ValidatedPageWrapper eingebaut
- [ ] Teure Berechnungen mit useMemoizedData
- [ ] Event-Handler mit useMemoizedCallback
- [ ] React Query mit Query-Keys Factory

### Post-Implementation:
- [ ] Console-Logs prüfen (Validation-Warnings?)
- [ ] Mobile-Test (375px, 768px, 1920px)
- [ ] Touch-Target-Test (alle Buttons ≥ 44px?)
- [ ] Performance-Test (Ladezeit < 3s?)

---

## 🎓 BEISPIELE

### Beispiel 1: Marketing-Page mit Formular
```tsx
import { ValidatedPageWrapper } from '@/components/layout/ValidatedPageWrapper';

const ContactPage = () => {
  return (
    <ValidatedPageWrapper
      gridPattern="HERO-GRID"
      hasForm={true}
      hasFooter={true}
    >
      <MarketingLayout>
        <form data-privacy-hint="true">
          {/* Formular-Felder */}
          <p className="text-sm text-muted-foreground">
            Mit dem Absenden akzeptieren Sie unsere{' '}
            <a href="/datenschutz">Datenschutzerklärung</a>.
          </p>
        </form>
      </MarketingLayout>
    </ValidatedPageWrapper>
  );
};
```

### Beispiel 2: Dashboard mit Real-Time Daten
```tsx
import { useQuery } from '@tanstack/react-query';
import { queryKeys, realtimeQueryOptions } from '@/lib/react-query';
import { useSortedList } from '@/hooks/performance';
import { ValidatedPageWrapper } from '@/components/layout/ValidatedPageWrapper';

const DashboardPage = () => {
  // React Query mit Real-Time Options
  const { data: bookings } = useQuery({
    queryKey: queryKeys.bookings.list({ status: 'active' }),
    queryFn: fetchBookings,
    ...realtimeQueryOptions,
  });
  
  // Memoization für Sortierung
  const sortedBookings = useSortedList(
    bookings || [],
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  
  return (
    <ValidatedPageWrapper
      gridPattern="DASHBOARD-GRID"
      hasForm={false}
    >
      <DashboardLayout>
        {/* Dashboard Content */}
      </DashboardLayout>
    </ValidatedPageWrapper>
  );
};
```

---

## 📚 SIEHE AUCH

- docs/MOBILE_FIRST_GRID_SYSTEM_V18.5.1.md
- docs/RECHTLICHE_COMPLIANCE_VORGABEN_V18.5.1.md
- docs/OPTIMIERUNGSPOTENZIAL_V18.5.1.md

---

**Version:** 18.5.1  
**Autor:** NeXify
