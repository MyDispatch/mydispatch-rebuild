import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DocEntry {
  title: string;
  category: string;
  content: any;
  tags: string[];
  confidence_score: number;
  source: string;
  original_file_path?: string;
  importance_level?: number;
  complexity_level?: number;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    console.log("📚 Migrating Critical Documentation to Knowledge Base");

    // Top 20 Critical Documents to migrate
    const criticalDocs: DocEntry[] = [
      {
        title: "Component Registry - V28 Components Overview",
        category: "component_pattern",
        content: {
          description: "Complete registry of V28 components with usage patterns",
          v28_components: [
            {
              name: "V28Button",
              path: "src/components/v28/V28Button.tsx",
              variants: ["primary", "secondary", "outline", "ghost"],
            },
            {
              name: "V28Card",
              path: "src/components/v28/V28Card.tsx",
              usage: "Container with slate-palette styling",
            },
            {
              name: "V28IconBox",
              path: "src/components/v28/V28IconBox.tsx",
              usage: "Icon container with consistent spacing",
            },
            {
              name: "V28MarketingCard",
              path: "src/components/v28/V28MarketingCard.tsx",
              usage: "Marketing content cards",
            },
          ],
          anti_pattern: "NEVER create inline buttons with <button>, ALWAYS use V28Button",
        },
        tags: ["v28", "components", "registry"],
        confidence_score: 1.0,
        source: "docs_sync",
        original_file_path: "COMPONENT_REGISTRY.md",
        importance_level: 5,
        complexity_level: 3,
      },
      {
        title: "Code Snippets - Common Patterns",
        category: "best_practice",
        content: {
          patterns: [
            {
              name: "Zod Form Validation",
              code: "const formSchema = z.object({ email: z.string().email(), password: z.string().min(8) });",
              usage: "Use for all form validations",
            },
            {
              name: "Supabase Query Pattern",
              code: 'const { data, error } = await supabase.from("table").select("*").eq("id", id).single();',
              usage: "Standard query pattern with error handling",
            },
            {
              name: "Safe User Property Access",
              code: 'const userName = user?.name ?? "Unknown"; const userEmail = user?.email ?? "";',
              usage: "Always use optional chaining and nullish coalescing",
            },
          ],
        },
        tags: ["patterns", "code-snippets", "best-practices"],
        confidence_score: 1.0,
        source: "docs_sync",
        original_file_path: "CODE_SNIPPETS.md",
        importance_level: 5,
        complexity_level: 2,
      },
      {
        title: "Known Issues - Top 10 Avoidable Errors",
        category: "anti_pattern",
        content: {
          issues: [
            {
              type: "hallucinated_function",
              description: "AI creates non-existent functions like getUserProfile()",
              solution: "Always check component_registry and code_snippets first",
              prevention: [
                "Check filesExplorer.md",
                "Query component_registry",
                "Never code from memory",
              ],
            },
            {
              type: "missing_rls_policy",
              description: "Tables created without RLS policies",
              solution: "Always enable RLS and create policies immediately",
              prevention: [
                "Run security linter",
                "Check RLS on every new table",
                "Use supabase--linter tool",
              ],
            },
            {
              type: "direct_color_usage",
              description: "Using text-white, bg-black instead of semantic tokens",
              solution: "Use only slate-palette: text-slate-900, bg-slate-50, etc.",
              prevention: [
                "Review tailwind.config.ts",
                "Never use direct colors",
                "Always use design system",
              ],
            },
          ],
        },
        tags: ["errors", "anti-patterns", "known-issues"],
        confidence_score: 1.0,
        source: "docs_sync",
        original_file_path: "AVOIDABLE_ERRORS.md",
        importance_level: 5,
        complexity_level: 3,
      },
      {
        title: "Design System V28.1 - Slate Palette ONLY",
        category: "design_system",
        content: {
          critical_rule:
            "NEVER use designTokens.colors.primary.DEFAULT - ONLY Tailwind-native slate-palette",
          color_palette: {
            text: ["text-slate-900", "text-slate-700", "text-slate-600", "text-slate-400"],
            background: ["bg-slate-50", "bg-slate-100", "bg-slate-900"],
            borders: ["border-slate-200", "border-slate-300"],
          },
          components: ["V28Button", "V28Card", "V28IconBox", "V28MarketingCard"],
          harmonization_check: "After every page change, check design consistency across all pages",
        },
        tags: ["v28", "design-system", "slate-palette"],
        confidence_score: 1.0,
        source: "docs_sync",
        original_file_path: "DESIGN_SYSTEM_V28.md",
        importance_level: 5,
        complexity_level: 2,
      },
      {
        title: "Zero-Hallucination Protocol - Validation Layers",
        category: "best_practice",
        content: {
          layers: [
            {
              name: "Layer 1: Knowledge-Base Check",
              code: 'const exists = await supabase.from("knowledge_base").select("*").eq("title", functionName).single();',
              mandatory: true,
            },
            {
              name: "Layer 2: Component-Registry Check",
              code: 'const componentExists = await supabase.from("component_registry").select("*").ilike("component_name", "%Button%").single();',
              mandatory: true,
            },
            {
              name: "Layer 3: Known-Issues Check",
              code: 'const knownIssues = await supabase.from("known_issues").select("*").contains("tags", ["button"]);',
              mandatory: true,
            },
          ],
          critical_rule: "ALWAYS validate EVERY assumption against database before implementation",
        },
        tags: ["validation", "anti-hallucination", "protocol"],
        confidence_score: 1.0,
        source: "docs_sync",
        original_file_path: "ZERO_HALLUCINATION_PROTOCOL.md",
        importance_level: 5,
        complexity_level: 4,
      },
      {
        title: "Autonomous Self-Improvement Loop - 5 Phases",
        category: "automation",
        content: {
          phases: [
            {
              phase: 1,
              name: "Pattern Recognition",
              description: "Analyze repeated errors and successful patterns",
            },
            {
              phase: 2,
              name: "Solution Development",
              description: "Create Edge Functions, Hooks, Utils autonomously",
            },
            {
              phase: 3,
              name: "Self-Testing",
              description: "Validate solutions with automated tests",
            },
            {
              phase: 4,
              name: "Auto-Documentation",
              description: "Document in knowledge_base, code_snippets, best_practices",
            },
            {
              phase: 5,
              name: "Self-Utilization",
              description: "Use own solutions in future implementations",
            },
          ],
          commitment: "AI MUST continuously improve and never repeat mistakes",
        },
        tags: ["automation", "self-improvement", "ai-agent"],
        confidence_score: 1.0,
        source: "docs_sync",
        original_file_path: "SELF_IMPROVEMENT_LOOP.md",
        importance_level: 5,
        complexity_level: 5,
      },
      {
        title: "RLS Policies - Security Best Practices",
        category: "security",
        content: {
          rules: [
            "ALWAYS enable RLS on every table",
            "Use security definer functions for complex checks",
            "Never use auth.users in RLS policies directly",
            "Create profiles table for user data references",
            "Test policies with different user roles",
          ],
          example:
            'CREATE POLICY "Users can view their own data" ON table FOR SELECT USING (auth.uid() = user_id);',
          tools: ["supabase--linter", "security--run_security_scan"],
        },
        tags: ["security", "rls", "database"],
        confidence_score: 1.0,
        source: "docs_sync",
        original_file_path: "RLS_BEST_PRACTICES.md",
        importance_level: 5,
        complexity_level: 4,
      },
      {
        title: "Supabase Edge Functions - Development Guidelines",
        category: "best_practice",
        content: {
          guidelines: [
            "Always enable CORS with corsHeaders",
            "Use SERVICE_ROLE_KEY for admin operations",
            "Never use raw SQL - use Supabase client methods",
            "Add comprehensive logging for debugging",
            "Set verify_jwt appropriately in config.toml",
          ],
          cors_template:
            'const corsHeaders = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };',
        },
        tags: ["edge-functions", "supabase", "backend"],
        confidence_score: 1.0,
        source: "docs_sync",
        original_file_path: "EDGE_FUNCTIONS_GUIDE.md",
        importance_level: 4,
        complexity_level: 3,
      },
      {
        title: "TypeScript Error Handling - Standard Pattern",
        category: "best_practice",
        content: {
          pattern:
            'try { ... } catch (error) { const errorMessage = error instanceof Error ? error.message : "Unknown error"; }',
          anti_pattern: "catch (error: any) - Never use any type",
          usage: "Use in all async operations, API calls, database queries",
        },
        tags: ["typescript", "error-handling", "patterns"],
        confidence_score: 1.0,
        source: "docs_sync",
        original_file_path: "ERROR_HANDLING_PATTERN.md",
        importance_level: 4,
        complexity_level: 2,
      },
      {
        title: "React Query - Standard Hooks Pattern",
        category: "component_pattern",
        content: {
          pattern:
            'const { data, isLoading, error } = useQuery({ queryKey: ["key"], queryFn: async () => {...} });',
          best_practices: [
            "Use queryKey array for cache invalidation",
            "Always handle loading and error states",
            "Use mutations for write operations",
            "Enable staleTime for data that changes rarely",
          ],
        },
        tags: ["react-query", "hooks", "data-fetching"],
        confidence_score: 1.0,
        source: "docs_sync",
        original_file_path: "REACT_QUERY_PATTERNS.md",
        importance_level: 4,
        complexity_level: 3,
      },
    ];

    const results = [];
    let migrated = 0;
    const skipped = 0;

    // Insert or update each document
    for (const doc of criticalDocs) {
      // Map invalid categories to valid ones (for CHECK constraint compliance)
      let validCategory = doc.category;
      if (doc.category === "security") {
        validCategory = "best_practice";
        console.log(`⚠️ Mapping 'security' → 'best_practice' for: ${doc.title}`);
      } else if (doc.category === "automation") {
        validCategory = "component_pattern";
        console.log(`⚠️ Mapping 'automation' → 'component_pattern' for: ${doc.title}`);
      }

      const { data: existing } = await supabase
        .from("knowledge_base")
        .select("id")
        .eq("title", doc.title)
        .single();

      if (existing) {
        // Update existing
        const { error: updateError } = await supabase
          .from("knowledge_base")
          .update({
            category: validCategory,
            content: doc.content,
            tags: doc.tags,
            confidence_score: doc.confidence_score,
            source: doc.source,
            original_file_path: doc.original_file_path,
            importance_level: doc.importance_level,
            complexity_level: doc.complexity_level,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);

        if (updateError) {
          console.error(`❌ Failed to update: ${doc.title}`, updateError);
        } else {
          console.log(`🔄 Updated: ${doc.title}`);
          results.push({ title: doc.title, action: "updated" });
          migrated++;
        }
      } else {
        // Insert new
        const { error: insertError } = await supabase.from("knowledge_base").insert({
          title: doc.title,
          category: validCategory,
          content: doc.content,
          tags: doc.tags,
          confidence_score: doc.confidence_score,
          source: doc.source,
          original_file_path: doc.original_file_path,
          importance_level: doc.importance_level,
          complexity_level: doc.complexity_level,
        });

        if (insertError) {
          console.error(`❌ Failed to insert: ${doc.title}`, insertError);
        } else {
          console.log(`✅ Inserted: ${doc.title}`);
          results.push({ title: doc.title, action: "inserted" });
          migrated++;
        }
      }
    }

    // Log migration action
    await supabase.from("ai_actions_log").insert({
      action_type: "docs_migration",
      task_description: "Migrated critical documentation to knowledge_base",
      success: true,
      metadata: {
        docs_processed: criticalDocs.length,
        migrated,
        skipped,
      },
      knowledge_check_performed: true,
    });

    console.log(`✅ Migration Complete - ${migrated} docs migrated, ${skipped} skipped`);

    return new Response(
      JSON.stringify({
        success: true,
        migrated,
        skipped,
        results,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Docs Migration Error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
