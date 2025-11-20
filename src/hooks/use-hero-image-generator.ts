/* ==================================================================================
   USE-HERO-IMAGE-GENERATOR HOOK V18.5.13
   ================================================================================== 
   React Hook für KI-Bildgenerierung
   ================================================================================== */

import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

interface GenerateOptions {
  prompt: string;
  page: string;
}

interface GenerateResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

export function useHeroImageGenerator() {
  const [loading, setLoading] = useState(false);

  const generate = async (options: GenerateOptions): Promise<GenerateResult | null> => {
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-hero-image", {
        body: options,
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || "Image generation failed");
      }

      toast.success("Hero-Image erfolgreich generiert", {
        description: `Für Seite: ${options.page}`,
      });

      return data;
    } catch (error: any) {
      logger.error("[useHeroImageGenerator] Error", error, {
        component: "useHeroImageGenerator",
        page: options.page,
      });
      toast.error("Bildgenerierung fehlgeschlagen", {
        description: error.message,
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    generate,
    loading,
  };
}
