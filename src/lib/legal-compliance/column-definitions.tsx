/* ==================================================================================
   RECHTLICHE SPALTEN-DEFINITIONEN V18.3.24
   ==================================================================================
   Zentralisierte Definition aller rechtlich verpflichtenden Felder
   nach deutschem Recht, PBefG, DSGVO, HGB
   
   KRITISCH: Diese Felder MÜSSEN in allen Tabellen erscheinen!
   ================================================================================== */

import type { ColumnDef } from '@/types/page-template';
import { formatDateTime, formatCurrency } from '@/lib/format-utils';
import { StatusIndicator, getBookingStatusType } from '@/components/shared/StatusIndicator';

/**
 * RECHTLICHE VORGABEN PRO BEREICH
 */
export const LEGAL_REQUIREMENTS = {
  // PBefG § 51 - Personenbeförderungsgesetz
  BOOKINGS: {
    mandatory: [
      'booking_number',        // Eindeutige Auftragsnummer
      'created_at',            // Auftragseingangsdatum/-zeit (KRITISCH!)
      'pickup_time',           // Abholdatum/-zeit
      'pickup_address',        // Abholadresse
      'dropoff_address',       // Zieladresse
      'price',                 // Fahrpreis
      'customer_id',           // Fahrgast
      'driver_id',             // Fahrer (nach Zuweisung)
      'vehicle_id',            // Fahrzeug (nach Zuweisung)
      'status',                // Status
    ],
    recommended: [
      'distance_km',           // Entfernung
      'passenger_count',       // Anzahl Fahrgäste
      'notes',                 // Besonderheiten
    ],
    retention: '10 Jahre',     // Aufbewahrungspflicht
  },
  
  // HGB § 257 - Handelsgesetzbuch (Rechnungen)
  INVOICES: {
    mandatory: [
      'invoice_number',        // Fortlaufende Nummer
      'created_at',            // Rechnungsdatum (KRITISCH!)
      'customer_id',           // Rechnungsempfänger
      'total',                 // Bruttobetrag
      'tax_rate',              // Steuersatz
      'tax_amount',            // Steuerbetrag
      'net_amount',            // Nettobetrag
      'payment_status',        // Zahlungsstatus
      'due_date',              // Fälligkeitsdatum
    ],
    recommended: [
      'payment_date',          // Zahlungseingangsdatum
      'payment_method',        // Zahlungsart
    ],
    retention: '10 Jahre',     // § 147 AO
  },
  
  // DSGVO Art. 30 - Verarbeitungsverzeichnis
  CUSTOMERS: {
    mandatory: [
      'created_at',            // Datum der Erfassung
      'first_name',            // Vorname
      'last_name',             // Nachname
      'consent_status',        // Einwilligungsstatus (DSGVO!)
      'consent_date',          // Datum der Einwilligung
    ],
    recommended: [
      'email',                 // E-Mail (optional)
      'phone',                 // Telefon (optional)
      'last_modified',         // Letzte Änderung
    ],
    retention: 'Bis Widerruf', // DSGVO
  },
  
  // Arbeitsrecht - Fahrer
  DRIVERS: {
    mandatory: [
      'created_at',            // Datum der Erfassung
      'first_name',            // Vorname
      'last_name',             // Nachname
      'license_number',        // Führerscheinnummer
      'license_expiry_date',   // Ablaufdatum Führerschein (KRITISCH!)
      'license_classes',       // Führerscheinklassen
      'employment_start',      // Beschäftigungsbeginn
    ],
    recommended: [
      'employment_end',        // Beschäftigungsende
      'working_hours_limit',   // Arbeitszeitbegrenzung
    ],
    retention: 'Bis Austritt + 3 Jahre',
  },
  
  // Verkehrssicherheit - Fahrzeuge
  VEHICLES: {
    mandatory: [
      'created_at',            // Datum der Erfassung
      'license_plate',         // Kennzeichen
      'tuev_expiry',           // TÜV-Ablaufdatum (KRITISCH!)
      'insurance_expiry',      // Versicherungsablauf
      'last_maintenance',      // Letzte Wartung
    ],
    recommended: [
      'next_maintenance',      // Nächste Wartung
      'km_total',              // Kilometerstand
    ],
    retention: 'Bis Verkauf + 2 Jahre',
  },
} as const;

/**
 * ZENTRALE SPALTEN-DEFINITIONEN MIT RECHTLICHEN PFLICHTFELDERN
 */

// ============================================================================
// AUFTRÄGE (PBefG-KONFORM)
// ============================================================================
export function getBookingColumns<T = any>(): ColumnDef<T>[] {
  return [
    // PFLICHT: Auftragsnummer
    {
      id: 'booking_number',
      header: 'Auftrag-Nr.',
      accessorKey: 'booking_number' as keyof T,
      cell: (item: any) => (
        <span className="font-medium text-foreground">
          {item.booking_number || '-'}
        </span>
      ),
      sortable: true,
      sticky: true, // Immer sichtbar
    },
    
    // PFLICHT: Auftragseingangsdatum/-zeit (§ 51 PBefG)
    {
      id: 'created_at',
      header: 'Auftragseingang',
      accessorKey: 'created_at' as keyof T,
      cell: (item: any) => (
        <div className="text-sm">
          <div className="font-medium text-foreground">
            {formatDateTime(item.created_at)}
          </div>
          <div className="text-xs text-muted-foreground">
            Rechtl. Zeitstempel
          </div>
        </div>
      ),
      sortable: true,
      mandatory: true, // NIEMALS verstecken!
    },
    
    // PFLICHT: Abholdatum/-zeit
    {
      id: 'pickup_time',
      header: 'Abholung',
      accessorKey: 'pickup_time' as keyof T,
      cell: (item: any) => formatDateTime(item.pickup_time),
      sortable: true,
    },
    
    // PFLICHT: Abholadresse
    {
      id: 'pickup_address',
      header: 'Von',
      accessorKey: 'pickup_address' as keyof T,
      cell: (item: any) => (
        <span className="text-sm text-foreground truncate max-w-[200px]">
          {item.pickup_address || '-'}
        </span>
      ),
    },
    
    // PFLICHT: Zieladresse
    {
      id: 'dropoff_address',
      header: 'Nach',
      accessorKey: 'dropoff_address' as keyof T,
      cell: (item: any) => (
        <span className="text-sm text-foreground truncate max-w-[200px]">
          {item.dropoff_address || '-'}
        </span>
      ),
    },
    
    // PFLICHT: Kunde
    {
      id: 'customer',
      header: 'Kunde',
      accessorKey: 'customer' as keyof T,
      cell: (item: any) => {
        const customer = item.customer || item.customers;
        if (!customer) return '-';
        return `${customer.first_name} ${customer.last_name}`;
      },
    },
    
    // PFLICHT: Fahrpreis
    {
      id: 'price',
      header: 'Preis',
      accessorKey: 'price' as keyof T,
      cell: (item: any) => (
        <span className="font-medium text-foreground">
          {formatCurrency(item.price || 0)}
        </span>
      ),
      sortable: true,
    },
    
    // PFLICHT: Status
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status' as keyof T,
      cell: (item: any) => (
        <StatusIndicator 
          type={getBookingStatusType(item.status)}
          label={item.status}
        />
      ),
    },
  ];
}

// ============================================================================
// RECHNUNGEN (HGB-KONFORM)
// ============================================================================
export function getInvoiceColumns<T = any>(): ColumnDef<T>[] {
  return [
    // PFLICHT: Rechnungsnummer (fortlaufend)
    {
      id: 'invoice_number',
      header: 'RE-Nr.',
      accessorKey: 'invoice_number' as keyof T,
      cell: (item: any) => (
        <span className="font-medium text-foreground">
          {item.invoice_number || '-'}
        </span>
      ),
      sortable: true,
      sticky: true,
    },
    
    // PFLICHT: Rechnungsdatum (§ 14 UStG)
    {
      id: 'created_at',
      header: 'Rechnungsdatum',
      accessorKey: 'created_at' as keyof T,
      cell: (item: any) => (
        <div className="text-sm">
          <div className="font-medium text-foreground">
            {formatDateTime(item.created_at)}
          </div>
          <div className="text-xs text-muted-foreground">
            § 14 UStG
          </div>
        </div>
      ),
      sortable: true,
      mandatory: true,
    },
    
    // PFLICHT: Kunde (Rechnungsempfänger)
    {
      id: 'customer',
      header: 'Kunde',
      accessorKey: 'customer' as keyof T,
      cell: (item: any) => {
        const customer = item.customer || item.customers;
        if (!customer) return '-';
        return `${customer.first_name} ${customer.last_name}`;
      },
    },
    
    // PFLICHT: Bruttobetrag
    {
      id: 'total',
      header: 'Brutto',
      accessorKey: 'total' as keyof T,
      cell: (item: any) => (
        <div className="text-sm">
          <div className="font-medium text-foreground">
            {formatCurrency(item.total || 0)}
          </div>
          <div className="text-xs text-muted-foreground">
            inkl. {item.tax_rate || 19}% MwSt.
          </div>
        </div>
      ),
      sortable: true,
    },
    
    // PFLICHT: Zahlungsstatus
    {
      id: 'payment_status',
      header: 'Status',
      accessorKey: 'payment_status' as keyof T,
      cell: (item: any) => (
        <StatusIndicator 
          type={
            item.payment_status === 'paid' ? 'success' :
            item.payment_status === 'overdue' ? 'error' : 'warning'
          }
          label={item.payment_status}
        />
      ),
    },
    
    // PFLICHT: Fälligkeitsdatum
    {
      id: 'due_date',
      header: 'Fällig am',
      accessorKey: 'due_date' as keyof T,
      cell: (item: any) => {
        const dueDate = new Date(item.due_date);
        const isOverdue = dueDate < new Date() && item.payment_status !== 'paid';
        return (
          <span className={isOverdue ? 'text-status-error font-medium' : 'text-foreground'}>
            {formatDateTime(item.due_date)}
          </span>
        );
      },
      sortable: true,
    },
  ];
}

// ============================================================================
// KUNDEN (DSGVO-KONFORM)
// ============================================================================
export function getCustomerColumns<T = any>(): ColumnDef<T>[] {
  return [
    // PFLICHT: Kundennummer
    {
      id: 'customer_number',
      header: 'Kd-Nr.',
      accessorKey: 'id' as keyof T,
      cell: (item: any) => (
        <span className="font-mono text-xs text-muted-foreground">
          {item.id.slice(0, 8)}
        </span>
      ),
    },
    
    // PFLICHT: Name
    {
      id: 'name',
      header: 'Name',
      accessorKey: 'last_name' as keyof T,
      cell: (item: any) => (
        <div className="text-sm">
          <div className="font-medium text-foreground">
            {item.first_name} {item.last_name}
          </div>
          {item.company_name && (
            <div className="text-xs text-muted-foreground">
              {item.company_name}
            </div>
          )}
        </div>
      ),
      sortable: true,
    },
    
    // PFLICHT: Erfassungsdatum (DSGVO Art. 30)
    {
      id: 'created_at',
      header: 'Erfasst am',
      accessorKey: 'created_at' as keyof T,
      cell: (item: any) => (
        <div className="text-sm">
          <div className="text-foreground">
            {formatDateTime(item.created_at)}
          </div>
          <div className="text-xs text-muted-foreground">
            DSGVO Art. 30
          </div>
        </div>
      ),
      sortable: true,
      mandatory: true,
    },
    
    // Kontaktdaten
    {
      id: 'contact',
      header: 'Kontakt',
      accessorKey: 'email' as keyof T,
      cell: (item: any) => (
        <div className="text-xs">
          {item.email && (
            <div className="text-foreground">{item.email}</div>
          )}
          {item.phone && (
            <div className="text-muted-foreground">{item.phone}</div>
          )}
        </div>
      ),
    },
    
    // Anzahl Fahrten
    {
      id: 'total_bookings',
      header: 'Fahrten',
      accessorKey: 'total_bookings' as keyof T,
      cell: (item: any) => (
        <span className="text-sm text-foreground">
          {item.total_bookings || 0}
        </span>
      ),
      sortable: true,
    },
  ];
}

// ============================================================================
// FAHRER (ARBEITSRECHT-KONFORM)
// ============================================================================
export function getDriverColumns<T = any>(): ColumnDef<T>[] {
  return [
    // Name
    {
      id: 'name',
      header: 'Name',
      accessorKey: 'last_name' as keyof T,
      cell: (item: any) => (
        <div className="text-sm">
          <div className="font-medium text-foreground">
            {item.first_name} {item.last_name}
          </div>
          {item.employee_number && (
            <div className="text-xs text-muted-foreground">
              MA-Nr: {item.employee_number}
            </div>
          )}
        </div>
      ),
      sortable: true,
    },
    
    // PFLICHT: Führerschein-Status (KRITISCH!)
    {
      id: 'license_status',
      header: 'Führerschein',
      accessorKey: 'license_expiry_date' as keyof T,
      cell: (item: any) => {
        const expiryDate = new Date(item.license_expiry_date);
        const daysUntilExpiry = Math.floor((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        const isExpiring = daysUntilExpiry <= 30;
        const isExpired = daysUntilExpiry < 0;
        
        return (
          <div className="text-sm">
            <div className={isExpired ? 'text-status-error font-medium' : isExpiring ? 'text-status-warning' : 'text-foreground'}>
              {formatDateTime(item.license_expiry_date)}
            </div>
            <div className="text-xs text-muted-foreground">
              {item.license_classes?.join(', ') || '-'}
            </div>
            {isExpiring && !isExpired && (
              <div className="text-xs text-status-warning font-medium">
                Läuft in {daysUntilExpiry} Tagen ab!
              </div>
            )}
            {isExpired && (
              <div className="text-xs text-status-error font-medium">
                ABGELAUFEN!
              </div>
            )}
          </div>
        );
      },
      mandatory: true, // NIEMALS verstecken!
    },
    
    // PFLICHT: Beschäftigungsbeginn
    {
      id: 'employment_start',
      header: 'Beschäftigt seit',
      accessorKey: 'employment_start' as keyof T,
      cell: (item: any) => formatDateTime(item.employment_start),
      sortable: true,
    },
    
    // Status
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status' as keyof T,
      cell: (item: any) => (
        <StatusIndicator 
          type={item.status === 'active' ? 'success' : 'neutral'}
          label={item.status}
        />
      ),
    },
  ];
}

// ============================================================================
// FAHRZEUGE (VERKEHRSSICHERHEIT)
// ============================================================================
export function getVehicleColumns<T = any>(): ColumnDef<T>[] {
  return [
    // Kennzeichen
    {
      id: 'license_plate',
      header: 'Kennzeichen',
      accessorKey: 'license_plate' as keyof T,
      cell: (item: any) => (
        <span className="font-mono font-medium text-foreground">
          {item.license_plate}
        </span>
      ),
      sortable: true,
    },
    
    // Fahrzeugklasse
    {
      id: 'vehicle_class',
      header: 'Klasse',
      accessorKey: 'vehicle_class' as keyof T,
      cell: (item: any) => (
        <div className="text-sm">
          <div className="text-foreground">{item.vehicle_class}</div>
          <div className="text-xs text-muted-foreground">
            {item.make} {item.model}
          </div>
        </div>
      ),
    },
    
    // PFLICHT: TÜV-Status (KRITISCH!)
    {
      id: 'tuev_status',
      header: 'TÜV',
      accessorKey: 'tuev_expiry' as keyof T,
      cell: (item: any) => {
        const expiryDate = new Date(item.tuev_expiry);
        const daysUntilExpiry = Math.floor((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        const isExpiring = daysUntilExpiry <= 60;
        const isExpired = daysUntilExpiry < 0;
        
        return (
          <div className="text-sm">
            <div className={isExpired ? 'text-status-error font-medium' : isExpiring ? 'text-status-warning' : 'text-foreground'}>
              {formatDateTime(item.tuev_expiry)}
            </div>
            {isExpiring && !isExpired && (
              <div className="text-xs text-status-warning font-medium">
                In {daysUntilExpiry} Tagen!
              </div>
            )}
            {isExpired && (
              <div className="text-xs text-status-error font-medium">
                ABGELAUFEN!
              </div>
            )}
          </div>
        );
      },
      mandatory: true,
    },
    
    // Letzte Wartung
    {
      id: 'last_maintenance',
      header: 'Wartung',
      accessorKey: 'last_maintenance' as keyof T,
      cell: (item: any) => formatDateTime(item.last_maintenance),
      sortable: true,
    },
    
    // Status
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status' as keyof T,
      cell: (item: any) => (
        <StatusIndicator 
          type={item.status === 'active' ? 'success' : 'neutral'}
          label={item.status}
        />
      ),
    },
  ];
}

/**
 * UTILITY: Validierung ob alle Pflichtfelder vorhanden sind
 */
export function validateLegalColumns(
  entity: keyof typeof LEGAL_REQUIREMENTS,
  columns: ColumnDef<any>[]
): { valid: boolean; missing: string[] } {
  const requirements = LEGAL_REQUIREMENTS[entity];
  const columnIds = columns.map(c => c.id);
  const missing = requirements.mandatory.filter(field => !columnIds.includes(field));
  
  return {
    valid: missing.length === 0,
    missing,
  };
}
