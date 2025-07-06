"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Search, ShoppingBag, Heart, User, Dices, Instagram, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MobileCartSheet } from "@/components/layout/mobile-cart-sheet"
import { MobileSearchSheet } from "@/components/layout/mobile-search-sheet"
import { SearchBar } from "@/components/layout/search-bar"
import { SearchFiltersTranslated } from "@/app/(shop)/search/search-filters-translated"
import { WishlistDrawer } from "@/components/commerce/wishlist-drawer"
import { AnnouncementBanner } from "@/components/layout/announcement-banner"
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
  const [lastScrollY, setLastScrollY] = useState(0)
  const [showWishlistDrawer, setShowWishlistDrawer] = useState(false)
  
  // Refs
  const cartIconRef = useRef<HTMLButtonElement>(null)

  // Register cart icon ref for desktop
  useEffect(() => {
    if (cartIconRef.current) {
      setCartIconRef(cartIconRef.current)
    }
  }, [setCartIconRef])

  // Mobile bottom nav visibility logic
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      
      // Hide nav when on hero section (top of page)
      if (currentScrollY < 100) {
        setShowBottomNav(false)
      }
      // Hide nav when near footer/CTA (bottom 20% of page)
      else if (currentScrollY + windowHeight > documentHeight * 0.8) {
        setShowBottomNav(false)
        // Auto-close menu when reaching footer area
        if (isMenuOpen) {
          setIsMenuOpen(false)
        }
      } else {
        setShowBottomNav(true)
      }
      
      setLastScrollY(currentScrollY)
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
    handleScroll()

    return () => window.removeEventListener("scroll", throttledHandleScroll)
  }, [lastScrollY, isMenuOpen])

  const menuItems = [
    { name: t('all'), href: "/products", badge: null },
    { name: t('new'), href: "/new", badge: null },
    { name: t('sale'), href: "/sale", badge: "50% OFF" },
    { name: t('comingSoon'), href: "/coming-soon", badge: null },
  ]

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        {/* Professional Announcement Banner */}
        <AnnouncementBanner />

        {/* Main Navigation */}
        <nav className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
              <Link href="/" className="flex items-center">
                <h1 className="text-2xl font-bold font-mono tracking-wider">
                  INDECISIVE WEAR
                </h1>
              </Link>

              {/* Center Navigation or Search Bar */}
              {showSearchBar ? (
                <div className="flex-1 max-w-2xl mx-8">
                  <SearchBar />
                </div>
              ) : (
                <NavigationMenu className="hidden lg:flex">
                  <NavigationMenuList>
                    {menuItems.map((category) => (
                      <NavigationMenuItem key={category.href}>
                        <NavigationMenuLink asChild>
                          <Link 
                            href={category.href}
                            className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                          >
                            {category.name}
                            {category.badge && (
                              <Badge variant="outline" className="ml-2 text-[10px]">
                                {category.badge}
                              </Badge>
                            )}
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              )}

              {/* Right Actions */}
              <div className="flex items-center gap-2">
                {/* Market Switcher */}
                <MarketSwitcher />

                {/* Search */}
                <div className="hidden lg:block">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setShowSearchBar(!showSearchBar)}
                    className="h-10 w-10 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                  >
                    <Search className="h-5 w-5 stroke-[1.5]" />
                  </Button>
                </div>
                <div className="lg:hidden">
                  <MobileSearchSheet>
                    <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-gray-100 active:bg-gray-200 transition-colors">
                      <Search className="h-5 w-5 stroke-[1.5]" />
                    </Button>
                  </MobileSearchSheet>
                </div>

                {/* Account */}
                <Link href="/account">
                  <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-gray-100 active:bg-gray-200 transition-colors">
                    <User className="h-5 w-5 stroke-[1.5]" />
                  </Button>
                </Link>

                {/* Wishlist */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative h-10 w-10 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                  onClick={() => setShowWishlistDrawer(true)}
                >
                  <Heart className="h-5 w-5 stroke-[1.5]" />
                  {wishlistCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-black text-white border-2 border-white"
                    >
                      {wishlistCount}
                    </Badge>
                  )}
                </Button>

                {/* Cart */}
                <MobileCartSheet>
                  <Button 
                    ref={cartIconRef}
                    variant="ghost" 
                    size="icon" 
                    className="relative h-10 w-10 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                  >
                    <ShoppingBag className="h-5 w-5 stroke-[1.5]" />
                    {totalItems > 0 && (
                      <Badge
                        variant="secondary"
                        className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-black text-white border-2 border-white cart-icon-bounce"
                      >
                        {totalItems}
                      </Badge>
                    )}
                  </Button>
                </MobileCartSheet>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <>
        {/* Mobile Navigation Stack */}
        <div className="fixed-mobile-safe w-full z-50 md:hidden touch-optimized">
          {/* Professional Mobile Announcement Banner */}
          <AnnouncementBanner className="text-xs" />

          {/* Mobile Navigation Bar */}
          <nav className="bg-white border-b border-black/20 shadow-sm">
            <div className="px-3 h-16 flex items-center justify-between">
              {/* Left Side: Menu + Logo */}
              <div className="flex items-center gap-0">
                {/* Menu on LEFT */}
                <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                  <SheetTrigger asChild>
                    <button className={cn(
                      "relative min-h-[44px] min-w-[44px] flex items-center justify-center transition-all duration-200 active:scale-95 -ml-1",
                      isMenuOpen ? "menu-close-animation" : "menu-open-animation"
                    )}>
                      {isMenuOpen ? 
                        <X className="h-5 w-5 stroke-[1.5] transition-transform duration-200" /> : 
                        <Menu className="h-5 w-5 stroke-[1.5] transition-transform duration-200" />
                      }
                    </button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-full sm:w-[400px] p-0 border border-gray-950 bg-white">
                    <div className="flex flex-col h-full">
                      {/* Menu Header - Logo + Icons Row */}
                      <div className="px-6 py-6 border-b border-gray-950">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <span className="text-xl font-bold font-mono tracking-wider">INDECISIVE WEAR</span>
                            <Link 
                              href="https://www.instagram.com/indecisive_wear/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Instagram className="w-5 h-5 text-gray-600" />
                            </Link>
                          </div>
                        </div>
                        
                        {/* Account + Wishlist + Cart Icons Row */}
                        <div className="flex items-center gap-2">
                          {/* Account */}
                          <Link
                            href="/account"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex-1 h-12 flex items-center justify-center bg-black text-white hover:bg-gray-800 transition-all duration-200 font-mono text-sm font-medium"
                          >
                            <User className="h-4 w-4 mr-2" />
                            {t('account')}
                          </Link>
                          
                          {/* Wishlist */}
                          <Link
                            href="/wishlist"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex-1 h-12 flex items-center justify-center bg-white text-black border border-gray-950 hover:bg-gray-50 hover:shadow-md transition-all duration-200 font-mono text-sm font-medium relative"
                          >
                            <Heart className="h-4 w-4 mr-2" />
                            {tc('wishlist')}
                            {wishlistCount > 0 && (
                              <span className="ml-1 text-xs bg-black text-white px-1.5 py-0.5 rounded-full">
                                {wishlistCount}
                              </span>
                            )}
                          </Link>
                          
                          {/* Cart */}
                          <Link
                            href="/cart"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex-1 h-12 flex items-center justify-center bg-black text-white hover:bg-gray-800 transition-all duration-200 font-mono text-sm font-medium"
                          >
                            <ShoppingBag className="h-4 w-4 mr-2" />
                            {t('cart')}
                          </Link>
                        </div>
                      </div>

                      {/* Navigation Categories */}
                      <div className="flex-1 overflow-y-auto">
                        <nav className="px-6 py-6">
                          <h3 className="font-mono text-xs font-bold text-gray-600 mb-4 tracking-wider">{tc('categories')}</h3>
                          <div className="space-y-0">
                            {menuItems.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center justify-between py-3 text-base font-medium hover:text-gray-600 transition-colors border-b border-gray-100 last:border-b-0"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                <span className="font-mono tracking-wide">{item.name}</span>
                                {item.badge && (
                                  <span className="text-xs font-mono font-bold px-2 py-1 bg-black text-white">
                                    {item.badge}
                                  </span>
                                )}
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                                </svg>
                              </Link>
                            ))}
                          </div>
                        </nav>
                      </div>

                      {/* Menu Footer */}
                      <div className="border-t border-gray-950 px-6 py-6 bg-gray-50">
                        {/* Market Switcher */}
                        <div className="mb-4">
                          <MarketSwitcher variant="mobile" className="w-full" />
                        </div>
                        
                        <div className="space-y-2">
                          <Link href="/support" className="block font-mono text-sm font-medium hover:text-gray-600 transition-colors py-3 -mx-2 px-2 rounded min-h-[44px] flex items-center">
                            {tf('customerService')}
                          </Link>
                          <Link href="/size-guide" className="block font-mono text-sm font-medium hover:text-gray-600 transition-colors py-3 -mx-2 px-2 rounded min-h-[44px] flex items-center">
                            {tf('sizeGuide')}
                          </Link>
                          <Link href="/shipping" className="block font-mono text-sm font-medium hover:text-gray-600 transition-colors py-3 -mx-2 px-2 rounded min-h-[44px] flex items-center">
                            {tf('shipping')} & {tf('returns')}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
                
                {/* Logo */}
                <div className="flex items-center gap-1">
                  <Link href="/" className="flex items-center transition-opacity duration-200 hover:opacity-90">
                    <span className="text-lg font-bold font-mono tracking-wide text-black">INDECISIVE</span>
                  </Link>
                  <Link 
                    href="https://www.instagram.com/indecisive_wear/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Instagram className="w-4 h-4 text-gray-600" />
                  </Link>
                </div>
              </div>

              {/* Right Actions - Search + Cart ONLY */}
              <div className="flex items-center">
                {/* Search */}
                <div className="-mr-2">
                  <MobileSearchSheet />
                </div>

                {/* Cart */}
                <MobileCartSheet />
              </div>
            </div>
          </nav>
        </div>

        {/* Spacer */}
        <div className="h-[104px] md:hidden" />
      </>

      {/* Mobile Bottom Navigation */}
      <div 
        className={cn(
          "fixed-bottom-mobile-safe bg-white border-t border-black/10 z-40 md:hidden touch-optimized shadow-lg",
          "transition-transform duration-300 ease-in-out overscroll-contain",
          showBottomNav ? "transform translate-y-0" : "transform translate-y-full"
        )}
      >
        <div className="flex items-center justify-around py-2 px-4 pb-safe">
          {/* All Products */}
          <Link href="/products">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "flex flex-col items-center gap-1 h-auto py-2 px-2 min-w-[60px] min-h-[48px] transition-all duration-150",
                pathname === "/products" ? "text-black border border-black" : "text-gray-700 hover:text-black border border-transparent hover:border-black/30"
              )}
            >
              <ShoppingBag className="h-5 w-5 stroke-[2.5]" />
              <span className="text-[10px] font-medium">{t('all').toUpperCase()}</span>
            </Button>
          </Link>

          {/* Wishlist */}
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex flex-col items-center gap-1 h-auto py-2 px-2 min-w-[60px] min-h-[48px] relative transition-all duration-150",
              showWishlistDrawer ? "text-black border border-black" : "text-gray-700 hover:text-black border border-transparent hover:border-black/30"
            )}
            onClick={() => setShowWishlistDrawer(true)}
          >
            <Heart className={cn("h-5 w-5 stroke-[2.5]", wishlistCount > 0 && "fill-current")} />
            <span className="text-[10px] font-medium">{tc('wishlist').toUpperCase()}</span>
            {wishlistCount > 0 && (
              <Badge
                variant="secondary"
                className="absolute -top-0.5 -right-0.5 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-red-500 text-white border-2 border-white shadow-lg scale-110"
              >
                {wishlistCount}
              </Badge>
            )}
          </Button>

          {/* Flip - Can't Decide OR Filters on products page */}
          {pathname === '/products' ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center gap-1 h-auto py-2 px-2 min-w-[60px] min-h-[48px] text-gray-700 hover:text-black border border-transparent hover:border-black/30 transition-all duration-150"
                >
                  <SlidersHorizontal className="h-5 w-5 stroke-[2.5]" />
                  <span className="text-[10px] font-medium">{tc('filter').toUpperCase()}S</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh]">
                <div className="pt-6">
                  <SearchFiltersTranslated />
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-1 h-auto py-2 px-2 min-w-[60px] min-h-[48px] text-gray-700 hover:text-black border border-transparent hover:border-black/30 transition-all duration-150"
              onClick={openRandomizer}
            >
              <Dices className="h-5 w-5 stroke-[2.5]" />
              <span className="text-[10px] font-medium">FLIP</span>
            </Button>
          )}

          {/* Account */}
          <Link href="/account">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "flex flex-col items-center gap-1 h-auto py-2 px-2 min-w-[60px] min-h-[48px] transition-all duration-150",
                pathname === "/account" ? "text-black border border-black" : "text-gray-700 hover:text-black border border-transparent hover:border-black/30"
              )}
            >
              <User className="h-5 w-5 stroke-[2.5]" />
              <span className="text-[10px] font-medium">{t('account').toUpperCase()}</span>
            </Button>
          </Link>

          {/* Cart */}
          <MobileCartSheet isBottomNav />
        </div>
      </div>
      
      {/* Wishlist Drawer */}
      <WishlistDrawer 
        open={showWishlistDrawer} 
        onOpenChange={setShowWishlistDrawer} 
      />
    </>
  )
}