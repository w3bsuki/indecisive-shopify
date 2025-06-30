"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Heart, Filter, Home } from "lucide-react"
import { MobileCartSheet } from "@/components/layout/mobile-cart-sheet"
import { MobileSearchSheet } from "@/components/layout/mobile-search-sheet"

export function MobileBottomNav() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeFilters] = useState(0)
  const wishlistCount = 0 // TODO: Implement wishlist

  useEffect(() => {
    const handleScroll = () => {
      // Show bottom nav when scrolled past hero (assuming hero is 100vh)
      const heroHeight = window.innerHeight
      setIsVisible(window.scrollY > heroHeight * 0.8)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-black/10 z-40 md:hidden">
      <div className="flex items-center justify-around py-2 px-4 pb-safe">
        {/* Home */}
        <Button
          variant="ghost"
          size="sm"
          onClick={scrollToTop}
          className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-black/5"
        >
          <Home className="h-5 w-5" />
          <span className="text-xs font-mono">HOME</span>
        </Button>

        {/* Filter */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-black/5 relative"
            >
              <Filter className="h-5 w-5" />
              <span className="text-xs font-mono">FILTER</span>
              {activeFilters > 0 && (
                <Badge
                  variant="secondary"
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-black text-white"
                >
                  {activeFilters}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>Filter Products</SheetTitle>
            </SheetHeader>
            {/* Filter content would go here */}
            <p className="text-sm text-gray-600 mt-4">Filter options coming soon</p>
          </SheetContent>
        </Sheet>

        {/* Search */}
        <MobileSearchSheet />

        {/* Wishlist */}
        <Button
          variant="ghost"
          size="sm"
          className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-black/5 relative"
        >
          <Heart className="h-5 w-5" />
          <span className="text-xs font-mono">WISHLIST</span>
          {wishlistCount > 0 && (
            <Badge
              variant="secondary"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-red-500 text-white"
            >
              {wishlistCount}
            </Badge>
          )}
        </Button>

        {/* Cart */}
        <MobileCartSheet />
      </div>
    </div>
  )
}