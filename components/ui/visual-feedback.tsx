'use client'

import { cn } from '@/lib/utils'
import { Check, Heart, Star, ShoppingCart, Eye, Share } from 'lucide-react'
import { useState, useEffect } from 'react'

interface SuccessAnimationProps {
  show: boolean
  onComplete?: () => void
  className?: string
}

export function SuccessAnimation({ show, onComplete, className }: SuccessAnimationProps) {
  useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(onComplete, 600)
      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  return (
    <div
      className={cn(
        "fixed inset-0 flex items-center justify-center z-50 pointer-events-none",
        show ? "opacity-100" : "opacity-0",
        className
      )}
    >
      <div className={cn(
        "bg-white rounded-full p-6 shadow-lg",
        show && "success-bounce"
      )}>
        <Check className="w-8 h-8 text-green-600" />
      </div>
    </div>
  )
}

interface AddToCartFeedbackProps {
  show: boolean
  productName?: string
  onComplete?: () => void
}

export function AddToCartFeedback({ show, productName, onComplete }: AddToCartFeedbackProps) {
  useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(onComplete, 2000)
      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 transition-all duration-300",
        show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}
    >
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-start gap-3">
          <div className="bg-green-100 rounded-full p-2">
            <ShoppingCart className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Added to cart</p>
            {productName && (
              <p className="text-sm text-gray-600 mt-1">{productName}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface WishlistHeartProps {
  isLiked: boolean
  onClick: () => void
  className?: string
}

export function WishlistHeart({ isLiked, onClick, className }: WishlistHeartProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = () => {
    setIsAnimating(true)
    onClick()
    setTimeout(() => setIsAnimating(false), 400)
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "wishlist-heart touch-feedback",
        isLiked && "active",
        isAnimating && "heart-beat",
        className
      )}
    >
      <Heart 
        className={cn(
          "w-5 h-5 transition-all duration-200",
          isLiked ? "fill-current text-red-500" : "text-gray-400 hover:text-red-500"
        )} 
      />
    </button>
  )
}

interface InteractiveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'accent' | 'modern'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  success?: boolean
  children: React.ReactNode
}

export function InteractiveButton({
  variant = 'default',
  size = 'md',
  loading = false,
  success = false,
  className,
  children,
  ...props
}: InteractiveButtonProps) {
  const baseClasses = cn(
    "relative overflow-hidden font-medium transition-all",
    "interactive-element touch-feedback",
    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    loading && "btn-loading",
    success && "success-bounce"
  )

  const variantClasses = {
    default: "bg-gray-950 text-white hover:bg-gray-800",
    accent: "btn-accent text-white",
    modern: "btn-modern bg-white border border-gray-300 hover:border-gray-950"
  }

  const sizeClasses = {
    sm: "px-3 py-2 text-sm rounded-md",
    md: "px-4 py-2 text-base rounded-lg",
    lg: "px-6 py-3 text-lg rounded-xl"
  }

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

interface ProductCardInteractiveProps {
  onQuickView?: () => void
  onAddToWishlist?: () => void
  onShare?: () => void
  isWishlisted?: boolean
  className?: string
}

export function ProductCardInteractive({
  onQuickView,
  onAddToWishlist,
  onShare,
  isWishlisted = false,
  className
}: ProductCardInteractiveProps) {
  return (
    <div className={cn(
      "absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
      className
    )}>
      {onQuickView && (
        <button
          onClick={onQuickView}
          className="bg-white/90 hover:bg-white rounded-full p-2 shadow-sm interactive-element"
          aria-label="Quick view"
        >
          <Eye className="w-4 h-4 text-gray-700" />
        </button>
      )}
      
      {onAddToWishlist && (
        <WishlistHeart
          isLiked={isWishlisted}
          onClick={onAddToWishlist}
          className="bg-white/90 hover:bg-white rounded-full p-2 shadow-sm"
        />
      )}
      
      {onShare && (
        <button
          onClick={onShare}
          className="bg-white/90 hover:bg-white rounded-full p-2 shadow-sm interactive-element"
          aria-label="Share product"
        >
          <Share className="w-4 h-4 text-gray-700" />
        </button>
      )}
    </div>
  )
}

interface RatingStarsProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onRatingChange?: (rating: number) => void
}

export function RatingStars({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onRatingChange
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  const handleStarClick = (starRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating)
    }
  }

  return (
    <div className="flex gap-1">
      {Array.from({ length: maxRating }).map((_, index) => {
        const starRating = index + 1
        const isActive = starRating <= (hoverRating || rating)
        
        return (
          <button
            key={index}
            onClick={() => handleStarClick(starRating)}
            onMouseEnter={() => interactive && setHoverRating(starRating)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={cn(
              interactive && "interactive-element cursor-pointer",
              !interactive && "cursor-default"
            )}
            disabled={!interactive}
          >
            <Star
              className={cn(
                sizeClasses[size],
                "transition-colors duration-150",
                isActive 
                  ? "fill-yellow-400 text-yellow-400" 
                  : "text-gray-300"
              )}
            />
          </button>
        )
      })}
    </div>
  )
}

interface ProgressIndicatorProps {
  progress: number
  className?: string
  showLabel?: boolean
}

export function ProgressIndicator({ progress, className, showLabel = false }: ProgressIndicatorProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {showLabel && (
        <div className="text-sm text-gray-600">{Math.round(progress)}%</div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-blue-500 to-teal-500 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  )
}