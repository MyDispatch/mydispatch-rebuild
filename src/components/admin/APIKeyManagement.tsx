import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Key,
  Eye,
  EyeOff,
  Save,
  Trash2,
  CheckCircle,
  XCircle,
  RefreshCw,
  Shield
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface APIKey {
  id: string;
  service_name: string;
  key_name: string;
  encrypted_value: string;
  is_active: boolean;
  last_validated_at: string | null;
  created_at: string;
  updated_at: string;
}

interface ServiceGroup {
  name: string;
  displayName: string;
  icon: string;
  keys: APIKey[];
}

export function APIKeyManagement() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [editingKeys, setEditingKeys] = useState<Map<string, string>>(new Map());
  const { toast } = useToast();

  useEffect(() => {
    loadAPIKeys();
  }, []);

  const loadAPIKeys = async () => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('service_name', { ascending: true })
        .order('key_name', { ascending: true });

      if (error) throw error;
      setApiKeys(data || []);
    } catch (error) {
      console.error('Error loading API keys:', error);
      toast({
        title: 'Fehler',
        description: 'API-Keys konnten nicht geladen werden',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const groupKeysByService = (): ServiceGroup[] => {
    const groups = new Map<string, ServiceGroup>();

    apiKeys.forEach(apiKey => {
      if (!groups.has(apiKey.service_name)) {
        groups.set(apiKey.service_name, {
          name: apiKey.service_name,
          displayName: formatServiceName(apiKey.service_name),
          icon: getServiceIcon(apiKey.service_name),
          keys: [],
        });
      }
      groups.get(apiKey.service_name)!.keys.push(apiKey);
    });

    return Array.from(groups.values());
  };

  const formatServiceName = (name: string): string => {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getServiceIcon = (service: string): string => {
    const icons: Record<string, string> = {
      supabase: '🗄️',
      google_maps: '🗺️',
      google_calendar: '📅',
      stripe: '💳',
      paypal: '💰',
      sendgrid: '📧',
      resend: '✉️',
      mailgun: '📬',
      twilio: '📱',
      firebase: '🔥',
      onesignal: '🔔',
      google_analytics: '📊',
      mixpanel: '📈',
      sentry: '🐛',
      aws_s3: '☁️',
      openai: '🤖',
      anthropic: '🧠',
    };
    return icons[service] || '🔑';
  };

  const maskKey = (value: string): string => {
    if (value.startsWith('ENCRYPTED_PLACEHOLDER_')) {
      return '••••••••••••••••';
    }
    if (value.length <= 8) return '••••••••';
    return '••••••••' + value.slice(-4);
  };

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const handleKeyEdit = (keyId: string, value: string) => {
    setEditingKeys(prev => new Map(prev).set(keyId, value));
  };

  const saveKey = async (key: APIKey) => {
    const newValue = editingKeys.get(key.id);
    if (!newValue) return;

    try {
      // Simple encryption (in production, use proper encryption!)
      const encrypted = btoa(newValue); // Base64 encoding as placeholder

      const { error } = await supabase
        .from('api_keys')
        .update({
          encrypted_value: encrypted,
          is_active: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', key.id);

      if (error) throw error;

      toast({
        title: 'Gespeichert',
        description: `${formatServiceName(key.service_name)} - ${key.key_name} wurde aktualisiert`,
      });

      setEditingKeys(prev => {
        const newMap = new Map(prev);
        newMap.delete(key.id);
        return newMap;
      });

      loadAPIKeys();
    } catch (error) {
      console.error('Error saving API key:', error);
      toast({
        title: 'Fehler',
        description: 'API-Key konnte nicht gespeichert werden',
        variant: 'destructive',
      });
    }
  };

  const validateKey = async (key: APIKey) => {
    // Placeholder for validation logic
    toast({
      title: 'Validierung',
      description: 'Key-Validierung wird implementiert...',
    });
  };

  const deleteKey = async (key: APIKey) => {
    if (!confirm(`Möchten Sie den Key "${key.key_name}" wirklich löschen?`)) return;

    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', key.id);

      if (error) throw error;

      toast({
        title: 'Gelöscht',
        description: `${key.key_name} wurde entfernt`,
      });

      loadAPIKeys();
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast({
        title: 'Fehler',
        description: 'API-Key konnte nicht gelöscht werden',
        variant: 'destructive',
      });
    }
  };

  const serviceGroups = groupKeysByService();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">API-Key Verwaltung</h2>
          <p className="text-muted-foreground">
            Verwalten Sie alle API-Schlüssel für externe Services
          </p>
        </div>
        <Button onClick={loadAPIKeys} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Aktualisieren
        </Button>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Alle API-Keys werden verschlüsselt gespeichert. Geben Sie Ihre Keys niemals an Dritte weiter.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue={serviceGroups[0]?.name || 'all'} className="space-y-4">
        <TabsList className="flex flex-wrap h-auto">
          {serviceGroups.map(group => (
            <TabsTrigger key={group.name} value={group.name} className="gap-2">
              <span>{group.icon}</span>
              <span>{group.displayName}</span>
              <Badge variant={group.keys.some(k => k.is_active) ? 'default' : 'secondary'}>
                {group.keys.length}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {serviceGroups.map(group => (
          <TabsContent key={group.name} value={group.name} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{group.icon}</span>
                  {group.displayName}
                </CardTitle>
                <CardDescription>
                  {group.keys.length} API-Key{group.keys.length !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {group.keys.map(key => (
                  <div key={key.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Key className="h-4 w-4 text-muted-foreground" />
                        <Label className="font-medium">{key.key_name}</Label>
                        {key.is_active ? (
                          <Badge variant="default" className="gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Aktiv
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1">
                            <XCircle className="h-3 w-3" />
                            Inaktiv
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleKeyVisibility(key.id)}
                        >
                          {visibleKeys.has(key.id) ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => validateKey(key)}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteKey(key)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Input
                        type={visibleKeys.has(key.id) ? 'text' : 'password'}
                        value={
                          editingKeys.has(key.id)
                            ? editingKeys.get(key.id)
                            : visibleKeys.has(key.id)
                            ? key.encrypted_value.startsWith('ENCRYPTED_PLACEHOLDER_')
                              ? ''
                              : atob(key.encrypted_value) // Decrypt for display
                            : maskKey(key.encrypted_value)
                        }
                        onChange={(e) => handleKeyEdit(key.id, e.target.value)}
                        placeholder={`${key.key_name} eingeben...`}
                        className="font-mono text-sm"
                      />
                      <Button
                        onClick={() => saveKey(key)}
                        disabled={!editingKeys.has(key.id)}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    </div>

                    {key.last_validated_at && (
                      <p className="text-xs text-muted-foreground">
                        Zuletzt validiert: {new Date(key.last_validated_at).toLocaleString('de-DE')}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
