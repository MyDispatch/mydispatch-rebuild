import { useToastStore } from "@/lib/toast";

const variants: Record<string, string> = {
  default: "bg-slate-800 border border-slate-700 text-slate-100",
  success: "bg-emerald-600/20 border border-emerald-500/40 text-emerald-100",
  error: "bg-rose-600/20 border border-rose-500/40 text-rose-100",
  warning: "bg-amber-500/20 border border-amber-400/40 text-amber-100"
};

export function Toaster() {
  const toasts = useToastStore();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[999] flex flex-col items-end gap-2 p-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto w-full max-w-sm rounded-lg px-4 py-3 shadow-lg backdrop-blur ${variants[toast.variant] ?? variants.default}`}
        >
          <p className="text-sm font-semibold">{toast.title}</p>
          {toast.description ? <p className="mt-1 text-xs text-slate-200/80">{toast.description}</p> : null}
        </div>
      ))}
    </div>
  );
}
