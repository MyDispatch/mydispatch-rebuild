import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { persistSession } from "@/hooks/useBootstrapSession";
import { toast } from "@/lib/toast";
import { useAuthStore } from "@/stores/authStore";

type LoginFormValues = {
  email: string;
  password: string;
};

const MASTER_EMAIL = import.meta.env.VITE_MASTER_ADMIN_EMAIL ?? "courbois1981@gmail.com";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((state) => state.setSession);
  const setBootstrapping = useAuthStore((state) => state.setBootstrapping);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: MASTER_EMAIL,
      password: ""
    }
  });

  const redirectPath = useMemo(() => {
    const from = location.state as { from?: { pathname?: string } } | undefined;
    return from?.from?.pathname ?? "/dashboard";
  }, [location.state]);

  const onSubmit = async (values: LoginFormValues) => {
    const expectedPassword = import.meta.env.VITE_MASTER_ADMIN_PASSWORD;

    if (!expectedPassword) {
      toast({
        title: "Konfiguration erforderlich",
        description: "Bitte VITE_MASTER_ADMIN_PASSWORD in den Umgebungsvariablen setzen.",
        variant: "warning"
      });
      return;
    }

    if (values.email !== MASTER_EMAIL || values.password !== expectedPassword) {
      toast({
        title: "Login fehlgeschlagen",
        description: "Ungültige Zugangsdaten",
        variant: "error"
      });
      return;
    }

    const session = {
      id: crypto.randomUUID(),
      email: MASTER_EMAIL,
      roles: ["master"],
      displayName: "NeXify Master Admin"
    };

    setSession(session);
    setBootstrapping(false);
    persistSession(session);
    toast({ title: "Willkommen zurück", description: "NeXifyAI MASTER ist bereit", variant: "success" });
    navigate(redirectPath, { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-slate-100">NeXifyAI MASTER Console</h1>
          <p className="mt-1 text-sm text-slate-400">Authentifiziere dich mit deinen Master-Anmeldedaten.</p>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            <span>E-Mail</span>
            <input
              type="email"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
              {...register("email")}
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            <span>Passwort</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
              {...register("password")}
            />
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 rounded-lg bg-primary-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-primary-400 disabled:opacity-60"
          >
            {isSubmitting ? "Authentifiziere…" : "Login"}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-slate-500">
          Stelle sicher, dass die Master-Konfigurationsvariablen gesetzt und Supabase-Rollen zugewiesen sind.
        </p>
      </div>
    </div>
  );
}
