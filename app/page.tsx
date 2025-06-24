"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Plus, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { QuickViewDialog } from "@/components/quick-view-dialog"
import { ReviewSummary } from "@/components/review-summary"
import { MobileNavigation } from "@/components/mobile-navigation"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { SocialMediaFeed } from "@/components/social-media-feed"

export default function IndecisiveWearStore() {
  const [cartCount, setCartCount] = useState(2)

  const categories = [
    { name: "NEW ARRIVALS", image: "/placeholder.svg?height=240&width=200&text=New+Arrivals", count: "24 items" },
    { name: "ESSENTIALS", image: "/placeholder.svg?height=240&width=200&text=Essentials", count: "18 items" },
    { name: "STREETWEAR", image: "/placeholder.svg?height=240&width=200&text=Streetwear", count: "32 items" },
    { name: "OUTERWEAR", image: "/placeholder.svg?height=240&width=200&text=Outerwear", count: "12 items" },
    { name: "BOTTOMS", image: "/placeholder.svg?height=240&width=200&text=Bottoms", count: "16 items" },
    { name: "ACCESSORIES", image: "/placeholder.svg?height=240&width=200&text=Accessories", count: "8 items" },
  ]

  const bestSellers = [
    {
      id: 1,
      name: "Essential White Tee",
      price: 45,
      originalPrice: 60,
      image: "/placeholder.svg?height=300&width=240",
      category: "Essentials",
      isNew: true,
      rating: 4.8,
      reviews: 124,
      isBestSeller: true,
    },
    {
      id: 2,
      name: "Shadow Bomber",
      price: 120,
      originalPrice: 150,
      image: "/placeholder.svg?height=300&width=240",
      category: "Outerwear",
      rating: 4.9,
      reviews: 67,
      isBestSeller: true,
    },
    {
      id: 3,
      name: "Street Cargo Pants",
      price: 95,
      image: "/placeholder.svg?height=300&width=240",
      category: "Bottoms",
      rating: 4.8,
      reviews: 142,
      isBestSeller: true,
    },
    {
      id: 4,
      name: "Clean Lines Hoodie",
      price: 85,
      image: "/placeholder.svg?height=300&width=240",
      category: "Essentials",
      rating: 4.9,
      reviews: 89,
      isBestSeller: true,
    },
    {
      id: 5,
      name: "Urban Oversized Tee",
      price: 50,
      image: "/placeholder.svg?height=300&width=240",
      category: "Streetwear",
      rating: 4.7,
      reviews: 198,
      isBestSeller: true,
    },
    {
      id: 6,
      name: "Night Rider Hoodie",
      price: 90,
      image: "/placeholder.svg?height=300&width=240",
      category: "Streetwear",
      rating: 4.8,
      reviews: 176,
      isBestSeller: true,
    },
  ]

  const essentialsProducts = [
    {
      id: 7,
      name: "Pure Form Joggers",
      price: 65,
      image: "/placeholder.svg?height=300&width=240",
      category: "Bottoms",
      rating: 4.7,
      reviews: 156,
    },
    {
      id: 8,
      name: "Minimal Crew Neck",
      price: 55,
      image: "/placeholder.svg?height=300&width=240",
      category: "Essentials",
      rating: 4.6,
      reviews: 203,
    },
    {
      id: 9,
      name: "Essential Black Tee",
      price: 45,
      image: "/placeholder.svg?height=300&width=240",
      category: "Essentials",
      rating: 4.8,
      reviews: 189,
    },
    {
      id: 10,
      name: "Clean Cut Shorts",
      price: 38,
      image: "/placeholder.svg?height=300&width=240",
      category: "Bottoms",
      rating: 4.5,
      reviews: 92,
    },
  ]

  const streetwearProducts = [
    {
      id: 11,
      name: "Graphic Statement Tee",
      price: 48,
      image: "/placeholder.svg?height=300&width=240",
      category: "Streetwear",
      rating: 4.5,
      reviews: 87,
    },
    {
      id: 12,
      name: "Utility Vest",
      price: 110,
      image: "/placeholder.svg?height=300&width=240",
      category: "Outerwear",
      rating: 4.7,
      reviews: 94,
    },
    {
      id: 13,
      name: "Oversized Hoodie",
      price: 95,
      image: "/placeholder.svg?height=300&width=240",
      category: "Streetwear",
      rating: 4.6,
      reviews: 156,
    },
    {
      id: 14,
      name: "Wide Leg Pants",
      price: 88,
      image: "/placeholder.svg?height=300&width=240",
      category: "Bottoms",
      rating: 4.4,
      reviews: 73,
    },
  ]

  const addToCart = () => {
    setCartCount((prev) => prev + 1)
  }

  // Mobile-optimized product card
  const ProductCard = ({ product, isDark = false }: { product: any; isDark?: boolean }) => (
    <div className="group min-w-[160px] sm:min-w-[200px] md:min-w-[280px] flex-shrink-0">
      <div className="relative overflow-hidden mb-2">
        <div className="aspect-[3/4] relative">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 160px, (max-width: 768px) 200px, 280px"
            className="object-cover"
          />
          {product.isNew && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white font-mono text-[10px] px-2 py-1 border-0">
              NEW
            </Badge>
          )}
          {product.isBestSeller && (
            <Badge className="absolute top-2 left-2 bg-yellow-400 text-black font-mono text-[10px] px-2 py-1 border-0">
              BEST
            </Badge>
          )}

          {/* Mobile action buttons */}
          <div className="absolute bottom-2 left-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 md:opacity-100">
            <Button
              onClick={addToCart}
              size="sm"
              className={`flex-1 font-mono text-[10px] py-1 h-6 ${
                isDark ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-black/90"
              }`}
            >
              <Plus className="h-2 w-2 mr-1" />
              ADD
            </Button>
            <QuickViewDialog product={product} isDark={isDark}>
              <Button
                size="sm"
                className={`px-1 font-mono text-[10px] py-1 h-6 ${
                  isDark ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-black/90"
                }`}
              >
                <Eye className="h-2 w-2" />
              </Button>
            </QuickViewDialog>
          </div>

          {/* Wishlist button */}
          <Button
            size="sm"
            className={`absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 md:opacity-100 ${
              isDark ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-black/90"
            }`}
          >
            <Heart className="h-2 w-2" />
          </Button>
        </div>
      </div>

      <div className="space-y-1 px-1">
        <div className="hidden sm:block">
          <ReviewSummary rating={product.rating} reviewCount={product.reviews} isDark={isDark} size="sm" />
        </div>

        <div>
          <h3
            className={`font-mono text-xs sm:text-sm font-medium mb-1 line-clamp-2 ${isDark ? "text-white" : "text-black"}`}
          >
            {product.name}
          </h3>
          <p className={`text-[10px] sm:text-xs font-mono ${isDark ? "text-white/60" : "text-black/60"}`}>
            {product.category}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`font-mono font-bold text-sm sm:text-base ${isDark ? "text-white" : "text-black"}`}>
            ${product.price}
          </span>
          {product.originalPrice && (
            <span className={`text-xs font-mono line-through ${isDark ? "text-white/40" : "text-black/40"}`}>
              ${product.originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white font-mono">
      {/* Enhanced Mobile Navigation */}
      <MobileNavigation cartCount={cartCount} />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav cartCount={cartCount} wishlistCount={3} />

      {/* Hero Section */}
      <section className="pt-20 md:pt-20 h-screen flex relative">
        <div className="w-1/2 bg-white flex flex-col justify-center items-center px-2 sm:px-6 md:px-12 py-8 md:py-20">
          <div className="text-center space-y-3 sm:space-y-6 md:space-y-8 max-w-xs sm:max-w-sm md:max-w-md">
            <h1 className="text-xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
              CAN'T
              <br />
              DECIDE?
            </h1>
            <p className="text-[10px] sm:text-sm md:text-lg text-black/70 leading-relaxed">Minimalist essentials</p>
            <Button className="bg-black text-white hover:bg-black/80 px-4 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 text-xs sm:text-base font-mono font-medium">
              SHOP ESSENTIALS
            </Button>
          </div>
        </div>

        <div className="absolute left-1/2 top-20 md:top-20 bottom-0 w-px bg-black/20 transform -translate-x-px"></div>

        <div className="w-1/2 bg-black flex flex-col justify-center items-center px-2 sm:px-6 md:px-12 py-8 md:py-20">
          <div className="text-center space-y-3 sm:space-y-6 md:space-y-8 max-w-xs sm:max-w-sm md:max-w-md">
            <h1 className="text-xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight text-white">
              CHOOSE
              <br />
              CHAOS
            </h1>
            <p className="text-[10px] sm:text-sm md:text-lg text-white/70 leading-relaxed">Urban streetwear</p>
            <Button className="bg-white text-black hover:bg-white/90 px-4 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 text-xs sm:text-base font-mono font-medium">
              SHOP STREETWEAR
            </Button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-black text-white py-2 sm:py-4 md:py-5 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...Array(4)].map((_, i) => (
              <span key={i} className="flex">
                <span className="text-xs sm:text-base md:text-lg lg:text-xl font-mono font-bold tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.4em] mx-3 sm:mx-6 md:mx-8">
                  INDECISIVE WEAR
                </span>
                <span className="text-xs sm:text-base md:text-lg lg:text-xl font-mono font-bold tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.4em] mx-3 sm:mx-6 md:mx-8">
                  CHOOSE BOTH SIDES
                </span>
                <span className="text-xs sm:text-base md:text-lg lg:text-xl font-mono font-bold tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.4em] mx-3 sm:mx-6 md:mx-8">
                  MINIMAL + MAXIMAL
                </span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Categories - Made slightly bigger to match product cards better */}
      <section className="py-6 md:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <h2 className="text-xl md:text-4xl font-bold tracking-tight mb-4 md:mb-12 text-center">SHOP BY CATEGORY</h2>
          <div className="flex gap-3 md:gap-8 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((category) => (
              <div key={category.name} className="min-w-[140px] sm:min-w-[180px] md:min-w-[280px] group cursor-pointer">
                <div className="relative overflow-hidden mb-2">
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      sizes="(max-width: 640px) 140px, (max-width: 768px) 180px, 280px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30"></div>
                    <div className="absolute inset-0 flex flex-col justify-end p-2 sm:p-4 md:p-6">
                      <h3 className="text-white font-mono font-bold text-xs sm:text-sm md:text-xl mb-1">
                        {category.name}
                      </h3>
                      <p className="text-white/90 font-mono text-[10px] sm:text-xs">{category.count}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-6 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-4 md:mb-8">
            <div>
              <h2 className="text-xl md:text-5xl font-bold tracking-tight mb-1">BEST SELLERS</h2>
              <p className="text-black/60 text-xs md:text-xl font-mono">Most loved by our community</p>
            </div>
            <Button
              variant="outline"
              className="bg-black/5 hover:bg-black hover:text-white font-mono text-xs md:text-base px-3 md:px-6"
            >
              VIEW ALL
            </Button>
          </div>

          <div className="flex gap-3 md:gap-8 overflow-x-auto pb-4 scrollbar-hide">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Essentials */}
      <section className="py-6 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-4 md:mb-8">
            <div>
              <h2 className="text-xl md:text-5xl font-bold tracking-tight mb-1">ESSENTIALS</h2>
              <p className="text-black/70 text-xs md:text-xl font-mono">Minimalist pieces for the undecided</p>
            </div>
            <Button
              variant="outline"
              className="bg-black/5 hover:bg-black hover:text-white font-mono text-xs md:text-base px-3 md:px-6"
            >
              VIEW ALL
            </Button>
          </div>

          <div className="flex gap-3 md:gap-8 overflow-x-auto pb-4 scrollbar-hide">
            {essentialsProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Streetwear */}
      <section className="py-6 md:py-12 bg-black">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-4 md:mb-8">
            <div>
              <h2 className="text-xl md:text-5xl font-bold tracking-tight mb-1 text-white">STREETWEAR</h2>
              <p className="text-white/70 text-xs md:text-xl font-mono">Urban pieces for the bold</p>
            </div>
            <Button
              variant="outline"
              className="bg-white/10 hover:bg-white hover:text-black font-mono text-xs md:text-base px-3 md:px-6 text-white"
            >
              VIEW ALL
            </Button>
          </div>

          <div className="flex gap-3 md:gap-8 overflow-x-auto pb-4 scrollbar-hide">
            {streetwearProducts.map((product) => (
              <ProductCard key={product.id} product={product} isDark />
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Section - Now with horizontal scroll */}
      <section className="py-6 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <SocialMediaFeed title="COMMUNITY STYLE" showHeader={true} maxPosts={8} />
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="min-h-[300px] md:h-96 flex relative mb-16 md:mb-0">
        <div className="w-1/2 bg-white flex flex-col justify-center items-center px-3 sm:px-6 md:px-12 py-8 md:py-0">
          <div className="text-center space-y-3 sm:space-y-6 md:space-y-8 max-w-xs sm:max-w-sm md:max-w-md w-full">
            <h3 className="text-lg sm:text-3xl md:text-4xl font-bold">STAY MINIMAL</h3>
            <p className="text-black/70 text-xs sm:text-base md:text-lg">Get updates on our essential pieces</p>
            <div className="flex flex-col gap-2 sm:gap-4">
              <Input
                placeholder="Enter email"
                className="font-mono bg-black/5 focus:bg-black/10 focus:ring-0 text-xs sm:text-base md:text-lg px-3"
              />
              <Button className="bg-black text-white hover:bg-black/80 font-mono text-xs sm:text-base md:text-lg py-3">
                SUBSCRIBE
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-black/20 transform -translate-x-px"></div>

        <div className="w-1/2 bg-black flex flex-col justify-center items-center px-3 sm:px-6 md:px-12 py-8 md:py-0">
          <div className="text-center space-y-3 sm:space-y-6 md:space-y-8 max-w-xs sm:max-w-sm md:max-w-md w-full">
            <h3 className="text-lg sm:text-3xl md:text-4xl font-bold text-white">JOIN COMMUNITY</h3>
            <p className="text-white/70 text-xs sm:text-base md:text-lg">Share your style and get featured</p>
            <div className="flex flex-col gap-2 sm:gap-4">
              <Input
                placeholder="Enter email"
                className="font-mono bg-white/10 text-white placeholder:text-white/60 focus:bg-white/20 focus:ring-0 text-xs sm:text-base md:text-lg px-3"
              />
              <Button className="bg-white text-black hover:bg-white/90 font-mono text-xs sm:text-base md:text-lg py-3">
                JOIN NOW
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-black/10 py-8 md:py-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-12">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4 md:mb-8">
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 bg-black"></div>
                  <div className="w-4 h-4 bg-white border-2 border-black"></div>
                </div>
                <span className="font-mono font-bold text-sm">INDECISIVE WEAR</span>
              </div>
              <p className="text-black/70 text-sm leading-relaxed">
                For the beautifully undecided. Embrace both sides of your style.
              </p>
            </div>

            {[
              { title: "SHOP", links: ["New Arrivals", "Essentials", "Streetwear", "Sale"] },
              { title: "SUPPORT", links: ["Size Guide", "Shipping", "Returns", "Contact"] },
              { title: "CONNECT", links: ["Instagram", "Twitter", "TikTok", "Newsletter"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-mono font-bold mb-4 md:mb-8 text-sm uppercase tracking-wider">{col.title}</h4>
                <ul className="space-y-2 md:space-y-4 text-sm text-black/70">
                  {col.links.map((link) => (
                    <li key={link}>
                      <Link href="#" className="hover:text-black">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-black/10 mt-8 md:mt-16 pt-6 text-center text-xs sm:text-base text-black/60">
            <p>
              &copy; {new Date().getFullYear()} Indecisive Wear. All rights reserved. | Privacy Policy | Terms of
              Service
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
