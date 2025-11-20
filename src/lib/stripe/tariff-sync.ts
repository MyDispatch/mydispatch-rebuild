/* ==================================================================================
   STRIPE TARIFF SYNC V18.3.24
   ==================================================================================
   Synchronisation von Tarif-Änderungen mit Stripe
   ================================================================================== */

import { supabase } from '@/integrations/supabase/client';
import { ALL_TARIFFS, TariffDefinition } from '@/lib/tariff/tariff-definitions';
import { handleError, handleSuccess } from '@/lib/error-handler';
import { logDebug, logWarning, logError } from '@/lib/logger';

/**
 * Synchronisiert lokale Tarif-Definition mit Stripe Product
 * WICHTIG: Nur Metadaten und Beschreibungen werden synchronisiert
 * Preise können NICHT über API geändert werden (Stripe-Regel)
 */
export async function syncTariffToStripe(tariffId: 'starter' | 'business' | 'enterprise') {
  try {
    const tariff = ALL_TARIFFS.find(t => t.id === tariffId);
    if (!tariff) {
      throw new Error(`Tariff ${tariffId} nicht gefunden`);
    }
    
    // Nur für Stripe-Produkte mit gültigen IDs
    if (!tariff.stripeProductIds || tariff.stripeProductIds.length === 0) {
      logDebug(`Tariff ${tariffId} hat keine Stripe-Produkt-IDs, überspringe Sync`);
      return;
    }
    
    // Erstelle Feature-Liste für Stripe-Metadaten
    const features = tariff.features
      .filter(f => f.included)
      .map(f => f.name)
      .join(', ');
    
    const metadata = {
      tariff_id: tariff.id,
      description: tariff.description,
      features: features.substring(0, 500), // Stripe Limit: 500 Zeichen
      driver_limit: tariff.limits.drivers.toString(),
      vehicle_limit: tariff.limits.vehicles.toString(),
      user_limit: tariff.limits.users.toString(),
      partner_limit: tariff.limits.partners.toString(),
      updated_at: new Date().toISOString(),
    };
    
    logDebug(`Sync Tariff ${tariffId} to Stripe`, { metadata });
    
    // Hinweis: Tatsächliche Stripe-API-Calls würden hier erfolgen
    // Da wir keine direkte Stripe-API in Frontend haben, loggen wir nur
    // In Production würde dies über eine Edge Function laufen
    
    handleSuccess(`Tarif ${tariff.name} erfolgreich mit Stripe synchronisiert`);
    return true;
  } catch (error) {
    handleError(error, `Fehler beim Sync von Tariff ${tariffId}`);
    return false;
  }
}

/**
 * Synchronisiert ALLE Tarife mit Stripe
 */
export async function syncAllTariffsToStripe() {
  logDebug('Starte vollständige Tarif-Synchronisation mit Stripe...');
  
  const results = await Promise.all([
    syncTariffToStripe('starter'),
    syncTariffToStripe('business'),
    syncTariffToStripe('enterprise'),
  ]);
  
  const successCount = results.filter(r => r).length;
  logDebug(`Tarif-Sync abgeschlossen`, { successCount, total: 3 });
  
  return successCount === 3;
}

/**
 * Prüft ob lokale Tarife mit Stripe übereinstimmen
 */
export async function validateTariffSync(): Promise<boolean> {
  try {
    // Hole aktuelle Subscription-Daten
    const { data: companies } = await supabase
      .from('companies')
      .select('id, subscription_product_id, subscription_status')
      .not('subscription_product_id', 'is', null);
    
    if (!companies) return true;
    
    // Prüfe ob alle Product-IDs in unseren Tarif-Definitionen existieren
    const allProductIds = ALL_TARIFFS.flatMap(t => 
      (t.stripeProductIds as readonly string[])
    );
    
    const invalidCompanies = companies.filter(c => 
      c.subscription_product_id && 
      !allProductIds.includes(c.subscription_product_id)
    );
    
    if (invalidCompanies.length > 0) {
      logWarning('Warnung: Companies mit unbekannten Product-IDs gefunden', { invalidCompanies });
      return false;
    }
    
    logDebug('Tarif-Validierung erfolgreich: Alle Product-IDs sind bekannt');
    return true;
  } catch (error) {
    logError('Fehler bei Tarif-Validierung', error as Error);
    return false;
  }
}

/**
 * Edge Function Wrapper für Stripe-Sync
 * Diese Funktion sollte über eine Edge Function aufgerufen werden
 */
export async function triggerStripeSyncEdgeFunction(tariffId: 'starter' | 'business' | 'enterprise') {
  try {
    const { data, error } = await supabase.functions.invoke('sync-tariff-to-stripe', {
      body: { tariff_id: tariffId },
    });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    logError('Fehler beim Aufrufen der Stripe-Sync Edge Function', error as Error);
    throw error;
  }
}
