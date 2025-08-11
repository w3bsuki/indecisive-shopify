'use client'

import { useState, useEffect, memo, forwardRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, Heart, ShoppingBag, LogIn, UserPlus, Tag, ChevronRight, Sparkles, TrendingUp, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import { useTranslations } from 'next-intl'
import { useCart } from '@/hooks/use-cart'
import { useWishlist } from '@/hooks/use-wishlist'
import { cn } from '@/lib/utils'

interface MobileMenuProps {
  className?: string
}

// Animated Hamburger Icon Component with smoother transitions
const AnimatedHamburger = memo(forwardRef<HTMLDivElement, { isOpen: boolean; className?: string }>(function AnimatedHamburger({ isOpen, className }, ref) {
  return (
    <div ref={ref} className={cn("relative w-6 h-5 select-none", className)} aria-hidden>
      <span
        className={cn(
          "absolute left-0 w-6 h-0.5 bg-current rounded-full transition-all duration-300 ease-out",
          isOpen ? "top-2.5 rotate-45" : "top-0 rotate-0"
        )}
      />
      <span
        className={cn(
          "absolute left-0 top-2.5 w-6 h-0.5 bg-current rounded-full transition-all duration-300 ease-out",
          isOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
        )}
      />
      <span
        className={cn(
          "absolute left-0 w-6 h-0.5 bg-current rounded-full transition-all duration-300 ease-out",
          isOpen ? "bottom-2.5 -rotate-45" : "bottom-0 rotate-0"
        )}
      />
    </div>
  )
}))

export function MobileMenu({ className }: MobileMenuProps) {
  const t = useTranslations('nav')
  const tf = useTranslations('footer')
  const tp = useTranslations('products')
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  const { totalItems } = useCart()
  const { items: wishlistItems } = useWishlist()
  const wishlistCount = wishlistItems.length

  useEffect(() => { setMounted(true) }, [])
  
  // Close menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])
  
  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollbarWidth}px`
    } else {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [isOpen])

  if (!mounted) return null

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "relative h-10 w-10 rounded-lg",
            "hover:bg-black/5 active:bg-black/10 transition-colors",
            className
          )}
          aria-expanded={isOpen}
          aria-label={isOpen ? tp('close') : 'Menu'}
        >
          <AnimatedHamburger isOpen={isOpen} />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className={cn(
          "w-[85vw] max-w-sm p-0 flex flex-col h-full",
          "bg-white border-r border-gray-200"
        )}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {/* Header with Brand */}
        <SheetHeader className="px-6 pt-6 pb-4 space-y-2">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-mono text-lg font-bold tracking-wider">
              INDECISIVE WEAR
            </SheetTitle>
            <SheetClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary" aria-label="Close menu">
              <span className="sr-only">Close</span>
            </SheetClose>
          </div>
          <p className="text-xs text-muted-foreground">Premium streetwear for the indecisive</p>
        </SheetHeader>
        
        <Separator />

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 overscroll-contain">
          {/* Auth Section */}
          <div className="px-6 py-4">
            <div className="grid grid-cols-2 gap-3">
              <Link href="/account/login" onClick={() => setIsOpen(false)}>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full h-10 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  {t('signIn')}
                </Button>
              </Link>
              <Link href="/account/register" onClick={() => setIsOpen(false)}>
                <Button 
                  size="sm" 
                  className="w-full h-10 bg-black text-white hover:bg-gray-900 transition-all"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {t('signUp')}
                </Button>
              </Link>
            </div>
          </div>
          
          <Separator />

          {/* Main Navigation */}
          <nav className="px-6 py-4 space-y-2" role="navigation" aria-label="Main navigation">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3" id="shop-menu">
              Shop
            </h3>
            
            {[
              { href: '/', label: 'Home', icon: <Home className="h-4 w-4" />, badge: null },
              { href: '/products', label: t('all'), icon: <ShoppingBag className="h-4 w-4" />, badge: null },
              { href: '/collections/new', label: t('new'), icon: <Sparkles className="h-4 w-4" />, badge: 'NEW' },
              { href: '/collections/sale', label: t('sale'), icon: <Tag className="h-4 w-4" />, badge: '50% OFF' },
              { href: '/collections/bestsellers', label: t('bestsellers'), icon: <TrendingUp className="h-4 w-4" />, badge: null },
            ].map((item) => {
              const active = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group",
                    "hover:bg-gray-100 active:bg-gray-200",
                    active && "bg-gray-100 font-medium"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "transition-colors",
                      active ? "text-black" : "text-gray-600 group-hover:text-black"
                    )}>
                      {item.icon}
                    </span>
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <Badge 
                        variant={item.badge === 'NEW' ? 'default' : 'secondary'}
                        className={cn(
                          "text-[10px] px-2 h-5",
                          item.badge === 'NEW' && "bg-green-500 hover:bg-green-600",
                          item.badge === '50% OFF' && "bg-red-500 hover:bg-red-600 text-white"
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                    <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </div>
                </Link>
              )
            })}
          </nav>
          
          <Separator />

          {/* Categories */}
          <div className="px-6 py-4 space-y-2" role="navigation" aria-labelledby="categories-menu">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3" id="categories-menu">
              {t('apparel')}
            </h3>
            
            {[
              { href: '/collections/hats', emoji: '🧢', label: t('hats') },
              { href: '/collections/t-shirts', emoji: '👕', label: t('tshirts') },
            ].map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group",
                    "hover:bg-gray-100 active:bg-gray-200",
                    active && "bg-gray-100 font-medium"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.emoji}</span>
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              )
            })}
          </div>
          
          <Separator />

          {/* Account Section */}
          <div className="px-6 py-4 space-y-2" role="navigation" aria-labelledby="account-menu">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3" id="account-menu">
              {t('account')}
            </h3>
            
            <Link
              href="/account"
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group",
                "hover:bg-gray-100 active:bg-gray-200",
                pathname === '/account' && "bg-gray-100 font-medium"
              )}
            >
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-600" />
                <span className="text-sm">{t('account')}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Link>
            
            <Link
              href="/wishlist"
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group",
                "hover:bg-gray-100 active:bg-gray-200",
                pathname === '/wishlist' && "bg-gray-100 font-medium"
              )}
            >
              <div className="flex items-center gap-3">
                <Heart className={cn(
                  "h-4 w-4",
                  wishlistCount > 0 ? "fill-red-500 text-red-500" : "text-gray-600"
                )} />
                <span className="text-sm">{tp('wishlist')}</span>
              </div>
              <div className="flex items-center gap-2">
                {wishlistCount > 0 && (
                  <Badge variant="secondary" className="h-5 px-2 text-[10px]">
                    {wishlistCount}
                  </Badge>
                )}
                <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </div>
            </Link>
            
            <Link
              href="/cart"
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group",
                "hover:bg-gray-100 active:bg-gray-200",
                pathname === '/cart' && "bg-gray-100 font-medium"
              )}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-4 w-4 text-gray-600" />
                <span className="text-sm">{t('cart')}</span>
              </div>
              <div className="flex items-center gap-2">
                {totalItems > 0 && (
                  <Badge variant="secondary" className="h-5 px-2 text-[10px]">
                    {totalItems}
                  </Badge>
                )}
                <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </div>
            </Link>
          </div>
          
          <Separator />

          {/* Support Links */}
          <div className="px-6 py-4 space-y-2" role="navigation" aria-labelledby="support-menu">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3" id="support-menu">
              {tf('sections.support.title')}
            </h3>
            
            <div className="grid grid-cols-2 gap-2">
              {[
                { href: '/support', label: tf('customerService') },
                { href: '/shipping', label: tf('shipping') },
                { href: '/size-guide', label: tf('sizeGuide') },
                { href: '/returns', label: tf('returns') },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="mt-auto border-t bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <Link 
              href="/privacy-policy" 
              onClick={() => setIsOpen(false)} 
              className="hover:text-foreground transition-colors"
            >
              {tf('privacy')}
            </Link>
            <span className="text-gray-300">•</span>
            <Link 
              href="/terms" 
              onClick={() => setIsOpen(false)} 
              className="hover:text-foreground transition-colors"
            >
              {tf('terms')}
            </Link>
            <span className="text-gray-300">•</span>
            <span>© 2024</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}