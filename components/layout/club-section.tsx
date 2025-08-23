import { getTranslations, getLocale } from 'next-intl/server'
import { Marquee, MarqueeItem } from '@/components/ui/marquee'
import Link from 'next/link'

export async function ClubSection() {
  const t = await getTranslations('newsletter')
  const tb = await getTranslations('brand')
  const locale = await getLocale()
  
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
            <MarqueeItem className="text-black">{locale === 'bg' ? 'ПРИСЪЕДИНИ СЕ КЪМ КЛУБА' : 'JOIN THE CLUB'}</MarqueeItem>
            <MarqueeItem className="text-black">{t('minimalDesign')}</MarqueeItem>
            <MarqueeItem className="text-black">{tb('name')}</MarqueeItem>
          </span>
        ))}
      </Marquee>
      
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Compact newsletter design */}
          <div className="text-center space-y-6">
            {/* Clean header */}
            <div>
              <h2 className="text-3xl md:text-5xl font-black font-mono text-black mb-2">
                {locale === 'bg' ? 'INDECISIVE CLUB' : 'INDECISIVE CLUB'}
              </h2>
              <p className="text-base md:text-lg text-gray-600 font-medium">
                {locale === 'bg' ? 'Открий уникални парчета' : 'Discover unique pieces'}
              </p>
            </div>
            
            {/* Email form */}
            <form className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="email"
                  placeholder={locale === 'bg' ? 'Твоят имейл' : 'Your email'}
                  className="w-full px-5 py-3 pr-28 bg-gray-50 border-2 border-black rounded-full text-black font-mono text-sm focus:outline-none focus:bg-white transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 px-5 bg-black text-white font-mono font-bold text-xs uppercase hover:bg-gray-900 transition-colors rounded-full"
                >
                  {locale === 'bg' ? 'Влез' : 'Join'}
                </button>
              </div>
            </form>
            
            {/* Benefits - mobile optimized */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 text-xs font-mono text-gray-600">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                {locale === 'bg' ? 'Оферти' : 'Offers'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                {locale === 'bg' ? 'Ранен достъп' : 'Early access'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                {locale === 'bg' ? 'Общност' : 'Community'}
              </span>
            </div>
            
            {/* Shop link */}
            <Link 
              href="/products"
              className="inline-block text-black underline underline-offset-4 font-mono text-sm font-medium hover:no-underline transition-all"
            >
              {locale === 'bg' ? 'Разгледай колекцията' : 'Browse collection'}
            </Link>
          </div>
        </div>
      </section>
      
    </>
  )
}