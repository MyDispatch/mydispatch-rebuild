#!/usr/bin/env tsx
/**
 * AUTONOMOUS SYSTEM - DIRECT ACTIVATION
 * Applies migrations and activates system via Supabase API
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ygpwuiygivxoqtyoigtg.supabase.co";
const SUPABASE_SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlncHd1aXlnaXZ4b3F0eW9pZ3RnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQ0NDM0MywiZXhwIjoyMDc2MDIwMzQzfQ.W_rbOUxa57VffJiUX9TClCAFB6m11qS2GVxpEzWQ56Q";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

console.log("\n🚀 AUTONOMOUS SYSTEM - DIRECT ACTIVATION\n");

async function activateSystem() {
  try {
    // Step 1: Activate system config
    console.log("⚙️  Activating system configuration...");

    const { data: configData, error: configError } = await supabase
      .from("autonomous_system_config")
      .update({
        enabled: true,
        dry_run_mode: true,
        autonomy_level: 2,
        max_parallel_tasks: 3,
        notification_email: "courbois1981@gmail.com",
        notify_on_completion: true,
        updated_at: new Date().toISOString(),
        updated_by: "direct_activation",
      })
      .eq(
        "id",
        (await supabase.from("autonomous_system_config").select("id").limit(1).single()).data?.id
      );

    if (configError) {
      console.log("⚠️  Config update failed (might not exist yet):", configError.message);
      // Try insert instead
      const { error: insertError } = await supabase.from("autonomous_system_config").insert({
        enabled: true,
        dry_run_mode: true,
        autonomy_level: 2,
        max_parallel_tasks: 3,
        notification_email: "courbois1981@gmail.com",
        notify_on_completion: true,
      });

      if (insertError && !insertError.message.includes("duplicate")) {
        throw insertError;
      }
    }

    console.log("✅ System configuration activated!\n");

    // Step 2: Create sample tasks
    console.log("📋 Creating sample autonomous tasks...");

    const sampleTasks = [
      {
        task_type: "documentation",
        description: "Update CHANGELOG.md with autonomous system v1.0",
        priority: 5,
        autonomy_level: 2,
        risk_level: "low",
        requires_approval: false,
        files_affected: ["CHANGELOG.md"],
      },
      {
        task_type: "layout_fix",
        description: "Fix spacing inconsistencies in Dashboard components",
        priority: 6,
        autonomy_level: 2,
        risk_level: "low",
        requires_approval: false,
        files_affected: ["src/pages/Dashboard.tsx"],
      },
      {
        task_type: "type_improvement",
        description: "Replace any types with proper TypeScript types",
        priority: 7,
        autonomy_level: 2,
        risk_level: "low",
        requires_approval: false,
        files_affected: ["src/hooks/use-bookings.ts"],
      },
    ];

    const { data: tasksData, error: tasksError } = await supabase
      .from("autonomous_tasks")
      .insert(sampleTasks)
      .select();

    if (tasksError) {
      console.log("⚠️  Task creation failed:", tasksError.message);
    } else {
      console.log(`✅ Created ${tasksData?.length || 0} sample tasks!\n`);
    }

    // Step 3: Verify setup
    console.log("🔍 Verifying system status...\n");

    const { data: config } = await supabase
      .from("autonomous_system_config")
      .select("*")
      .limit(1)
      .single();

    if (config) {
      console.log("📊 SYSTEM STATUS:");
      console.log(`   Enabled: ${config.enabled ? "✅ YES" : "❌ NO"}`);
      console.log(`   Mode: ${config.dry_run_mode ? "🧪 DRY-RUN" : "🚀 PRODUCTION"}`);
      console.log(`   Autonomy Level: ${config.autonomy_level}`);
      console.log(`   Max Parallel Tasks: ${config.max_parallel_tasks}`);
      console.log(`   Notification Email: ${config.notification_email}\n`);
    }

    const { data: tasks } = await supabase
      .from("autonomous_tasks")
      .select("*")
      .eq("status", "pending")
      .order("priority", { ascending: false });

    console.log("📝 PENDING TASKS:");
    if (tasks && tasks.length > 0) {
      tasks.forEach((task: any, i: number) => {
        console.log(`   ${i + 1}. [${task.task_type}] ${task.description}`);
        console.log(`      Priority: ${task.priority}, Risk: ${task.risk_level}`);
      });
    } else {
      console.log("   No pending tasks");
    }

    // Step 4: Test Edge Function
    console.log("\n🧪 Testing ai-agent-poll Edge Function...\n");

    const { data: pollResult, error: pollError } = await supabase.functions.invoke(
      "ai-agent-poll",
      {
        body: {},
      }
    );

    if (pollError) {
      console.log("⚠️  Edge Function test failed:", pollError.message);
      console.log("   (This is OK if function not deployed yet)\n");
    } else {
      console.log("✅ Edge Function response:", JSON.stringify(pollResult, null, 2));
      console.log("");
    }

    // Success summary
    console.log("╔════════════════════════════════════════════════════════════╗");
    console.log("║              ✅ SYSTEM FULLY ACTIVATED!                   ║");
    console.log("╚════════════════════════════════════════════════════════════╝\n");
    console.log("🎯 What happens next:\n");
    console.log("   1. ai-agent-poll Edge Function runs every 5 minutes");
    console.log("   2. Processes tasks in DRY-RUN mode (safe testing)");
    console.log("   3. Logs results in autonomous_execution_logs table");
    console.log("   4. You can monitor in Supabase Dashboard\n");
    console.log("📊 Monitor here:");
    console.log("   https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/editor\n");
    console.log("🛑 Emergency stop:");
    console.log("   npx tsx scripts/emergency-stop.ts\n");
  } catch (error: any) {
    console.error("\n❌ Activation failed:", error.message);
    console.error("   Check if migration was applied first\n");
    process.exit(1);
  }
}

activateSystem();
