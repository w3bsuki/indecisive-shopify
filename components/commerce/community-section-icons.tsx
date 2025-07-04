'use client'

import { useTranslations } from 'next-intl'
import { Instagram, Hash, Users, Heart, Camera, Share2, Star, Sparkles, TrendingUp } from 'lucide-react'

export function CommunitySectionIcons() {
  const t = useTranslations('community')
  
  const placeholderCards = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Share Your Style",
      subtitle: "Post your fits",
      action: "Start Sharing",
      color: "from-pink-50 to-purple-50",
      iconColor: "text-pink-600"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Join Community",
      subtitle: "4.8K+ Members",
      action: "Follow Us",
      color: "from-blue-50 to-cyan-50",
      iconColor: "text-blue-600"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Get Featured",
      subtitle: "Weekly picks",
      action: "Learn More",
      color: "from-yellow-50 to-orange-50",
      iconColor: "text-yellow-600"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Trending Now",
      subtitle: "Hot styles",
      action: "See Trends",
      color: "from-green-50 to-emerald-50",
      iconColor: "text-green-600"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Style Inspo",
      subtitle: "Daily updates",
      action: "Get Inspired",
      color: "from-purple-50 to-pink-50",
      iconColor: "text-purple-600"
    }
  ]
  
  return (
    <section className="py-8 md:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="px-4 sm:px-6 lg:px-8 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 font-mono tracking-wide">
            {t('title')}
          </h2>
          <p className="text-gray-600 text-center font-mono text-sm">
            {t('subtitle')}
          </p>
        </div>
        
        {/* Icon-based placeholder cards */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 px-4 sm:px-6 lg:px-8 pb-4">
            {placeholderCards.map((card, index) => (
              <PlaceholderCard
                key={index}
                icon={card.icon}
                title={card.title}
                subtitle={card.subtitle}
                action={card.action}
                color={card.color}
                iconColor={card.iconColor}
              />
            ))}
            
            {/* Call to action card */}
            <CallToActionCard />
          </div>
        </div>
      </div>
    </section>
  )
}

function PlaceholderCard({ 
  icon, 
  title, 
  subtitle, 
  action, 
  color,
  iconColor = "text-gray-700"
}: { 
  icon: React.ReactNode
  title: string
  subtitle: string
  action: string
  color: string
  iconColor?: string
}) {
  return (
    <div className="group relative flex-shrink-0 w-48 snap-start">
      <div className="bg-white border border-gray-200 hover:border-black/40 hover:shadow-lg transition-all duration-200">
        {/* Icon area - Same aspect ratio as Instagram posts */}
        <div className={`aspect-[4/5] bg-gradient-to-br ${color} relative overflow-hidden flex flex-col items-center justify-center p-6`}>
          <div className={`${iconColor} mb-4 group-hover:scale-110 transition-transform duration-200`}>
            {icon}
          </div>
          <h3 className="font-mono font-bold text-sm text-gray-800 text-center mb-2">
            {title}
          </h3>
          <p className="font-mono text-xs text-gray-600 text-center">
            {subtitle}
          </p>
        </div>

        {/* Card Info */}
        <div className="p-3 border-t border-black/20">
          <div className="flex items-center justify-between mb-2">
            <p className="font-mono font-medium text-xs">@indecisivewear</p>
            <div className="flex items-center gap-1">
              <Share2 className="w-3 h-3 text-gray-400" />
            </div>
          </div>
          
          <p className="font-mono text-xs text-gray-600 line-clamp-1 mb-2">
            Join the movement
          </p>
          
          <div className="w-full border border-gray-200">
            <button 
              onClick={() => window.open('https://instagram.com/indecisivewear', '_blank', 'noopener,noreferrer')}
              className="w-full bg-black text-white py-2 sm:py-1.5 px-2 font-mono text-xs font-medium hover:bg-gray-800 transition-colors min-h-[44px] sm:min-h-0 touch-manipulation"
            >
              {action}
            </button>
          </div>
        </div>
      </div>
    </div>
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
            <svg className="w-12 h-12 text-gray-700 relative z-10 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
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
            <p className="font-mono font-bold text-xs">BE FEATURED</p>
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          
          <p className="font-mono text-xs text-gray-600 mb-2">
            {t('getFeaturedInCommunity')}
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