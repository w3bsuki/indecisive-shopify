'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles, Clock, Star, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface PromotionalBannerProps {
  type: 'collection' | 'category' | 'sale' | 'new' | 'featured'
  title: string
  subtitle?: string
  description?: string
  buttonText?: string
  buttonHref?: string
  badge?: string
  urgency?: string
  className?: string
  variant?: 'default' | 'dark' | 'gradient' | 'minimal'
}

export function PromotionalBanner({
  type,
  title,
  subtitle,
  description,
  buttonText,
  buttonHref,
  badge,
  urgency,
  className,
  variant = 'default'
}: PromotionalBannerProps) {
  const getIcon = () => {
    switch (type) {
      case 'sale':
        return Tag
      case 'new':
        return Sparkles
      case 'featured':
        return Star
      default:
        return null
    }
  }

  const Icon = getIcon()

  const variantStyles = {
    default: 'bg-gradient-to-r from-gray-50 to-white border border-gray-200',
    dark: 'bg-gradient-to-r from-gray-900 to-black text-white',
    gradient: 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white',
    minimal: 'bg-white border-t border-b border-gray-200'
  }

  const buttonVariants = {
    default: 'bg-black text-white hover:bg-gray-800',
    dark: 'bg-white text-black hover:bg-gray-100',
    gradient: 'bg-white text-gray-900 hover:bg-gray-100',
    minimal: 'bg-black text-white hover:bg-gray-800'
  }

  return (
    <div className={cn(
      'relative overflow-hidden',
      variantStyles[variant],
      className
    )}>
      {/* Background Pattern (optional) */}
      {variant === 'gradient' && (
        <div className="absolute inset-0 bg-black/10" />
      )}
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="text-center">
          {/* Badge */}
          {badge && (
            <Badge 
              variant={variant === 'dark' || variant === 'gradient' ? 'secondary' : 'default'}
              className="mb-4 px-3 py-1 text-xs font-mono font-bold tracking-wider"
            >
              {badge}
            </Badge>
          )}

          {/* Icon */}
          {Icon && (
            <div className="flex justify-center mb-4">
              <div className={cn(
                'p-3 rounded-full',
                variant === 'dark' || variant === 'gradient' 
                  ? 'bg-white/10' 
                  : 'bg-black/5'
              )}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          )}

          {/* Title */}
          <h2 className="text-2xl lg:text-4xl font-bold font-mono tracking-tight mb-4">
            {title}
          </h2>

          {/* Subtitle */}
          {subtitle && (
            <p className={cn(
              'text-lg lg:text-xl font-medium mb-4',
              variant === 'dark' || variant === 'gradient' 
                ? 'text-white/90' 
                : 'text-gray-700'
            )}>
              {subtitle}
            </p>
          )}

          {/* Description */}
          {description && (
            <p className={cn(
              'text-base max-w-2xl mx-auto mb-6',
              variant === 'dark' || variant === 'gradient' 
                ? 'text-white/80' 
                : 'text-gray-600'
            )}>
              {description}
            </p>
          )}

          {/* Urgency */}
          {urgency && (
            <div className="flex items-center justify-center gap-2 mb-6">
              <Clock className="w-4 h-4" />
              <span className={cn(
                'text-sm font-medium',
                variant === 'dark' || variant === 'gradient' 
                  ? 'text-white/90' 
                  : 'text-gray-700'
              )}>
                {urgency}
              </span>
            </div>
          )}

          {/* Call to Action */}
          {buttonText && buttonHref && (
            <Link href={buttonHref}>
              <Button 
                size="lg"
                className={cn(
                  'px-8 py-3 font-mono font-bold tracking-wide group',
                  buttonVariants[variant]
                )}
              >
                {buttonText}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

// Preset banner configurations for common use cases
export const PromotionalBanners = {
  NewCollection: (props: Partial<PromotionalBannerProps>) => (
    <PromotionalBanner
      type="new"
      title="NEW ARRIVALS"
      subtitle="Fresh drops weekly"
      description="Discover the latest in streetwear fashion. Minimal designs, premium quality."
      buttonText="SHOP NEW"
      buttonHref="/new"
      badge="JUST DROPPED"
      variant="dark"
      {...props}
    />
  ),
  
  SaleCollection: (props: Partial<PromotionalBannerProps>) => (
    <PromotionalBanner
      type="sale"
      title="UP TO 50% OFF"
      subtitle="End of season sale"
      description="Don't miss out on your favorite pieces at unbeatable prices."
      buttonText="SHOP SALE"
      buttonHref="/sale"
      badge="LIMITED TIME"
      urgency="Sale ends in 3 days"
      variant="gradient"
      {...props}
    />
  ),
  
  FeaturedCollection: (props: Partial<PromotionalBannerProps>) => (
    <PromotionalBanner
      type="featured"
      title="STREET ESSENTIALS"
      subtitle="Wardrobe staples redefined"
      description="Build your perfect minimalist wardrobe with our carefully curated essentials."
      buttonText="EXPLORE COLLECTION"
      buttonHref="/collections/essentials"
      badge="CUSTOMER FAVORITE"
      variant="minimal"
      {...props}
    />
  ),
  
  CategoryBanner: (category: string, props: Partial<PromotionalBannerProps> = {}) => (
    <PromotionalBanner
      type="collection"
      title={category.toUpperCase()}
      subtitle="Curated for the indecisive"
      description={`Discover our ${category.toLowerCase()} collection designed for those who value quality and style.`}
      buttonText={`SHOP ${category.toUpperCase()}`}
      buttonHref={`/collections/${category.toLowerCase()}`}
      variant="default"
      {...props}
    />
  )
}