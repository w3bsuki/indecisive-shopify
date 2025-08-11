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
        '🚚 БЕЗПЛАТНА ДОСТАВКА НАД 100 ЛВ',
        '💎 НОВИ СТИЛОВЕ ВСЯКА СЕДМИЦА',
        '⚡ ЕКСПРЕСНА ДОСТАВКА 24Ч',
        '🎁 БЕЗПЛАТНО ВРЪЩАНЕ 30 ДНИ'
      ],
      en: [
        '🚚 FREE SHIPPING OVER $50',
        '💎 NEW STYLES WEEKLY',
        '⚡ EXPRESS DELIVERY 24H',
        '🎁 FREE RETURNS 30 DAYS'
      ],
      de: [
        '🚚 KOSTENLOSER VERSAND AB 50€',
        '💎 NEUE STYLES WÖCHENTLICH',
        '⚡ EXPRESS LIEFERUNG 24H',
        '🎁 KOSTENLOSE RÜCKSENDUNG 30 TAGE'
      ]
    }
    
    const localMessages = messages[locale as keyof typeof messages] || messages.en
    // Rotate message based on current hour for more frequent changes
    const messageIndex = new Date().getHours() % localMessages.length
    return localMessages[messageIndex]
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