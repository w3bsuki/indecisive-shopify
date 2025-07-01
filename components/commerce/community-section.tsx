'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface SocialPost {
  id: number
  username: string
  likes: string
  image: string
  platform: 'instagram' | 'tiktok'
  caption?: string
}

const samplePosts: SocialPost[] = [
  { id: 1, username: '@fashion_lover', likes: '234', image: '/api/placeholder/300/300', platform: 'instagram', caption: 'Living for this minimal vibe ✨' },
  { id: 2, username: '@streetwear_daily', likes: '512', image: '/api/placeholder/300/300', platform: 'instagram', caption: 'Indecisive but make it fashion' },
  { id: 3, username: '@minimal_style', likes: '189', image: '/api/placeholder/300/300', platform: 'instagram', caption: 'Less is more energy' },
  { id: 4, username: '@indecisive_fits', likes: '421', image: '/api/placeholder/300/300', platform: 'tiktok', caption: 'POV: You found the perfect outfit' },
  { id: 5, username: '@style_inspo', likes: '677', image: '/api/placeholder/300/300', platform: 'tiktok', caption: 'OOTD with my indecisive pieces' },
  { id: 6, username: '@urban_threads', likes: '333', image: '/api/placeholder/300/300', platform: 'tiktok', caption: 'Styling tips for indecisive people' },
]

export function CommunitySection() {
  const [activeTab, setActiveTab] = useState<'instagram' | 'tiktok'>('instagram')
  
  const filteredPosts = samplePosts.filter(post => post.platform === activeTab)

  return (
    <section className="py-8 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="px-4 sm:px-6 lg:px-8 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 font-mono tracking-wide">
            COMMUNITY STYLE
          </h2>
          <p className="text-gray-600 text-center font-mono text-sm">
            Tag us @indecisivewear #IndecisiveWear
          </p>
        </div>
        
        {/* Sharp Design System Tabs - Mobile Optimized */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'instagram' | 'tiktok')} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-2 w-80 h-12 sm:h-14 bg-white border border-gray-950 p-0">
              <TabsTrigger 
                value="instagram"
                className="h-full font-mono font-medium text-sm border-none data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-black transition-all duration-200 border-r border-black min-h-[44px] touch-manipulation"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                </svg>
                INSTAGRAM
              </TabsTrigger>
              <TabsTrigger 
                value="tiktok"
                className="h-full font-mono font-medium text-sm border-none data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-black transition-all duration-200 min-h-[44px] touch-manipulation"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.321 5.562a5.122 5.122 0 01-.443-.258 6.228 6.228 0 01-1.137-.966c-.849-.849-1.133-1.72-1.139-1.736l-.006-.016c-.126-.31-.205-.646-.228-.995h-3.314v12.737c0 .54-.06 1.074-.178 1.591a4.818 4.818 0 01-4.644 3.707c-2.653 0-4.818-2.165-4.818-4.818s2.165-4.818 4.818-4.818c.273 0 .541.023.801.067v-3.4c-.26-.02-.523-.03-.801-.03C4.486 6.827 0 11.313 0 16.632S4.486 26.438 9.805 26.438c5.319 0 9.632-4.313 9.632-9.632V9.649c1.098.69 2.381 1.123 3.563 1.123v-3.277c-.693 0-1.344-.195-1.892-.526l.213.593z"/>
                </svg>
                TIKTOK
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="instagram" className="mt-0">
            <InstagramFeed posts={filteredPosts} />
          </TabsContent>
          
          <TabsContent value="tiktok" className="mt-0">
            <TikTokFeed posts={filteredPosts} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

function InstagramFeed({ posts }: { posts: SocialPost[] }) {
  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-4 px-4 sm:px-6 lg:px-8 pb-4">
        {posts.map((post) => (
          <div 
            key={post.id} 
            className="group relative flex-shrink-0 w-48 snap-start"
          >
            {/* Clean Instagram Card - Product Card Style */}
            <div className="bg-white border border-gray-950 hover:border-gray-600 hover:shadow-md transition-all duration-200">
              {/* Image */}
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                
                {/* Instagram Icon Overlay */}
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-white border border-black flex items-center justify-center">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                    </svg>
                  </div>
                </div>

                {/* Hover View Button */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button className="bg-white border border-gray-950 px-3 py-1 font-mono text-xs font-medium hover:bg-gray-100 transition-colors">
                    VIEW POST
                  </button>
                </div>
              </div>

              {/* Card Info */}
              <div className="p-3 border-t border-gray-950">
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
                
                <div className="w-full border border-gray-950">
                  <button className="w-full bg-black text-white py-2 sm:py-1.5 px-2 font-mono text-xs font-medium hover:bg-gray-800 transition-colors min-h-[44px] sm:min-h-0 touch-manipulation">
                    VIEW ON INSTAGRAM
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

function TikTokFeed({ posts }: { posts: SocialPost[] }) {
  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-4 px-4 sm:px-6 lg:px-8 pb-4">
        {posts.map((post) => (
          <div 
            key={post.id} 
            className="group relative flex-shrink-0 w-48 snap-start"
          >
            {/* Clean TikTok Card - Product Card Style */}
            <div className="bg-white border border-gray-950 hover:border-gray-600 hover:shadow-md transition-all duration-200">
              {/* Video Container - Vertical aspect ratio for TikTok */}
              <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
                <div className="w-full h-full bg-gradient-to-b from-gray-200 to-gray-300 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                
                {/* TikTok Icon Overlay */}
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-white border border-black flex items-center justify-center">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.321 5.562a5.122 5.122 0 01-.443-.258 6.228 6.228 0 01-1.137-.966c-.849-.849-1.133-1.72-1.139-1.736l-.006-.016c-.126-.31-.205-.646-.228-.995h-3.314v12.737c0 .54-.06 1.074-.178 1.591a4.818 4.818 0 01-4.644 3.707c-2.653 0-4.818-2.165-4.818-4.818s2.165-4.818 4.818-4.818c.273 0 .541.023.801.067v-3.4c-.26-.02-.523-.03-.801-.03C4.486 6.827 0 11.313 0 16.632S4.486 26.438 9.805 26.438c5.319 0 9.632-4.313 9.632-9.632V9.649c1.098.69 2.381 1.123 3.563 1.123v-3.277c-.693 0-1.344-.195-1.892-.526l.213.593z"/>
                    </svg>
                  </div>
                </div>

                {/* Hover Play Button */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button className="bg-white border border-gray-950 px-3 py-1 font-mono text-xs font-medium hover:bg-gray-100 transition-colors flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    PLAY
                  </button>
                </div>
              </div>

              {/* Card Info */}
              <div className="p-3 border-t border-gray-950">
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
                
                <div className="w-full border border-gray-950">
                  <button className="w-full bg-black text-white py-2 sm:py-1.5 px-2 font-mono text-xs font-medium hover:bg-gray-800 transition-colors min-h-[44px] sm:min-h-0 touch-manipulation">
                    VIEW ON TIKTOK
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
  return (
    <div className="flex-shrink-0 w-48 snap-start">
      <div className="bg-white border border-dashed border-gray-950 hover:border-solid hover:border-gray-600 hover:shadow-md transition-all duration-200 group">
        {/* Image area */}
        <div className="aspect-square bg-gray-50 relative overflow-hidden flex flex-col items-center justify-center p-4">
          <svg className="w-12 h-12 text-gray-400 group-hover:text-black transition-colors mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <h3 className="font-mono font-bold text-sm text-gray-600 group-hover:text-black transition-colors text-center mb-2">
            SHARE YOUR STYLE
          </h3>
          <p className="font-mono text-xs text-gray-500 text-center leading-tight">
            Tag @indecisivewear to be featured
          </p>
        </div>
        
        {/* Card Info - matching other cards */}
        <div className="p-3 border-t border-gray-950">
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
            Get featured in our community
          </p>
          
          <div className="w-full border border-gray-950">
            <button className="w-full bg-black text-white py-2 sm:py-1.5 px-2 font-mono text-xs font-medium hover:bg-gray-800 transition-colors min-h-[44px] sm:min-h-0 touch-manipulation">
              GET FEATURED
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}