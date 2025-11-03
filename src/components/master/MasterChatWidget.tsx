/* ==================================================================================
   MASTER CHAT WIDGET - INTELLIGENT AI ASSISTANT
   ==================================================================================
   ✅ Lovable AI Gateway Integration (google/gemini-2.5-flash)
   ✅ Streaming SSE Response
   ✅ Responsive: Bottom-Fixed (Mobile) / Right-Sidebar (Desktop)
   ✅ ARIA Accessible + Keyboard Navigation
   ================================================================================== */

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, X, Minimize2, Maximize2, Paperclip, Upload } from 'lucide-react';
import { V28Button } from '@/components/design-system/V28Button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';
import { handleError } from '@/lib/error-handler';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  attachmentUrl?: string;
  attachmentName?: string;
}

interface MasterChatWidgetProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function MasterChatWidget({ isOpen = true, onClose }: MasterChatWidgetProps) {
  const { session } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hallo! Ich bin der Master-Agent. Wie kann ich dir helfen?\n\n💡 Tipp: Du kannst Dateien hochladen (.pdf, .md, .txt, .png, .jpg) bis 5MB.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // File Upload Handler
  const uploadFile = useCallback(async (file: File): Promise<string | null> => {
    if (!session?.user?.id) {
      toast({ title: 'Fehler', description: 'Nicht angemeldet', variant: 'destructive' });
      return null;
    }

    // Validate File Type
    const allowedTypes = ['application/pdf', 'text/markdown', 'text/plain', 'image/png', 'image/jpeg'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Ungültiger Dateityp',
        description: 'Erlaubt: .pdf, .md, .txt, .png, .jpg',
        variant: 'destructive',
      });
      return null;
    }

    // Validate File Size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Datei zu groß',
        description: 'Maximal 5MB erlaubt',
        variant: 'destructive',
      });
      return null;
    }

    try {
      setUploadProgress(0);
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `${session.user.id}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('chat-uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      // Get Public URL (private bucket, so signed URL)
      const { data: urlData } = supabase.storage
        .from('chat-uploads')
        .getPublicUrl(filePath);

      setUploadProgress(100);
      toast({ title: 'Upload erfolgreich', description: file.name });
      return urlData.publicUrl;
    } catch (error) {
      handleError(error, 'Upload fehlgeschlagen', { title: 'Upload Error' });
      toast({
        title: 'Upload fehlgeschlagen',
        description: error instanceof Error ? error.message : 'Unbekannter Fehler',
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploadProgress(0);
    }
  }, [session, toast]);

  // Handle File Selection
  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setSelectedFile(file);
      const url = await uploadFile(file);
      if (url) {
        setInput((prev) => `${prev}\n\n📎 Hochgeladen: [${file.name}](${url})`);
      }
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    [uploadFile]
  );

  // Drag-Drop Handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set false if leaving the card itself
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (!file) return;

      setSelectedFile(file);
      const url = await uploadFile(file);
      if (url) {
        setInput((prev) => `${prev}\n\n📎 Hochgeladen: [${file.name}](${url})`);
      }
      setSelectedFile(null);
    },
    [uploadFile]
  );

  const streamChat = async (userMessage: Message) => {
    try {
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/master-chat`;
      
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let assistantContent = '';

      // Upsert assistant message progressively
      const upsertAssistant = (chunk: string) => {
        assistantContent += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === 'assistant') {
            return prev.map((m, i) =>
              i === prev.length - 1 ? { ...m, content: assistantContent } : m
            );
          }
          return [...prev, { role: 'assistant', content: assistantContent }];
        });
      };

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
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) upsertAssistant(content);
          } catch {
            // Incomplete JSON - put it back
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split('\n')) {
          if (!raw || raw.startsWith(':')) continue;
          if (!raw.startsWith('data: ')) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) upsertAssistant(content);
          } catch {}
        }
      }
    } catch (error) {
      handleError(error, 'Master-Chat Stream-Fehler', { title: 'Chat Stream Error' });
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ Fehler bei der Verbindung zum Master-Agent. Bitte versuche es erneut.',
        },
      ]);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    await streamChat(userMessage);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <Card
      className={`
        fixed z-50 bg-background/95 backdrop-blur-sm border-2 shadow-2xl
        transition-all duration-300
        ${isMinimized ? 'h-14' : 'h-[500px]'}
        ${isDragging ? 'border-primary border-4 ring-4 ring-primary/30' : 'border-primary/20'}
        ${
          // Mobile: Bottom-Fixed / Desktop: Right-Sidebar
          'bottom-4 right-4 w-[calc(100vw-2rem)] sm:w-96 md:bottom-4 md:right-4'
        }
      `}
      aria-label="Master Agent Chat"
      role="region"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-primary/5">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <span className="font-semibold text-sm">Master-Agent</span>
        </div>
        <div className="flex items-center gap-1">
          <V28Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-7 w-7"
            aria-label={isMinimized ? 'Maximize Chat' : 'Minimize Chat'}
          >
            {isMinimized ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </V28Button>
          {onClose && (
            <V28Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-7 w-7"
              aria-label="Close Chat"
            >
              <X className="h-4 w-4" />
            </V28Button>
          )}
        </div>
      </div>

      {/* Messages */}
      {!isMinimized && (
        <>
          <ScrollArea className="h-[calc(100%-8rem)] p-4" ref={scrollRef}>
            {/* Drag-Drop Overlay */}
            {isDragging && (
              <div className="absolute inset-0 z-10 bg-primary/10 backdrop-blur-sm flex items-center justify-center border-2 border-dashed border-primary rounded-lg m-4">
                <div className="text-center">
                  <Upload className="h-12 w-12 text-primary mx-auto mb-2" />
                  <p className="text-sm font-semibold text-primary">
                    Datei hier ablegen
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    .pdf, .md, .txt, .png, .jpg (max 5MB)
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`
                      max-w-[85%] rounded-lg px-3 py-2 text-sm
                      ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }
                    `}
                  >
                    <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" />
                      <span
                        className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                      />
                      <span
                        className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-3 border-t border-border bg-background space-y-2">
            {/* Upload Progress */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Uploading...</span>
                  <span className="text-muted-foreground">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-1" />
              </div>
            )}

            {/* Input Area */}
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.md,.txt,.png,.jpg,.jpeg"
                onChange={handleFileSelect}
                className="hidden"
                aria-label="File Upload"
              />
              <V28Button
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading || uploadProgress > 0}
                className="shrink-0 h-10 w-10"
                aria-label="Datei hochladen"
              >
                <Paperclip className="h-4 w-4" />
              </V28Button>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nachricht an Master-Agent..."
                className="min-h-[40px] max-h-[100px] resize-none"
                disabled={isLoading}
                aria-label="Chat Input"
              />
              <V28Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="sm"
                className="shrink-0 h-10 w-10"
                aria-label="Send Message"
              >
                <Send className="h-4 w-4" />
              </V28Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
