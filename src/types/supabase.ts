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
      admin_users: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          permissions: string[] | null
          role: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          permissions?: string[] | null
          role: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          permissions?: string[] | null
          role?: string
          user_id?: string | null
        }
        Relationships: []
      }
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          created_at: string | null
          id: string
          notes: string | null
          professional_id: string | null
          session_type: string
          status: string | null
          treatment_type: string
          user_id: string | null
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          created_at?: string | null
          id?: string
          notes?: string | null
          professional_id?: string | null
          session_type: string
          status?: string | null
          treatment_type: string
          user_id?: string | null
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          professional_id?: string | null
          session_type?: string
          status?: string | null
          treatment_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      cbt_content: {
        Row: {
          created_at: string | null
          examples: string | null
          id: number
          prompt_text: string
          step: number
          title: string
        }
        Insert: {
          created_at?: string | null
          examples?: string | null
          id?: number
          prompt_text: string
          step: number
          title: string
        }
        Update: {
          created_at?: string | null
          examples?: string | null
          id?: number
          prompt_text?: string
          step?: number
          title?: string
        }
        Relationships: []
      }
      chats: {
        Row: {
          created_at: string | null
          id: string
          image_url: string | null
          message: string
          message_type: string | null
          professional_id: string | null
          read_at: string | null
          sender: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          message: string
          message_type?: string | null
          professional_id?: string | null
          read_at?: string | null
          sender: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          message?: string
          message_type?: string | null
          professional_id?: string | null
          read_at?: string | null
          sender?: string
          user_id?: string | null
        }
        Relationships: []
      }
      journals: {
        Row: {
          ai_summary: string | null
          content: string
          created_at: string | null
          id: string
          mood: string | null
          sentiment_score: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          ai_summary?: string | null
          content: string
          created_at?: string | null
          id?: string
          mood?: string | null
          sentiment_score?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          ai_summary?: string | null
          content?: string
          created_at?: string | null
          id?: string
          mood?: string | null
          sentiment_score?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      professionals: {
        Row: {
          admin_notes: string | null
          available_offline: boolean | null
          available_online: boolean | null
          avatar: string | null
          bio: string | null
          certifications: string[] | null
          created_at: string | null
          cv_data: Json | null
          education: string[] | null
          experience_years: number | null
          id: string
          is_active: boolean | null
          languages: string[] | null
          name: string
          price_per_session: number | null
          rating: number | null
          skills: string[] | null
          specialty: string
          treatment_type: string
          work_experience: Json[] | null
        }
        Insert: {
          admin_notes?: string | null
          available_offline?: boolean | null
          available_online?: boolean | null
          avatar?: string | null
          bio?: string | null
          certifications?: string[] | null
          created_at?: string | null
          cv_data?: Json | null
          education?: string[] | null
          experience_years?: number | null
          id?: string
          is_active?: boolean | null
          languages?: string[] | null
          name: string
          price_per_session?: number | null
          rating?: number | null
          skills?: string[] | null
          specialty: string
          treatment_type: string
          work_experience?: Json[] | null
        }
        Update: {
          admin_notes?: string | null
          available_offline?: boolean | null
          available_online?: boolean | null
          avatar?: string | null
          bio?: string | null
          certifications?: string[] | null
          created_at?: string | null
          cv_data?: Json | null
          education?: string[] | null
          experience_years?: number | null
          id?: string
          is_active?: boolean | null
          languages?: string[] | null
          name?: string
          price_per_session?: number | null
          rating?: number | null
          skills?: string[] | null
          specialty?: string
          treatment_type?: string
          work_experience?: Json[] | null
        }
        Relationships: []
      }
      screenings: {
        Row: {
          answers: Json
          condition: string | null
          created_at: string | null
          id: string
          score: number
          severity: string
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          answers: Json
          condition?: string | null
          created_at?: string | null
          id?: string
          score: number
          severity: string
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          answers?: Json
          condition?: string | null
          created_at?: string | null
          id?: string
          score?: number
          severity?: string
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      sessions: {
        Row: {
          bot_reply: string | null
          created_at: string | null
          ended_at: string | null
          id: string
          metadata: Json | null
          method: string | null
          next_step: number | null
          notes: string | null
          reflection: Json | null
          session_status: string | null
          started_at: string | null
          step: number
          user_id: string
          user_message: string | null
        }
        Insert: {
          bot_reply?: string | null
          created_at?: string | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          method?: string | null
          next_step?: number | null
          notes?: string | null
          reflection?: Json | null
          session_status?: string | null
          started_at?: string | null
          step?: number
          user_id: string
          user_message?: string | null
        }
        Update: {
          bot_reply?: string | null
          created_at?: string | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          method?: string | null
          next_step?: number | null
          notes?: string | null
          reflection?: Json | null
          session_status?: string | null
          started_at?: string | null
          step?: number
          user_id?: string
          user_message?: string | null
        }
        Relationships: []
      }
      sfb_content: {
        Row: {
          created_at: string | null
          examples: string | null
          id: string
          prompt_text: string
          step: number
          title: string
        }
        Insert: {
          created_at?: string | null
          examples?: string | null
          id?: string
          prompt_text: string
          step: number
          title: string
        }
        Update: {
          created_at?: string | null
          examples?: string | null
          id?: string
          prompt_text?: string
          step?: number
          title?: string
        }
        Relationships: []
      }
      typing_indicators: {
        Row: {
          id: string
          is_typing: boolean | null
          professional_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          is_typing?: boolean | null
          professional_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          is_typing?: boolean | null
          professional_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          age: number | null
          avatar_url: string | null
          created_at: string
          education: string | null
          email: string | null
          full_name: string | null
          id: string
          image: string | null
          name: string | null
          nickname: string | null
          token_identifier: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          created_at?: string
          education?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          image?: string | null
          name?: string | null
          nickname?: string | null
          token_identifier: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          created_at?: string
          education?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          image?: string | null
          name?: string | null
          nickname?: string | null
          token_identifier?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      yoga_vendors: {
        Row: {
          admin_notes: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          description: string | null
          id: string
          images: string[] | null
          is_active: boolean | null
          location: string | null
          name: string
          pricing: Json | null
          rating: number | null
          services: string[] | null
          website: string | null
        }
        Insert: {
          admin_notes?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          location?: string | null
          name: string
          pricing?: Json | null
          rating?: number | null
          services?: string[] | null
          website?: string | null
        }
        Update: {
          admin_notes?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          location?: string | null
          name?: string
          pricing?: Json | null
          rating?: number | null
          services?: string[] | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      application_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "approved"
        | "rejected"
        | "cancelled"
      user_role:
        | "user"
        | "wirausaha"
        | "agent"
        | "checker_agent"
        | "validator"
        | "bank_staff"
        | "insurance"
        | "collector"
        | "admin"
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
      application_status: [
        "draft",
        "submitted",
        "under_review",
        "approved",
        "rejected",
        "cancelled",
      ],
      user_role: [
        "user",
        "wirausaha",
        "agent",
        "checker_agent",
        "validator",
        "bank_staff",
        "insurance",
        "collector",
        "admin",
      ],
    },
  },
} as const
