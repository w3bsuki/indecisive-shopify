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
        '✨ НЕ МОЖЕШ ДА РЕШИШ? ВЗЕМИ ДВЕТЕ',
        '🎯 ЖИВОТЪТ Е КРАТЪК • КУПИ ВСИЧКО',
        '💫 ЗАЩО ДА ИЗБИРАШ?',
        '🌟 НЕРЕШИТЕЛНОСТ = СТИЛ'
      ],
      en: [
        '✨ CAN\'T DECIDE? GET BOTH',
        '🎯 LIFE\'S SHORT • BUY EVERYTHING',
        '💫 WHY CHOOSE?',
        '🌟 INDECISION = STYLE'
      ],
      de: [
        '✨ KANNST NICHT ENTSCHEIDEN? NIMM BEIDE',
        '🎯 LEBEN IST KURZ • KAUF ALLES',
        '💫 WARUM WÄHLEN?',
        '🌟 UNENTSCHLOSSENHEIT = STIL'
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