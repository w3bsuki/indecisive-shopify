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
    <section className="py-12 md:py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200/20 rounded-full blur-3xl" />
      
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
          <p className="text-gray-600 text-base md:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
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
        
        {/* Modern Call to action */}
        <div className="text-center mt-12 px-4">
          <div className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 rounded-2xl p-8 max-w-md mx-auto shadow-lg">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Camera className="w-6 h-6 text-purple-600" />
              <Heart className="w-5 h-5 text-pink-500 fill-current" />
              <Star className="w-6 h-6 text-yellow-500 fill-current" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-3">
              {t('shareYourStyle')}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              {t('tagToBeFeature')}
            </p>
            <div className="flex items-center justify-center gap-2 text-sm font-medium text-purple-600 bg-purple-50 px-4 py-2 rounded-full">
              <span>✨</span>
              <span>@indecisive_wear</span>
              <span>✨</span>
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
    <div className="flex-shrink-0 w-52 mx-3">
      <div className="bg-white/90 backdrop-blur-sm border-2 border-gray-200 hover:border-purple-300 rounded-2xl overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-500 group">
        {/* Image area - shows indecisive stars */}
        <div className="aspect-[4/5] relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          {/* Modern Star icon overlay */}
          <div className="absolute top-3 right-3 z-10">
            <div className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
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
            <div className={`w-full h-full bg-gradient-to-br ${gradients[index % gradients.length]} flex flex-col items-center justify-center p-6 relative`}>
              <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />
              <div className="relative z-10 text-center">
                <div className="mb-6 relative">
                  <div className="absolute inset-0 bg-black/10 blur-2xl rounded-full"></div>
                  <div className="p-4 bg-white/30 backdrop-blur-sm rounded-2xl relative">
                    <Camera className={`w-8 h-8 ${iconColors[index % iconColors.length]} group-hover:scale-110 transition-transform`} strokeWidth={2} />
                  </div>
                </div>
                
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                  <h3 className="font-bold text-sm text-gray-800 mb-1">
                    INDECISIVE STAR
                  </h3>
                  <p className="text-xs text-gray-600 font-medium">
                    Coming Soon ✨
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modern Card Info */}
        <div className="p-4 bg-gradient-to-t from-white to-gray-50">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-xs text-gray-800">{card.username}</p>
            <div className="flex items-center gap-1 bg-pink-50 px-2 py-1 rounded-full">
              <Heart className="w-3 h-3 text-pink-500 fill-current" />
              <span className="text-xs font-bold text-pink-600">{card.likes}</span>
            </div>
          </div>
          
          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
            {card.caption}
          </p>
        </div>
      </div>
    </div>
  )
}