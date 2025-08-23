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
      
      <section className="min-h-[400px] md:h-[500px] relative overflow-hidden bg-white">
        {/* Split background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 w-1/2 bg-black"></div>
          <div className="absolute inset-0 w-1/2 left-1/2 bg-white"></div>
        </div>
        
        {/* Content container */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center max-w-2xl px-6">
            {/* Modern club button */}
            <Link 
              href="/products"
              className="group inline-block mb-8"
            >
              <div className="relative bg-white border-4 border-black rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="bg-black text-white p-8 pb-4">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 tracking-tight font-mono uppercase">
                    {locale === 'bg' ? 'ПРИСЪЕДИНИ СЕ КЪМ НЕРЕШИТЕЛНИЯ КЛУБ' : 'JOIN THE INDECISIVE CLUB'}
                  </h2>
                </div>
                
                <div className="bg-white text-black p-8 pt-4">
                  <p className="text-gray-700 text-base sm:text-lg font-medium mb-6">
                    {locale === 'bg' ? 'Открий уникални парчета и бъди част от нашата общност' : 'Discover unique pieces and be part of our community'}
                  </p>
                  
                  <div className="flex items-center justify-center gap-6 text-gray-600 text-sm font-mono font-semibold">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-black rounded-full"></span>
                      {locale === 'bg' ? 'Яки оферти' : 'Exclusive offers'}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-black rounded-full"></span>
                      {locale === 'bg' ? 'Ранен достъп' : 'Early access'}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-black rounded-full"></span>
                      {locale === 'bg' ? 'Общност' : 'Community'}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
            
            {/* Professional black/white stats */}
            <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-3xl font-black">01</span>
                </div>
                <p className="text-black text-sm font-mono font-bold">
                  {locale === 'bg' ? 'УНИКАЛЕН СТИЛ' : 'UNIQUE STYLE'}
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 border-2 border-black">
                  <span className="text-black text-3xl font-black">02</span>
                </div>
                <p className="text-black text-sm font-mono font-bold">
                  {locale === 'bg' ? 'КАЧЕСТВО' : 'QUALITY'}
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-3xl font-black">03</span>
                </div>
                <p className="text-black text-sm font-mono font-bold">
                  {locale === 'bg' ? 'ОБЩНОСТ' : 'COMMUNITY'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}