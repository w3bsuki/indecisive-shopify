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
  title,
  className = '',
  variant: _variant = 'all',
  showTabs: _showTabs = false,
  currentCategory: _currentCategory = 'all'
}: ProductPageBannerProps) {
  const locale = useLocale()
  
  const getPromoMessage = () => {
    const messages = {
      bg: [
        'Безплатна доставка над 50лв 🚚',
        'Нови колекции всяка седмица ✨',
        'Оригинални дизайни за индивидуалисти 🎨',
        'Премиум качество • Устойчива мода 🌱'
      ],
      en: [
        'Free shipping on orders over $75 🚚',
        'New collections drop weekly ✨',
        'Original designs for the indecisive 🎨',
        'Premium quality • Sustainable fashion 🌱'
      ],
      de: [
        'Kostenloser Versand ab 75€ 🚚',
        'Neue Kollektionen jede Woche ✨',
        'Originelle Designs für Unentschlossene 🎨',
        'Premium Qualität • Nachhaltige Mode 🌱'
      ]
    }
    
    const localMessages = messages[locale as keyof typeof messages] || messages.en
    // Rotate message based on current date
    const messageIndex = new Date().getDay() % localMessages.length
    return localMessages[messageIndex]
  }

  return (
    <div className={cn('bg-gradient-to-b from-gray-50 to-white border-b border-gray-200', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight animate-fade-in">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 font-medium animate-fade-in-delay">
            {getPromoMessage()}
          </p>
        </div>
      </div>
    </div>
  )
}