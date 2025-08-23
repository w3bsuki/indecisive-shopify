import { getTranslations, getLocale } from 'next-intl/server'
import { Marquee, MarqueeItem } from '@/components/ui/marquee'
import Link from 'next/link'

export async function NewsletterSection() {
  const t = await getTranslations('newsletter')
  const tb = await getTranslations('brand')
  const locale = await getLocale()
  
  return (
    <>
      {/* Top Marquee - matching bottom banner style */}
      <Marquee 
        className="bg-white text-black border-t border-b border-black py-3 sm:py-4"
        speed="normal"
        pauseOnHover
        direction="right"
      >
        {[...Array(6)].map((_, i) => (
          <span key={i} className="flex">
            <MarqueeItem className="text-black">{t('beIndecisive')}</MarqueeItem>
            <MarqueeItem className="text-black">{locale === 'bg' ? 'ПРИСЪЕДИНИ СЕ КЪМ КЛУБА' : 'JOIN THE CLUB'}</MarqueeItem>
            <MarqueeItem className="text-black">{t('minimalDesign')}</MarqueeItem>
            <MarqueeItem className="text-black">{tb('name')}</MarqueeItem>
          </span>
        ))}
      </Marquee>
      
      <section className="min-h-[400px] md:h-[500px] relative overflow-hidden">
        {/* Modern gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        
        {/* Content container */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center max-w-2xl px-6">
            {/* Modern club button */}
            <Link 
              href="/products"
              className="group inline-block mb-8"
            >
              <div className="relative bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-3xl p-8 hover:bg-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse delay-150"></div>
                  <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse delay-300"></div>
                </div>
                
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
                  {locale === 'bg' ? 'ПРИСЪЕДИНИ СЕ КЪМ НЕРЕШИТЕЛНИЯ КЛУБ' : 'JOIN THE INDECISIVE CLUB'}
                </h2>
                
                <p className="text-white/80 text-base sm:text-lg font-medium mb-6">
                  {locale === 'bg' ? 'Открий уникални парчета и бъди част от нашата общност' : 'Discover unique pieces and be part of our community'}
                </p>
                
                <div className="flex items-center justify-center gap-6 text-white/60 text-sm font-semibold">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                    {locale === 'bg' ? 'Яки оферти' : 'Exclusive offers'}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                    {locale === 'bg' ? 'Ранен достъп' : 'Early access'}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                    {locale === 'bg' ? 'Общност' : 'Community'}
                  </span>
                </div>
              </div>
            </Link>
            
            {/* Modern stats or features */}
            <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/20">
                  <span className="text-2xl">✨</span>
                </div>
                <p className="text-white/80 text-sm font-medium">
                  {locale === 'bg' ? 'Уникален стил' : 'Unique Style'}
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/20">
                  <span className="text-2xl">🎯</span>
                </div>
                <p className="text-white/80 text-sm font-medium">
                  {locale === 'bg' ? 'Качество' : 'Quality'}
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/20">
                  <span className="text-2xl">❤️</span>
                </div>
                <p className="text-white/80 text-sm font-medium">
                  {locale === 'bg' ? 'Общност' : 'Community'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}