'use client'

import { useState, useEffect, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Dices, RefreshCw, ShoppingCart, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ShopifyProduct } from '@/lib/shopify/types'
import Image from 'next/image'
import Link from 'next/link'
import { useMarket } from '@/hooks/use-market'
import { QuickViewDialog } from './quick-view-dialog-v2'

interface IndecisiveActionsProps {
  products: ShopifyProduct[]
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function IndecisiveActions({ products, isOpen, onOpenChange }: IndecisiveActionsProps) {
  const [selectedProduct, setSelectedProduct] = useState<ShopifyProduct | null>(null)
  const [isFlipping, setIsFlipping] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const { formatPrice } = useMarket()

  const flipForProduct = useCallback(() => {
    if (products.length === 0 || isFlipping) return

    setIsFlipping(true)
    setShowResult(false)

    // Simulate coin flip animation
    let flipCount = 0
    const maxFlips = 15
    const flipInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * products.length)
      setSelectedProduct(products[randomIndex])
      flipCount++

      if (flipCount >= maxFlips) {
        clearInterval(flipInterval)
        setIsFlipping(false)
        setShowResult(true)
      }
    }, 100)
  }, [products, isFlipping])

  // Auto-flip when dialog opens
  useEffect(() => {
    if (isOpen && !selectedProduct) {
      flipForProduct()
    }
  }, [isOpen, selectedProduct, flipForProduct])

  const price = selectedProduct
    ? formatPrice(
        selectedProduct.priceRange.minVariantPrice.amount,
        selectedProduct.priceRange.minVariantPrice.currencyCode
      )
    : ''

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] md:max-w-2xl max-h-[90vh] border border-gray-200 rounded-none p-0 overflow-hidden">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-10 w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-sm hover:bg-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 md:p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl md:text-3xl font-mono text-center">
              CAN&apos;T DECIDE?
            </DialogTitle>
            <p className="text-center text-gray-600 mt-2">
              Let fate choose your next favorite piece
            </p>
          </DialogHeader>

          {/* Coin Flip Animation Area */}
          <div className="flex flex-col items-center justify-center space-y-6">
            {!selectedProduct || isFlipping ? (
              <div className="w-32 h-32 md:w-40 md:h-40 relative">
                <div className={cn(
                  "absolute inset-0 bg-black rounded-full flex items-center justify-center",
                  isFlipping && "animate-spin"
                )}>
                  <Dices className="w-16 h-16 md:w-20 md:h-20 text-white" />
                </div>
              </div>
            ) : (
              <div className={cn(
                "transition-all duration-500",
                showResult ? "opacity-100 scale-100" : "opacity-0 scale-95"
              )}>
                {/* Product Result */}
                <div className="bg-gray-50 p-4 md:p-6 space-y-4">
                  {/* Product Image */}
                  <div className="relative aspect-[3/4] w-48 md:w-64 mx-auto bg-white">
                    {selectedProduct.featuredImage ? (
                      <Image
                        src={selectedProduct.featuredImage.url}
                        alt={selectedProduct.featuredImage.altText || selectedProduct.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 192px, 256px"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-300">
                        <div className="text-center">
                          <div className="text-4xl mb-2">👕</div>
                          <div className="text-sm">No image</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="text-center space-y-2">
                    <h3 className="font-mono text-lg uppercase">
                      {selectedProduct.title}
                    </h3>
                    <p className="text-xl font-bold">
                      {price}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <QuickViewDialog product={selectedProduct}>
                      <Button className="flex-1 h-12 bg-black hover:bg-gray-900 text-white">
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        QUICK VIEW
                      </Button>
                    </QuickViewDialog>
                    
                    <Button
                      variant="outline"
                      className="flex-1 h-12"
                      asChild
                    >
                      <Link href={`/products/${selectedProduct.handle}`}>
                        VIEW DETAILS
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Flip Again Button */}
            <Button
              onClick={flipForProduct}
              disabled={isFlipping}
              variant="outline"
              className="h-12 px-8 font-mono"
            >
              {isFlipping ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  FLIPPING...
                </>
              ) : (
                <>
                  <Dices className="w-5 h-5 mr-2" />
                  FLIP AGAIN
                </>
              )}
            </Button>

            {/* Fun Messages */}
            <div className="text-center text-sm text-gray-500 font-mono">
              {isFlipping && "CONSULTING THE FASHION GODS..."}
              {showResult && "DESTINY HAS SPOKEN!"}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Hook to use indecisive actions
export function useIndecisiveActions() {
  const [isOpen, setIsOpen] = useState(false)

  const openRandomizer = () => setIsOpen(true)
  const closeRandomizer = () => setIsOpen(false)

  return {
    isOpen,
    openRandomizer,
    closeRandomizer,
    setIsOpen
  }
}