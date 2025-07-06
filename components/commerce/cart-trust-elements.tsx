'use client'

import { Shield, RotateCcw, CreditCard, Award, Truck, HeadphonesIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface TrustElementsProps {
  className?: string
  variant?: 'full' | 'compact' | 'minimal'
}

export function CartTrustElements({ className, variant = 'compact' }: TrustElementsProps) {
  const trustBadges = [
    {
      icon: <Shield className="w-4 h-4" />,
      title: 'Secure Checkout',
      description: '256-bit SSL encryption',
      color: 'text-green-600'
    },
    {
      icon: <RotateCcw className="w-4 h-4" />,
      title: '30-Day Returns',
      description: 'Easy returns & exchanges',
      color: 'text-blue-600'
    },
    {
      icon: <CreditCard className="w-4 h-4" />,
      title: 'Secure Payments',
      description: 'PayPal, Apple Pay, Credit Cards',
      color: 'text-purple-600'
    },
    {
      icon: <Truck className="w-4 h-4" />,
      title: 'Fast Shipping',
      description: 'Free on orders $75+',
      color: 'text-orange-600'
    }
  ]

  const customerReviews = [
    {
      name: 'Sarah M.',
      review: 'Amazing quality and fast shipping!',
      rating: 5,
      verified: true
    },
    {
      name: 'Jake T.',
      review: 'Perfect fit, exactly as described.',
      rating: 5,
      verified: true
    },
    {
      name: 'Emily R.',
      review: 'Love the style and comfort!',
      rating: 5,
      verified: true
    }
  ]

  const securityLogos = [
    { name: 'Shopify', logo: '🛡️' },
    { name: 'SSL', logo: '🔒' },
    { name: 'PayPal', logo: '💳' },
    { name: 'Stripe', logo: '⚡' }
  ]

  if (variant === 'minimal') {
    return (
      <div className={cn("space-y-3", className)}>
        {/* Security Icons Only */}
        <div className="flex items-center justify-center gap-4 py-2">
          {securityLogos.map((logo) => (
            <div key={logo.name} className="flex items-center gap-1 text-xs text-gray-600">
              <span className="text-lg">{logo.logo}</span>
              <span className="font-mono">{logo.name}</span>
            </div>
          ))}
        </div>
        
        {/* Simple Trust Message */}
        <p className="text-xs text-center text-gray-600 font-mono">
          Secure checkout • 30-day returns • Free shipping $75+
        </p>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={cn("space-y-4", className)}>
        {/* Trust Badges Grid */}
        <div className="grid grid-cols-2 gap-2">
          {trustBadges.map((badge, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <div className={cn("flex-shrink-0", badge.color)}>
                {badge.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-xs">{badge.title}</p>
                <p className="text-xs text-gray-600 truncate">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Customer Satisfaction */}
        <Card className="border border-gray-200">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-600" />
                <span className="font-mono font-bold text-xs uppercase">Customer Love</span>
              </div>
              <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                4.9/5 ⭐
              </Badge>
            </div>
            
            <div className="space-y-2">
              {customerReviews.slice(0, 2).map((review, index) => (
                <div key={index} className="text-xs">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="font-medium">{review.name}</span>
                    {review.verified && (
                      <Badge variant="outline" className="text-xs px-1 py-0">✓</Badge>
                    )}
                  </div>
                  <p className="text-gray-600 italic">&ldquo;{review.review}&rdquo;</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Full variant
  return (
    <div className={cn("space-y-6", className)}>
      {/* Trust Badges */}
      <div className="space-y-3">
        <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-gray-700">
          Why Shop With Us
        </h3>
        
        <div className="grid grid-cols-1 gap-3">
          {trustBadges.map((badge, index) => (
            <Card key={index} className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={cn("flex items-center justify-center w-10 h-10 bg-gray-50 rounded-full", badge.color)}>
                    {badge.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{badge.title}</h4>
                    <p className="text-xs text-gray-600">{badge.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Customer Reviews */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-gray-700">
            Customer Reviews
          </h3>
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
            <span className="text-xs text-gray-600 font-mono">4.9/5 (2,847 reviews)</span>
          </div>
        </div>
        
        <div className="space-y-2">
          {customerReviews.map((review, index) => (
            <Card key={index} className="border border-gray-200">
              <CardContent className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{review.name}</span>
                    {review.verified && (
                      <Badge variant="outline" className="text-xs">
                        Verified Purchase
                      </Badge>
                    )}
                  </div>
                  <div className="flex">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <span key={i} className="text-yellow-500 text-xs">⭐</span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-700 italic">&ldquo;{review.review}&rdquo;</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Support Info */}
      <Card className="border border-gray-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <HeadphonesIcon className="w-5 h-5 text-blue-600" />
            <div>
              <h4 className="font-medium text-sm">Need Help?</h4>
              <p className="text-xs text-gray-600">
                Chat support available 24/7 • support@indecisivewear.com
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Logos */}
      <div className="text-center space-y-2">
        <p className="text-xs text-gray-600 font-mono uppercase tracking-wider">Secured By</p>
        <div className="flex items-center justify-center gap-4">
          {securityLogos.map((logo) => (
            <div key={logo.name} className="flex flex-col items-center gap-1">
              <span className="text-2xl">{logo.logo}</span>
              <span className="text-xs text-gray-500 font-mono">{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}