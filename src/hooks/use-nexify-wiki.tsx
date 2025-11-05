/* ==================================================================================
   USE-NEXIFY-WIKI - Automatisches Kontext-Laden
   ==================================================================================
   Lädt automatisch NeXify-Kontext aus Supabase beim App-Start
   ================================================================================== */

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface NeXifyContext {
  learnings: unknown[];
  issues: unknown[];
  components: unknown[];
  bestPractices: unknown[];
  loaded: boolean;
  error?: string;
}

export function useNeXifyWiki() {
  const [context, setContext] = useState<NeXifyContext>({
    learnings: [],
    issues: [],
    components: [],
    bestPractices: [],
    loaded: false
  });

  useEffect(() => {
    async function loadNeXifyContext() {
      try {
        console.log('🧠 NeXify AI MASTER - Loading Context...');

        // 1. Create Session
        const sessionId = crypto.randomUUID();
        const { data: session, error: sessionError } = await supabase
          .from('nexify_master_sessions')
          .insert({
            session_id: sessionId,
            user_email: 'pascal@mydispatch.de',
            started_at: new Date().toISOString()
          })
          .select()
          .single();

        if (sessionError) {
          console.warn('⚠️  Session creation failed (Migrations needed?):', sessionError.message);
          setContext(prev => ({ ...prev, loaded: true, error: 'Migrations pending' }));
          return;
        }

        // 2. Load Recent Learnings
        const { data: learnings } = await supabase
          .from('ai_learning_patterns')
          .select('*')
          .order('learned_at', { ascending: false })
          .limit(10);

        // 3. Load Critical Issues
        const { data: issues } = await supabase
          .from('known_issues')
          .select('*')
          .eq('resolved', false)
          .order('severity', { ascending: false })
          .limit(10);

        // 4. Load Active Components
        const { data: components } = await supabase
          .from('component_registry')
          .select('*')
          .eq('verification_status', 'active')
          .limit(20);

        // 5. Load Best Practices
        const { data: bestPractices } = await supabase
          .from('best_practices')
          .select('*')
          .order('confidence_score', { ascending: false })
          .limit(10);

        console.log('✅ NeXify Context Loaded:', {
          learnings: learnings?.length || 0,
          issues: issues?.length || 0,
          components: components?.length || 0,
          bestPractices: bestPractices?.length || 0
        });

        setContext({
          learnings: learnings || [],
          issues: issues || [],
          components: components || [],
          bestPractices: bestPractices || [],
          loaded: true
        });

        // 6. Store in LocalStorage for quick access
        localStorage.setItem('nexify_context', JSON.stringify({
          learnings,
          issues,
          components,
          bestPractices,
          session_id: sessionId,
          loaded_at: new Date().toISOString()
        }));

      } catch (err) {
        console.error('❌ NeXify Context Error:', err);
        setContext(prev => ({ ...prev, loaded: true, error: err.message }));
      }
    }

    loadNeXifyContext();
  }, []);

  return context;
}
