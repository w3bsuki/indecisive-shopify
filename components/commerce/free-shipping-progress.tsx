'use client'

import { useMemo } from 'react'
import { Truck } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FreeShippingProgressProps {
  currentAmount: number
  currency: string
  className?: string
  compact?: boolean
}

const FREE_SHIPPING_THRESHOLDS: Record<string, number> = {
  USD: 100,
  EUR: 90,
  GBP: 80,
  BGN: 100,
  CAD: 125,
  AUD: 150,
}

export function FreeShippingProgress({ currentAmount, currency, className }: FreeShippingProgressProps) {
  const threshold = FREE_SHIPPING_THRESHOLDS[currency] || 100
  const progress = Math.min((currentAmount / threshold) * 100, 100)
  const remaining = Math.max(threshold - currentAmount, 0)
  const hasQualified = remaining === 0

  const formattedRemaining = useMemo(() => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    return formatter.format(remaining)
  }, [remaining, currency])

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Truck className={cn("h-4 w-4", hasQualified ? "text-green-600" : "text-gray-600")} />
          <span className={cn("font-medium", hasQualified ? "text-green-600" : "text-gray-700")}>
            {hasQualified ? (
              "You've unlocked free shipping!"
            ) : (
              <>Add <span className="font-bold">{formattedRemaining}</span> for free shipping</>
            )}
          </span>
        </div>
      </div>
      
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={cn(
            "absolute inset-y-0 left-0 transition-all duration-500 ease-out rounded-full",
            hasQualified ? "bg-green-600" : "bg-black"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}