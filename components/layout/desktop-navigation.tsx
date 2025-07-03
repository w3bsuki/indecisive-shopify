"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, ShoppingBag, Heart, User } from "lucide-react"
import { MobileCartSheet } from "@/components/layout/mobile-cart-sheet"
import { MobileSearchSheet } from "@/components/layout/mobile-search-sheet"
import { SearchBar } from "@/components/layout/search-bar"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { MarketSwitcher } from "@/components/commerce/market-switcher"
import { useTranslations } from 'next-intl'
import { useFlyToCart } from "@/contexts/fly-to-cart-context"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

export function DesktopNavigation() {
  const t = useTranslations('nav')
  const { totalItems } = useCart()
  const { totalItems: wishlistCount } = useWishlist()
  const [showSearchBar, setShowSearchBar] = useState(false)
  const { setCartIconRef } = useFlyToCart()
  const cartIconRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (cartIconRef.current) {
      setCartIconRef(cartIconRef.current)
    }
  }, [setCartIconRef])

  const categories = [
    {
      title: t('new'),
      href: "/new",
      isSimple: true, // No dropdown for NEW
    },
    {
      title: t('comingSoon'),
      href: "/coming-soon",
      isSimple: true, // No dropdown for COMING SOON
    },
  ]

  return (
    <div className="hidden md:block">
      {/* Top Banner */}
      <div className="bg-black text-white py-2 text-center text-sm">
        <p>{t('banner')}</p>
      </div>

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
                  {categories.map((category) => (
                    <NavigationMenuItem key={category.title}>
                      <NavigationMenuLink asChild>
                        <Link 
                          href={category.href}
                          className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                        >
                          {category.title}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                  
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link 
                        href="/sale"
                        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                      >
                        <span className="text-red-600">{t('sale')}</span>
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            )}

            {/* Right Actions - Clean, modern icons */}
            <div className="flex items-center gap-2">
              {/* Market Switcher */}
              <MarketSwitcher />

              {/* Search - Clean hover states */}
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
              <Link href="/wishlist">
                <Button variant="ghost" size="icon" className="relative h-10 w-10 hover:bg-gray-100 active:bg-gray-200 transition-colors">
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
              </Link>

              {/* Cart */}
              <MobileCartSheet>
                <Button 
                  ref={cartIconRef}
                  variant="ghost" 
                  size="icon" 
                  className="relative h-16 w-16 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                >
                  <ShoppingBag className="h-8 w-8 stroke-[1.5]" />
                  {totalItems > 0 && (
                    <Badge
                      variant="secondary"
                      className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-black text-white border-2 border-white"
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
  )
}