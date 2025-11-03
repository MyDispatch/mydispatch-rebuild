import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { useChatMessages } from '@/hooks/use-chat-messages';
import { Card } from '@/lib/compat';
import { Input } from '@/lib/compat';
import { V28Button } from '@/components/design-system/V28Button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Paperclip } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import { handleError, handleSuccess, handleInfo } from '@/lib/error-handler';
import { logError, logDebug, logWarning } from '@/lib/logger';
import { cn } from '@/lib/utils';
import type { Database } from '@/integrations/supabase/types';
import './chat-styles.css';

type DBMessage = Database['public']['Tables']['chat_messages']['Row'];
type DBProfile = Database['public']['Tables']['profiles']['Row'];

interface Message {
  id: string;
  sender_id: string;
  message_text: string | null;
  message_type: string;
  file_url: string | null;
  created_at: string;
  sender: {
    first_name: string;
    last_name: string;
  };
}

interface ChatWindowProps {
  conversationId: string;
  onStartCall: (type: 'audio' | 'video') => void;
}

export function ChatWindow({ conversationId, onStartCall }: ChatWindowProps) {
  const { user, profile } = useAuth();
  const { sendMessage, sendFileMessage, isSending } = useChatMessages(conversationId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (!conversationId || !user) return;

    const fetchMessages = async () => {
      try {
        logDebug('[ChatWindow] Loading messages for conversation', { conversationId });
        
        const { data: messagesData, error: messagesError } = await supabase
          .from('chat_messages')
          .select('id, sender_id, message_text, message_type, file_url, created_at')
          .eq('conversation_id', conversationId)
          .eq('is_deleted', false)
          .order('created_at', { ascending: true });

        if (messagesError) {
          logError({ message: '[ChatWindow] Messages Error', context: messagesError });
          handleError(messagesError, 'Nachrichten konnten nicht geladen werden');
          setLoading(false);
          return;
        }

        logDebug('[ChatWindow] Messages loaded', { count: messagesData?.length || 0 });

        const senderIds = [...new Set(messagesData?.map((m) => m.sender_id) || [])];
        logDebug('[ChatWindow] Loading profiles for senders', { senderIds: senderIds.length });
        
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('user_id, first_name, last_name')
          .in('user_id', senderIds);

        if (profilesError) {
          logError({ message: '[ChatWindow] Profiles Error', context: profilesError });
        }

        logDebug('[ChatWindow] Profiles loaded', { count: profilesData?.length || 0 });

        const profileMap = new Map(profilesData?.map(p => [p.user_id, p]) || []);

        const enrichedMessages: Message[] = (messagesData || []).map((msg) => {
          const profile = profileMap.get(msg.sender_id);
          return {
            id: msg.id,
            sender_id: msg.sender_id,
            message_text: msg.message_text,
            message_type: msg.message_type,
            file_url: msg.file_url,
            created_at: msg.created_at,
            sender: {
              first_name: profile?.first_name || 'Unbekannt',
              last_name: profile?.last_name || '',
            },
          };
        });

        logDebug('[ChatWindow] Enriched messages', { count: enrichedMessages.length });
        setMessages(enrichedMessages);
        
        await supabase
          .from('chat_participants')
          .update({ last_read_at: new Date().toISOString() })
          .eq('conversation_id', conversationId)
          .eq('user_id', user.id);
        
        setTimeout(scrollToBottom, 100);
      } catch (error) {
        logError({ message: 'Messages laden Fehler', context: error });
        handleError(error, 'Fehler beim Laden der Nachrichten');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    const channel = supabase
      .channel(`chat:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          logDebug('[ChatWindow] Neue Nachricht via Realtime', { payload });
          
          const newMsg = payload.new as any;
          
          const { data: senderProfile, error: profileError } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('user_id', newMsg.sender_id)
            .maybeSingle();
          
          if (profileError) {
            logWarning('[ChatWindow] Profile fetch error', { error: profileError });
          }

          logDebug('[ChatWindow] Sender profile loaded', { hasSender: !!senderProfile });
          
          const enrichedMessage: Message = {
            id: newMsg.id,
            sender_id: newMsg.sender_id,
            message_text: newMsg.message_text,
            message_type: newMsg.message_type,
            file_url: newMsg.file_url,
            created_at: newMsg.created_at,
            sender: {
              first_name: senderProfile?.first_name || 'Unbekannt',
              last_name: senderProfile?.last_name || '',
            },
          };
          
          setMessages((prev) => [...prev, enrichedMessage]);
          
          if (newMsg.sender_id !== user.id) {
            await supabase
              .from('chat_participants')
              .update({ last_read_at: new Date().toISOString() })
              .eq('conversation_id', conversationId)
              .eq('user_id', user.id);
          }
          
          setTimeout(scrollToBottom, 100);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, user]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || isSending) return;

    // ✅ MISSION II (STRANGLER FIG): Migriert auf TanStack Query Hook
    try {
      await sendMessage({
        conversation_id: conversationId,
        sender_id: user.id,
        message_text: newMessage.trim(),
      });
      
      setNewMessage('');
      
      await supabase
        .from('chat_conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);
    } catch (error) {
      // Hook handled error already
      console.error('[Chat] Send message failed');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || isSending) return;

    try {
      handleInfo('Datei wird hochgeladen...');

      const fileExt = file.name.split('.').pop();
      const fileName = `chat/${conversationId}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        logError({ message: 'Upload Error', context: uploadError });
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      logDebug('[ChatWindow] File uploaded', { publicUrl });

      // ✅ MISSION II (STRANGLER FIG): Migriert auf TanStack Query Hook
      await sendFileMessage({
        conversation_id: conversationId,
        sender_id: user.id,
        message_text: file.name,
        file_url: publicUrl,
      });

      handleSuccess('Datei erfolgreich gesendet');
      
      await supabase
        .from('chat_conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

    } catch (error) {
      logError({ message: 'File Upload Error', context: error });
      handleError(error, 'Datei-Upload fehlgeschlagen');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <Card className="p-4 h-full flex items-center justify-center bg-white rounded-xl shadow-sm border border-slate-200">
        <p className="text-muted-foreground">
          Lade Nachrichten...
        </p>
      </Card>
    );
  }

  return (
    <>
      {/* Messages */}
      <ScrollArea className="flex-1 p-3">
        <div className="flex flex-col gap-6">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-center">
              <p className="text-muted-foreground">
                Noch keine Nachrichten
              </p>
            </div>
          ) : (
            messages.map((message) => {
              const isOwnMessage = message.sender_id === user?.id;
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`flex max-w-[70%] gap-2 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback 
                        className="chat-avatar-fallback chat-avatar-fallback--own-message"
                      >
                        {message.sender.first_name[0]}{message.sender.last_name[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                      <div
                        className={cn(
                          "chat-message-bubble",
                          isOwnMessage ? "chat-message-bubble--own" : "chat-message-bubble--other"
                        )}
                      >
                        {!isOwnMessage && (
                          <p className="text-xs font-semibold mb-1 text-foreground">
                            {message.sender.first_name} {message.sender.last_name}
                          </p>
                        )}
                        {message.message_type === 'text' && message.message_text && (
                          <p className="text-sm whitespace-pre-wrap">{message.message_text}</p>
                        )}
                        {message.file_url && (
                          <a
                            href={message.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="chat-link"
                          >
                            <Paperclip className="h-4 w-4" />
                            {message.message_text || 'Datei öffnen'}
                          </a>
                        )}
                      </div>
                      <p className="text-xs mt-1 text-muted-foreground">
                        {formatDistanceToNow(new Date(message.created_at), {
                          addSuffix: true,
                          locale: de,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 pt-4 mt-px border-t-2 border-border">
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileUpload}
          />
          <V28Button
            variant="secondary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSending}
          >
            <Paperclip className="h-4 w-4" />
          </V28Button>
          <Input
            placeholder="Nachricht schreiben..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isSending}
            className="flex-1"
          />
          <V28Button 
            onClick={handleSendMessage} 
            disabled={isSending || !newMessage.trim()}
            variant="primary"
          >
            <Send className="h-4 w-4" />
          </V28Button>
        </div>
      </div>
    </>
  );
}
