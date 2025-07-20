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
      
      <section className="min-h-[300px] md:h-96 flex relative">
        {/* Left half - white background */}
        <div className="w-1/2 bg-white border-l border-black"></div>
        
        {/* Right half - black background */}
        <div className="w-1/2 bg-black"></div>
        
        {/* Centered Button spanning both columns */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto text-center">
            <Link 
              href="/products"
              className="relative group inline-block"
            >
              <button className="relative font-mono font-bold text-sm sm:text-base md:text-lg uppercase tracking-wider transition-all duration-300 hover:scale-105 group overflow-hidden">
                {/* Split background */}
                <div className="absolute inset-0 flex">
                  <div className="w-1/2 bg-black"></div>
                  <div className="w-1/2 bg-white"></div>
                </div>
                
                {/* Border overlay for right side */}
                <div className="absolute inset-0 left-1/2 border-2 border-white"></div>
                
                {/* Text */}
                <div className="relative px-8 sm:px-12 md:px-16 py-4 sm:py-5 md:py-6">
                  {locale === 'bg' ? (
                    <span className="relative z-10">
                      {/* Bulgarian text split - fixed */}
                      <span className="text-white">ПРИСЪЕДИНИ СЕ КЪМ </span>
                      <span className="text-black">НЕРЕШИТЕЛНИЯ КЛУБ</span>
                    </span>
                  ) : (
                    <span className="relative z-10">
                      {/* English text split */}
                      <span className="text-white">JOIN THE IND</span>
                      <span className="text-black">ECISIVE CLUB</span>
                    </span>
                  )}
                </div>
                
                {/* Hover effect */}
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </button>
            </Link>
            
            {/* Description text */}
            <p className="mt-4 text-xs sm:text-sm font-mono">
              <span className="text-white">{locale === 'bg' ? 'Ексклузивни оферти' : 'Exclusive offers'}</span>
              <span className="text-white mx-2">•</span>
              <span className="text-black">{locale === 'bg' ? 'Ранен достъп' : 'Early access'}</span>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}