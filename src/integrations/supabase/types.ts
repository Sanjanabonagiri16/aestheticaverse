export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      caption_feedback: {
        Row: {
          caption: string
          created_at: string | null
          feedback_type: string | null
          id: string
          is_positive: boolean
          user_id: string
        }
        Insert: {
          caption: string
          created_at?: string | null
          feedback_type?: string | null
          id?: string
          is_positive: boolean
          user_id: string
        }
        Update: {
          caption?: string
          created_at?: string | null
          feedback_type?: string | null
          id?: string
          is_positive?: boolean
          user_id?: string
        }
        Relationships: []
      }
      content_moderation: {
        Row: {
          content: string
          content_type: string
          created_at: string | null
          id: string
          moderation_reason: string | null
          moderation_status: string
          reviewed_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          content_type: string
          created_at?: string | null
          id?: string
          moderation_reason?: string | null
          moderation_status?: string
          reviewed_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          content_type?: string
          created_at?: string | null
          id?: string
          moderation_reason?: string | null
          moderation_status?: string
          reviewed_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      hashtag_performance: {
        Row: {
          avg_engagement: number | null
          category: string | null
          created_at: string | null
          hashtag: string
          id: string
          last_used: string | null
          total_engagement: number | null
          usage_count: number | null
          user_id: string
        }
        Insert: {
          avg_engagement?: number | null
          category?: string | null
          created_at?: string | null
          hashtag: string
          id?: string
          last_used?: string | null
          total_engagement?: number | null
          usage_count?: number | null
          user_id: string
        }
        Update: {
          avg_engagement?: number | null
          category?: string | null
          created_at?: string | null
          hashtag?: string
          id?: string
          last_used?: string | null
          total_engagement?: number | null
          usage_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      photo_enhancement_suggestions: {
        Row: {
          applied_suggestions: Json | null
          created_at: string | null
          id: string
          image_url: string
          suggestions: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          applied_suggestions?: Json | null
          created_at?: string | null
          id?: string
          image_url: string
          suggestions: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          applied_suggestions?: Json | null
          created_at?: string | null
          id?: string
          image_url?: string
          suggestions?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      post_engagement: {
        Row: {
          caption: string
          comments: number | null
          created_at: string | null
          engagement_score: number
          id: string
          likes: number | null
          posted_at: string | null
          shares: number | null
          user_id: string
        }
        Insert: {
          caption: string
          comments?: number | null
          created_at?: string | null
          engagement_score: number
          id?: string
          likes?: number | null
          posted_at?: string | null
          shares?: number | null
          user_id: string
        }
        Update: {
          caption?: string
          comments?: number | null
          created_at?: string | null
          engagement_score?: number
          id?: string
          likes?: number | null
          posted_at?: string | null
          shares?: number | null
          user_id?: string
        }
        Relationships: []
      }
      posting_times: {
        Row: {
          day_of_week: number
          engagement_score: number
          hour_of_day: number
          id: string
          last_updated: string | null
          sample_size: number
          user_id: string
        }
        Insert: {
          day_of_week: number
          engagement_score?: number
          hour_of_day: number
          id?: string
          last_updated?: string | null
          sample_size?: number
          user_id: string
        }
        Update: {
          day_of_week?: number
          engagement_score?: number
          hour_of_day?: number
          id?: string
          last_updated?: string | null
          sample_size?: number
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string | null
          id: string
          preferred_language: string | null
          preferred_style: string | null
          preferred_tone: string | null
          theme_preferences: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          preferred_language?: string | null
          preferred_style?: string | null
          preferred_tone?: string | null
          theme_preferences?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          preferred_language?: string | null
          preferred_style?: string | null
          preferred_tone?: string | null
          theme_preferences?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      is_moderator: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "user" | "moderator" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
