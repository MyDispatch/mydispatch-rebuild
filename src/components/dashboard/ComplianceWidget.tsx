/* ==================================================================================
   COMPLIANCE WIDGET V18.3 - DASHBOARD ÜBERSICHT PFLICHTDOKUMENTE
   ==================================================================================
   ✅ Zeigt ablaufende Dokumente aller Entities (Fahrer, Fahrzeuge, Unternehmen)
   ✅ Filtert nach Severity (critical, high, medium)
   ✅ Direct-Navigation zu betroffenen Entities
   ✅ Nutzt v_all_expiring_documents View
   ================================================================================== */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/lib/compat';
import { Badge } from '@/lib/compat';
import { V28Button } from '@/components/design-system/V28Button';
import { AlertCircle, FileText, Users, Car, Building2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '@/lib/format-utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ExpiringDocument {
  entity_type: string;
  entity_id: string;
  entity_name: string;
  document_type: string;
  expiry_date: string;
  status: string;
  company_id: string;
}

export function ComplianceWidget() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  
  const companyId = profile?.company_id;

  const { data: expiringDocs, isLoading, error } = useQuery({
    queryKey: ['expiring-documents', companyId],
    queryFn: async () => {
      if (!companyId) return [];

      const { data, error } = await supabase
        .from('v_all_expiring_documents')
        .select('*')
        .eq('company_id', companyId)
        .order('expiry_date', { ascending: true })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
    enabled: !!companyId
  });

  const criticalCount = expiringDocs?.filter(d => d.status === 'critical').length || 0;
  const highCount = expiringDocs?.filter(d => d.status === 'warning').length || 0;

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case 'driver': return Users;
      case 'vehicle': return Car;
      case 'company': return Building2;
      default: return FileText;
    }
  };

  const getEntityRoute = (doc: ExpiringDocument) => {
    switch (doc.entity_type) {
      case 'driver': return `/fahrer?tab=fahrer&id=${doc.entity_id}`;
      case 'vehicle': return `/fahrer?tab=fahrzeuge&id=${doc.entity_id}`;
      case 'company': return `/einstellungen?tab=unternehmen`;
      default: return '/dokumente';
    }
  };

  const getSeverityVariant = (status: string): "default" | "destructive" | "outline" | "secondary" => {
    switch (status) {
      case 'critical': return 'destructive';
      case 'warning': return 'default';
      default: return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-foreground" />
            Compliance-Übersicht
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              Fehler beim Laden der Compliance-Daten: {error.message}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-foreground" />
            Dokument-Compliance
          </span>
          {(criticalCount > 0 || highCount > 0) && (
            <div className="flex gap-2">
              {criticalCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {criticalCount} kritisch
                </Badge>
              )}
              {highCount > 0 && (
                <Badge variant="default" className="text-xs">
                  {highCount} wichtig
                </Badge>
              )}
            </div>
          )}
        </CardTitle>
        <CardDescription>
          Ablaufende Pflichtdokumente (nächste 30 Tage)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!expiringDocs || expiringDocs.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              Alle Dokumente sind aktuell ✅
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {expiringDocs.map((doc, index) => {
              const Icon = getEntityIcon(doc.entity_type);
              const isExpired = false; // Simplified for now
              
              return (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-primary/10 transition-colors"
                >
                  <div className="mt-1">
                    <Icon className="h-4 w-4 text-foreground" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm truncate">
                        {doc.entity_name}
                      </span>
                      <Badge variant={getSeverityVariant(doc.status)} className="text-[10px] px-1.5 py-0">
                        {doc.status}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-1">
                      {doc.document_type}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground">
                        {formatDate(doc.expiry_date)}
                      </span>
                    </div>
                  </div>
                  
                  <V28Button
                    size="sm"
                    variant="secondary"
                    onClick={() => navigate(getEntityRoute(doc))}
                    className="shrink-0"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </V28Button>
                </div>
              );
            })}
          </div>
        )}
        
        {expiringDocs && expiringDocs.length > 0 && (
          <V28Button
            variant="secondary"
            className="w-full mt-4"
            onClick={() => navigate('/dokumente')}
          >
            Alle Dokumente verwalten
            <ExternalLink className="h-4 w-4 ml-2 text-foreground" />
          </V28Button>
        )}
      </CardContent>
    </Card>
  );
}
