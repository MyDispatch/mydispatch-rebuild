/**
 * ==================================================================================
 * EMERGENCY STOP COMMAND-LINE TOOL
 * ==================================================================================
 * Version: 1.0
 * Created: 2025-11-08
 * Purpose: Quick emergency stop for autonomous system
 * Author: NeXify AI System
 * Usage: npm run autonomous:emergency-stop "Reason for stop"
 * ==================================================================================
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const reason = process.argv[2] || "Manual emergency stop";
const durationHours = parseInt(process.argv[3] || "24", 10);

console.log("🚨 EMERGENCY STOP");
console.log(`Reason: ${reason}`);
console.log(`Duration: ${durationHours} hours\n`);

(async () => {
  const { data, error } = await supabase.rpc("emergency_stop_autonomous_system", {
    p_reason: reason,
    p_duration_hours: durationHours,
  });

  if (error) {
    console.error("❌ Failed to activate emergency stop:", error);
    process.exit(1);
  }

  console.log("✅ Emergency stop activated");
  console.log(`Active until: ${new Date(Date.now() + durationHours * 60 * 60 * 1000).toISOString()}`);
  console.log("\nTo deactivate:");
  console.log('  psql> UPDATE autonomous_system_config SET emergency_stop = false WHERE id = 1;');
  process.exit(0);
})();
