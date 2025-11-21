/* ==================================================================================
   CONTACT SUPPORT DASHBOARD V31.0
   ==================================================================================
   Shows support tickets, messages, and response times
   ================================================================================== */

import type { RenderingResolution } from '@/lib/rendering-quality';
import { useOptimizedRendering } from '@/hooks/useOptimizedRendering';
import { MessageCircle, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContactSupportDashboardProps {
  variant?: 'ipad' | 'iphone' | 'desktop';
  resolution?: RenderingResolution;
}

export default function ContactSupportDashboard({ 
  variant = 'ipad',
  resolution = 'retina' 
}: ContactSupportDashboardProps) {
  const { shouldRender, elementRef } = useOptimizedRendering(resolution);

  if (!shouldRender) {
    return <div ref={elementRef} className="w-full h-full bg-slate-50 animate-pulse" />;
  }

  const tickets = [
    { id: '#1847', subject: 'GPS-Tracking Problem', status: 'open', priority: 'high', time: 'vor 12 Min' },
    { id: '#1846', subject: 'Rechnungs-Export fehlerhaft', status: 'in_progress', priority: 'medium', time: 'vor 1 Std' },
    { id: '#1845', subject: 'Neuer Fahrer hinzufügen', status: 'resolved', priority: 'low', time: 'vor 3 Std' },
    { id: '#1844', subject: 'API-Zugang benötigt', status: 'open', priority: 'high', time: 'vor 5 Std' },
  ];

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'open':
        return { label: 'Offen', color: 'bg-red-50 text-red-700 border-red-200', icon: AlertCircle }; // ✅ Status Exception
      case 'in_progress':
        return { label: 'In Bearbeitung', color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: Clock }; // ✅ Status Exception
      case 'resolved':
        return { label: 'Gelöst', color: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle }; // ✅ Status Exception
      default:
        return { label: 'Unbekannt', color: 'bg-slate-50 text-slate-700 border-slate-200', icon: MessageCircle };
    }
  };

  return (
    <div ref={elementRef} className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 p-6 overflow-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Support Center</h2>
        <p className="text-sm text-slate-600">Ihre Tickets & Nachrichten</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-200">
          <div className="text-xs text-slate-600 mb-1">Offene Tickets</div>
          <div className="text-2xl font-bold text-slate-900">2</div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-200">
          <div className="text-xs text-slate-600 mb-1">In Bearbeitung</div>
          <div className="text-2xl font-bold text-slate-900">1</div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-200">
          <div className="text-xs text-slate-600 mb-1">Ø Antwortzeit</div>
          <div className="text-2xl font-bold text-slate-900">12m</div>
        </div>
      </div>

      {/* Ticket List */}
      <div className="space-y-3">
        {tickets.map((ticket) => {
          const statusConfig = getStatusConfig(ticket.status);
          const StatusIcon = statusConfig.icon;
          
          return (
            <div 
              key={ticket.id}
              className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-semibold text-slate-600">{ticket.id}</span>
                  {ticket.priority === 'high' && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded">
                      Dringend {/* ✅ Status Exception */}
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-500">{ticket.time}</span>
              </div>
              <div className="text-sm font-medium text-slate-900 mb-2">{ticket.subject}</div>
              <div className={cn(
                "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold border",
                statusConfig.color
              )}>
                <StatusIcon className="w-3 h-3" />
                <span>{statusConfig.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 flex gap-3">
        <button className="flex-1 px-4 py-3 bg-slate-700 text-white rounded-xl font-semibold text-sm hover:bg-slate-800 transition-colors">
          Neues Ticket
        </button>
        <button className="flex-1 px-4 py-3 bg-white text-slate-700 border border-slate-300 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors">
          Live-Chat
        </button>
      </div>
    </div>
  );
}
