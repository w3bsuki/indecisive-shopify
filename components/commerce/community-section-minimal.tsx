'use client'

import { useTranslations } from 'next-intl'
import { Camera, Heart } from 'lucide-react'

export function CommunitySectionMinimal() {
  const t = useTranslations('community')
  
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
        
        {/* Multiple demo cards to maintain UI flow */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 px-4 sm:px-6 lg:px-8 pb-4">
            <CallToActionCard />
            <CallToActionCard />
            <CallToActionCard />
            <CallToActionCard />
            <CallToActionCard />
          </div>
        </div>
      </div>
    </section>
  )
}

function CallToActionCard() {
  const t = useTranslations('community')
  return (
    <div className="flex-shrink-0 w-48 snap-start">
      <div className="bg-white border-2 border-dashed border-gray-950 hover:border-solid hover:shadow-lg transition-all duration-200 group">
        {/* Image area - Same aspect ratio as other cards */}
        <div className="aspect-[4/5] bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden flex flex-col items-center justify-center p-4">
          <div className="mb-4 relative">
            <div className="absolute inset-0 bg-black/10 blur-xl"></div>
            <Camera className="w-12 h-12 text-gray-700 relative z-10 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
          </div>
          <h3 className="font-mono font-bold text-base text-gray-800 text-center mb-2">
            {t('shareYourStyle')}
          </h3>
          <p className="font-mono text-xs text-gray-600 text-center leading-relaxed px-2">
            {t('tagToBeFeature')}
          </p>
        </div>
        
        {/* Card Info - matching other cards */}
        <div className="p-3 border-t-2 border-black/20">
          <div className="flex items-center justify-between mb-2">
            <p className="font-mono font-medium text-xs">@indecisivewear</p>
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3 text-gray-400" />
              <span className="font-mono text-xs font-medium text-gray-400">∞</span>
            </div>
          </div>
          
          <p className="font-mono text-xs text-gray-600 mb-2">
            #IndecisiveWear
          </p>
          
          <div className="w-full border-2 border-black">
            <button 
              onClick={() => window.open('https://instagram.com/indecisivewear', '_blank', 'noopener,noreferrer')}
              className="w-full bg-black text-white py-2 sm:py-1.5 px-2 font-mono text-xs font-bold hover:bg-gray-800 transition-colors min-h-[44px] sm:min-h-0 touch-manipulation"
            >
              {t('getFeatured')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}