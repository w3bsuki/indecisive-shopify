'use client'

import Image from 'next/image'
import { useInstagram } from '@/hooks/use-instagram'
import { useTranslations } from 'next-intl'

interface SocialPost {
  id: string
  username: string
  likes: string
  image: string
  platform: 'instagram' | 'tiktok'
  caption?: string
  permalink?: string
}


export function CommunitySection() {
  const { posts: instagramPosts, loading: instagramLoading } = useInstagram({ limit: 6 })
  const t = useTranslations('community')
  
  // Convert Instagram API posts to SocialPost format
  const convertedInstagramPosts: SocialPost[] = instagramPosts.map(post => ({
    id: post.id,
    username: post.username || '@indecisivewear',
    likes: post.likes_count?.toString() || '0',
    image: post.media_url,
    platform: 'instagram' as const,
    caption: post.caption,
    permalink: post.permalink
  }))

  return (
    <section className="py-8 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="px-4 sm:px-6 lg:px-8 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 font-mono tracking-wide">
            {t('title')}
          </h2>
          <p className="text-gray-600 text-center font-mono text-sm">
            {t('subtitle')}
          </p>
        </div>
        
        {/* Instagram Feed */}
        <InstagramFeed posts={convertedInstagramPosts} loading={instagramLoading} />
      </div>
    </section>
  )
}

function InstagramFeed({ posts, loading }: { posts: SocialPost[]; loading?: boolean }) {
  const t = useTranslations('community')
  if (loading) {
    return (
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 px-4 sm:px-6 lg:px-8 pb-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-48 snap-start">
              <div className="bg-white border border-gray-200 animate-pulse">
                <div className="aspect-[4/5] bg-gray-200" />
                <div className="p-3 border-t border-gray-200">
                  <div className="h-3 bg-gray-200 rounded mb-2" />
                  <div className="h-2 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-8 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-4 px-4 sm:px-6 lg:px-8 pb-4">
        {posts.map((post) => (
          <div 
            key={post.id} 
            className="group relative flex-shrink-0 w-48 snap-start"
          >
            {/* Clean Instagram Card - Product Card Style */}
            <div className="bg-white border border-gray-200 hover:border-gray-400 hover:shadow-md transition-all duration-200">
              {/* Image - Same aspect ratio as TikTok */}
              <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
                {post.image ? (
                  <Image 
                    src={post.image} 
                    alt={post.caption || 'Instagram post'} 
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 192px, 192px"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                
                {/* Instagram Icon Overlay */}
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-white border border-black flex items-center justify-center">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/>
                    </svg>
                  </div>
                </div>

                {/* Hover View Button */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button className="bg-white border border-gray-950 px-3 py-1 font-mono text-xs font-medium hover:bg-gray-100 transition-colors">
                    {t('viewPost')}
                  </button>
                </div>
              </div>

              {/* Card Info */}
              <div className="p-3 border-t border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-mono font-medium text-xs">{post.username}</p>
                  <div className="flex items-center gap-1">
                    <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="font-mono text-xs font-medium">{post.likes}</span>
                  </div>
                </div>
                
                <p className="font-mono text-xs text-gray-600 line-clamp-1 mb-2">
                  {post.caption}
                </p>
                
                <div className="w-full border border-gray-200">
                  <button 
                    onClick={() => {
                      if (post.permalink) {
                        window.open(post.permalink, '_blank', 'noopener,noreferrer')
                      } else {
                        window.open('https://instagram.com/indecisivewear', '_blank', 'noopener,noreferrer')
                      }
                    }}
                    className="w-full bg-black text-white py-2 sm:py-1.5 px-2 font-mono text-xs font-medium hover:bg-gray-800 transition-colors min-h-[44px] sm:min-h-0 touch-manipulation"
                  >
                    {t('viewOnInstagram')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Call to action card */}
        <CallToActionCard />
      </div>
    </div>
  )
}


function CallToActionCard() {
  const t = useTranslations('community')
  return (
    <div className="flex-shrink-0 w-48 snap-start">
      <div className="bg-white border border-dashed border-gray-950 hover:border-solid hover:border-gray-600 hover:shadow-md transition-all duration-200 group">
        {/* Image area - Same aspect ratio as other cards */}
        <div className="aspect-[4/5] bg-gray-50 relative overflow-hidden flex flex-col items-center justify-center p-4">
          <svg className="w-12 h-12 text-gray-400 group-hover:text-black transition-colors mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <h3 className="font-mono font-bold text-sm text-gray-600 group-hover:text-black transition-colors text-center mb-2">
            {t('shareYourStyle')}
          </h3>
          <p className="font-mono text-xs text-gray-500 text-center leading-tight">
            {t('tagToBeFeature')}
          </p>
        </div>
        
        {/* Card Info - matching other cards */}
        <div className="p-3 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="font-mono font-medium text-xs">@indecisivewear</p>
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="font-mono text-xs font-medium text-gray-400">∞</span>
            </div>
          </div>
          
          <p className="font-mono text-xs text-gray-600 line-clamp-1 mb-2">
            {t('getFeaturedInCommunity')}
          </p>
          
          <div className="w-full border border-gray-950">
            <button className="w-full bg-black text-white py-2 sm:py-1.5 px-2 font-mono text-xs font-medium hover:bg-gray-800 transition-colors min-h-[44px] sm:min-h-0 touch-manipulation">
              {t('getFeatured')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}