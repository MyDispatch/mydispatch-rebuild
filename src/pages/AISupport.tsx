/* ==================================================================================
   KRITISCHER HINWEIS: Kommunikation - DESIGN/LAYOUT FINAL!
   ==================================================================================
   - AI-Support Chat (Vollständig)
   - Fahrtenplanung & Analyse
   - Service & Support
   - Multi-Tenant mit company_id
   ================================================================================== */

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { SEOHead } from '@/components/shared/SEOHead';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { V28Button } from '@/components/design-system/V28Button';
import { Input } from '@/components/ui/input';
import { Bot, User, Send, Sparkles, Calendar, TrendingUp, MapPin, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { handleError } from '@/lib/error-handler';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AISupport = () => {
  const { profile, company } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getPageContext = () => {
    const path = location.pathname;
    const contexts: Record<string, string> = {
      '/': 'Dashboard - Übersicht über Aufträge, Fahrer und Fahrzeuge',
      '/auftraege': 'Auftragsverwaltung - Buchungen anlegen und verwalten',
      '/fahrer': 'Fahrerverwaltung - Fahrer anlegen und organisieren',
      '/fahrzeuge': 'Fahrzeugverwaltung - Fahrzeugflotte verwalten',
      '/kunden': 'Kundenverwaltung - Kunden anlegen und pflegen',
      '/partner': 'Partner-Netzwerk - Kooperationen verwalten',
      '/schichtzettel': 'Schichtzettel - Schichten dokumentieren',
      '/rechnungen': 'Rechnungsverwaltung - Rechnungen erstellen',
      '/statistiken': 'Statistiken - Auswertungen und Analysen',
      '/unternehmen': 'Unternehmenseinstellungen',
      '/kommunikation': 'AI-Support & Fahrtenplanung',
    };
    return contexts[path] || 'MyDispatch Dashboard';
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-support-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: messages.concat(userMessage).map(m => ({
              role: m.role,
              content: m.content,
            })),
            context: `Aktuelle Seite: ${getPageContext()}\nUnternehmen: ${company?.name || 'Nicht verfügbar'}\nUser: ${profile?.first_name} ${profile?.last_name}`,
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate Limit erreicht. Bitte versuchen Sie es in wenigen Sekunden erneut.');
        }
        if (response.status === 402) {
          throw new Error('AI-Guthaben aufgebraucht. Bitte kontaktieren Sie den Support.');
        }
        throw new Error('AI-Service vorübergehend nicht verfügbar');
      }

      if (!response.body) {
        throw new Error('Fehler beim Abrufen der Antwort');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      let textBuffer = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].content = assistantContent;
                return newMessages;
              });
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      handleError(error, 'AI-Chat Fehler');
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: error instanceof Error ? error.message : 'Entschuldigung, es gab einen Fehler. Bitte versuchen Sie es erneut.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Quick-Action-Prompts
  const quickPrompts = [
    {
      icon: Calendar,
      label: 'Fahrt planen',
      prompt: 'Ich möchte eine Fahrt von München Hauptbahnhof zum Flughafen planen. Was muss ich beachten?'
    },
    {
      icon: TrendingUp,
      label: 'Umsatz analysieren',
      prompt: 'Analysiere meine heutigen Aufträge und gib mir Empfehlungen zur Optimierung.'
    },
    {
      icon: MapPin,
      label: 'Route optimieren',
      prompt: 'Wie kann ich meine Routen effizienter planen? Gibt es Tools in MyDispatch dafür?'
    },
    {
      icon: Info,
      label: 'Feature-Hilfe',
      prompt: 'Erkläre mir die wichtigsten Funktionen von MyDispatch und wie ich sie nutze.'
    },
  ];

  return (
    <>
      <SEOHead 
        title="AI-Support & Fahrtenplanung"
        description="MyDispatch AI-Assistent: Intelligente Unterstützung für Disposition, Fahrtenplanung und Systemhilfe."
        canonical="/kommunikation"
      />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Bot className="h-8 w-8 text-foreground" />
              MyDispatch AI-Assistent
            </h1>
            <p className="text-muted-foreground mt-1">
              Intelligente Unterstützung für Disposition, Fahrtenplanung und Systemhilfe
            </p>
          </div>
          <Badge variant="outline" className="hidden sm:flex gap-2">
            <Sparkles className="h-4 w-4 text-foreground" />
            Powered by Gemini 2.5 Flash
          </Badge>
        </div>

        {/* Chat Interface */}
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="bg-primary/5 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bot className="h-5 w-5 text-foreground" />
              Chat-Assistent
            </CardTitle>
            <CardDescription>
              Stellen Sie Fragen zur Disposition, Fahrtenplanung oder Systemfunktionen
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center mt-16">
                <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
                  <Bot className="h-12 w-12 text-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Willkommen beim MyDispatch AI-Assistenten!</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                  Ich helfe Ihnen bei der Disposition, Fahrtenplanung und beantworte Fragen zur Software.
                  Ich kann auch Daten analysieren und Optimierungsempfehlungen geben.
                </p>

                {/* Quick-Prompts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto mt-8">
                  {quickPrompts.map((prompt) => {
                    const IconComponent = prompt.icon;
                    return (
                      <V28Button
                        key={prompt.label}
                        variant="secondary"
                        className="h-auto py-4 px-4 justify-start text-left"
                        onClick={() => {
                          setInput(prompt.prompt);
                        }}
                      >
                        <IconComponent className="mr-2 h-5 w-5 text-foreground shrink-0" />
                        <div>
                          <div className="font-semibold text-sm">{prompt.label}</div>
                          <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                            {prompt.prompt}
                          </div>
                        </div>
                      </V28Button>
                    );
                  })}
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex gap-3 items-start',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                 {message.role === 'assistant' && (
                  <div className="bg-primary rounded-full p-2 flex-shrink-0 mt-1">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={cn(
                    'rounded-lg p-4 max-w-[85%] text-sm leading-relaxed',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground border border-border'
                  )}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
                {message.role === 'user' && (
                  <div className="bg-foreground rounded-full p-2 flex-shrink-0 mt-1">
                    <User className="h-4 w-4 text-background" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 items-start justify-start">
                <div className="bg-primary rounded-full p-2">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="bg-muted rounded-lg p-4 border border-border">
                  <div className="flex gap-1.5">
                    <span className="animate-bounce text-primary v26-delay-0">●</span>
                    <span className="animate-bounce text-primary v26-delay-150">●</span>
                    <span className="animate-bounce text-primary v26-delay-300">●</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input Area */}
          <div className="p-4 border-t bg-background">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Frage stellen oder Aufgabe beschreiben..."
                disabled={isLoading}
                className="flex-1"
              />
              <V28Button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="shrink-0"
                variant="primary"
              >
                <Send className="h-4 w-4" />
              </V28Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              AI-Assistent kann Fehler machen. Überprüfen Sie wichtige Informationen.
            </p>
          </div>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="h-5 w-5 text-foreground" />
                <h3 className="font-semibold">Fahrtenplanung</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Routenplanung, Fahrerwartung, Fahrzeugauswahl und Tourenoptimierung.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-5 w-5 text-foreground" />
                <h3 className="font-semibold">Datenanalyse</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Umsatzauswertung, Performance-Tracking und Business Intelligence.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <Info className="h-5 w-5 text-foreground" />
                <h3 className="font-semibold">Systemhilfe</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Fragen zu Features, rechtlichen Themen (PBefG, DSGVO) und Bedienung.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AISupport;
