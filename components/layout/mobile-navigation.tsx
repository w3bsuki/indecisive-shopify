"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Search, ShoppingBag, Heart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MobileCartSheet } from "@/components/layout/mobile-cart-sheet"
import { MobileSearchSheet } from "@/components/layout/mobile-search-sheet"
import { useCart } from "@/hooks/use-cart"

export function MobileNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { totalItems } = useCart()

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

  const accountItems = [
    { name: "MY ACCOUNT", href: "/account", icon: User },
    { name: "WISHLIST", href: "/wishlist", icon: Heart },
    { name: "ORDER HISTORY", href: "/orders", icon: ShoppingBag },
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
                <SheetContent side="right" className="w-full sm:w-[400px] p-0">
                  <div className="flex flex-col h-full">
                    {/* Menu Header */}
                    <div className="px-6 py-4 border-b">
                      <h2 className="text-lg font-bold">MENU</h2>
                    </div>

                    {/* Menu Items */}
                    <div className="flex-1 overflow-y-auto px-6 py-6">
                      <nav className="space-y-1">
                        {menuItems.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center justify-between py-3 text-base font-medium hover:text-gray-600 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <span>{item.name}</span>
                            {item.badge && (
                              <Badge variant="secondary" className="text-xs">
                                {item.badge}
                              </Badge>
                            )}
                          </Link>
                        ))}
                      </nav>

                      {/* Account Section */}
                      <div className="mt-8 pt-8 border-t">
                        <h3 className="text-sm font-bold text-gray-600 mb-4">ACCOUNT</h3>
                        <nav className="space-y-1">
                          {accountItems.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="flex items-center gap-3 py-3 text-base hover:text-gray-600 transition-colors"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <item.icon className="h-5 w-5" />
                              <span>{item.name}</span>
                            </Link>
                          ))}
                        </nav>
                      </div>
                    </div>

                    {/* Menu Footer */}
                    <div className="border-t px-6 py-4">
                      <p className="text-sm text-gray-600">
                        Need help? <Link href="/contact" className="font-medium underline">Contact us</Link>
                      </p>
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