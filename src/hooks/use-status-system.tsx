/**
 * ==================================================================================
 * USE STATUS SYSTEM HOOK
 * ==================================================================================
 * 
 * React Hook für einfachen Zugriff auf das zentrale Ampelsystem
 * 
 * Verwendung:
 * const { getDriverStatusConfig, getDocumentStatusConfig } = useStatusSystem();
 * const driverStatus = getDriverStatusConfig('available');
 * 
 * ==================================================================================
 */

import { useMemo } from 'react';
import {
  DRIVER_STATUS_CONFIG,
  VEHICLE_STATUS_CONFIG,
  DOCUMENT_STATUS_CONFIG,
  INVOICE_STATUS_CONFIG,
  BOOKING_STATUS_CONFIG,
  TRAFFIC_STATUS_CONFIG,
  getDocumentStatus,
  getInvoiceStatus,
  getTrafficStatusFromJamFactor,
  getVehicleStatus,
  getStatusConfig,
  type DriverStatus,
  type VehicleStatus,
  type DocumentStatus,
  type InvoiceStatus,
  type BookingStatus,
  type TrafficStatus,
  type StatusConfig
} from '@/lib/status-system';

export function useStatusSystem() {
  // Memoize alle Getter-Funktionen
  const getDriverStatusConfig = useMemo(
    () => (status: DriverStatus): StatusConfig => 
      getStatusConfig(status, DRIVER_STATUS_CONFIG),
    []
  );

  const getVehicleStatusConfig = useMemo(
    () => (status: VehicleStatus): StatusConfig => 
      getStatusConfig(status, VEHICLE_STATUS_CONFIG),
    []
  );

  const getDocumentStatusConfig = useMemo(
    () => (expiryDate: string | Date | null): StatusConfig => {
      const status = getDocumentStatus(expiryDate);
      return getStatusConfig(status, DOCUMENT_STATUS_CONFIG);
    },
    []
  );

  const getInvoiceStatusConfig = useMemo(
    () => (
      paymentStatus: 'paid' | 'pending' | 'cancelled',
      dueDate?: string | Date | null
    ): StatusConfig => {
      const status = getInvoiceStatus(paymentStatus, dueDate);
      return getStatusConfig(status, INVOICE_STATUS_CONFIG);
    },
    []
  );

  const getBookingStatusConfig = useMemo(
    () => (status: BookingStatus): StatusConfig => 
      getStatusConfig(status, BOOKING_STATUS_CONFIG),
    []
  );

  const getTrafficStatusConfig = useMemo(
    () => (jamFactor: number): StatusConfig => {
      const status = getTrafficStatusFromJamFactor(jamFactor);
      return getStatusConfig(status, TRAFFIC_STATUS_CONFIG);
    },
    []
  );

  const getVehicleStatusFromState = useMemo(
    () => (isInUse: boolean, isInMaintenance: boolean, isOutOfService: boolean): StatusConfig => {
      const status = getVehicleStatus(isInUse, isInMaintenance, isOutOfService);
      return getStatusConfig(status, VEHICLE_STATUS_CONFIG);
    },
    []
  );

  return {
    // Status Configs
    getDriverStatusConfig,
    getVehicleStatusConfig,
    getDocumentStatusConfig,
    getInvoiceStatusConfig,
    getBookingStatusConfig,
    getTrafficStatusConfig,
    getVehicleStatusFromState,

    // Raw Configs (für direkte Verwendung)
    configs: {
      driver: DRIVER_STATUS_CONFIG,
      vehicle: VEHICLE_STATUS_CONFIG,
      document: DOCUMENT_STATUS_CONFIG,
      invoice: INVOICE_STATUS_CONFIG,
      booking: BOOKING_STATUS_CONFIG,
      traffic: TRAFFIC_STATUS_CONFIG
    }
  };
}
