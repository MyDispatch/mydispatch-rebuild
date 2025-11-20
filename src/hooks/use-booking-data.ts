/* ==================================================================================
   USE BOOKING DATA HOOK V1.0 - EXTRACTED FROM AUFTRAEGE.TSX
   ==================================================================================
   Manages data fetching for Booking-related entities
   
   Features:
   - Fetch Customers, Drivers, Vehicles, Cost Centers, Partners
   - Auto-refresh on company_id change
   - Error handling with silent fallback
   ================================================================================== */

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/lib/error-handler';

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  is_manually_created: boolean;
  phone?: string;
  email?: string;
}

interface Driver {
  id: string;
  first_name: string;
  last_name: string;
  license_number?: string;
  shift_status?: string;
  phone?: string;
}

interface Vehicle {
  id: string;
  license_plate: string;
  vehicle_class?: string;
  status?: string;
}

interface CostCenter {
  id: string;
  name: string;
}

interface Partner {
  id: string;
  name: string;
  provision_amount?: number;
  phone?: string;
  email?: string;
}

export function useBookingData(companyId?: string) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);

  const fetchCustomers = async () => {
    if (!companyId) return;
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('id, first_name, last_name, is_manually_created, phone, email')
        .eq('company_id', companyId);

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      handleError(error, 'Fehler beim Laden der Kunden', { showToast: false });
    }
  };

  const fetchDrivers = async () => {
    if (!companyId) return;
    try {
      const { data, error } = await supabase
        .from('drivers')
        .select('id, first_name, last_name, license_number, shift_status, phone')
        .eq('company_id', companyId)
        .eq('archived', false);

      if (error) throw error;
      setDrivers(data || []);
    } catch (error) {
      handleError(error, 'Fehler beim Laden der Fahrer', { showToast: false });
    }
  };

  const fetchVehicles = async () => {
    if (!companyId) return;
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('id, license_plate, vehicle_class, status')
        .eq('company_id', companyId)
        .eq('archived', false);

      if (error) throw error;
      setVehicles(data || []);
    } catch (error) {
      handleError(error, 'Fehler beim Laden der Fahrzeuge', { showToast: false });
    }
  };

  const fetchCostCenters = async () => {
    if (!companyId) return;
    try {
      const { data, error } = await supabase
        .from('cost_centers')
        .select('id, name')
        .eq('company_id', companyId)
        .eq('active', true);

      if (error) throw error;
      setCostCenters(data || []);
    } catch (error) {
      handleError(error, 'Fehler beim Laden der Kostenstellen', { showToast: false });
    }
  };

  const fetchPartners = async () => {
    if (!companyId) return;
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('id, name, provision_amount, phone, email')
        .eq('company_id', companyId)
        .eq('archived', false);

      if (error) throw error;
      setPartners(data || []);
    } catch (error) {
      handleError(error, 'Fehler beim Laden der Partner', { showToast: false });
    }
  };

  const refreshAll = async () => {
    await Promise.all([
      fetchCustomers(),
      fetchDrivers(),
      fetchVehicles(),
      fetchCostCenters(),
      fetchPartners(),
    ]);
  };

  useEffect(() => {
    if (companyId) {
      refreshAll();
    }
  }, [companyId]);

  return {
    customers,
    drivers,
    vehicles,
    costCenters,
    partners,
    refreshAll,
    fetchCustomers,
    fetchDrivers,
    fetchVehicles,
  };
}
