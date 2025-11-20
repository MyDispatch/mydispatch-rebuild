/* ==================================================================================
   DOKUMENT-ABLAUF-HOOK - Erinnerungen für Führerschein, P-Schein, TÜV
   ==================================================================================
   - Lädt Dokumente mit Ablaufdatum
   - Berechnet Ablauf-Status (Ampel-System)
   - Zeigt Warnungen in Listen
   ================================================================================== */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { differenceInDays } from 'date-fns';

export type ExpiryStatus = 'success' | 'warning' | 'error' | 'neutral';

export interface DocumentWithExpiry {
  id: string;
  name: string;
  document_type: string;
  expiry_date: string | null;
  entity_type: string;
  entity_id: string;
  expiryStatus: ExpiryStatus;
  daysUntilExpiry: number | null;
}

async function fetchDocumentsWithExpiry(companyId: string, entityType?: string, entityId?: string): Promise<DocumentWithExpiry[]> {
  // TypeScript Fix: Supabase Query Builder verursacht "Type instantiation excessively deep"
  // Dies ist ein bekanntes TypeScript-Problem mit komplexen Supabase-Types
  // @ts-ignore
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('company_id', companyId)
    .eq('archived', false);

  if (error) throw error;

  const filteredData = (data || []).filter(doc => {
    if (!doc.expiry_date) return false;
    if (entityType && doc.entity_type !== entityType) return false;
    if (entityId && doc.entity_id !== entityId) return false;
    return true;
  });

  return filteredData.map(doc => {
    const expiryDate = doc.expiry_date ? new Date(doc.expiry_date) : null;
    const today = new Date();
    
    let expiryStatus: ExpiryStatus = 'neutral';
    let daysUntilExpiry: number | null = null;

    if (expiryDate) {
      daysUntilExpiry = differenceInDays(expiryDate, today);

      if (daysUntilExpiry < 0) {
        expiryStatus = 'error';
      } else if (daysUntilExpiry <= 30) {
        expiryStatus = 'warning';
      } else {
        expiryStatus = 'success';
      }
    }

    return {
      id: doc.id,
      name: doc.name,
      document_type: doc.document_type,
      expiry_date: doc.expiry_date,
      entity_type: doc.entity_type,
      entity_id: doc.entity_id,
      expiryStatus,
      daysUntilExpiry,
    };
  });
}

export function useDocumentExpiry(entityType?: string, entityId?: string) {
  const { profile } = useAuth();

  return useQuery<DocumentWithExpiry[]>({
    queryKey: ['document-expiry', profile?.company_id, entityType, entityId],
    queryFn: () => {
      if (!profile?.company_id) return Promise.resolve([]);
      return fetchDocumentsWithExpiry(profile.company_id, entityType, entityId);
    },
    enabled: !!profile?.company_id,
    refetchInterval: 60000,
  });
}

export function useEntityDocumentStatus(entityType: string, entityId: string) {
  const { data: documents, isLoading } = useDocumentExpiry(entityType, entityId);

  const hasExpired = documents?.some(doc => doc.expiryStatus === 'error') || false;
  const hasWarning = documents?.some(doc => doc.expiryStatus === 'warning') || false;
  
  const overallStatus: ExpiryStatus = hasExpired ? 'error' : hasWarning ? 'warning' : 'success';

  return {
    documents,
    isLoading,
    hasExpired,
    hasWarning,
    overallStatus,
  };
}
