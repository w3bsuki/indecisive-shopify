import { getTranslations } from 'next-intl/server'
import { Marquee, MarqueeItem } from '@/components/ui/marquee'
import Link from 'next/link'

export async function NewsletterSection() {
  const t = await getTranslations('newsletter')
  const tb = await getTranslations('brand')
  
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
            <MarqueeItem className="text-black">BE INDECISIVE</MarqueeItem>
            <MarqueeItem className="text-black">JOIN THE CLUB</MarqueeItem>
            <MarqueeItem className="text-black">MINIMAL DESIGN</MarqueeItem>
            <MarqueeItem className="text-black">{tb('name')}</MarqueeItem>
          </span>
        ))}
      </Marquee>
      
      <section className="min-h-[300px] md:h-96 flex relative">
        <div className="w-1/2 bg-white flex flex-col justify-center items-center px-3 sm:px-6 md:px-12 py-8 md:py-0 border-l border-black">
          <div className="text-center space-y-3 sm:space-y-6 md:space-y-8 max-w-xs sm:max-w-sm md:max-w-md w-full">
            <h3 className="text-lg sm:text-3xl md:text-4xl font-bold">БЪДИ МИНИМАЛИСТИЧЕН</h3>
            <p className="text-black/70 text-xs sm:text-base md:text-lg">{t('minimalDesc')}</p>
          </div>
        </div>

        <div className="w-1/2 bg-black flex flex-col justify-center items-center px-3 sm:px-6 md:px-12 py-8 md:py-0">
          <div className="text-center space-y-3 sm:space-y-6 md:space-y-8 max-w-xs sm:max-w-sm md:max-w-md w-full">
            <h3 className="text-lg sm:text-3xl md:text-4xl font-bold text-white">БЪДИ СМЕЛ И НЕРЕШИТЕЛЕН</h3>
            <p className="text-white/70 text-xs sm:text-base md:text-lg">Бъди уверен, изрази себе си</p>
          </div>
        </div>
        
        {/* Centered Button spanning both columns */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Link 
            href="/products"
            className="pointer-events-auto relative group"
          >
            <button className="relative overflow-hidden font-mono font-bold text-sm sm:text-base md:text-lg uppercase tracking-wider transition-all duration-300 hover:scale-105 group">
              {/* Background split effect */}
              <div className="absolute inset-0 flex">
                {/* Left half - black button on white background */}
                <div className="w-1/2 bg-black group-hover:bg-gray-800"></div>
                {/* Right half - white outline on black background */}
                <div className="w-1/2 bg-transparent border-2 border-white group-hover:bg-white group-hover:border-transparent transition-colors duration-300"></div>
              </div>
              
              {/* White text for visibility */}
              <div className="relative px-8 sm:px-12 md:px-16 py-4 sm:py-5 md:py-6">
                <span className="text-white group-hover:text-black transition-colors duration-300">JOIN THE INDECISIVE CLUB</span>
              </div>
            </button>
          </Link>
        </div>
      </section>
    </>
  )
}