'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, User, Heart, ShoppingBag, LogIn, UserPlus, Instagram } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useTranslations } from 'next-intl'
import { useCart } from '@/hooks/use-cart'
import { useWishlist } from '@/hooks/use-wishlist'
import { cn } from '@/lib/utils'

interface MobileMenuProps {
  className?: string
}

export function MobileMenu({ className }: MobileMenuProps) {
  const t = useTranslations('nav')
  const tf = useTranslations('footer')
  const [isOpen, setIsOpen] = useState(false)
  
  const { totalItems } = useCart()
  const { items: wishlistItems } = useWishlist()
  const wishlistCount = wishlistItems.length

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className={cn("relative min-h-[44px] min-w-[44px] flex items-center justify-center -ml-1", className)}>
          {isOpen ? 
            <X className="h-5 w-5 stroke-[1.5]" /> : 
            <Menu className="h-5 w-5 stroke-[1.5]" />
          }
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="!w-full !max-w-none !left-0 !right-0 p-0 flex flex-col" style={{ height: 'calc(100vh - 64px)', bottom: '64px' }}>
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle className="font-mono text-lg tracking-wide">INDECISIVE</SheetTitle>
        </SheetHeader>
        
        {/* Main Content - Scrollable */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Auth Buttons */}
          <div className="px-6 py-3 flex gap-2">
            <Link href="/account/login" onClick={() => setIsOpen(false)} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                <LogIn className="h-4 w-4 mr-1.5" />
                {t('signIn')}
              </Button>
            </Link>
            <Link href="/account/register" onClick={() => setIsOpen(false)} className="flex-1">
              <Button variant="default" size="sm" className="w-full">
                <UserPlus className="h-4 w-4 mr-1.5" />
                {t('signUp')}
              </Button>
            </Link>
          </div>

          {/* Quick Links - Horizontal */}
          <div className="px-6 py-3 flex gap-2 border-t">
            <Link
              href="/account"
              onClick={() => setIsOpen(false)}
              className="flex-1 flex items-center justify-center gap-2 p-3 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <User className="h-4 w-4" />
              <span className="text-sm">{t('account')}</span>
            </Link>
            
            <Link
              href="/wishlist"
              onClick={() => setIsOpen(false)}
              className="flex-1 flex items-center justify-center gap-2 p-3 hover:bg-gray-100 rounded-lg transition-colors relative"
            >
              <Heart className="h-4 w-4" />
              <span className="text-sm">Wishlist</span>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            
            <Link
              href="/cart"
              onClick={() => setIsOpen(false)}
              className="flex-1 flex items-center justify-center gap-2 p-3 hover:bg-gray-100 rounded-lg transition-colors relative"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="text-sm">{t('cart')}</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Collections Accordion */}
          <div className="px-6 py-4 border-t">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="apparel" className="border-b-0">
                <AccordionTrigger className="py-3 text-sm font-mono font-medium">
                  {t('apparel').toUpperCase()}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/products?collection=hats"
                      onClick={() => setIsOpen(false)}
                      className="p-3 text-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <span className="text-sm font-mono">{t('hats')}</span>
                    </Link>
                    <Link
                      href="/tshirts"
                      onClick={() => setIsOpen(false)}
                      className="p-3 text-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <span className="text-sm font-mono">{t('tshirts')}</span>
                    </Link>
                    <Link
                      href="/crop-tops"
                      onClick={() => setIsOpen(false)}
                      className="p-3 text-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <span className="text-sm font-mono">{t('cropTops')}</span>
                    </Link>
                    <Link
                      href="/products?collection=hoodies"
                      onClick={() => setIsOpen(false)}
                      className="p-3 text-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <span className="text-sm font-mono">Hoodies</span>
                    </Link>
                    <Link
                      href="/products?collection=jackets"
                      onClick={() => setIsOpen(false)}
                      className="p-3 text-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <span className="text-sm font-mono">Jackets</span>
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="accessories" className="border-b-0">
                <AccordionTrigger className="py-3 text-sm font-mono font-medium">
                  ACCESSORIES
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/products?collection=bags"
                      onClick={() => setIsOpen(false)}
                      className="p-3 text-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <span className="text-sm font-mono">Bags</span>
                    </Link>
                    <Link
                      href="/products?collection=belts"
                      onClick={() => setIsOpen(false)}
                      className="p-3 text-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <span className="text-sm font-mono">Belts</span>
                    </Link>
                    <Link
                      href="/products?collection=watches"
                      onClick={() => setIsOpen(false)}
                      className="p-3 text-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <span className="text-sm font-mono">Watches</span>
                    </Link>
                    <Link
                      href="/products?collection=jewelry"
                      onClick={() => setIsOpen(false)}
                      className="p-3 text-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <span className="text-sm font-mono">Jewelry</span>
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="featured" className="border-b-0">
                <AccordionTrigger className="py-3 text-sm font-mono font-medium">
                  FEATURED
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <Link
                      href="/new"
                      onClick={() => setIsOpen(false)}
                      className="block p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors relative"
                    >
                      <span className="font-mono text-sm font-medium">New Arrivals</span>
                      <span className="absolute top-2 right-2 text-[10px] bg-black text-white px-1.5 py-0.5 rounded">NEW</span>
                    </Link>
                    <Link
                      href="/sale"
                      onClick={() => setIsOpen(false)}
                      className="block p-3 bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 relative shadow-sm border border-red-800"
                    >
                      <span className="font-mono text-sm font-medium text-white">Sale Items</span>
                      <span className="absolute top-2 right-2 text-[10px] bg-white text-red-700 px-1.5 py-0.5 rounded font-semibold">UP TO 75%</span>
                    </Link>
                    <Link
                      href="/collections/bestsellers"
                      onClick={() => setIsOpen(false)}
                      className="block p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <span className="font-mono text-sm font-medium">Bestsellers</span>
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Support Links */}
          <div className="px-6 py-3 grid grid-cols-2 gap-2 text-xs border-t mt-auto">
            <Link href="/support" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-black">
              {tf('customerService')}
            </Link>
            <Link href="/shipping" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-black">
              {tf('shipping')}
            </Link>
            <Link href="/size-guide" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-black">
              {tf('sizeGuide')}
            </Link>
            <Link href="/returns" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-black">
              {tf('returns')}
            </Link>
          </div>
        </div>

        {/* Footer - Outside scrollable area */}
        <div className="border-t bg-gray-50 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <Link href="/privacy-policy" onClick={() => setIsOpen(false)} className="text-xs text-gray-600 hover:text-black">
                {tf('privacy')}
              </Link>
              <Link href="/terms" onClick={() => setIsOpen(false)} className="text-xs text-gray-600 hover:text-black">
                {tf('terms')}
              </Link>
            </div>
            <Link 
              href="https://instagram.com/indecisivewear" 
              target="_blank"
              className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
            >
              <Instagram className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
