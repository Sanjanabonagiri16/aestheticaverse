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
