"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, ShoppingBag, Heart, User } from "lucide-react"
import { MobileCartSheet } from "@/components/layout/mobile-cart-sheet"
import { MobileSearchSheet } from "@/components/layout/mobile-search-sheet"
import { SearchBar } from "@/components/layout/search-bar"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

export function DesktopNavigation() {
  const { totalItems } = useCart()
  const { totalItems: wishlistCount } = useWishlist()
  const [showSearchBar, setShowSearchBar] = useState(false)

  const categories = [
    {
      title: "NEW",
      href: "/new",
      isSimple: true, // No dropdown for NEW
    },
    {
      title: "COMING SOON",
      href: "/coming-soon",
      isSimple: true, // No dropdown for COMING SOON
    },
  ]

  return (
    <div className="hidden md:block">
      {/* Top Banner */}
      <div className="bg-black text-white py-2 text-center text-sm">
        <p>FREE SHIPPING ON ORDERS OVER $100 | 30-DAY RETURNS</p>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white border-b-2 border-primary">
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
                      <Link href={category.href} legacyBehavior passHref>
                        <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                          {category.title}
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  ))}
                  
                  <NavigationMenuItem>
                    <Link href="/sale" legacyBehavior passHref>
                      <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                        <span className="text-red-600">SALE</span>
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            )}

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Search - Desktop shows inline search, mobile shows sheet */}
              <div className="hidden lg:block">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowSearchBar(!showSearchBar)}
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>
              <div className="lg:hidden">
                <MobileSearchSheet>
                  <Button variant="ghost" size="icon">
                    <Search className="h-5 w-5" />
                  </Button>
                </MobileSearchSheet>
              </div>

              {/* Account */}
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>

              {/* Wishlist */}
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-black text-white"
                  >
                    {wishlistCount}
                  </Badge>
                )}
              </Button>

              {/* Cart */}
              <MobileCartSheet>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  {totalItems > 0 && (
                    <Badge
                      variant="secondary"
                      className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-black text-white"
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