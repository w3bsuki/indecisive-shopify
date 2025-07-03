/**
 * Instagram Graph API Client
 * 
 * Setup Requirements (for production):
 * 1. Convert Instagram account to Business/Creator (free)
 * 2. Create Facebook App at developers.facebook.com
 * 3. Add Instagram Graph API product to the app
 * 4. Generate access tokens with proper permissions
 * 
 * Required Environment Variables:
 * - INSTAGRAM_ACCESS_TOKEN
 * - INSTAGRAM_USER_ID
 */

export interface InstagramPost {
  id: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  media_url: string
  thumbnail_url?: string
  caption?: string
  permalink: string
  timestamp: string
  username?: string
  likes_count?: number
}

export interface InstagramApiResponse {
  data: InstagramPost[]
  paging?: {
    cursors: {
      before: string
      after: string
    }
    next?: string
  }
}

/**
 * Instagram Graph API Client
 * Handles fetching posts from Instagram Business/Creator accounts
 */
export class InstagramClient {
  private accessToken: string
  private userId: string
  private baseUrl = 'https://graph.instagram.com'

  constructor(accessToken?: string, userId?: string) {
    this.accessToken = accessToken || process.env.INSTAGRAM_ACCESS_TOKEN || ''
    this.userId = userId || process.env.INSTAGRAM_USER_ID || ''
  }

  /**
   * Fetch recent posts from Instagram
   */
  async getPosts(limit: number = 12): Promise<InstagramPost[]> {
    if (!this.accessToken || !this.userId) {
      // Instagram API not configured, returning sample posts
      return this.getSamplePosts(limit)
    }

    try {
      const fields = [
        'id',
        'media_type',
        'media_url', 
        'thumbnail_url',
        'caption',
        'permalink',
        'timestamp'
      ].join(',')

      const url = `${this.baseUrl}/${this.userId}/media?fields=${fields}&limit=${limit}&access_token=${this.accessToken}`
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`Instagram API error: ${response.status}`)
      }

      const data: InstagramApiResponse = await response.json()
      
      return data.data.map(post => ({
        ...post,
        username: '@indecisivewear',
        likes_count: Math.floor(Math.random() * 500) + 100 // Placeholder until we get insights API
      }))

    } catch (error) {
      console.error('Failed to fetch Instagram posts:', error)
      return this.getSamplePosts(limit)
    }
  }

  /**
   * Get user profile information
   */
  async getProfile(): Promise<{ username: string; media_count: number } | null> {
    if (!this.accessToken || !this.userId) {
      return { username: '@indecisivewear', media_count: 50 }
    }

    try {
      const url = `${this.baseUrl}/${this.userId}?fields=username,media_count&access_token=${this.accessToken}`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`Instagram API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to fetch Instagram profile:', error)
      return { username: '@indecisivewear', media_count: 50 }
    }
  }

  /**
   * Realistic Instagram posts for @indecisivewear brand
   * Updated with brand-specific content and aesthetics
   */
  private getSamplePosts(limit: number): InstagramPost[] {
    const samplePosts: InstagramPost[] = [
      {
        id: 'indecisive_1',
        media_type: 'IMAGE',
        media_url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&crop=center',
        caption: 'DROP 1: ХУЛИГАНКА bucket hats are here! 🧢 When you can\'t decide between black or beige... why not both? Limited edition pieces for the indecisive souls ✨ #IndecisiveWear #ХУЛИГАНКА #BucketHat #StreetStyle',
        permalink: 'https://instagram.com/p/indecisive1',
        timestamp: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
        username: '@indecisivewear',
        likes_count: 342
      },
      {
        id: 'indecisive_2', 
        media_type: 'IMAGE',
        media_url: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=400&h=400&fit=crop&crop=center',
        caption: 'Street style mood: when your outfit speaks before you do 🖤 Our minimalist approach to maximum impact. Shop the look at indecisivewear.com #StreetWear #MinimalFashion #IndecisiveStyle #OOTD',
        permalink: 'https://instagram.com/p/indecisive2',
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        username: '@indecisivewear',
        likes_count: 278
      },
      {
        id: 'indecisive_3',
        media_type: 'IMAGE', 
        media_url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=400&fit=crop&crop=center',
        caption: 'Behind the scenes: Creating pieces for those who understand that indecision is a form of rebellion 📸 Coming soon - more drops that challenge your choices #BTS #IndecisiveMoments #ComingSoon #FashionDesign',
        permalink: 'https://instagram.com/p/indecisive3',
        timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        username: '@indecisivewear',
        likes_count: 156
      },
      {
        id: 'indecisive_4',
        media_type: 'IMAGE',
        media_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center', 
        caption: 'The art of not choosing: Every piece in our collection celebrates the beauty of indecision 🌫️ Sharp lines, bold statements, endless possibilities #IndecisiveWear #MinimalDesign #Contemporary #Philosophy',
        permalink: 'https://instagram.com/p/indecisive4',
        timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        username: '@indecisivewear',
        likes_count: 234
      },
      {
        id: 'indecisive_5',
        media_type: 'IMAGE',
        media_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=400&fit=crop&crop=center',
        caption: 'Community love 💫 @sarah_styles rocking our pieces perfectly. Tag us @indecisivewear to be featured! When you wear indecision as confidence #IndecisiveWear #CommunityStyle #CustomerLove #Repost',
        permalink: 'https://instagram.com/p/indecisive5',
        timestamp: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
        username: '@indecisivewear',
        likes_count: 189
      },
      {
        id: 'indecisive_6',
        media_type: 'IMAGE',
        media_url: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&h=400&fit=crop&crop=center',
        caption: 'New season, same indecision ☀️ Summer essentials that work with every mood. Sometimes the best choice is not choosing at all 🌾 #SummerCollection #IndecisiveChoices #Essentials #NewSeason',
        permalink: 'https://instagram.com/p/indecisive6', 
        timestamp: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
        username: '@indecisivewear',
        likes_count: 267
      },
      {
        id: 'indecisive_7',
        media_type: 'IMAGE',
        media_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop&crop=center',
        caption: 'Form follows function, but what happens when you can\'t decide which function? 🖤 Our design philosophy in one frame. Clean, sharp, intentionally unresolved #DesignPhilosophy #IndecisiveWear #Architecture #Fashion',
        permalink: 'https://instagram.com/p/indecisive7',
        timestamp: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
        username: '@indecisivewear',
        likes_count: 198
      },
      {
        id: 'indecisive_8',
        media_type: 'IMAGE',
        media_url: 'https://images.unsplash.com/photo-1484755560615-676859b15fd3?w=400&h=400&fit=crop&crop=center',
        caption: 'Mood: When your wardrobe reflects your state of mind 🌙 Pieces that adapt to your indecision, not fight against it. Shop now at indecisivewear.com #MoodBoard #IndecisiveWear #NightVibes #Contemporary',
        permalink: 'https://instagram.com/p/indecisive8',
        timestamp: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
        username: '@indecisivewear',
        likes_count: 312
      }
    ]

    return samplePosts.slice(0, limit)
  }
}

// Export singleton instance
export const instagramClient = new InstagramClient()