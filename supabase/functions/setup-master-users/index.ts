import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Master users to create
const MASTER_USERS = [
  {
    email: 'courbois1981@gmail.com',
    password: '1def!xO2022!!',
    full_name: 'Pascal Courbois',
    role: 'master'
  },
  {
    email: 'pascal@nexify.ai',
    password: '1def!xO2022!!',
    full_name: 'Pascal NeXify',
    role: 'master'
  },
  {
    email: 'master@nexify.ai',
    password: '1def!xO2022!!',
    full_name: 'Master Admin',
    role: 'master'
  }
]

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. AUTHORIZATION CHECK
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const functionAdminToken = Deno.env.get('FUNCTION_ADMIN_TOKEN')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (token !== functionAdminToken && token !== serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 2. CREATE SUPABASE ADMIN CLIENT
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAdmin = createClient(
      supabaseUrl,
      serviceRoleKey ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const results = []

    // 3. CREATE EACH MASTER USER
    for (const masterUser of MASTER_USERS) {
      try {
        // Check if user exists
        const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
        const userExists = existingUsers?.users.some(u => u.email === masterUser.email)

        let userId: string

        if (userExists) {
          console.log(`User ${masterUser.email} already exists, updating...`)
          const existingUser = existingUsers?.users.find(u => u.email === masterUser.email)
          userId = existingUser!.id

          // Get existing app_metadata to merge
          const existingAppMetadata = existingUser!.app_metadata || {}

          // Update password and app_metadata (idempotent merge)
          await supabaseAdmin.auth.admin.updateUserById(userId, {
            password: masterUser.password,
            email_confirm: true,
            app_metadata: {
              ...existingAppMetadata,
              created_by: "auto-setup",
              is_master: true,
              setup_version: "1.0",
              last_updated: new Date().toISOString()
            },
            user_metadata: {
              full_name: masterUser.full_name,
              role: masterUser.role
            }
          })

          results.push({
            email: masterUser.email,
            status: 'updated',
            userId
          })
        } else {
          // Create new user with app_metadata
          const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email: masterUser.email,
            password: masterUser.password,
            email_confirm: true,
            app_metadata: {
              created_by: "auto-setup",
              is_master: true,
              setup_version: "1.0",
              created_at: new Date().toISOString()
            },
            user_metadata: {
              full_name: masterUser.full_name,
              role: masterUser.role
            }
          })

          if (error) {
            throw error
          }

          userId = data.user!.id
          results.push({
            email: masterUser.email,
            status: 'created',
            userId
          })
        }

        // 4. CREATE/UPDATE PROFILE
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .upsert({
            id: userId,
            user_id: userId,
            email: masterUser.email,
            full_name: masterUser.full_name,
            role: masterUser.role,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          })

        if (profileError) {
          console.error(`Profile error for ${masterUser.email}:`, profileError.message)
        }

        // 5. CREATE/UPDATE USER_ROLES
        const { error: roleError } = await supabaseAdmin
          .from('user_roles')
          .upsert({
            user_id: userId,
            role: masterUser.role,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id,role'
          })

        if (roleError) {
          console.error(`Role error for ${masterUser.email}:`, roleError.message)
        }

      } catch (userError) {
        console.error(`Error processing ${masterUser.email}:`, userError)
        results.push({
          email: masterUser.email,
          status: 'error',
          error: userError instanceof Error ? userError.message : 'Unknown error'
        })
      }
    }

    // 6. RETURN RESULTS
    return new Response(
      JSON.stringify({ 
        success: true,
        results,
        message: `Processed ${results.length} master users`
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
