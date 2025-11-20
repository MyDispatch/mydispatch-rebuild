#!/usr/bin/env tsx
/* ==================================================================================
   KRONOS CLI - KRONOS V18.0
   ==================================================================================
   CLI Tool für lokale KRONOS-Entwicklung
   
   Usage:
     npm run kronos:parse              # Parse Wiki zu YAML
     npm run kronos:graph              # Generate Dependency Graph
     npm run kronos:execute            # Execute Code Generation (all)
     npm run kronos:execute -- --level=0  # Execute specific level
     npm run kronos:status             # Show execution status
   ================================================================================== */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ Missing environment variables: VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Colors
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

// Commands
const commands = {
  async parse() {
    console.log(`${colors.cyan}📖 Parsing Wiki...${colors.reset}`);

    const { data, error } = await supabase.functions.invoke("wiki-to-yaml-parser", {
      body: { mode: "full", source: "knowledge_base" },
    });

    if (error) {
      console.error(`${colors.red}❌ Error:${colors.reset}`, error.message);
      process.exit(1);
    }

    console.log(`${colors.green}✅ Success!${colors.reset}`);
    console.log(`   Created: ${JSON.stringify(data.entities_created)}`);
    console.log(`   Total: ${data.total} entities`);
  },

  async graph() {
    console.log(`${colors.cyan}📊 Generating Dependency Graph...${colors.reset}`);

    const { data, error } = await supabase.functions.invoke("generate-dependency-graph");

    if (error) {
      console.error(`${colors.red}❌ Error:${colors.reset}`, error.message);
      process.exit(1);
    }

    console.log(`${colors.green}✅ Success!${colors.reset}`);
    console.log(`   Levels: ${data.graph.total_levels}`);
    console.log(`   Entities: ${data.graph.total_entities}`);
    console.log(`   Estimated Duration: ${data.graph.estimated_duration}`);

    data.graph.levels.forEach((level: any) => {
      console.log(
        `   Level ${level.level}: ${level.tasks} tasks (~${level.estimated_time_seconds}s)`
      );
    });
  },

  async execute(args: string[]) {
    const levelArg = args.find((arg) => arg.startsWith("--level="));
    const level = levelArg ? parseInt(levelArg.split("=")[1]) : undefined;

    if (level !== undefined) {
      console.log(`${colors.cyan}🚀 Executing Level ${level}...${colors.reset}`);
    } else {
      console.log(`${colors.cyan}🚀 Executing Full Generation...${colors.reset}`);
    }

    const { data, error } = await supabase.functions.invoke("kronos-executor", {
      body: {
        mode: "execute",
        levels: level !== undefined ? [level] : undefined,
      },
    });

    if (error) {
      console.error(`${colors.red}❌ Error:${colors.reset}`, error.message);
      process.exit(1);
    }

    console.log(`${colors.green}✅ Execution Complete!${colors.reset}`);
    console.log(`   Run ID: ${data.run_id}`);
    console.log(`   Completed: ${data.execution_summary.completed}`);
    console.log(`   Failed: ${data.execution_summary.failed}`);
    console.log(`   Skipped: ${data.execution_summary.skipped}`);
  },

  async status() {
    console.log(`${colors.cyan}📊 Fetching Status...${colors.reset}\n`);

    // Get entities stats
    const { data: entities, error: entitiesError } = await supabase
      .from("entities_queue")
      .select("status, level, entity_type");

    if (entitiesError) {
      console.error(`${colors.red}❌ Error:${colors.reset}`, entitiesError.message);
      process.exit(1);
    }

    const stats = {
      total: entities.length,
      pending: entities.filter((e) => e.status === "pending").length,
      in_progress: entities.filter((e) => e.status === "in_progress").length,
      completed: entities.filter((e) => e.status === "completed").length,
      failed: entities.filter((e) => e.status === "failed").length,
    };

    console.log(`${colors.blue}Total Entities:${colors.reset} ${stats.total}`);
    console.log(`${colors.yellow}Pending:${colors.reset} ${stats.pending}`);
    console.log(`${colors.cyan}In Progress:${colors.reset} ${stats.in_progress}`);
    console.log(`${colors.green}Completed:${colors.reset} ${stats.completed}`);
    console.log(`${colors.red}Failed:${colors.reset} ${stats.failed}`);

    const completionRate = Math.round((stats.completed / stats.total) * 100);
    console.log(`\n${colors.green}Completion Rate:${colors.reset} ${completionRate}%`);

    // Get latest run
    const { data: run } = await supabase
      .from("execution_runs")
      .select("*")
      .order("started_at", { ascending: false })
      .limit(1)
      .single();

    if (run) {
      console.log(`\n${colors.blue}Latest Run:${colors.reset}`);
      console.log(`  Status: ${run.status}`);
      console.log(`  Level: ${run.current_level} / ${run.total_levels}`);
      console.log(`  Started: ${new Date(run.started_at).toLocaleString()}`);
      if (run.completed_at) {
        console.log(`  Completed: ${new Date(run.completed_at).toLocaleString()}`);
      }
    }
  },

  help() {
    console.log(`
${colors.cyan}KRONOS CLI - KRONOS V18.0${colors.reset}

${colors.blue}Available Commands:${colors.reset}

  ${colors.green}parse${colors.reset}            Parse Wiki to YAML Entities
  ${colors.green}graph${colors.reset}            Generate Dependency Graph
  ${colors.green}execute${colors.reset}          Execute Code Generation (all levels)
  ${colors.green}execute --level=N${colors.reset}  Execute specific level
  ${colors.green}status${colors.reset}           Show execution status
  ${colors.green}help${colors.reset}             Show this help message

${colors.blue}Examples:${colors.reset}

  npm run kronos:parse
  npm run kronos:graph
  npm run kronos:execute
  npm run kronos:execute -- --level=0
  npm run kronos:status
    `);
  },
};

// Main
async function main() {
  const [command, ...args] = process.argv.slice(2);

  if (!command || command === "help") {
    commands.help();
    return;
  }

  if (!(command in commands)) {
    console.error(`${colors.red}❌ Unknown command: ${command}${colors.reset}`);
    commands.help();
    process.exit(1);
  }

  try {
    await (commands as any)[command](args);
  } catch (error) {
    console.error(`${colors.red}❌ Error:${colors.reset}`, error);
    process.exit(1);
  }
}

main();
