"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, ShoppingBag, Heart, User } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MobileCartSheet } from "@/components/layout/mobile-cart-sheet"
import { MobileSearchSheet } from "@/components/layout/mobile-search-sheet"
import { useWishlist } from "@/hooks/use-wishlist"
import { MarketSwitcher } from "@/components/commerce/market-switcher"
import { useTranslations } from "next-intl"

export function MobileNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { totalItems: wishlistCount } = useWishlist()
  const t = useTranslations('nav')
  const tc = useTranslations('common')
  const tf = useTranslations('footer')

  const menuItems = [
    { name: t('new'), href: "/new", badge: "DROP 1" },
    { name: t('comingSoon'), href: "/coming-soon", badge: null },
    { name: t('sale'), href: "/sale", badge: "50% OFF" },
  ]


  return (
    <>
      {/* Mobile Navigation Stack */}
      <div className="fixed-mobile-safe w-full z-50 md:hidden touch-optimized">
        {/* Newsletter Banner */}
        <div className="bg-black text-white py-3 px-4 text-center">
          <p className="text-sm font-mono">
            {t('banner')}
          </p>
        </div>

        {/* Mobile Navigation Bar */}
        <nav className="bg-white/95 backdrop-blur-md border-b border-gray-950 overscroll-contain">
          <div className="px-3 h-16 flex items-center justify-between">
            {/* Left Side: Menu + Logo */}
            <div className="flex items-center gap-1">
              {/* Menu on LEFT */}
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <button className="relative h-12 w-12 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-all duration-200 rounded-lg -ml-2">
                    {isMenuOpen ? <X className="h-6 w-6 stroke-[1.5] text-black" /> : <Menu className="h-6 w-6 stroke-[1.5] text-black" />}
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full sm:w-[400px] p-0 border border-gray-950 bg-white">
                  <div className="flex flex-col h-full">
                    {/* Menu Header - Logo + Icons Row */}
                    <div className="px-6 py-6 border-b border-gray-950">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                          <span className="text-xl font-bold font-mono tracking-wider">INDECISIVE WEAR</span>
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
                              key={item.name}
                              href={item.href}
                              className="flex items-center justify-between py-4 text-lg font-medium hover:text-gray-600 transition-colors border-b border-gray-100 last:border-b-0"
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
              <Link href="/" className="flex items-center">
                <span className="text-lg font-bold font-mono tracking-wider">INDECISIVE WEAR</span>
              </Link>
            </div>

            {/* Right Actions - Search + Cart ONLY */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <MobileSearchSheet />

              {/* Cart */}
              <MobileCartSheet />
            </div>
          </div>
        </nav>
      </div>

      {/* Spacer */}
      <div className="h-[104px] md:hidden" />
    </>
  )
}