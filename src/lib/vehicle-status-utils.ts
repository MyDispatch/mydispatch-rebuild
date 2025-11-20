/**
 * ==================================================================================
 * VEHICLE STATUS UTILS - Zentrale Helper für Fahrzeug-Status
 * ==================================================================================
 * V18.3: Zentrale Quelle für Vehicle-Status-Labels (DRY Prinzip)
 * ==================================================================================
 */

export const getVehicleStatusLabel = (status: string): string => {
  const statusMap: Record<string, string> = {
    available: "Verfügbar",
    im_einsatz: "Im Einsatz",
    wartung: "Wartung",
    defekt: "Defekt",
  };
  return statusMap[status] || status;
};

export const getShiftStatusLabel = (status: string): string => {
  const statusMap: Record<string, string> = {
    available: "Verfügbar",
    on_duty: "Im Dienst",
    off_duty: "Außer Dienst",
    busy: "Beschäftigt",
    offline: "Offline",
    break: "Pause",
  };
  return statusMap[status] || status;
};
