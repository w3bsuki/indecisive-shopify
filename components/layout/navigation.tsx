"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ShoppingBag, Heart, User, Instagram, SlidersHorizontal, Palette } from "lucide-react"
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

  // Collections menu (mix of Shopify collections and custom pages)
  const collections = [
    { name: t('hats'), href: "/products?category=bucket-hats" },
    { name: t('tshirts'), href: "/tshirts" },
    { name: t('cropTops'), href: "/crop-tops" },
    { name: t('bags'), href: "/products?category=tote-bags" },
  ]

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:block">

        {/* Main Navigation - Modern Glass Style */}
        <nav className="relative bg-white/80 backdrop-blur-xl border-b border-gray-100/50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-18">
              {/* Logo */}
              <Link href="/" className="flex items-center group">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-black rounded-sm"></div>
                    <div className="w-3 h-3 bg-black/20 border border-black/30 rounded-sm"></div>
                  </div>
                  <h1 className="text-xl font-medium tracking-wide text-black group-hover:text-black/80 transition-colors duration-200">
                    INDECISIVE WEAR
                  </h1>
                </div>
              </Link>

              {/* Center Navigation */}
              <NavigationMenu className="hidden lg:flex">
                <NavigationMenuList className="gap-1">
                  {menuItems.map((category) => (
                    <NavigationMenuItem key={category.href}>
                      <NavigationMenuLink asChild>
                        <Link 
                          href={category.href}
                          className={cn(
                            "group inline-flex h-9 w-max items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                            category.href === "/sale" 
                              ? "bg-black text-white hover:bg-black/90 shadow-sm"
                              : "text-black/70 hover:text-black hover:bg-black/5 backdrop-blur-sm"
                          )}
                        >
                          {category.name}
                          {category.badge && (
                            <Badge 
                              variant={category.href === "/sale" ? "secondary" : "outline"} 
                              className={cn(
                                "ml-2 text-[9px] h-4 px-1.5",
                                category.href === "/sale" 
                                  ? "bg-white text-black border-white" 
                                  : "bg-black/10 text-black/80 border-black/20"
                              )}
                            >
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
                      <DropdownMenuTrigger className="group inline-flex h-9 w-max items-center justify-center rounded-full px-4 py-2 text-sm font-medium text-black/70 hover:text-black hover:bg-black/5 backdrop-blur-sm transition-all duration-300 focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                        {t('collections')}
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-48 p-2 bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-xl rounded-xl">
                        <div className="space-y-1">
                          {collections.map((item) => (
                            <Link key={item.href} href={item.href}>
                              <div className="px-3 py-2 text-sm hover:bg-black/5 rounded-lg cursor-pointer transition-colors duration-200 text-black/80 hover:text-black">
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
              <div className="flex items-center gap-1">
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
                  <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-black/5 hover:backdrop-blur-sm active:bg-black/10 rounded-full transition-all duration-200">
                    <User className="h-4 w-4 stroke-[1.5] text-black/70" />
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
                    className="relative h-9 w-9 hover:bg-black/5 hover:backdrop-blur-sm active:bg-black/10 rounded-full transition-all duration-200"
                    onClick={() => setShowCartSlideout(true)}
                  >
                    <ShoppingBag className="h-4 w-4 stroke-[1.5] text-black/70" />
                    {totalItems > 0 && (
                      <Badge
                        variant="secondary"
                        className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[9px] font-semibold bg-black text-white border border-white/20 cart-icon-bounce shadow-sm"
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
                      className="relative h-9 w-9 hover:bg-black/5 hover:backdrop-blur-sm active:bg-black/10 rounded-full transition-all duration-200"
                    >
                      <ShoppingBag className="h-4 w-4 stroke-[1.5] text-black/70" />
                      {totalItems > 0 && (
                        <Badge
                          variant="secondary"
                          className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[9px] font-semibold bg-black text-white border border-white/20 cart-icon-bounce shadow-sm"
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
            <div className="pl-1 pr-2 h-16 flex items-center justify-between">
              {/* Left: Menu + Brand */}
              <div className="flex items-center space-x-0">
                <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <button className="relative h-10 w-10 -mr-1 flex items-center justify-center focus:outline-none focus-visible:outline-none">
                      {isMenuOpen ? (
                        <X className="h-5 w-5 stroke-[1.5]" />
                      ) : (
                        <Menu className="h-5 w-5 stroke-[1.5]" />
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="start" 
                    side="bottom"
                    className="w-[calc(100vw-16px)] max-w-none p-0 mt-1 border border-gray-200 shadow-xl bg-white rounded-xl overflow-hidden animate-none"
                    sideOffset={5}
                  >
                    <div className="p-4">
                      {/* Social */}
                      <div className="mb-3">
                        <Link
                          href="https://www.instagram.com/indecisive_wear/"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center justify-between p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                        >
                          <span className="flex items-center gap-2 text-sm font-medium">
                            <Instagram className="h-4 w-4" /> Instagram
                          </span>
                          <span className="text-xs text-gray-500">@indecisive_wear</span>
                        </Link>
                      </div>
                      {/* Social */}
                      <div className="mb-3">
                        <Link
                          href="https://www.instagram.com/indecisive_wear/"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center justify-between p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                        >
                          <span className="flex items-center gap-2 text-sm font-medium">
                            <Instagram className="h-4 w-4" /> Instagram
                          </span>
                          <span className="text-xs text-gray-500">@indecisive_wear</span>
                        </Link>
                      </div>

                      {/* Auth CTAs */}
                      <div className="flex items-center gap-2 mb-4">
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
                              <span className="text-sm font-medium">{t('signIn')}</span>
                            </Link>
                            <Link
                              href="/account/register"
                              onClick={() => setIsMenuOpen(false)}
                              className="flex-1 h-10 flex items-center justify-center border border-black text-black hover:bg-gray-50 rounded-xl transition-colors"
                            >
                              <span className="text-sm font-medium">{t('signUp')}</span>
                            </Link>
                          </>
                        )}
                      </div>

                      {/* Collections (minimal) */}
                      <h3 className="font-mono text-xs font-bold text-gray-500 mb-3 tracking-wider uppercase">{t('collections')}</h3>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        {collections.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="p-3 text-center bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <span className="text-sm font-mono">{item.name}</span>
                          </Link>
                        ))}
                      </div>

                      {/* Legal/Support (compact, no-scroll) */}
                      <div className="mt-3 pt-3 border-t border-gray-100 text-[11px] text-gray-600 leading-relaxed">
                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                          <Link href="/privacy" onClick={() => setIsMenuOpen(false)} className="hover:text-black">{tf('privacy')}</Link>
                          <Link href="/terms" onClick={() => setIsMenuOpen(false)} className="hover:text-black">{tf('terms')}</Link>
                          <Link href="/shipping" onClick={() => setIsMenuOpen(false)} className="hover:text-black">{tf('shipping')}</Link>
                          <Link href="/returns" onClick={() => setIsMenuOpen(false)} className="hover:text-black">{tf('returns')}</Link>
                          <Link href="/size-guide" onClick={() => setIsMenuOpen(false)} className="hover:text-black">{tf('sizeGuide')}</Link>
                          <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="hover:text-black">{tf('contact')}</Link>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Link href="/" className="flex items-center transition-opacity duration-200 hover:opacity-90">
                  <span className="text-xl font-bold font-mono leading-none text-black">INDECISIVE</span>
                </Link>
              </div>

              {/* Right: Search then Cart (tight) */}
              <div className="flex items-center space-x-0">
                <SearchDropdown />
                <MobileCartDropdown />
              </div>
            </div>
          </nav>
        </div>

        {/* Mobile Header Spacer */}
        <div className="h-16 md:hidden" />
      </>

      {/* Mobile Bottom Navigation - Hide on custom page and all product routes */}
      {!pathname.startsWith('/products') && pathname !== '/custom' && (
        <div 
          className={cn(
            "fixed-bottom-mobile-safe z-40 md:hidden touch-optimized",
            "transition-transform duration-300 ease-in-out overscroll-contain",
            showBottomNav ? "transform translate-y-0" : "transform translate-y-full"
          )}
        >
          {/* Glass Container */}
          <div className="mx-2 mb-0 pb-safe">
            <div className="relative glass-light rounded-2xl shadow-2xl overflow-hidden">
              <div className="grid grid-cols-5 gap-0 py-3 px-3">
                {/* Профил (Account) */}
                <div className="flex justify-center">
                  <Link href="/account">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "flex flex-col items-center gap-1.5 h-auto py-2.5 px-2 min-w-[56px] min-h-[50px] transition-all duration-300 rounded-xl",
                        pathname === "/account" 
                          ? "text-black bg-black/10 backdrop-blur-sm border border-black/20" 
                          : "text-black/70 hover:text-black hover:bg-white/60 hover:backdrop-blur-sm"
                      )}
                    >
                      <div className="relative">
                        <User className="h-[18px] w-[18px] stroke-[2.5]" />
                      </div>
                      <span className="text-[9px] font-medium tracking-[0.05em]">ПРОФИЛ</span>
                    </Button>
                  </Link>
                </div>

                {/* Custom (Design) */}
                <div className="flex justify-center">
                  <Link href="/custom">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "flex flex-col items-center gap-1.5 h-auto py-2.5 px-2 min-w-[56px] min-h-[50px] transition-all duration-300 rounded-xl",
                        pathname === "/custom" 
                          ? "text-black bg-black/10 backdrop-blur-sm border border-black/20" 
                          : "text-black/70 hover:text-black hover:bg-white/60 hover:backdrop-blur-sm"
                      )}
                    >
                      <div className="relative">
                        <Palette className="h-[18px] w-[18px] stroke-[2.5]" />
                      </div>
                      <span className="text-[9px] font-medium tracking-[0.05em]">CUSTOM</span>
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
                        "flex flex-col items-center gap-1.5 h-auto py-2.5 px-2 min-w-[56px] min-h-[50px] transition-all duration-300 rounded-xl",
                        showFilterDrawer 
                          ? "text-black bg-black/10 backdrop-blur-sm border border-black/20" 
                          : "text-black/70 hover:text-black hover:bg-white/60 hover:backdrop-blur-sm"
                      )}
                      onClick={() => setShowFilterDrawer(true)}
                    >
                      <div className="relative">
                        <SlidersHorizontal className="h-[18px] w-[18px] stroke-[2.5]" />
                      </div>
                      <span className="text-[9px] font-medium tracking-[0.05em]">ФИЛТРИ</span>
                    </Button>
                  ) : (
                    <Link href="/products">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "flex flex-col items-center gap-1.5 h-auto py-2.5 px-2 min-w-[56px] min-h-[50px] transition-all duration-300 rounded-xl",
                          "text-black/70 hover:text-black hover:bg-white/60 hover:backdrop-blur-sm"
                        )}
                      >
                        <div className="relative">
                          <ShoppingBag className="h-[18px] w-[18px] stroke-[2.5]" />
                        </div>
                        <span className="text-[9px] font-medium tracking-[0.05em]">МАГАЗИН</span>
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
          </div>
        </div>
      )}
      
      
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
