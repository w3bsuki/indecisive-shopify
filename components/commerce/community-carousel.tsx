'use client'

import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Camera, Heart, Star } from 'lucide-react'

export function CommunityCarousel() {
  const t = useTranslations('community')
  
  // Indecisive stars images - using encodeURIComponent for filenames with spaces
  const starImages = [
    { filename: encodeURIComponent('emotionally unavailable green star.jpg'), displayName: 'emotionally unavailable green star.jpg', username: '@indecisive_wear' },
    { filename: encodeURIComponent('emotionally unavailable star.jpg'), displayName: 'emotionally unavailable star.jpg', username: '@indecisive_wear' },
    { filename: 'hooligan.jpg', displayName: 'hooligan.jpg', username: '@indecisive_wear' },
    { filename: 'star1.jpg', displayName: 'star1.jpg', username: '@indecisive_wear' },
    { filename: encodeURIComponent('the indecisive club.jpg'), displayName: 'the indecisive club.jpg', username: '@indecisive_wear' },
    { filename: encodeURIComponent('emotionally unavailable green star.jpg'), displayName: 'emotionally unavailable green star.jpg', username: '@indecisive_wear' },
    { filename: 'hooligan.jpg', displayName: 'hooligan.jpg', username: '@indecisive_wear' },
    { filename: 'star1.jpg', displayName: 'star1.jpg', username: '@indecisive_wear' }
  ]
  
  const demoCards = starImages.map((star, i) => ({
    id: i + 1,
    username: star.username,
    caption: t('tagToBeFeature'),
    likes: Math.floor(Math.random() * 500 + 100).toString(),
    image: `/indecisive-stars/${star.filename}`
  }))

  return (
    <section className="py-12 md:py-20 bg-white border-t border-gray-200 overflow-hidden relative">
      {/* Minimal background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gray-100/50 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gray-100/50 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative">
        <div className="px-4 sm:px-6 lg:px-8 mb-12 text-center">
          <h2 className="text-4xl md:text-6xl font-handwritten text-black mb-6 transform -rotate-1 inline-block relative">
            {t('title')}
            {/* Rough underline effect */}
            <svg className="absolute -bottom-3 left-0 w-full" height="8" viewBox="0 0 300 8" preserveAspectRatio="none">
              <path 
                d="M0,4 Q75,5 150,4 T300,4" 
                stroke="currentColor" 
                strokeWidth="2" 
                fill="none"
                className="text-black"
                style={{ strokeDasharray: '0', strokeLinecap: 'round' }}
              />
            </svg>
          </h2>
          <p className="text-gray-700 text-sm md:text-base font-medium max-w-xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
        
        {/* Infinite Carousel */}
        <div className="relative">
          <div className="flex animate-marquee hover:pause">
            {/* First set of cards */}
            {demoCards.map((card, index) => (
              <StarCard 
                key={`first-${card.id}`} 
                card={card} 
                index={index}
              />
            ))}
            {/* Duplicate set for seamless loop */}
            {demoCards.map((card, index) => (
              <StarCard 
                key={`second-${card.id}`} 
                card={card} 
                index={index}
              />
            ))}
          </div>
        </div>
        
        {/* Modern 50/50 Black/White Call to action */}
        <div className="text-center mt-16 px-4">
          <div className="bg-white border-2 border-black rounded-2xl max-w-md mx-auto shadow-xl overflow-hidden">
            <div className="bg-black text-white p-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Camera className="w-6 h-6" />
                <Star className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">
                {t('shareYourStyle')}
              </h3>
            </div>
            <div className="bg-white text-black p-6">
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                {t('tagToBeFeature')}
              </p>
              <div className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-mono text-sm font-bold">
                <span>@indecisive_wear</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StarCard({ 
  card, 
  index 
}: { 
  card: { 
    id: number
    username: string
    caption: string
    likes: string
    image?: string
  }
  index: number
}) {

  return (
    <div className="flex-shrink-0 w-52 mx-3">
      <div className="bg-white border border-gray-100 hover:border-gray-300 rounded-xl overflow-hidden hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 group">
        {/* Image area - shows indecisive stars */}
        <div className="aspect-[4/5] relative overflow-hidden bg-white">
          {/* Minimal Star icon overlay */}
          <div className="absolute top-3 right-3 z-10">
            <div className="p-1.5 bg-black rounded-full shadow-md">
              <Star className="w-4 h-4 text-white fill-current" />
            </div>
          </div>
          
          {card.image ? (
            <Image
              src={card.image}
              alt={card.username}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 192px, 192px"
            />
          ) : (
            <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center p-6">
              <div className="text-center">
                <div className="mb-6">
                  <div className="p-4 bg-black rounded-xl">
                    <Camera className="w-8 h-8 text-white" strokeWidth={2} />
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <h3 className="font-mono font-bold text-sm text-black mb-1">
                    INDECISIVE STAR
                  </h3>
                  <p className="text-xs text-gray-600 font-mono">
                    Coming Soon
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Minimal Card Info */}
        <div className="p-3 bg-white border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="font-mono font-semibold text-xs text-black">{card.username}</p>
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3 text-black fill-current" />
              <span className="text-xs font-mono font-bold text-black">{card.likes}</span>
            </div>
          </div>
          
          <p className="text-xs text-gray-600 line-clamp-2 font-mono">
            {card.caption}
          </p>
        </div>
      </div>
    </div>
  )
}