// ==================================================================================
// NEXIFY INITIALIZE DATABASE - Initialisierung der NeXify AI MASTER Datenbank
// ==================================================================================
// Erstellt: 2025-01-31
// Zweck: Initialisierung der Datenbank mit SOLL-Vorgaben und Basis-Konfiguration
// Autor: NeXify AI MASTER
// ==================================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SollVorgabe {
  category: string;
  rule_id: string;
  title: string;
  description: string;
  priority: "critical" | "high" | "medium" | "low";
  rule_type: "mandatory" | "recommended" | "best_practice";
  validation_pattern?: string;
  check_function?: string;
  tags: string[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("[NEXIFY] Initializing database...");

    // 1. Initial SOLL-Vorgaben laden
    const sollVorgaben: SollVorgabe[] = [
      // Design-System
      {
        category: "design_system",
        rule_id: "DS_001",
        title: "CI-Farben unveränderlich",
        description: "CI-Farben dürfen NIEMALS geändert werden",
        priority: "critical",
        rule_type: "mandatory",
        validation_pattern: "--primary.*40 31% 88%",
        tags: ["design_system", "ci_colors"],
      },
      {
        category: "design_system",
        rule_id: "DS_002",
        title: "V26/V26.1 deprecated",
        description: "V26 und V26.1 sind deprecated und dürfen nicht verwendet werden",
        priority: "critical",
        rule_type: "mandatory",
        validation_pattern: "(v26|V26|v26\\.1|V26\\.1)",
        tags: ["design_system", "deprecated"],
      },
      {
        category: "design_system",
        rule_id: "DS_003",
        title: "Hero Background Variant",
        description: "backgroundVariant='3d-premium' ist VERPFLICHTEND für alle Hero-Sections",
        priority: "high",
        rule_type: "mandatory",
        validation_pattern: "backgroundVariant.*3d-premium",
        tags: ["design_system", "hero"],
      },
      // Code-Qualität
      {
        category: "code_quality",
        rule_id: "CQ_001",
        title: "Single Source of Truth",
        description: "NIEMALS hardcoden, IMMER aus zentralen Quellen importieren",
        priority: "critical",
        rule_type: "mandatory",
        tags: ["code_quality", "data_sources"],
      },
      {
        category: "code_quality",
        rule_id: "CQ_002",
        title: "Console.log entfernen",
        description: "NIEMALS console.log/error/warn in Production-Code",
        priority: "medium",
        rule_type: "mandatory",
        validation_pattern: "console\\.(log|error|warn)",
        tags: ["code_quality", "logging"],
      },
      // Sicherheit
      {
        category: "security",
        rule_id: "SEC_001",
        title: "RLS immer aktiv",
        description: "ALLE Tabellen MÜSSEN RLS aktiviert haben",
        priority: "critical",
        rule_type: "mandatory",
        tags: ["security", "rls"],
      },
      {
        category: "security",
        rule_id: "SEC_002",
        title: "Soft Delete",
        description: "NIEMALS Hard-Delete verwenden, IMMER Archiving",
        priority: "critical",
        rule_type: "mandatory",
        validation_pattern: "\\.delete\\(\\)",
        tags: ["security", "archiving"],
      },
      {
        category: "security",
        rule_id: "SEC_003",
        title: "company_id Filter",
        description: "ALLE Queries MÜSSEN company_id Filter haben",
        priority: "critical",
        rule_type: "mandatory",
        tags: ["security", "multi_tenant"],
      },
      // Lokalisierung
      {
        category: "localization",
        rule_id: "LOC_001",
        title: "Deutsche Formatierung",
        description: "DIN 5008 Formatierung für Datum, Währung, Zahlen",
        priority: "high",
        rule_type: "mandatory",
        tags: ["localization", "formatting"],
      },
      {
        category: "localization",
        rule_id: "LOC_002",
        title: "Neue Rechtschreibung",
        description: "Neue Rechtschreibreform (2006) verwenden",
        priority: "medium",
        rule_type: "mandatory",
        tags: ["localization", "spelling"],
      },
    ];

    // 2. SOLL-Vorgaben in Datenbank einfügen
    const { error: insertError } = await supabase.from("nexify_soll_vorgaben").upsert(
      sollVorgaben.map((v) => ({
        category: v.category,
        rule_id: v.rule_id,
        title: v.title,
        description: v.description,
        priority: v.priority,
        rule_type: v.rule_type,
        validation_pattern: v.validation_pattern,
        check_function: v.check_function,
        tags: v.tags,
      })),
      { onConflict: "rule_id" }
    );

    if (insertError) {
      console.error("[NEXIFY] Error inserting SOLL-Vorgaben:", insertError);
      throw insertError;
    }

    console.log(`[NEXIFY] Inserted ${sollVorgaben.length} SOLL-Vorgaben`);

    // 3. NeXify AI MASTER als Agent registrieren
    const { error: agentError } = await supabase.from("nexify_agent_team").upsert(
      {
        agent_name: "NeXify AI MASTER",
        agent_role: "master",
        agent_capabilities: {
          capabilities: [
            "code_analysis",
            "compliance_checking",
            "workflow_automation",
            "decision_making",
            "learning",
            "memory_management",
            "team_coordination",
            "quality_assurance",
          ],
        },
        agent_status: "active",
        communication_protocol: "direct_to_pascal",
      },
      { onConflict: "agent_name" }
    );

    if (agentError) {
      console.error("[NEXIFY] Error inserting agent:", agentError);
    }

    // 4. Initial Memory für Pascal's Präferenzen
    const initialMemory = [
      {
        category: "preference",
        key: "pascal_communication_style",
        value: {
          style: "direct",
          prefers_solutions_over_agreement: true,
          wants_proactive_suggestions: true,
          expects_honest_feedback: true,
        },
        importance_score: 0.95,
        tags: ["communication", "pascal"],
      },
      {
        category: "preference",
        key: "quality_standards",
        value: {
          requires_e2e_tests: true,
          requires_ci_cd: true,
          requires_comprehensive_review: true,
          requires_highest_quality: true,
        },
        importance_score: 1.0,
        tags: ["quality", "pascal", "mandatory"],
      },
      {
        category: "rule",
        key: "definition_of_done",
        value: {
          functionality: true,
          codeQuality: true,
          tests: { unit: true, integration: true, e2e: true, coverage: 80 },
          compliance: { designSystem: true, sollVorgaben: true, security: true },
          performance: { bundleSize: 3000, loadTime: 3000, lighthouseScore: 90 },
          accessibility: { wcagAA: true, keyboardNav: true, screenReader: true },
          documentation: true,
          selfReview: true,
        },
        importance_score: 1.0,
        tags: ["quality", "definition_of_done", "mandatory"],
      },
    ];

    for (const memory of initialMemory) {
      const { error: memoryError } = await supabase.rpc("store_nexify_memory", {
        category_param: memory.category,
        key_param: memory.key,
        value_param: memory.value,
        importance_score_param: memory.importance_score,
        tags_param: memory.tags,
      });

      if (memoryError) {
        console.error(`[NEXIFY] Error storing memory ${memory.key}:`, memoryError);
      }
    }

    console.log(`[NEXIFY] Stored ${initialMemory.length} initial memories`);

    // 5. Initial Quality Gate registrieren
    const { error: gateError } = await supabase.from("nexify_quality_gates").upsert(
      [
        {
          gate_name: "pre_commit_quality",
          gate_type: "pre_commit",
          description: "Pre-Commit Quality Gate",
          checks: ["type_check", "lint", "format_check", "unit_tests_changed"],
          thresholds: {
            typescript_errors: 0,
            eslint_errors: 0,
            test_failures: 0,
          },
          blocking: true,
          enabled: true,
        },
        {
          gate_name: "pre_push_quality",
          gate_type: "pre_push",
          description: "Pre-Push Quality Gate",
          checks: ["full_test_suite", "e2e_tests", "compliance_check"],
          thresholds: {
            test_coverage: 80,
            e2e_failures: 0,
            critical_violations: 0,
          },
          blocking: true,
          enabled: true,
        },
        {
          gate_name: "pre_merge_quality",
          gate_type: "pre_merge",
          description: "Pre-Merge Quality Gate",
          checks: ["full_quality_check", "performance_check", "security_check"],
          thresholds: {
            lighthouse_score: 90,
            bundle_size_kb: 3000,
            security_issues: 0,
          },
          blocking: true,
          enabled: true,
        },
      ],
      { onConflict: "gate_name" }
    );

    if (gateError) {
      console.error("[NEXIFY] Error inserting quality gates:", gateError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Database initialized successfully",
        results: {
          soll_vorgaben_inserted: sollVorgaben.length,
          memories_stored: initialMemory.length,
          agent_registered: true,
          quality_gates_registered: true,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("[NEXIFY] Error initializing database:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
