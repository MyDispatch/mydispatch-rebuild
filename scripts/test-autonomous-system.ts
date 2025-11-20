#!/usr/bin/env node
// ==================================================================================
// AUTONOMOUS SYSTEM TEST SCRIPT V1.0
// ==================================================================================
// Purpose: Automated testing of autonomous system without user input
// Usage: npm run test:autonomous
// ==================================================================================

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://ygpwuiygivxoqtyoigtg.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!SERVICE_ROLE_KEY) {
  console.error("❌ SUPABASE_SERVICE_ROLE_KEY not found in environment");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  duration: number;
}

const results: TestResult[] = [];

async function runTest(name: string, testFn: () => Promise<boolean>): Promise<void> {
  const start = Date.now();
  console.log(`\n🧪 Running: ${name}...`);

  try {
    const passed = await testFn();
    const duration = Date.now() - start;

    results.push({
      name,
      passed,
      message: passed ? "✓ Passed" : "✗ Failed",
      duration,
    });

    console.log(passed ? `✅ PASSED (${duration}ms)` : `❌ FAILED (${duration}ms)`);
  } catch (error) {
    const duration = Date.now() - start;
    results.push({
      name,
      passed: false,
      message: `Error: ${error instanceof Error ? error.message : String(error)}`,
      duration,
    });

    console.log(`❌ ERROR (${duration}ms): ${error}`);
  }
}

// Test 1: Database connectivity
async function testDatabaseConnection(): Promise<boolean> {
  const { data, error } = await supabase.from("autonomous_system_config").select("*").single();

  if (error) {
    console.error("Database error:", error);
    return false;
  }

  console.log(`   Config found: enabled=${data.enabled}, dry_run=${data.dry_run_mode}`);
  return !!data;
}

// Test 2: Check tables exist
async function testTablesExist(): Promise<boolean> {
  const tables = [
    "autonomous_tasks",
    "autonomous_execution_logs",
    "autonomous_system_config",
    "autonomous_safety_checks",
  ];

  for (const table of tables) {
    const { error } = await supabase.from(table).select("id").limit(1);

    if (error) {
      console.error(`   Table ${table} not accessible:`, error.message);
      return false;
    }
  }

  console.log(`   All 4 tables accessible`);
  return true;
}

// Test 3: Check pending tasks
async function testPendingTasks(): Promise<boolean> {
  const { data, error } = await supabase
    .from("autonomous_tasks")
    .select("*")
    .eq("status", "pending");

  if (error) {
    console.error("Tasks query error:", error);
    return false;
  }

  console.log(`   Found ${data?.length || 0} pending tasks`);
  return true;
}

// Test 4: Edge Function deployment check
async function testEdgeFunctionDeployed(): Promise<boolean> {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/ai-agent-poll`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      console.error(`   HTTP ${response.status}: ${response.statusText}`);
      return false;
    }

    const data = await response.json();
    console.log(
      `   Response: success=${data.success}, dry_run=${data.dry_run}, processed=${data.processed || 0}`
    );

    return data.success === true;
  } catch (error) {
    console.error("   Fetch error:", error);
    return false;
  }
}

// Test 5: PostgreSQL functions exist
async function testPostgresFunctions(): Promise<boolean> {
  const functions = [
    "get_autonomous_config",
    "create_autonomous_task",
    "emergency_stop_autonomous_system",
  ];

  for (const func of functions) {
    const { data, error } = await supabase.rpc(func as any);

    // We expect errors for some (missing params), but they should be argument errors, not "function not found"
    if (error && !error.message.includes("argument")) {
      console.error(`   Function ${func} error:`, error.message);
      return false;
    }
  }

  console.log(`   All 3 PostgreSQL functions exist`);
  return true;
}

// Test 6: System statistics view
async function testSystemStats(): Promise<boolean> {
  const { data, error } = await supabase.from("autonomous_system_stats").select("*").single();

  if (error) {
    console.error("Stats view error:", error);
    return false;
  }

  console.log(
    `   Stats: total=${data.total_tasks}, pending=${data.pending_tasks}, completed=${data.completed_tasks}`
  );
  return true;
}

// Test 7: Create test task
async function testCreateTask(): Promise<boolean> {
  const { data, error } = await supabase.rpc("create_autonomous_task", {
    p_task_type: "test_task",
    p_description: "Automated test task created by test script",
    p_priority: 1,
    p_autonomy_level: 2,
  });

  if (error) {
    console.error("Task creation error:", error);
    return false;
  }

  console.log(`   Task created successfully: ${data}`);
  return true;
}

// Test 8: Execution logs accessible
async function testExecutionLogs(): Promise<boolean> {
  const { data, error } = await supabase.from("autonomous_execution_logs").select("*").limit(5);

  if (error) {
    console.error("Logs query error:", error);
    return false;
  }

  console.log(`   Found ${data?.length || 0} execution logs`);
  return true;
}

// Main test runner
async function runAllTests() {
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║   AUTONOMOUS SYSTEM - AUTOMATED TEST SUITE            ║");
  console.log("╚════════════════════════════════════════════════════════╝");
  console.log(`\nSupabase URL: ${SUPABASE_URL}`);
  console.log("Service Role Key: ✓ Loaded\n");

  await runTest("1. Database Connection", testDatabaseConnection);
  await runTest("2. Tables Exist", testTablesExist);
  await runTest("3. Pending Tasks Query", testPendingTasks);
  await runTest("4. Edge Function Deployed", testEdgeFunctionDeployed);
  await runTest("5. PostgreSQL Functions", testPostgresFunctions);
  await runTest("6. System Statistics View", testSystemStats);
  await runTest("7. Create Test Task", testCreateTask);
  await runTest("8. Execution Logs", testExecutionLogs);

  // Summary
  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║   TEST SUMMARY                                         ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

  console.log(`Total Tests: ${results.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⏱️  Total Duration: ${totalDuration}ms\n`);

  if (failed > 0) {
    console.log("Failed Tests:");
    results
      .filter((r) => !r.passed)
      .forEach((r) => {
        console.log(`  • ${r.name}: ${r.message}`);
      });
    console.log();
  }

  const exitCode = failed > 0 ? 1 : 0;
  console.log(exitCode === 0 ? "🎉 All tests passed!\n" : "❌ Some tests failed\n");

  process.exit(exitCode);
}

// Run tests
runAllTests().catch((error) => {
  console.error("\n❌ Fatal error:", error);
  process.exit(1);
});
