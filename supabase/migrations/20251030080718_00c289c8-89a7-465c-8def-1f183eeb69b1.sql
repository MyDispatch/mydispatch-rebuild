-- Fix Security Warnings: Set search_path for knowledge base functions

CREATE OR REPLACE FUNCTION update_knowledge_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

CREATE OR REPLACE FUNCTION increment_snippet_usage(snippet_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.code_snippets SET usage_count = usage_count + 1, last_used = now() WHERE id = snippet_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

CREATE OR REPLACE FUNCTION increment_knowledge_access(knowledge_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.knowledge_base SET access_count = access_count + 1, last_accessed = now() WHERE id = knowledge_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

CREATE OR REPLACE FUNCTION increment_issue_occurrence(issue_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.known_issues SET occurrences = occurrences + 1, last_occurrence = now() WHERE id = issue_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';