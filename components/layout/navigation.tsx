"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Search, ShoppingBag, Heart, User, Dices } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MobileCartSheet } from "@/components/layout/mobile-cart-sheet"
import { MobileSearchSheet } from "@/components/layout/mobile-search-sheet"
import { SearchBar } from "@/components/layout/search-bar"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { useIndecisive } from "@/components/providers/indecisive-provider"
import { MarketSwitcher } from "@/components/commerce/market-switcher"
import { useTranslations } from 'next-intl'
import { useFlyToCart } from "@/contexts/fly-to-cart-context"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

export function Navigation() {
  const t = useTranslations('nav')
  const tc = useTranslations('common')
  const tf = useTranslations('footer')
  const pathname = usePathname()
  const { totalItems } = useCart()
  const { totalItems: wishlistCount } = useWishlist()
  const { openRandomizer } = useIndecisive()
  const { setCartIconRef } = useFlyToCart()
  
  // State
  const [showSearchBar, setShowSearchBar] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showBottomNav, setShowBottomNav] = useState(false)
  
  // Refs
  const cartIconRef = useRef<HTMLButtonElement>(null)
  const mobileCartIconRef = useRef<HTMLButtonElement>(null)

  // Register cart icon refs
  useEffect(() => {
    if (cartIconRef.current) {
      setCartIconRef(cartIconRef.current)
    }
  }, [setCartIconRef])

  // Mobile bottom nav visibility logic
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setShowBottomNav(currentScrollY > 100) // Show when scrolled past hero
    }

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

    window.addEventListener("scroll", throttledHandleScroll, { passive: true })
    handleScroll() // Check initial state

    return () => window.removeEventListener("scroll", throttledHandleScroll)
  }, [])

  const menuItems = [
    { name: t('new'), href: "/new", badge: "DROP 1" },
    { name: t('comingSoon'), href: "/coming-soon", badge: null },
    { name: t('sale'), href: "/sale", badge: "50% OFF" },
  ]

  const footerLinks = [
    { name: tf('about'), href: "/about" },
    { name: tf('contact'), href: "/contact" },
    { name: tf('careers'), href: "/careers" },
    { name: tf('lookbook'), href: "/lookbook" },
    { name: tf('community'), href: "/community" },
    { name: tf('returns'), href: "/returns" },
    { name: tf('shipping'), href: "/shipping" },
    { name: tf('privacy'), href: "/privacy" },
    { name: tf('terms'), href: "/terms" },
  ]

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="sticky top-0 z-50 hidden md:block bg-white/95 backdrop-blur-md border-b-2 border-black h-[64px]">
        <div className="flex items-center justify-between px-4 lg:px-8 h-full">
          {/* Left: Logo & Categories */}
          <div className="flex items-center gap-8">
            <Link href="/" className="shrink-0">
              <span className="text-xl font-bold font-mono tracking-tighter">
                {tc('brandName')}
              </span>
            </Link>
            
            <NavigationMenu>
              <NavigationMenuList className="gap-4">
                {menuItems.map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink
                      href={item.href}
                      className={cn(
                        "font-mono font-medium text-sm uppercase tracking-wider transition-colors",
                        pathname === item.href ? "text-black" : "text-gray-600 hover:text-black"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        {item.name}
                        {item.badge && (
                          <Badge variant="default" className="text-[10px] px-1.5 py-0.5 font-mono">
                            {item.badge}
                          </Badge>
                        )}
                      </span>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Center: Search (expandable) */}
          <div className="flex-1 max-w-2xl mx-8">
            {showSearchBar ? (
              <SearchBar />
            ) : (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowSearchBar(true)}
                className="w-full max-w-xs mx-auto justify-start text-gray-500 hover:text-black border border-transparent hover:border-gray-200"
              >
                <Search className="h-4 w-4 mr-2" />
                <span className="text-sm">{t('search')}</span>
              </Button>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1">
            <MarketSwitcher />
            
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <User className="h-5 w-5" />
            </Button>
            
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="relative hover:bg-gray-100">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <Badge variant="default" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                    {wishlistCount}
                  </Badge>
                )}
              </Button>
            </Link>
            
            <MobileCartSheet>
              <Button variant="ghost" size="icon" className="relative hover:bg-gray-100" ref={cartIconRef}>
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge variant="default" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] cart-icon-bounce">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </MobileCartSheet>
          </div>
        </div>
      </nav>

      {/* Mobile Top Navigation */}
      <div className="fixed-mobile-safe w-full z-50 md:hidden touch-optimized">
        {/* Newsletter Banner */}
        <div className="bg-black text-white py-3 px-4 text-center">
          <p className="text-sm font-mono">{t('banner')}</p>
        </div>

        {/* Mobile Navigation Bar */}
        <nav className="bg-white/95 backdrop-blur-md border-b border-gray-950 overscroll-contain">
          <div className="px-3 h-16 flex items-center justify-between">
            {/* Left: Menu + Logo */}
            <div className="flex items-center gap-1">
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <button className="relative h-12 w-12 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-all duration-200 rounded-lg -ml-2">
                    {isMenuOpen ? <X className="h-6 w-6 stroke-[1.5]" /> : <Menu className="h-6 w-6 stroke-[1.5]" />}
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full sm:w-[400px] p-0 border border-gray-950 bg-white">
                  <div className="h-full flex flex-col">
                    {/* Menu Header */}
                    <div className="flex items-center justify-between p-6 pb-4">
                      <h2 className="text-lg font-mono font-bold">{tc('menu')}</h2>
                      <MarketSwitcher />
                    </div>

                    {/* Menu Items */}
                    <nav className="flex-1 overflow-y-auto">
                      <ul className="space-y-1 px-4">
                        {menuItems.map((item) => (
                          <li key={item.href}>
                            <Link href={item.href} onClick={() => setIsMenuOpen(false)}>
                              <Button variant="ghost" size="lg" className="w-full justify-between hover:bg-gray-100">
                                <span className="font-mono uppercase tracking-wider">{item.name}</span>
                                {item.badge && (
                                  <Badge variant="outline" className="ml-2">{item.badge}</Badge>
                                )}
                              </Button>
                            </Link>
                          </li>
                        ))}
                      </ul>

                      {/* Footer Links */}
                      <div className="mt-8 pt-8 border-t border-gray-200">
                        <ul className="space-y-1 px-4">
                          {footerLinks.map((link) => (
                            <li key={link.href}>
                              <Link href={link.href} onClick={() => setIsMenuOpen(false)}>
                                <Button variant="ghost" size="sm" className="w-full justify-start">
                                  <span className="text-sm">{link.name}</span>
                                </Button>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>

              <Link href="/" className="ml-2">
                <h1 className="text-lg font-bold font-mono tracking-tighter">{tc('brandName')}</h1>
              </Link>
            </div>

            {/* Right: Search + Cart */}
            <div className="flex items-center gap-1">
              <MobileSearchSheet />
              <MobileCartSheet>
                <Button variant="ghost" size="icon" className="relative h-12 w-12" ref={mobileCartIconRef}>
                  <ShoppingBag className="h-6 w-6 stroke-[1.5]" />
                  {totalItems > 0 && (
                    <Badge variant="default" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </MobileCartSheet>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className={cn(
        "fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-md border-t-2 border-black transition-transform duration-300 pb-safe",
        showBottomNav ? "translate-y-0" : "translate-y-full"
      )}>
        <div className="grid grid-cols-4 h-16">
          <Link href="/products">
            <Button variant="ghost" className="h-full w-full flex flex-col gap-1 rounded-none">
              <ShoppingBag className={cn("h-5 w-5", pathname === "/products" && "text-black")} />
              <span className={cn("text-[10px] font-mono", pathname === "/products" && "text-black")}>
                SHOP
              </span>
            </Button>
          </Link>

          <Link href="/wishlist">
            <Button variant="ghost" className="h-full w-full flex flex-col gap-1 rounded-none relative">
              <Heart className={cn("h-5 w-5", pathname === "/wishlist" && "text-black")} />
              <span className={cn("text-[10px] font-mono", pathname === "/wishlist" && "text-black")}>
                WISHLIST
              </span>
              {wishlistCount > 0 && (
                <Badge variant="default" className="absolute top-2 right-1/2 translate-x-3 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                  {wishlistCount}
                </Badge>
              )}
            </Button>
          </Link>

          <Button variant="ghost" className="h-full w-full flex flex-col gap-1 rounded-none" onClick={openRandomizer}>
            <Dices className="h-5 w-5" />
            <span className="text-[10px] font-mono">RANDOM</span>
          </Button>

          <Link href="/account">
            <Button variant="ghost" className="h-full w-full flex flex-col gap-1 rounded-none">
              <User className={cn("h-5 w-5", pathname.startsWith("/account") && "text-black")} />
              <span className={cn("text-[10px] font-mono", pathname.startsWith("/account") && "text-black")}>
                ACCOUNT
              </span>
            </Button>
          </Link>
        </div>
      </nav>
    </>
  )
}