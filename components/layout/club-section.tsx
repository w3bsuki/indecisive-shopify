import { getTranslations, getLocale } from 'next-intl/server'
import { Marquee, MarqueeItem } from '@/components/ui/marquee'
import Link from 'next/link'

export async function ClubSection() {
  const t = await getTranslations('newsletter')
  const tb = await getTranslations('brand')
  const _locale = await getLocale()
  
  return (
    <>
      {/* Top Marquee */}
      <Marquee 
        className="bg-white text-black border-t border-b border-black py-3 sm:py-4"
        speed="normal"
        pauseOnHover
        direction="right"
      >
        {[...Array(6)].map((_, i) => (
          <span key={i} className="flex">
            <MarqueeItem className="text-black">{t('beIndecisive')}</MarqueeItem>
            <MarqueeItem className="text-black">{t('joinTheClub')}</MarqueeItem>
            <MarqueeItem className="text-black">{t('minimalDesign')}</MarqueeItem>
            <MarqueeItem className="text-black">{tb('name')}</MarqueeItem>
          </span>
        ))}
      </Marquee>
      
      <section className="relative py-12 md:py-16 bg-white overflow-hidden">
        {/* Subtle background texture */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-50/25 to-transparent" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header - Modern Typography */}
          <div className="text-center mb-12">
                {/* Collection Label */}
                <div className="inline-flex items-center gap-2 mb-4">
                  <div className="w-12 h-px bg-black/30" />
                  <span className="text-black/70 text-xs font-medium tracking-[0.2em] uppercase">{t('label')}</span>
                  <div className="w-12 h-px bg-black/30" />
                </div>
                
                {/* Main Title */}
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-light text-black mb-4 tracking-tight leading-[0.9]">{t('title')}</h2>
                
                {/* Description */}
                <p className="text-black/70 text-base md:text-lg font-light max-w-2xl mx-auto leading-relaxed">{t('subtitle')}</p>
              </div>
              
              {/* Email Form - Modern Design */}
              <div className="max-w-md mx-auto mb-10">
                <form className="relative">
                  <input
                    type="email"
                    placeholder={t('emailPlaceholder')}
                    className="w-full px-6 py-4 pr-32 bg-white/60 backdrop-blur-sm border border-gray-300 rounded-full text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-1 focus:bg-white/80 focus:border-black transition-all duration-300"
                    required
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-2 bottom-2 px-6 bg-black/90 backdrop-blur-sm text-white font-medium text-sm hover:bg-black transition-all duration-300 rounded-full"
                  >
                    {t('joinButton')}
                  </button>
                </form>
              </div>
              
              {/* Benefits - Modern Layout */}
              <div className="flex flex-row justify-center items-center gap-6 md:gap-8 text-sm text-black/70 mb-10 flex-wrap">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-black/60 rounded-full"></div>
                  <span className="font-medium">{t('benefits.exclusiveOffers')}</span>
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-black/60 rounded-full"></div>
                  <span className="font-medium">{t('benefits.earlyAccess')}</span>
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-black/60 rounded-full"></div>
                  <span className="font-medium">{t('benefits.vipCommunity')}</span>
                </span>
              </div>
              
              {/* Modern Glass CTA Section */}
              <div className="text-center">
                <Link href="/products">
                  <button className="group inline-flex items-center gap-3 bg-black/10 backdrop-blur-md border border-black/20 text-black px-8 py-4 rounded-full font-medium text-sm tracking-wide hover:bg-black hover:text-white transition-all duration-500">
                    <span>{t('ctaBrowseCollection')}</span>
                    <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                      </svg>
                    </div>
                  </button>
                </Link>
              </div>
              
            </div>
        </section>
      
    </>
  )
}
