import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

interface IdleSessionGuardProps {
  timeoutMinutes?: number;
  warnMinutesBefore?: number;
}

export function IdleSessionGuard({ timeoutMinutes = 15, warnMinutesBefore = 1 }: IdleSessionGuardProps) {
  const { signOut, session } = useAuth();
  const { toast } = useToast();
  const timerRef = useRef<number | null>(null);
  const warnTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const resetTimers = () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (warnTimerRef.current) window.clearTimeout(warnTimerRef.current);

      if (!session) return;

      const timeoutMs = timeoutMinutes * 60 * 1000;
      const warnMs = Math.max(timeoutMs - warnMinutesBefore * 60 * 1000, 0);

      warnTimerRef.current = window.setTimeout(() => {
        toast({
          title: 'Inaktivität erkannt',
          description: 'Sie werden in Kürze abgemeldet. Bitte interagieren Sie, um angemeldet zu bleiben.',
        });
      }, warnMs);

      timerRef.current = window.setTimeout(async () => {
        await signOut();
      }, timeoutMs);
    };

    const activityEvents = ['mousemove', 'keydown', 'touchstart', 'scroll'];
    activityEvents.forEach((ev) => window.addEventListener(ev, resetTimers));

    resetTimers();
    return () => {
      activityEvents.forEach((ev) => window.removeEventListener(ev, resetTimers));
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (warnTimerRef.current) window.clearTimeout(warnTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, timeoutMinutes, warnMinutesBefore]);

  return null;
}

