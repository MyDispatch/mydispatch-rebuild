/* ==================================================================================
   CONVERSATION LIST V26.1 - HERO-QUALITÄT CHAT-LISTE
   ==================================================================================
   ✅ V26.1 UNIFIED_DESIGN_TOKENS
   ✅ WhatsApp-Style mit Unread-Badges
   ✅ Realtime-Updates & Premium-Design
   ================================================================================== */

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/lib/compat';
import { Input } from '@/lib/compat';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/lib/compat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import { handleError } from '@/lib/error-handler';
import { logError, logDebug, logWarning } from '@/lib/logger';
import { cn } from '@/lib/utils';
import './chat-styles.css';

interface Conversation {
  id: string;
  name: string | null;
  is_group: boolean;
  created_at: string;
  updated_at: string;
  last_message?: {
    message_text: string;
    created_at: string;
    sender_name: string;
  };
  unread_count: number;
  participants: Array<{
    user_id: string;
    first_name: string;
    last_name: string;
  }>;
}

interface ConversationListProps {
  activeConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
}

export function ConversationList({ activeConversationId, onSelectConversation }: ConversationListProps) {
  const { user, profile } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user || !profile?.company_id) return;

    const fetchConversations = async () => {
      try {
        logDebug('[ConversationList] Loading conversations for user', { userId: user.id });

        const { data: participantData, error: participantError } = await supabase
          .from('chat_participants')
          .select('conversation_id')
          .eq('user_id', user.id);

        if (participantError) {
          logError({ message: 'Participant-Daten laden fehlgeschlagen', context: participantError });
          handleError(participantError, 'Gesprächsteilnehmer konnten nicht geladen werden');
          setLoading(false);
          return;
        }

        const conversationIds = participantData?.map(p => p.conversation_id) || [];
        logDebug('[ConversationList] Found conversations', { count: conversationIds.length });
        
        if (conversationIds.length === 0) {
          logDebug('[ConversationList] No conversations found');
          setConversations([]);
          setLoading(false);
          return;
        }

        const { data: conversationsData, error: conversationsError } = await supabase
          .from('chat_conversations')
          .select('id, name, is_group, created_at, updated_at, company_id')
          .in('id', conversationIds)
          .eq('company_id', profile.company_id)
          .eq('archived', false)
          .order('updated_at', { ascending: false });

        if (conversationsError) {
          logError({ message: '[ConversationList] Conversations Error', context: conversationsError });
          handleError(conversationsError, 'Gespräche konnten nicht geladen werden');
          setLoading(false);
          return;
        }

        logDebug('[ConversationList] Loaded conversations', { count: conversationsData?.length || 0 });

        if (!conversationsData || conversationsData.length === 0) {
          setConversations([]);
          setLoading(false);
          return;
        }

        const allConvIds = conversationsData.map(c => c.id);
        
        const { data: allParticipantsData, error: participantsError } = await supabase
          .from('chat_participants')
          .select('conversation_id, user_id, last_read_at')
          .in('conversation_id', allConvIds);

        if (participantsError) {
          logError({ message: '[ConversationList] Participants Error', context: participantsError });
        }

        logDebug('[ConversationList] Loaded participants', { count: allParticipantsData?.length || 0 });

        const allUserIds = [...new Set(
          (allParticipantsData || [])
            .map(p => p.user_id)
            .filter(id => id && id !== user.id)
        )];
        
        logDebug('[ConversationList] Loading profiles for users', { userCount: allUserIds.length });

        if (allUserIds.length === 0) {
          logWarning('[ConversationList] No other users found in conversations', {});
          setConversations(conversationsData.map(conv => ({
            ...conv,
            participants: [],
            last_message: undefined,
            unread_count: 0,
          })));
          setLoading(false);
          return;
        }

        const { data: allProfilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('user_id, first_name, last_name')
          .in('user_id', allUserIds);

        if (profilesError) {
          logError({ message: '[ConversationList] Profiles Error', context: profilesError });
        }

        logDebug('[ConversationList] Loaded profiles', { count: allProfilesData?.length || 0 });
        
        if (allProfilesData && allProfilesData.length > 0) {
          logDebug('[ConversationList] Sample profile loaded', { sample: allProfilesData[0] });
        } else {
          logWarning('[ConversationList] No profiles loaded - Names will be missing', {});
        }

        const lastMessagesResults = await Promise.all(
          allConvIds.map(convId =>
            supabase
              .from('chat_messages')
              .select('conversation_id, message_text, created_at, sender_id')
              .eq('conversation_id', convId)
              .eq('is_deleted', false)
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle()
          )
        );

        const profileMap = new Map(
          (allProfilesData || []).map(p => [p.user_id, p])
        );
        
        logDebug('[ConversationList] ProfileMap entries', { size: profileMap.size });
        if (profileMap.size > 0) {
          const firstEntry = Array.from(profileMap.entries())[0];
          logDebug('[ConversationList] ProfileMap sample', { entry: firstEntry });
        }
        
        const participantsByConv = new Map<string, any[]>();
        (allParticipantsData || []).forEach(p => {
          if (!participantsByConv.has(p.conversation_id)) {
            participantsByConv.set(p.conversation_id, []);
          }
          participantsByConv.get(p.conversation_id)?.push(p);
        });
        
        logDebug('[ConversationList] ParticipantsByConv created', { conversationCount: participantsByConv.size });

        const lastMessageMap = new Map(
          lastMessagesResults
            .filter(r => r.data)
            .map(r => [r.data!.conversation_id, r.data!])
        );

        const enrichedConversations: Conversation[] = conversationsData
          .map(conv => {
            const convParticipants = participantsByConv.get(conv.id) || [];
            const otherParticipants = convParticipants.filter(p => p.user_id !== user.id);
            
            logDebug('[ConversationList] Processing conversation', { 
              convId: conv.id.substring(0, 8),
              total: convParticipants.length,
              others: otherParticipants.length
            });
            
            if (otherParticipants.length === 0) {
              logWarning('[ConversationList] Solo conversation detected - showing with badge', { convId: conv.id });
            }
            
            const participants = otherParticipants
              .map(p => {
                const profile = profileMap.get(p.user_id);
                
                if (!profile) {
                  logWarning('[ConversationList] Profile NOT FOUND', { userId: p.user_id });
                  return null;
                }
                
                logDebug('[ConversationList] User profile found', { 
                  userId: p.user_id.substring(0, 8),
                  name: `${profile.first_name} ${profile.last_name}`
                });
                
                return {
                  user_id: p.user_id,
                  first_name: profile.first_name || 'Unbekannt',
                  last_name: profile.last_name || '',
                };
              })
              .filter(p => p !== null) as Array<{
                user_id: string;
                first_name: string;
                last_name: string;
              }>;
            
            logDebug('[ConversationList] Final participants', { count: participants.length });

          const lastMsgData = lastMessageMap.get(conv.id);
          let lastMessage = undefined;
          if (lastMsgData) {
            const senderProfile = profileMap.get(lastMsgData.sender_id);
            lastMessage = {
              message_text: lastMsgData.message_text || '',
              created_at: lastMsgData.created_at,
              sender_name: senderProfile
                ? `${senderProfile.first_name} ${senderProfile.last_name}`
                : 'Unbekannt',
            };
          }

          const userParticipant = convParticipants.find(p => p.user_id === user.id);
          const lastReadAt = userParticipant?.last_read_at || new Date(0).toISOString();
          
          const unreadCount = lastMessagesResults.filter(r => 
            r.data?.conversation_id === conv.id &&
            r.data?.sender_id !== user.id &&
            new Date(r.data.created_at) > new Date(lastReadAt)
          ).length;

          return {
            ...conv,
            last_message: lastMessage,
            unread_count: unreadCount,
            participants,
          };
        });

        logDebug('[ConversationList] Successfully loaded conversations', { count: enrichedConversations.length });
        if (enrichedConversations.length > 0) {
          logDebug('[ConversationList] Sample conversation', { sample: enrichedConversations[0] });
        }
        setConversations(enrichedConversations);
      } catch (error) {
        logError({ message: '[ConversationList] Unexpected error', context: error });
        logError({ message: 'Gespräche laden fehlgeschlagen', context: error });
        handleError(error, 'Gespräche konnten nicht geladen werden');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();

    const channel = supabase
      .channel('conversations-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
        },
        () => {
          logDebug('[ConversationList] Realtime update detected, reloading conversations', {});
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, profile]);

  const filteredConversations = conversations.filter((conv) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      conv.name?.toLowerCase().includes(searchLower) ||
      conv.participants.some(
        (p) =>
          p.first_name.toLowerCase().includes(searchLower) ||
          p.last_name.toLowerCase().includes(searchLower)
      )
    );
  });

  const getConversationName = (conv: Conversation) => {
    if (conv.name) return conv.name;
    
    if (conv.participants.length === 0) {
      return 'Nur Du';
    }
    
    if (conv.participants.length === 1) {
      const p = conv.participants[0];
      const fullName = `${p.first_name || ''} ${p.last_name || ''}`.trim();
      return fullName || 'Teammitglied';
    }
    
    const names = conv.participants
      .map(p => p.first_name)
      .filter(name => name && name !== 'Unbekannt')
      .slice(0, 3)
      .join(', ');
    
    const remaining = conv.participants.length - 3;
    if (remaining > 0) {
      return `${names} +${remaining}`;
    }
    
    return names || 'Team-Gruppe';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <Card className="border-2 border-beige-20 rounded-md bg-weiss shadow-card p-3">
        <div className="flex items-center justify-center h-64">
          <p className="text-text-secondary">
            Lade Gespräche...
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col border-2 border-beige-20 rounded-md bg-weiss shadow-card p-3">
      {/* Suchfeld */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
        <Input
          placeholder="Gespräche durchsuchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Conversations Liste */}
      <ScrollArea className="flex-1">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center p-4">
            <MessageSquare className="h-16 w-16 mb-4 text-dunkelblau/50" />
            <h4 className="font-semibold mb-2 text-text-primary">
              {searchTerm ? 'Keine Gespräche gefunden' : 'Keine Gespräche'}
            </h4>
            <p className="text-sm mb-4 max-w-xs text-text-secondary">
              {searchTerm 
                ? 'Versuchen Sie einen anderen Suchbegriff' 
                : 'Sie haben noch keine Gespräche'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filteredConversations.every(c => c.participants.length === 0) && (
              <div className="chat-info-card">
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0 text-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold mb-1 text-foreground">
                      Solo-Gespräche
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Diese Gespräche enthalten nur Sie selbst. Laden Sie Teammitglieder ein, um zu chatten.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {filteredConversations.map((conv) => {
              const isSolo = conv.participants.length === 0;
              const isActive = activeConversationId === conv.id;
              
              return (
                <div
                  key={conv.id}
                  onClick={() => !isSolo && onSelectConversation(conv.id)}
                  className={cn(
                    "conversation-item",
                    isSolo && "conversation-item--solo",
                    isActive ? "conversation-item--active" : "conversation-item--inactive"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback 
                        className={cn(
                          "conversation-avatar-fallback",
                          isSolo && "conversation-avatar-fallback--solo",
                          !isSolo && "conversation-avatar-fallback--active"
                        )}
                      >
                        {getInitials(getConversationName(conv))}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center min-w-0 flex-1 gap-2">
                          <p className="font-semibold text-sm truncate">
                            {getConversationName(conv)}
                          </p>
                          {isSolo && (
                            <Badge 
                              variant="secondary" 
                              className="text-[10px] px-1.5 py-0 flex-shrink-0"
                            >
                              Nur Du
                            </Badge>
                          )}
                        </div>
                        {conv.last_message && (
                          <span className="text-xs flex-shrink-0 ml-2 conversation-text-time">
                            {formatDistanceToNow(new Date(conv.last_message.created_at), {
                              addSuffix: false,
                              locale: de,
                            })}
                          </span>
                        )}
                      </div>
                      {conv.last_message && (
                        <div className="flex items-center justify-between">
                          <p className="text-xs truncate flex-1 conversation-text-message">
                            {conv.last_message.sender_name}: {conv.last_message.message_text}
                          </p>
                          {conv.unread_count > 0 && !isActive && (
                            <Badge className="conversation-unread-badge">
                              {conv.unread_count}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
}
