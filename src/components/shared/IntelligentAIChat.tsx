/* ==================================================================================
   INTELLIGENT AI-CHAT-SYSTEM - V18.2.30 DUAL-MODE
   ==================================================================================
   ZWEI MODI:
   1. APP MODE: MyDispatch AI-Assistent (B2B, Software-Support, eingeloggte Nutzer)
   2. LANDING MODE: Service-Assistent (B2C, Buchungs-Support, Endkunden)
   
   KRITISCH: Komplette UI-Trennung zwischen Modi!
   ================================================================================== */

import React, { useState, useEffect, useRef } from 'react';
import { V28Button } from '@/components/design-system/V28Button';
import { Card } from '@/components/ui/card';
import { Input } from '@/lib/compat';
import { Minimize2, Maximize2, X, Send, Phone, Calendar, Car } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAccountType } from '@/hooks/use-account-type';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { handleError } from '@/lib/error-handler';
import { useDeviceType } from '@/hooks/use-device-type';
import { sanitizeMarkdown } from '@/lib/sanitize';
import { logger } from '@/lib/logger';
import './ai-chat.css';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

type ChatMode = 'minimized' | 'normal' | 'fullscreen';

interface IntelligentAIChatProps {
  isPublicLanding?: boolean;
  companyData?: {
    id: string;
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    business_hours?: any;
  };
}

export function IntelligentAIChat({ isPublicLanding = false, companyData }: IntelligentAIChatProps = {}) {
  const [chatMode, setChatMode] = useState<ChatMode>(isPublicLanding ? 'minimized' : 'normal');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contextData, setContextData] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // DEFENSIVE: Router-Context-Check
  let location;
  try {
    location = useLocation();
  } catch (error) {
    logger.warn('[IntelligentAIChat] Router context not available', { component: 'IntelligentAIChat' });
    location = { pathname: '/' }; // Fallback
  }
  
  const { permissions } = useAccountType();
  const { profile, company, user } = useAuth();
  const { toast } = useToast();
  const { isMobile } = useDeviceType();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (location?.pathname) {
      loadContextData();
    }
  }, [location?.pathname, company?.id, isPublicLanding]);

  const loadContextData = async () => {
    // PUBLIC LANDING MODE: Nur Company-Daten, keine Auth-Daten
    if (isPublicLanding && companyData) {
      setContextData({
        page: { title: 'Landingpage', description: 'Öffentliche Unternehmens-Landingpage' },
        company: {
          name: companyData.name,
          phone: companyData.phone,
          email: companyData.email,
          address: companyData.address,
          business_hours: companyData.business_hours,
        },
      });
      return;
    }

    // APP MODE: Vollständige Kontext-Daten mit Auth
    if (!company?.id) return;

    try {
      const context: any = {
        page: getPageContext(),
        user: {
          name: `${profile?.first_name} ${profile?.last_name}`,
          email: user?.email,
          role: permissions.canAccessMasterDashboard ? 'Master-Administrator' : 'Unternehmensadministrator',
        },
        company: {
          name: company.name,
          tariff: getSubscriptionTariff(),
          status: company.subscription_status,
        },
      };

      // Seiten-spezifische Daten laden
      const path = location.pathname;
      if (path === '/auftraege') {
        const { data: bookings } = await supabase
          .from('bookings')
          .select('status, payment_status')
          .eq('company_id', company.id)
          .eq('archived', false)
          .gte('pickup_time', new Date().toISOString().split('T')[0]);
        
        context.bookings = {
          today: bookings?.length || 0,
          pending: bookings?.filter(b => b.status === 'pending').length || 0,
          confirmed: bookings?.filter(b => b.status === 'confirmed').length || 0,
        };
      } else if (path === '/fahrer') {
        const { data: drivers } = await supabase
          .from('drivers')
          .select('shift_status')
          .eq('company_id', company.id)
          .eq('archived', false);
        
        context.drivers = {
          total: drivers?.length || 0,
          available: drivers?.filter(d => d.shift_status === 'available').length || 0,
          busy: drivers?.filter(d => d.shift_status === 'busy').length || 0,
        };
      } else if (path === '/fahrzeuge') {
        const { data: vehicles } = await supabase
          .from('vehicles')
          .select('status')
          .eq('company_id', company.id)
          .eq('archived', false);
        
        context.vehicles = {
          total: vehicles?.length || 0,
          available: vehicles?.filter(v => v.status === 'available').length || 0,
          im_einsatz: vehicles?.filter(v => v.status === 'im_einsatz').length || 0,
          wartung: vehicles?.filter(v => v.status === 'wartung').length || 0,
        };
      }

      setContextData(context);
    } catch (error) {
      handleError(error, 'Fehler beim Laden der Kontext-Daten', { showToast: false });
    }
  };

  const getPageContext = () => {
    const path = location.pathname;
    const contexts: Record<string, { title: string; description: string }> = {
      '/': { title: 'Dashboard', description: 'Übersicht über aktuelle Aufträge, verfügbare Fahrer und Fahrzeugstatus' },
      '/auftraege': { title: 'Auftragsverwaltung', description: 'Verwaltung und Disposition von Buchungen und Fahrten' },
      '/fahrer': { title: 'Fahrerverwaltung', description: 'Verwaltung der Fahrer, Lizenzen und Schichtzuweisungen' },
      '/fahrzeuge': { title: 'Fahrzeugverwaltung', description: 'Verwaltung der Fahrzeugflotte, Konzessionen und Wartungen' },
      '/kunden': { title: 'Kundenverwaltung', description: 'Verwaltung von Privat- und Geschäftskunden' },
      '/partner': { title: 'Partner-Netzwerk', description: 'Kooperationen mit anderen Taxi- und Mietwagenunternehmen' },
      '/schichtzettel': { title: 'Schichtzettel', description: 'Dokumentation von Schichten und Einnahmen (P-Schein-konform)' },
      '/rechnungen': { title: 'Rechnungsverwaltung', description: 'Erstellung und Verwaltung von Rechnungen' },
      '/statistiken': { title: 'Statistiken & Reporting', description: 'Auswertungen und Analysen zur Unternehmensperformance' },
      '/master': { title: 'Master-Dashboard', description: 'Verwaltung aller Unternehmen, Terminierung und Analytics' },
    };
    return contexts[path] || { title: 'MyDispatch', description: 'Taxi-Dispositionssoftware' };
  };

  const getSubscriptionTariff = () => {
    const productId = company?.subscription_product_id;
    if (!productId) return 'Starter';
    if (productId.includes('Business')) return 'Business';
    if (productId.includes('Enterprise')) return 'Enterprise';
    return 'Starter';
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Guten Morgen';
    if (hour < 18) return 'Guten Tag';
    return 'Guten Abend';
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const enrichedContext = {
        ...contextData,
        currentInput: input,
        conversationHistory: messages.slice(-5),
      };

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-support-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY}`,
          },
          body: JSON.stringify({
            messages: messages.concat(userMessage).map(m => ({
              role: m.role,
              content: m.content,
            })),
            context: JSON.stringify(enrichedContext),
            isMasterAccount: isPublicLanding ? false : permissions.canAccessMasterDashboard,
            companyId: isPublicLanding ? companyData?.id : company?.id,
            isPublicLanding,
            userName: isPublicLanding ? 'Gast' : `${profile?.first_name} ${profile?.last_name}`,
          }),
        }
      );

      if (!response.ok || !response.body) {
        throw new Error('Fehler beim Abrufen der Antwort');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      let textBuffer = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '', timestamp: new Date() }]);

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

      if (!isPublicLanding) {
        await loadContextData();
      }
    } catch (error) {
      handleError(error, 'AI-Chat Fehler');
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Entschuldigung, es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support.',
          timestamp: new Date(),
        },
      ]);
      toast({
        title: 'Fehler',
        description: 'Die AI-Anfrage konnte nicht verarbeitet werden.',
        variant: 'destructive',
      });
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

  // Markdown-Rendering für Chat-Nachrichten (DIN 5008 konforme Abstände)
  // KRITISCH: Jetzt mit XSS-Schutz durch DOMPurify (V18.3.27)
  const renderMarkdown = (content: string) => {
    // Delegiere Markdown-Parsing + Sanitization an zentrale Utility
    return sanitizeMarkdown(content);
  };

  // LANDING MODE: Service-orientierte Fragen
  const getLandingSuggestedQuestions = () => [
    'Wie kann ich eine Fahrt buchen?',
    'Welche Fahrzeugtypen bieten Sie an?',
    'Was kostet eine Fahrt zum Flughafen?',
  ];

  // APP MODE: Software-Support Fragen
  const getAppSuggestedQuestions = () => {
    const path = location.pathname;
    const suggestions: Record<string, string[]> = {
      '/auftraege': [
        'Wie kann ich die Fahrtenplanung optimieren?',
        'Welche Zahlungsarten sind für welche Kundentypen vorgeschrieben?',
        'Wie erstelle ich einen Sammelauftrag?',
      ],
      '/fahrer': [
        'Welche Dokumente benötigt ein neuer Fahrer?',
        'Wie weise ich einen Fahrer einem Fahrzeug zu?',
        'Was muss beim P-Schein beachtet werden?',
      ],
      '/fahrzeuge': [
        'Wie verwalte ich Konzessionen?',
        'Welche Fahrzeugklassen gibt es?',
        'Wie plane ich Wartungsintervalle?',
      ],
      '/rechnungen': [
        'Wie erstelle ich eine Kleinunternehmer-Rechnung?',
        'Welche USt-Sätze gelten für Taxifahrten?',
        'Wie funktioniert die Reverse-Charge bei B2B-Aufträgen?',
      ],
    };

    return suggestions[path] || [
      'Wie nutze ich MyDispatch optimal?',
      'Welche Funktionen sind in meinem Tarif enthalten?',
      'Wie kann ich meine Prozesse optimieren?',
    ];
  };

  // MINIMIERT-BUTTON - V26.0 Design mit CSS Classes
  if (chatMode === 'minimized') {
    return (
      <V28Button
        onClick={() => setChatMode('normal')}
        variant="primary"
        className={cn(
          "ai-chat-minimized-btn",
          isMobile ? "ai-chat-minimized-btn--mobile" : "ai-chat-minimized-btn--desktop"
        )}
        aria-label={isPublicLanding ? `${companyData?.name || 'Service'}-Assistent öffnen` : 'MyDispatch AI-Assistent öffnen'}
      >
        <span className={isMobile ? "text-2xl" : "text-sm"}>
          {isMobile ? '💬' : (isPublicLanding ? 'Service-Chat 💬' : 'AI-Assistent')}
        </span>
      </V28Button>
    );
  }

  const isFullscreen = chatMode === 'fullscreen';

  return (
    <Card
      className={cn(
        'ai-chat-card',
        isMobile 
          ? 'ai-chat-card--mobile' 
          : isFullscreen 
            ? 'ai-chat-card--fullscreen' 
            : 'ai-chat-card--normal'
      )}
    >
      {/* HEADER - V26.0 Premium Design */}
      <div 
        className={cn(
          "ai-chat-header",
          isMobile ? "ai-chat-header--mobile" : "ai-chat-header--desktop"
        )}
      >
        <div className="flex-1 min-w-0 pr-2">
          <h3 className={cn("font-semibold truncate", isMobile ? "text-sm" : "text-base")}>
            {isPublicLanding 
              ? `${companyData?.name || 'Service'}-Assistent` 
              : 'MyDispatch AI-Assistent'}
          </h3>
          <p 
            className={cn("ai-chat-header__subtitle truncate", isMobile ? "text-[11px] mt-0.5" : "text-xs mt-1")}
          >
            {isPublicLanding 
              ? `${getGreeting()}! Wie kann ich Ihnen helfen?` 
              : `${getGreeting()}, ${profile?.first_name || 'Nutzer'}`}
          </p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {!isMobile && (
            <V28Button
              variant="ghost"
              size="sm"
              onClick={() => setChatMode(isFullscreen ? 'normal' : 'fullscreen')}
              className="ai-chat-header__btn min-h-[44px] min-w-[44px] h-10 w-10 transition-colors"
              aria-label={isFullscreen ? 'Verkleinern' : 'Vollbild'}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4 sm:h-5 sm:w-5" /> : <Maximize2 className="h-4 w-4 sm:h-5 sm:w-5" />}
            </V28Button>
          )}
          <V28Button
            variant="ghost"
            size="sm"
            onClick={() => setChatMode('minimized')}
            className={cn(
              "ai-chat-header__btn transition-colors min-h-[44px] min-w-[44px]",
              isMobile ? "h-9 w-9" : "h-10 w-10"
            )}
            aria-label="Schließen"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </V28Button>
        </div>
      </div>

      {/* TRANSPARENZ-HINWEIS - nur im App-Modus, responsive */}
      {!isPublicLanding && (
        <div className={cn(
          "bg-muted/30 text-muted-foreground shrink-0 border-b",
          isMobile ? "px-3 py-1.5 text-[10px]" : "px-4 py-2 text-xs"
        )}>
          <span className="font-medium">Hinweis:</span> AI-System MyDispatch AI | Zweck: Support & Analyse |{' '}
          <a href="/datenschutz" target="_blank" className="underline hover:text-foreground transition-colors">
            Datenschutz
          </a>
        </div>
      )}

      {/* MESSAGES - Optimized Scrolling */}
      <div className={cn(
        "flex-1 overflow-y-auto overflow-x-hidden space-y-3 bg-background",
        isMobile ? "p-3" : "p-4 md:p-6"
      )}>
        {messages.length === 0 && (
          <div className={cn("text-center space-y-3", isMobile ? "mt-4" : "mt-8")}>
            <div className={cn(
              "inline-flex items-center justify-center rounded-full bg-primary/10 mx-auto",
              isMobile ? "w-12 h-12" : "w-16 h-16"
            )}>
              {isPublicLanding ? (
                <Car className={cn("text-foreground", isMobile ? "h-6 w-6" : "h-8 w-8")} />
              ) : (
                <span className={cn("font-bold text-foreground", isMobile ? "text-xl" : "text-2xl")}>AI</span>
              )}
            </div>
            <div className="px-4">
              <h4 className={cn("font-semibold mb-2", isMobile ? "text-base" : "text-lg")}>
                {isPublicLanding 
                  ? 'Wie können wir Ihnen helfen?' 
                  : 'Wie kann ich Sie heute unterstützen?'}
              </h4>
              <p className={cn("text-muted-foreground max-w-md mx-auto", isMobile ? "text-xs" : "text-sm")}>
                {isPublicLanding 
                  ? 'Stellen Sie uns Fragen zu unseren Leistungen, Preisen oder buchen Sie direkt eine Fahrt.' 
                  : 'Ich bin Ihr intelligenter Assistent für alle Fragen rund um MyDispatch, Disposition, Rechtsfragen und Optimierungspotenziale.'}
              </p>
            </div>

            {/* KONTEXT-INFO - nur im App-Modus, responsive */}
            {!isPublicLanding && contextData && (
              <div className={cn(
                "bg-muted/50 rounded-lg text-left max-w-md mx-auto",
                isMobile ? "p-3 mt-4" : "p-4 mt-6"
              )}>
                <p className={cn(
                  "font-semibold text-muted-foreground uppercase mb-2",
                  isMobile ? "text-[10px]" : "text-xs"
                )}>
                  Aktueller Kontext
                </p>
                <div className={cn("space-y-1", isMobile ? "text-xs" : "text-sm")}>
                  <p><span className="font-medium">Seite:</span> {contextData.page?.title}</p>
                  <p><span className="font-medium">Unternehmen:</span> {contextData.company?.name}</p>
                  <p><span className="font-medium">Tarif:</span> {contextData.company?.tariff}</p>
                </div>
              </div>
            )}

            {/* VORGESCHLAGENE FRAGEN - Responsive */}
            <div className={cn("max-w-md mx-auto space-y-2", isMobile ? "mt-4" : "mt-6")}>
              <p className={cn(
                "font-semibold text-muted-foreground uppercase mb-3",
                isMobile ? "text-[10px]" : "text-xs"
              )}>
                {isPublicLanding ? 'Häufige Fragen' : 'Vorgeschlagene Fragen'}
              </p>
              {(isPublicLanding ? getLandingSuggestedQuestions() : getAppSuggestedQuestions()).map((question, idx) => (
                <V28Button
                  key={idx}
                  variant="secondary"
                  onClick={() => {
                    setInput(question);
                    setTimeout(() => sendMessage(), 100);
                  }}
                  className={cn(
                    "w-full text-left justify-start h-auto whitespace-normal min-h-[44px]",
                    isMobile ? "py-2.5 px-3 text-xs" : "py-3 px-4 text-sm"
                  )}
                >
                  {question}
                </V28Button>
              ))}
            </div>

            {/* KONTAKT-INFO - nur im Landing-Modus, responsive */}
            {isPublicLanding && companyData?.phone && (
              <div className={cn("border-t", isMobile ? "mt-4 pt-4" : "mt-6 pt-6")}>
                <p className={cn("text-muted-foreground mb-2", isMobile ? "text-[10px]" : "text-xs")}>
                  Oder rufen Sie uns direkt an:
                </p>
                <V28Button
                  variant="secondary"
                  size={isMobile ? "sm" : "md"}
                  className="gap-2 min-h-[44px]"
                  onClick={() => window.location.href = `tel:${companyData.phone}`}
                >
                  <Phone className={cn(isMobile ? "h-4 w-4" : "h-4 w-4 sm:h-5 sm:w-5")} />
                  <span className={cn(isMobile && "text-xs")}>{companyData.phone}</span>
                </V28Button>
              </div>
            )}
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              'flex gap-2',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {message.role === 'assistant' && (
              <div className={cn(
                "bg-primary rounded-full flex items-center justify-center flex-shrink-0",
                isMobile ? "w-7 h-7 mt-0.5" : "w-8 h-8 mt-1"
              )}>
                {isPublicLanding ? (
                  <Car className={cn("text-primary-foreground", isMobile ? "h-3.5 w-3.5" : "h-4 w-4")} />
                ) : (
                  <span className={cn("font-bold text-primary-foreground", isMobile ? "text-[10px]" : "text-xs")}>AI</span>
                )}
              </div>
            )}
            <div
              className={cn(
                'rounded-2xl max-w-[85%]',
                isMobile ? "px-3 py-2" : "px-4 py-3",
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              )}
            >
              <div 
                className={cn(
                  "break-words [&>p]:mb-4 [&>p:last-child]:mb-0 [&_strong]:font-bold",
                  isMobile ? "text-sm" : "text-sm"
                )}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
              />
              {message.timestamp && (
                <div className={cn(
                  "opacity-60 mt-1",
                  isMobile ? "text-[10px]" : "text-xs"
                )}>
                  {new Date(message.timestamp).toLocaleTimeString('de-DE', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              )}
            </div>
            {message.role === 'user' && (
              <div className={cn(
                "bg-primary rounded-full flex items-center justify-center flex-shrink-0",
                isMobile ? "w-7 h-7 mt-0.5" : "w-8 h-8 mt-1"
              )}>
                <span className={cn("font-bold text-primary-foreground", isMobile ? "text-[10px]" : "text-xs")}>
                  {isPublicLanding ? '👤' : (profile?.first_name?.[0] || 'U')}
                </span>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2 justify-start">
            <div className={cn(
              "bg-primary rounded-full flex items-center justify-center flex-shrink-0",
              isMobile ? "w-7 h-7" : "w-8 h-8"
            )}>
              {isPublicLanding ? (
                <Car className={cn("text-primary-foreground animate-pulse", isMobile ? "h-3.5 w-3.5" : "h-4 w-4")} />
              ) : (
                <span className={cn("font-bold text-primary-foreground", isMobile ? "text-[10px]" : "text-xs")}>AI</span>
              )}
            </div>
            <div className={cn("bg-muted rounded-2xl", isMobile ? "px-3 py-2" : "px-4 py-3")}>
              <div className="flex gap-1">
                <span className={cn("ai-chat-loading-dot ai-chat-loading-dot--0", isMobile ? "w-1.5 h-1.5" : "w-2 h-2")} />
                <span className={cn("ai-chat-loading-dot ai-chat-loading-dot--1", isMobile ? "w-1.5 h-1.5" : "w-2 h-2")} />
                <span className={cn("ai-chat-loading-dot ai-chat-loading-dot--2", isMobile ? "w-1.5 h-1.5" : "w-2 h-2")} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT - V26.0 Premium Design */}
      <div 
        className={cn(
          "ai-chat-input-container",
          isMobile ? "p-2.5" : "p-4"
        )}
      >
        <div className={cn("flex gap-2", isMobile && "items-end")}>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={isPublicLanding ? 'Ihre Nachricht...' : 'Ihre Frage...'}
            disabled={isLoading}
            className={cn(
              "ai-chat-input flex-1 resize-none min-h-[44px]",
              isMobile ? "h-11 text-base px-3" : "h-11"
            )}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="sentences"
          />
          <V28Button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            size="sm"
            variant="primary"
            className={cn(
              "ai-chat-send-btn",
              isMobile ? "h-11 w-11" : "h-11 w-11"
            )}
            aria-label="Senden"
          >
            <Send className={cn(isMobile ? "h-5 w-5" : "h-4 w-4 sm:h-5 sm:w-5")} />
          </V28Button>
        </div>
        {!isPublicLanding && !isMobile && (
          <p className="ai-chat-tip text-xs mt-2">
            💡 Tipp: Nutzen Sie die Vorschläge oben für schnelle Antworten
          </p>
        )}
      </div>
    </Card>
  );
}
