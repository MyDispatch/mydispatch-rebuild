# 👥 KUNDEN-PORTAL ERWEITERUNGEN V18.3

**Datum:** 18.10.2025  
**Version:** V18.3 KONZEPT  
**Status:** 📋 GEPLANT - Self-Service-Portal für Kunden

---

## 🎯 ÜBERSICHT

Das Kunden-Portal ermöglicht Geschäftskunden einen Self-Service-Zugang zur Buchung, Verwaltung und Übersicht ihrer Aufträge.

**URL:** `/portal/customer` (Separate Auth oder Magic-Link)

---

## ✅ IMPLEMENTIERTER STAND (V18.2.31)

### 1. Basis-Funktionalität

- ✅ Booking-Widget (öffentlich)
- ✅ Buchungs-Bestätigung per Email
- ✅ Rechnung per Email

### 2. Limitierungen

- ❌ Kein Login-Portal
- ❌ Keine Buchungs-Historie
- ❌ Keine Rechnungs-Übersicht
- ❌ Keine Selbstverwaltung

---

## 🚀 GEPLANTE ERWEITERUNGEN (V18.3)

### 1. Customer-Portal Dashboard

**Ziel:** Self-Service-Portal für Geschäftskunden

**Features:**

```tsx
<CustomerPortalDashboard>
  {/* Willkommen */}
  <WelcomeCard
    customerName={customer.name}
    outstandingBalance={customer.outstanding_balance}
    creditLimit={customer.credit_limit}
  />

  {/* Schnellbuchung */}
  <QuickBookingCard
    onBook={() => navigate("/portal/customer/book")}
    recentRoutes={[
      { from: "München HBF", to: "Flughafen" },
      { from: "Büro", to: "Hotel Marriott" },
    ]}
  />

  {/* Letzte Buchungen */}
  <RecentBookingsCard
    bookings={recentBookings.slice(0, 5)}
    onViewAll={() => navigate("/portal/customer/bookings")}
  />

  {/* Offene Rechnungen */}
  <OutstandingInvoicesCard
    invoices={overdueInvoices}
    totalAmount={totalOutstanding}
    onPay={(invoiceId) => handlePayment(invoiceId)}
  />
</CustomerPortalDashboard>
```

### 2. Buchungs-Historie

**Features:**

- Alle bisherigen Buchungen
- Filter & Suche
- Status-Übersicht
- PDF-Download
- Wiederholung-Funktion

**Implementierung:**

```tsx
<BookingHistory>
  {/* Filter */}
  <FilterBar>
    <Select value={statusFilter} onChange={setStatusFilter}>
      <option value="all">Alle Status</option>
      <option value="completed">Abgeschlossen</option>
      <option value="cancelled">Storniert</option>
    </Select>
    <DateRangePicker startDate={startDate} endDate={endDate} onChange={handleDateChange} />
  </FilterBar>

  {/* Buchungen-Liste */}
  <div className="space-y-4">
    {bookings.map((booking) => (
      <BookingCard key={booking.id}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">{format(booking.pickup_time, "dd.MM.yyyy HH:mm")}</h3>
            <p className="text-sm text-muted-foreground">
              {booking.pickup_address} → {booking.dropoff_address}
            </p>
          </div>
          <Badge variant={getStatusVariant(booking.status)}>{booking.status}</Badge>
        </div>

        <div className="flex gap-2 mt-3">
          <Button size="sm" variant="outline" onClick={() => downloadPDF(booking.id)}>
            <FileDown className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button size="sm" onClick={() => repeatBooking(booking)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Wiederholen
          </Button>
        </div>
      </BookingCard>
    ))}
  </div>
</BookingHistory>
```

### 3. Rechnungs-Übersicht

**Features:**

- Alle Rechnungen
- Zahlungsstatus
- PDF-Download
- Online-Zahlung (Stripe)
- Mahnwesen-Anzeige

**Implementierung:**

```tsx
<InvoiceOverview>
  {/* Finanz-Übersicht */}
  <FinancialSummary>
    <KPICard
      title="Offener Betrag"
      value={formatCurrency(totalOutstanding)}
      variant={totalOutstanding > 0 ? "warning" : "success"}
    />
    <KPICard
      title="Kreditlimit"
      value={formatCurrency(customer.credit_limit)}
      progress={(totalOutstanding / customer.credit_limit) * 100}
    />
    <KPICard title="Umsatz (Jahr)" value={formatCurrency(yearlyRevenue)} />
  </FinancialSummary>

  {/* Rechnungen-Liste */}
  <InvoiceList>
    {invoices.map((invoice) => (
      <InvoiceCard key={invoice.id}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">{invoice.invoice_number}</h3>
            <p className="text-sm text-muted-foreground">
              Datum: {format(invoice.invoice_date, "dd.MM.yyyy")}
            </p>
            <p className="text-sm text-muted-foreground">
              Fällig: {format(invoice.due_date, "dd.MM.yyyy")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">{formatCurrency(invoice.total)}</p>
            <Badge variant={getPaymentStatusVariant(invoice.payment_status)}>
              {invoice.payment_status}
            </Badge>
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          <Button size="sm" variant="outline" onClick={() => downloadPDF(invoice.id)}>
            <FileDown className="h-4 w-4 mr-2" />
            PDF
          </Button>
          {invoice.payment_status === "pending" && (
            <Button size="sm" onClick={() => payOnline(invoice.id)}>
              <CreditCard className="h-4 w-4 mr-2" />
              Jetzt bezahlen
            </Button>
          )}
        </div>
      </InvoiceCard>
    ))}
  </InvoiceList>
</InvoiceOverview>
```

### 4. Erweiterte Buchungs-Optionen

**Features:**

- Template-Buchungen (Favoriten)
- Wiederholende Buchungen (täglich, wöchentlich)
- Multi-Stop-Buchungen
- Gruppen-Buchungen
- Sonderausstattung

**Implementierung:**

```tsx
<AdvancedBookingForm>
  {/* Buchungs-Template */}
  <TemplateSelector templates={savedTemplates} onSelect={loadTemplate} />

  {/* Wiederholung */}
  <RecurringOptions>
    <Switch checked={isRecurring} onCheckedChange={setIsRecurring} label="Wiederkehrende Buchung" />
    {isRecurring && (
      <div className="space-y-3">
        <Select value={frequency} onChange={setFrequency}>
          <option value="daily">Täglich</option>
          <option value="weekly">Wöchentlich</option>
          <option value="monthly">Monatlich</option>
        </Select>
        <DatePicker label="Endedatum" value={endDate} onChange={setEndDate} />
      </div>
    )}
  </RecurringOptions>

  {/* Multi-Stop */}
  <MultiStopOptions>
    <Button type="button" variant="outline" onClick={addStop}>
      <Plus className="h-4 w-4 mr-2" />
      Zwischenstopp hinzufügen
    </Button>
    {stops.map((stop, index) => (
      <AddressInput
        key={index}
        value={stop}
        onChange={(value) => updateStop(index, value)}
        onRemove={() => removeStop(index)}
      />
    ))}
  </MultiStopOptions>

  {/* Sonderausstattung */}
  <SpecialEquipment>
    <Checkbox
      checked={equipment.childSeat}
      onCheckedChange={(checked) => setEquipment({ ...equipment, childSeat: checked })}
      label="Kindersitz"
    />
    <Checkbox
      checked={equipment.wheelchair}
      onCheckedChange={(checked) => setEquipment({ ...equipment, wheelchair: checked })}
      label="Rollstuhlgerecht"
    />
    <Checkbox
      checked={equipment.animalTransport}
      onCheckedChange={(checked) => setEquipment({ ...equipment, animalTransport: checked })}
      label="Tiertransport"
    />
  </SpecialEquipment>
</AdvancedBookingForm>
```

### 5. Kostenstellen-Verwaltung

**Features:**

- Eigene Kostenstellen anlegen
- Buchungen zuordnen
- Auswertungen nach Kostenstelle
- Export für Buchhaltung

**Implementierung:**

```tsx
<CostCenterManagement>
  {/* Kostenstellen-Liste */}
  <CostCenterList>
    {costCenters.map((cc) => (
      <CostCenterCard key={cc.id}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">{cc.name}</h3>
            <p className="text-sm text-muted-foreground">{cc.description}</p>
          </div>
          <Badge variant="outline">{cc.bookings_count} Fahrten</Badge>
        </div>
        <div className="mt-2">
          <p className="text-lg font-bold">{formatCurrency(cc.total_spending)}</p>
          <p className="text-xs text-muted-foreground">Gesamtausgaben</p>
        </div>
      </CostCenterCard>
    ))}
  </CostCenterList>

  {/* Neue Kostenstelle */}
  <Button onClick={() => setShowCreateDialog(true)}>
    <Plus className="h-4 w-4 mr-2" />
    Kostenstelle hinzufügen
  </Button>

  {/* Export */}
  <Button variant="outline" onClick={exportToCSV}>
    <FileDown className="h-4 w-4 mr-2" />
    CSV exportieren
  </Button>
</CostCenterManagement>
```

### 6. Live-Tracking (Aktive Fahrt)

**Features:**

- Echtzeit-Position des Fahrzeugs
- ETA (Estimated Time of Arrival)
- Fahrer-Info
- Kontakt-Möglichkeit

**Implementierung:**

```tsx
<LiveTrackingView bookingId={activeBookingId}>
  {/* Karte mit Fahrzeug-Position */}
  <HEREMapComponent
    center={vehiclePosition}
    markers={[
      { position: pickupLocation, type: "pickup", label: "Abholung" },
      { position: vehiclePosition, type: "vehicle", label: "Fahrzeug" },
      { position: dropoffLocation, type: "dropoff", label: "Ziel" },
    ]}
    route={plannedRoute}
  />

  {/* ETA-Banner */}
  <ETABanner>
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-full bg-accent/10">
        <Navigation className="h-5 w-5 text-accent" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Ankunft in</p>
        <p className="text-2xl font-bold">{eta} Min</p>
      </div>
    </div>
  </ETABanner>

  {/* Fahrer-Info */}
  <DriverInfoCard>
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src={driver.profile_image_url} />
        <AvatarFallback>{driver.initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h4 className="font-semibold">{driver.name}</h4>
        <p className="text-sm text-muted-foreground">
          {vehicle.license_plate} • {vehicle.vehicle_class}
        </p>
      </div>
      <Button size="sm" variant="outline" onClick={() => callDriver()}>
        <Phone className="h-4 w-4" />
      </Button>
    </div>
  </DriverInfoCard>
</LiveTrackingView>
```

### 7. Profil-Verwaltung

**Features:**

- Stammdaten ändern
- Rechnungsadresse
- Präferenzen
- Benachrichtigungen

**Implementierung:**

```tsx
<CustomerProfile>
  {/* Stammdaten */}
  <ProfileSection title="Stammdaten">
    <PersonFormFields form={profileForm} showSalutation={true} showTitle={true} />
  </ProfileSection>

  {/* Rechnungsadresse */}
  <ProfileSection title="Rechnungsadresse">
    <Switch
      checked={useSeparateBillingAddress}
      onCheckedChange={setUseSeparateBillingAddress}
      label="Abweichende Rechnungsadresse"
    />
    {useSeparateBillingAddress && <AddressFields prefix="billing_" form={profileForm} />}
  </ProfileSection>

  {/* Präferenzen */}
  <ProfileSection title="Präferenzen">
    <Select
      label="Bevorzugte Fahrzeugklasse"
      value={preferences.vehicle_class}
      onChange={(value) => updatePreference("vehicle_class", value)}
    >
      <option value="Standard">Standard</option>
      <option value="Business">Business</option>
      <option value="Van">Van</option>
    </Select>
    <Switch
      checked={preferences.auto_assign_cost_center}
      onCheckedChange={(checked) => updatePreference("auto_assign_cost_center", checked)}
      label="Kostenstelle automatisch zuweisen"
    />
  </ProfileSection>

  {/* Benachrichtigungen */}
  <ProfileSection title="Benachrichtigungen">
    <Switch
      checked={notifications.booking_confirmation}
      onCheckedChange={(checked) => updateNotification("booking_confirmation", checked)}
      label="Buchungsbestätigungen"
    />
    <Switch
      checked={notifications.invoice_received}
      onCheckedChange={(checked) => updateNotification("invoice_received", checked)}
      label="Neue Rechnungen"
    />
    <Switch
      checked={notifications.payment_reminder}
      onCheckedChange={(checked) => updateNotification("payment_reminder", checked)}
      label="Zahlungserinnerungen"
    />
  </ProfileSection>
</CustomerProfile>
```

---

## 🔐 SICHERHEIT & DATENSCHUTZ

### Authentifizierung

**Option 1: Magic-Link (empfohlen)**

```typescript
// Passwordless Login
const sendMagicLink = async (email: string) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/portal/customer`,
    },
  });
};
```

**Option 2: Passwort-Login**

```typescript
// Standard Login
const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
};
```

### RLS Policies

```sql
-- Kunden können nur ihre eigenen Buchungen sehen
CREATE POLICY "Customers can view their own bookings"
ON bookings FOR SELECT
USING (customer_id IN (
  SELECT id FROM customers WHERE id = auth.uid()
));

-- Kunden können Buchungen erstellen
CREATE POLICY "Customers can create bookings"
ON bookings FOR INSERT
WITH CHECK (customer_id = auth.uid());

-- Kunden können nur ihre eigenen Rechnungen sehen
CREATE POLICY "Customers can view their invoices"
ON invoices FOR SELECT
USING (customer_id IN (
  SELECT id FROM customers WHERE id = auth.uid()
));
```

---

## 📊 IMPLEMENTIERUNGSPLAN (Kunden-Portal V18.3)

### Phase 1: Basis-Portal (3 Wochen)

- [ ] Dashboard
- [ ] Buchungs-Historie
- [ ] Magic-Link-Auth

### Phase 2: Rechnungen & Zahlung (2 Wochen)

- [ ] Rechnungs-Übersicht
- [ ] Online-Zahlung (Stripe)
- [ ] PDF-Download

### Phase 3: Erweiterte Buchung (3 Wochen)

- [ ] Templates
- [ ] Wiederholende Buchungen
- [ ] Multi-Stop
- [ ] Sonderausstattung

### Phase 4: Kostenstellen (2 Wochen)

- [ ] Kostenstellen-Verwaltung
- [ ] Zuordnung bei Buchung
- [ ] Auswertungen
- [ ] CSV-Export

### Phase 5: Live-Tracking (2 Wochen)

- [ ] Echtzeit-Karte
- [ ] ETA-Anzeige
- [ ] Fahrer-Kontakt

### Phase 6: Profil & Einstellungen (1 Woche)

- [ ] Profil-Verwaltung
- [ ] Präferenzen
- [ ] Benachrichtigungen

---

**Gesamtaufwand:** ~13 Wochen  
**Priorität:** 🟢 NIEDRIG (nach Fahrer-Portal)  
**Business-Value:** MITTEL (Kundenzufriedenheit, Selbstbedienung)

---

**Version History:**

- V18.3.0 (18.10.2025) - Konzept für Kunden-Portal
