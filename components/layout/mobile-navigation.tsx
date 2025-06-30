"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, ShoppingBag, Heart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MobileCartSheet } from "@/components/layout/mobile-cart-sheet"
import { MobileSearchSheet } from "@/components/layout/mobile-search-sheet"

export function MobileNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const menuItems = [
    { name: "NEW ARRIVALS", href: "/new", badge: "HOT" },
    { name: "ESSENTIALS", href: "/essentials", badge: null },
    { name: "STREETWEAR", href: "/streetwear", badge: null },
    { name: "OUTERWEAR", href: "/outerwear", badge: null },
    { name: "BOTTOMS", href: "/bottoms", badge: null },
    { name: "ACCESSORIES", href: "/accessories", badge: null },
    { name: "LOOKBOOK", href: "/lookbook", badge: null },
    { name: "SALE", href: "/sale", badge: "50% OFF" },
  ]


  return (
    <>
      {/* Mobile Navigation Stack */}
      <div className="fixed top-0 w-full z-50 md:hidden">
        {/* Newsletter Banner */}
        <div className="bg-black text-white py-3 px-4 text-center">
          <p className="text-sm font-mono">
            <strong>BECOME AN AFFILIATE</strong> - Earn 15% commission
          </p>
        </div>

        {/* Mobile Navigation Bar */}
        <nav className="bg-white/95 backdrop-blur-md border-b border-black/10">
          <div className="px-3 h-16 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-lg font-bold font-mono tracking-wider">INDECISIVE WEAR</span>
            </Link>

            {/* Right Actions */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <MobileSearchSheet />

              {/* Cart */}
              <MobileCartSheet />

              {/* Menu */}
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-[400px] p-0 border-2 border-black bg-white">
                  <div className="flex flex-col h-full">
                    {/* Menu Header - Logo + Icons Row */}
                    <div className="px-6 py-6 border-b-2 border-black">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                          <span className="text-xl font-bold font-mono tracking-wider">INDECISIVE WEAR</span>
                        </div>
                        
                        {/* Close Button */}
                        <button
                          onClick={() => setIsMenuOpen(false)}
                          className="w-10 h-10 flex items-center justify-center bg-black text-white hover:bg-gray-800 transition-colors duration-200 border-none focus:outline-none focus:ring-0"
                          aria-label="Close menu"
                        >
                          <X className="h-5 w-5" />
                        </button>
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
                          ACCOUNT
                        </Link>
                        
                        {/* Wishlist */}
                        <Link
                          href="/wishlist"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex-1 h-12 flex items-center justify-center bg-white text-black border-2 border-black hover:bg-gray-50 transition-all duration-200 font-mono text-sm font-medium"
                        >
                          <Heart className="h-4 w-4 mr-2" />
                          WISHLIST
                        </Link>
                        
                        {/* Cart */}
                        <Link
                          href="/cart"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex-1 h-12 flex items-center justify-center bg-black text-white hover:bg-gray-800 transition-all duration-200 font-mono text-sm font-medium"
                        >
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          CART
                        </Link>
                      </div>
                    </div>

                    {/* Navigation Categories */}
                    <div className="flex-1 overflow-y-auto">
                      <nav className="px-6 py-6">
                        <h3 className="font-mono text-xs font-bold text-gray-600 mb-4 tracking-wider">CATEGORIES</h3>
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
                    <div className="border-t-2 border-black px-6 py-6 bg-gray-50">
                      <div className="space-y-3">
                        <Link href="/support" className="block font-mono text-sm font-medium hover:text-gray-600 transition-colors">
                          CUSTOMER SUPPORT
                        </Link>
                        <Link href="/size-guide" className="block font-mono text-sm font-medium hover:text-gray-600 transition-colors">
                          SIZE GUIDE
                        </Link>
                        <Link href="/shipping" className="block font-mono text-sm font-medium hover:text-gray-600 transition-colors">
                          SHIPPING & RETURNS
                        </Link>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>
      </div>

      {/* Spacer */}
      <div className="h-[104px] md:hidden" />
    </>
  )
}