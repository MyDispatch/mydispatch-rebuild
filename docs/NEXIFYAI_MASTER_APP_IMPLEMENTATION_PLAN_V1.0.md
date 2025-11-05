# 🚀 NeXifyAI MASTER App - Implementation Plan V1.0

**Erstellt:** 2025-11-05  
**Version:** 1.0.0  
**Status:** 🔧 IN PROGRESS  
**Ziel:** Schrittweise Umsetzung der NeXifyAI MASTER Application

---

## 📅 ZEITPLAN

### Phase 1: Foundation (Heute - Tag 1-2)
1. ✅ **Repository Setup**
   - Neues GitHub Repo erstellen
   - Initial Commit
   - README + License

2. ✅ **Frontend Bootstrap**
   - React + TypeScript + Vite
   - Tailwind CSS + shadcn/ui
   - Basis-Layout erstellen
   - PWA Konfiguration

3. ✅ **Supabase Setup**
   - Schema erweitern (nexify_master_agent)
   - RLS Policies erstellen
   - Edge Functions Struktur

4. ✅ **Authentication**
   - Fixed User Authentication
   - Session Management
   - Protected Routes

---

## 🏗️ SCHRITT-FÜR-SCHRITT IMPLEMENTATION

### SCHRITT 1: Neues GitHub Repository
```bash
# Neues Verzeichnis erstellen
cd /tmp
mkdir nexifyai-master-app
cd nexifyai-master-app

# Git initialisieren
git init
git branch -M main

# GitHub Repo erstellen (via API)
# Repo Name: nexifyai-master-app
# Description: NeXifyAI MASTER - Autonomous Agent Application
# Private: false
```

### SCHRITT 2: Frontend Bootstrap
```bash
# Vite + React + TypeScript
npm create vite@latest . -- --template react-ts

# Dependencies
npm install
npm install -D tailwindcss postcss autoprefixer
npm install @supabase/supabase-js
npm install zustand @tanstack/react-query
npm install lucide-react
npm install react-router-dom
npm install @monaco-editor/react

# shadcn/ui
npx shadcn-ui@latest init

# PWA
npm install -D vite-plugin-pwa
```

### SCHRITT 3: Projekt-Struktur
```
nexifyai-master-app/
├── public/
│   ├── manifest.json
│   └── icons/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── MainLayout.tsx
│   │   ├── chat/
│   │   │   ├── ChatInterface.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   └── ChatInput.tsx
│   │   ├── dashboard/
│   │   │   ├── AgentStatus.tsx
│   │   │   ├── QuickStats.tsx
│   │   │   └── RecentActions.tsx
│   │   └── ui/ (shadcn/ui)
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Chat.tsx
│   │   ├── Projects.tsx
│   │   ├── Knowledge.tsx
│   │   ├── Analytics.tsx
│   │   ├── Settings.tsx
│   │   └── Login.tsx
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── api/
│   │   └── utils/
│   ├── hooks/
│   │   ├── useAgent.ts
│   │   ├── useChat.ts
│   │   └── useAuth.ts
│   ├── store/
│   │   └── agentStore.ts
│   ├── types/
│   │   └── index.ts
│   └── App.tsx
├── supabase/
│   ├── migrations/
│   │   └── 20251105000001_create_agent_schema.sql
│   └── functions/
│       ├── nexify-agent-execute/
│       ├── nexify-agent-chat/
│       └── nexify-agent-cursor-execute/
├── .env.local
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

### SCHRITT 4: Supabase Migration
```sql
-- Migration: 20251105000001_create_agent_schema.sql

-- 1. Schema erstellen
CREATE SCHEMA IF NOT EXISTS nexify_master_agent;

-- 2. agent_sessions
CREATE TABLE nexify_master_agent.agent_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  session_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  session_end TIMESTAMPTZ,
  session_duration_seconds INT,
  loaded_projects TEXT[],
  loaded_knowledge JSONB,
  active_tasks INT DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. agent_actions
CREATE TABLE nexify_master_agent.agent_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES nexify_master_agent.agent_sessions(id),
  action_type TEXT NOT NULL,
  action_description TEXT NOT NULL,
  action_input JSONB,
  action_output JSONB,
  status TEXT DEFAULT 'pending',
  error_message TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  duration_ms INT,
  affected_files TEXT[],
  affected_projects TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. agent_capabilities
CREATE TABLE nexify_master_agent.agent_capabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  capability_name TEXT UNIQUE NOT NULL,
  capability_type TEXT NOT NULL,
  capability_description TEXT,
  is_enabled BOOLEAN DEFAULT true,
  requires_credentials BOOLEAN DEFAULT false,
  credentials_configured BOOLEAN DEFAULT false,
  usage_count INT DEFAULT 0,
  success_count INT DEFAULT 0,
  error_count INT DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. agent_credentials
CREATE TABLE nexify_master_agent.agent_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  service_name TEXT NOT NULL,
  credential_type TEXT NOT NULL,
  encrypted_value TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, service_name)
);

-- 6. agent_memory
CREATE TABLE nexify_master_agent.agent_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memory_type TEXT NOT NULL,
  memory_key TEXT NOT NULL,
  memory_value JSONB NOT NULL,
  importance_score NUMERIC(3,2) DEFAULT 0.5,
  access_count INT DEFAULT 0,
  last_accessed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(memory_type, memory_key)
);

-- 7. agent_chat_messages
CREATE TABLE nexify_master_agent.agent_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES nexify_master_agent.agent_sessions(id),
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  tokens_used INT,
  model_used TEXT,
  response_time_ms INT,
  related_action_ids UUID[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. agent_workflows
CREATE TABLE nexify_master_agent.agent_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_name TEXT UNIQUE NOT NULL,
  workflow_description TEXT,
  workflow_steps JSONB NOT NULL,
  trigger_type TEXT,
  trigger_config JSONB,
  is_enabled BOOLEAN DEFAULT true,
  execution_count INT DEFAULT 0,
  last_execution_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies (Owner-only)
ALTER TABLE nexify_master_agent.agent_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_master_agent.agent_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_master_agent.agent_capabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_master_agent.agent_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_master_agent.agent_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_master_agent.agent_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE nexify_master_agent.agent_workflows ENABLE ROW LEVEL SECURITY;

-- Policies für agent_sessions
CREATE POLICY "Users can view own sessions"
  ON nexify_master_agent.agent_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions"
  ON nexify_master_agent.agent_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON nexify_master_agent.agent_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- (Analog für alle anderen Tabellen)

-- Initiale Capabilities
INSERT INTO nexify_master_agent.agent_capabilities (capability_name, capability_type, capability_description, requires_credentials) VALUES
  ('cursor_api', 'api', 'Cursor API Integration', true),
  ('github_api', 'api', 'GitHub API Integration', true),
  ('vercel_api', 'api', 'Vercel API Integration', true),
  ('code_generation', 'skill', 'Generate Code', false),
  ('code_review', 'skill', 'Review Code', false),
  ('deployment', 'skill', 'Deploy Applications', true),
  ('research', 'skill', 'Web Research', false),
  ('file_operations', 'tool', 'Read/Write Files', false),
  ('knowledge_query', 'tool', 'Query Knowledge Base', false);
```

### SCHRITT 5: Edge Functions
```typescript
// nexify-agent-chat/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { message, session_id, context } = await req.json();

    // 1. Session erstellen/abrufen
    let sessionId = session_id;
    if (!sessionId) {
      const { data: newSession } = await supabase
        .from('nexify_master_agent.agent_sessions')
        .insert({
          user_id: req.headers.get('user-id'), // aus JWT
          status: 'active'
        })
        .select()
        .single();
      sessionId = newSession.id;
    }

    // 2. Chat-Message speichern
    await supabase
      .from('nexify_master_agent.agent_chat_messages')
      .insert({
        session_id: sessionId,
        role: 'user',
        content: message
      });

    // 3. AI-Response generieren (hier könnte OpenAI API o.ä. sein)
    const response = `Echo: ${message}`;

    // 4. Agent-Response speichern
    await supabase
      .from('nexify_master_agent.agent_chat_messages')
      .insert({
        session_id: sessionId,
        role: 'assistant',
        content: response
      });

    return new Response(
      JSON.stringify({ success: true, response, session_id: sessionId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

### SCHRITT 6: Frontend Components

#### MainLayout.tsx
```typescript
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function MainLayout() {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

#### ChatInterface.tsx
```typescript
import { useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

export function ChatInterface() {
  const { messages, sendMessage, isLoading } = useChat();

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
      </div>
      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </div>
  );
}
```

#### useChat.ts
```typescript
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    setIsLoading(true);
    try {
      const { data } = await supabase.functions.invoke('nexify-agent-chat', {
        body: { message: content, session_id: sessionId }
      });

      if (data.success) {
        setSessionId(data.session_id);
        // Refresh messages
        loadMessages(data.session_id);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (sessId: string) => {
    const { data } = await supabase
      .from('nexify_master_agent.agent_chat_messages')
      .select('*')
      .eq('session_id', sessId)
      .order('created_at', { ascending: true });

    setMessages(data || []);
  };

  // Realtime Subscription
  useEffect(() => {
    if (!sessionId) return;

    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'nexify_master_agent',
          table: 'agent_chat_messages',
          filter: `session_id=eq.${sessionId}`
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  return { messages, sendMessage, isLoading };
}
```

---

## 🔐 AUTHENTICATION SETUP

### Fixed User (Pascal)
```typescript
// lib/auth.ts
const FIXED_USER = {
  email: 'courbois1981@gmail.com',
  password: '1def!xO2022!!'
};

export async function loginFixedUser() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: FIXED_USER.email,
    password: FIXED_USER.password
  });

  if (error) throw error;
  return data;
}

// User in Supabase erstellen (einmalig):
// Via Supabase Dashboard → Authentication → Add User
// Email: courbois1981@gmail.com
// Password: 1def!xO2022!!
```

---

## 🚀 DEPLOYMENT

### Vercel Setup
```bash
# Vercel CLI installieren
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Environment Variables setzen:
# VITE_SUPABASE_URL
# VITE_SUPABASE_ANON_KEY
```

### GitHub Actions (CI/CD)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## ✅ COMPLETION CHECKLIST

### Phase 1: Foundation
- [ ] GitHub Repo erstellt
- [ ] Frontend Bootstrap
- [ ] Supabase Migration
- [ ] Basic UI Components
- [ ] Authentication
- [ ] Deployment

### Phase 2: Features
- [ ] Chat Interface
- [ ] Dashboard
- [ ] Project Switcher
- [ ] Knowledge Browser
- [ ] Agent Status Monitor

### Phase 3: Integrations
- [ ] Cursor API
- [ ] GitHub API
- [ ] Vercel API
- [ ] Code Editor
- [ ] File Manager

### Phase 4: Advanced
- [ ] Workflows
- [ ] Self-Learning
- [ ] Self-Extension
- [ ] Analytics
- [ ] PWA Optimization

---

**Pascal, dies ist der vollständige Implementation Plan! Soll ich jetzt mit der Umsetzung starten?** 🚀
