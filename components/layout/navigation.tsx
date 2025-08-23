"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ShoppingBag, Heart, User, Instagram, Star, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MobileCartSheet } from "@/components/layout/mobile-cart-sheet"
import { MobileCartDropdown } from "@/components/layout/mobile-cart-dropdown"
import { CartSlideout } from "@/components/cart/cart-slideout"
import { SearchDropdown } from "@/components/layout/search-dropdown"
import { WishlistDropdown } from "@/components/commerce/wishlist-dropdown"
import { FilterDrawer } from "@/components/commerce/filter-drawer"
import { useCart, setCartSlideoutCallback } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { useIndecisive } from "@/components/providers/indecisive-provider"
import { MarketSwitcher } from "@/components/commerce/market-switcher"
import { useTranslations } from 'next-intl'
import { useFlyToCart } from "@/contexts/fly-to-cart-context"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/providers/auth-provider"
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
  const { totalItems, cartReady: _cartReady } = useCart()
  const { totalItems: wishlistCount } = useWishlist()
  const { } = useIndecisive()
  const { setCartIconRef } = useFlyToCart()
  const { isAuthenticated } = useAuth()
  
  // State
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showBottomNav, setShowBottomNav] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [showCartSlideout, setShowCartSlideout] = useState(false)
  const [showFilterDrawer, setShowFilterDrawer] = useState(false)
  
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

  // Based on actual Shopify collections: bucket-hats, tees, tote-bags, tees-1, caps
  const collections = [
    { 
      name: t('hats'), 
      href: "/products?category=bucket-hats"
    },
    { 
      name: t('tshirts'), 
      href: "/products?category=tees"
    },
    { 
      name: t('bags'), 
      href: "/products?category=tote-bags"
    },
  ]

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:block">

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

              {/* Center Navigation */}
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
                    
                    {/* Dropdown for Collections */}
                    <NavigationMenuItem>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                          {t('collections')}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48 p-2">
                          <div className="space-y-1">
                            {collections.map((item) => (
                              <Link key={item.href} href={item.href}>
                                <div className="px-3 py-2 text-sm hover:bg-gray-100 rounded cursor-pointer">
                                  {item.name}
                                </div>
                              </Link>
                            ))}
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>

              {/* Right Actions */}
              <div className="flex items-center gap-2">
                {/* Market Switcher */}
                <MarketSwitcher />

                {/* Search */}
                <div className="hidden lg:block">
                  <SearchDropdown />
                </div>
                <div className="lg:hidden">
                  <SearchDropdown />
                </div>

                {/* Account */}
                <Link href="/account">
                  <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-gray-100 active:bg-gray-200 ">
                    <User className="h-5 w-5 stroke-[1.5]" />
                  </Button>
                </Link>

                {/* Wishlist */}
                <WishlistDropdown />

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
        <div className="fixed-mobile-safe w-full z-40 md:hidden touch-optimized">

          {/* Mobile Navigation Bar */}
          <nav className="bg-white shadow-sm border-b border-gray-100">
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
                    className="w-[calc(100vw-24px)] sm:w-[calc(100vw-48px)] max-w-md p-0 mt-1 border border-gray-200 shadow-xl bg-white rounded-xl overflow-hidden animate-none"
                    sideOffset={5}
                  >
                    <div className="max-h-[70vh] overflow-y-auto">
                      {/* User Actions - Top Priority */}
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center gap-2 mb-3">
                          {/* Account/Auth */}
                          {isAuthenticated ? (
                            <Link
                              href="/account"
                              onClick={() => setIsMenuOpen(false)}
                              className="flex-1 h-10 flex items-center justify-center bg-black text-white hover:bg-gray-800 rounded-xl transition-colors"
                            >
                              <User className="h-4 w-4 mr-1.5" />
                              <span className="text-sm font-medium">{t('account')}</span>
                            </Link>
                          ) : (
                            <>
                              <Link
                                href="/account/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex-1 h-10 flex items-center justify-center bg-black text-white hover:bg-gray-800 rounded-xl transition-colors"
                              >
                                <span className="text-sm font-medium">Sign In</span>
                              </Link>
                              <Link
                                href="/account/register"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex-1 h-10 flex items-center justify-center border border-black text-black hover:bg-gray-50 rounded-xl transition-colors"
                              >
                                <span className="text-sm font-medium">Sign Up</span>
                              </Link>
                            </>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {/* Wishlist */}
                          <Link
                            href="/wishlist"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex-1 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-xl relative transition-colors"
                          >
                            <Heart className="h-4 w-4 mr-1.5" />
                            <span className="text-sm font-medium">{tc('wishlist')}</span>
                            {wishlistCount > 0 && (
                              <Badge className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] font-semibold bg-red-500 text-white">
                                {wishlistCount}
                              </Badge>
                            )}
                          </Link>
                          
                          {/* Cart */}
                          <Link
                            href="/cart"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex-1 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-xl relative transition-colors"
                          >
                            <ShoppingBag className="h-4 w-4 mr-1.5" />
                            <span className="text-sm font-medium">{t('cart')}</span>
                            {totalItems > 0 && (
                              <Badge className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] font-semibold bg-red-500 text-white">
                                {totalItems}
                              </Badge>
                            )}
                          </Link>
                        </div>
                      </div>

                      {/* Main Navigation */}
                      <div className="p-4">
                        {/* Shop Categories */}
                        <h3 className="font-mono text-xs font-bold text-gray-500 mb-3 tracking-wider uppercase">Shop</h3>
                        <div className="space-y-2 mb-4">
                          {menuItems.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <span className="font-medium text-sm">{item.name}</span>
                              {item.badge && (
                                <Badge variant="secondary" className="text-xs">
                                  {item.badge}
                                </Badge>
                              )}
                            </Link>
                          ))}
                        </div>
                        
                        {/* Collections */}
                        <h3 className="font-mono text-xs font-bold text-gray-500 mb-3 tracking-wider uppercase">Collections</h3>
                        <div className="space-y-2">
                          {collections.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="flex items-center p-3 hover:bg-gray-50 rounded-xl transition-colors"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <span className="font-medium text-sm">{item.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                      
                      {/* Support Links */}
                      <div className="border-t border-gray-100 p-4 bg-gray-50/50">
                        <div className="flex items-center justify-center gap-4">
                          <Link href="/support" onClick={() => setIsMenuOpen(false)} className="text-xs text-gray-600 hover:text-black transition-colors">
                            {tf('customerService')}
                          </Link>
                          <Link href="/size-guide" onClick={() => setIsMenuOpen(false)} className="text-xs text-gray-600 hover:text-black transition-colors">
                            {tf('sizeGuide')}
                          </Link>
                          <Link href="/shipping" onClick={() => setIsMenuOpen(false)} className="text-xs text-gray-600 hover:text-black transition-colors">
                            {tf('shipping')}
                          </Link>
                        </div>
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
                  <SearchDropdown />
                </div>

                {/* Cart */}
                <MobileCartDropdown />
              </div>
            </div>
          </nav>
        </div>

        {/* Mobile Header Spacer */}
        <div className="h-14 md:hidden" />
      </>

      {/* Mobile Bottom Navigation */}
      <div 
        className={cn(
          "fixed-bottom-mobile-safe bg-white border-t border-black/10 z-40 md:hidden touch-optimized shadow-lg",
          "transition-transform duration-300 ease-in-out overscroll-contain",
          showBottomNav ? "transform translate-y-0" : "transform translate-y-full"
        )}
      >
        <div className="grid grid-cols-5 gap-0 py-2 px-2 pr-4 pb-safe">
          {/* Профил (Account) */}
          <div className="flex justify-center">
            <Link href="/account">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "flex flex-col items-center gap-1 h-auto py-2 px-2 min-w-[60px] min-h-[52px] transition-all duration-150 rounded-lg",
                  pathname === "/account" ? "text-black bg-gray-100" : "text-gray-600 hover:text-black hover:bg-gray-50"
                )}
            >
              <div className="relative">
                <User className="h-5 w-5 stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-medium">ПРОФИЛ</span>
              </Button>
            </Link>
          </div>

          {/* Клуб (Community) */}
          <div className="flex justify-center">
            <Link href="/#community">
              <Button
              variant="ghost"
              size="sm"
              className={cn(
                "flex flex-col items-center gap-1 h-auto py-2 px-2 min-w-[60px] min-h-[52px] transition-all duration-150 rounded-lg",
                pathname === "/#community" ? "text-black bg-gray-100" : "text-gray-600 hover:text-black hover:bg-gray-50"
              )}
            >
              <div className="relative">
                <Star className="h-5 w-5 stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-medium">КЛУБ</span>
              </Button>
            </Link>
          </div>

          {/* Магазин (Shop) or Филтри (Filters) */}
          <div className="flex justify-center">
            {pathname === "/products" ? (
              <Button
              variant="ghost"
              size="sm"
              className={cn(
                "flex flex-col items-center gap-1 h-auto py-2 px-2 min-w-[60px] min-h-[52px] transition-all duration-150 rounded-lg",
                showFilterDrawer ? "text-black bg-gray-100" : "text-gray-600 hover:text-black hover:bg-gray-50"
              )}
              onClick={() => setShowFilterDrawer(true)}
            >
              <div className="relative">
                <SlidersHorizontal className="h-5 w-5 stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-medium">ФИЛТРИ</span>
              </Button>
            ) : (
              <Link href="/products">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "flex flex-col items-center gap-1 h-auto py-2 px-2 min-w-[60px] min-h-[52px] transition-all duration-150 rounded-lg",
                  "text-gray-600 hover:text-black hover:bg-gray-50"
                )}
              >
                <div className="relative">
                  <ShoppingBag className="h-5 w-5 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-medium">МАГАЗИН</span>
              </Button>
              </Link>
            )}
          </div>

          {/* Любими (Wishlist) */}
          <div className="flex justify-center">
            <WishlistDropdown isBottomNav />
          </div>

          {/* Количка (Cart) */}
          <div className="flex justify-center">
            <MobileCartDropdown isBottomNav />
          </div>
        </div>
      </div>
      
      
      {/* Desktop Cart Slideout */}
      <CartSlideout 
        isOpen={showCartSlideout} 
        onClose={() => setShowCartSlideout(false)} 
      />
      
      {/* Filter Drawer */}
      <FilterDrawer 
        open={showFilterDrawer} 
        onOpenChange={setShowFilterDrawer} 
      />
    </>
  )
}