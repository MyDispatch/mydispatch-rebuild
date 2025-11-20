# 📚 Content-Management-System (CMS) - MyDispatch V18.3.28

**Status:** Konzept & Architektur  
**Letzte Aktualisierung:** 2025-10-21  
**Verantwortlich:** Senior Systemarchitekt

---

## 🎯 ZIELSETZUNG

Professionelles Content-Management-System für MyDispatch nach Corporate Standard:

1. **Zentrale Content-Verwaltung:** Alle Texte, Bilder, Übersetzungen zentral verwaltet
2. **Mehrsprachigkeit:** Deutsch (primär), Englisch (sekundär), weitere Sprachen erweiterbar
3. **Versionierung:** Content-History, Rollback-Funktionalität
4. **Rechte-Management:** Rollenbasierte Berechtigungen (Admin, Editor, Viewer)
5. **SEO-Optimierung:** Meta-Tags, Structured Data, Open Graph
6. **Type-Safety:** Vollständige TypeScript-Unterstützung

---

## 🏗️ ARCHITEKTUR

### System-Komponenten

```
MyDispatch CMS
├── Content Store (Supabase)
│   ├── content_pages
│   ├── content_sections
│   ├── content_translations
│   └── content_assets
│
├── Content API (Edge Functions)
│   ├── get-content
│   ├── update-content
│   └── publish-content
│
├── Content Hooks (React Query)
│   ├── useContent()
│   ├── useTranslation()
│   └── useContentEditor()
│
└── Admin UI (React)
    ├── ContentEditor
    ├── MediaLibrary
    └── PublishingWorkflow
```

---

## 📊 DATENBANK-SCHEMA

### Table: `content_pages`

```sql
CREATE TABLE public.content_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id),
  
  -- Meta
  slug TEXT UNIQUE NOT NULL,          -- URL-Slug (z.B. "landing-hero")
  page_type TEXT NOT NULL,            -- "landing", "portal", "help", etc.
  status TEXT NOT NULL DEFAULT 'draft', -- "draft", "published", "archived"
  
  -- Content
  title TEXT NOT NULL,
  description TEXT,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  og_image TEXT,                      -- Open Graph Image URL
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  
  -- Audit
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- RLS Policies
ALTER TABLE public.content_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company can view own content"
  ON public.content_pages FOR SELECT
  USING (company_id = (SELECT company_id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage content"
  ON public.content_pages FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));
```

### Table: `content_sections`

```sql
CREATE TABLE public.content_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES public.content_pages(id) ON DELETE CASCADE,
  
  -- Structure
  section_key TEXT NOT NULL,          -- "hero", "features", "pricing", etc.
  section_order INTEGER NOT NULL DEFAULT 0,
  
  -- Content (JSON für Flexibilität)
  content JSONB NOT NULL DEFAULT '{}',
  /* Beispiel:
    {
      "headline": "Willkommen bei MyDispatch",
      "subheadline": "Die moderne Lösung für Ihre Disposition",
      "cta_text": "Jetzt starten",
      "cta_link": "/register",
      "image_url": "https://...",
      "features": [
        { "title": "...", "description": "...", "icon": "..." }
      ]
    }
  */
  
  -- Visibility
  is_visible BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(page_id, section_key)
);

ALTER TABLE public.content_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sections follow page permissions"
  ON public.content_sections FOR SELECT
  USING (
    page_id IN (
      SELECT id FROM public.content_pages 
      WHERE company_id = (SELECT company_id FROM public.profiles WHERE user_id = auth.uid())
    )
  );
```

### Table: `content_translations`

```sql
CREATE TABLE public.content_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID REFERENCES public.content_sections(id) ON DELETE CASCADE,
  
  -- Language
  language_code TEXT NOT NULL,        -- "de", "en", "fr", etc.
  
  -- Translated Content
  content JSONB NOT NULL DEFAULT '{}',
  
  -- Quality
  translation_status TEXT DEFAULT 'pending', -- "pending", "reviewed", "approved"
  translated_by UUID REFERENCES auth.users(id),
  reviewed_by UUID REFERENCES auth.users(id),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(section_id, language_code)
);

ALTER TABLE public.content_translations ENABLE ROW LEVEL SECURITY;
```

### Table: `content_assets`

```sql
CREATE TABLE public.content_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id),
  
  -- Asset-Info
  asset_type TEXT NOT NULL,           -- "image", "video", "document"
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,             -- Storage URL
  file_size INTEGER,                  -- Bytes
  mime_type TEXT,
  
  -- Metadata
  title TEXT,
  alt_text TEXT,                      -- Für A11y
  description TEXT,
  tags TEXT[],
  
  -- Dimensions (für Bilder)
  width INTEGER,
  height INTEGER,
  
  -- Usage Tracking
  used_in_pages UUID[],               -- Array von page_ids
  usage_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  uploaded_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.content_assets ENABLE ROW LEVEL SECURITY;
```

---

## 🔌 API-LAYER (React Hooks)

### useContent Hook

```tsx
// src/hooks/use-content.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ContentSection {
  id: string;
  section_key: string;
  content: Record<string, any>;
  is_visible: boolean;
}

/**
 * Fetch page content by slug
 * 
 * @example
 * const { data, isLoading } = useContent('landing-hero');
 */
export const useContent = (pageSlug: string, languageCode = 'de') => {
  return useQuery({
    queryKey: ['content', pageSlug, languageCode],
    queryFn: async () => {
      // 1. Fetch page
      const { data: page, error: pageError } = await supabase
        .from('content_pages')
        .select('id, title, description, status')
        .eq('slug', pageSlug)
        .eq('status', 'published')
        .single();
      
      if (pageError) throw pageError;
      
      // 2. Fetch sections
      const { data: sections, error: sectionsError } = await supabase
        .from('content_sections')
        .select('id, section_key, content, is_visible')
        .eq('page_id', page.id)
        .eq('is_visible', true)
        .order('section_order', { ascending: true });
      
      if (sectionsError) throw sectionsError;
      
      // 3. Fetch translations (if not default language)
      if (languageCode !== 'de') {
        const sectionIds = sections.map(s => s.id);
        const { data: translations } = await supabase
          .from('content_translations')
          .select('section_id, content')
          .in('section_id', sectionIds)
          .eq('language_code', languageCode)
          .eq('translation_status', 'approved');
        
        // Merge translations
        const translationMap = new Map(
          translations?.map(t => [t.section_id, t.content]) || []
        );
        
        sections.forEach(section => {
          const translation = translationMap.get(section.id);
          if (translation) {
            section.content = { ...section.content, ...translation };
          }
        });
      }
      
      return {
        page,
        sections: sections as ContentSection[]
      };
    },
    staleTime: 5 * 60 * 1000, // 5 Minuten Cache
  });
};
```

### useContentEditor Hook

```tsx
// src/hooks/use-content-editor.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Edit content (Admin-only)
 */
export const useContentEditor = () => {
  const queryClient = useQueryClient();
  
  const updateSection = useMutation({
    mutationFn: async ({ 
      sectionId, 
      content 
    }: { 
      sectionId: string; 
      content: Record<string, any> 
    }) => {
      const { data, error } = await supabase
        .from('content_sections')
        .update({ 
          content, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', sectionId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      toast.success('Content erfolgreich aktualisiert');
    },
    onError: (error) => {
      toast.error('Fehler beim Speichern: ' + error.message);
    }
  });
  
  return { updateSection };
};
```

---

## 🎨 ADMIN-UI KOMPONENTEN

### ContentEditor Component

```tsx
// src/components/cms/ContentEditor.tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Icon } from '@/components/design-system';
import { useContentEditor } from '@/hooks/use-content-editor';

interface ContentEditorProps {
  section: {
    id: string;
    section_key: string;
    content: Record<string, any>;
  };
}

export const ContentEditor = ({ section }: ContentEditorProps) => {
  const [content, setContent] = useState(section.content);
  const [isEditing, setIsEditing] = useState(false);
  const { updateSection } = useContentEditor();
  
  const handleSave = async () => {
    await updateSection.mutateAsync({
      sectionId: section.id,
      content
    });
    setIsEditing(false);
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{section.section_key}</CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Icon name={isEditing ? "X" : "Edit"} className="mr-2" />
          {isEditing ? 'Abbrechen' : 'Bearbeiten'}
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {Object.entries(content).map(([key, value]) => (
          <div key={key}>
            <label className="text-sm font-medium text-foreground">
              {key}
            </label>
            {typeof value === 'string' && value.length > 100 ? (
              <Textarea
                value={value as string}
                onChange={(e) => setContent({ ...content, [key]: e.target.value })}
                disabled={!isEditing}
                rows={4}
              />
            ) : (
              <Input
                value={String(value)}
                onChange={(e) => setContent({ ...content, [key]: e.target.value })}
                disabled={!isEditing}
              />
            )}
          </div>
        ))}
        
        {isEditing && (
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} disabled={updateSection.isPending}>
              <Icon name="Save" className="mr-2" />
              Speichern
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setContent(section.content);
                setIsEditing(false);
              }}
            >
              Zurücksetzen
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
```

---

## 🚀 IMPLEMENTIERUNGS-ROADMAP

### Phase 1: Foundation (Woche 1-2)
- [x] Datenbank-Schema entwerfen
- [ ] Migration erstellen (`supabase--migration` tool)
- [ ] RLS-Policies implementieren
- [ ] Basis-API (useContent Hook)

### Phase 2: Admin-UI (Woche 3-4)
- [ ] ContentEditor-Komponente
- [ ] MediaLibrary-Komponente
- [ ] Publishing-Workflow
- [ ] Permissions-System

### Phase 3: Mehrsprachigkeit (Woche 5)
- [ ] Translation-Management
- [ ] Language-Switcher
- [ ] Fallback-Logik (DE → EN)

### Phase 4: SEO & Performance (Woche 6)
- [ ] Meta-Tags-Generator
- [ ] Structured Data (JSON-LD)
- [ ] Content-Caching (Redis)
- [ ] Image-Optimization

### Phase 5: Advanced Features (Woche 7-8)
- [ ] Content-Versionierung
- [ ] Rollback-Funktionalität
- [ ] A/B-Testing-Support
- [ ] Analytics-Integration

---

## 📋 VERWENDUNGS-BEISPIELE

### Landing Page mit CMS

```tsx
// src/pages/Landing.tsx
import { useContent } from '@/hooks/use-content';
import { HeroSection } from '@/components/design-system';

export const Landing = () => {
  const { data, isLoading } = useContent('landing-page');
  
  if (isLoading) return <LoadingSpinner />;
  
  const heroSection = data?.sections.find(s => s.section_key === 'hero');
  
  return (
    <div>
      <HeroSection
        title={heroSection?.content.headline}
        subtitle={heroSection?.content.subheadline}
        ctaText={heroSection?.content.cta_text}
        ctaLink={heroSection?.content.cta_link}
        backgroundImage={heroSection?.content.image_url}
      />
      
      {/* Weitere Sections... */}
    </div>
  );
};
```

### Admin Content-Management

```tsx
// src/pages/admin/ContentManagement.tsx
import { useContent } from '@/hooks/use-content';
import { ContentEditor } from '@/components/cms/ContentEditor';

export const ContentManagement = () => {
  const { data } = useContent('landing-page');
  
  return (
    <div className="space-y-6">
      <h1>Content-Verwaltung</h1>
      
      {data?.sections.map(section => (
        <ContentEditor key={section.id} section={section} />
      ))}
    </div>
  );
};
```

---

## ✅ QUALITÄTSSICHERUNG

### Pre-Launch-Checkliste
- [ ] Alle RLS-Policies getestet
- [ ] Multi-Tenant-Isolation verifiziert
- [ ] SEO-Meta-Tags validiert
- [ ] Performance-Tests (<100ms)
- [ ] Accessibility-Audit (WCAG 2.1)
- [ ] Content-Backup-System

### Monitoring
- [ ] Content-Änderungs-Log
- [ ] Asset-Usage-Tracking
- [ ] Page-Load-Performance
- [ ] Translation-Coverage

---

## 📚 NÄCHSTE SCHRITTE

1. **Approval:** Konzept-Review durch Auftraggeber
2. **Implementation:** Phase 1 (Foundation) starten
3. **Testing:** Security & Performance Tests
4. **Rollout:** Schrittweise Einführung (Dashboard → Landing → Portale)

**Verantwortlich:** Senior Systemarchitekt  
**Zeitrahmen:** 8 Wochen  
**Ressourcen:** 1 Full-Stack Developer, 1 QA Engineer
