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
        '🔥 БЕЗПЛАТНА ДОСТАВКА НАД 50ЛВ • КОД "INDECISIVE20" ЗА -20%',
        '✨ НОВА КОЛЕКЦИЯ ВСЯКА СЕДМИЦА • 30 ДНИ ВРЪЩАНЕ',
        '🎯 ЕКСКЛУЗИВНИ ДИЗАЙНИ • ПРЕМИУМ КАЧЕСТВО',
        '💎 VIP КЛУБ: ПОЛУЧИ 15% ОТСТЪПКА ЗАВИНАГИ'
      ],
      en: [
        '🔥 FREE SHIPPING OVER $75 • CODE "INDECISIVE20" FOR 20% OFF',
        '✨ NEW DROPS WEEKLY • 30-DAY RETURNS',
        '🎯 EXCLUSIVE DESIGNS • PREMIUM QUALITY',
        '💎 VIP CLUB: GET 15% OFF FOREVER'
      ],
      de: [
        '🔥 KOSTENLOSER VERSAND AB 75€ • CODE "INDECISIVE20" FÜR -20%',
        '✨ NEUE KOLLEKTIONEN WÖCHENTLICH • 30 TAGE RÜCKGABE',
        '🎯 EXKLUSIVE DESIGNS • PREMIUM QUALITÄT',
        '💎 VIP CLUB: 15% RABATT FÜR IMMER'
      ]
    }
    
    const localMessages = messages[locale as keyof typeof messages] || messages.en
    // Rotate message based on current hour for more frequent changes
    const messageIndex = new Date().getHours() % localMessages.length
    return localMessages[messageIndex]
  }

  return (
    <div className={cn('bg-black text-white', className)}>
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <p className="text-xs sm:text-sm font-medium text-center tracking-wide animate-pulse">
            {getPromoMessage()}
          </p>
        </div>
      </div>
    </div>
  )
}