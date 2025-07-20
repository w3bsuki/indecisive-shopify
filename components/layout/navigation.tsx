"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Search, ShoppingBag, Heart, User, Instagram, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MobileCartSheet } from "@/components/layout/mobile-cart-sheet"
import { MobileCartDropdown } from "@/components/layout/mobile-cart-dropdown"
import { CartSlideout } from "@/components/cart/cart-slideout"
import { MobileSearchSheet } from "@/components/layout/mobile-search-sheet"
import { MobileSearchDropdown } from "@/components/layout/mobile-search-dropdown"
import { SearchBar } from "@/components/layout/search-bar"
import { WishlistDrawer } from "@/components/commerce/wishlist-drawer"
import { AnnouncementBanner } from "@/components/layout/announcement-banner"
import { useCart, setCartSlideoutCallback } from "@/hooks/use-cart"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navigation() {
  const t = useTranslations('nav')
  const tc = useTranslations('common')
  const tf = useTranslations('footer')
  const pathname = usePathname()
  const { totalItems } = useCart()
  const { totalItems: wishlistCount } = useWishlist()
  const { } = useIndecisive()
  const { setCartIconRef } = useFlyToCart()
  
  // State
  const [showSearchBar, setShowSearchBar] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showBottomNav, setShowBottomNav] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [showWishlistDrawer, setShowWishlistDrawer] = useState(false)
  const [showCartSlideout, setShowCartSlideout] = useState(false)
  
  // Refs
  const cartIconRef = useRef<HTMLButtonElement>(null)

  // Register cart icon ref and slideout callback for desktop
  useEffect(() => {
    if (cartIconRef.current) {
      setCartIconRef(cartIconRef.current)
    }
    
    // Set slideout callback for desktop cart interactions
    setCartSlideoutCallback(() => setShowCartSlideout(true))
    
    return () => {
      setCartSlideoutCallback(null)
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
    { name: t('bestsellers'), href: "/bestsellers", badge: "❤️" },
  ]

  const apparelItems = [
    { 
      name: t('hats'), 
      href: "/products?category=hats"
    },
    { 
      name: t('tshirts'), 
      href: "/products?category=tshirts"
    },
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
                            className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium  hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
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
                    
                    {/* Simple Apparel Links */}
                    {apparelItems.map((item) => (
                      <NavigationMenuItem key={item.href}>
                        <NavigationMenuLink asChild>
                          <Link 
                            href={item.href}
                            className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium  hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                          >
                            {item.name}
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
                    className="h-10 w-10 hover:bg-gray-100 active:bg-gray-200 "
                  >
                    <Search className="h-5 w-5 stroke-[1.5]" />
                  </Button>
                </div>
                <div className="lg:hidden">
                  <MobileSearchSheet>
                    <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-gray-100 active:bg-gray-200 ">
                      <Search className="h-5 w-5 stroke-[1.5]" />
                    </Button>
                  </MobileSearchSheet>
                </div>

                {/* Account */}
                <Link href="/account">
                  <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-gray-100 active:bg-gray-200 ">
                    <User className="h-5 w-5 stroke-[1.5]" />
                  </Button>
                </Link>

                {/* Wishlist */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative h-10 w-10 hover:bg-gray-100 active:bg-gray-200 "
                  onClick={() => setShowWishlistDrawer(true)}
                >
                  <Heart className="h-5 w-5 stroke-[1.5]" />
                  {wishlistCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] font-semibold bg-black text-white border-2 border-white"
                    >
                      {wishlistCount}
                    </Badge>
                  )}
                </Button>

                {/* Cart - Desktop Slideout, Mobile Sheet */}
                <div className="hidden lg:block">
                  <Button 
                    ref={cartIconRef}
                    variant="ghost" 
                    size="icon" 
                    className="relative h-10 w-10 hover:bg-gray-100 active:bg-gray-200 "
                    onClick={() => setShowCartSlideout(true)}
                  >
                    <ShoppingBag className="h-5 w-5 stroke-[1.5]" />
                    {totalItems > 0 && (
                      <Badge
                        variant="secondary"
                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] font-semibold bg-black text-white border-2 border-white cart-icon-bounce"
                      >
                        {totalItems}
                      </Badge>
                    )}
                  </Button>
                </div>
                <div className="lg:hidden">
                  <MobileCartSheet>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="relative h-10 w-10 hover:bg-gray-100 active:bg-gray-200 "
                    >
                      <ShoppingBag className="h-5 w-5 stroke-[1.5]" />
                      {totalItems > 0 && (
                        <Badge
                          variant="secondary"
                          className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] font-semibold bg-black text-white border-2 border-white cart-icon-bounce"
                        >
                          {totalItems}
                        </Badge>
                      )}
                    </Button>
                  </MobileCartSheet>
                </div>
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
          <nav className="bg-white shadow-sm">
            <div className="px-3 h-14 flex items-center justify-between">
              {/* Left Side: Menu + Logo */}
              <div className="flex items-center gap-0">
                {/* Menu on LEFT */}
                <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <button className="relative min-h-[44px] min-w-[44px] flex items-center justify-center -ml-1">
                      {isMenuOpen ? 
                        <X className="h-5 w-5 stroke-[1.5]" /> : 
                        <Menu className="h-5 w-5 stroke-[1.5]" />
                      }
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="start" 
                    side="bottom"
                    className="w-[calc(100vw-24px)] sm:w-[calc(100vw-48px)] max-w-md p-0 mt-1 border border-gray-200 shadow-xl bg-white rounded-lg overflow-hidden animate-none"
                    sideOffset={5}
                  >
                    {/* Navigation Categories */}
                    <div className="px-4 py-4 max-h-[70vh] overflow-y-auto">
                      {/* Main Categories - Grid Layout */}
                      <div className="mb-4">
                        <h3 className="font-mono text-xs font-bold text-gray-600 mb-3 tracking-wider">{tc('categories')}</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {menuItems.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="relative p-3 border border-gray-200 rounded-lg hover:border-black hover:shadow-sm group"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <div className="flex flex-col items-center text-center space-y-1">
                                <span className="font-mono text-sm font-medium tracking-wide group-hover:text-black">{item.name}</span>
                                {item.badge && (
                                  <span className="text-xs font-mono font-bold px-2 py-0.5 bg-black text-white rounded text-center">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                      
                      {/* Collections Section */}
                      <div className="border-t border-gray-100 pt-4">
                        <h4 className="font-mono text-xs font-bold text-gray-600 mb-3 tracking-wider">{t('apparel').toUpperCase()}</h4>
                        <div className="space-y-3">
                          {apparelItems.map((item) => (
                            <div key={item.href} className="space-y-2">
                              <Link
                                href={item.href}
                                className="block p-3 border border-gray-200 rounded-lg hover:border-black hover:shadow-sm group"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                <div className="flex items-center justify-center">
                                  <span className="font-mono text-sm font-medium tracking-wide group-hover:text-black">{item.name}</span>
                                </div>
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions Footer */}
                    <div className="border-t border-gray-200 bg-gray-50/50 p-3">
                      <div className="flex items-center gap-2">
                        {/* Account */}
                        <Link
                          href="/account"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex-1 h-10 flex items-center justify-center bg-black text-white hover:bg-gray-800  rounded-md"
                        >
                          <User className="h-4 w-4 mr-1.5" />
                          <span className="text-xs font-medium">{t('account')}</span>
                        </Link>
                        
                        {/* Wishlist */}
                        <Link
                          href="/wishlist"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex-1 h-10 flex items-center justify-center bg-white text-black border border-gray-300 hover:bg-gray-50  rounded-md relative"
                        >
                          <Heart className="h-4 w-4 mr-1.5" />
                          <span className="text-xs font-medium">{tc('wishlist')}</span>
                          {wishlistCount > 0 && (
                            <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                              {wishlistCount}
                            </span>
                          )}
                        </Link>
                        
                        {/* Cart */}
                        <Link
                          href="/cart"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex-1 h-10 flex items-center justify-center bg-black text-white hover:bg-gray-800  rounded-md relative"
                        >
                          <ShoppingBag className="h-4 w-4 mr-1.5" />
                          <span className="text-xs font-medium">{t('cart')}</span>
                          {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                              {totalItems}
                            </span>
                          )}
                        </Link>
                      </div>
                      
                      {/* Support Links */}
                      <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-gray-200">
                        <Link href="/support" onClick={() => setIsMenuOpen(false)} className="text-xs font-mono text-gray-600 hover:text-black ">
                          {tf('customerService')}
                        </Link>
                        <Link href="/size-guide" onClick={() => setIsMenuOpen(false)} className="text-xs font-mono text-gray-600 hover:text-black ">
                          {tf('sizeGuide')}
                        </Link>
                        <Link href="/shipping" onClick={() => setIsMenuOpen(false)} className="text-xs font-mono text-gray-600 hover:text-black ">
                          {tf('shipping')}
                        </Link>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* Logo */}
                <div className="flex items-center gap-1">
                  <Link href="/" className="flex items-center transition-opacity duration-200 hover:opacity-90">
                    <span className="text-lg font-bold font-mono tracking-wide text-black">INDECISIVE</span>
                  </Link>
                  <Link 
                    href="https://www.instagram.com/indecisive_wear/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 hover:bg-gray-100 rounded "
                  >
                    <Instagram className="w-4 h-4 text-gray-600" />
                  </Link>
                </div>
              </div>

              {/* Right Actions - Search + Cart ONLY */}
              <div className="flex items-center">
                {/* Search */}
                <div className="-mr-2">
                  <MobileSearchDropdown />
                </div>

                {/* Cart */}
                <MobileCartDropdown />
              </div>
            </div>
          </nav>
        </div>

        {/* Spacer */}
        <div className="h-[90px] md:hidden" />
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
          {/* Профил (Account) */}
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
              <span className="text-[10px] font-medium">ПРОФИЛ</span>
            </Button>
          </Link>

          {/* Клуб (Community) */}
          <Link href="/#community">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "flex flex-col items-center gap-1 h-auto py-2 px-2 min-w-[60px] min-h-[48px] transition-all duration-150",
                pathname === "/#community" ? "text-black border border-black" : "text-gray-700 hover:text-black border border-transparent hover:border-black/30"
              )}
            >
              <Star className="h-5 w-5 stroke-[2.5]" />
              <span className="text-[10px] font-medium">КЛУБ</span>
            </Button>
          </Link>

          {/* Магазин (Shop) */}
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
              <span className="text-[10px] font-medium">МАГАЗИН</span>
            </Button>
          </Link>

          {/* Любими (Wishlist) */}
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
            <span className="text-[10px] font-medium">ЛЮБИМИ</span>
            {wishlistCount > 0 && (
              <Badge
                variant="secondary"
                className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] font-semibold bg-red-500 text-white border-2 border-white shadow-lg"
              >
                {wishlistCount}
              </Badge>
            )}
          </Button>

          {/* Количка (Cart) */}
          <MobileCartDropdown isBottomNav />
        </div>
      </div>
      
      {/* Wishlist Drawer */}
      <WishlistDrawer 
        open={showWishlistDrawer} 
        onOpenChange={setShowWishlistDrawer} 
      />
      
      {/* Desktop Cart Slideout */}
      <CartSlideout 
        isOpen={showCartSlideout} 
        onClose={() => setShowCartSlideout(false)} 
      />
    </>
  )
}