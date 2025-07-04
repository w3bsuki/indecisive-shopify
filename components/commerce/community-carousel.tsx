'use client'

import { useTranslations } from 'next-intl'
import { Camera, Heart, Star } from 'lucide-react'

export function CommunityCarousel() {
  const t = useTranslations('community')
  
  // Demo cards that will be replaced with real customer stars
  const demoCards = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    username: '@indecisivewear',
    caption: t('tagToBeFeature'),
    likes: '∞'
  }))

  return (
    <section className="py-8 md:py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="px-4 sm:px-6 lg:px-8 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 font-mono tracking-wide">
            {t('title')}
          </h2>
          <p className="text-gray-600 text-center font-mono text-sm">
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
        
        {/* Call to action text */}
        <div className="text-center mt-8 px-4">
          <p className="font-mono text-sm text-gray-600 mb-2">
            {t('shareYourStyle')}
          </p>
          <p className="font-mono text-xs text-gray-500">
            {t('tagToBeFeature')}
          </p>
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
  }
  index: number
}) {
  // Varied styling for visual interest
  const gradients = [
    'from-pink-50 to-purple-50',
    'from-blue-50 to-cyan-50', 
    'from-yellow-50 to-orange-50',
    'from-green-50 to-emerald-50',
    'from-purple-50 to-pink-50',
    'from-indigo-50 to-blue-50',
    'from-red-50 to-pink-50',
    'from-teal-50 to-green-50'
  ]
  
  const iconColors = [
    'text-pink-600',
    'text-blue-600',
    'text-yellow-600', 
    'text-green-600',
    'text-purple-600',
    'text-indigo-600',
    'text-red-600',
    'text-teal-600'
  ]

  return (
    <div className="flex-shrink-0 w-48 mx-2">
      <div className="bg-white border border-gray-200 hover:border-black/40 hover:shadow-lg transition-all duration-300 group">
        {/* Image area - will show customer photos in future */}
        <div className={`aspect-[4/5] bg-gradient-to-br ${gradients[index % gradients.length]} relative overflow-hidden flex flex-col items-center justify-center p-4`}>
          {/* Star icon overlay - represents "stars" (customers) */}
          <div className="absolute top-3 right-3">
            <Star className={`w-5 h-5 ${iconColors[index % iconColors.length]} fill-current`} />
          </div>
          
          <div className="mb-4 relative">
            <div className="absolute inset-0 bg-black/5 blur-xl"></div>
            <Camera className={`w-10 h-10 ${iconColors[index % iconColors.length]} relative z-10 group-hover:scale-110 transition-transform`} strokeWidth={1.5} />
          </div>
          
          <h3 className="font-mono font-bold text-sm text-gray-800 text-center mb-1">
            INDECISIVE STAR
          </h3>
          <p className="font-mono text-xs text-gray-600 text-center">
            Coming Soon
          </p>
        </div>

        {/* Card Info */}
        <div className="p-3 border-t border-black/20">
          <div className="flex items-center justify-between mb-2">
            <p className="font-mono font-medium text-xs">{card.username}</p>
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3 text-gray-400" />
              <span className="font-mono text-xs font-medium text-gray-400">{card.likes}</span>
            </div>
          </div>
          
          <p className="font-mono text-xs text-gray-600 line-clamp-2">
            {card.caption}
          </p>
        </div>
      </div>
    </div>
  )
}