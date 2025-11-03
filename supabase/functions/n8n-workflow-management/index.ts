/* ==================================================================================
   N8N WORKFLOW MANAGEMENT - API-basierte Verwaltung
   ==================================================================================
   Zentrale API für n8n Workflow-Management:
   - Workflows auflisten, erstellen, aktualisieren, löschen
   - Workflow-Status und Executions abrufen
   - Webhook-URLs extrahieren
   - Vollständige CRUD-Operationen via n8n API
   ================================================================================== */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type WorkflowAction = 
  | 'list_workflows'
  | 'get_workflow'
  | 'create_workflow'
  | 'update_workflow'
  | 'delete_workflow'
  | 'activate_workflow'
  | 'deactivate_workflow'
  | 'get_executions'
  | 'get_webhook_url'
  | 'get_credentials'
  | 'test_connection';

interface WorkflowRequest {
  action: WorkflowAction;
  workflow_id?: string;
  workflow_data?: any;
  limit?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { action, workflow_id, workflow_data, limit = 50 } = await req.json() as WorkflowRequest;
    
    // Get n8n configuration
    const n8nApiKey = Deno.env.get('N8N_API_KEY');
    const n8nWorkflowUrl = Deno.env.get('N8N_WORKFLOW_URL');
    
    if (!n8nApiKey || !n8nWorkflowUrl) {
      throw new Error('N8N_API_KEY und N8N_WORKFLOW_URL müssen in den Secrets konfiguriert sein');
    }
    
    console.log(`[n8n Management] Original N8N_WORKFLOW_URL: ${n8nWorkflowUrl}`);
    
    // INTELLIGENTE URL-EXTRAKTION
    // Problem: N8N_WORKFLOW_URL kann eine Webhook-URL sein (z.B. .../workflow/ID/webhook/...)
    // Lösung: Extrahiere nur Host-Teil (https://instance.app.n8n.cloud)
    
    let n8nInstanceUrl: string;
    let baseApiUrl: string;
    
    try {
      const url = new URL(n8nWorkflowUrl);
      // Nimm nur Protocol + Host (https://mydispatch.app.n8n.cloud)
      n8nInstanceUrl = `${url.protocol}//${url.host}`;
      baseApiUrl = `${n8nInstanceUrl}/api/v1`;
      
      console.log(`[n8n Management] Extracted URLs:`);
      console.log(`  - Instance URL: ${n8nInstanceUrl}`);
      console.log(`  - Base API URL: ${baseApiUrl}`);
    } catch (error) {
      console.error(`[n8n Management] URL-Parsing fehlgeschlagen:`, error);
      throw new Error(`N8N_WORKFLOW_URL ist ungültig: ${n8nWorkflowUrl}`);
    }

    // Authenticate user
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    console.log(`[n8n Management] Action: ${action}, Base URL: ${baseApiUrl}, Instance: ${n8nInstanceUrl}`);

    let endpoint = '';
    let method = 'GET';
    let body: any = null;

    // Route based on action
    switch (action) {
      case 'list_workflows':
        endpoint = '/workflows';
        break;
        
      case 'get_workflow':
        if (!workflow_id) throw new Error('workflow_id required');
        endpoint = `/workflows/${workflow_id}`;
        break;
        
      case 'create_workflow':
        if (!workflow_data) throw new Error('workflow_data required');
        endpoint = '/workflows';
        method = 'POST';
        body = workflow_data;
        break;
        
      case 'update_workflow':
        if (!workflow_id || !workflow_data) throw new Error('workflow_id and workflow_data required');
        endpoint = `/workflows/${workflow_id}`;
        method = 'PUT';
        body = workflow_data;
        break;
        
      case 'delete_workflow':
        if (!workflow_id) throw new Error('workflow_id required');
        endpoint = `/workflows/${workflow_id}`;
        method = 'DELETE';
        break;
        
      case 'activate_workflow':
        if (!workflow_id) throw new Error('workflow_id required');
        endpoint = `/workflows/${workflow_id}/activate`;
        method = 'POST';
        break;
        
      case 'deactivate_workflow':
        if (!workflow_id) throw new Error('workflow_id required');
        endpoint = `/workflows/${workflow_id}/deactivate`;
        method = 'POST';
        break;
        
      case 'get_executions':
        endpoint = `/executions?limit=${limit}`;
        if (workflow_id) {
          endpoint += `&workflowId=${workflow_id}`;
        }
        break;
        
      case 'get_webhook_url':
        if (!workflow_id) throw new Error('workflow_id required');
        // First get workflow to extract webhook ID
        endpoint = `/workflows/${workflow_id}`;
        break;
        
      case 'get_credentials':
        endpoint = '/credentials';
        break;
        
      case 'test_connection':
        // Simple health check
        endpoint = '/workflows?limit=1';
        break;
        
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    // Make API call to n8n
    const fetchOptions: RequestInit = {
      method,
      headers: {
        'X-N8N-API-KEY': n8nApiKey,
        'Accept': 'application/json',
      },
    };

    if (body) {
      fetchOptions.headers = {
        ...fetchOptions.headers,
        'Content-Type': 'application/json',
      };
      fetchOptions.body = JSON.stringify(body);
    }

    console.log(`[n8n Management] ${method} ${baseApiUrl}${endpoint}`);

    const response = await fetch(`${baseApiUrl}${endpoint}`, fetchOptions);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[n8n Management] Error: ${response.status} ${errorText}`);
      throw new Error(`n8n API error: ${response.status} ${errorText}`);
    }

    let result = await response.json();

    // Special handling for get_webhook_url
    if (action === 'get_webhook_url' && result.data) {
      const workflow = result.data;
      const webhookNode = workflow.nodes?.find((node: any) => 
        node.type === 'n8n-nodes-base.webhook'
      );
      
      if (webhookNode) {
        // Use the webhook path from node parameters or webhookId
        const webhookPath = webhookNode.parameters?.path || webhookNode.webhookId;
        
        result = {
          workflow_id: workflow.id,
          workflow_name: workflow.name,
          webhook_path: webhookPath,
          webhook_url: `${n8nInstanceUrl}/webhook/${webhookPath}`,
          webhook_test_url: `${n8nInstanceUrl}/webhook-test/${webhookPath}`,
          workflow_editor_url: `${n8nInstanceUrl}/workflow/${workflow.id}`,
        };
      } else {
        throw new Error('No webhook node found in workflow');
      }
    }

    console.log(`[n8n Management] Success:`, JSON.stringify(result, null, 2));

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: result,
        action,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('[n8n Management] Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        help: 'Prüfen Sie N8N_API_KEY und N8N_INSTANCE_URL in den Secrets'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
