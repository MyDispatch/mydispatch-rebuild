import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Shift = Database["public"]["Tables"]["shifts"]["Row"];
type ShiftInsert = Database["public"]["Tables"]["shifts"]["Insert"];
type ShiftUpdate = Database["public"]["Tables"]["shifts"]["Update"];

export function useShifts() {
  return useQuery({
    queryKey: ["shifts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shifts")
        .select("*, drivers(first_name, last_name), vehicles(brand, model, license_plate)")
        .eq("archived", false)
        .order("start_time", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useShift(id: string) {
  return useQuery({
    queryKey: ["shift", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shifts")
        .select("*, drivers(first_name, last_name, email), vehicles(brand, model, license_plate)")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateShift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (shift: ShiftInsert) => {
      const { data, error } = await supabase.from("shifts").insert(shift).select().single();

      if (error) throw error;
      return data as Shift;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
    },
  });
}

export function useUpdateShift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: ShiftUpdate }) => {
      const { data, error } = await supabase
        .from("shifts")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Shift;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
      queryClient.invalidateQueries({ queryKey: ["shift", data.id] });
    },
  });
}

export function useDeleteShift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("shifts")
        .update({ archived: true, archived_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
    },
  });
}
