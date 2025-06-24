// Supabase database types
export interface Database {
  public: {
    Tables: {
      customer_profiles: {
        Row: {
          id: string
          medusa_customer_id: string
          supabase_user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          medusa_customer_id: string
          supabase_user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          medusa_customer_id?: string
          supabase_user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          customer_id: string
          rating: number
          title: string
          content: string
          verified_purchase: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          customer_id: string
          rating: number
          title: string
          content: string
          verified_purchase?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          customer_id?: string
          rating?: number
          title?: string
          content?: string
          verified_purchase?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      review_votes: {
        Row: {
          id: string
          review_id: string
          customer_id: string
          is_helpful: boolean
          created_at: string
        }
        Insert: {
          id?: string
          review_id: string
          customer_id: string
          is_helpful: boolean
          created_at?: string
        }
        Update: {
          id?: string
          review_id?: string
          customer_id?: string
          is_helpful?: boolean
          created_at?: string
        }
      }
      social_shares: {
        Row: {
          id: string
          product_id: string
          customer_id: string | null
          platform: string
          share_url: string
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          customer_id?: string | null
          platform: string
          share_url?: string
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          customer_id?: string | null
          platform?: string
          share_url?: string
          created_at?: string
        }
      }
    }
    Views: {
      review_stats: {
        Row: {
          product_id: string
          total_reviews: number
          average_rating: number
          total_1_star: number
          total_2_star: number
          total_3_star: number
          total_4_star: number
          total_5_star: number
        }
      }
    }
    Functions: {
      get_review_with_votes: {
        Args: { review_id: string }
        Returns: {
          id: string
          product_id: string
          customer_id: string
          rating: number
          title: string
          content: string
          verified_purchase: boolean
          created_at: string
          updated_at: string
          helpful_count: number
          not_helpful_count: number
        }
      }
    }
  }
}

// Helper types
export type Review = Database['public']['Tables']['reviews']['Row']
export type NewReview = Database['public']['Tables']['reviews']['Insert']
export type ReviewVote = Database['public']['Tables']['review_votes']['Row']
export type SocialShare = Database['public']['Tables']['social_shares']['Row']
export type CustomerProfile = Database['public']['Tables']['customer_profiles']['Row']
export type ReviewStats = Database['public']['Views']['review_stats']['Row']