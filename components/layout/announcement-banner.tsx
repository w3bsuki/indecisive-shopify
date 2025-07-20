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
    <div className="flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-12 sm:px-16 min-h-[40px] sm:min-h-[48px] relative">
      {/* Icon */}
      {currentAnnouncement.icon && (
        <currentAnnouncement.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
      )}
      
      {/* Title */}
      <span className="font-semibold text-xs sm:text-sm tracking-wider">
        {currentAnnouncement.title}
      </span>
      
      {/* CTA */}
      {currentAnnouncement.cta && (
        <>
          <span className="text-xs sm:text-sm opacity-60 hidden sm:inline mx-1">·</span>
          <span className="text-xs sm:text-sm underline underline-offset-4 decoration-1 font-medium whitespace-nowrap hidden sm:inline hover:opacity-80 transition-opacity">
            {currentAnnouncement.cta}
          </span>
        </>
      )}
    </div>
  )

  return (
    <div 
      className={cn(
        "relative transition-all duration-300 ease-in-out overflow-hidden",
        variantStyles[currentAnnouncement.variant],
        className
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Navigation controls container */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none z-10">
        {/* Left arrow - only show if multiple announcements */}
        {visibleAnnouncements.length > 1 && (
          <Button
            variant="ghost"
            size="icon"
            className="ml-1 sm:ml-2 h-8 w-8 sm:h-9 sm:w-9 text-white hover:bg-white/20 pointer-events-auto transition-all duration-200 opacity-80 hover:opacity-100 border-0 shadow-none"
            onClick={handlePrevious}
            aria-label="Previous announcement"
          >
            <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        )}

        {/* Right side controls */}
        <div className="flex items-center gap-1">
          {/* Next arrow - only show if multiple announcements */}
          {visibleAnnouncements.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 sm:h-9 sm:w-9 text-white hover:bg-white/20 pointer-events-auto transition-all duration-200 opacity-80 hover:opacity-100 border-0 shadow-none"
              onClick={handleNext}
              aria-label="Next announcement"
            >
              <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          )}

          {/* Dismiss button - only for dismissible announcements */}
          {currentAnnouncement.dismissible && (
            <Button
              variant="ghost"
              size="icon"
              className="mr-1 sm:mr-2 h-8 w-8 sm:h-9 sm:w-9 text-white hover:bg-white/20 pointer-events-auto transition-all duration-200 opacity-80 hover:opacity-100 border-0 shadow-none"
              onClick={() => handleDismiss(currentAnnouncement.id)}
              aria-label="Dismiss announcement"
            >
              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          )}
        </div>
      </div>

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
        <div className="absolute bottom-0 left-0 h-0.5 bg-white/70 transition-all duration-300 ease-in-out"
          style={{ 
            width: `${((currentIndex + 1) / visibleAnnouncements.length) * 100}%` 
          }}
        />
      )}
    </div>
  )
}