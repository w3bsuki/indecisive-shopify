import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export async function Footer() {
  const currentYear = new Date().getFullYear()
  const t = await getTranslations('footer')
  const tb = await getTranslations('brand')
  
  return (
    <footer className="bg-white border-t border-black/10 py-8 md:py-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-12">
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
                { key: 'newArrivals', label: t('sections.shop.newArrivals') },
                { key: 'essentials', label: t('sections.shop.essentials') },
                { key: 'streetwear', label: t('sections.shop.streetwear') },
                { key: 'sale', label: t('sections.shop.sale') }
              ] 
            },
            { 
              title: t('sections.support.title'), 
              links: [
                { key: 'sizeGuide', label: t('sections.support.sizeGuide') },
                { key: 'shipping', label: t('sections.support.shipping') },
                { key: 'returns', label: t('sections.support.returns') },
                { key: 'contact', label: t('sections.support.contact') }
              ] 
            },
            { 
              title: t('sections.connect.title'), 
              links: [
                { key: 'instagram', label: t('sections.connect.instagram') },
                { key: 'twitter', label: t('sections.connect.twitter') },
                { key: 'tiktok', label: t('sections.connect.tiktok') },
                { key: 'newsletter', label: t('sections.connect.newsletter') }
              ] 
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-mono font-bold mb-4 md:mb-8 text-sm uppercase tracking-wider">{col.title}</h4>
              <ul className="space-y-2 md:space-y-4 text-sm text-black/70">
                {col.links.map((link) => (
                  <li key={link.key}>
                    <Link href="#" className="hover:text-black">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
  )
}