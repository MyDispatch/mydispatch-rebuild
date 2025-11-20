/* ==================================================================================
   HELP SYSTEM V18.3.24 - CONTEXT-AWARE HILFE-SYSTEM
   ==================================================================================
   ✅ Context-sensitive Hilfe für jeden Bereich
   ✅ Suchfunktion über alle Hilfeartikel
   ✅ Quick-Actions & Shortcuts
   ✅ FAQ-Integration
   ✅ Video-freie, detaillierte Text-Erklärungen
   ================================================================================== */

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { V28Button } from "@/components/design-system/V28Button";
import { Input } from "@/lib/compat";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Search, BookOpen, Zap, ExternalLink, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sanitizeHelpContent } from "@/lib/sanitize";

export interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  relatedArticles?: string[];
  quickActions?: Array<{
    label: string;
    action: () => void;
  }>;
}

export interface HelpContext {
  page: string;
  articles: HelpArticle[];
  shortcuts?: Array<{
    key: string;
    description: string;
  }>;
}

interface HelpSystemProps {
  context: HelpContext;
  trigger?: React.ReactNode;
}

export function HelpSystem({ context, trigger }: HelpSystemProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);

  const filteredArticles = context.articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const groupedArticles = filteredArticles.reduce(
    (acc, article) => {
      if (!acc[article.category]) {
        acc[article.category] = [];
      }
      acc[article.category].push(article);
      return acc;
    },
    {} as Record<string, HelpArticle[]>
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger || (
          <V28Button variant="ghost" size="sm">
            <HelpCircle className="h-4 w-4 mr-2 text-foreground" />
            Hilfe
          </V28Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-foreground" />
            Hilfe & Dokumentation
          </SheetTitle>
          <SheetDescription>
            {context.page} - Hier finden Sie alle Informationen zur Nutzung
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Suche in der Hilfe..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs defaultValue="articles" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="articles">Artikel</TabsTrigger>
              <TabsTrigger value="shortcuts">Shortcuts</TabsTrigger>
              <TabsTrigger value="quick">Quick-Start</TabsTrigger>
            </TabsList>

            {/* Articles Tab */}
            <TabsContent value="articles" className="space-y-4">
              {selectedArticle ? (
                // Article Detail View
                <div className="space-y-4">
                  <V28Button variant="ghost" size="sm" onClick={() => setSelectedArticle(null)}>
                    <ArrowRight className="h-4 w-4 mr-2 rotate-180 text-foreground" />
                    Zurück
                  </V28Button>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {selectedArticle.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedArticle.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="prose prose-sm max-w-none">
                      <div
                        className="text-sm text-foreground leading-relaxed whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHelpContent(selectedArticle.content),
                        }}
                      />
                    </div>

                    {/* Quick Actions */}
                    {selectedArticle.quickActions && selectedArticle.quickActions.length > 0 && (
                      <div className="border-t pt-4">
                        <p className="text-sm font-semibold mb-3 text-foreground">
                          <Zap className="inline h-4 w-4 mr-1 text-foreground" />
                          Quick-Actions
                        </p>
                        <div className="space-y-2">
                          {selectedArticle.quickActions.map((action, i) => (
                            <V28Button
                              key={i}
                              variant="secondary"
                              size="sm"
                              onClick={action.action}
                              className="w-full justify-start"
                            >
                              {action.label}
                              <ExternalLink className="h-4 w-4 ml-auto text-foreground" />
                            </V28Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Related Articles */}
                    {selectedArticle.relatedArticles &&
                      selectedArticle.relatedArticles.length > 0 && (
                        <div className="border-t pt-4">
                          <p className="text-sm font-semibold mb-3 text-foreground">
                            Verwandte Artikel
                          </p>
                          <div className="space-y-2">
                            {selectedArticle.relatedArticles.map((relatedId) => {
                              const related = context.articles.find((a) => a.id === relatedId);
                              if (!related) return null;
                              return (
                                <V28Button
                                  key={relatedId}
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedArticle(related)}
                                  className="w-full justify-start text-left"
                                >
                                  {related.title}
                                </V28Button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              ) : (
                // Articles List View
                <div className="space-y-4">
                  {Object.entries(groupedArticles).map(([category, articles]) => (
                    <div key={category}>
                      <h4 className="text-sm font-semibold mb-3 text-foreground">{category}</h4>
                      <div className="space-y-2">
                        {articles.map((article) => (
                          <button
                            key={article.id}
                            onClick={() => setSelectedArticle(article)}
                            className={cn(
                              "w-full text-left p-3 rounded-lg border hover:bg-primary/50 transition-colors",
                              "focus:outline-none focus:ring-2 focus:ring-primary"
                            )}
                          >
                            <p className="font-medium text-sm text-foreground">{article.title}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {article.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  {filteredArticles.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Keine Artikel gefunden für "{searchTerm}"</p>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            {/* Shortcuts Tab */}
            <TabsContent value="shortcuts" className="space-y-4">
              {context.shortcuts && context.shortcuts.length > 0 ? (
                <div className="space-y-2">
                  {context.shortcuts.map((shortcut, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <span className="text-sm text-foreground">{shortcut.description}</span>
                      <Badge variant="secondary" className="font-mono">
                        {shortcut.key}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Keine Shortcuts verfügbar für diesen Bereich</p>
                </div>
              )}
            </TabsContent>

            {/* Quick Start Tab */}
            <TabsContent value="quick" className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                {context.articles
                  .filter((a) => a.tags.includes("quick-start"))
                  .map((article) => (
                    <AccordionItem key={article.id} value={article.id}>
                      <AccordionTrigger className="text-sm">{article.title}</AccordionTrigger>
                      <AccordionContent>
                        <div
                          className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{ __html: sanitizeHelpContent(article.content) }}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>

              {context.articles.filter((a) => a.tags.includes("quick-start")).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Keine Quick-Start-Guides verfügbar</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ==================================================================================
   FLOATING HELP BUTTON - Immer sichtbarer Hilfe-Button
   ================================================================================== */

interface FloatingHelpButtonProps {
  context: HelpContext;
}

export function FloatingHelpButton({ context }: FloatingHelpButtonProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <HelpSystem
        context={context}
        trigger={
          <V28Button size="lg" variant="primary" className="rounded-full shadow-lg">
            <HelpCircle className="h-5 w-5 mr-2" />
            Hilfe
          </V28Button>
        }
      />
    </div>
  );
}
