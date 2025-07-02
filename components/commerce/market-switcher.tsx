'use client'

import React from 'react'
import { ChevronDown } from 'lucide-react'
import { useMarket } from '@/hooks/use-market'
import { SUPPORTED_MARKETS } from '@/lib/shopify/markets'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MarketSwitcherProps {
  className?: string
  variant?: 'default' | 'mobile'
}

export function MarketSwitcher({ className, variant = 'default' }: MarketSwitcherProps) {
  const { market, setMarket, isLoading } = useMarket()

  if (isLoading) {
    return (
      <div className={cn('flex items-center space-x-2', className)}>
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    )
  }

  const handleMarketChange = (marketId: string) => {
    const newMarket = SUPPORTED_MARKETS.find(m => m.id === marketId)
    if (newMarket) {
      setMarket(newMarket)
      // Reload the page to fetch new market prices
      window.location.reload()
    }
  }

  if (variant === 'mobile') {
    return (
      <div className={cn('space-y-2', className)}>
        <div className="text-sm font-medium">Region & Currency</div>
        <select
          value={market.id}
          onChange={(e) => handleMarketChange(e.target.value)}
          className="w-full p-3 border border-black bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black"
        >
          {SUPPORTED_MARKETS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.flag} {m.name} ({m.currencyCode})
            </option>
          ))}
        </select>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn('flex items-center space-x-2', className)}
        >
          <span className="text-base">{market.flag}</span>
          <span className="text-sm font-medium">{market.currencyCode}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Select Region</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {SUPPORTED_MARKETS.map((m) => (
          <DropdownMenuItem
            key={m.id}
            onClick={() => handleMarketChange(m.id)}
            className={cn(
              'flex items-center justify-between cursor-pointer',
              market.id === m.id && 'bg-accent'
            )}
          >
            <span className="flex items-center space-x-2">
              <span>{m.flag}</span>
              <span>{m.name}</span>
            </span>
            <span className="text-sm text-muted-foreground">{m.currencyCode}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}