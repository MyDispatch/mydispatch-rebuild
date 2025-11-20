# 🔄 REALTIME SUBSCRIPTIONS PLAN V28.2.0

**Status:** ✅ PRODUCTION  
**Version:** 28.2.0  
**Zweck:** Dokumentation aller Realtime Channels

---

## 📡 ACTIVE CHANNELS (4)

### 1. bookings-realtime-updates

**Tables:** bookings  
**Events:** INSERT, UPDATE, DELETE  
**Subscribers:** Dashboard, Auftraege, HEREMapComponent

```typescript
export function useRealtimeBookings() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("bookings-realtime-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
        },
        (payload) => {
          console.log("[Realtime] Booking change:", payload);
          queryClient.invalidateQueries({ queryKey: ["bookings"] });
          queryClient.invalidateQueries({ queryKey: ["dashboard_stats"] });
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [queryClient]);
}
```

### 2. drivers-realtime-updates

**Tables:** drivers  
**Subscribers:** Dashboard, Fahrer, HEREMapComponent

### 3. vehicles-realtime-updates

**Tables:** vehicles  
**Subscribers:** Dashboard, Fahrzeuge, HEREMapComponent

### 4. chat-messages-realtime

**Tables:** chat_messages  
**Subscribers:** ChatWindow, Kommunikation

---

**Connection Target:** < 500ms  
**Reconnect Strategy:** Exponential Backoff (5s, 10s, 20s)
