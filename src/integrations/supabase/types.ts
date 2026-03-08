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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      birthday_pages: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      contributions: {
        Row: {
          amount_cents: number
          birthday_year: number
          created_at: string
          id: string
          message: string | null
          recipient_id: string
          sender_id: string
          status: string | null
        }
        Insert: {
          amount_cents?: number
          birthday_year: number
          created_at?: string
          id?: string
          message?: string | null
          recipient_id: string
          sender_id: string
          status?: string | null
        }
        Update: {
          amount_cents?: number
          birthday_year?: number
          created_at?: string
          id?: string
          message?: string | null
          recipient_id?: string
          sender_id?: string
          status?: string | null
        }
        Relationships: []
      }
      global_stats: {
        Row: {
          id: number
          total_contributions_cents: number | null
          total_spins: number | null
          total_users: number | null
          total_wishes: number | null
          updated_at: string
        }
        Insert: {
          id?: number
          total_contributions_cents?: number | null
          total_spins?: number | null
          total_users?: number | null
          total_wishes?: number | null
          updated_at?: string
        }
        Update: {
          id?: number
          total_contributions_cents?: number | null
          total_spins?: number | null
          total_users?: number | null
          total_wishes?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          avatar_url: string | null
          bio: string | null
          birth_year: number | null
          birthday_day: number | null
          birthday_month: number | null
          city: string | null
          content_preference: string | null
          core_color: string | null
          country: string | null
          created_at: string
          email: string | null
          essence_photo_url: string | null
          favorite_color: string | null
          full_name: string
          hobbies: string[] | null
          id: string
          interests: string[] | null
          is_age_public: boolean | null
          is_country_public: boolean | null
          is_hobbies_public: boolean | null
          is_name_public: boolean | null
          is_receiver_active: boolean | null
          pot_target_cents: number | null
          preferred_name: string | null
          timezone: string | null
          updated_at: string
          user_type: string
          wish_prompt: string | null
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          bio?: string | null
          birth_year?: number | null
          birthday_day?: number | null
          birthday_month?: number | null
          city?: string | null
          content_preference?: string | null
          core_color?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          essence_photo_url?: string | null
          favorite_color?: string | null
          full_name?: string
          hobbies?: string[] | null
          id: string
          interests?: string[] | null
          is_age_public?: boolean | null
          is_country_public?: boolean | null
          is_hobbies_public?: boolean | null
          is_name_public?: boolean | null
          is_receiver_active?: boolean | null
          pot_target_cents?: number | null
          preferred_name?: string | null
          timezone?: string | null
          updated_at?: string
          user_type?: string
          wish_prompt?: string | null
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          bio?: string | null
          birth_year?: number | null
          birthday_day?: number | null
          birthday_month?: number | null
          city?: string | null
          content_preference?: string | null
          core_color?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          essence_photo_url?: string | null
          favorite_color?: string | null
          full_name?: string
          hobbies?: string[] | null
          id?: string
          interests?: string[] | null
          is_age_public?: boolean | null
          is_country_public?: boolean | null
          is_hobbies_public?: boolean | null
          is_name_public?: boolean | null
          is_receiver_active?: boolean | null
          pot_target_cents?: number | null
          preferred_name?: string | null
          timezone?: string | null
          updated_at?: string
          user_type?: string
          wish_prompt?: string | null
        }
        Relationships: []
      }
      spins: {
        Row: {
          birthday_year: number
          created_at: string
          id: string
          is_claimed: boolean | null
          partner_name: string | null
          prize_description: string | null
          prize_name: string | null
          spin_type: string
          user_id: string
        }
        Insert: {
          birthday_year: number
          created_at?: string
          id?: string
          is_claimed?: boolean | null
          partner_name?: string | null
          prize_description?: string | null
          prize_name?: string | null
          spin_type?: string
          user_id: string
        }
        Update: {
          birthday_year?: number
          created_at?: string
          id?: string
          is_claimed?: boolean | null
          partner_name?: string | null
          prize_description?: string | null
          prize_name?: string | null
          spin_type?: string
          user_id?: string
        }
        Relationships: []
      }
      wishes: {
        Row: {
          birthday_year: number
          created_at: string
          id: string
          image_url: string | null
          message: string | null
          recipient_id: string
          sender_id: string
          video_url: string | null
        }
        Insert: {
          birthday_year: number
          created_at?: string
          id?: string
          image_url?: string | null
          message?: string | null
          recipient_id: string
          sender_id: string
          video_url?: string | null
        }
        Update: {
          birthday_year?: number
          created_at?: string
          id?: string
          image_url?: string | null
          message?: string | null
          recipient_id?: string
          sender_id?: string
          video_url?: string | null
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
