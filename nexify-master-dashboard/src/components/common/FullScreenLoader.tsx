type FullScreenLoaderProps = {
  message?: string;
};

export function FullScreenLoader({ message = "Bitte warten" }: FullScreenLoaderProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <span className="h-14 w-14 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        <p className="text-sm font-medium text-slate-200">{message}…</p>
      </div>
    </div>
  );
}
