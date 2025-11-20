# 🚀 MyDispatch Perfektionierungskonzept V18.1 FINAL

**Gesamtkonzept für maximale Nutzerfreundlichkeit, Konsistenz und Effizienz**

## 📋 Inhaltsverzeichnis

1. [Vision & Ziele](#vision--ziele)
2. [Ist-Analyse aller Bereiche](#ist-analyse-aller-bereiche)
3. [Konsistenz-Standards](#konsistenz-standards)
4. [GPS-Integration Masterplan](#gps-integration-masterplan)
5. [Bereichs-Optimierungen](#bereichs-optimierungen)
6. [Implementierungsplan](#implementierungsplan)

---

## 🎯 Vision & Ziele

### Kernziele

1. **100% Konsistenz** - Jede Seite folgt identischen Patterns
2. **GPS-First** - Echtzeit-Tracking in allen relevanten Bereichen
3. **Effizienz-Maximum** - Weniger Klicks, mehr Übersicht
4. **Intuitive Navigation** - Nutzer findet alles sofort
5. **Mobile-Perfect** - Jeder Screen optimal auf Mobile

### Messbare KPIs

- **Klicks pro Aktion**: Max. 3 Klicks zu jeder Funktion
- **Ladezeit**: < 2 Sekunden pro Seitenwechsel
- **GPS-Latency**: < 3 Sekunden Positions-Update
- **Mobile-Score**: 100% responsive auf allen Breakpoints
- **User-Feedback**: 95%+ Zufriedenheit

---

## 📊 Ist-Analyse aller Bereiche

### 1. Hauptbereich - Dashboard (/)

**Status:** ✅ 85% - Gut, aber GPS-Integration fehlt

**Aktuelle Features:**

- Live-KPIs (Aufträge, Fahrer, Fahrzeuge, Umsatz)
- Quick-Actions
- Partner-Anfragen Badge
- Weather/Traffic Widgets

**Fehlende Funktionen:**

- ❌ Live-Map mit Fahrzeug-Tracking
- ❌ Aktive Aufträge mit ETA-Anzeige
- ❌ Fahrer-Status-Übersicht mit GPS
- ❌ Echtzeit-Benachrichtigungen

**Optimierungen:**

```typescript
// Dashboard Layout - 3-Spalten-Grid
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Spalte 1: KPIs + Quick Actions */}
  <div className="space-y-6">
    <KPICards />
    <QuickActions />
    <ActiveBookings />
  </div>

  {/* Spalte 2: Live-Map (2x größer) */}
  <div className="lg:col-span-2">
    <LiveMap
      drivers={activeDrivers}
      bookings={activeBookings}
      showRoutes={true}
      showETAs={true}
    />
  </div>
</div>

{/* Spalte 3: Sidebar mit Weather/Traffic */}
<div className="space-y-4">
  <WeatherWidget />
  <TrafficWidget />
  <DriverStatusList />
</div>
```

---

### 2. Disposition - Aufträge (/auftraege)

**Status:** ✅ 90% - Sehr gut, GPS-Erweiterung nötig

**Aktuelle Features:**

- CRUD für Aufträge
- Status-Änderungen (Ampel-System)
- Filter & Suche
- Partner-Weitergabe
- StandardActionButtons

**Fehlende Funktionen:**

- ❌ Live-ETA während Fahrt
- ❌ Fahrer-Position auf Karte
- ❌ Kunden-Tracking-Link generieren
- ❌ Route-Optimierung für mehrere Aufträge

**Optimierungen:**

```typescript
// Auftrags-Detailansicht mit GPS
<DetailDialog>
  {/* Header mit Status + Quick Actions */}
  <div className="flex justify-between items-center mb-6">
    <StatusIndicator status={booking.status} size="lg" />
    <div className="flex gap-2">
      <Button onClick={handleGenerateTrackingLink}>
        <MapPin className="h-4 w-4" />
        Tracking-Link
      </Button>
      <Button onClick={handleShowRoute}>
        <Navigation className="h-4 w-4" />
        Route anzeigen
      </Button>
    </div>
  </div>

  {/* Live-Map mit Route */}
  <div className="h-96 mb-6">
    <LiveMap
      booking={booking}
      driver={booking.driver}
      showRoute={true}
      showETA={true}
    />
  </div>

  {/* Auftrags-Details */}
  <BookingDetails booking={booking} />
</DetailDialog>
```

**Neue Features:**

1. **Live-ETA-Tracking** - Aktualisierung alle 30s während Fahrt
2. **Kunden-Benachrichtigung** - Automatischer SMS/E-Mail-Versand mit Tracking-Link
3. **Route-Optimierung** - Mehrere Aufträge optimal routen
4. **GPS-History** - Vergangene Fahrten nachvollziehen

---

### 3. Disposition - Angebote (/angebote)

**Status:** ✅ 80% - Gut, ETA-Berechnung fehlt

**Aktuelle Features:**

- CRUD für Angebote
- Umwandlung in Auftrag
- Provisions-Berechnung
- StandardActionButtons

**Fehlende Funktionen:**

- ❌ Echtzeit-ETA bei Angebots-Erstellung
- ❌ Verkehrslage-basierte Preis-Anpassung
- ❌ Alternative Routen vorschlagen

**Optimierungen:**

```typescript
// Angebots-Formular mit HERE API Integration
<UnifiedForm>
  <AddressInput
    label="Abholadresse"
    onSelect={(address) => {
      setPickupAddress(address);
      // Sofort ETA berechnen
      calculateETA(address, dropoffAddress);
    }}
  />

  {/* Live-ETA-Anzeige */}
  {eta && (
    <Card className="bg-primary/5 p-4">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-accent" />
        <div>
          <p className="font-semibold">Geschätzte Fahrzeit</p>
          <p className="text-2xl">{eta.duration} Min</p>
          <p className="text-sm text-muted-foreground">
            {eta.distance} km • Verkehrslage: {eta.trafficStatus}
          </p>
        </div>
      </div>
    </Card>
  )}

  {/* Preis-Kalkulation mit Verkehrs-Zuschlag */}
  <div className="grid grid-cols-2 gap-4">
    <div>
      <Label>Basis-Preis</Label>
      <Input value={formatCurrency(basePrice)} disabled />
    </div>
    <div>
      <Label>Verkehrs-Zuschlag</Label>
      <Input value={formatCurrency(trafficSurcharge)} disabled />
    </div>
  </div>
</UnifiedForm>
```

---

### 4. Disposition - Rechnungen (/rechnungen)

**Status:** ✅ 85% - Gut, automatische Fahrt-Details fehlen

**Aktuelle Features:**

- CRUD für Rechnungen
- PDF-Export
- Zahlungserinnerungen
- StandardActionButtons

**Fehlende Funktionen:**

- ❌ Automatische GPS-Daten in Rechnung (Fahrtstrecke, Dauer)
- ❌ Fahrt-Nachweis mit Route-Map
- ❌ Kilometerstand aus GPS berechnen

**Optimierungen:**

```typescript
// Rechnungs-Details mit GPS-Nachweis
<PDFExportDialog>
  {/* Rechnungskopf */}
  <InvoiceHeader company={company} customer={customer} />

  {/* Fahrt-Details aus GPS */}
  <div className="my-6 p-4 border rounded-lg">
    <h3 className="font-semibold mb-2">Fahrtnachweis</h3>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label>Abholung</Label>
        <p>{booking.pickup_address}</p>
        <p className="text-sm text-muted-foreground">
          {formatDateTime(gpsData.startTime)}
        </p>
      </div>
      <div>
        <Label>Ziel</Label>
        <p>{booking.dropoff_address}</p>
        <p className="text-sm text-muted-foreground">
          {formatDateTime(gpsData.endTime)}
        </p>
      </div>
    </div>

    {/* GPS-generierte Daten */}
    <div className="grid grid-cols-3 gap-4 mt-4">
      <div>
        <Label>Gefahrene Strecke</Label>
        <p className="text-lg font-semibold">
          {gpsData.totalDistance} km
        </p>
      </div>
      <div>
        <Label>Fahrzeit</Label>
        <p className="text-lg font-semibold">
          {gpsData.totalDuration} Min
        </p>
      </div>
      <div>
        <Label>Wartezeit</Label>
        <p className="text-lg font-semibold">
          {gpsData.waitTime} Min
        </p>
      </div>
    </div>

    {/* Mini-Map mit Route */}
    <div className="h-48 mt-4 rounded-lg overflow-hidden">
      <StaticRouteMap route={gpsData.routePoints} />
    </div>
  </div>

  {/* Rechnungs-Positionen */}
  <InvoiceItems items={invoiceItems} />
</PDFExportDialog>
```

---

### 5. Verwaltung - Kunden (/kunden)

**Status:** ✅ 90% - Sehr gut, GPS-History fehlt

**Aktuelle Features:**

- CRUD für Kunden
- Inline-Erstellung in Aufträgen
- Adress-Autocomplete
- StandardActionButtons

**Fehlende Funktionen:**

- ❌ Häufigste Abholorte (GPS-basiert)
- ❌ Fahrt-History mit Karte
- ❌ Stammkunden-Routen-Optimierung

**Optimierungen:**

```typescript
// Kunden-Detailansicht mit GPS-Insights
<DetailDialog>
  {/* Header */}
  <CustomerHeader customer={customer} />

  {/* Tabs */}
  <Tabs defaultValue="info">
    <TabsList>
      <TabsTrigger value="info">Stammdaten</TabsTrigger>
      <TabsTrigger value="bookings">Aufträge</TabsTrigger>
      <TabsTrigger value="locations">Orte</TabsTrigger>
      <TabsTrigger value="history">Fahrt-History</TabsTrigger>
    </TabsList>

    {/* Tab: Häufigste Orte (GPS-basiert) */}
    <TabsContent value="locations">
      <Card>
        <CardHeader>
          <CardTitle>Häufigste Abholorte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topLocations.map((location) => (
              <div key={location.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-accent" />
                  <div>
                    <p className="font-medium">{location.address}</p>
                    <p className="text-sm text-muted-foreground">
                      {location.count}x genutzt
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => createBookingWithAddress(location.address)}
                >
                  Auftrag erstellen
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>

    {/* Tab: Fahrt-History mit Karte */}
    <TabsContent value="history">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Karte */}
        <Card>
          <CardContent className="p-0">
            <div className="h-96">
              <HistoryMap routes={customerRoutes} />
            </div>
          </CardContent>
        </Card>

        {/* Liste */}
        <Card>
          <CardHeader>
            <CardTitle>Letzte Fahrten</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              {customerBookings.map((booking) => (
                <div key={booking.id} className="mb-4 p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium">
                      {formatDate(booking.pickup_time)}
                    </p>
                    <StatusIndicator status={booking.status} size="sm" />
                  </div>
                  <p className="text-sm">{booking.pickup_address}</p>
                  <p className="text-sm text-muted-foreground">
                    → {booking.dropoff_address}
                  </p>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  </Tabs>
</DetailDialog>
```

---

### 6. Verwaltung - Fahrer (/fahrer)

**Status:** ✅ 75% - Gut, GPS-Tracking-Integration fehlt

**Aktuelle Features:**

- CRUD für Fahrer
- Schicht-Status
- Dokumente-Verwaltung
- StandardActionButtons

**Fehlende Funktionen:**

- ❌ Live-GPS-Position auf Karte
- ❌ Echtzeit-Schicht-Tracking
- ❌ Performance-Analyse (gefahrene km, Aufträge)
- ❌ Fahrer-App-Zugang direkt zuweisen

**Optimierungen:**

```typescript
// Fahrer-Übersicht mit GPS-Status
<StandardPageLayout
  title="Fahrer"
  stats={[
    { label: "Aktive Schichten", value: activeShifts.length, icon: Users },
    { label: "Verfügbare Fahrer", value: availableDrivers.length, icon: UserCheck },
    { label: "Im Einsatz", value: busyDrivers.length, icon: Car },
    { label: "Gesamt km heute", value: totalKmToday, icon: MapPin }
  ]}
>
  {/* Live-Map mit allen Fahrern */}
  <Card className="mb-6">
    <CardHeader>
      <CardTitle>Live-Übersicht</CardTitle>
    </CardHeader>
    <CardContent className="p-0">
      <div className="h-96">
        <LiveMap
          drivers={allDrivers}
          showStatus={true}
          onDriverClick={handleDriverClick}
        />
      </div>
    </CardContent>
  </Card>

  {/* Fahrer-Liste mit GPS-Status */}
  <DriversTable
    drivers={drivers}
    onEdit={handleEdit}
    onDetails={handleDetails}
    renderExtraColumn={(driver) => (
      <div className="flex items-center gap-2">
        {/* GPS-Status-Indicator */}
        <div className={cn(
          "h-2 w-2 rounded-full",
          driver.gps_active ? "bg-status-success" : "bg-status-error"
        )} />

        {/* Letzte Position */}
        {driver.last_position && (
          <span className="text-xs text-muted-foreground">
            Aktualisiert vor {getTimeSince(driver.last_position.timestamp)}
          </span>
        )}

        {/* Tracking-Link */}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => openDriverTracking(driver.id)}
        >
          <MapPin className="h-4 w-4" />
        </Button>
      </div>
    )}
  />
</StandardPageLayout>
```

**Neue Komponente: DriverDetailsDialog mit GPS**

```typescript
// src/components/drivers/DriverDetailsDialog.tsx
<DetailDialog>
  <Tabs defaultValue="info">
    <TabsList>
      <TabsTrigger value="info">Stammdaten</TabsTrigger>
      <TabsTrigger value="shifts">Schichten</TabsTrigger>
      <TabsTrigger value="tracking">GPS-Tracking</TabsTrigger>
      <TabsTrigger value="performance">Performance</TabsTrigger>
    </TabsList>

    {/* GPS-Tracking Tab */}
    <TabsContent value="tracking">
      <div className="space-y-6">
        {/* Aktuelle Position */}
        <Card>
          <CardHeader>
            <CardTitle>Aktuelle Position</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 mb-4">
              <LiveMap
                drivers={[driver]}
                center={driver.last_position}
                zoom={15}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Letztes Update</Label>
                <p>{formatDateTime(driver.last_position?.timestamp)}</p>
              </div>
              <div>
                <Label>Geschwindigkeit</Label>
                <p>{driver.last_position?.speed || 0} km/h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* GPS-Einstellungen */}
        <Card>
          <CardHeader>
            <CardTitle>Tracking-Einstellungen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>GPS-Tracking aktiviert</Label>
                <Switch
                  checked={driver.gps_consent}
                  disabled
                />
              </div>

              <div>
                <Label>Tracking-Intervall</Label>
                <p className="text-sm text-muted-foreground">
                  Alle 10 Sekunden während Schicht
                </p>
              </div>

              <Button
                variant="outline"
                onClick={() => sendTrackingInvitation(driver)}
              >
                Tracking-Einladung senden
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent>

    {/* Performance Tab */}
    <TabsContent value="performance">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Heute</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Gefahrene Kilometer</Label>
                <p className="text-2xl font-bold">{stats.today.km} km</p>
              </div>
              <div>
                <Label>Abgeschlossene Aufträge</Label>
                <p className="text-2xl font-bold">{stats.today.bookings}</p>
              </div>
              <div>
                <Label>Schichtdauer</Label>
                <p className="text-2xl font-bold">{stats.today.hours} Std</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Diesen Monat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Gefahrene Kilometer</Label>
                <p className="text-2xl font-bold">{stats.month.km} km</p>
              </div>
              <div>
                <Label>Abgeschlossene Aufträge</Label>
                <p className="text-2xl font-bold">{stats.month.bookings}</p>
              </div>
              <div>
                <Label>Durchschnitt pro Tag</Label>
                <p className="text-2xl font-bold">
                  {Math.round(stats.month.bookings / 30)} Aufträge
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  </Tabs>
</DetailDialog>
```

---

### 7. Verwaltung - Fahrzeuge (/fahrzeuge)

**Status:** ✅ 80% - Gut, GPS-Tracking fehlt komplett

**Aktuelle Features:**

- CRUD für Fahrzeuge
- Fahrzeugklassen
- Dokumente-Verwaltung
- StandardActionButtons

**Fehlende Funktionen:**

- ❌ Echtzeit-Position (über aktuellen Fahrer)
- ❌ Kilometerstand-Tracking (GPS-basiert)
- ❌ Wartungs-Erinnerungen basierend auf km
- ❌ Fahrzeug-History mit Routen

**Optimierungen:**

```typescript
// Fahrzeug-Detailansicht mit GPS
<DetailDialog>
  <Tabs defaultValue="info">
    <TabsList>
      <TabsTrigger value="info">Stammdaten</TabsTrigger>
      <TabsTrigger value="tracking">Position</TabsTrigger>
      <TabsTrigger value="history">Fahrt-History</TabsTrigger>
      <TabsTrigger value="maintenance">Wartung</TabsTrigger>
    </TabsList>

    {/* GPS-Position Tab */}
    <TabsContent value="tracking">
      {currentDriver ? (
        <Card>
          <CardHeader>
            <CardTitle>Aktuelle Position</CardTitle>
            <CardDescription>
              Zugewiesen an: {currentDriver.first_name} {currentDriver.last_name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 mb-4">
              <LiveMap
                drivers={[currentDriver]}
                vehicles={[vehicle]}
                center={currentDriver.last_position}
                zoom={15}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Geschwindigkeit</Label>
                <p>{currentDriver.last_position?.speed || 0} km/h</p>
              </div>
              <div>
                <Label>Letztes Update</Label>
                <p>{formatTime(currentDriver.last_position?.timestamp)}</p>
              </div>
              <div>
                <Label>Status</Label>
                <StatusIndicator status={currentDriver.shift_status} />
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <EmptyState
          icon={Car}
          title="Kein Fahrer zugewiesen"
          description="Weise diesem Fahrzeug einen Fahrer zu, um die Position zu tracken."
        />
      )}
    </TabsContent>

    {/* Wartung Tab mit GPS-basierten km */}
    <TabsContent value="maintenance">
      <Card>
        <CardHeader>
          <CardTitle>Kilometerstand</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Aktueller Stand (GPS)</Label>
              <p className="text-2xl font-bold">
                {formatNumber(vehicle.gps_mileage)} km
              </p>
              <p className="text-sm text-muted-foreground">
                Automatisch erfasst
              </p>
            </div>

            <div>
              <Label>Letzte Wartung</Label>
              <p>{formatNumber(vehicle.last_maintenance_mileage)} km</p>
            </div>

            <div>
              <Label>Nächste Wartung fällig bei</Label>
              <p>{formatNumber(vehicle.next_maintenance_mileage)} km</p>
              <p className="text-sm text-muted-foreground">
                In {vehicle.next_maintenance_mileage - vehicle.gps_mileage} km
              </p>
            </div>

            {/* Wartungs-Warnung */}
            {vehicle.gps_mileage >= vehicle.next_maintenance_mileage - 500 && (
              <Alert variant="warning">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Wartung fällig!</AlertTitle>
                <AlertDescription>
                  Dieses Fahrzeug sollte bald gewartet werden.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  </Tabs>
</DetailDialog>
```

---

### 8. Verwaltung - Partner (/partner)

**Status:** ✅ 85% - Gut, GPS-Ressourcen-Sharing fehlt

**Aktuelle Features:**

- Partner-Anfragen
- Verbindungen
- Provisions-Berechnung
- Ressourcen-Sharing (Fahrer/Fahrzeuge)

**Fehlende Funktionen:**

- ❌ Echtzeit-Verfügbarkeit von Partner-Ressourcen
- ❌ Partner-Fahrer auf eigener Karte
- ❌ GPS-basierte Zuweisung (nächster Partner-Fahrer)

**Optimierungen:**

```typescript
// Partner-Übersicht mit GPS-Ressourcen
<StandardPageLayout title="Partner">
  {/* Partner-Ressourcen-Map */}
  <Card className="mb-6">
    <CardHeader>
      <CardTitle>Verfügbare Partner-Ressourcen</CardTitle>
      <CardDescription>
        Echtzeit-Übersicht aller Partner-Fahrer und -Fahrzeuge
      </CardDescription>
    </CardHeader>
    <CardContent className="p-0">
      <div className="h-96">
        <LiveMap
          drivers={partnerDrivers}
          filterByAvailability={true}
          showPartnerBadge={true}
          onDriverClick={(driver) => assignToBooking(driver)}
        />
      </div>
    </CardContent>
  </Card>

  {/* Partner-Liste */}
  <PartnersTable
    partners={partners}
    renderExtraColumn={(partner) => (
      <div className="flex items-center gap-4">
        <div className="text-sm">
          <p className="font-medium">
            {partner.available_drivers} Fahrer verfügbar
          </p>
          <p className="text-muted-foreground">
            {partner.available_vehicles} Fahrzeuge frei
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => showPartnerResources(partner)}
        >
          Ressourcen anzeigen
        </Button>
      </div>
    )}
  />
</StandardPageLayout>
```

---

### 9. Betrieb - Schichtzettel (/schichtzettel)

**Status:** ✅ 85% - Gut, GPS-Integration fehlt

**Aktuelle Features:**

- Schichtplanung
- Fahrer-/Fahrzeug-Zuweisung
- Bestätigung durch Fahrer

**Fehlende Funktionen:**

- ❌ Automatische km-Erfassung aus GPS
- ❌ Echtzeit-Schicht-Tracking
- ❌ Automatische Pause-Erkennung

**Optimierungen:**

```typescript
// Schicht-Detailansicht mit GPS
<DetailDialog>
  <div className="space-y-6">
    {/* Schicht-Header */}
    <div className="flex justify-between items-start">
      <div>
        <h2 className="text-2xl font-bold">
          Schicht #{shift.id}
        </h2>
        <p className="text-muted-foreground">
          {formatDate(shift.date)} • {shift.shift_start_time} - {shift.shift_end_time}
        </p>
      </div>
      <StatusIndicator
        status={shift.confirmed_by_driver ? 'success' : 'warning'}
        label={shift.confirmed_by_driver ? 'Bestätigt' : 'Ausstehend'}
      />
    </div>

    {/* GPS-Tracking während Schicht */}
    {shift.is_active && (
      <Card>
        <CardHeader>
          <CardTitle>Live-Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 mb-4">
            <LiveMap
              drivers={[shift.driver]}
              center={shift.driver.last_position}
              showRoute={true}
              showStartEndMarkers={true}
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label>Gefahrene km</Label>
              <p className="text-xl font-bold">
                {shift.gps_total_km || 0} km
              </p>
            </div>
            <div>
              <Label>Schichtzeit</Label>
              <p className="text-xl font-bold">
                {shift.active_duration_hours} Std
              </p>
            </div>
            <div>
              <Label>Pausen</Label>
              <p className="text-xl font-bold">
                {shift.pause_duration_minutes} Min
              </p>
            </div>
            <div>
              <Label>Aufträge</Label>
              <p className="text-xl font-bold">
                {shift.bookings_count}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )}

    {/* GPS-generierte Kilometer */}
    <Card>
      <CardHeader>
        <CardTitle>Kilometerstand</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Start (GPS)</Label>
            <p className="text-xl font-bold">
              {formatNumber(shift.gps_km_start)} km
            </p>
            <p className="text-sm text-muted-foreground">
              Automatisch erfasst
            </p>
          </div>
          <div>
            <Label>Ende (GPS)</Label>
            <p className="text-xl font-bold">
              {shift.gps_km_end ? formatNumber(shift.gps_km_end) : '-'} km
            </p>
            <p className="text-sm text-muted-foreground">
              {shift.gps_km_end ? 'Automatisch erfasst' : 'Schicht läuft noch'}
            </p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-primary/5 rounded-lg">
          <p className="text-sm text-muted-foreground">
            ℹ️ Kilometerstände werden automatisch aus GPS-Daten erfasst
          </p>
        </div>
      </CardContent>
    </Card>

    {/* Aufträge während Schicht */}
    <Card>
      <CardHeader>
        <CardTitle>Aufträge</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          {shiftBookings.map((booking) => (
            <div key={booking.id} className="mb-4 p-3 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <p className="font-medium">
                  {formatTime(booking.pickup_time)}
                </p>
                <StatusIndicator status={booking.status} size="sm" />
              </div>
              <p className="text-sm">{booking.pickup_address}</p>
              <p className="text-sm text-muted-foreground">
                → {booking.dropoff_address}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {booking.gps_distance} km • {booking.gps_duration} Min
              </p>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  </div>
</DetailDialog>
```

---

### 10. Betrieb - Kommunikation (/kommunikation)

**Status:** ✅ 90% - Sehr gut, GPS-Sharing fehlt

**Aktuelle Features:**

- WhatsApp-ähnlicher Chat
- Audio/Video-Calls (Daily.co)
- Datei-Upload
- Realtime-Updates

**Fehlende Funktionen:**

- ❌ Position im Chat teilen
- ❌ "Ich bin unterwegs"-Nachricht mit ETA
- ❌ Automatische Benachrichtigungen bei GPS-Events

**Optimierungen:**

```typescript
// Chat-Fenster mit GPS-Sharing
<ChatWindow conversationId={conversationId}>
  {/* Message-Input mit GPS-Share */}
  <div className="flex items-center gap-2 p-4 border-t">
    <Button
      variant="ghost"
      size="sm"
      onClick={handleShareLocation}
    >
      <MapPin className="h-4 w-4" />
    </Button>

    <Input
      placeholder="Nachricht schreiben..."
      value={message}
      onChange={(e) => setMessage(e.target.value)}
    />

    <Button onClick={handleSend}>
      Senden
    </Button>
  </div>

  {/* GPS-Location-Message-Type */}
  {message.type === 'location' && (
    <div className="p-4 bg-primary/5 rounded-lg">
      <div className="flex items-start gap-3">
        <MapPin className="h-5 w-5 text-accent mt-1" />
        <div className="flex-1">
          <p className="font-medium mb-2">Standort geteilt</p>
          <div className="h-32 rounded-lg overflow-hidden mb-2">
            <StaticMap
              center={message.location}
              zoom={15}
              marker={message.location}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {message.location.address}
          </p>
          <Button
            size="sm"
            variant="outline"
            className="mt-2"
            onClick={() => openInMaps(message.location)}
          >
            In Karte öffnen
          </Button>
        </div>
      </div>
    </div>
  )}

  {/* ETA-Message-Type */}
  {message.type === 'eta' && (
    <div className="p-4 bg-primary/5 rounded-lg">
      <div className="flex items-start gap-3">
        <Clock className="h-5 w-5 text-accent mt-1" />
        <div>
          <p className="font-medium">Ich bin unterwegs</p>
          <p className="text-sm text-muted-foreground">
            Ankunft in ca. {message.eta.duration} Minuten
          </p>
          <p className="text-sm text-muted-foreground">
            {message.eta.distance} km entfernt
          </p>
        </div>
      </div>
    </div>
  )}
</ChatWindow>
```

---

### 11. Betrieb - Office (/office)

**Status:** ✅ 85% - Gut, GPS-Daten-Integration fehlt

**Aktuelle Features:**

- E-Mail-Vorlagen
- Brief-Erstellung
- Resend.com-Integration

**Fehlende Funktionen:**

- ❌ Fahrtnachweis per E-Mail mit Karte
- ❌ GPS-Daten in E-Mail-Templates
- ❌ Automatische Kunden-Benachrichtigung bei Fahrt-Start

**Optimierungen:**

```typescript
// E-Mail-Template mit GPS-Daten
const EMAIL_TEMPLATE_BOOKING_STARTED = `
<h2>Ihre Fahrt hat begonnen</h2>

<p>Sehr geehrte(r) {{customer_salutation}} {{customer_name}},</p>

<p>Ihr Fahrer {{driver_name}} ist unterwegs zu Ihrem Abholort.</p>

<div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
  <h3>Fahrt-Details</h3>
  <p><strong>Abholung:</strong> {{pickup_address}}</p>
  <p><strong>Ziel:</strong> {{dropoff_address}}</p>
  <p><strong>Voraussichtliche Ankunft:</strong> {{eta_minutes}} Minuten</p>
  <p><strong>Fahrzeug:</strong> {{vehicle_license_plate}} ({{vehicle_class}})</p>
</div>

<div style="margin: 20px 0;">
  <a href="{{tracking_url}}" style="background: #EADEBD; color: #323D5E; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
    🗺️ Fahrt live verfolgen
  </a>
</div>

<img src="{{static_map_url}}" alt="Route" style="width: 100%; max-width: 600px; border-radius: 8px;" />

<p>Bei Fragen erreichen Sie uns unter {{company_phone}}.</p>

<p>Mit freundlichen Grüßen<br>{{company_name}}</p>
`;

// Automatischer Versand bei Fahrt-Start
const sendBookingStartedEmail = async (booking: Booking) => {
  const eta = await calculateETA(booking.pickup_address, booking.current_driver_position);
  const trackingUrl = await generateCustomerTrackingLink(booking.id);
  const staticMapUrl = await generateStaticMap(booking.route);

  await supabase.functions.invoke("send-template-email", {
    body: {
      template: "booking_started",
      to: booking.customer.email,
      data: {
        customer_salutation: booking.customer.salutation,
        customer_name: `${booking.customer.first_name} ${booking.customer.last_name}`,
        driver_name: `${booking.driver.first_name} ${booking.driver.last_name}`,
        pickup_address: booking.pickup_address,
        dropoff_address: booking.dropoff_address,
        eta_minutes: eta.duration,
        vehicle_license_plate: booking.vehicle.license_plate,
        vehicle_class: booking.vehicle.vehicle_class,
        tracking_url: trackingUrl,
        static_map_url: staticMapUrl,
        company_phone: booking.company.phone,
        company_name: booking.company.name,
      },
    },
  });
};
```

---

### 12. Betrieb - Dokumente (/dokumente)

**Status:** ✅ 80% - Gut, GPS-bezogene Dokumente fehlen

**Aktuelle Features:**

- Dokumente-Upload
- Ablauf-Erinnerungen
- Entitäts-Zuordnung

**Fehlende Funktionen:**

- ❌ Fahrtnachweis-Dokumente (GPS-generiert)
- ❌ Schicht-Reports mit Routen-Karte
- ❌ Automatische PDF-Generierung aus GPS-Daten

**Optimierungen:**

```typescript
// Dokumente mit GPS-Kategorie
<StandardPageLayout title="Dokumente">
  {/* Filter mit GPS-Kategorie */}
  <div className="flex gap-4 mb-6">
    <Select value={filter} onValueChange={setFilter}>
      <SelectTrigger>
        <SelectValue placeholder="Dokumenttyp" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Alle</SelectItem>
        <SelectItem value="driver_license">Führerschein</SelectItem>
        <SelectItem value="vehicle_registration">Fahrzeugschein</SelectItem>
        <SelectItem value="insurance">Versicherung</SelectItem>
        <SelectItem value="trip_report">Fahrtnachweis (GPS)</SelectItem>
        <SelectItem value="shift_report">Schicht-Report (GPS)</SelectItem>
      </SelectContent>
    </Select>

    <Button onClick={handleGenerateTripReport}>
      <FileText className="h-4 w-4 mr-2" />
      Fahrtnachweis generieren
    </Button>
  </div>

  {/* Dokumente-Tabelle */}
  <DocumentsTable documents={documents} />
</StandardPageLayout>

// GPS-Fahrtnachweis-Generator
const generateTripReport = async (bookingId: string) => {
  const booking = await getBooking(bookingId);
  const gpsData = await getGPSDataForBooking(bookingId);

  const pdfContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Fahrtnachweis ${booking.id}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; }
        .header { text-align: center; margin-bottom: 40px; }
        .section { margin-bottom: 30px; }
        .map { width: 100%; height: 400px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #EADEBD; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Fahrtnachweis</h1>
        <p>Auftrag-Nr: ${booking.id}</p>
        <p>Datum: ${formatDate(booking.pickup_time)}</p>
      </div>

      <div class="section">
        <h2>Fahrt-Details</h2>
        <table>
          <tr>
            <th>Abholung</th>
            <td>${booking.pickup_address}</td>
          </tr>
          <tr>
            <th>Abholzeit</th>
            <td>${formatDateTime(gpsData.startTime)}</td>
          </tr>
          <tr>
            <th>Ziel</th>
            <td>${booking.dropoff_address}</td>
          </tr>
          <tr>
            <th>Ankunftszeit</th>
            <td>${formatDateTime(gpsData.endTime)}</td>
          </tr>
          <tr>
            <th>Gefahrene Strecke</th>
            <td>${gpsData.totalDistance} km</td>
          </tr>
          <tr>
            <th>Fahrzeit</th>
            <td>${gpsData.totalDuration} Min</td>
          </tr>
          <tr>
            <th>Wartezeit</th>
            <td>${gpsData.waitTime} Min</td>
          </tr>
        </table>
      </div>

      <div class="section">
        <h2>Route</h2>
        <img src="${gpsData.staticMapUrl}" alt="Route" class="map" />
      </div>

      <div class="section">
        <h2>Fahrer & Fahrzeug</h2>
        <table>
          <tr>
            <th>Fahrer</th>
            <td>${booking.driver.first_name} ${booking.driver.last_name}</td>
          </tr>
          <tr>
            <th>Fahrzeug</th>
            <td>${booking.vehicle.license_plate}</td>
          </tr>
          <tr>
            <th>Fahrzeugklasse</th>
            <td>${booking.vehicle.vehicle_class}</td>
          </tr>
        </table>
      </div>

      <div class="section">
        <p style="text-align: center; color: #666; font-size: 12px;">
          Dieser Fahrtnachweis wurde automatisch aus GPS-Daten generiert.
        </p>
      </div>
    </body>
    </html>
  `;

  const { data } = await supabase.functions.invoke('generate-pdf', {
    body: { html: pdfContent }
  });

  // Dokument speichern
  await supabase.from('documents').insert({
    name: `Fahrtnachweis_${booking.id}`,
    document_type: 'trip_report',
    entity_type: 'booking',
    entity_id: bookingId,
    file_url: data.url,
    company_id: booking.company_id
  });
};
```

---

### 13. Reporting - Statistiken (/statistiken)

**Status:** ✅ 70% - Gut, GPS-basierte Statistiken fehlen

**Aktuelle Features:**

- Umsatz-Charts
- Auftrags-Trends
- Fahrer-Performance

**Fehlende Funktionen:**

- ❌ GPS-basierte km-Statistiken
- ❌ Heatmap beliebter Routen
- ❌ Durchschnittsgeschwindigkeit-Analyse
- ❌ Effizienz-Analysen (Leerfahrten)

**Optimierungen:**

```typescript
// Statistiken mit GPS-Insights
<StandardPageLayout title="Statistiken">
  <Tabs defaultValue="overview">
    <TabsList>
      <TabsTrigger value="overview">Übersicht</TabsTrigger>
      <TabsTrigger value="revenue">Umsatz</TabsTrigger>
      <TabsTrigger value="drivers">Fahrer</TabsTrigger>
      <TabsTrigger value="gps">GPS-Analysen</TabsTrigger>
    </TabsList>

    {/* GPS-Analysen Tab */}
    <TabsContent value="gps">
      <div className="space-y-6">
        {/* KPI-Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <KPICard
            title="Gesamt-km"
            value={`${formatNumber(gpsStats.totalKm)} km`}
            icon={MapPin}
            trend={gpsStats.kmTrend}
          />
          <KPICard
            title="Ø Geschwindigkeit"
            value={`${gpsStats.avgSpeed} km/h`}
            icon={Gauge}
          />
          <KPICard
            title="Leerfahrten"
            value={`${gpsStats.emptyRidesPercent}%`}
            icon={TrendingDown}
            trend={-gpsStats.emptyRidesTrend}
          />
          <KPICard
            title="Effizienz"
            value={`${gpsStats.efficiency}%`}
            icon={Zap}
            trend={gpsStats.efficiencyTrend}
          />
        </div>

        {/* Routen-Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle>Beliebte Routen</CardTitle>
            <CardDescription>
              Heatmap basierend auf GPS-Daten der letzten 30 Tage
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-96">
              <HeatmapMap routes={popularRoutes} />
            </div>
          </CardContent>
        </Card>

        {/* km-Verlauf Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Kilometer-Verlauf</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={kmHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="km"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top-Routen */}
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Routen</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Von</TableHead>
                  <TableHead>Nach</TableHead>
                  <TableHead>Anzahl</TableHead>
                  <TableHead>Ø Dauer</TableHead>
                  <TableHead>Ø km</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topRoutes.map((route) => (
                  <TableRow key={route.id}>
                    <TableCell>{route.from}</TableCell>
                    <TableCell>{route.to}</TableCell>
                    <TableCell>{route.count}</TableCell>
                    <TableCell>{route.avgDuration} Min</TableCell>
                    <TableCell>{route.avgKm} km</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  </Tabs>
</StandardPageLayout>
```

---

### 14. System - Unternehmen (/unternehmen)

**Status:** ✅ 90% - Sehr gut

**Aktuelle Features:**

- Unternehmensdaten
- Landingpage-Konfigurator
- Logo-Upload
- Geschäftszeiten

**Keine GPS-Funktionen benötigt** ✅

---

### 15. System - Einstellungen (/einstellungen)

**Status:** ✅ 85% - Gut, GPS-Einstellungen fehlen

**Aktuelle Features:**

- Profil-Einstellungen
- Benachrichtigungen
- Datenschutz

**Fehlende Funktionen:**

- ❌ GPS-Datenschutz-Einstellungen
- ❌ Tracking-Intervall konfigurieren
- ❌ GPS-Daten-Retention konfigurieren

**Optimierungen:**

```typescript
// Einstellungen mit GPS-Sektion
<Tabs defaultValue="profile">
  <TabsList>
    <TabsTrigger value="profile">Profil</TabsTrigger>
    <TabsTrigger value="notifications">Benachrichtigungen</TabsTrigger>
    <TabsTrigger value="gps">GPS & Tracking</TabsTrigger>
    <TabsTrigger value="privacy">Datenschutz</TabsTrigger>
  </TabsList>

  {/* GPS-Einstellungen Tab */}
  <TabsContent value="gps">
    <Card>
      <CardHeader>
        <CardTitle>GPS-Tracking-Einstellungen</CardTitle>
        <CardDescription>
          Konfiguriere, wie GPS-Daten erfasst und gespeichert werden
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Update-Intervall */}
        <div>
          <Label>Tracking-Intervall (Sekunden)</Label>
          <Select value={gpsInterval} onValueChange={setGpsInterval}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 Sekunden (höchste Präzision)</SelectItem>
              <SelectItem value="10">10 Sekunden (empfohlen)</SelectItem>
              <SelectItem value="30">30 Sekunden (batterieschonend)</SelectItem>
              <SelectItem value="60">60 Sekunden (niedrigste Frequenz)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground mt-1">
            Kürzere Intervalle verbrauchen mehr Akku
          </p>
        </div>

        {/* Daten-Retention */}
        <div>
          <Label>GPS-Daten aufbewahren</Label>
          <Select value={gpsRetention} onValueChange={setGpsRetention}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24">24 Stunden (DSGVO-konform)</SelectItem>
              <SelectItem value="168">7 Tage</SelectItem>
              <SelectItem value="720">30 Tage</SelectItem>
              <SelectItem value="8760">1 Jahr (nur Business+)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground mt-1">
            Nach Ablauf werden GPS-Daten automatisch gelöscht
          </p>
        </div>

        {/* Fahrer-Einwilligung erzwingen */}
        <div className="flex items-center justify-between">
          <div>
            <Label>Einwilligung erzwingen</Label>
            <p className="text-sm text-muted-foreground">
              Fahrer müssen GPS-Tracking aktiv zustimmen
            </p>
          </div>
          <Switch checked={requireConsent} onCheckedChange={setRequireConsent} />
        </div>

        {/* Kunden-Tracking */}
        <div className="flex items-center justify-between">
          <div>
            <Label>Kunden-Tracking aktivieren</Label>
            <p className="text-sm text-muted-foreground">
              Kunden können Fahrer während Fahrt verfolgen
            </p>
          </div>
          <Switch checked={customerTracking} onCheckedChange={setCustomerTracking} />
        </div>

        {/* GPS-Datenschutz-Hinweis */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>DSGVO-Hinweis</AlertTitle>
          <AlertDescription>
            GPS-Daten sind personenbezogene Daten. Stellen Sie sicher, dass Ihre Fahrer informiert wurden und zugestimmt haben.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  </TabsContent>
</Tabs>
```

---

## 🎨 Konsistenz-Standards

### 1. Standard Page Layout

**PFLICHT für alle CRUD-Seiten:**

```typescript
// src/components/layout/StandardPageLayout.tsx
<div className="space-y-6">
  {/* Breadcrumbs */}
  <Breadcrumbs />

  {/* Header */}
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    <div>
      <h1 className="text-3xl font-bold">{title}</h1>
      {description && (
        <p className="text-muted-foreground mt-1">{description}</p>
      )}
    </div>
    <div className="flex gap-2">
      {actions}
    </div>
  </div>

  {/* Stats (optional) */}
  {stats && (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <KPICard key={stat.label} {...stat} />
      ))}
    </div>
  )}

  {/* Filter & Search */}
  <div className="flex flex-col sm:flex-row gap-4">
    <div className="flex-1">
      <Input
        placeholder="Suchen..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />
    </div>
    {filters}
  </div>

  {/* Content */}
  {children}
</div>
```

### 2. Standard Action Buttons

**PFLICHT-Reihenfolge:**

```typescript
// src/components/shared/StandardActionButtons.tsx
<div className="flex gap-2">
  {/* 1. Details (Eye) */}
  <Button
    variant="ghost"
    size="sm"
    onClick={onDetails}
  >
    <Eye className="h-4 w-4" />
  </Button>

  {/* 2. Edit (Pencil) */}
  <Button
    variant="ghost"
    size="sm"
    onClick={onEdit}
  >
    <Pencil className="h-4 w-4" />
  </Button>

  {/* 3. Archive (Archive) - NICHT Delete! */}
  <Button
    variant="ghost"
    size="sm"
    onClick={onArchive}
  >
    <Archive className="h-4 w-4" />
  </Button>

  {/* 4. Zusätzliche Actions (optional) */}
  {extraActions}
</div>
```

**Icon-Farben-Regel:**

- **Standard-Icons:** `text-foreground`
- **Hover:** `hover:text-accent`
- **Disabled:** `text-muted-foreground`
- **NIEMALS:** `text-green-500`, `text-red-500` etc. (nur StatusIndicator!)

### 3. Empty States

**PFLICHT bei leeren Listen:**

```typescript
// src/components/shared/EmptyState.tsx
<div className="flex flex-col items-center justify-center py-12">
  <Icon className="h-16 w-16 text-muted-foreground mb-4" />
  <h3 className="text-xl font-semibold mb-2">{title}</h3>
  <p className="text-muted-foreground text-center max-w-md mb-6">
    {description}
  </p>
  {action && (
    <Button onClick={action.onClick}>
      <Plus className="h-4 w-4 mr-2" />
      {action.label}
    </Button>
  )}
</div>
```

### 4. Detail Dialogs

**Standard-Struktur:**

```typescript
// Detail-Dialog mit Tabs
<DetailDialog open={open} onClose={onClose}>
  {/* Header mit Title + Status */}
  <div className="flex justify-between items-start mb-6">
    <div>
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-muted-foreground">{subtitle}</p>
    </div>
    <StatusIndicator status={status} size="lg" />
  </div>

  {/* Quick-Actions */}
  <div className="flex gap-2 mb-6">
    <Button variant="outline" onClick={onEdit}>
      <Pencil className="h-4 w-4 mr-2" />
      Bearbeiten
    </Button>
    <Button variant="outline" onClick={onDuplicate}>
      <Copy className="h-4 w-4 mr-2" />
      Duplizieren
    </Button>
    <Button variant="outline" onClick={onExport}>
      <Download className="h-4 w-4 mr-2" />
      Exportieren
    </Button>
  </div>

  {/* Tabs */}
  <Tabs defaultValue="info">
    <TabsList>
      <TabsTrigger value="info">Informationen</TabsTrigger>
      <TabsTrigger value="history">Historie</TabsTrigger>
      <TabsTrigger value="documents">Dokumente</TabsTrigger>
    </TabsList>

    <TabsContent value="info">
      {/* Content */}
    </TabsContent>
  </Tabs>
</DetailDialog>
```

### 5. Form-Standards

**UnifiedForm mit GPS-Integration:**

```typescript
const fields: FormField[] = [
  // Standard-Felder
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'email', label: 'E-Mail', type: 'email' },

  // Adress-Felder mit Autocomplete (HERE API)
  {
    name: 'address',
    label: 'Adresse',
    type: 'custom',
    customComponent: (
      <AddressInput
        onSelect={(address) => {
          form.setValue('address', address);
          // GPS-Koordinaten speichern
          form.setValue('latitude', address.lat);
          form.setValue('longitude', address.lng);
        }}
      />
    ),
    gridSpan: 'col-span-2'
  },

  // Weitere Felder...
];

return (
  <UnifiedForm
    form={form}
    fields={fields}
    onSubmit={handleSubmit}
    onCancel={onClose}
    submitLabel="Speichern"
    cancelLabel="Abbrechen"
  />
);
```

### 6. Mobile-Responsive-Patterns

**PFLICHT-Breakpoints:**

```typescript
// Desktop → Tablet → Mobile
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Stack → Row
<div className="flex flex-col sm:flex-row gap-4">

// Hide on Mobile
<div className="hidden sm:block">

// Show only on Mobile
<div className="block sm:hidden">

// Sidebar auf Mobile: Sheet
{isMobile ? (
  <Sheet>
    <SheetContent side="left">
      <Navigation />
    </SheetContent>
  </Sheet>
) : (
  <Sidebar>
    <Navigation />
  </Sidebar>
)}
```

---

## 🗺️ GPS-Integration Masterplan

### Phase 1: Backend-Infrastruktur (Sprint 27 - Tag 1-2)

#### Database-Änderungen

```sql
-- 1. vehicle_positions Tabelle (bereits vorhanden)
ALTER TABLE vehicle_positions ADD COLUMN IF NOT EXISTS accuracy NUMERIC;
ALTER TABLE vehicle_positions ADD COLUMN IF NOT EXISTS battery_level INTEGER;

-- 2. booking_tracking Tabelle
CREATE TABLE IF NOT EXISTS booking_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  tracking_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  customer_accessed_at TIMESTAMPTZ,
  access_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_booking_tracking_token ON booking_tracking(tracking_token);
CREATE INDEX idx_booking_tracking_expires ON booking_tracking(expires_at);

-- RLS Policy
CREATE POLICY "Public can access with valid token"
ON booking_tracking FOR SELECT
USING (expires_at > NOW());

-- 3. gps_consent Tabelle
CREATE TABLE IF NOT EXISTS gps_consent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  consent_given BOOLEAN NOT NULL DEFAULT false,
  consent_date TIMESTAMPTZ,
  consent_revoked_at TIMESTAMPTZ,
  consent_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(driver_id, company_id)
);

CREATE INDEX idx_gps_consent_driver ON gps_consent(driver_id);
CREATE INDEX idx_gps_consent_company ON gps_consent(company_id);

-- RLS Policies
CREATE POLICY "Users can view consent for their company"
ON gps_consent FOR SELECT
USING (company_id IN (
  SELECT company_id FROM profiles WHERE user_id = auth.uid()
));

CREATE POLICY "Users can update consent for their company"
ON gps_consent FOR UPDATE
USING (company_id IN (
  SELECT company_id FROM profiles WHERE user_id = auth.uid()
));

-- 4. geofence_zones Tabelle (optional)
CREATE TABLE IF NOT EXISTS geofence_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  center_lat NUMERIC(9,6) NOT NULL,
  center_lng NUMERIC(9,6) NOT NULL,
  radius_meters INTEGER NOT NULL,
  notification_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. GPS-Daten auf Bookings
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS gps_route_points JSONB;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS gps_distance NUMERIC;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS gps_duration INTEGER;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS gps_start_time TIMESTAMPTZ;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS gps_end_time TIMESTAMPTZ;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS gps_wait_time INTEGER;

-- 6. GPS-Daten auf Shifts
ALTER TABLE shifts ADD COLUMN IF NOT EXISTS gps_km_start NUMERIC;
ALTER TABLE shifts ADD COLUMN IF NOT EXISTS gps_km_end NUMERIC;
ALTER TABLE shifts ADD COLUMN IF NOT EXISTS gps_total_km NUMERIC;
ALTER TABLE shifts ADD COLUMN IF NOT EXISTS gps_route_points JSONB;

-- 7. GPS-Mileage auf Vehicles
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS gps_mileage NUMERIC DEFAULT 0;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS last_maintenance_mileage NUMERIC;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS next_maintenance_mileage NUMERIC;

-- 8. GPS-Settings auf Companies
ALTER TABLE companies ADD COLUMN IF NOT EXISTS gps_tracking_interval INTEGER DEFAULT 10;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS gps_retention_hours INTEGER DEFAULT 24;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS gps_require_consent BOOLEAN DEFAULT true;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS customer_tracking_enabled BOOLEAN DEFAULT true;
```

#### Edge Functions

**1. calculate-eta**

```typescript
// supabase/functions/calculate-eta/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { origin, destination, transportMode = "car" } = await req.json();

    const url = new URL("https://router.hereapi.com/v8/routes");
    url.searchParams.append("origin", `${origin.lat},${origin.lng}`);
    url.searchParams.append("destination", `${destination.lat},${destination.lng}`);
    url.searchParams.append("transportMode", transportMode);
    url.searchParams.append("return", "summary,polyline");
    url.searchParams.append("apikey", Deno.env.get("HERE_API_KEY")!);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      throw new Error("No route found");
    }

    const route = data.routes[0];
    const section = route.sections[0];

    return new Response(
      JSON.stringify({
        distance: Math.round(section.summary.length / 1000), // km
        duration: Math.round(section.summary.duration / 60), // minutes
        baseDuration: Math.round(section.summary.baseDuration / 60),
        trafficDelay: Math.round((section.summary.duration - section.summary.baseDuration) / 60),
        polyline: section.polyline,
        departureTime: section.departure.time,
        arrivalTime: section.arrival.time,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("ETA calculation error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
```

**2. cleanup-gps-positions**

```typescript
// supabase/functions/cleanup-gps-positions/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Hole Unternehmen mit GPS-Retention-Einstellungen
    const { data: companies } = await supabase.from("companies").select("id, gps_retention_hours");

    if (!companies) {
      throw new Error("No companies found");
    }

    let totalDeleted = 0;

    for (const company of companies) {
      const retentionHours = company.gps_retention_hours || 24;
      const cutoffDate = new Date();
      cutoffDate.setHours(cutoffDate.getHours() - retentionHours);

      const { error, count } = await supabase
        .from("vehicle_positions")
        .delete()
        .eq("company_id", company.id)
        .lt("timestamp", cutoffDate.toISOString());

      if (error) {
        console.error(`Error deleting for company ${company.id}:`, error);
      } else {
        totalDeleted += count || 0;
      }
    }

    console.log(`GPS cleanup completed: ${totalDeleted} positions deleted`);

    return new Response(
      JSON.stringify({
        success: true,
        deletedCount: totalDeleted,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("GPS cleanup error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
```

**3. notify-customer**

```typescript
// supabase/functions/notify-customer/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bookingId, notificationType } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Booking-Daten laden
    const { data: booking } = await supabase
      .from("bookings")
      .select(
        `
        *,
        customer:customers(*),
        driver:drivers(*),
        vehicle:vehicles(*),
        company:companies(*)
      `
      )
      .eq("id", bookingId)
      .single();

    if (!booking) {
      throw new Error("Booking not found");
    }

    // Tracking-Link generieren
    const trackingToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await supabase.from("booking_tracking").insert({
      booking_id: bookingId,
      tracking_token: trackingToken,
      expires_at: expiresAt.toISOString(),
    });

    const trackingUrl = `${Deno.env.get("SITE_URL")}/tracking/${trackingToken}`;

    // E-Mail-Inhalt basierend auf Typ
    let subject = "";
    let body = "";

    switch (notificationType) {
      case "driver_assigned":
        subject = "Ihr Fahrer wurde zugewiesen";
        body = `
          <h2>Ihr Fahrer ist bereit</h2>
          <p>Ihr Fahrer ${booking.driver.first_name} ${booking.driver.last_name} wurde zugewiesen.</p>
          <p><strong>Fahrzeug:</strong> ${booking.vehicle.license_plate}</p>
          <p><strong>Abholung:</strong> ${booking.pickup_address}</p>
          <p><strong>Zeit:</strong> ${new Date(booking.pickup_time).toLocaleString("de-DE")}</p>
        `;
        break;

      case "driver_on_way":
        subject = "Ihr Fahrer ist unterwegs";
        body = `
          <h2>Ihr Fahrer ist auf dem Weg</h2>
          <p>${booking.driver.first_name} ist unterwegs zu Ihrem Abholort.</p>
          <p><a href="${trackingUrl}" style="background: #EADEBD; color: #323D5E; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            🗺️ Fahrt live verfolgen
          </a></p>
        `;
        break;

      case "driver_arrived":
        subject = "Ihr Fahrer ist angekommen";
        body = `
          <h2>Ihr Fahrer ist da!</h2>
          <p>${booking.driver.first_name} ist an Ihrem Abholort angekommen.</p>
          <p><strong>Fahrzeug:</strong> ${booking.vehicle.license_plate}</p>
        `;
        break;
    }

    // E-Mail senden
    const { error: emailError } = await supabase.functions.invoke("send-template-email", {
      body: {
        to: booking.customer.email,
        subject,
        html: body,
      },
    });

    if (emailError) {
      console.error("Email error:", emailError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        trackingUrl,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Notification error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
```

---

### Phase 2: Frontend-Komponenten (Sprint 27 - Tag 3-5)

#### 1. LiveMap Component (HERE Maps Integration)

```typescript
// src/components/dashboard/LiveMap.tsx
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface LiveMapProps {
  drivers?: Array<{
    id: string;
    first_name: string;
    last_name: string;
    last_position?: {
      latitude: number;
      longitude: number;
      timestamp: string;
      speed?: number;
    };
    shift_status: 'available' | 'busy' | 'offline' | 'pause';
  }>;
  bookings?: Array<{
    id: string;
    pickup_address: string;
    dropoff_address: string;
    pickup_lat?: number;
    pickup_lng?: number;
    dropoff_lat?: number;
    dropoff_lng?: number;
    status: string;
  }>;
  center?: { lat: number; lng: number };
  zoom?: number;
  showRoutes?: boolean;
  showETAs?: boolean;
  onDriverClick?: (driverId: string) => void;
  className?: string;
}

export function LiveMap({
  drivers = [],
  bookings = [],
  center,
  zoom = 12,
  showRoutes = false,
  showETAs = false,
  onDriverClick,
  className
}: LiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<H.Map | null>(null);
  const [platform, setPlatform] = useState<H.service.Platform | null>(null);

  // Initialize HERE Maps
  useEffect(() => {
    if (!mapRef.current) return;

    const H = window.H;
    const apiKey = import.meta.env.VITE_HERE_API_KEY;

    const newPlatform = new H.service.Platform({ apikey: apiKey });
    const defaultLayers = newPlatform.createDefaultLayers();

    const newMap = new H.Map(
      mapRef.current,
      defaultLayers.vector.normal.map,
      {
        zoom,
        center: center || { lat: 48.1351, lng: 11.5820 } // München default
      }
    );

    new H.mapevents.Behavior(new H.mapevents.MapEvents(newMap));
    H.ui.UI.createDefault(newMap, defaultLayers);

    setPlatform(newPlatform);
    setMap(newMap);

    return () => {
      newMap.dispose();
    };
  }, []);

  // Add driver markers
  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    map.removeObjects(map.getObjects());

    drivers.forEach((driver) => {
      if (!driver.last_position) return;

      const { latitude, longitude } = driver.last_position;

      // Marker color based on status
      const color = {
        available: '#22c55e', // green
        busy: '#ef4444', // red
        offline: '#9ca3af', // gray
        pause: '#eab308' // yellow
      }[driver.shift_status];

      // Create SVG marker
      const svgMarkup = `
        <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="12" fill="${color}" stroke="white" stroke-width="2"/>
          <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">
            ${driver.first_name.charAt(0)}
          </text>
        </svg>
      `;

      const icon = new H.map.Icon(svgMarkup);
      const marker = new H.map.Marker(
        { lat: latitude, lng: longitude },
        { icon }
      );

      // Add click event
      marker.addEventListener('tap', () => {
        if (onDriverClick) {
          onDriverClick(driver.id);
        }
      });

      map.addObject(marker);
    });

    // Add booking markers and routes
    if (showRoutes && bookings.length > 0) {
      bookings.forEach((booking) => {
        if (booking.pickup_lat && booking.pickup_lng && booking.dropoff_lat && booking.dropoff_lng) {
          // Pickup marker
          const pickupIcon = new H.map.Icon(
            `<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="#EADEBD" stroke="#323D5E" stroke-width="2"/>
              <text x="12" y="16" text-anchor="middle" fill="#323D5E" font-size="12" font-weight="bold">A</text>
            </svg>`
          );
          map.addObject(new H.map.Marker(
            { lat: booking.pickup_lat, lng: booking.pickup_lng },
            { icon: pickupIcon }
          ));

          // Dropoff marker
          const dropoffIcon = new H.map.Icon(
            `<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="#856d4b" stroke="#323D5E" stroke-width="2"/>
              <text x="12" y="16" text-anchor="middle" fill="white" font-size="12" font-weight="bold">B</text>
            </svg>`
          );
          map.addObject(new H.map.Marker(
            { lat: booking.dropoff_lat, lng: booking.dropoff_lng },
            { icon: dropoffIcon }
          ));

          // TODO: Add route line between pickup and dropoff
        }
      });
    }
  }, [map, drivers, bookings, showRoutes, onDriverClick]);

  return (
    <div
      ref={mapRef}
      className={cn('w-full h-full rounded-lg', className)}
    />
  );
}
```

#### 2. Driver Tracking Page

```typescript
// src/pages/DriverTracking.tsx
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Power, Info } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

export function DriverTracking() {
  const { user, profile } = useAuth();
  const [tracking, setTracking] = useState(false);
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [consent, setConsent] = useState(false);
  const [activeShift, setActiveShift] = useState<any>(null);

  // Check GPS consent
  useEffect(() => {
    const checkConsent = async () => {
      if (!user || !profile?.company_id) return;

      const { data } = await supabase
        .from('gps_consent')
        .select('consent_given')
        .eq('driver_id', user.id)
        .eq('company_id', profile.company_id)
        .single();

      if (data?.consent_given) {
        setConsent(true);
      }
    };

    checkConsent();
  }, [user, profile]);

  // Check active shift
  useEffect(() => {
    const checkActiveShift = async () => {
      if (!user || !profile?.company_id) return;

      const today = new Date().toISOString().split('T')[0];

      const { data } = await supabase
        .from('shifts')
        .select('*')
        .eq('driver_id', user.id)
        .eq('company_id', profile.company_id)
        .eq('date', today)
        .is('shift_end_time', null)
        .single();

      setActiveShift(data);

      if (data && consent) {
        startTracking();
      }
    };

    if (consent) {
      checkActiveShift();
    }
  }, [user, profile, consent]);

  const startTracking = () => {
    if (!navigator.geolocation) {
      toast.error('GPS wird von diesem Gerät nicht unterstützt');
      return;
    }

    setTracking(true);

    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        setPosition(pos);

        // Send to Supabase
        if (activeShift && profile?.company_id) {
          const { error } = await supabase
            .from('vehicle_positions')
            .insert({
              vehicle_id: activeShift.vehicle_id,
              driver_id: user!.id,
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              speed: pos.coords.speed ? pos.coords.speed * 3.6 : null, // m/s to km/h
              heading: pos.coords.heading,
              accuracy: pos.coords.accuracy,
              battery_level: null, // TODO: Get battery level
              company_id: profile.company_id,
              timestamp: new Date(pos.timestamp).toISOString()
            });

          if (error) {
            console.error('GPS tracking error:', error);
          }
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast.error('GPS-Standort konnte nicht ermittelt werden');
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  };

  const handleConsentGiven = async () => {
    if (!user || !profile?.company_id) return;

    const { error } = await supabase
      .from('gps_consent')
      .upsert({
        driver_id: user.id,
        company_id: profile.company_id,
        consent_given: true,
        consent_date: new Date().toISOString(),
        consent_text: 'Ich stimme der GPS-Erfassung während meiner Schicht zu. Ich bin darüber informiert, dass die Daten nach 24 Stunden automatisch gelöscht werden.'
      });

    if (error) {
      toast.error('Fehler beim Speichern der Einwilligung');
    } else {
      setConsent(true);
      toast.success('Einwilligung gespeichert');
    }
  };

  if (!consent) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>GPS-Tracking Einwilligung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Datenschutz-Hinweis</strong>
                <p className="mt-2">
                  Um Ihren Standort während der Schicht zu erfassen, benötigen wir Ihre Zustimmung. Ihre GPS-Daten werden:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Nur während aktiver Schichten erfasst</li>
                  <li>Nach 24 Stunden automatisch gelöscht (DSGVO-konform)</li>
                  <li>Ausschließlich zur Auftrags-Optimierung verwendet</li>
                  <li>Nicht an Dritte weitergegeben</li>
                </ul>
                <p className="mt-2">
                  Sie können Ihre Einwilligung jederzeit widerrufen.
                </p>
              </AlertDescription>
            </Alert>

            <div className="flex gap-4">
              <Button onClick={handleConsentGiven} className="flex-1">
                Zustimmen
              </Button>
              <Button variant="outline" className="flex-1">
                Ablehnen
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Status-Banner */}
      <Card className={cn(
        'mb-6',
        tracking ? 'bg-status-success/10 border-status-success/30' : 'bg-status-error/10 border-status-error/30'
      )}>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                'h-3 w-3 rounded-full',
                tracking ? 'bg-status-success animate-pulse' : 'bg-status-error'
              )} />
              <div>
                <p className="font-semibold">
                  {tracking ? 'GPS-Tracking aktiv' : 'GPS-Tracking inaktiv'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {tracking ? 'Position wird alle 10 Sekunden aktualisiert' : 'Keine aktive Schicht'}
                </p>
              </div>
            </div>
            {tracking && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTracking(false)}
              >
                <Power className="h-4 w-4 mr-2" />
                Stoppen
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Aktuelle Position */}
      {position && (
        <Card>
          <CardHeader>
            <CardTitle>Aktuelle Position</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Breitengrad</p>
                <p className="font-mono">{position.coords.latitude.toFixed(6)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Längengrad</p>
                <p className="font-mono">{position.coords.longitude.toFixed(6)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Geschwindigkeit</p>
                <p className="font-mono">
                  {position.coords.speed
                    ? `${Math.round(position.coords.speed * 3.6)} km/h`
                    : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Genauigkeit</p>
                <p className="font-mono">{Math.round(position.coords.accuracy)} m</p>
              </div>
            </div>

            <Alert>
              <MapPin className="h-4 w-4" />
              <AlertDescription>
                Ihr Standort wird nur während aktiver Schichten an MyDispatch übermittelt. Alle Daten werden nach 24 Stunden automatisch gelöscht.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Schicht-Info */}
      {activeShift && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Aktive Schicht</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fahrzeug</span>
              <span className="font-medium">{activeShift.license_plate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Start</span>
              <span className="font-medium">{activeShift.shift_start_time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Datum</span>
              <span className="font-medium">
                {new Date(activeShift.date).toLocaleDateString('de-DE')}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

---

## 📅 Implementierungsplan

### Sprint 27 (7 Tage) - GPS-Integration & Konsistenz

#### Tag 1-2: Backend & Database

- ✅ Database-Migration (alle Tabellen)
- ✅ Edge Functions (calculate-eta, cleanup-gps-positions, notify-customer)
- ✅ RLS Policies
- ✅ Cron-Job Setup (cleanup alle 6h)

#### Tag 3: Core GPS Components

- ✅ LiveMap Component (HERE Maps)
- ✅ DriverTracking Page
- ✅ GPS Consent Dialog

#### Tag 4: Dashboard Integration

- ✅ Dashboard mit Live-Map
- ✅ WeatherWidget / TrafficWidget
- ✅ ActiveBookings mit ETAs
- ✅ DriverStatusList

#### Tag 5: Auftrags-Integration

- ✅ BookingDetailsDialog mit GPS
- ✅ ETA-Berechnung in Forms
- ✅ Tracking-Link-Generator
- ✅ Kunden-Benachrichtigungen

#### Tag 6: Fahrer/Fahrzeuge GPS

- ✅ DriversTable mit GPS-Status
- ✅ DriverDetailsDialog (Tracking-Tab)
- ✅ VehiclesTable mit Position
- ✅ Performance-Statistiken

#### Tag 7: Schichten & Dokumente

- ✅ Schichtzettel mit GPS-km
- ✅ GPS-Fahrtnachweis-Generator
- ✅ Statistiken GPS-Tab

---

### Sprint 28 (5 Tage) - Konsistenz-Verbesserungen

#### Tag 1-2: Layout-Standardisierung

- ✅ Alle Seiten auf StandardPageLayout migrieren
- ✅ StandardActionButtons überall einsetzen
- ✅ EmptyStates hinzufügen

#### Tag 3-4: Detail-Dialogs überarbeiten

- ✅ Einheitliche Tab-Struktur
- ✅ GPS-Tabs hinzufügen wo relevant
- ✅ Quick-Actions in Header

#### Tag 5: Mobile-Optimierungen

- ✅ Alle Breakpoints prüfen
- ✅ Sheet-Navigation für Mobile
- ✅ Touch-Optimierungen

---

### Sprint 29 (3 Tage) - Feinschliff & Testing

#### Tag 1: Performance-Optimierung

- ✅ Code Splitting
- ✅ Lazy Loading
- ✅ Memoization

#### Tag 2: Testing

- ✅ GPS-Flow End-to-End
- ✅ Mobile-Responsiveness
- ✅ Browser-Kompatibilität

#### Tag 3: Dokumentation

- ✅ User-Guide GPS-Tracking
- ✅ Admin-Handbuch
- ✅ API-Dokumentation

---

## ✅ Checkliste für Go-Live

### Funktional

- [ ] GPS-Tracking funktioniert auf iOS/Android
- [ ] Kunden-Tracking-Links funktionieren
- [ ] ETA-Berechnung präzise
- [ ] Auto-Cleanup läuft
- [ ] Alle Benachrichtigungen funktionieren

### Design

- [ ] Alle Seiten mit StandardPageLayout
- [ ] StandardActionButtons überall konsistent
- [ ] Keine direkten Farben (nur Semantic Tokens)
- [ ] Mobile-Responsive (768px Breakpoint)
- [ ] EmptyStates vorhanden

### Performance

- [ ] Ladezeit < 2s
- [ ] GPS-Update < 3s Latency
- [ ] Bundle-Size < 1.5MB
- [ ] Lighthouse Score > 90

### Sicherheit

- [ ] GPS-Consent erforderlich
- [ ] RLS Policies aktiv
- [ ] Daten-Retention eingestellt
- [ ] Token-basierter Kunden-Zugang

### Dokumentation

- [ ] User-Guide GPS
- [ ] Admin-Handbuch
- [ ] API-Docs
- [ ] Datenschutz-Hinweise

---

## 🎯 Finale KPIs (nach Umsetzung)

| Metrik                    | Vorher | Nachher | Verbesserung |
| ------------------------- | ------ | ------- | ------------ |
| Klicks zu GPS-Tracking    | -      | 2       | ✨ NEU       |
| Klicks zu Auftrag-Details | 3      | 2       | 33% weniger  |
| Zeit bis ETA-Anzeige      | -      | 1s      | ✨ NEU       |
| Konsistenz-Score          | 70%    | 100%    | +30%         |
| Mobile-Score              | 85%    | 100%    | +15%         |
| User-Satisfaction         | 80%    | 95%+    | +15%         |

---

**Status:** 📝 Dokumentation abgeschlossen  
**Nächster Schritt:** Entwickler-Approval + Sprint 27 Start

**WICHTIG:** Dieses Dokument ist die VERBINDLICHE Vorgabe für alle weiteren Entwicklungen!
