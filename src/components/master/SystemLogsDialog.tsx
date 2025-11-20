/* ==================================================================================
   SYSTEM LOGS DIALOG - Master Dashboard
   ==================================================================================
   Dialog für Anzeige der System-Logs
   ================================================================================== */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/format-utils";
import { AlertTriangle, Info, XCircle } from "lucide-react";

interface LogEntry {
  id: string;
  severity: "info" | "warning" | "error";
  message: string;
  component?: string;
  created_at: string;
}

interface SystemLogsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  logs: LogEntry[];
}

export function SystemLogsDialog({ open, onOpenChange, logs }: SystemLogsDialogProps) {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "error":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      case "warning":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">System-Logs</DialogTitle>
          <DialogDescription>Letzte {logs.length} Einträge (neueste zuerst)</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(log.severity)}
                    <Badge variant="outline" className={getSeverityColor(log.severity)}>
                      {log.severity.toUpperCase()}
                    </Badge>
                    {log.component && (
                      <span className="text-xs text-slate-500 font-mono">{log.component}</span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">{formatDateTime(log.created_at)}</span>
                </div>
                <p className="text-sm text-slate-700">{log.message}</p>
              </div>
            ))}

            {logs.length === 0 && (
              <div className="text-center py-8 text-slate-500">Keine Logs verfügbar</div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
