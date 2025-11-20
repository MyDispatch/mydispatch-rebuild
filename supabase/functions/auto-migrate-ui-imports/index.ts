import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MigrationMapping {
  oldImport: string;
  newImport: string;
  componentName: string;
  variantMap?: Record<string, string>;
}

const MIGRATION_MAPPINGS: MigrationMapping[] = [
  {
    oldImport: "import { Button } from '@/components/ui/button'",
    newImport: "import { V28Button } from '@/lib/components/V28Button'",
    componentName: "Button",
    variantMap: {
      default: "primary",
      outline: "secondary",
      ghost: "secondary",
      secondary: "secondary",
    },
  },
  {
    oldImport: "import { Input } from '@/components/ui/input'",
    newImport: "import { V28Input } from '@/lib/components/V28Input'",
    componentName: "Input",
  },
  {
    oldImport: "import { Card } from '@/components/ui/card'",
    newImport: "import { V28Card } from '@/lib/components/V28Card'",
    componentName: "Card",
  },
  {
    oldImport: "import { Badge } from '@/components/ui/badge'",
    newImport: "import { V28Badge } from '@/lib/components/V28Badge'",
    componentName: "Badge",
  },
  {
    oldImport: "import { Select } from '@/components/ui/select'",
    newImport: "import { V28Select } from '@/lib/components/V28Select'",
    componentName: "Select",
  },
  {
    oldImport: "import { Checkbox } from '@/components/ui/checkbox'",
    newImport: "import { V28Checkbox } from '@/lib/components/V28Checkbox'",
    componentName: "Checkbox",
  },
  {
    oldImport: "import { Switch } from '@/components/ui/switch'",
    newImport: "import { V28Switch } from '@/lib/components/V28Switch'",
    componentName: "Switch",
  },
  {
    oldImport: "import { Textarea } from '@/components/ui/textarea'",
    newImport: "import { V28Textarea } from '@/lib/components/V28Textarea'",
    componentName: "Textarea",
  },
  {
    oldImport: "import { Dialog } from '@/components/ui/dialog'",
    newImport: "import { V28Dialog } from '@/lib/components/V28Dialog'",
    componentName: "Dialog",
  },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileContent, filePath } = await req.json();

    if (!fileContent || !filePath) {
      throw new Error("fileContent and filePath are required");
    }

    console.log(`[auto-migrate-ui-imports] Processing: ${filePath}`);

    let migratedCode = fileContent;
    let changesCount = 0;
    const appliedMigrations: string[] = [];

    // Step 1: Replace imports
    for (const mapping of MIGRATION_MAPPINGS) {
      if (migratedCode.includes(mapping.oldImport)) {
        migratedCode = migratedCode.replace(mapping.oldImport, mapping.newImport);
        changesCount++;
        appliedMigrations.push(`Import: ${mapping.componentName}`);
        console.log(`[auto-migrate-ui-imports] ✅ Replaced import for ${mapping.componentName}`);
      }
    }

    // Step 2: Replace component tags (Button -> V28Button, etc.)
    for (const mapping of MIGRATION_MAPPINGS) {
      if (migratedCode.includes(mapping.newImport)) {
        const v28Name = `V28${mapping.componentName}`;

        // Replace opening tags
        const openingTagRegex = new RegExp(`<${mapping.componentName}([\\s>])`, "g");
        migratedCode = migratedCode.replace(openingTagRegex, `<${v28Name}$1`);

        // Replace closing tags
        const closingTagRegex = new RegExp(`</${mapping.componentName}>`, "g");
        migratedCode = migratedCode.replace(closingTagRegex, `</${v28Name}>`);

        // Step 3: Replace variants if mapping exists
        if (mapping.variantMap) {
          for (const [oldVariant, newVariant] of Object.entries(mapping.variantMap)) {
            const variantRegex = new RegExp(`variant="${oldVariant}"`, "g");
            if (migratedCode.match(variantRegex)) {
              migratedCode = migratedCode.replace(variantRegex, `variant="${newVariant}"`);
              appliedMigrations.push(`Variant: ${oldVariant} → ${newVariant}`);
              changesCount++;
            }
          }
        }
      }
    }

    console.log(`[auto-migrate-ui-imports] ✅ Migration complete: ${changesCount} changes`);

    return new Response(
      JSON.stringify({
        success: true,
        migratedCode,
        changesCount,
        appliedMigrations,
        filePath,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[auto-migrate-ui-imports] Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
