"use client"

import type React from "react"
import { useState, useEffect } from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingBag, Dices, User } from "lucide-react"
import { MobileCartSheet } from "@/components/layout/mobile-cart-sheet"
import { useWishlist } from "@/hooks/use-wishlist"
import { useIndecisive } from "@/components/providers/indecisive-provider"
import { cn } from "@/lib/utils"

export function MobileBottomNav() {
  const pathname = usePathname()
  const { items } = useWishlist()
  const { openRandomizer } = useIndecisive()
  const wishlistCount = items.length
  const [isVisible, setIsVisible] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Hide nav when on hero section (top of page)
      if (currentScrollY < 100) {
        setIsVisible(false) // Hidden on hero section
      }
      // Show nav when scrolled past hero
      else if (currentScrollY >= 100) {
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
          setIsVisible(false) // Hide when scrolling down fast
        } else {
          setIsVisible(true) // Show when scrolled past hero or scrolling up
        }
      }
      
      setLastScrollY(currentScrollY)
    }

    // Throttle scroll events for better performance
    let ticking = false
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', throttledHandleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll)
    }
  }, [lastScrollY])

  return (
    <div 
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden",
        "transition-transform duration-300 ease-in-out",
        isVisible ? "transform translate-y-0" : "transform translate-y-full"
      )}
    >
      <div className="flex items-center justify-around py-2 px-4 pb-safe">
        {/* Shop */}
        <Link href="/new">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex flex-col items-center gap-1 h-auto py-2 px-3 min-w-[64px] min-h-[48px]",
              pathname === "/new" ? "text-black" : "text-gray-600"
            )}
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="text-xs font-mono">SHOP</span>
          </Button>
        </Link>

        {/* Wishlist */}
        <Link href="/wishlist">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex flex-col items-center gap-1 h-auto py-2 px-3 min-w-[64px] min-h-[48px] relative",
              pathname === "/wishlist" ? "text-black" : "text-gray-600"
            )}
          >
            <Heart className={cn("h-5 w-5", wishlistCount > 0 && "fill-current")} />
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
        </Link>

        {/* Flip - Can't Decide */}
        <Button
          variant="ghost"
          size="sm"
          className="flex flex-col items-center gap-1 h-auto py-2 px-3 min-w-[64px] min-h-[48px] text-gray-600"
          onClick={openRandomizer}
        >
          <Dices className="h-5 w-5" />
          <span className="text-xs font-mono">FLIP</span>
        </Button>

        {/* Account */}
        <Link href="/account">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex flex-col items-center gap-1 h-auto py-2 px-3 min-w-[64px] min-h-[48px]",
              pathname === "/account" ? "text-black" : "text-gray-600"
            )}
          >
            <User className="h-5 w-5" />
            <span className="text-xs font-mono">ACCOUNT</span>
          </Button>
        </Link>

        {/* Cart */}
        <MobileCartSheet isBottomNav />
      </div>
    </div>
  )
}