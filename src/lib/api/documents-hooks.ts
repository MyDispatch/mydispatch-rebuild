import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Document = Database["public"]["Tables"]["documents"]["Row"];
type DocumentInsert = Database["public"]["Tables"]["documents"]["Insert"];

export function useDocuments(
  entityId?: string,
  entityType?: Database["public"]["Enums"]["document_entity_type"]
) {
  return useQuery({
    queryKey: ["documents", entityId, entityType],
    queryFn: async () => {
      let query = supabase
        .from("documents")
        .select("*")
        .eq("archived", false)
        .order("created_at", { ascending: false });

      if (entityId) {
        query = query.eq("entity_id", entityId);
      }

      if (entityType) {
        query = query.eq("entity_type", entityType);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Document[];
    },
  });
}

export function useDocument(id: string) {
  return useQuery({
    queryKey: ["document", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("documents").select("*").eq("id", id).single();

      if (error) throw error;
      return data as Document;
    },
    enabled: !!id,
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, documentData }: { file: File; documentData: DocumentInsert }) => {
      // Upload file to storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${documentData.entity_id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("documents").getPublicUrl(fileName);

      // Create document record
      const { data, error } = await supabase
        .from("documents")
        .insert({
          ...documentData,
          file_url: publicUrl,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Document;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("documents")
        .update({ archived: true, archived_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}
