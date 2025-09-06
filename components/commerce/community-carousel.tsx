'use client'

import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useState } from 'react'
import { Camera, Heart, Star, ExternalLink, MessageCircle, Send } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'

export function CommunityCarousel() {
  const t = useTranslations('community')
  const th = useTranslations('home')
  const ther = useTranslations('hero')
  const [selectedImage, setSelectedImage] = useState<typeof starImages[0] | null>(null)
  
  // Indecisive stars images - using encodeURIComponent for filenames with spaces
  const starImages = [
    { filename: encodeURIComponent('emotionally unavailable green star.jpg'), displayName: 'emotionally unavailable green star.jpg', username: '@indecisive_wear' },
    { filename: encodeURIComponent('emotionally unavailable star.jpg'), displayName: 'emotionally unavailable star.jpg', username: '@indecisive_wear' },
    { filename: 'hooligan.jpg', displayName: 'hooligan.jpg', username: '@indecisive_wear' },
    { filename: 'star1.jpg', displayName: 'star1.jpg', username: '@indecisive_wear' },
    { filename: encodeURIComponent('the indecisive club.jpg'), displayName: 'the indecisive club.jpg', username: '@indecisive_wear' },
    { filename: 'star2.webp', displayName: 'star2.webp', username: '@indecisive_wear' },
    { filename: 'star11.webp', displayName: 'star11.webp', username: '@indecisive_wear' },
    { filename: 'star14.webp', displayName: 'star14.webp', username: '@indecisive_wear' },
    { filename: 'star18.webp', displayName: 'star18.webp', username: '@indecisive_wear' },
    { filename: 'star22.webp', displayName: 'star22.webp', username: '@indecisive_wear' },
    { filename: 'star26.webp', displayName: 'star26.webp', username: '@indecisive_wear' },
    { filename: 'star27.webp', displayName: 'star27.webp', username: '@indecisive_wear' }
  ]
  
  const demoCards = starImages.map((star, i) => ({
    id: i + 1,
    username: star.username,
    caption: t('tagToBeFeature'),
    likes: Math.floor(Math.random() * 500 + 100).toString(),
    image: `/indecisive-stars/${star.filename}`
  }))

  return (
    <section className="relative py-12 md:py-16 bg-white overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-50/10 to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header - Modern Typography */}
        <div className="text-center mb-12">
              {/* Collection Label */}
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="w-12 h-px bg-black/30" />
                <span className="text-black/70 text-xs font-medium tracking-[0.2em] uppercase">{th('community.title')}</span>
                <div className="w-12 h-px bg-black/30" />
              </div>
              
              {/* Main Title */}
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-light text-black mb-4 tracking-tight leading-[0.9]">
                {t('title')}
              </h2>
              
              {/* Description */}
              <p className="text-black/70 text-base md:text-lg font-light max-w-2xl mx-auto leading-relaxed">
                {t('subtitle')}
              </p>
            </div>
            
            {/* Horizontally Scrollable Carousel */}
            <div className="relative mb-10">
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
                  {demoCards.map((card) => (
                    <StarCard 
                      key={card.id} 
                      card={card}
                      onClick={() => setSelectedImage(starImages[card.id - 1])}
                    />
                  ))}
                </div>
              </div>
              
              {/* Scroll indicators */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white/40 to-transparent pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/40 to-transparent pointer-events-none" />
            </div>
            
            {/* Instagram Post Dialog */}
            <InstagramPostDialog 
              image={selectedImage}
              isOpen={!!selectedImage}
              onClose={() => setSelectedImage(null)}
            />
            
            {/* Modern Glass CTA Section */}
            <div className="text-center">
              <a 
                href="https://instagram.com/indecisive_wear" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 bg-black/10 backdrop-blur-md border border-black/20 text-black px-8 py-4 rounded-full font-medium text-sm tracking-wide hover:bg-black hover:text-white transition-all duration-500"
              >
                <span>{ther('marquee.followInstagram')}</span>
                <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </div>
              </a>
              <p className="mt-4 text-sm font-light text-black/60">
                ✨ @indecisive_wear
              </p>
            </div>
            
        </div>
      </section>
  )
}

function StarCard({ 
  card,
  onClick
}: { 
  card: { 
    id: number
    username: string
    caption: string
    likes: string
    image?: string
  }
  onClick?: () => void
}) {

  return (
    <div className="flex-shrink-0 w-52">
      <div 
        className="bg-white border border-gray-100 hover:border-gray-300 rounded-xl overflow-hidden hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 group cursor-pointer touch-manipulation"
        onClick={onClick}
      >
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

function InstagramPostDialog({
  image,
  isOpen,
  onClose
}: {
  image: { filename: string; displayName: string; username: string } | null
  isOpen: boolean
  onClose: () => void
}) {
  if (!image) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] h-fit p-0 bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-black/10">
        <div className="flex flex-col lg:flex-row max-h-[90vh]">
          {/* Image Container */}
          <div className="flex-1 bg-black rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none relative min-h-[40vh] lg:min-h-[70vh] flex items-center justify-center overflow-hidden">
            <div className="relative w-full h-full">
              <Image
                src={`/indecisive-stars/${image.filename}`}
                alt={image.displayName}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 95vw, 60vw"
              />
            </div>
          </div>
          
          {/* Content Panel */}
          <div className="w-full lg:w-80 xl:w-96 bg-white flex flex-col rounded-b-3xl lg:rounded-r-3xl lg:rounded-bl-none">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 lg:p-6 border-b border-gray-100">
              <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-lg">
                <Star className="w-6 h-6 text-white fill-current" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-black text-base">{image.username}</p>
                <p className="text-sm text-gray-600 font-medium">Indecisive Star ✨</p>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-4 lg:p-6 flex-1 overflow-y-auto">
              <div className="space-y-4">
                <p className="text-sm leading-relaxed text-gray-800">
                  <span className="font-bold text-black">{image.username}</span>{' '}
                  Looking incredible in @indecisive_wear! Tag us to be featured as our next Indecisive Star. ✨
                </p>
                
                {/* Engagement Stats */}
                <div className="flex items-center gap-6 pt-2">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500 fill-current" />
                    <span className="text-sm font-bold text-black">{Math.floor(Math.random() * 500 + 100)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-bold text-black">{Math.floor(Math.random() * 50 + 10)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-bold text-black">{Math.floor(Math.random() * 20 + 5)}</span>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 font-medium pt-2">2 hours ago</p>
              </div>
            </div>
            
            {/* Action Button */}
            <div className="p-4 lg:p-6 border-t border-gray-100">
              <a
                href="https://instagram.com/indecisive_wear"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-black text-white py-4 px-6 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] font-bold text-sm"
              >
                <ExternalLink className="w-5 h-5" />
                View on Instagram
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
