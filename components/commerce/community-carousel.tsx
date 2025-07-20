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
    <section className="py-8 md:py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="px-4 sm:px-6 lg:px-8 mb-8 text-center">
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
          <p className="text-gray-700 text-sm md:text-base font-medium">
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
    image?: string
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
        {/* Image area - shows indecisive stars */}
        <div className="aspect-[4/5] relative overflow-hidden bg-gray-100">
          {/* Star icon overlay */}
          <div className="absolute top-3 right-3 z-10">
            <Star className="w-5 h-5 text-white drop-shadow-lg fill-current" />
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
            <div className={`w-full h-full bg-gradient-to-br ${gradients[index % gradients.length]} flex flex-col items-center justify-center p-4`}>
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
          )}
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