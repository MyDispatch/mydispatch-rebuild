/* ==================================================================================
   COMPLIANCE-CHECKER V18.3.24
   ==================================================================================
   Systemweite Validierung aller rechtlichen Vorgaben
   - PBefG (Personenbeförderungsgesetz)
   - HGB (Handelsgesetzbuch)
   - DSGVO (Datenschutz-Grundverordnung)
   - UStG (Umsatzsteuergesetz)
   ================================================================================== */

import { LEGAL_REQUIREMENTS } from "./column-definitions";
import { logger } from "@/lib/logger";

/**
 * RECHTLICHE PRÜFUNGEN PRO ENTITY
 */

// ============================================================================
// AUFTRÄGE - PBefG § 51 Prüfung
// ============================================================================
export function validateBookingCompliance(booking: any): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // PFLICHT: Auftragsnummer
  if (!booking.booking_number) {
    errors.push("Auftragsnummer fehlt (PBefG § 51)");
  }

  // KRITISCH: Auftragseingangsdatum/-zeit
  if (!booking.created_at) {
    errors.push("Auftragseingangsdatum/-zeit fehlt (PBefG § 51 - RECHTLICH ZWINGEND!)");
  }

  // PFLICHT: Abholdatum/-zeit
  if (!booking.pickup_time) {
    errors.push("Abholdatum/-zeit fehlt");
  }

  // PFLICHT: Abholadresse
  if (!booking.pickup_address) {
    errors.push("Abholadresse fehlt");
  }

  // PFLICHT: Zieladresse
  if (!booking.dropoff_address) {
    errors.push("Zieladresse fehlt");
  }

  // PFLICHT: Fahrpreis
  if (booking.price === null || booking.price === undefined) {
    errors.push("Fahrpreis fehlt");
  }

  // PFLICHT: Kunde
  if (!booking.customer_id) {
    errors.push("Kunde fehlt");
  }

  // WARNUNG: Fahrer/Fahrzeug (erst nach Zuweisung)
  if (booking.status !== "pending" && !booking.driver_id) {
    warnings.push("Fahrer nicht zugewiesen");
  }

  if (booking.status !== "pending" && !booking.vehicle_id) {
    warnings.push("Fahrzeug nicht zugewiesen");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// RECHNUNGEN - HGB § 257, UStG § 14 Prüfung
// ============================================================================
export function validateInvoiceCompliance(invoice: any): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // PFLICHT: Fortlaufende Rechnungsnummer (§ 14 UStG)
  if (!invoice.invoice_number) {
    errors.push("Rechnungsnummer fehlt (§ 14 Abs. 4 Nr. 4 UStG)");
  }

  // KRITISCH: Rechnungsdatum
  if (!invoice.created_at) {
    errors.push("Rechnungsdatum fehlt (§ 14 Abs. 4 Nr. 1 UStG)");
  }

  // PFLICHT: Kunde (Rechnungsempfänger)
  if (!invoice.customer_id) {
    errors.push("Rechnungsempfänger fehlt (§ 14 Abs. 4 Nr. 1 UStG)");
  }

  // PFLICHT: Bruttobetrag
  if (invoice.total === null || invoice.total === undefined) {
    errors.push("Bruttobetrag fehlt (§ 14 Abs. 4 Nr. 3 UStG)");
  }

  // PFLICHT: Steuersatz (§ 14 Abs. 4 Nr. 8 UStG)
  if (!invoice.tax_rate) {
    errors.push("Steuersatz fehlt (§ 14 Abs. 4 Nr. 8 UStG)");
  }

  // PFLICHT: Steuerbetrag (§ 14 Abs. 4 Nr. 8 UStG)
  if (invoice.tax_amount === null || invoice.tax_amount === undefined) {
    errors.push("Steuerbetrag fehlt (§ 14 Abs. 4 Nr. 8 UStG)");
  }

  // PFLICHT: Nettobetrag (§ 14 Abs. 4 Nr. 3 UStG)
  if (invoice.net_amount === null || invoice.net_amount === undefined) {
    errors.push("Nettobetrag fehlt (§ 14 Abs. 4 Nr. 3 UStG)");
  }

  // PFLICHT: Fälligkeitsdatum
  if (!invoice.due_date) {
    warnings.push("Fälligkeitsdatum fehlt (empfohlen für Zahlungsverfolgung)");
  }

  // Validierung: Beträge korrekt?
  if (invoice.net_amount && invoice.tax_amount && invoice.total) {
    const calculatedTotal = invoice.net_amount + invoice.tax_amount;
    if (Math.abs(calculatedTotal - invoice.total) > 0.01) {
      errors.push(
        `Betragsberechnung inkorrekt: Netto ${invoice.net_amount} + MwSt ${invoice.tax_amount} ≠ Brutto ${invoice.total}`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// KUNDEN - DSGVO Art. 30 Prüfung
// ============================================================================
export function validateCustomerCompliance(customer: any): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // PFLICHT: Erfassungsdatum (DSGVO Art. 30)
  if (!customer.created_at) {
    errors.push("Erfassungsdatum fehlt (DSGVO Art. 30 Verarbeitungsverzeichnis)");
  }

  // PFLICHT: Name
  if (!customer.first_name || !customer.last_name) {
    errors.push("Vor- oder Nachname fehlt");
  }

  // WARNUNG: Einwilligungsstatus
  if (!customer.consent_status) {
    warnings.push("Einwilligungsstatus nicht dokumentiert (DSGVO Art. 6)");
  }

  // WARNUNG: Datum der Einwilligung
  if (customer.consent_status === "given" && !customer.consent_date) {
    warnings.push("Datum der Einwilligung fehlt (DSGVO Art. 7 Abs. 1)");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// FAHRER - Arbeitsrecht + Verkehrssicherheit
// ============================================================================
export function validateDriverCompliance(driver: any): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // PFLICHT: Erfassungsdatum
  if (!driver.created_at) {
    errors.push("Erfassungsdatum fehlt");
  }

  // PFLICHT: Name
  if (!driver.first_name || !driver.last_name) {
    errors.push("Vor- oder Nachname fehlt");
  }

  // KRITISCH: Führerschein
  if (!driver.license_number) {
    errors.push("Führerscheinnummer fehlt (KRITISCH für Einsatz!)");
  }

  // KRITISCH: Ablaufdatum Führerschein
  if (!driver.license_expiry_date) {
    errors.push("Ablaufdatum Führerschein fehlt (KRITISCH!)");
  } else {
    const expiryDate = new Date(driver.license_expiry_date);
    const daysUntilExpiry = Math.floor((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) {
      errors.push("Führerschein ABGELAUFEN! Fahrer darf NICHT mehr eingesetzt werden!");
    } else if (daysUntilExpiry <= 30) {
      warnings.push(`Führerschein läuft in ${daysUntilExpiry} Tagen ab!`);
    }
  }

  // PFLICHT: Führerscheinklassen
  if (!driver.license_classes || driver.license_classes.length === 0) {
    warnings.push("Führerscheinklassen nicht angegeben");
  }

  // PFLICHT: Beschäftigungsbeginn
  if (!driver.employment_start) {
    errors.push("Beschäftigungsbeginn fehlt (Arbeitsrecht)");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// FAHRZEUGE - Verkehrssicherheit
// ============================================================================
export function validateVehicleCompliance(vehicle: any): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // PFLICHT: Kennzeichen
  if (!vehicle.license_plate) {
    errors.push("Kennzeichen fehlt");
  }

  // KRITISCH: TÜV-Ablaufdatum
  if (!vehicle.tuev_expiry) {
    errors.push("TÜV-Ablaufdatum fehlt (KRITISCH!)");
  } else {
    const expiryDate = new Date(vehicle.tuev_expiry);
    const daysUntilExpiry = Math.floor((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) {
      errors.push("TÜV ABGELAUFEN! Fahrzeug darf NICHT mehr eingesetzt werden!");
    } else if (daysUntilExpiry <= 60) {
      warnings.push(`TÜV läuft in ${daysUntilExpiry} Tagen ab!`);
    }
  }

  // PFLICHT: Versicherungsablauf
  if (!vehicle.insurance_expiry) {
    errors.push("Versicherungsablauf fehlt");
  } else {
    const expiryDate = new Date(vehicle.insurance_expiry);
    const daysUntilExpiry = Math.floor((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) {
      errors.push("Versicherung ABGELAUFEN! Fahrzeug darf NICHT mehr eingesetzt werden!");
    } else if (daysUntilExpiry <= 30) {
      warnings.push(`Versicherung läuft in ${daysUntilExpiry} Tagen ab!`);
    }
  }

  // WARNUNG: Letzte Wartung
  if (!vehicle.last_maintenance) {
    warnings.push("Letzte Wartung nicht dokumentiert");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * SYSTEMWEITER COMPLIANCE-CHECK
 * Gibt alle Verstöße im System zurück
 */
export async function runSystemComplianceCheck(supabase: any, companyId: string) {
  const results = {
    bookings: { errors: 0, warnings: 0 },
    invoices: { errors: 0, warnings: 0 },
    customers: { errors: 0, warnings: 0 },
    drivers: { errors: 0, warnings: 0 },
    vehicles: { errors: 0, warnings: 0 },
  };

  // Check Bookings
  const { data: bookings } = await supabase
    .from("bookings")
    .select("*")
    .eq("company_id", companyId)
    .eq("archived", false);

  bookings?.forEach((booking: any) => {
    const check = validateBookingCompliance(booking);
    results.bookings.errors += check.errors.length;
    results.bookings.warnings += check.warnings.length;
  });

  // Check Invoices
  const { data: invoices } = await supabase
    .from("invoices")
    .select("*")
    .eq("company_id", companyId);

  invoices?.forEach((invoice: any) => {
    const check = validateInvoiceCompliance(invoice);
    results.invoices.errors += check.errors.length;
    results.invoices.warnings += check.warnings.length;
  });

  // Check Customers
  const { data: customers } = await supabase
    .from("customers")
    .select("*")
    .eq("company_id", companyId)
    .eq("archived", false);

  customers?.forEach((customer: any) => {
    const check = validateCustomerCompliance(customer);
    results.customers.errors += check.errors.length;
    results.customers.warnings += check.warnings.length;
  });

  // Check Drivers
  const { data: drivers } = await supabase
    .from("drivers")
    .select("*")
    .eq("company_id", companyId)
    .eq("archived", false);

  drivers?.forEach((driver: any) => {
    const check = validateDriverCompliance(driver);
    results.drivers.errors += check.errors.length;
    results.drivers.warnings += check.warnings.length;
  });

  // Check Vehicles
  const { data: vehicles } = await supabase
    .from("vehicles")
    .select("*")
    .eq("company_id", companyId)
    .eq("archived", false);

  vehicles?.forEach((vehicle: any) => {
    const check = validateVehicleCompliance(vehicle);
    results.vehicles.errors += check.errors.length;
    results.vehicles.warnings += check.warnings.length;
  });

  return results;
}

/**
 * AUTOMATISCHE COMPLIANCE-WARNUNG
 * Zeigt Warnungen bei kritischen Verstößen
 */
export function showComplianceWarnings(results: any) {
  const totalErrors = Object.values(results).reduce(
    (sum: number, r: any) => sum + (r.errors || 0),
    0
  );
  const totalWarnings = Object.values(results).reduce(
    (sum: number, r: any) => sum + (r.warnings || 0),
    0
  );

  if ((totalErrors as number) > 0) {
    logger.error(
      `⚠️ RECHTLICHE VERSTÖSSE: ${totalErrors} kritische Fehler gefunden!`,
      new Error("Compliance violations"),
      {
        component: "ComplianceChecker",
        results,
      }
    );
    return {
      type: "error" as const,
      message: `KRITISCH: ${totalErrors} rechtliche Verstöße gefunden!`,
      details: results,
    };
  }

  if ((totalWarnings as number) > 0) {
    logger.warn(`⚠️ COMPLIANCE-WARNUNGEN: ${totalWarnings} Warnungen gefunden`, {
      component: "ComplianceChecker",
      results,
    });
    return {
      type: "warning" as const,
      message: `${totalWarnings} Compliance-Warnungen`,
      details: results,
    };
  }

  return {
    type: "success" as const,
    message: "Alle rechtlichen Vorgaben eingehalten ✓",
    details: results,
  };
}
