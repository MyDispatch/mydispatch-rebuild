export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      add_ons: {
        Row: {
          add_on_id: string
          applicable_to_tariffs: string[]
          created_at: string | null
          description: string | null
          display_order: number | null
          features: Json | null
          id: string
          is_active: boolean | null
          name: string
          price_monthly: number
          price_yearly: number | null
          stripe_price_id_monthly: string | null
          stripe_price_id_yearly: string | null
          stripe_product_id: string | null
          updated_at: string | null
        }
        Insert: {
          add_on_id: string
          applicable_to_tariffs: string[]
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          price_monthly: number
          price_yearly?: number | null
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
          stripe_product_id?: string | null
          updated_at?: string | null
        }
        Update: {
          add_on_id?: string
          applicable_to_tariffs?: string[]
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          price_monthly?: number
          price_yearly?: number | null
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
          stripe_product_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      agent_status: {
        Row: {
          agent_name: string
          created_at: string | null
          id: string
          last_heartbeat: string | null
          metadata: Json | null
          status: string
          updated_at: string | null
          version: string
        }
        Insert: {
          agent_name: string
          created_at?: string | null
          id?: string
          last_heartbeat?: string | null
          metadata?: Json | null
          status: string
          updated_at?: string | null
          version: string
        }
        Update: {
          agent_name?: string
          created_at?: string | null
          id?: string
          last_heartbeat?: string | null
          metadata?: Json | null
          status?: string
          updated_at?: string | null
          version?: string
        }
        Relationships: []
      }
      ai_actions_log: {
        Row: {
          action_type: string
          affected_files: string[] | null
          created_at: string
          duration_ms: number | null
          error_message: string | null
          id: string
          knowledge_check_performed: boolean
          metadata: Json | null
          patterns_applied: string[] | null
          success: boolean | null
          task_description: string | null
        }
        Insert: {
          action_type: string
          affected_files?: string[] | null
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          knowledge_check_performed?: boolean
          metadata?: Json | null
          patterns_applied?: string[] | null
          success?: boolean | null
          task_description?: string | null
        }
        Update: {
          action_type?: string
          affected_files?: string[] | null
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          knowledge_check_performed?: boolean
          metadata?: Json | null
          patterns_applied?: string[] | null
          success?: boolean | null
          task_description?: string | null
        }
        Relationships: []
      }
      ai_learning_patterns: {
        Row: {
          applied_count: number
          confidence: number
          context: Json
          files_changed: string[] | null
          id: string
          issues_encountered: string[] | null
          learned_at: string
          learnings: string
          pattern_type: string
          patterns_used: string[] | null
          success: boolean
        }
        Insert: {
          applied_count?: number
          confidence?: number
          context?: Json
          files_changed?: string[] | null
          id?: string
          issues_encountered?: string[] | null
          learned_at?: string
          learnings: string
          pattern_type: string
          patterns_used?: string[] | null
          success: boolean
        }
        Update: {
          applied_count?: number
          confidence?: number
          context?: Json
          files_changed?: string[] | null
          id?: string
          issues_encountered?: string[] | null
          learned_at?: string
          learnings?: string
          pattern_type?: string
          patterns_used?: string[] | null
          success?: boolean
        }
        Relationships: []
      }
      ai_self_reports: {
        Row: {
          created_at: string
          id: string
          identified_gaps: string[] | null
          improvement_plan: Json | null
          metrics: Json
          new_tools_suggested: string[] | null
          period: string
          report_date: string
        }
        Insert: {
          created_at?: string
          id?: string
          identified_gaps?: string[] | null
          improvement_plan?: Json | null
          metrics?: Json
          new_tools_suggested?: string[] | null
          period: string
          report_date?: string
        }
        Update: {
          created_at?: string
          id?: string
          identified_gaps?: string[] | null
          improvement_plan?: Json | null
          metrics?: Json
          new_tools_suggested?: string[] | null
          period?: string
          report_date?: string
        }
        Relationships: []
      }
      alert_logs: {
        Row: {
          alert_type: string
          created_at: string
          details: Json | null
          email_error: string | null
          email_recipients: string[] | null
          email_sent: boolean
          id: string
          message: string
          resolved: boolean
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          source: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          details?: Json | null
          email_error?: string | null
          email_recipients?: string[] | null
          email_sent?: boolean
          id?: string
          message: string
          resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          severity: string
          source: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          details?: Json | null
          email_error?: string | null
          email_recipients?: string[] | null
          email_sent?: boolean
          id?: string
          message?: string
          resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          source?: string
        }
        Relationships: []
      }
      alert_policies: {
        Row: {
          alert_type: string
          company_id: string | null
          created_at: string
          email_recipients: string[]
          enabled: boolean
          id: string
          slack_webhook_url: string | null
          updated_at: string
        }
        Insert: {
          alert_type: string
          company_id?: string | null
          created_at?: string
          email_recipients?: string[]
          enabled?: boolean
          id?: string
          slack_webhook_url?: string | null
          updated_at?: string
        }
        Update: {
          alert_type?: string
          company_id?: string | null
          created_at?: string
          email_recipients?: string[]
          enabled?: boolean
          id?: string
          slack_webhook_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "alert_policies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alert_policies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      api_fix_logs: {
        Row: {
          api_name: string
          attempted_at: string
          created_at: string
          fix_attempted: string
          fix_details: Json | null
          fix_successful: boolean
          id: string
          issue_detected: string
        }
        Insert: {
          api_name: string
          attempted_at?: string
          created_at?: string
          fix_attempted: string
          fix_details?: Json | null
          fix_successful?: boolean
          id?: string
          issue_detected: string
        }
        Update: {
          api_name?: string
          attempted_at?: string
          created_at?: string
          fix_attempted?: string
          fix_details?: Json | null
          fix_successful?: boolean
          id?: string
          issue_detected?: string
        }
        Relationships: []
      }
      api_health_logs: {
        Row: {
          api_name: string
          checked_at: string
          created_at: string
          endpoint: string
          error_message: string | null
          id: string
          metadata: Json | null
          response_time_ms: number | null
          status: string
        }
        Insert: {
          api_name: string
          checked_at?: string
          created_at?: string
          endpoint: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          response_time_ms?: number | null
          status: string
        }
        Update: {
          api_name?: string
          checked_at?: string
          created_at?: string
          endpoint?: string
          error_message?: string | null
          id?: string
          metadata?: Json | null
          response_time_ms?: number | null
          status?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          company_id: string
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          ip_address: string | null
          new_data: Json | null
          old_data: Json | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          company_id: string
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          company_id?: string
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_patterns: {
        Row: {
          avg_duration_seconds: number | null
          code: string
          created_at: string | null
          description: string | null
          execution_command: string
          expected_duration_seconds: number | null
          failure_count: number | null
          id: string
          is_active: boolean | null
          last_used: string | null
          metadata: Json | null
          optimization_suggestions: string[] | null
          pattern_name: string
          pattern_type: string
          success_count: number | null
          success_rate: number | null
          tags: string[] | null
          trigger_condition: string | null
          updated_at: string | null
          usage_count: number | null
        }
        Insert: {
          avg_duration_seconds?: number | null
          code: string
          created_at?: string | null
          description?: string | null
          execution_command: string
          expected_duration_seconds?: number | null
          failure_count?: number | null
          id?: string
          is_active?: boolean | null
          last_used?: string | null
          metadata?: Json | null
          optimization_suggestions?: string[] | null
          pattern_name: string
          pattern_type: string
          success_count?: number | null
          success_rate?: number | null
          tags?: string[] | null
          trigger_condition?: string | null
          updated_at?: string | null
          usage_count?: number | null
        }
        Update: {
          avg_duration_seconds?: number | null
          code?: string
          created_at?: string | null
          description?: string | null
          execution_command?: string
          expected_duration_seconds?: number | null
          failure_count?: number | null
          id?: string
          is_active?: boolean | null
          last_used?: string | null
          metadata?: Json | null
          optimization_suggestions?: string[] | null
          pattern_name?: string
          pattern_type?: string
          success_count?: number | null
          success_rate?: number | null
          tags?: string[] | null
          trigger_condition?: string | null
          updated_at?: string | null
          usage_count?: number | null
        }
        Relationships: []
      }
      best_practices: {
        Row: {
          category: string
          created_at: string
          do_this: string
          dont_this: string
          example_code: string | null
          id: string
          pattern_name: string | null
          reasoning: string | null
          tags: string[]
          title: string
          updated_at: string
          usage_count: number
        }
        Insert: {
          category: string
          created_at?: string
          do_this: string
          dont_this: string
          example_code?: string | null
          id?: string
          pattern_name?: string | null
          reasoning?: string | null
          tags?: string[]
          title: string
          updated_at?: string
          usage_count?: number
        }
        Update: {
          category?: string
          created_at?: string
          do_this?: string
          dont_this?: string
          example_code?: string | null
          id?: string
          pattern_name?: string | null
          reasoning?: string | null
          tags?: string[]
          title?: string
          updated_at?: string
          usage_count?: number
        }
        Relationships: []
      }
      bookings: {
        Row: {
          archived: boolean | null
          arrival_time: string | null
          assignment_type: string | null
          company_id: string
          cost_center_id: string | null
          created_at: string | null
          customer_id: string | null
          driver_id: string | null
          dropoff_address: string
          flight_number: string | null
          id: string
          internal_notes: string | null
          is_airport_pickup: boolean | null
          is_offer: boolean | null
          is_partner_booking: boolean | null
          is_train_station_pickup: boolean | null
          luggage: number | null
          meet_and_greet: boolean | null
          name_sign: string | null
          net_amount: number | null
          offer_date: string | null
          offer_status: Database["public"]["Enums"]["offer_status"] | null
          partner_id: string | null
          partner_provision_manual: number | null
          passengers: number | null
          payment_method: string | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          pickup_address: string
          pickup_time: string
          price: number | null
          price_partner_hidden: boolean | null
          special_requests: string | null
          status: Database["public"]["Enums"]["booking_status"] | null
          terminal: string | null
          train_number: string | null
          updated_at: string | null
          valid_until: string | null
          vat_amount: number | null
          vat_rate: number | null
          vehicle_id: string | null
          vehicle_type: string | null
          wait_time: number | null
        }
        Insert: {
          archived?: boolean | null
          arrival_time?: string | null
          assignment_type?: string | null
          company_id: string
          cost_center_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          driver_id?: string | null
          dropoff_address: string
          flight_number?: string | null
          id?: string
          internal_notes?: string | null
          is_airport_pickup?: boolean | null
          is_offer?: boolean | null
          is_partner_booking?: boolean | null
          is_train_station_pickup?: boolean | null
          luggage?: number | null
          meet_and_greet?: boolean | null
          name_sign?: string | null
          net_amount?: number | null
          offer_date?: string | null
          offer_status?: Database["public"]["Enums"]["offer_status"] | null
          partner_id?: string | null
          partner_provision_manual?: number | null
          passengers?: number | null
          payment_method?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          pickup_address: string
          pickup_time: string
          price?: number | null
          price_partner_hidden?: boolean | null
          special_requests?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          terminal?: string | null
          train_number?: string | null
          updated_at?: string | null
          valid_until?: string | null
          vat_amount?: number | null
          vat_rate?: number | null
          vehicle_id?: string | null
          vehicle_type?: string | null
          wait_time?: number | null
        }
        Update: {
          archived?: boolean | null
          arrival_time?: string | null
          assignment_type?: string | null
          company_id?: string
          cost_center_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          driver_id?: string | null
          dropoff_address?: string
          flight_number?: string | null
          id?: string
          internal_notes?: string | null
          is_airport_pickup?: boolean | null
          is_offer?: boolean | null
          is_partner_booking?: boolean | null
          is_train_station_pickup?: boolean | null
          luggage?: number | null
          meet_and_greet?: boolean | null
          name_sign?: string | null
          net_amount?: number | null
          offer_date?: string | null
          offer_status?: Database["public"]["Enums"]["offer_status"] | null
          partner_id?: string | null
          partner_provision_manual?: number | null
          passengers?: number | null
          payment_method?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          pickup_address?: string
          pickup_time?: string
          price?: number | null
          price_partner_hidden?: boolean | null
          special_requests?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          terminal?: string | null
          train_number?: string | null
          updated_at?: string | null
          valid_until?: string | null
          vat_amount?: number | null
          vat_rate?: number | null
          vehicle_id?: string | null
          vehicle_type?: string | null
          wait_time?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies_public_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_cost_center_id_fkey"
            columns: ["cost_center_id"]
            isOneToOne: false
            referencedRelation: "cost_centers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      calls: {
        Row: {
          call_type: string
          caller_id: string
          company_id: string
          created_at: string | null
          duration_seconds: number | null
          ended_at: string | null
          id: string
          receiver_id: string
          started_at: string | null
          status: string | null
        }
        Insert: {
          call_type: string
          caller_id: string
          company_id: string
          created_at?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          receiver_id: string
          started_at?: string | null
          status?: string | null
        }
        Update: {
          call_type?: string
          caller_id?: string
          company_id?: string
          created_at?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          receiver_id?: string
          started_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calls_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calls_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_consent: {
        Row: {
          company_id: string
          confirmation_email_sent: boolean
          confirmation_email_sent_at: string | null
          confirmation_token: string | null
          confirmation_token_expires_at: string | null
          confirmed_at: string | null
          consent_given: boolean
          consent_given_at: string | null
          consent_method: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          opt_out: boolean
          opt_out_at: string | null
          opt_out_reason: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          confirmation_email_sent?: boolean
          confirmation_email_sent_at?: string | null
          confirmation_token?: string | null
          confirmation_token_expires_at?: string | null
          confirmed_at?: string | null
          consent_given?: boolean
          consent_given_at?: string | null
          consent_method?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          opt_out?: boolean
          opt_out_at?: string | null
          opt_out_reason?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          confirmation_email_sent?: boolean
          confirmation_email_sent_at?: string | null
          confirmation_token?: string | null
          confirmation_token_expires_at?: string | null
          confirmed_at?: string | null
          consent_given?: boolean
          consent_given_at?: string | null
          consent_method?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          opt_out?: boolean
          opt_out_at?: string | null
          opt_out_reason?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_consent_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_consent_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_conversations: {
        Row: {
          archived: boolean | null
          company_id: string
          created_at: string | null
          created_by: string
          id: string
          is_group: boolean | null
          name: string | null
          updated_at: string | null
        }
        Insert: {
          archived?: boolean | null
          company_id: string
          created_at?: string | null
          created_by: string
          id?: string
          is_group?: boolean | null
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          archived?: boolean | null
          company_id?: string
          created_at?: string | null
          created_by?: string
          id?: string
          is_group?: boolean | null
          name?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_conversations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_conversations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          conversation_id: string
          created_at: string | null
          edited_at: string | null
          file_url: string | null
          id: string
          is_deleted: boolean | null
          message_text: string | null
          message_type: string | null
          sender_id: string
        }
        Insert: {
          conversation_id: string
          created_at?: string | null
          edited_at?: string | null
          file_url?: string | null
          id?: string
          is_deleted?: boolean | null
          message_text?: string | null
          message_type?: string | null
          sender_id: string
        }
        Update: {
          conversation_id?: string
          created_at?: string | null
          edited_at?: string | null
          file_url?: string | null
          id?: string
          is_deleted?: boolean | null
          message_text?: string | null
          message_type?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_participants: {
        Row: {
          conversation_id: string
          id: string
          joined_at: string | null
          last_read_at: string | null
          user_id: string
        }
        Insert: {
          conversation_id: string
          id?: string
          joined_at?: string | null
          last_read_at?: string | null
          user_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          joined_at?: string | null
          last_read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_chat_participants_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      code_snippets: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          language: string
          last_used: string | null
          metadata: Json | null
          pattern_name: string
          success_rate: number | null
          tags: string[]
          updated_at: string
          usage_count: number
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          language?: string
          last_used?: string | null
          metadata?: Json | null
          pattern_name: string
          success_rate?: number | null
          tags?: string[]
          updated_at?: string
          usage_count?: number
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          language?: string
          last_used?: string | null
          metadata?: Json | null
          pattern_name?: string
          success_rate?: number | null
          tags?: string[]
          updated_at?: string
          usage_count?: number
        }
        Relationships: []
      }
      code_validation_logs: {
        Row: {
          change_type: string
          created_at: string | null
          file_path: string
          id: string
          is_valid: boolean | null
          validated_at: string
          validation_result: Json
          violations_count: number | null
        }
        Insert: {
          change_type: string
          created_at?: string | null
          file_path: string
          id?: string
          is_valid?: boolean | null
          validated_at?: string
          validation_result?: Json
          violations_count?: number | null
        }
        Update: {
          change_type?: string
          created_at?: string | null
          file_path?: string
          id?: string
          is_valid?: boolean | null
          validated_at?: string
          validation_result?: Json
          violations_count?: number | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          account_holder: string | null
          account_type: string | null
          address: string | null
          bank_name: string | null
          bic: string | null
          billing_status: string | null
          business_hours: Json | null
          business_registration_expiry: string | null
          business_type: string | null
          city: string | null
          commercial_register_number: string | null
          company_slug: string
          company_status: string | null
          country_code: string | null
          created_at: string | null
          custom_agb_text: string | null
          custom_datenschutz_text: string | null
          custom_impressum_text: string | null
          default_vat_rate: number | null
          discount_percentage: number | null
          discount_term_days: number | null
          email: string | null
          email_signature: string | null
          iban: string | null
          id: string
          invoice_prefix: string | null
          invoice_start_number: number | null
          is_kleinunternehmer: boolean | null
          landingpage_description: string | null
          landingpage_enabled: boolean | null
          landingpage_hero_text: string | null
          landingpage_title: string | null
          last_billing_check: string | null
          latitude: number | null
          letterhead_url: string | null
          liability_insurance_expiry: string | null
          logo_url: string | null
          longitude: number | null
          min_booking_advance_minutes: number | null
          monthly_revenue: number | null
          name: string
          notification_email_bookings: boolean | null
          notification_email_messages: boolean | null
          notification_push: boolean | null
          notification_sms: boolean | null
          payment_methods: Json | null
          payment_term_days: number | null
          pbefg_permit_expiry: string | null
          pbefg_permit_number: string | null
          phone: string | null
          phone_prefix: string | null
          postal_code: string | null
          primary_color: string | null
          privacy_analytics: boolean | null
          privacy_data_processing: boolean | null
          privacy_marketing: boolean | null
          profile_image_url: string | null
          quote_prefix: string | null
          quote_start_number: number | null
          quote_validity_days: number | null
          reminder_before_due_days: number | null
          representative_first_name: string | null
          representative_last_name: string | null
          representative_salutation:
            | Database["public"]["Enums"]["salutation"]
            | null
          representative_title: string | null
          street: string | null
          street_number: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_cancel_at_period_end: boolean | null
          subscription_current_period_end: string | null
          subscription_product_id: string | null
          subscription_status: string | null
          tax_id: string
          timezone: string | null
          total_bookings: number | null
          total_drivers: number | null
          total_vehicles: number | null
          trial_ends_at: string | null
          updated_at: string | null
          widget_button_text: string | null
          widget_enabled: boolean | null
          widget_show_phone: boolean | null
          widget_size: string | null
          zip_code: string | null
        }
        Insert: {
          account_holder?: string | null
          account_type?: string | null
          address?: string | null
          bank_name?: string | null
          bic?: string | null
          billing_status?: string | null
          business_hours?: Json | null
          business_registration_expiry?: string | null
          business_type?: string | null
          city?: string | null
          commercial_register_number?: string | null
          company_slug: string
          company_status?: string | null
          country_code?: string | null
          created_at?: string | null
          custom_agb_text?: string | null
          custom_datenschutz_text?: string | null
          custom_impressum_text?: string | null
          default_vat_rate?: number | null
          discount_percentage?: number | null
          discount_term_days?: number | null
          email?: string | null
          email_signature?: string | null
          iban?: string | null
          id?: string
          invoice_prefix?: string | null
          invoice_start_number?: number | null
          is_kleinunternehmer?: boolean | null
          landingpage_description?: string | null
          landingpage_enabled?: boolean | null
          landingpage_hero_text?: string | null
          landingpage_title?: string | null
          last_billing_check?: string | null
          latitude?: number | null
          letterhead_url?: string | null
          liability_insurance_expiry?: string | null
          logo_url?: string | null
          longitude?: number | null
          min_booking_advance_minutes?: number | null
          monthly_revenue?: number | null
          name: string
          notification_email_bookings?: boolean | null
          notification_email_messages?: boolean | null
          notification_push?: boolean | null
          notification_sms?: boolean | null
          payment_methods?: Json | null
          payment_term_days?: number | null
          pbefg_permit_expiry?: string | null
          pbefg_permit_number?: string | null
          phone?: string | null
          phone_prefix?: string | null
          postal_code?: string | null
          primary_color?: string | null
          privacy_analytics?: boolean | null
          privacy_data_processing?: boolean | null
          privacy_marketing?: boolean | null
          profile_image_url?: string | null
          quote_prefix?: string | null
          quote_start_number?: number | null
          quote_validity_days?: number | null
          reminder_before_due_days?: number | null
          representative_first_name?: string | null
          representative_last_name?: string | null
          representative_salutation?:
            | Database["public"]["Enums"]["salutation"]
            | null
          representative_title?: string | null
          street?: string | null
          street_number?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_cancel_at_period_end?: boolean | null
          subscription_current_period_end?: string | null
          subscription_product_id?: string | null
          subscription_status?: string | null
          tax_id: string
          timezone?: string | null
          total_bookings?: number | null
          total_drivers?: number | null
          total_vehicles?: number | null
          trial_ends_at?: string | null
          updated_at?: string | null
          widget_button_text?: string | null
          widget_enabled?: boolean | null
          widget_show_phone?: boolean | null
          widget_size?: string | null
          zip_code?: string | null
        }
        Update: {
          account_holder?: string | null
          account_type?: string | null
          address?: string | null
          bank_name?: string | null
          bic?: string | null
          billing_status?: string | null
          business_hours?: Json | null
          business_registration_expiry?: string | null
          business_type?: string | null
          city?: string | null
          commercial_register_number?: string | null
          company_slug?: string
          company_status?: string | null
          country_code?: string | null
          created_at?: string | null
          custom_agb_text?: string | null
          custom_datenschutz_text?: string | null
          custom_impressum_text?: string | null
          default_vat_rate?: number | null
          discount_percentage?: number | null
          discount_term_days?: number | null
          email?: string | null
          email_signature?: string | null
          iban?: string | null
          id?: string
          invoice_prefix?: string | null
          invoice_start_number?: number | null
          is_kleinunternehmer?: boolean | null
          landingpage_description?: string | null
          landingpage_enabled?: boolean | null
          landingpage_hero_text?: string | null
          landingpage_title?: string | null
          last_billing_check?: string | null
          latitude?: number | null
          letterhead_url?: string | null
          liability_insurance_expiry?: string | null
          logo_url?: string | null
          longitude?: number | null
          min_booking_advance_minutes?: number | null
          monthly_revenue?: number | null
          name?: string
          notification_email_bookings?: boolean | null
          notification_email_messages?: boolean | null
          notification_push?: boolean | null
          notification_sms?: boolean | null
          payment_methods?: Json | null
          payment_term_days?: number | null
          pbefg_permit_expiry?: string | null
          pbefg_permit_number?: string | null
          phone?: string | null
          phone_prefix?: string | null
          postal_code?: string | null
          primary_color?: string | null
          privacy_analytics?: boolean | null
          privacy_data_processing?: boolean | null
          privacy_marketing?: boolean | null
          profile_image_url?: string | null
          quote_prefix?: string | null
          quote_start_number?: number | null
          quote_validity_days?: number | null
          reminder_before_due_days?: number | null
          representative_first_name?: string | null
          representative_last_name?: string | null
          representative_salutation?:
            | Database["public"]["Enums"]["salutation"]
            | null
          representative_title?: string | null
          street?: string | null
          street_number?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_cancel_at_period_end?: boolean | null
          subscription_current_period_end?: string | null
          subscription_product_id?: string | null
          subscription_status?: string | null
          tax_id?: string
          timezone?: string | null
          total_bookings?: number | null
          total_drivers?: number | null
          total_vehicles?: number | null
          trial_ends_at?: string | null
          updated_at?: string | null
          widget_button_text?: string | null
          widget_enabled?: boolean | null
          widget_show_phone?: boolean | null
          widget_size?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      component_classification: {
        Row: {
          category: string
          classified_at: string | null
          classified_by: string | null
          complexity: string | null
          deprecated: boolean | null
          file_path: string
          id: string
          migration_priority: number | null
          reasoning: string | null
        }
        Insert: {
          category: string
          classified_at?: string | null
          classified_by?: string | null
          complexity?: string | null
          deprecated?: boolean | null
          file_path: string
          id?: string
          migration_priority?: number | null
          reasoning?: string | null
        }
        Update: {
          category?: string
          classified_at?: string | null
          classified_by?: string | null
          complexity?: string | null
          deprecated?: boolean | null
          file_path?: string
          id?: string
          migration_priority?: number | null
          reasoning?: string | null
        }
        Relationships: []
      }
      component_registry: {
        Row: {
          component_name: string
          created_at: string
          dependencies: string[] | null
          description: string | null
          file_path: string
          id: string
          last_verified: string
          props_schema: Json | null
          tags: string[] | null
          verification_status: string | null
        }
        Insert: {
          component_name: string
          created_at?: string
          dependencies?: string[] | null
          description?: string | null
          file_path: string
          id?: string
          last_verified?: string
          props_schema?: Json | null
          tags?: string[] | null
          verification_status?: string | null
        }
        Update: {
          component_name?: string
          created_at?: string
          dependencies?: string[] | null
          description?: string | null
          file_path?: string
          id?: string
          last_verified?: string
          props_schema?: Json | null
          tags?: string[] | null
          verification_status?: string | null
        }
        Relationships: []
      }
      cookie_consents: {
        Row: {
          analytics: boolean
          consented_at: string
          functional: boolean
          id: string
          ip_address: unknown
          necessary: boolean
          updated_at: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          analytics?: boolean
          consented_at?: string
          functional?: boolean
          id?: string
          ip_address?: unknown
          necessary?: boolean
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          analytics?: boolean
          consented_at?: string
          functional?: boolean
          id?: string
          ip_address?: unknown
          necessary?: boolean
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      cost_centers: {
        Row: {
          active: boolean | null
          company_id: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          company_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          company_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cost_centers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cost_centers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          archived: boolean | null
          billing_address: string | null
          billing_city: string | null
          billing_postal_code: string | null
          billing_street: string | null
          billing_street_number: string | null
          city: string | null
          company_id: string
          company_name: string | null
          created_at: string | null
          credit_limit: number | null
          customer_type: string | null
          discount_percentage: number | null
          email: string | null
          first_name: string
          has_portal_access: boolean | null
          id: string
          is_manually_created: boolean | null
          last_name: string
          notes: string | null
          outstanding_balance: number | null
          payment_term_days: number | null
          phone: string | null
          postal_code: string | null
          salutation: Database["public"]["Enums"]["salutation"] | null
          street: string | null
          street_number: string | null
          tax_id: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          archived?: boolean | null
          billing_address?: string | null
          billing_city?: string | null
          billing_postal_code?: string | null
          billing_street?: string | null
          billing_street_number?: string | null
          city?: string | null
          company_id: string
          company_name?: string | null
          created_at?: string | null
          credit_limit?: number | null
          customer_type?: string | null
          discount_percentage?: number | null
          email?: string | null
          first_name: string
          has_portal_access?: boolean | null
          id?: string
          is_manually_created?: boolean | null
          last_name: string
          notes?: string | null
          outstanding_balance?: number | null
          payment_term_days?: number | null
          phone?: string | null
          postal_code?: string | null
          salutation?: Database["public"]["Enums"]["salutation"] | null
          street?: string | null
          street_number?: string | null
          tax_id?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          archived?: boolean | null
          billing_address?: string | null
          billing_city?: string | null
          billing_postal_code?: string | null
          billing_street?: string | null
          billing_street_number?: string | null
          city?: string | null
          company_id?: string
          company_name?: string | null
          created_at?: string | null
          credit_limit?: number | null
          customer_type?: string | null
          discount_percentage?: number | null
          email?: string | null
          first_name?: string
          has_portal_access?: boolean | null
          id?: string
          is_manually_created?: boolean | null
          last_name?: string
          notes?: string | null
          outstanding_balance?: number | null
          payment_term_days?: number | null
          phone?: string | null
          postal_code?: string | null
          salutation?: Database["public"]["Enums"]["salutation"] | null
          street?: string | null
          street_number?: string | null
          tax_id?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      deletion_requests: {
        Row: {
          company_id: string
          created_at: string
          customer_id: string
          id: string
          notes: string | null
          processed_at: string | null
          processed_by: string | null
          reason: string | null
          requested_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          customer_id: string
          id?: string
          notes?: string | null
          processed_at?: string | null
          processed_by?: string | null
          reason?: string | null
          requested_at?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          customer_id?: string
          id?: string
          notes?: string | null
          processed_at?: string | null
          processed_by?: string | null
          reason?: string | null
          requested_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deletion_requests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deletion_requests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies_public_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deletion_requests_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      document_expiry_reminders: {
        Row: {
          company_id: string
          created_at: string | null
          document_id: string
          entity_id: string
          expiry_date: string
          id: string
          reminder_days_before: number
          reminder_document_type: string
          reminder_entity_type: string
          reminder_sent: boolean | null
          reminder_sent_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          document_id: string
          entity_id: string
          expiry_date: string
          id?: string
          reminder_days_before?: number
          reminder_document_type: string
          reminder_entity_type: string
          reminder_sent?: boolean | null
          reminder_sent_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          document_id?: string
          entity_id?: string
          expiry_date?: string
          id?: string
          reminder_days_before?: number
          reminder_document_type?: string
          reminder_entity_type?: string
          reminder_sent?: boolean | null
          reminder_sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_expiry_reminders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_expiry_reminders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies_public_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_expiry_reminders_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "archived_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_expiry_reminders_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_templates: {
        Row: {
          category: string
          company_id: string
          content: string
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          subject: string | null
          template_type: string
          updated_at: string | null
        }
        Insert: {
          category: string
          company_id: string
          content: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          subject?: string | null
          template_type: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          company_id?: string
          content?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          subject?: string | null
          template_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_templates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_templates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          archived: boolean | null
          archived_at: string | null
          company_id: string
          created_at: string | null
          document_type: Database["public"]["Enums"]["document_type"]
          entity_id: string
          entity_type: Database["public"]["Enums"]["document_entity_type"]
          expiry_date: string | null
          file_url: string
          id: string
          name: string
          reminder_sent: boolean | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          archived?: boolean | null
          archived_at?: string | null
          company_id: string
          created_at?: string | null
          document_type: Database["public"]["Enums"]["document_type"]
          entity_id: string
          entity_type: Database["public"]["Enums"]["document_entity_type"]
          expiry_date?: string | null
          file_url: string
          id?: string
          name: string
          reminder_sent?: boolean | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          archived?: boolean | null
          archived_at?: string | null
          company_id?: string
          created_at?: string | null
          document_type?: Database["public"]["Enums"]["document_type"]
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["document_entity_type"]
          expiry_date?: string | null
          file_url?: string
          id?: string
          name?: string
          reminder_sent?: boolean | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          address: string | null
          archived: boolean | null
          city: string | null
          company_id: string
          created_at: string | null
          email: string | null
          first_name: string
          id: string
          last_name: string
          license_classes: string[] | null
          license_expiry_date: string | null
          license_number: string | null
          medical_certificate_expiry: string | null
          notes: string | null
          p_schein_expiry_date: string | null
          p_schein_issue_date: string | null
          p_schein_number: string | null
          phone: string | null
          police_clearance_expiry: string | null
          postal_code: string | null
          profile_image_url: string | null
          salutation: Database["public"]["Enums"]["salutation"] | null
          shift_status: Database["public"]["Enums"]["shift_status"] | null
          street: string | null
          street_number: string | null
          title: string | null
          total_rides: number | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          archived?: boolean | null
          city?: string | null
          company_id: string
          created_at?: string | null
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          license_classes?: string[] | null
          license_expiry_date?: string | null
          license_number?: string | null
          medical_certificate_expiry?: string | null
          notes?: string | null
          p_schein_expiry_date?: string | null
          p_schein_issue_date?: string | null
          p_schein_number?: string | null
          phone?: string | null
          police_clearance_expiry?: string | null
          postal_code?: string | null
          profile_image_url?: string | null
          salutation?: Database["public"]["Enums"]["salutation"] | null
          shift_status?: Database["public"]["Enums"]["shift_status"] | null
          street?: string | null
          street_number?: string | null
          title?: string | null
          total_rides?: number | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          archived?: boolean | null
          city?: string | null
          company_id?: string
          created_at?: string | null
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          license_classes?: string[] | null
          license_expiry_date?: string | null
          license_number?: string | null
          medical_certificate_expiry?: string | null
          notes?: string | null
          p_schein_expiry_date?: string | null
          p_schein_issue_date?: string | null
          p_schein_number?: string | null
          phone?: string | null
          police_clearance_expiry?: string | null
          postal_code?: string | null
          profile_image_url?: string | null
          salutation?: Database["public"]["Enums"]["salutation"] | null
          shift_status?: Database["public"]["Enums"]["shift_status"] | null
          street?: string | null
          street_number?: string | null
          title?: string | null
          total_rides?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drivers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drivers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          body: string
          company_id: string
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          subject: string
          template_type: string
          updated_at: string | null
        }
        Insert: {
          body: string
          company_id: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          subject: string
          template_type: string
          updated_at?: string | null
        }
        Update: {
          body?: string
          company_id?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          subject?: string
          template_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_templates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_templates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      entities_queue: {
        Row: {
          created_at: string | null
          dependencies: string[] | null
          entity_type: string
          error_message: string | null
          execution_time_ms: number | null
          file_path: string | null
          generated_code: string | null
          id: string
          level: number
          name: string
          specification: Json
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dependencies?: string[] | null
          entity_type: string
          error_message?: string | null
          execution_time_ms?: number | null
          file_path?: string | null
          generated_code?: string | null
          id?: string
          level?: number
          name: string
          specification: Json
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dependencies?: string[] | null
          entity_type?: string
          error_message?: string | null
          execution_time_ms?: number | null
          file_path?: string | null
          generated_code?: string | null
          id?: string
          level?: number
          name?: string
          specification?: Json
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      error_logs: {
        Row: {
          company_id: string | null
          component_name: string | null
          context: Json | null
          count: number | null
          created_at: string | null
          device_info: Json | null
          error_category: string
          error_message: string
          error_stack: string | null
          id: string
          last_occurrence: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          user_id: string | null
        }
        Insert: {
          company_id?: string | null
          component_name?: string | null
          context?: Json | null
          count?: number | null
          created_at?: string | null
          device_info?: Json | null
          error_category: string
          error_message: string
          error_stack?: string | null
          id?: string
          last_occurrence?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity: string
          user_id?: string | null
        }
        Update: {
          company_id?: string | null
          component_name?: string | null
          context?: Json | null
          count?: number | null
          created_at?: string | null
          device_info?: Json | null
          error_category?: string
          error_message?: string
          error_stack?: string | null
          id?: string
          last_occurrence?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "error_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "error_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      execution_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          duration_ms: number | null
          entity_id: string | null
          error_message: string | null
          id: string
          status: string
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          duration_ms?: number | null
          entity_id?: string | null
          error_message?: string | null
          id?: string
          status: string
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          duration_ms?: number | null
          entity_id?: string | null
          error_message?: string | null
          id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "execution_logs_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities_queue"
            referencedColumns: ["id"]
          },
        ]
      }
      execution_runs: {
        Row: {
          completed_at: string | null
          completed_entities: number | null
          current_level: number | null
          error_message: string | null
          failed_entities: number | null
          id: string
          metadata: Json | null
          run_type: string
          skipped_entities: number | null
          started_at: string | null
          status: string
          total_entities: number | null
          total_levels: number | null
        }
        Insert: {
          completed_at?: string | null
          completed_entities?: number | null
          current_level?: number | null
          error_message?: string | null
          failed_entities?: number | null
          id?: string
          metadata?: Json | null
          run_type?: string
          skipped_entities?: number | null
          started_at?: string | null
          status?: string
          total_entities?: number | null
          total_levels?: number | null
        }
        Update: {
          completed_at?: string | null
          completed_entities?: number | null
          current_level?: number | null
          error_message?: string | null
          failed_entities?: number | null
          id?: string
          metadata?: Json | null
          run_type?: string
          skipped_entities?: number | null
          started_at?: string | null
          status?: string
          total_entities?: number | null
          total_levels?: number | null
        }
        Relationships: []
      }
      feature_flags: {
        Row: {
          created_at: string
          description: string | null
          enabled: boolean | null
          flag_name: string
          flag_slug: string
          id: string
          metadata: Json | null
          required_tier: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          enabled?: boolean | null
          flag_name: string
          flag_slug: string
          id?: string
          metadata?: Json | null
          required_tier?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          enabled?: boolean | null
          flag_name?: string
          flag_slug?: string
          id?: string
          metadata?: Json | null
          required_tier?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      filter_presets: {
        Row: {
          company_id: string
          created_at: string
          description: string | null
          entity_type: string
          filters: Json
          id: string
          is_default: boolean | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          description?: string | null
          entity_type: string
          filters: Json
          id?: string
          is_default?: boolean | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string | null
          entity_type?: string
          filters?: Json
          id?: string
          is_default?: boolean | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "filter_presets_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "filter_presets_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      gps_devices: {
        Row: {
          company_id: string
          created_at: string | null
          device_id: string
          device_type: string | null
          driver_id: string
          id: string
          imei: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          device_id: string
          device_type?: string | null
          driver_id: string
          id?: string
          imei?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          device_id?: string
          device_type?: string | null
          driver_id?: string
          id?: string
          imei?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gps_devices_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gps_devices_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies_public_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gps_devices_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      health_checks: {
        Row: {
          checked_at: string
          error_message: string | null
          id: string
          response_time_ms: number | null
          service: string
          status: string
        }
        Insert: {
          checked_at?: string
          error_message?: string | null
          id?: string
          response_time_ms?: number | null
          service: string
          status: string
        }
        Update: {
          checked_at?: string
          error_message?: string | null
          id?: string
          response_time_ms?: number | null
          service?: string
          status?: string
        }
        Relationships: []
      }
      heartbeat_history: {
        Row: {
          agent_health: Json
          all_agents_healthy: boolean
          avg_response_time_ms: number | null
          created_at: string
          critical_issues: number
          id: string
          timestamp: string
          uptime_percentage: number | null
          warnings: number
        }
        Insert: {
          agent_health: Json
          all_agents_healthy?: boolean
          avg_response_time_ms?: number | null
          created_at?: string
          critical_issues?: number
          id?: string
          timestamp?: string
          uptime_percentage?: number | null
          warnings?: number
        }
        Update: {
          agent_health?: Json
          all_agents_healthy?: boolean
          avg_response_time_ms?: number | null
          created_at?: string
          critical_issues?: number
          id?: string
          timestamp?: string
          uptime_percentage?: number | null
          warnings?: number
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          booking_id: string | null
          created_at: string
          description: string
          id: string
          invoice_id: string
          line_total: number
          position: number
          quantity: number
          unit_price: number
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          description: string
          id?: string
          invoice_id: string
          line_total: number
          position: number
          quantity?: number
          unit_price: number
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string
          line_total?: number
          position?: number
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          booking_id: string | null
          company_id: string
          created_at: string
          created_by: string | null
          currency: string
          customer_id: string
          due_date: string | null
          id: string
          internal_notes: string | null
          invoice_date: string
          invoice_number: string
          notes: string | null
          payment_date: string | null
          payment_method: string | null
          payment_reference: string | null
          payment_terms: number
          pdf_url: string | null
          status: string
          subtotal: number
          tax_amount: number
          tax_rate: number
          total_amount: number
          updated_at: string
        }
        Insert: {
          booking_id?: string | null
          company_id: string
          created_at?: string
          created_by?: string | null
          currency?: string
          customer_id: string
          due_date?: string | null
          id?: string
          internal_notes?: string | null
          invoice_date?: string
          invoice_number: string
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_terms?: number
          pdf_url?: string | null
          status?: string
          subtotal: number
          tax_amount: number
          tax_rate?: number
          total_amount: number
          updated_at?: string
        }
        Update: {
          booking_id?: string | null
          company_id?: string
          created_at?: string
          created_by?: string | null
          currency?: string
          customer_id?: string
          due_date?: string | null
          id?: string
          internal_notes?: string | null
          invoice_date?: string
          invoice_number?: string
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_terms?: number
          pdf_url?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          tax_rate?: number
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies_public_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_base: {
        Row: {
          access_count: number
          category: string
          complexity_level: number | null
          confidence_score: number
          content: Json
          created_at: string
          doc_version: string | null
          id: string
          importance_level: number | null
          is_deprecated: boolean | null
          last_accessed: string | null
          metadata: Json | null
          original_file_path: string | null
          parent_knowledge_ids: string[] | null
          related_entries: string[] | null
          related_knowledge_ids: string[] | null
          search_vector: unknown
          source: string
          source_file: string | null
          superseded_by: string | null
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          access_count?: number
          category: string
          complexity_level?: number | null
          confidence_score?: number
          content?: Json
          created_at?: string
          doc_version?: string | null
          id?: string
          importance_level?: number | null
          is_deprecated?: boolean | null
          last_accessed?: string | null
          metadata?: Json | null
          original_file_path?: string | null
          parent_knowledge_ids?: string[] | null
          related_entries?: string[] | null
          related_knowledge_ids?: string[] | null
          search_vector?: unknown
          source: string
          source_file?: string | null
          superseded_by?: string | null
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          access_count?: number
          category?: string
          complexity_level?: number | null
          confidence_score?: number
          content?: Json
          created_at?: string
          doc_version?: string | null
          id?: string
          importance_level?: number | null
          is_deprecated?: boolean | null
          last_accessed?: string | null
          metadata?: Json | null
          original_file_path?: string | null
          parent_knowledge_ids?: string[] | null
          related_entries?: string[] | null
          related_knowledge_ids?: string[] | null
          search_vector?: unknown
          source?: string
          source_file?: string | null
          superseded_by?: string | null
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_base_superseded_by_fkey"
            columns: ["superseded_by"]
            isOneToOne: false
            referencedRelation: "knowledge_base"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_validation_log: {
        Row: {
          id: string
          knowledge_id: string | null
          notes: string | null
          score: number
          validated_at: string
          validation_type: string
          validator: string
        }
        Insert: {
          id?: string
          knowledge_id?: string | null
          notes?: string | null
          score: number
          validated_at?: string
          validation_type: string
          validator?: string
        }
        Update: {
          id?: string
          knowledge_id?: string | null
          notes?: string | null
          score?: number
          validated_at?: string
          validation_type?: string
          validator?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_validation_log_knowledge_id_fkey"
            columns: ["knowledge_id"]
            isOneToOne: false
            referencedRelation: "knowledge_base"
            referencedColumns: ["id"]
          },
        ]
      }
      known_issues: {
        Row: {
          created_at: string
          description: string
          id: string
          issue_type: string
          last_occurrence: string
          occurrences: number
          prevention_checklist: string[]
          resolved: boolean
          resolved_at: string | null
          severity: string
          solution: string
          tags: string[]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          issue_type: string
          last_occurrence?: string
          occurrences?: number
          prevention_checklist?: string[]
          resolved?: boolean
          resolved_at?: string | null
          severity?: string
          solution: string
          tags?: string[]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          issue_type?: string
          last_occurrence?: string
          occurrences?: number
          prevention_checklist?: string[]
          resolved?: boolean
          resolved_at?: string | null
          severity?: string
          solution?: string
          tags?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      marketing_stats: {
        Row: {
          active: boolean
          created_at: string
          display_order: number
          icon_name: string | null
          id: string
          label: string
          section: string
          updated_at: string
          value: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          display_order?: number
          icon_name?: string | null
          id?: string
          label: string
          section: string
          updated_at?: string
          value: string
        }
        Update: {
          active?: boolean
          created_at?: string
          display_order?: number
          icon_name?: string | null
          id?: string
          label?: string
          section?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      master_logs: {
        Row: {
          agent_name: string
          created_at: string
          duration_ms: number | null
          error_message: string | null
          id: string
          metadata: Json | null
          operation: string
          plan_md: string | null
          screenshot_base64: string | null
          status: Database["public"]["Enums"]["master_log_status"]
          timestamp: string
          updated_at: string
        }
        Insert: {
          agent_name: string
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          operation: string
          plan_md?: string | null
          screenshot_base64?: string | null
          status?: Database["public"]["Enums"]["master_log_status"]
          timestamp?: string
          updated_at?: string
        }
        Update: {
          agent_name?: string
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          operation?: string
          plan_md?: string | null
          screenshot_base64?: string | null
          status?: Database["public"]["Enums"]["master_log_status"]
          timestamp?: string
          updated_at?: string
        }
        Relationships: []
      }
      migration_logs: {
        Row: {
          completed_at: string | null
          error_message: string | null
          executed_at: string | null
          id: string
          metadata: Json | null
          migration_name: string
          records_migrated: number | null
          records_skipped: number | null
          status: string
        }
        Insert: {
          completed_at?: string | null
          error_message?: string | null
          executed_at?: string | null
          id?: string
          metadata?: Json | null
          migration_name: string
          records_migrated?: number | null
          records_skipped?: number | null
          status?: string
        }
        Update: {
          completed_at?: string | null
          error_message?: string | null
          executed_at?: string | null
          id?: string
          metadata?: Json | null
          migration_name?: string
          records_migrated?: number | null
          records_skipped?: number | null
          status?: string
        }
        Relationships: []
      }
      monitoring_logs: {
        Row: {
          auto_fixable: boolean | null
          category: string
          created_at: string
          created_by: string | null
          file_path: string | null
          fixed: boolean | null
          id: string
          message: string
          metadata: Json | null
          scan_type: string
          severity: string
        }
        Insert: {
          auto_fixable?: boolean | null
          category: string
          created_at?: string
          created_by?: string | null
          file_path?: string | null
          fixed?: boolean | null
          id?: string
          message: string
          metadata?: Json | null
          scan_type: string
          severity: string
        }
        Update: {
          auto_fixable?: boolean | null
          category?: string
          created_at?: string
          created_by?: string | null
          file_path?: string | null
          fixed?: boolean | null
          id?: string
          message?: string
          metadata?: Json | null
          scan_type?: string
          severity?: string
        }
        Relationships: []
      }
      onboarding_progress: {
        Row: {
          completed_at: string | null
          completed_steps: number[] | null
          current_step: number | null
          skipped: boolean | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completed_steps?: number[] | null
          current_step?: number | null
          skipped?: boolean | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completed_steps?: number[] | null
          current_step?: number | null
          skipped?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      orchestration_logs: {
        Row: {
          autopilot_status: string
          created_at: string
          health_score: number
          id: string
          monitoring_data: Json | null
          overall_status: string
          self_healing_status: string
          task_gen_status: string
          timestamp: string
        }
        Insert: {
          autopilot_status?: string
          created_at?: string
          health_score?: number
          id?: string
          monitoring_data?: Json | null
          overall_status?: string
          self_healing_status?: string
          task_gen_status?: string
          timestamp?: string
        }
        Update: {
          autopilot_status?: string
          created_at?: string
          health_score?: number
          id?: string
          monitoring_data?: Json | null
          overall_status?: string
          self_healing_status?: string
          task_gen_status?: string
          timestamp?: string
        }
        Relationships: []
      }
      partner_connections: {
        Row: {
          archived: boolean | null
          archived_at: string | null
          company_a_id: string
          company_b_id: string
          created_at: string
          id: string
          provision_rate: number
          share_drivers: boolean
          share_vehicles: boolean
          updated_at: string
        }
        Insert: {
          archived?: boolean | null
          archived_at?: string | null
          company_a_id: string
          company_b_id: string
          created_at?: string
          id?: string
          provision_rate?: number
          share_drivers?: boolean
          share_vehicles?: boolean
          updated_at?: string
        }
        Update: {
          archived?: boolean | null
          archived_at?: string | null
          company_a_id?: string
          company_b_id?: string
          created_at?: string
          id?: string
          provision_rate?: number
          share_drivers?: boolean
          share_vehicles?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_connections_company_a_id_fkey"
            columns: ["company_a_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_connections_company_a_id_fkey"
            columns: ["company_a_id"]
            isOneToOne: false
            referencedRelation: "companies_public_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_connections_company_b_id_fkey"
            columns: ["company_b_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_connections_company_b_id_fkey"
            columns: ["company_b_id"]
            isOneToOne: false
            referencedRelation: "companies_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_requests: {
        Row: {
          created_at: string
          id: string
          message: string | null
          requesting_company_id: string
          status: string
          target_company_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          requesting_company_id: string
          status?: string
          target_company_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          requesting_company_id?: string
          status?: string
          target_company_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_requests_requesting_company_id_fkey"
            columns: ["requesting_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_requests_requesting_company_id_fkey"
            columns: ["requesting_company_id"]
            isOneToOne: false
            referencedRelation: "companies_public_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_requests_target_company_id_fkey"
            columns: ["target_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_requests_target_company_id_fkey"
            columns: ["target_company_id"]
            isOneToOne: false
            referencedRelation: "companies_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          archived: boolean | null
          company_id: string
          created_at: string | null
          email: string | null
          id: string
          name: string
          online_access_enabled: boolean | null
          phone: string | null
          provision_amount: number
          updated_at: string | null
        }
        Insert: {
          archived?: boolean | null
          company_id: string
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          online_access_enabled?: boolean | null
          phone?: string | null
          provision_amount?: number
          updated_at?: string | null
        }
        Update: {
          archived?: boolean | null
          company_id?: string
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          online_access_enabled?: boolean | null
          phone?: string | null
          provision_amount?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_reminders: {
        Row: {
          amount: number
          booking_id: string | null
          company_id: string
          created_at: string | null
          customer_id: string
          due_date: string
          id: string
          last_reminder_date: string | null
          reminder_count: number | null
          status: Database["public"]["Enums"]["payment_reminder_status"] | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          booking_id?: string | null
          company_id: string
          created_at?: string | null
          customer_id: string
          due_date: string
          id?: string
          last_reminder_date?: string | null
          reminder_count?: number | null
          status?: Database["public"]["Enums"]["payment_reminder_status"] | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string | null
          company_id?: string
          created_at?: string | null
          customer_id?: string
          due_date?: string
          id?: string
          last_reminder_date?: string | null
          reminder_count?: number | null
          status?: Database["public"]["Enums"]["payment_reminder_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_reminders_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_reminders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_reminders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies_public_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_reminders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_metrics: {
        Row: {
          company_id: string | null
          created_at: string
          id: string
          metadata: Json | null
          metric_name: string
          metric_value: number
          rating: string | null
          route: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          metric_name: string
          metric_value: number
          rating?: string | null
          route?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          metric_name?: string
          metric_value?: number
          rating?: string | null
          route?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      pricing_tiers: {
        Row: {
          ai_features_enabled: boolean | null
          created_at: string
          features: Json
          id: string
          max_drivers: number | null
          max_users: number | null
          max_vehicles: number | null
          monthly_price: number
          partner_network_enabled: boolean | null
          tier_name: string
          tier_slug: string
          updated_at: string
        }
        Insert: {
          ai_features_enabled?: boolean | null
          created_at?: string
          features?: Json
          id?: string
          max_drivers?: number | null
          max_users?: number | null
          max_vehicles?: number | null
          monthly_price: number
          partner_network_enabled?: boolean | null
          tier_name: string
          tier_slug: string
          updated_at?: string
        }
        Update: {
          ai_features_enabled?: boolean | null
          created_at?: string
          features?: Json
          id?: string
          max_drivers?: number | null
          max_users?: number | null
          max_vehicles?: number | null
          monthly_price?: number
          partner_network_enabled?: boolean | null
          tier_name?: string
          tier_slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company_id: string | null
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          profile_image_url: string | null
          salutation: Database["public"]["Enums"]["salutation"] | null
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          profile_image_url?: string | null
          salutation?: Database["public"]["Enums"]["salutation"] | null
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          profile_image_url?: string | null
          salutation?: Database["public"]["Enums"]["salutation"] | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmap_auto_check_log: {
        Row: {
          ai_decision: string | null
          check_timestamp: string | null
          checked_roadmap_tasks: string[] | null
          current_task_description: string | null
          execution_time_ms: number | null
          id: string
          opportunistic_tasks_found: string[] | null
          tasks_completed: string[] | null
        }
        Insert: {
          ai_decision?: string | null
          check_timestamp?: string | null
          checked_roadmap_tasks?: string[] | null
          current_task_description?: string | null
          execution_time_ms?: number | null
          id?: string
          opportunistic_tasks_found?: string[] | null
          tasks_completed?: string[] | null
        }
        Update: {
          ai_decision?: string | null
          check_timestamp?: string | null
          checked_roadmap_tasks?: string[] | null
          current_task_description?: string | null
          execution_time_ms?: number | null
          id?: string
          opportunistic_tasks_found?: string[] | null
          tasks_completed?: string[] | null
        }
        Relationships: []
      }
      roadmap_progress: {
        Row: {
          ai_agent_id: string | null
          created_at: string | null
          current_phase: string | null
          id: string
          notes: string | null
          progress_percent: number | null
          task_id: string | null
        }
        Insert: {
          ai_agent_id?: string | null
          created_at?: string | null
          current_phase?: string | null
          id?: string
          notes?: string | null
          progress_percent?: number | null
          task_id?: string | null
        }
        Update: {
          ai_agent_id?: string | null
          created_at?: string | null
          current_phase?: string | null
          id?: string
          notes?: string | null
          progress_percent?: number | null
          task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_progress_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "roadmap_tasks"
            referencedColumns: ["task_id"]
          },
        ]
      }
      roadmap_tasks: {
        Row: {
          actual_hours: number | null
          affected_files: string[] | null
          auto_checkable: boolean | null
          blockers: Json | null
          category: string
          completed_at: string | null
          completion_criteria: Json | null
          created_at: string | null
          dependencies: string[] | null
          description: string | null
          estimated_hours: number | null
          id: string
          priority: string
          related_pages: string[] | null
          status: string
          task_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          actual_hours?: number | null
          affected_files?: string[] | null
          auto_checkable?: boolean | null
          blockers?: Json | null
          category: string
          completed_at?: string | null
          completion_criteria?: Json | null
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          estimated_hours?: number | null
          id?: string
          priority: string
          related_pages?: string[] | null
          status?: string
          task_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          actual_hours?: number | null
          affected_files?: string[] | null
          auto_checkable?: boolean | null
          blockers?: Json | null
          category?: string
          completed_at?: string | null
          completion_criteria?: Json | null
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          estimated_hours?: number | null
          id?: string
          priority?: string
          related_pages?: string[] | null
          status?: string
          task_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      shifts: {
        Row: {
          approved_by_company: boolean | null
          archive_reason: string | null
          archived: boolean
          archived_at: string | null
          archived_by: string | null
          card_earnings: number | null
          cash_earnings: number | null
          company_id: string
          concession_number: string | null
          confirmed_by_driver: boolean | null
          created_at: string | null
          date: string
          driver_id: string
          id: string
          invoice_earnings: number | null
          km_end: number | null
          km_start: number | null
          license_plate: string | null
          locked_at: string | null
          locked_by_driver: boolean | null
          pause_end_time: string | null
          pause_start_time: string | null
          shift_end_time: string | null
          shift_start_time: string
          total_km: number | null
          updated_at: string | null
          vehicle_id: string
        }
        Insert: {
          approved_by_company?: boolean | null
          archive_reason?: string | null
          archived?: boolean
          archived_at?: string | null
          archived_by?: string | null
          card_earnings?: number | null
          cash_earnings?: number | null
          company_id: string
          concession_number?: string | null
          confirmed_by_driver?: boolean | null
          created_at?: string | null
          date: string
          driver_id: string
          id?: string
          invoice_earnings?: number | null
          km_end?: number | null
          km_start?: number | null
          license_plate?: string | null
          locked_at?: string | null
          locked_by_driver?: boolean | null
          pause_end_time?: string | null
          pause_start_time?: string | null
          shift_end_time?: string | null
          shift_start_time: string
          total_km?: number | null
          updated_at?: string | null
          vehicle_id: string
        }
        Update: {
          approved_by_company?: boolean | null
          archive_reason?: string | null
          archived?: boolean
          archived_at?: string | null
          archived_by?: string | null
          card_earnings?: number | null
          cash_earnings?: number | null
          company_id?: string
          concession_number?: string | null
          confirmed_by_driver?: boolean | null
          created_at?: string | null
          date?: string
          driver_id?: string
          id?: string
          invoice_earnings?: number | null
          km_end?: number | null
          km_start?: number | null
          license_plate?: string | null
          locked_at?: string | null
          locked_by_driver?: boolean | null
          pause_end_time?: string | null
          pause_start_time?: string | null
          shift_end_time?: string | null
          shift_start_time?: string
          total_km?: number | null
          updated_at?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shifts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shifts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies_public_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shifts_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shifts_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      special_accounts: {
        Row: {
          account_type: string
          can_access_master_dashboard: boolean | null
          can_bypass_payment: boolean | null
          can_switch_tariff: boolean | null
          created_at: string | null
          id: string
          notes: string | null
          updated_at: string | null
          user_email: string
        }
        Insert: {
          account_type: string
          can_access_master_dashboard?: boolean | null
          can_bypass_payment?: boolean | null
          can_switch_tariff?: boolean | null
          created_at?: string | null
          id?: string
          notes?: string | null
          updated_at?: string | null
          user_email: string
        }
        Update: {
          account_type?: string
          can_access_master_dashboard?: boolean | null
          can_bypass_payment?: boolean | null
          can_switch_tariff?: boolean | null
          created_at?: string | null
          id?: string
          notes?: string | null
          updated_at?: string | null
          user_email?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          auto_renew: boolean | null
          company_id: string
          created_at: string
          id: string
          pricing_tier_id: string | null
          status: string
          subscription_ends_at: string | null
          subscription_starts_at: string
          tier_name: string
          trial_ends_at: string | null
          updated_at: string
        }
        Insert: {
          auto_renew?: boolean | null
          company_id: string
          created_at?: string
          id?: string
          pricing_tier_id?: string | null
          status?: string
          subscription_ends_at?: string | null
          subscription_starts_at?: string
          tier_name: string
          trial_ends_at?: string | null
          updated_at?: string
        }
        Update: {
          auto_renew?: boolean | null
          company_id?: string
          created_at?: string
          id?: string
          pricing_tier_id?: string | null
          status?: string
          subscription_ends_at?: string | null
          subscription_starts_at?: string
          tier_name?: string
          trial_ends_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_plans_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_plans_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies_public_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_plans_pricing_tier_id_fkey"
            columns: ["pricing_tier_id"]
            isOneToOne: false
            referencedRelation: "pricing_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      system_config: {
        Row: {
          config_key: string
          config_type: string
          config_value: Json
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          updated_at: string
        }
        Insert: {
          config_key: string
          config_type: string
          config_value: Json
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          updated_at?: string
        }
        Update: {
          config_key?: string
          config_type?: string
          config_value?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      system_logs: {
        Row: {
          company_id: string | null
          context: Json | null
          created_at: string
          id: string
          level: string
          message: string
          user_id: string | null
        }
        Insert: {
          company_id?: string | null
          context?: Json | null
          created_at?: string
          id?: string
          level: string
          message: string
          user_id?: string | null
        }
        Update: {
          company_id?: string | null
          context?: Json | null
          created_at?: string
          id?: string
          level?: string
          message?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      tariff_system_v2: {
        Row: {
          created_at: string | null
          currency: string | null
          discount_yearly_percent: number | null
          display_order: number | null
          features: Json
          id: string
          is_active: boolean | null
          limit_bookings_monthly: number | null
          limit_drivers: number
          limit_users: number
          limit_vehicles: number
          marketing_cta_text: string | null
          marketing_description: string | null
          marketing_subtitle: string | null
          marketing_title: string
          price_monthly: number
          price_yearly: number
          stripe_price_id_monthly: string | null
          stripe_price_id_yearly: string | null
          stripe_product_ids: string[]
          tariff_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          discount_yearly_percent?: number | null
          display_order?: number | null
          features?: Json
          id?: string
          is_active?: boolean | null
          limit_bookings_monthly?: number | null
          limit_drivers: number
          limit_users: number
          limit_vehicles: number
          marketing_cta_text?: string | null
          marketing_description?: string | null
          marketing_subtitle?: string | null
          marketing_title: string
          price_monthly: number
          price_yearly: number
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
          stripe_product_ids: string[]
          tariff_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          discount_yearly_percent?: number | null
          display_order?: number | null
          features?: Json
          id?: string
          is_active?: boolean | null
          limit_bookings_monthly?: number | null
          limit_drivers?: number
          limit_users?: number
          limit_vehicles?: number
          marketing_cta_text?: string | null
          marketing_description?: string | null
          marketing_subtitle?: string | null
          marketing_title?: string
          price_monthly?: number
          price_yearly?: number
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
          stripe_product_ids?: string[]
          tariff_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      termination_logs: {
        Row: {
          action_type: string
          company_id: string
          created_at: string | null
          id: string
          notes: string | null
          performed_by: string
        }
        Insert: {
          action_type: string
          company_id: string
          created_at?: string | null
          id?: string
          notes?: string | null
          performed_by: string
        }
        Update: {
          action_type?: string
          company_id?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          performed_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "termination_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "termination_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      ui_atoms: {
        Row: {
          atom_name: string
          atom_type: string
          component_path: string
          created_at: string | null
          documentation: string | null
          extreme_tested: boolean | null
          id: string
          props_definition: Json
          states_definition: Json
          storybook_path: string | null
          updated_at: string | null
        }
        Insert: {
          atom_name: string
          atom_type: string
          component_path: string
          created_at?: string | null
          documentation?: string | null
          extreme_tested?: boolean | null
          id?: string
          props_definition?: Json
          states_definition?: Json
          storybook_path?: string | null
          updated_at?: string | null
        }
        Update: {
          atom_name?: string
          atom_type?: string
          component_path?: string
          created_at?: string | null
          documentation?: string | null
          extreme_tested?: boolean | null
          id?: string
          props_definition?: Json
          states_definition?: Json
          storybook_path?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicle_positions: {
        Row: {
          company_id: string
          driver_id: string | null
          heading: number | null
          id: string
          latitude: number
          longitude: number
          speed: number | null
          timestamp: string | null
          vehicle_id: string
        }
        Insert: {
          company_id: string
          driver_id?: string | null
          heading?: number | null
          id?: string
          latitude: number
          longitude: number
          speed?: number | null
          timestamp?: string | null
          vehicle_id: string
        }
        Update: {
          company_id?: string
          driver_id?: string | null
          heading?: number | null
          id?: string
          latitude?: number
          longitude?: number
          speed?: number | null
          timestamp?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_positions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_positions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies_public_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_positions_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_positions_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          archived: boolean | null
          assigned_driver_id: string | null
          brand: string | null
          company_id: string
          concession_number: string | null
          created_at: string | null
          fuel_type: string | null
          id: string
          insurance_annual_premium: number | null
          insurance_company: string | null
          insurance_end_date: string | null
          insurance_policy_number: string | null
          insurance_start_date: string | null
          insurance_type: string | null
          last_service_date: string | null
          last_service_km: number | null
          license_plate: string
          mileage: number | null
          model: string | null
          next_service_date: string | null
          profile_image_url: string | null
          registration_part_1_expiry: string | null
          rental_agreement_expiry: string | null
          rental_rate_daily: number | null
          rental_rate_monthly: number | null
          rental_rate_weekly: number | null
          seats: number | null
          service_interval_km: number | null
          status: Database["public"]["Enums"]["vehicle_status"] | null
          taxameter_calibration_expiry: string | null
          tuev_expiry_date: string | null
          updated_at: string | null
          vehicle_class: Database["public"]["Enums"]["vehicle_class"]
          vehicle_number: string | null
          vin: string | null
          year: number | null
        }
        Insert: {
          archived?: boolean | null
          assigned_driver_id?: string | null
          brand?: string | null
          company_id: string
          concession_number?: string | null
          created_at?: string | null
          fuel_type?: string | null
          id?: string
          insurance_annual_premium?: number | null
          insurance_company?: string | null
          insurance_end_date?: string | null
          insurance_policy_number?: string | null
          insurance_start_date?: string | null
          insurance_type?: string | null
          last_service_date?: string | null
          last_service_km?: number | null
          license_plate: string
          mileage?: number | null
          model?: string | null
          next_service_date?: string | null
          profile_image_url?: string | null
          registration_part_1_expiry?: string | null
          rental_agreement_expiry?: string | null
          rental_rate_daily?: number | null
          rental_rate_monthly?: number | null
          rental_rate_weekly?: number | null
          seats?: number | null
          service_interval_km?: number | null
          status?: Database["public"]["Enums"]["vehicle_status"] | null
          taxameter_calibration_expiry?: string | null
          tuev_expiry_date?: string | null
          updated_at?: string | null
          vehicle_class: Database["public"]["Enums"]["vehicle_class"]
          vehicle_number?: string | null
          vin?: string | null
          year?: number | null
        }
        Update: {
          archived?: boolean | null
          assigned_driver_id?: string | null
          brand?: string | null
          company_id?: string
          concession_number?: string | null
          created_at?: string | null
          fuel_type?: string | null
          id?: string
          insurance_annual_premium?: number | null
          insurance_company?: string | null
          insurance_end_date?: string | null
          insurance_policy_number?: string | null
          insurance_start_date?: string | null
          insurance_type?: string | null
          last_service_date?: string | null
          last_service_km?: number | null
          license_plate?: string
          mileage?: number | null
          model?: string | null
          next_service_date?: string | null
          profile_image_url?: string | null
          registration_part_1_expiry?: string | null
          rental_agreement_expiry?: string | null
          rental_rate_daily?: number | null
          rental_rate_monthly?: number | null
          rental_rate_weekly?: number | null
          seats?: number | null
          service_interval_km?: number | null
          status?: Database["public"]["Enums"]["vehicle_status"] | null
          taxameter_calibration_expiry?: string | null
          tuev_expiry_date?: string | null
          updated_at?: string | null
          vehicle_class?: Database["public"]["Enums"]["vehicle_class"]
          vehicle_number?: string | null
          vin?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_assigned_driver_id_fkey"
            columns: ["assigned_driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      archived_documents: {
        Row: {
          archived_at: string | null
          company_id: string | null
          document_type: Database["public"]["Enums"]["document_type"] | null
          entity_id: string | null
          entity_type:
            | Database["public"]["Enums"]["document_entity_type"]
            | null
          expiry_date: string | null
          id: string | null
        }
        Insert: {
          archived_at?: string | null
          company_id?: string | null
          document_type?: Database["public"]["Enums"]["document_type"] | null
          entity_id?: string | null
          entity_type?:
            | Database["public"]["Enums"]["document_entity_type"]
            | null
          expiry_date?: string | null
          id?: string | null
        }
        Update: {
          archived_at?: string | null
          company_id?: string | null
          document_type?: Database["public"]["Enums"]["document_type"] | null
          entity_id?: string | null
          entity_type?:
            | Database["public"]["Enums"]["document_entity_type"]
            | null
          expiry_date?: string | null
          id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      archived_partner_connections: {
        Row: {
          archived_at: string | null
          company_a_id: string | null
          company_b_id: string | null
          id: string | null
          provision_rate: number | null
        }
        Insert: {
          archived_at?: string | null
          company_a_id?: string | null
          company_b_id?: string | null
          id?: string | null
          provision_rate?: number | null
        }
        Update: {
          archived_at?: string | null
          company_a_id?: string | null
          company_b_id?: string | null
          id?: string | null
          provision_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_connections_company_a_id_fkey"
            columns: ["company_a_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_connections_company_a_id_fkey"
            columns: ["company_a_id"]
            isOneToOne: false
            referencedRelation: "companies_public_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_connections_company_b_id_fkey"
            columns: ["company_b_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_connections_company_b_id_fkey"
            columns: ["company_b_id"]
            isOneToOne: false
            referencedRelation: "companies_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      companies_public_info: {
        Row: {
          business_hours: Json | null
          city: string | null
          company_slug: string | null
          company_status: string | null
          email: string | null
          id: string | null
          landingpage_description: string | null
          landingpage_enabled: boolean | null
          landingpage_hero_text: string | null
          landingpage_title: string | null
          logo_url: string | null
          name: string | null
          phone: string | null
          postal_code: string | null
          primary_color: string | null
          widget_button_text: string | null
          widget_enabled: boolean | null
          widget_show_phone: boolean | null
          widget_size: string | null
        }
        Insert: {
          business_hours?: Json | null
          city?: string | null
          company_slug?: string | null
          company_status?: string | null
          email?: string | null
          id?: string | null
          landingpage_description?: string | null
          landingpage_enabled?: boolean | null
          landingpage_hero_text?: string | null
          landingpage_title?: string | null
          logo_url?: string | null
          name?: string | null
          phone?: string | null
          postal_code?: string | null
          primary_color?: string | null
          widget_button_text?: string | null
          widget_enabled?: boolean | null
          widget_show_phone?: boolean | null
          widget_size?: string | null
        }
        Update: {
          business_hours?: Json | null
          city?: string | null
          company_slug?: string | null
          company_status?: string | null
          email?: string | null
          id?: string | null
          landingpage_description?: string | null
          landingpage_enabled?: boolean | null
          landingpage_hero_text?: string | null
          landingpage_title?: string | null
          logo_url?: string | null
          name?: string | null
          phone?: string | null
          postal_code?: string | null
          primary_color?: string | null
          widget_button_text?: string | null
          widget_enabled?: boolean | null
          widget_show_phone?: boolean | null
          widget_size?: string | null
        }
        Relationships: []
      }
      slow_queries: {
        Row: {
          calls: number | null
          max_exec_time: number | null
          mean_exec_time: number | null
          query: string | null
          stddev_exec_time: number | null
        }
        Relationships: []
      }
      v_all_expiring_documents: {
        Row: {
          company_id: string | null
          document_name: string | null
          document_type: string | null
          entity_id: string | null
          entity_name: string | null
          entity_type: string | null
          expiry_date: string | null
          status: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_user_to_company_chat: {
        Args: { target_company_id: string; target_user_id: string }
        Returns: boolean
      }
      archive_shift: { Args: { shift_id_param: string }; Returns: boolean }
      can_edit_shift: {
        Args: { shift_id: string; user_id: string }
        Returns: boolean
      }
      check_knowledge_freshness: {
        Args: never
        Returns: {
          days_old: number
          entry_id: string
          last_accessed: string
          title: string
        }[]
      }
      cleanup_expired_chat_tokens: { Args: never; Returns: undefined }
      cleanup_old_alert_logs: { Args: never; Returns: undefined }
      cleanup_old_api_logs: { Args: never; Returns: undefined }
      cleanup_old_archives: { Args: never; Returns: undefined }
      cleanup_old_error_logs: { Args: never; Returns: undefined }
      cleanup_old_heartbeat_history: { Args: never; Returns: undefined }
      cleanup_old_orchestration_logs: { Args: never; Returns: undefined }
      ensure_company_chat_exists: {
        Args: { target_company_id: string }
        Returns: string
      }
      get_company_bookings: {
        Args: {
          _company_id: string
          _limit?: number
          _offset?: number
          _status?: Database["public"]["Enums"]["booking_status"]
        }
        Returns: {
          customer_name: string
          driver_name: string
          dropoff_address: string
          id: string
          is_partner_booking: boolean
          payment_status: Database["public"]["Enums"]["payment_status"]
          pickup_time: string
          price: number
          status: Database["public"]["Enums"]["booking_status"]
          vehicle_plate: string
        }[]
      }
      get_company_full_address: {
        Args: { company_row: Database["public"]["Tables"]["companies"]["Row"] }
        Returns: string
      }
      get_company_public_address: {
        Args: { company_id: string }
        Returns: string
      }
      get_dashboard_stats_for_company: {
        Args: { target_company_id: string }
        Returns: {
          avg_booking_value: number
          cancelled_bookings: number
          company_id: string
          completed_bookings: number
          confirmed_bookings: number
          last_updated: string
          paid_revenue: number
          partner_bookings: number
          partner_revenue: number
          pending_bookings: number
          total_customers: number
          total_drivers: number
          total_revenue: number
          total_vehicles: number
          unpaid_revenue: number
        }[]
      }
      get_document_expiry_dashboard: {
        Args: { target_company_id: string }
        Returns: {
          count: number
          document_type: string
          entity_ids: string[]
          entity_names: string[]
          entity_type: string
          expiry_dates: string[]
          status: string
        }[]
      }
      get_document_expiry_status: {
        Args: { expiry_date: string }
        Returns: string
      }
      get_partner_drivers: {
        Args: { user_company_id: string }
        Returns: {
          driver_id: string
          first_name: string
          last_name: string
          partner_company_id: string
          partner_company_name: string
        }[]
      }
      get_partner_vehicles: {
        Args: { user_company_id: string }
        Returns: {
          license_plate: string
          partner_company_id: string
          partner_company_name: string
          vehicle_class: Database["public"]["Enums"]["vehicle_class"]
          vehicle_id: string
        }[]
      }
      get_public_company_info: {
        Args: { company_slug_param: string }
        Returns: {
          business_hours: Json
          city: string
          company_slug: string
          email: string
          id: string
          landingpage_description: string
          landingpage_hero_text: string
          landingpage_title: string
          logo_url: string
          name: string
          phone: string
          postal_code: string
          primary_color: string
          widget_button_text: string
          widget_enabled: boolean
          widget_show_phone: boolean
          widget_size: string
        }[]
      }
      get_user_company_id: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_best_practice_usage: {
        Args: { practice_id: string }
        Returns: undefined
      }
      increment_issue_occurrence: {
        Args: { issue_id: string }
        Returns: undefined
      }
      increment_knowledge_access: {
        Args: { knowledge_id: string }
        Returns: undefined
      }
      increment_pattern_usage: {
        Args: { duration: number; pattern_id: string; success: boolean }
        Returns: undefined
      }
      increment_snippet_usage: {
        Args: { snippet_id: string }
        Returns: undefined
      }
      is_master_account: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "admin"
        | "dispatcher"
        | "driver"
        | "moderator"
        | "master"
        | "customer"
      booking_status:
        | "pending"
        | "confirmed"
        | "in_progress"
        | "completed"
        | "cancelled"
      document_entity_type: "driver" | "vehicle" | "customer"
      document_type:
        | "fuehrerschein"
        | "p_schein"
        | "fahrzeugschein"
        | "tuev"
        | "versicherung"
        | "sonstiges"
      master_log_status:
        | "pending"
        | "in_progress"
        | "success"
        | "error"
        | "rollback"
      offer_status: "pending" | "accepted" | "declined" | "expired"
      payment_reminder_status: "pending" | "sent" | "paid" | "overdue"
      payment_status: "paid" | "pending" | "overdue" | "cancelled"
      salutation: "Herr" | "Frau" | "Divers"
      shift_status: "offline" | "on_duty" | "break" | "available" | "busy"
      vehicle_class:
        | "Economy Class (1-4 Pax)"
        | "Business Class - Limousine (1-4 Pax)"
        | "Business Class - Kombi (1-4 Pax)"
        | "First Class (1-3 Pax)"
        | "Van / SUV (1-8 Pax)"
      vehicle_status: "available" | "im_einsatz" | "wartung" | "defekt"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "admin",
        "dispatcher",
        "driver",
        "moderator",
        "master",
        "customer",
      ],
      booking_status: [
        "pending",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
      ],
      document_entity_type: ["driver", "vehicle", "customer"],
      document_type: [
        "fuehrerschein",
        "p_schein",
        "fahrzeugschein",
        "tuev",
        "versicherung",
        "sonstiges",
      ],
      master_log_status: [
        "pending",
        "in_progress",
        "success",
        "error",
        "rollback",
      ],
      offer_status: ["pending", "accepted", "declined", "expired"],
      payment_reminder_status: ["pending", "sent", "paid", "overdue"],
      payment_status: ["paid", "pending", "overdue", "cancelled"],
      salutation: ["Herr", "Frau", "Divers"],
      shift_status: ["offline", "on_duty", "break", "available", "busy"],
      vehicle_class: [
        "Economy Class (1-4 Pax)",
        "Business Class - Limousine (1-4 Pax)",
        "Business Class - Kombi (1-4 Pax)",
        "First Class (1-3 Pax)",
        "Van / SUV (1-8 Pax)",
      ],
      vehicle_status: ["available", "im_einsatz", "wartung", "defekt"],
    },
  },
} as const
