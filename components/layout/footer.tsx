import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Marquee, MarqueeItem } from '@/components/ui/marquee'

export async function Footer() {
  const currentYear = new Date().getFullYear()
  const t = await getTranslations('footer')
  const tb = await getTranslations('brand')
  const tn = await getTranslations('nav')
  
  return (
    <>
    {/* Bottom Marquee - matching top banner size */}
    <Marquee 
      className="bg-black text-white py-3 sm:py-4"
      speed="normal"
      pauseOnHover
    >
      {[...Array(6)].map((_, i) => (
        <span key={i} className="flex">
          <MarqueeItem className="text-white">30 ДНЕВЕН ВРЪЩАНЕ</MarqueeItem>
          <MarqueeItem className="text-white">БЕЗПЛАТНА ДОСТАВКА</MarqueeItem>
          <MarqueeItem className="text-white">STAY INDECISIVE</MarqueeItem>
          <MarqueeItem className="text-white">{tb('name')}</MarqueeItem>
        </span>
      ))}
    </Marquee>
    
    <footer className="bg-white border-t border-black/10 py-8 md:py-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Desktop: 3 columns + brand, Mobile: horizontal row */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4 md:mb-8">
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-black"></div>
                <div className="w-4 h-4 bg-white border border-gray-950"></div>
              </div>
              <span className="font-mono font-bold text-sm">{tb('name')}</span>
            </div>
            <p className="text-black/70 text-sm leading-relaxed">
              {t('tagline')}
            </p>
          </div>

          {[
            { 
              title: t('sections.shop.title'), 
              links: [
                { key: 'all', label: 'ALL', href: '/products' },
                { key: 'newArrivals', label: t('sections.shop.newArrivals'), href: '/new' },
                { key: 'sale', label: t('sections.shop.sale'), href: '/sale' }
              ] 
            },
            { 
              title: t('sections.support.title'), 
              links: [
                { key: 'sizeGuide', label: t('sections.support.sizeGuide'), href: '/size-guide' },
                { key: 'shipping', label: t('sections.support.shipping'), href: '/shipping' },
                { key: 'returns', label: t('sections.support.returns'), href: '/returns' },
                { key: 'contact', label: t('sections.support.contact'), href: '/contact' }
              ] 
            },
            { 
              title: t('sections.connect.title'), 
              links: [
                { key: 'instagram', label: t('sections.connect.instagram'), href: 'https://instagram.com/indecisivewear' },
                { key: 'newsletter', label: t('sections.connect.newsletter'), href: '#newsletter' }
              ] 
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-mono font-bold mb-4 md:mb-8 text-sm uppercase tracking-wider">{col.title}</h4>
              <ul className="space-y-2 md:space-y-4 text-sm text-black/70">
                {col.links.map((link) => (
                  <li key={link.key}>
                    <Link href={link.href} className="hover:text-black transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Mobile horizontal layout */}
        <div className="sm:hidden">
          <div className="flex items-center space-x-2 mb-6">
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-black"></div>
              <div className="w-4 h-4 bg-white border border-gray-950"></div>
            </div>
            <span className="font-mono font-bold text-sm">{tb('name')}</span>
          </div>
          
          <div className="flex items-start justify-between gap-4 text-sm">
            {[
              { 
                title: t('sections.shop.title'), 
                links: [
                  { key: 'all', label: 'ALL', href: '/products' },
                  { key: 'new', label: t('sections.shop.newArrivals'), href: '/new' },
                  { key: 'sale', label: t('sections.shop.sale'), href: '/sale' }
                ] 
              },
              { 
                title: t('sections.support.title'), 
                links: [
                  { key: 'contact', label: t('sections.support.contact'), href: '/contact' },
                  { key: 'shipping', label: t('sections.support.shipping'), href: '/shipping' }
                ] 
              },
              { 
                title: t('sections.connect.title'), 
                links: [
                  { key: 'instagram', label: 'Instagram', href: 'https://instagram.com/indecisivewear' }
                ] 
              },
            ].map((col) => (
              <div key={col.title} className="flex-1">
                <h4 className="font-mono font-bold mb-2 text-xs uppercase tracking-wider">{col.title}</h4>
                <ul className="space-y-1 text-xs text-black/70">
                  {col.links.map((link) => (
                    <li key={link.key}>
                      <Link href={link.href} className="hover:text-black transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-black/10 mt-8 md:mt-16 pt-6 text-center text-xs sm:text-base text-black/60">
          <p>
            {t('copyright', { year: currentYear })} | 
            <Link href="/privacy-policy" className="hover:text-black mx-1">{t('privacy')}</Link> | 
            <Link href="/cookie-policy" className="hover:text-black mx-1">{t('cookie')}</Link> | 
            <Link href="/terms" className="hover:text-black ml-1">{t('terms')}</Link>
          </p>
        </div>
      </div>
    </footer>
    </>
  )
}