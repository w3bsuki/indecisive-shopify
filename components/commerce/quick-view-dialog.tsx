'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ShoppingCart, ExternalLink } from 'lucide-react'
import type { ShopifyProduct, ShopifyProductVariant } from '@/lib/shopify/types'
import { useCart } from '@/hooks/use-cart'
import { useMarket } from '@/hooks/use-market'
import { VariantSelector } from './variant-selector'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

interface QuickViewDialogProps {
  product: ShopifyProduct
  children: React.ReactNode
}

export function QuickViewDialog({ product, children }: QuickViewDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<ShopifyProductVariant | undefined>()
  const { addItem, cartReady, status } = useCart()
  const { formatPrice } = useMarket()
  const [isAdding, setIsAdding] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // Initialize selected variant for single variant products
  useEffect(() => {
    if (product.variants?.edges?.length === 1) {
      setSelectedVariant(product.variants?.edges?.[0]?.node)
    }
  }, [product])

  // Get all images
  const images = product.images?.edges.map(edge => edge.node) || 
    (product.featuredImage ? [product.featuredImage] : [])
  const selectedImage = images[selectedImageIndex]

  // Get price based on selected variant
  const price = selectedVariant
    ? formatPrice(selectedVariant.price.amount, selectedVariant.price.currencyCode)
    : product.priceRange.minVariantPrice.amount === product.priceRange.maxVariantPrice.amount
    ? formatPrice(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)
    : `${formatPrice(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)} - ${formatPrice(product.priceRange.maxVariantPrice.amount, product.priceRange.maxVariantPrice.currencyCode)}`

  const handleAddToCart = () => {
    if (!selectedVariant || !selectedVariant.availableForSale || !cartReady) return

    setIsAdding(true)
    try {
      addItem(selectedVariant.id, 1)
      // Close dialog after a delay since addItem is not async
      setTimeout(() => {
        setIsOpen(false)
        setIsAdding(false)
      }, 1500)
    } catch (_error) {
      setIsAdding(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="w-[calc(100%-1rem)] md:max-w-2xl max-h-[90vh] md:h-auto border border-black rounded-none mx-2 md:mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg md:text-xl font-bold">{product.title}</DialogTitle>
        </DialogHeader>
        
        {/* Mobile Layout */}
        <div className="md:hidden">
          <div className="space-y-3">
            {/* Price */}
            <div>
              <p className="text-xl font-bold text-gray-900">{price}</p>
            </div>
            
            {/* Compact Image */}
            <div className="aspect-[3/2] bg-gray-100 overflow-hidden relative border border-gray-200">
              {selectedImage ? (
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.altText || product.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <div className="text-3xl mb-1">👕</div>
                    <div className="text-xs">No image</div>
                  </div>
                </div>
              )}
            </div>

            {/* Variant Selection */}
            {product.options?.length > 0 && (
              <div>
                <VariantSelector
                  options={product.options}
                  variants={product.variants?.edges?.map(e => e.node) || []}
                  onVariantChange={setSelectedVariant}
                />
              </div>
            )}

            {/* Buttons */}
            <div className="space-y-2">
              <Button
                onClick={handleAddToCart}
                disabled={isAdding || !selectedVariant || !selectedVariant.availableForSale || !cartReady || status === 'updating'}
                className="w-full min-h-[48px] text-base font-medium bg-black hover:bg-gray-900 border border-black"
              >
                {isAdding || status === 'updating' ? (
                  <>
                    <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Adding...
                  </>
                ) : !selectedVariant ? (
                  'Select options'
                ) : !selectedVariant.availableForSale ? (
                  'Out of stock'
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to cart
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full min-h-[44px] text-sm border border-gray-200 hover:border-black" 
                asChild
              >
                <Link href={`/products/${product.handle}`}>
                  <ExternalLink className="w-4 h-4 mr-1" />
                  View full details
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Layout - RESTORED ORIGINAL */}
        <div className="hidden md:block">
          <div className="grid grid-cols-2 gap-6">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 overflow-hidden relative border border-gray-200">
                {selectedImage ? (
                  <Image
                    src={selectedImage.url}
                    alt={selectedImage.altText || product.title}
                    fill
                    className="object-cover"
                    sizes="400px"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="text-center">
                      <div className="text-4xl mb-2">👕</div>
                      <div className="text-sm">No image available</div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Image thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={cn(
                        "relative w-16 h-16 flex-shrink-0 overflow-hidden border transition-colors",
                        selectedImageIndex === index ? 'border-black' : 'border-gray-200'
                      )}
                    >
                      <Image
                        src={image.url}
                        alt={image.altText || `${product.title} ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">{product.title}</h2>
                <p className="text-2xl font-bold text-gray-900 mt-2">{price}</p>
              </div>

              {product.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-600 text-sm line-clamp-4">{product.description}</p>
                </div>
              )}

              {/* Variant Selection */}
              {product.options?.length > 0 && (
                <div className="border-t-2 border-gray-200 pt-4">
                  <VariantSelector
                    options={product.options}
                    variants={product.variants?.edges?.map(e => e.node) || []}
                    onVariantChange={setSelectedVariant}
                  />
                </div>
              )}

              {/* Add to Cart */}
              <div className="space-y-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={isAdding || !selectedVariant || !selectedVariant.availableForSale || !cartReady || status === 'updating'}
                  className="w-full min-h-[48px] text-base font-medium bg-black hover:bg-gray-900 border border-black hover:border-gray-900"
                  size="lg"
                >
                  {isAdding || status === 'updating' ? (
                    <>
                      <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Adding to cart...
                    </>
                  ) : !selectedVariant ? (
                    'Select options'
                  ) : !selectedVariant.availableForSale ? (
                    'Out of stock'
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to cart
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full min-h-[48px] text-base border border-gray-200 hover:border-black" 
                  asChild
                >
                  <Link href={`/products/${product.handle}`}>
                    <ExternalLink className="w-5 h-5 mr-2" />
                    View full details
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}