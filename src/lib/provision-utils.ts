/* ==================================================================================
   PROVISIONS-BERECHNUNG UTILITY
   ==================================================================================
   Flexible Provisions-Logik mit automatischer & manueller Berechnung
   ================================================================================== */

export interface ProvisionCalculation {
  amount: number;
  type: 'manual' | 'automatic' | 'none';
  rate?: number;
  basePrice?: number;
}

/**
 * Berechnet die Provision für einen Partner-Auftrag
 * Priorität: Manuell > Automatisch > Keine
 */
export function calculateProvision(
  bookingPrice: number,
  partnerProvisionRate: number = 0,
  manualProvision?: number | null
): ProvisionCalculation {
  // 1. Manuelle Provision hat Vorrang
  if (manualProvision !== null && manualProvision !== undefined && manualProvision >= 0) {
    return {
      amount: manualProvision,
      type: 'manual',
    };
  }

  // 2. Automatische Berechnung basierend auf Rate
  if (partnerProvisionRate > 0 && bookingPrice > 0) {
    const automaticAmount = (bookingPrice * partnerProvisionRate) / 100;
    return {
      amount: automaticAmount,
      type: 'automatic',
      rate: partnerProvisionRate,
      basePrice: bookingPrice,
    };
  }

  // 3. Keine Provision
  return {
    amount: 0,
    type: 'none',
  };
}

/**
 * Formatiert die Provisions-Anzeige für UI
 */
export function formatProvisionDisplay(calculation: ProvisionCalculation): string {
  const formattedAmount = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(calculation.amount);

  switch (calculation.type) {
    case 'manual':
      return `${formattedAmount} (manuell)`;
    case 'automatic':
      return `${formattedAmount} (${calculation.rate}% von ${new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
      }).format(calculation.basePrice || 0)})`;
    case 'none':
      return 'Keine Provision';
    default:
      return formattedAmount;
  }
}

/**
 * Validiert manuelle Provisions-Eingabe
 */
export function validateManualProvision(
  value: string,
  maxAmount?: number
): { isValid: boolean; error?: string; numericValue?: number } {
  if (!value || value.trim() === '') {
    return { isValid: true, numericValue: undefined };
  }

  const numericValue = parseFloat(value.replace(',', '.'));

  if (isNaN(numericValue)) {
    return { isValid: false, error: 'Bitte geben Sie einen gültigen Betrag ein' };
  }

  if (numericValue < 0) {
    return { isValid: false, error: 'Provision kann nicht negativ sein' };
  }

  if (maxAmount && numericValue > maxAmount) {
    return {
      isValid: false,
      error: `Provision darf ${new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
      }).format(maxAmount)} nicht überschreiten`,
    };
  }

  return { isValid: true, numericValue };
}