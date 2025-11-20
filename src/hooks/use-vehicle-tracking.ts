/**
 * PROMETHEUS MISSION II: Vehicle Tracking Hook (P0 Cluster 1)
 *
 * Replaces direct Supabase calls in DriverTracking.tsx
 * with TanStack Query mutation for GPS position updates.
 *
 * Migration: Line 85 in src/pages/DriverTracking.tsx
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { handleError } from "@/lib/error-handler";

interface VehiclePosition {
  vehicle_id: string;
  driver_id?: string;
  latitude: number;
  longitude: number;
  speed?: number;
  heading?: number;
  company_id?: string;
}

interface UseVehicleTrackingReturn {
  updatePosition: (position: VehiclePosition) => Promise<void>;
  isUpdating: boolean;
}

export function useVehicleTracking(): UseVehicleTrackingReturn {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updatePositionMutation = useMutation({
    mutationFn: async (position: VehiclePosition) => {
      const { data, error } = await supabase
        .from("vehicle_positions")
        .insert({
          vehicle_id: position.vehicle_id,
          driver_id: position.driver_id,
          latitude: position.latitude,
          longitude: position.longitude,
          speed: position.speed,
          heading: position.heading,
          company_id: position.company_id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate tracking queries to refresh position on map
      queryClient.invalidateQueries({ queryKey: ["vehicle-positions"] });
    },
    onError: (error) => {
      handleError(error, "Fehler beim Aktualisieren der Position");
      console.error("[VehicleTracking] Position update failed:", error);
    },
  });

  const updatePosition = async (position: VehiclePosition): Promise<void> => {
    await updatePositionMutation.mutateAsync(position);
  };

  return {
    updatePosition,
    isUpdating: updatePositionMutation.isPending,
  };
}
