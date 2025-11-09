import { useEffect } from "react";

import { useAuthStore } from "@/stores/authStore";

const STORAGE_KEY = "nexify-master-session";

export function useBootstrapSession() {
  const setSession = useAuthStore((state) => state.setSession);
  const setBootstrapping = useAuthStore((state) => state.setBootstrapping);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.id && parsed?.email) {
          setSession(parsed);
        }
      }
    } catch (error) {
      console.error("Session konnte nicht geladen werden", error);
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setBootstrapping(false);
    }
  }, [setBootstrapping, setSession]);
}

export function persistSession(session: unknown) {
  if (!session) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}
