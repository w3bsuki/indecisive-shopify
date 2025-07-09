'use client'

import { BuyNowButton as HydrogenBuyNowButton } from '@shopify/hydrogen-react'
import { ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BuyNowButtonProps {
  variantId: string
  quantity?: number
  className?: string
  children?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'secondary' | 'outline'
  disabled?: boolean
  attributes?: Array<{ key: string; value: string }>
}

export function BuyNowButton({
  variantId,
  quantity = 1,
  className,
  children,
  size = 'md',
  variant = 'default',
  disabled = false,
  attributes = []
}: BuyNowButtonProps) {
  return (
    <HydrogenBuyNowButton
      variantId={variantId}
      quantity={quantity}
      attributes={attributes}
      disabled={disabled}
      className={cn(
        // Base button styles
        'inline-flex items-center justify-center gap-2 font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'disabled:pointer-events-none disabled:opacity-50',
        
        // Size variants
        size === 'sm' && 'h-9 px-3 text-sm',
        size === 'md' && 'h-10 px-4 py-2',
        size === 'lg' && 'h-11 px-8 text-lg',
        
        // Color variants
        variant === 'default' && 'bg-primary text-primary-foreground hover:bg-primary/90',
        variant === 'secondary' && 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        variant === 'outline' && 'border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground',
        
        className
      )}
    >
      <ShoppingBag className="h-4 w-4" />
      {children || 'Buy Now'}
    </HydrogenBuyNowButton>
  )
}

// Quick purchase variant with minimal styling
export function QuickBuyButton({
  variantId,
  quantity = 1,
  className,
  disabled = false
}: Pick<BuyNowButtonProps, 'variantId' | 'quantity' | 'className' | 'disabled'>) {
  return (
    <BuyNowButton
      variantId={variantId}
      quantity={quantity}
      size="sm"
      variant="outline"
      className={cn('w-full', className)}
      disabled={disabled}
    >
      Quick Buy
    </BuyNowButton>
  )
}

// Premium buy now button with enhanced styling
export function PremiumBuyNowButton({
  variantId,
  quantity = 1,
  className,
  disabled = false,
  price
}: Pick<BuyNowButtonProps, 'variantId' | 'quantity' | 'className' | 'disabled'> & {
  price?: string
}) {
  return (
    <BuyNowButton
      variantId={variantId}
      quantity={quantity}
      size="lg"
      variant="default"
      className={cn(
        'w-full bg-gradient-to-r from-primary to-primary/80',
        'hover:from-primary/90 hover:to-primary/70',
        'shadow-lg hover:shadow-xl transition-all duration-200',
        className
      )}
      disabled={disabled}
    >
      <div className="flex flex-col items-center">
        <span className="font-bold">Buy Now</span>
        {price && (
          <span className="text-xs opacity-90">{price}</span>
        )}
      </div>
    </BuyNowButton>
  )
}