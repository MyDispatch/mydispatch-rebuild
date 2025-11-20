# 🚗 FAHRER-PORTAL DOKUMENTATION V18.3

**Datum:** 18.10.2025  
**Version:** V18.3 KONZEPT  
**Status:** 📋 GEPLANT - Erweiterungen für Fahrer-Portal

---

## 🎯 ÜBERSICHT

Das Fahrer-Portal ermöglicht Fahrern den Zugriff auf ihre persönlichen Daten, Schichten, Aufträge und GPS-Tracking über ein separates Login-Portal.

**URL:** `/portal` (Separate Auth-Instanz)

---

## ✅ IMPLEMENTIERTER STAND (V18.2.31)

### 1. Portal-Authentifizierung
- ✅ Separate Login-Seite `/portal/auth`
- ✅ Driver-spezifische RLS-Policies
- ✅ Session-Management
- ✅ Passwort-Reset

### 2. Basis-Features
- ✅ Profil-Ansicht (readonly)
- ✅ Schichten-Übersicht
- ✅ Auftrags-Liste (zugewiesene)
- ✅ Dokumente-Upload

### 3. GPS-Tracking
- ✅ Live-Position senden (alle 30 Sek)
- ✅ Shift-Status ändern (Available/Busy/Offline)
- ✅ 24h Auto-Delete (DSGVO-konform)

---

## 🚀 GEPLANTE ERWEITERUNGEN (V18.3)

### 1. Mobile-First Dashboard

**Ziel:** Optimierte Ansicht für Smartphone-Nutzung

**Features:**
```tsx
// Fahrer-Dashboard (Mobile-optimiert)
<DriverDashboard>
  {/* Status-Toggle (prominent) */}
  <StatusCard>
    <StatusToggle 
      currentStatus="available"
      onChange={handleStatusChange}
      options={['available', 'busy', 'break', 'offline']}
    />
  </StatusCard>

  {/* Nächster Auftrag */}
  <NextBookingCard
    booking={nextBooking}
    eta={8} // Minuten
    actions={[
      { label: 'Navigation starten', icon: Navigation },
      { label: 'Kunde anrufen', icon: Phone }
    ]}
  />

  {/* Heute-Statistik */}
  <TodayStatsCard
    rides={7}
    revenue="450,00 €"
    hours="6.5"
    rating={4.8}
  />
</DriverDashboard>
```

### 2. Auftrags-Details (erweitert)

**Features:**
- Navigation-Integration (HERE Maps)
- Kunden-Kontakt (Anruf-Button)
- Sonderausstattung-Hinweise (Kindersitz, Rollstuhl)
- Pickup-Hinweise (Terminal, Gleis, Namensschild)
- Notizen vom Disponenten

**Implementierung:**
```tsx
<BookingDetailCard booking={booking}>
  {/* Route-Übersicht */}
  <RoutePreview
    pickup={booking.pickup_address}
    dropoff={booking.dropoff_address}
    distance="12.5 km"
    duration="18 Min"
  />

  {/* Kunden-Info */}
  <CustomerInfo
    name={customer.name}
    phone={customer.phone}
    onCall={() => window.location.href = `tel:${customer.phone}`}
  />

  {/* Spezial-Anforderungen */}
  {booking.special_requests && (
    <Alert variant="info">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Besondere Anforderungen</AlertTitle>
      <AlertDescription>{booking.special_requests}</AlertDescription>
    </Alert>
  )}

  {/* Actions */}
  <div className="flex gap-2">
    <Button onClick={startNavigation}>
      <Navigation className="h-4 w-4 mr-2" />
      Navigation starten
    </Button>
    <Button variant="outline" onClick={markAsStarted}>
      Fahrt beginnen
    </Button>
  </div>
</BookingDetailCard>
```

### 3. Navigation-Integration

**Ziel:** Nahtlose Integration mit HERE Maps / Apple Maps / Google Maps

**Features:**
```tsx
const startNavigation = (destination: string) => {
  // iOS: Apple Maps
  if (isIOS) {
    window.location.href = `maps://maps.apple.com/?daddr=${encodeURIComponent(destination)}`;
  }
  // Android: Google Maps
  else if (isAndroid) {
    window.location.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
  }
  // Fallback: HERE Maps Web
  else {
    window.open(`https://share.here.com/l/${lat},${lng}`, '_blank');
  }
};

// Im Portal
<Button onClick={() => startNavigation(booking.dropoff_address)}>
  <Navigation className="h-4 w-4 mr-2" />
  Navigation starten
</Button>
```

### 4. Schicht-Management (erweitert)

**Features:**
- ✅ Schicht starten/beenden
- ✅ Pause einlegen
- 🆕 Break-Timer (automatisch)
- 🆕 Lenk- & Ruhezeiten-Tracker
- 🆕 Überstunden-Anzeige

**Implementierung:**
```tsx
<ShiftManagement>
  {/* Schicht-Status */}
  <ShiftStatusCard
    isActive={shiftActive}
    startTime={shiftStart}
    duration="6:32"
    breaks={[
      { start: '10:15', end: '10:30', duration: '15 Min' }
    ]}
  />

  {/* Lenk- & Ruhezeiten (PBefG-konform) */}
  <DrivingTimeCard
    drivingTime="5:45"
    maxDrivingTime="9:00"
    breaksDue={false}
    nextBreakIn="3:15"
  />

  {/* Actions */}
  <div className="flex gap-2">
    {shiftActive ? (
      <>
        <Button variant="outline" onClick={startBreak}>
          <Coffee className="h-4 w-4 mr-2" />
          Pause
        </Button>
        <Button variant="destructive" onClick={endShift}>
          Schicht beenden
        </Button>
      </>
    ) : (
      <Button onClick={startShift}>
        Schicht starten
      </Button>
    )}
  </div>
</ShiftManagement>
```

### 5. Einnahmen-Übersicht

**Features:**
- Tages-Umsatz (Brutto)
- Wochen-Umsatz
- Monats-Umsatz
- Breakdown nach Zahlungsart
- Export als PDF

**Implementierung:**
```tsx
<RevenueOverview>
  {/* Heute */}
  <RevenueCard
    title="Heute"
    amount="450,00 €"
    rides={7}
    avgPerRide="64,29 €"
  />

  {/* Diese Woche */}
  <RevenueCard
    title="Diese Woche"
    amount="2.150,00 €"
    rides={32}
    trend="+15%"
  />

  {/* Breakdown */}
  <PaymentBreakdown
    cash="315,00 €"
    invoice="135,00 €"
    card="0,00 €"
  />

  {/* Export */}
  <Button onClick={exportPDF}>
    <FileDown className="h-4 w-4 mr-2" />
    PDF exportieren
  </Button>
</RevenueOverview>
```

### 6. Dokumente-Management

**Features:**
- ✅ Upload (Führerschein, P-Schein)
- ✅ Ablauf-Anzeige
- 🆕 Foto-Upload direkt (Kamera)
- 🆕 PDF-Vorschau
- 🆕 Erinnerungen

**Implementierung:**
```tsx
<DocumentsSection>
  {/* Führerschein */}
  <DocumentCard
    type="Führerschein"
    expiryDate="2028-05-15"
    status="valid"
    fileUrl={driverLicense.url}
    onUpload={handleUpload}
  />

  {/* Foto-Upload */}
  <input
    type="file"
    accept="image/*,application/pdf"
    capture="environment" // Kamera öffnen
    onChange={handleFileUpload}
  />

  {/* Ablauf-Warnung */}
  {isExpiringSoon && (
    <Alert variant="warning">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Dokument läuft ab</AlertTitle>
      <AlertDescription>
        Ihr Führerschein läuft in {daysUntilExpiry} Tagen ab.
      </AlertDescription>
    </Alert>
  )}
</DocumentsSection>
```

### 7. Nachrichten-Center

**Features:**
- Dispatch-Nachrichten empfangen
- Push-Benachrichtigungen
- Schnellantworten
- Emojis

**Implementierung:**
```tsx
<MessagesCenter>
  {messages.map(msg => (
    <MessageCard key={msg.id}>
      <div className="flex items-start gap-3">
        <Avatar>
          <AvatarImage src={msg.sender.avatar} />
          <AvatarFallback>{msg.sender.initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">{msg.sender.name}</h4>
            <span className="text-xs text-muted-foreground">
              {formatTime(msg.timestamp)}
            </span>
          </div>
          <p className="text-sm">{msg.content}</p>
        </div>
      </div>

      {/* Schnellantworten */}
      <div className="flex gap-2 mt-2">
        <Button size="sm" variant="outline" onClick={() => reply('👍')}>
          👍
        </Button>
        <Button size="sm" variant="outline" onClick={() => reply('OK')}>
          OK
        </Button>
        <Button size="sm" variant="outline" onClick={() => reply('Bin unterwegs')}>
          Bin unterwegs
        </Button>
      </div>
    </MessageCard>
  ))}
</MessagesCenter>
```

### 8. Offline-Modus (PWA)

**Ziel:** App funktioniert auch ohne Internetverbindung

**Features:**
- Offline-Queue für GPS-Positionen
- Cached Auftrags-Daten
- Sync bei Reconnect
- Service Worker

**Implementierung:**
```typescript
// Service Worker Registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}

// Offline Queue
const offlineQueue = new OfflineQueue();

const sendGPSPosition = async (position: GPSPosition) => {
  try {
    await supabase.from('gps_positions').insert(position);
  } catch (error) {
    // Offline? Queue it
    offlineQueue.add('gps_position', position);
  }
};

// Sync on Reconnect
window.addEventListener('online', async () => {
  await offlineQueue.flush();
});
```

---

## 🔐 SICHERHEIT & DATENSCHUTZ

### RLS Policies (Fahrer)

```sql
-- Fahrer können nur ihre eigenen Daten sehen
CREATE POLICY "Drivers can view their own profile"
ON drivers FOR SELECT
USING (id = auth.uid());

-- Fahrer können nur ihre zugewiesenen Aufträge sehen
CREATE POLICY "Drivers can view their assigned bookings"
ON bookings FOR SELECT
USING (driver_id IN (
  SELECT id FROM drivers WHERE id = auth.uid()
));

-- Fahrer können GPS-Positionen senden
CREATE POLICY "Drivers can insert their GPS positions"
ON gps_positions FOR INSERT
WITH CHECK (driver_id = auth.uid());
```

### GPS-Tracking (DSGVO)

```sql
-- Auto-Delete nach 24h (ZWINGEND)
CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
  'cleanup-gps-positions',
  '0 */6 * * *', -- Alle 6 Stunden
  $$DELETE FROM gps_positions WHERE timestamp < NOW() - INTERVAL '24 hours'$$
);
```

---

## 📱 MOBILE DESIGN PATTERNS

### Bottom Navigation

```tsx
<BottomNav>
  <NavItem href="/portal" icon={Home} label="Start" />
  <NavItem href="/portal/bookings" icon={FileText} label="Aufträge" />
  <NavItem href="/portal/shifts" icon={Clock} label="Schichten" />
  <NavItem href="/portal/messages" icon={MessageSquare} label="Chat" />
  <NavItem href="/portal/profile" icon={User} label="Profil" />
</BottomNav>
```

### Pull-to-Refresh

```tsx
const [refreshing, setRefreshing] = useState(false);

const handleRefresh = async () => {
  setRefreshing(true);
  await refetch();
  setRefreshing(false);
};

<PullToRefresh onRefresh={handleRefresh} refreshing={refreshing}>
  <BookingsList />
</PullToRefresh>
```

### Large Touch Targets

```tsx
// Mindestens 48x48px für Touch-Elemente
<Button className="min-h-[48px] min-w-[48px]">
  <Icon className="h-6 w-6" />
</Button>
```

---

## 🎨 UI/UX-VORGABEN (Portal-spezifisch)

### CI-Farben (identisch zu Hauptapp)
```css
--primary: 45 31% 54%;
--foreground: 0 0% 20%;
--accent: 45 31% 54%;
```

### Status-Farben
```tsx
available: 'bg-status-success'  // Grün
busy: 'bg-status-warning'       // Gelb
break: 'bg-accent'              // Primär
offline: 'bg-muted'             // Grau
```

### Typography (Mobile)
```css
h1: text-2xl font-bold          /* Hauptüberschriften */
h2: text-lg font-semibold       /* Card-Titel */
body: text-base                 /* Fließtext */
small: text-sm text-muted-foreground
```

---

## 📊 IMPLEMENTIERUNGSPLAN (Fahrer-Portal V18.3)

### Phase 1: Mobile Dashboard (4 Wochen)
- [ ] Status-Toggle (prominent)
- [ ] Nächster Auftrag Card
- [ ] Heute-Statistik
- [ ] Bottom Navigation

### Phase 2: Auftrags-Details (2 Wochen)
- [ ] Erweiterte Detail-Ansicht
- [ ] Navigation-Integration
- [ ] Kunden-Kontakt
- [ ] Spezial-Anforderungen

### Phase 3: Schicht-Management (3 Wochen)
- [ ] Erweiterte Schicht-Kontrolle
- [ ] Lenk- & Ruhezeiten-Tracker
- [ ] Break-Timer
- [ ] Überstunden-Berechnung

### Phase 4: Einnahmen & Dokumente (2 Wochen)
- [ ] Einnahmen-Übersicht
- [ ] PDF-Export
- [ ] Foto-Upload (Kamera)
- [ ] Dokument-Erinnerungen

### Phase 5: Nachrichten & Offline (3 Wochen)
- [ ] Nachrichten-Center
- [ ] Push-Benachrichtigungen
- [ ] Offline-Modus (PWA)
- [ ] Sync-Mechanismus

---

**Gesamtaufwand:** ~14 Wochen  
**Priorität:** 🟡 MITTEL (nach Dashboard-Optimierungen)  
**Business-Value:** HOCH (Fahrer-Zufriedenheit, Effizienz)

---

**Version History:**
- V18.3.0 (18.10.2025) - Konzept für Portal-Erweiterungen
- V18.2.31 (15.10.2025) - Basis-Portal implementiert
