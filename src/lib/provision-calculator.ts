/* ==================================================================================
   PROVISIONS-KALKULATION - FLEXIBLE LÖSUNG
   ==================================================================================
   Automatische Berechnung mit manueller Override-Option
   ================================================================================== */

export interface ProvisionCalculation {
  type: 'manual' | 'automatic' | 'none';
  amount: number;
  rate?: number;
  basePrice?: number;
}

/**
 * Berechnet die Provision für einen Partner-Auftrag
 * 
 * Priorität:
 * 1. Manuell eingegebener Betrag (partner_provision_manual)
 * 2. Automatische Berechnung (price * provision_rate)
 * 3. Keine Provision
 * 
 * @param price - Auftragspreis
 * @param provisionRate - Provisions-Prozentsatz (0-100)
 * @param manualProvision - Manuell eingegebener Betrag (optional)
 */
export function calculateProvision(
  price: number,
  provisionRate: number = 0,
  manualProvision?: number | null
): ProvisionCalculation {
  // Priorität 1: Manuell eingegebener Betrag
  if (manualProvision !== null && manualProvision !== undefined && manualProvision > 0) {
    return {
      type: 'manual',
      amount: manualProvision,
    };
  }

  // Priorität 2: Automatische Berechnung
  if (provisionRate > 0 && price > 0) {
    const amount = (price * provisionRate) / 100;
    return {
      type: 'automatic',
      amount: parseFloat(amount.toFixed(2)),
      rate: provisionRate,
      basePrice: price,
    };
  }

  // Priorität 3: Keine Provision
  return {
    type: 'none',
    amount: 0,
  };
}

/**
 * Formatiert die Provisions-Informationen für die Anzeige
 */
export function formatProvisionInfo(calculation: ProvisionCalculation): string {
  const formatted = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(calculation.amount);

  if (calculation.type === 'manual') {
    return `${formatted} (manuell)`;
  } else if (calculation.type === 'automatic' && calculation.rate) {
    return `${formatted} (${calculation.rate}% automatisch)`;
  }

  return formatted;
}

/**
 * Berechnet den Netto-Betrag nach Provisions-Abzug
 */
export function calculateNetAmount(
  grossAmount: number,
  provision: ProvisionCalculation
): number {
  return parseFloat((grossAmount - provision.amount).toFixed(2));
}