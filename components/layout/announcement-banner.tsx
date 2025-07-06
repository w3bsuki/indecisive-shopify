'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, X, Truck, RotateCcw, Zap, Gift, Instagram } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

interface AnnouncementItem {
  id: string
  type: 'shipping' | 'sale' | 'launch' | 'return' | 'promo'
  title: string
  cta?: string
  href?: string
  icon?: React.ComponentType<{ className?: string }>
  variant: 'default' | 'urgent' | 'success' | 'premium'
  dismissible?: boolean
}

interface AnnouncementItemBase {
  id: string
  type: 'shipping' | 'sale' | 'launch' | 'return' | 'promo'
  titleKey: string
  ctaKey: string
  href?: string
  icon?: React.ComponentType<{ className?: string }>
  variant: 'default' | 'urgent' | 'success' | 'premium'
  dismissible?: boolean
}

const announcementConfig: AnnouncementItemBase[] = [
  {
    id: 'free-shipping',
    type: 'shipping',
    titleKey: 'freeShipping.title',
    ctaKey: 'freeShipping.cta',
    href: '/shipping',
    icon: Truck,
    variant: 'default',
    dismissible: false
  },
  {
    id: 'early-access',
    type: 'sale', 
    titleKey: 'earlyAccess.title',
    ctaKey: 'earlyAccess.cta',
    href: '/products',
    icon: Zap,
    variant: 'urgent',
    dismissible: true
  },
  {
    id: 'new-drop',
    type: 'launch',
    titleKey: 'newDrop.title',
    ctaKey: 'newDrop.cta',
    href: '/collections/hooliganka',
    icon: Gift,
    variant: 'premium',
    dismissible: false
  },
  {
    id: 'affiliate',
    type: 'promo',
    titleKey: 'returns.title',
    ctaKey: 'returns.cta',
    href: '/account',
    icon: RotateCcw,
    variant: 'success',
    dismissible: false
  },
  {
    id: 'social',
    type: 'promo',
    titleKey: 'social.title',
    ctaKey: 'social.cta',
    href: 'https://instagram.com/indecisivewear',
    icon: Instagram,
    variant: 'default',
    dismissible: false
  }
]

interface AnnouncementBannerProps {
  className?: string
}

export function AnnouncementBanner({ className }: AnnouncementBannerProps) {
  const t = useTranslations('announcements')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [dismissedIds, setDismissedIds] = useState<string[]>([])
  const [isPaused, setIsPaused] = useState(false)

  // Transform config to include translated text
  const announcements: AnnouncementItem[] = announcementConfig.map(config => ({
    ...config,
    title: t(config.titleKey),
    cta: t(config.ctaKey)
  }))

  // Filter out dismissed announcements
  const visibleAnnouncements = announcements.filter(
    announcement => !dismissedIds.includes(announcement.id)
  )

  const currentAnnouncement = visibleAnnouncements[currentIndex]

  // Auto-rotate announcements
  useEffect(() => {
    if (isPaused || visibleAnnouncements.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % visibleAnnouncements.length)
    }, 5000) // Change every 5 seconds

    return () => clearInterval(interval)
  }, [isPaused, visibleAnnouncements.length])

  // Reset index if current announcement is dismissed
  useEffect(() => {
    if (currentIndex >= visibleAnnouncements.length && visibleAnnouncements.length > 0) {
      setCurrentIndex(0)
    }
  }, [currentIndex, visibleAnnouncements.length])

  const handlePrevious = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? visibleAnnouncements.length - 1 : prev - 1
    )
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % visibleAnnouncements.length)
  }

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => [...prev, id])
    
    // If we dismissed the last announcement, hide the banner
    if (visibleAnnouncements.length === 1) {
      setIsVisible(false)
    }
  }

  if (!isVisible || visibleAnnouncements.length === 0 || !currentAnnouncement) {
    return null
  }

  const variantStyles = {
    default: 'bg-black text-white hover:bg-gray-900',
    urgent: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
    premium: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
  }

  const Content = () => (
    <div className="flex items-center justify-center gap-2 sm:gap-3 py-3 px-4">
      {/* Icon */}
      {currentAnnouncement.icon && (
        <currentAnnouncement.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
      )}
      
      {/* Title */}
      <span className="font-bold text-xs sm:text-sm tracking-wide">
        {currentAnnouncement.title}
      </span>
      
      {/* CTA */}
      {currentAnnouncement.cta && (
        <>
          <span className="text-xs sm:text-sm opacity-50">→</span>
          <span className="text-xs sm:text-sm underline underline-offset-2 font-medium whitespace-nowrap">
            {currentAnnouncement.cta}
          </span>
        </>
      )}
    </div>
  )

  return (
    <div 
      className={cn(
        "relative transition-all duration-300 ease-in-out",
        variantStyles[currentAnnouncement.variant],
        className
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Navigation arrows - only show if multiple announcements */}
      {visibleAnnouncements.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 h-8 w-8 text-white hover:bg-white/10 z-10 hidden sm:flex"
            onClick={handlePrevious}
            aria-label="Previous announcement"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-10 sm:right-12 top-1/2 -translate-y-1/2 h-8 w-8 text-white hover:bg-white/10 z-10 hidden sm:flex"
            onClick={handleNext}
            aria-label="Next announcement"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Dismiss button - only for dismissible announcements */}
      {currentAnnouncement.dismissible && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-white hover:bg-white/10 z-10"
          onClick={() => handleDismiss(currentAnnouncement.id)}
          aria-label="Dismiss announcement"
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      {/* Content - wrapped in Link if href provided */}
      {currentAnnouncement.href ? (
        currentAnnouncement.href.startsWith('http') ? (
          <a href={currentAnnouncement.href} target="_blank" rel="noopener noreferrer" className="block">
            <Content />
          </a>
        ) : (
          <Link href={currentAnnouncement.href} className="block">
            <Content />
          </Link>
        )
      ) : (
        <Content />
      )}

      {/* Progress indicator - only show if multiple announcements */}
      {visibleAnnouncements.length > 1 && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
          <div 
            className="h-full bg-white transition-all duration-300 ease-in-out"
            style={{ 
              width: `${((currentIndex + 1) / visibleAnnouncements.length) * 100}%` 
            }}
          />
        </div>
      )}
    </div>
  )
}