import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { resilientQuery } from '@/lib/supabase-resilient-client';
import { createLogger } from '@/lib/logger';

const logger = createLogger('KnowledgeBase');

interface KnowledgeQueryResult {
  id: string;
  category: string;
  title: string;
  content: any;
  tags: string[];
  confidence_score: number;
  doc_version: string;
  source_file: string;
  relevance_score: number;
  relevance_reason: string;
}

interface KnowledgeQueryResponse {
  query: string;
  results: KnowledgeQueryResult[];
  total: number;
  category_filter?: string;
}

interface DocParserResponse {
  success: boolean;
  file_path: string;
  doc_version: string;
  extracted_count: number;
  inserted_count: number;
  updated_count: number;
  skipped_count: number;
  entries: any[];
  skipped_duplicates: string[];
}

export function useKnowledgeBase() {
  const [isQuerying, setIsQuerying] = useState(false);
  const [isParsing, setIsParsing] = useState(false);

  /**
   * Query Knowledge-Base with AI semantic search
   */
  const queryKnowledge = async (
    query: string,
    categoryFilter?: string,
    limit: number = 10
  ): Promise<KnowledgeQueryResponse | null> => {
    setIsQuerying(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-knowledge-query', {
        body: {
          query,
          category_filter: categoryFilter,
          limit,
        },
      });

      if (error) {
        if (import.meta.env.DEV) console.error('Knowledge query error:', error);
        toast.error('Fehler bei Knowledge-Base Abfrage');
        return null;
      }

      if (import.meta.env.DEV) console.log(`✅ Knowledge query: ${data.total} results for "${query}"`);
      return data;
    } catch (err) {
      if (import.meta.env.DEV) console.error('Unexpected error in queryKnowledge:', err);
      toast.error('Unerwarteter Fehler bei Knowledge-Base Abfrage');
      return null;
    } finally {
      setIsQuerying(false);
    }
  };

  /**
   * Parse markdown file and extract knowledge entries
   */
  const parseDocument = async (
    markdownContent: string,
    filePath: string,
    docVersion: string = 'V19.0.0'
  ): Promise<DocParserResponse | null> => {
    setIsParsing(true);
    try {
      logger.debug(`Parsing document: ${filePath}`);

      const { data, error } = await resilientQuery(
        () => supabase.functions.invoke('ai-doc-parser', {
          body: {
            markdown_content: markdownContent,
            file_path: filePath,
            doc_version: docVersion,
          },
        }),
        { maxRetries: 3, baseDelay: 2000 }
      );

      if (error) {
        if (import.meta.env.DEV) console.warn('[useKnowledgeBase] Parse failed after retries:', error);
        toast.error('Dokument-Parsing fehlgeschlagen', {
          description: 'Bitte versuche es später erneut',
        });
        return null;
      }

      if (data.success) {
        toast.success(
          `✅ ${filePath}: ${data.inserted_count} neu, ${data.updated_count} aktualisiert, ${data.skipped_count} übersprungen`
        );
      }

      if (import.meta.env.DEV) console.log(`✅ Doc parsed: ${filePath} - ${data.extracted_count} entries extracted`);
      return data;
    } catch (err) {
      if (import.meta.env.DEV) console.error('[useKnowledgeBase] Parse exception:', err);
      toast.error('Dokument-Parsing fehlgeschlagen');
      return null;
    } finally {
      setIsParsing(false);
    }
  };

  /**
   * Fetch all knowledge entries by category
   */
  const getKnowledgeByCategory = async (category: string) => {
    try {
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .eq('category', category)
        .eq('is_deprecated', false)
        .order('confidence_score', { ascending: false });

      if (error) throw error;
      return data;
    } catch (err) {
      logger.error('Error fetching knowledge by category:', err);
      toast.error('Fehler beim Laden der Knowledge-Base Einträge');
      return [];
    }
  };

  /**
   * Check for outdated knowledge entries
   */
  const checkKnowledgeFreshness = async () => {
    try {
      const { data, error } = await supabase.rpc('check_knowledge_freshness');

      if (error) throw error;
      return data;
    } catch (err) {
      logger.error('Error checking knowledge freshness:', err);
      return [];
    }
  };

  return {
    queryKnowledge,
    parseDocument,
    getKnowledgeByCategory,
    checkKnowledgeFreshness,
    isQuerying,
    isParsing,
  };
}
