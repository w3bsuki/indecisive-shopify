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
        '🔥 БЕЗПЛАТНА ДОСТАВКА НАД 50ЛВ • ОГРАНИЧЕНИ КОЛИЧЕСТВА',
        '✨ WEAR YOUR MOOD • СТИЛ ЗА ВСЕКИ ДЕН',
        '🎯 РЕШЕНИЯТА СА ПРЕОЦЕНЕНИ • ПРОСТО ВЗЕМИ ВСИЧКО',
        '💫 ЗАЩО ДА ИЗБИРАШ? ЖИВОТЪТ Е ТВЪРДЕ КРАТЪК',
        '🌟 НЕРЕШИТЕЛНОСТТА Е НОВАТА УВЕРЕНОСТ',
        '⚡ ПОСЛЕДНИ ПАРЧЕТА • НЕ МИСЛИ, ДЕЙСТВАЙ'
      ],
      en: [
        '🔥 FREE SHIPPING OVER $75 • LIMITED QUANTITIES',
        '✨ WEAR YOUR MOOD • STYLE FOR EVERY DECISION',
        '🎯 DECISIONS ARE OVERRATED • JUST GET EVERYTHING',
        '💫 WHY CHOOSE? LIFE\'S TOO SHORT',
        '🌟 INDECISION IS THE NEW CONFIDENCE',
        '⚡ LAST PIECES • DON\'T THINK, JUST WEAR'
      ],
      de: [
        '🔥 KOSTENLOSER VERSAND AB 75€ • LIMITIERTE MENGEN',
        '✨ TRAGE DEINE STIMMUNG • STIL FÜR JEDEN TAG',
        '🎯 ENTSCHEIDUNGEN SIND ÜBERBEWERTET • NIMM EINFACH ALLES',
        '💫 WARUM WÄHLEN? DAS LEBEN IST ZU KURZ',
        '🌟 UNENTSCHLOSSENHEIT IST DAS NEUE SELBSTVERTRAUEN',
        '⚡ LETZTE STÜCKE • NICHT DENKEN, EINFACH TRAGEN'
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