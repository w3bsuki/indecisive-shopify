"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Plus, Minus, X } from "lucide-react"
import { ReviewSummary } from "@/components/review-summary"

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  isNew?: boolean
  isBestSeller?: boolean
  rating: number
  reviews: number
  description?: string
  sizes?: string[]
  colors?: string[]
}

interface QuickViewDialogProps {
  product: Product
  isDark?: boolean
  children: React.ReactNode
}

export function QuickViewDialog({ product, isDark = false, children }: QuickViewDialogProps) {
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isOpen, setIsOpen] = useState(false)

  const sizes = product.sizes || ["XS", "S", "M", "L", "XL", "XXL"]
  const colors = product.colors || ["Black", "White", "Gray"]

  const handleAddToCart = () => {
    console.log("Added to cart:", { product, selectedSize, selectedColor, quantity })
    setIsOpen(false)
    // Show success toast here
  }

  const handleAddToWishlist = () => {
    console.log("Added to wishlist:", product)
    // Show success toast here
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-full w-full h-full max-h-screen m-0 p-0 font-mono overflow-hidden md:max-w-2xl md:h-auto md:max-h-[90vh] md:m-4 md:p-6">
        {/* Mobile: Full screen layout */}
        <div className="flex flex-col h-full md:grid md:grid-cols-2 md:gap-6 md:h-auto">
          {/* Product Image */}
          <div className="relative flex-shrink-0 h-[50vh] md:h-auto">
            <div className="h-full md:aspect-[4/5] relative overflow-hidden">
              <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
              {product.isNew && (
                <Badge className="absolute top-4 left-4 bg-red-500 text-white font-mono text-xs px-2 py-1">NEW</Badge>
              )}
              {product.isBestSeller && (
                <Badge className="absolute top-4 left-4 bg-yellow-500 text-black font-mono text-xs px-2 py-1">
                  BEST SELLER
                </Badge>
              )}
            </div>

            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-white/80 hover:bg-white h-11 w-11"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Product Details - Scrollable on mobile */}
          <div className="flex-1 flex flex-col p-4 md:p-0 overflow-y-auto md:overflow-visible">
            <div className="space-y-4 md:space-y-6">
              {/* Header */}
              <div>
                <ReviewSummary rating={product.rating} reviewCount={product.reviews} isDark={isDark} />
                <h2 className="text-xl md:text-2xl font-bold mt-2 mb-1">{product.name}</h2>
                <p className="text-black/60 text-sm">{product.category}</p>

                <div className="flex items-center gap-3 mt-3">
                  <span className="text-2xl font-bold">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-lg text-black/40 line-through">${product.originalPrice}</span>
                  )}
                </div>
              </div>

              {/* Color Selection - Horizontal scroll */}
              <div>
                <h4 className="font-bold mb-3 text-sm uppercase tracking-wider">Color</h4>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-3 min-h-[44px] min-w-[80px] border-2 text-xs font-mono transition-all flex-shrink-0 ${
                        selectedColor === color
                          ? "border-black bg-black text-white"
                          : "border-black/20 hover:border-black"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection - Horizontal scroll */}
              <div>
                <h4 className="font-bold mb-3 text-sm uppercase tracking-wider">Size</h4>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 px-4 min-h-[44px] min-w-[60px] border-2 text-xs font-mono font-medium transition-all flex-shrink-0 ${
                        selectedSize === size
                          ? "border-black bg-black text-white"
                          : "border-black/20 hover:border-black"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <h4 className="font-bold mb-3 text-sm uppercase tracking-wider">Quantity</h4>
                <div className="flex items-center border-2 border-black w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 min-h-[44px] min-w-[44px] hover:bg-black/5"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-3 font-mono font-medium min-h-[44px] flex items-center min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 min-h-[44px] min-w-[44px] hover:bg-black/5"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Fixed bottom actions on mobile */}
            <div className="mt-auto pt-6 pb-safe">
              <div className="space-y-3">
                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-black text-white hover:bg-black/80 font-mono py-4 text-base min-h-[56px]"
                  disabled={!selectedSize || !selectedColor}
                >
                  ADD TO CART - ${(product.price * quantity).toFixed(2)}
                </Button>
                <Button
                  onClick={handleAddToWishlist}
                  variant="outline"
                  className="w-full border-2 border-black hover:bg-black hover:text-white font-mono py-4 text-base min-h-[56px]"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  ADD TO WISHLIST
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
