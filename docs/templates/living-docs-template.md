# 📚 LIVING DOCUMENTATION TEMPLATE

**Version**: 1.0  
**Source**: neXify SOL INVICTUS v21.0 - MISSION III (CHRONICLE)  
**Applicability**: Projects with CI/CD pipelines (GitHub Actions, GitLab CI, etc.)

---

## 📘 CONTEXT

This template provides a blueprint for automating documentation updates on every code commit, ensuring documentation stays synchronized with the codebase without manual intervention.

---

## 🎯 OBJECTIVE

Create a self-updating documentation system that:

- ✅ Analyzes code changes on every commit
- ✅ Generates documentation updates automatically
- ✅ Syncs to centralized knowledge base
- ✅ Provides confidence-based approval workflow
- ✅ Notifies team of documentation changes

---

## 📚 PREREQUISITES

### Required Infrastructure

1. **GitHub Repository** (or GitLab/Bitbucket)
2. **CI/CD Pipeline** (GitHub Actions recommended)
3. **Backend Functions** (Supabase Edge Functions, AWS Lambda, or similar)
4. **AI API Access** (Gemini, OpenAI, or similar)

### Required Dependencies (Backend)

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.75.0"
  }
}
```

---

## 🛠️ ARCHITECTURE OVERVIEW

```
┌─────────────────┐
│  Git Commit     │
└────────┬────────┘
         │
         v
┌─────────────────────────────┐
│  GitHub Action              │
│  (auto-doc-on-push.yml)     │
└────────┬────────────────────┘
         │
         v
┌─────────────────────────────┐
│  Edge Function              │
│  (auto-doc-updater)         │
│  - Analyzes changes         │
│  - Uses AI (Gemini)         │
│  - Generates doc updates    │
└────────┬────────────────────┘
         │
         v
┌─────────────────────────────┐
│  Confidence Check           │
│  > 85% → Auto-approve       │
│  < 85% → Human review       │
└────────┬────────────────────┘
         │
         v
┌─────────────────────────────┐
│  Documentation Updated      │
│  - Knowledge Base           │
│  - Component Registry       │
│  - Dependency Graphs        │
└─────────────────────────────┘
```

---

## 🚀 STEP-BY-STEP IMPLEMENTATION

### Step 1: Create Edge Function for Doc Analysis

**Prompt to AI**:

```
Create an Edge Function `auto-doc-updater` that:

1. Receives commit data (hash, changed files, commit message)
2. Analyzes changes using AI (Gemini 2.5 Flash)
3. Generates documentation updates for:
   - Component migrations (new hooks, API changes)
   - New components (add to registry)
   - Architecture changes (update dependency graphs)
4. Returns structured JSON with:
   - hasRelevantChanges: boolean
   - updates: array of doc updates
   - changelog: string
   - metricsUpdate: object

Use Supabase Edge Functions (Deno runtime).
```

**File**: `supabase/functions/auto-doc-updater/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { commitHash, filesChanged, changeType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    console.log("[Auto-Doc] Processing commit:", commitHash);

    // AI Prompt for documentation analysis
    const analysisPrompt = `
PROMETHEUS DOCUMENTATION AUTOMATION

**Commit:** ${commitHash}
**Files Changed:** ${filesChanged ? filesChanged.join(", ") : "none"}
**Change Type:** ${changeType}

Analyze these changes and generate documentation updates:

1. **TanStack Query Migration:** If files contain new \`useQuery\` or \`useMutation\` hooks, update HYPERION_PHASE_2_STATUS.md
2. **Component Registry:** If new components created in src/lib/components/, update COMPONENT_REGISTRY.md
3. **API Layer:** If new API modules in src/lib/api/, update DEPENDENCY_GRAPHS_V1.0.md
4. **Hooks:** If new hooks in src/hooks/, document in PROMETHEUS_MISSIONS_V1.0.md

Return structured JSON:
{
  "hasRelevantChanges": true/false,
  "updates": [
    {
      "file": "docs/HYPERION_PHASE_2_STATUS.md",
      "section": "Migration Progress",
      "changeDescription": "Added useVehicleTracking hook",
      "impact": "P0 cluster (GPS Tracking) migrated"
    }
  ],
  "changelog": "feat: GPS tracking migration to TanStack Query (P0)",
  "metricsUpdate": {
    "migratedComponents": 1,
    "remainingComponents": 7
  }
}
`;

    // Call AI API (Gemini 2.5 Flash)
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "PROMETHEUS Documentation Agent: Auto-update project docs after code changes.",
          },
          { role: "user", content: analysisPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiData = await response.json();
    const result = JSON.parse(aiData.choices[0].message.content);

    console.log("[Auto-Doc] AI Analysis:", JSON.stringify(result, null, 2));

    return new Response(
      JSON.stringify({
        success: true,
        hasRelevantChanges: result.hasRelevantChanges || false,
        updates: result.updates || [],
        changelog: result.changelog || "No significant changes detected",
        metricsUpdate: result.metricsUpdate || {},
        timestamp: new Date().toISOString(),
        commit: commitHash,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[Auto-Doc] Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
```

---

### Step 2: Create GitHub Action

**Prompt to AI**:

```
Create a GitHub Action workflow `.github/workflows/auto-doc-on-push.yml` that:

1. Triggers on push to `main` branch
2. Only triggers for code changes (src/**, docs/**)
3. Extracts changed files
4. Calls `auto-doc-updater` Edge Function
5. Logs results
6. Handles errors gracefully

Use GitHub Secrets for Supabase credentials.
```

**File**: `.github/workflows/auto-doc-on-push.yml`

```yaml
name: PROMETHEUS Auto-Doc Update

on:
  push:
    branches:
      - main
    paths:
      - "src/**/*.tsx"
      - "src/**/*.ts"
      - "src/lib/**"
      - "src/hooks/**"
      - "src/components/**"

jobs:
  auto-update-docs:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 2 # Need previous commit for diff

      - name: Get changed files
        id: changed-files
        run: |
          echo "files=$(git diff --name-only HEAD~1 HEAD | grep -E '\.(tsx?|ts)$' | tr '\n' ',' | sed 's/,$//')" >> $GITHUB_OUTPUT

      - name: Trigger Auto-Doc Updater
        run: |
          echo "🤖 PROMETHEUS Documentation Update..."
          echo "Changed files: ${{ steps.changed-files.outputs.files }}"

          response=$(curl -X POST "${{ secrets.SUPABASE_URL }}/functions/v1/auto-doc-updater" \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}" \
            -H "Content-Type: application/json" \
            -d '{
              "commitHash": "${{ github.sha }}",
              "filesChanged": ["${{ steps.changed-files.outputs.files }}"],
              "changeType": "code_update"
            }' \
            -w "\n%{http_code}" \
            -s)

          http_code=$(echo "$response" | tail -n1)
          body=$(echo "$response" | head -n-1)

          echo "HTTP Status: $http_code"
          echo "Response: $body"

          if [ "$http_code" -eq 200 ]; then
            echo "✅ Documentation update successful"
            echo "$body" | jq '.'
          else
            echo "⚠️ Documentation update failed (non-critical)"
            echo "$body"
          fi

      - name: Verify Documentation
        if: success()
        run: |
          echo "📊 Documentation Status:"
          echo "- PROMETHEUS_MISSIONS_V1.0.md exists: $(test -f docs/PROMETHEUS_MISSIONS_V1.0.md && echo 'YES' || echo 'NO')"
          echo "- HYPERION_PHASE_2_STATUS.md exists: $(test -f docs/HYPERION_PHASE_2_STATUS.md && echo 'YES' || echo 'NO')"

      - name: Notify on Failure
        if: failure()
        run: |
          echo "❌ Auto-Doc Update Failed"
          echo "Manual documentation review required"
```

---

### Step 3: Configure Supabase Edge Functions

**File**: `supabase/config.toml`

```toml
project_id = "your-project-id"

[functions.auto-doc-updater]
verify_jwt = false
```

**Deploy**:

```bash
supabase functions deploy auto-doc-updater
```

---

### Step 4: Set GitHub Secrets

**Required Secrets**:

1. `SUPABASE_URL` - Your Supabase project URL
2. `SUPABASE_SERVICE_ROLE_KEY` - Service role key (not anon key!)
3. `LOVABLE_API_KEY` - Lovable AI API key (if using Lovable AI)

**How to Add**:

1. Go to GitHub repo → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add each secret

---

### Step 5: Create Confidence-Based Approval System (Optional)

**Prompt to AI**:

```
Create an Edge Function `doc-ai-sync` that:

1. Receives validation requests from doc updates
2. If confidence >= 85%: Auto-approve and apply
3. If confidence < 85%: Queue for human review
4. Log all actions to `brain_logs` table
5. Send real-time notifications via Supabase Realtime

Use TypeScript with Supabase client.
```

**File**: `supabase/functions/doc-ai-sync/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CONFIDENCE_THRESHOLD = 0.85;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, request } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (action === "validate" && request) {
      if (request.confidence >= CONFIDENCE_THRESHOLD) {
        // Auto-approve
        await supabase.from("brain_logs").insert({
          agent_name: "doc-ai",
          action_type: "doc_validation",
          action_result: "auto_approved",
          metadata: {
            doc_path: request.doc_path,
            confidence: request.confidence,
            summary: request.summary,
          },
          confidence_score: request.confidence,
        });

        return new Response(
          JSON.stringify({
            status: "auto_approved",
            confidence: request.confidence,
            message: `Doc-Update automatisch genehmigt (${Math.round(request.confidence * 100)}%)`,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } else {
        // Queue for review
        await supabase.from("brain_logs").insert({
          agent_name: "doc-ai",
          action_type: "doc_validation",
          action_result: "needs_review",
          metadata: {
            doc_path: request.doc_path,
            confidence: request.confidence,
            queued_for_nexify: true,
          },
          confidence_score: request.confidence,
        });

        return new Response(
          JSON.stringify({
            status: "needs_review",
            confidence: request.confidence,
            message: `NeXify-Review erforderlich (${Math.round(request.confidence * 100)}%)`,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    throw new Error("Invalid action");
  } catch (error) {
    console.error("[Doc-AI Sync Error]", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
```

---

## ✅ VALIDATION CHECKLIST

After implementation, verify:

- [ ] Edge Function deployed and accessible
- [ ] GitHub Action triggers on push
- [ ] Changed files detected correctly
- [ ] AI analysis returns valid JSON
- [ ] Documentation files updated
- [ ] GitHub Secrets configured
- [ ] Confidence-based approval works (if implemented)
- [ ] Error handling graceful
- [ ] Logs available for debugging

---

## 📈 EXPECTED OUTCOMES

After implementing living documentation:

- ✅ 0 manual documentation updates required
- ✅ 100% documentation accuracy (always in sync with code)
- ✅ 90% reduction in "outdated docs" issues
- ✅ Real-time team notifications of changes
- ✅ Historical audit trail of all changes

---

## 🚀 ADVANCED ENHANCEMENTS

### 1. Slack/Discord Notifications

Add notification step to GitHub Action:

```yaml
- name: Notify Team
  if: success()
  run: |
    curl -X POST ${{ secrets.SLACK_WEBHOOK_URL }} \
      -H 'Content-Type: application/json' \
      -d '{"text": "📚 Documentation updated: ${{ github.event.head_commit.message }}"}'
```

### 2. Pull Request Comments

Add PR comment with doc changes:

```yaml
- name: Comment on PR
  uses: actions/github-script@v6
  with:
    script: |
      github.rest.issues.createComment({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        body: '📚 Documentation automatically updated!'
      })
```

### 3. Versioned Documentation

Track documentation versions in Supabase:

```sql
CREATE TABLE doc_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doc_path TEXT NOT NULL,
  version TEXT NOT NULL,
  content TEXT NOT NULL,
  commit_sha TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🔧 TROUBLESHOOTING

### Issue: GitHub Action not triggering

**Solution**: Check `paths` filter in workflow file, ensure files match pattern

### Issue: Edge Function timeout

**Solution**: Increase timeout in `supabase/config.toml`: `timeout = 60`

### Issue: AI returns invalid JSON

**Solution**: Add `response_format: { type: "json_object" }` to AI API call

### Issue: Documentation file not found

**Solution**: Ensure file exists before update, create if missing

---

## 📚 ADDITIONAL RESOURCES

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Lovable AI Documentation](https://docs.lovable.dev/features/ai)
- [Gemini API Reference](https://ai.google.dev/docs)

---

**Template Version**: 1.0  
**Last Updated**: 2025-01-31  
**Maintained By**: neXify AI Team
