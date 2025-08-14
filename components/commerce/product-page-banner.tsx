'use client'

import { cn } from '@/lib/utils'
import { useLocale } from 'next-intl'

interface ProductPageBannerProps {
  title: string
  className?: string
  variant?: 'all' | 'new' | 'sale' | 'collection'
  showTabs?: boolean
  currentCategory?: string
}

export function ProductPageBanner({
  title: _title,
  className = '',
  variant: _variant = 'all',
  showTabs: _showTabs = false,
  currentCategory: _currentCategory = 'all'
}: ProductPageBannerProps) {
  const locale = useLocale()
  
  const getPromoMessage = () => {
    const messages = {
      bg: [
        '🤔 НЕ МОЖЕШ ДА РЕШИШ? ВЗЕМИ И ДВЕТЕ!',
        '🚚 БЕЗПЛАТНА ДОСТАВКА НАД 100 ЛВ',
        '💎 НОВИ СТИЛОВЕ ВСЯКА СЕДМИЦА',
        '⚡ ЕКСПРЕСНА ДОСТАВКА 24Ч',
        '🎁 БЕЗПЛАТНО ВРЪЩАНЕ 30 ДНИ'
      ],
      en: [
        '🤔 CAN\'T DECIDE? GET BOTH!',
        '🚚 FREE SHIPPING OVER $50',
        '💎 NEW STYLES WEEKLY',
        '⚡ EXPRESS DELIVERY 24H',
        '🎁 FREE RETURNS 30 DAYS'
      ],
      de: [
        '🤔 KANNST DICH NICHT ENTSCHEIDEN? NIMM BEIDE!',
        '🚚 KOSTENLOSER VERSAND AB 50€',
        '💎 NEUE STYLES WÖCHENTLICH',
        '⚡ EXPRESS LIEFERUNG 24H',
        '🎁 KOSTENLOSE RÜCKSENDUNG 30 TAGE'
      ]
    }
    
    const localMessages = messages[locale as keyof typeof messages] || messages.en
    // Always show "Can't decide? Get both!" message
    return localMessages[0]
  }

  return (
    <div className={cn('bg-black text-white relative overflow-hidden', className)}>
      {/* Subtle moving background */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-pulse"></div>
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5">
          <div className="text-center">
            <p className="text-[11px] sm:text-xs font-medium tracking-wider">
              {getPromoMessage()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}