import { useState, useEffect } from "react";
import { forgetProofSystem, type ForgetProofContext } from "../lib/agents/forgetProof";

export function useForgetProof() {
  const [context, setContext] = useState<ForgetProofContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContext = async () => {
      try {
        setLoading(true);
        const loadedContext = await forgetProofSystem.loadContext();
        setContext(loadedContext);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load context");
      } finally {
        setLoading(false);
      }
    };

    loadContext();

    // Reload context every 5 minutes
    const interval = setInterval(
      async () => {
        try {
          const loadedContext = await forgetProofSystem.ensureContext();
          setContext(loadedContext);
        } catch (err) {
          console.error("Error refreshing context:", err);
        }
      },
      5 * 60 * 1000
    ); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  const refresh = async () => {
    try {
      setLoading(true);
      const loadedContext = await forgetProofSystem.loadContext();
      setContext(loadedContext);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh context");
    } finally {
      setLoading(false);
    }
  };

  return {
    context,
    loading,
    error,
    refresh,
  };
}
