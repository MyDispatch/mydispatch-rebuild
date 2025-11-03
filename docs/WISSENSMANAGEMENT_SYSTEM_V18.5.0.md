# WISSENSMANAGEMENT-SYSTEM V18.5.0

> **Version:** 18.5.0  
> **Status:** ✅ PRODUKTIV  
> **Zweck:** Zentrales Brain für alle MyDispatch-Informationen

---

## 🎯 VISION

MyDispatch nutzt ein **intelligentes Wissensmanagement-System** (Brain) als Single Source of Truth für:
- Dokumentationen (Technical, Business, Design)
- Code-Patterns & Best Practices
- API-Spezifikationen
- Kunden-Daten & Insights
- Feature-Roadmap & Planung
- Support-Tickets & FAQs

**Ziel:** Jede Information ist **sofort auffindbar**, **immer aktuell**, und **rollenbas** kontrolliert zugänglich.

---

## 📁 BRAIN-ARCHITEKTUR

### **1. Dokumentations-Layer**

```
docs/
├── technical/          # Technische Spezifikationen
│   ├── SYSTEM_ARCHITEKTUR_V18.5.0.md
│   ├── API_DOKUMENTATION_V18.5.0.md
│   ├── DATENBANK_SCHEMA_V18.5.0.md
│   ├── CODE_STANDARDS_V18.5.0.md
│   └── TESTING_STRATEGIE_V18.5.0.md
│
├── design/            # Design & UI/UX
│   ├── CI_HANDBUCH_V18.5.0.md
│   ├── DESIGN_SYSTEM_V18.5.0.md
│   ├── LAYOUT_SYSTEM_V18.5.0.md
│   └── UI_LIBRARY_SYSTEM_V18.5.0.md
│
├── business/          # Business & Marketing
│   ├── MARKENPOSITIONIERUNG_V18.5.0.md
│   ├── FEATURE_ROADMAP_V18.5.0.md
│   ├── TARIFE_PREISLISTE_V18.5.0.md
│   └── MARKETING_STRATEGIE_V18.5.0.md
│
├── integrations/      # API & Drittanbieter
│   ├── API_SECRETS_MANAGEMENT_V18.5.0.md
│   ├── STRIPE_INTEGRATION_V18.5.0.md
│   ├── DATENQUELLEN_INTEGRATION_V18.5.0.md
│   └── N8N_WORKFLOWS_V18.5.0.md
│
├── processes/         # Arbeitsweisen & Standards
│   ├── ARBEITSWEISE_STANDARDS_V18.5.0.md
│   ├── DEPLOYMENT_WORKFLOW_V18.5.0.md
│   ├── FEHLERBEHANDLUNG_PROZESS_V18.5.0.md
│   └── RELEASE_MANAGEMENT_V18.5.0.md
│
├── quality/           # Qualitätssicherung
│   ├── QUALITAETS_STANDARDS_V18.5.0.md
│   ├── PRUEF_VALIDIERUNG_SYSTEM_V18.5.0.md
│   ├── REVIEW_CHECKLISTE_V18.5.0.md
│   └── PERFORMANCE_BENCHMARKS_V18.5.0.md
│
└── ai/                # AI-Prompts & Meta-Vorgaben
    ├── BESTÄTIGUNGS_PROMPT_V18.5.0.md
    ├── AI_PROMPTS_SYSTEM_V18.5.0.md
    └── AI_INTEGRATION_V18.3.30.md
```

### **2. Code-Layer (Wiederverwendbar)**

```
src/
├── lib/
│   ├── database-utils.ts       # CompanyQuery, SoftDelete
│   ├── format-utils.ts         # formatCurrency, formatDate
│   ├── design-system.ts        # Semantic Tokens, Typography
│   ├── error-handler.ts        # Zentrales Error-Handling
│   └── logger.ts               # Strukturiertes Logging
│
├── components/
│   ├── base/                   # Atomic Components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Badge.tsx
│   │
│   ├── shared/                 # Shared Components
│   │   ├── DataTable.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── LoadingSkeleton.tsx
│   │
│   └── forms/                  # Form Components
│       ├── FormField.tsx
│       ├── FormSelect.tsx
│       └── FormDatePicker.tsx
│
└── hooks/                      # Custom React Hooks
    ├── useCompanyQuery.ts
    ├── useAuth.ts
    └── useToast.ts
```

### **3. Datenbank-Layer (Metadaten)**

```sql
-- Tabelle: knowledge_base
CREATE TABLE knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL, -- 'technical', 'design', 'business', 'ai'
  subcategory TEXT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  file_path TEXT, -- Link zu Markdown-Datei
  tags TEXT[],
  version TEXT NOT NULL,
  status TEXT NOT NULL, -- 'draft', 'review', 'approved', 'deprecated'
  access_level TEXT NOT NULL, -- 'public', 'internal', 'admin'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  author TEXT,
  search_vector TSVECTOR GENERATED ALWAYS AS (
    to_tsvector('german', title || ' ' || content)
  ) STORED
);

-- Full-Text-Search Index
CREATE INDEX idx_knowledge_base_search ON knowledge_base USING GIN(search_vector);

-- Tabelle: code_snippets
CREATE TABLE code_snippets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  language TEXT NOT NULL, -- 'typescript', 'sql', 'bash'
  code TEXT NOT NULL,
  tags TEXT[],
  category TEXT NOT NULL, -- 'database', 'frontend', 'backend'
  use_case TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabelle: best_practices
CREATE TABLE best_practices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT NOT NULL, -- 'code', 'design', 'security', 'performance'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  do_example TEXT, -- ✅ Beispiel
  dont_example TEXT, -- ❌ Beispiel
  reference_doc TEXT, -- Link zu Dokumentation
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabelle: faq
CREATE TABLE faq (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL, -- 'technical', 'business', 'support'
  tags TEXT[],
  view_count INTEGER DEFAULT 0,
  helpful_votes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔐 ZUGRIFFSKONTROLLE (ROLE-BASED ACCESS)

### **Rollen-Definition**

```typescript
enum UserRole {
  ADMIN = 'admin',           // Vollzugriff
  DEVELOPER = 'developer',   // Technical + Design Docs
  DESIGNER = 'designer',     // Design Docs
  BUSINESS = 'business',     // Business Docs
  SUPPORT = 'support',       // FAQs + Support Docs
  CUSTOMER = 'customer'      // Public Docs only
}

interface AccessMatrix {
  role: UserRole;
  canRead: string[];    // Kategorien
  canWrite: string[];   // Kategorien
  canDelete: string[];  // Kategorien
}

const ACCESS_CONTROL: AccessMatrix[] = [
  {
    role: UserRole.ADMIN,
    canRead: ['*'],
    canWrite: ['*'],
    canDelete: ['*']
  },
  {
    role: UserRole.DEVELOPER,
    canRead: ['technical', 'design', 'integrations', 'quality', 'ai'],
    canWrite: ['technical', 'integrations', 'quality'],
    canDelete: []
  },
  {
    role: UserRole.DESIGNER,
    canRead: ['design', 'business'],
    canWrite: ['design'],
    canDelete: []
  },
  {
    role: UserRole.BUSINESS,
    canRead: ['business', 'quality'],
    canWrite: ['business'],
    canDelete: []
  },
  {
    role: UserRole.SUPPORT,
    canRead: ['business', 'faq'],
    canWrite: ['faq'],
    canDelete: []
  },
  {
    role: UserRole.CUSTOMER,
    canRead: ['faq'],
    canWrite: [],
    canDelete: []
  }
];
```

### **RLS Policies**

```sql
-- Zugriffskontrolle für knowledge_base
CREATE POLICY "knowledge_base_read_policy" ON knowledge_base
  FOR SELECT
  USING (
    CASE 
      WHEN access_level = 'public' THEN true
      WHEN access_level = 'internal' THEN auth.jwt() ->> 'role' IN ('developer', 'designer', 'business', 'support', 'admin')
      WHEN access_level = 'admin' THEN auth.jwt() ->> 'role' = 'admin'
      ELSE false
    END
  );

CREATE POLICY "knowledge_base_write_policy" ON knowledge_base
  FOR INSERT
  WITH CHECK (
    CASE 
      WHEN category = 'technical' THEN auth.jwt() ->> 'role' IN ('developer', 'admin')
      WHEN category = 'design' THEN auth.jwt() ->> 'role' IN ('designer', 'admin')
      WHEN category = 'business' THEN auth.jwt() ->> 'role' IN ('business', 'admin')
      ELSE false
    END
  );
```

---

## 🔍 INTELLIGENTE SUCHE (FULL-TEXT + AI)

### **A. PostgreSQL Full-Text-Search**

```typescript
// lib/knowledge-base-search.ts
import { supabase } from '@/integrations/supabase/client';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  category: string;
  file_path: string;
  relevance: number;
}

export async function searchKnowledgeBase(
  query: string,
  category?: string
): Promise<SearchResult[]> {
  let queryBuilder = supabase
    .from('knowledge_base')
    .select('*')
    .textSearch('search_vector', query, {
      type: 'websearch',
      config: 'german'
    })
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(10);

  if (category) {
    queryBuilder = queryBuilder.eq('category', category);
  }

  const { data, error } = await queryBuilder;

  if (error) throw error;

  return data.map(item => ({
    ...item,
    relevance: calculateRelevance(query, item)
  })).sort((a, b) => b.relevance - a.relevance);
}

function calculateRelevance(query: string, doc: any): number {
  const queryLower = query.toLowerCase();
  const titleMatch = doc.title.toLowerCase().includes(queryLower) ? 0.5 : 0;
  const contentMatch = doc.content.toLowerCase().includes(queryLower) ? 0.3 : 0;
  const tagsMatch = doc.tags?.some((tag: string) => 
    tag.toLowerCase().includes(queryLower)
  ) ? 0.2 : 0;

  return titleMatch + contentMatch + tagsMatch;
}
```

### **B. AI-Enhanced Search (Gemini 2.5 Flash)**

```typescript
// lib/ai-knowledge-search.ts
import { supabase } from '@/integrations/supabase/client';

export async function aiKnowledgeSearch(
  naturalLanguageQuery: string
): Promise<SearchResult[]> {
  // 1. AI interpretiert die Frage
  const { data: aiResponse } = await supabase.functions.invoke('ai-search', {
    body: {
      query: naturalLanguageQuery,
      context: 'mydispatch_knowledge_base'
    }
  });

  // AI liefert:
  // - Reformulierte Suchanfrage
  // - Relevante Kategorien
  // - Synonyme

  const { keywords, categories } = aiResponse;

  // 2. Full-Text-Search mit AI-Keywords
  const results = await searchKnowledgeBase(keywords.join(' '));

  // 3. AI rankt Ergebnisse nach Relevanz
  return results;
}
```

**Edge Function: `supabase/functions/ai-search/index.ts`**

```typescript
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, context } = await req.json();

    // Lovable AI Gateway aufrufen
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `Du bist ein intelligenter Such-Assistent für die MyDispatch Wissens-Datenbank.
            
            Deine Aufgabe: Interpretiere die natürlichsprachliche Suchanfrage und extrahiere:
            1. Keywords (relevante Suchbegriffe)
            2. Categories (technical, design, business, integrations, etc.)
            3. Synonyme (alternative Formulierungen)`
          },
          {
            role: "user",
            content: `Suchanfrage: "${query}"\nContext: ${context}`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_search_params",
              description: "Extrahiere Such-Parameter aus natürlichsprachlicher Anfrage",
              parameters: {
                type: "object",
                properties: {
                  keywords: {
                    type: "array",
                    items: { type: "string" },
                    description: "Relevante Suchbegriffe"
                  },
                  categories: {
                    type: "array",
                    items: { type: "string" },
                    description: "Relevante Kategorien"
                  },
                  synonyms: {
                    type: "array",
                    items: { type: "string" },
                    description: "Alternative Formulierungen"
                  }
                },
                required: ["keywords", "categories"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "extract_search_params" } }
      }),
    });

    const result = await response.json();
    const toolCall = result.choices[0].message.tool_calls[0];
    const searchParams = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(searchParams), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
```

---

## 📊 WISSENS-DASHBOARD (ADMIN-PANEL)

### **A. Übersicht-Statistiken**

```typescript
// components/KnowledgeDashboard.tsx
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface KnowledgeStats {
  total_docs: number;
  by_category: Record<string, number>;
  by_status: Record<string, number>;
  recent_updates: Array<{
    title: string;
    updated_at: string;
    author: string;
  }>;
  most_searched: Array<{
    query: string;
    count: number;
  }>;
}

export function KnowledgeDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['knowledge-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_knowledge_stats');
      if (error) throw error;
      return data as KnowledgeStats;
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Docs */}
      <KPICard
        title="Gesamt Dokumente"
        value={stats?.total_docs || 0}
        icon={<FileText />}
      />

      {/* By Category */}
      <Card>
        <CardHeader>
          <CardTitle>Dokumente nach Kategorie</CardTitle>
        </CardHeader>
        <CardContent>
          <PieChart data={Object.entries(stats?.by_category || {})} />
        </CardContent>
      </Card>

      {/* By Status */}
      <Card>
        <CardHeader>
          <CardTitle>Status-Verteilung</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart data={Object.entries(stats?.by_status || {})} />
        </CardContent>
      </Card>

      {/* Recent Updates */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Letzte Aktualisierungen</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={[
              { key: 'title', label: 'Titel' },
              { key: 'author', label: 'Autor' },
              { key: 'updated_at', label: 'Datum' }
            ]}
            data={stats?.recent_updates || []}
          />
        </CardContent>
      </Card>

      {/* Most Searched */}
      <Card>
        <CardHeader>
          <CardTitle>Top Suchanfragen</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {stats?.most_searched.map(item => (
              <li key={item.query} className="flex justify-between">
                <span>{item.query}</span>
                <Badge>{item.count}x</Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 🚀 WORKFLOW-INTEGRATION

### **A. GitHub Auto-Commit (Docs-Sync)**

```yaml
# .github/workflows/docs-sync.yml
name: Docs Sync to Database

on:
  push:
    branches: [main]
    paths:
      - 'docs/**/*.md'

jobs:
  sync-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Sync Docs to Supabase
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
        run: |
          node scripts/sync-docs-to-db.js
```

**Script: `scripts/sync-docs-to-db.js`**

```typescript
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { glob } from 'glob';
import { parse } from 'gray-matter'; // YAML Front-Matter Parser

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function syncDocsToDatabase() {
  const files = await glob('docs/**/*.md');

  for (const file of files) {
    const content = readFileSync(file, 'utf-8');
    const { data: frontMatter, content: markdownContent } = parse(content);

    const doc = {
      title: frontMatter.title || extractTitleFromContent(markdownContent),
      content: markdownContent,
      file_path: file,
      category: extractCategoryFromPath(file),
      version: frontMatter.version || '18.5.0',
      status: frontMatter.status || 'approved',
      access_level: frontMatter.access_level || 'internal',
      tags: frontMatter.tags || [],
      author: frontMatter.author || 'MyDispatch Team'
    };

    // Upsert (Insert or Update)
    const { error } = await supabase
      .from('knowledge_base')
      .upsert(doc, { onConflict: 'file_path' });

    if (error) {
      console.error(`❌ Fehler bei ${file}:`, error);
    } else {
      console.log(`✅ Synced: ${file}`);
    }
  }

  console.log('🎉 Alle Docs synchronisiert!');
}

syncDocsToDatabase();
```

---

## ✅ ERFOLGS-METRIKEN

| Metrik | Ziel | Tracking |
|--------|------|----------|
| Docs Coverage | >95% aller Features | Manual Review |
| Docs Aktualität | <7 Tage seit Update | Git Timestamps |
| Search Accuracy | >90% relevante Ergebnisse | User-Feedback |
| Access Time | <2s für Docs-Suche | Performance-Monitoring |
| User Satisfaction | >4.5/5 Rating | Feedback-System |

---

**Version:** V18.5.0  
**Status:** ✅ PRODUKTIV  
**Nächstes Review:** 2025-02-26
