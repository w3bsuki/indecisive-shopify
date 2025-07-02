'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ShoppingCart, X, Truck, Shield, Heart } from 'lucide-react'
import type { ShopifyProduct, ShopifyProductVariant } from '@/lib/shopify/types'
import { useCart } from '@/hooks/use-cart'
import { useWishlist } from '@/hooks/use-wishlist'
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
  const { toggleItem, isInWishlist } = useWishlist()
  const { formatPrice } = useMarket()
  const [isAdding, setIsAdding] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  
  const isWishlisted = isInWishlist(product.id)

  // Initialize selected variant for single variant products
  useEffect(() => {
    if (product.variants.edges.length === 1) {
      setSelectedVariant(product.variants.edges[0].node)
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
      addItem(selectedVariant.id, quantity)
      // Show success briefly before closing
      setTimeout(() => {
        setIsOpen(false)
        setIsAdding(false)
        setQuantity(1) // Reset quantity
      }, 1000)
    } catch (_error) {
      setIsAdding(false)
    }
  }

  const handleWishlist = () => {
    toggleItem({
      id: product.id,
      handle: product.handle,
      title: product.title,
      image: product.featuredImage?.url,
      price: product.priceRange.minVariantPrice.amount
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="w-[calc(100%-2rem)] md:max-w-4xl lg:max-w-5xl max-h-[90vh] md:h-auto border border-gray-200 rounded-none p-0 overflow-hidden">
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 z-10 w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-sm hover:bg-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Mobile Layout */}
        <div className="md:hidden overflow-y-auto max-h-[90vh]">
          <div className="space-y-4 p-4">
            {/* Product Title & Price */}
            <div>
              <h2 className="text-xl font-medium mb-2">{product.title}</h2>
              <p className="text-xl font-mono">{price}</p>
            </div>
            
            {/* Main Image */}
            <div className="aspect-[3/4] bg-gray-50 relative">
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
                    <div className="text-4xl mb-2">📦</div>
                    <div className="text-sm">No image</div>
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
                      "relative w-16 h-20 flex-shrink-0 overflow-hidden border transition-colors",
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

            {/* Variant Selection */}
            {product.options?.length > 0 && (
              <div className="border-t pt-4">
                <VariantSelector
                  options={product.options}
                  variants={product.variants?.edges?.map(e => e.node) || []}
                  onVariantChange={setSelectedVariant}
                />
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center border border-gray-200">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-50"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="w-12 text-center font-mono text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 sticky bottom-0 bg-white pt-2">
              <Button
                onClick={handleAddToCart}
                disabled={isAdding || !selectedVariant || !selectedVariant.availableForSale || !cartReady || status === 'updating'}
                className="w-full h-12 text-base font-medium bg-black hover:bg-gray-900 border-0"
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
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleWishlist}
                  className={cn(
                    "flex-1 h-11 border-gray-200",
                    isWishlisted && "bg-red-50 border-red-200 hover:bg-red-100"
                  )}
                >
                  <Heart className={cn(
                    "w-4 h-4 mr-2",
                    isWishlisted && "fill-red-500 stroke-red-500"
                  )} />
                  {isWishlisted ? 'Saved' : 'Save'}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex-1 h-11 border-gray-200" 
                  asChild
                >
                  <Link href={`/products/${product.handle}`}>
                    View Details
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-2 h-full">
          {/* Left: Images */}
          <div className="bg-gray-50 p-8 flex flex-col">
            <div className="flex-1 relative">
              {selectedImage ? (
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.altText || product.title}
                  fill
                  className="object-contain"
                  sizes="50vw"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📦</div>
                    <div className="text-lg">No image available</div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Image thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 mt-6 justify-center">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      "relative w-20 h-24 overflow-hidden border transition-all",
                      selectedImageIndex === index 
                        ? 'border-black shadow-[var(--shadow-medium)]' 
                        : 'border-gray-200 hover:border-gray-400'
                    )}
                  >
                    <Image
                      src={image.url}
                      alt={image.altText || `${product.title} ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="p-8 lg:p-12 flex flex-col">
            <div className="flex-1 space-y-6">
              {/* Title & Price */}
              <div>
                <h2 className="text-2xl lg:text-3xl font-medium mb-3">{product.title}</h2>
                <p className="text-2xl font-mono">{price}</p>
              </div>

              {/* Description */}
              {product.description && (
                <div className="border-t pt-6">
                  <h3 className="font-medium mb-3">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Variant Selection */}
              {product.options?.length > 0 && (
                <div className="border-t pt-6">
                  <VariantSelector
                    options={product.options}
                    variants={product.variants?.edges?.map(e => e.node) || []}
                    onVariantChange={setSelectedVariant}
                  />
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border border-gray-200">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="w-16 text-center font-mono">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Trust badges */}
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  <span>Free shipping on orders over $100</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>30-day return policy</span>
                </div>
              </div>
            </div>

            {/* Actions - sticky at bottom */}
            <div className="space-y-3 mt-8">
              <Button
                onClick={handleAddToCart}
                disabled={isAdding || !selectedVariant || !selectedVariant.availableForSale || !cartReady || status === 'updating'}
                className="w-full h-14 text-base font-medium bg-black hover:bg-gray-900 border-0"
                size="lg"
              >
                {isAdding || status === 'updating' ? (
                  <>
                    <div className="w-5 h-5 border border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Adding to cart...
                  </>
                ) : !selectedVariant ? (
                  'Select options'
                ) : !selectedVariant.availableForSale ? (
                  'Out of stock'
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to cart • {price}
                  </>
                )}
              </Button>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleWishlist}
                  className={cn(
                    "flex-1 h-12 border-gray-200",
                    isWishlisted && "bg-red-50 border-red-200 hover:bg-red-100"
                  )}
                >
                  <Heart className={cn(
                    "w-5 h-5 mr-2",
                    isWishlisted && "fill-red-500 stroke-red-500"
                  )} />
                  {isWishlisted ? 'Saved' : 'Save for later'}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex-1 h-12 border-gray-200" 
                  asChild
                >
                  <Link href={`/products/${product.handle}`}>
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