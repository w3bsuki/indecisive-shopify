'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

interface ComingSoonProduct {
  id: string
  name: string
  category: string
  launchDate: string
  description: string
  notifyCount?: number
}

const upcomingProducts: ComingSoonProduct[] = [
  {
    id: 'caps-001',
    name: 'SIGNATURE CAPS',
    category: 'HEADWEAR',
    launchDate: 'FEBRUARY 2025',
    description: 'Premium snapbacks with logo',
    notifyCount: 142
  },
  {
    id: 'tshirts-001',
    name: 'ESSENTIAL TEES',
    category: 'APPAREL',
    launchDate: 'MARCH 2025',
    description: 'Oversized cotton with graphics',
    notifyCount: 289
  },
  {
    id: 'socks-001',
    name: 'CREW SOCKS',
    category: 'ACCESSORIES',
    launchDate: 'APRIL 2025',
    description: 'Cotton blend with branding',
    notifyCount: 67
  },
  {
    id: 'hoodies-001',
    name: 'HOODIES',
    category: 'APPAREL',
    launchDate: 'MAY 2025',
    description: 'Premium fleece with details',
    notifyCount: 198
  }
]

export function ComingSoonCarousel() {
  const [emailInputs, setEmailInputs] = useState<Record<string, string>>({})
  const [notifiedProducts, setNotifiedProducts] = useState<Set<string>>(new Set())
  const t = useTranslations('comingSoon')

  const handleNotifyMe = async (productId: string) => {
    const email = emailInputs[productId]
    
    if (!email) {
      toast.error(t('errors.enterEmail'))
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error(t('errors.validEmail'))
      return
    }

    // Here you would typically send to your API
    // For now, we'll just show success and mark as notified
    setNotifiedProducts(prev => new Set([...prev, productId]))
    toast.success(t('success.notified'))
    
    // Clear the email input for this product
    setEmailInputs(prev => ({ ...prev, [productId]: '' }))
  }

  return (
    <section className="py-8 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="px-4 sm:px-6 lg:px-8 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 font-mono tracking-wide">
            {t('title')}
          </h2>
          <p className="text-gray-600 text-center font-mono text-sm">
            {t('subtitle')}
          </p>
        </div>
        
        {/* Mobile: Horizontal Scroll, Desktop: Grid */}
        <div className="md:px-4 md:sm:px-6 lg:px-8">
          {/* Mobile: Horizontal scroll */}
          <div className="md:hidden overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 px-4 sm:px-6 pb-4">
            {upcomingProducts.map((product) => (
              <div 
                key={product.id} 
                className="group relative flex-shrink-0 w-48 snap-start"
              >
                {/* Modern Product Card */}
                <div className="bg-white border-2 border-gray-200 hover:border-gray-400 hover:shadow-2xl transition-all duration-300 transform-gpu hover:scale-[1.02]">
                  {/* Preview Image Area */}
                  <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 via-gray-50 to-white flex flex-col items-center justify-center p-6 shine-hover">
                      {/* Enhanced Coming Soon Badge - Centered */}
                      <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
                        <div className="card-glass px-2 py-1 font-mono text-xs font-bold text-black border border-gray-200 whitespace-nowrap">
                          {t('badge')}
                        </div>
                      </div>
                      
                      {/* Product Type Icon */}
                      <div className="w-16 h-16 border border-gray-400 mb-3 flex items-center justify-center mt-6">
                        <span className="text-2xl">
                          {product.category === 'HEADWEAR' && '🧢'}
                          {product.category === 'APPAREL' && '👕'}
                          {product.category === 'ACCESSORIES' && '🧦'}
                        </span>
                      </div>
                      
                      <h3 className="font-mono font-bold text-base text-center mb-2">
                        {t(`products.${product.id}.name`)}
                      </h3>
                      
                      <p className="font-mono text-xs text-gray-600 text-center">
                        {t(`products.${product.id}.launchDate`)}
                      </p>
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="p-4 border-t-2 border-black space-y-3">
                    <p className="font-mono text-xs text-gray-600 text-center min-h-[2.5rem] flex items-center justify-center">
                      {t(`products.${product.id}.description`)}
                    </p>
                    
                    {notifiedProducts.has(product.id) ? (
                      <div className="bg-gray-100 p-3 text-center">
                        <p className="font-mono text-xs font-medium">
                          ✓ {t('onTheList')}
                        </p>
                        {product.notifyCount && (
                          <p className="font-mono text-xs text-gray-600 mt-1">
                            {t('joinOthersWaiting', { count: product.notifyCount })}
                          </p>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="flex gap-2">
                          <Input
                            type="email"
                            inputMode="email"
                            autoComplete="email"
                            placeholder={t('emailPlaceholder')}
                            value={emailInputs[product.id] || ''}
                            onChange={(e) => setEmailInputs(prev => ({
                              ...prev,
                              [product.id]: e.target.value
                            }))}
                            className="font-mono text-xs"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleNotifyMe(product.id)
                              }
                            }}
                          />
                        </div>
                        
                        <Button 
                          onClick={() => handleNotifyMe(product.id)}
                          className="w-full font-mono text-xs"
                          variant="default"
                        >
                          {t('notifyButton')}
                        </Button>
                        
                        {product.notifyCount && (
                          <p className="font-mono text-xs text-gray-500 text-center">
                            {t('peopleWaiting', { count: product.notifyCount })}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
          
          {/* Desktop: Grid Layout */}
          <div className="hidden md:block">
            <div className="grid grid-cols-4 gap-6">
            {upcomingProducts.map((product) => (
              <div 
                key={product.id} 
                className="group relative"
              >
                {/* Modern Product Card with Glassmorphism */}
                <div className="bg-white border-2 border-gray-200 hover:border-gray-400 hover:shadow-2xl transition-all duration-300 transform-gpu hover:scale-[1.02]">
                  {/* Preview Image Area */}
                  <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 via-gray-50 to-white flex flex-col items-center justify-center p-6 shine-hover">
                      {/* Enhanced Coming Soon Badge - Centered */}
                      <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
                        <div className="card-glass px-3 py-1 font-mono text-xs font-bold text-black border border-gray-200 whitespace-nowrap">
                          {t('badge')}
                        </div>
                      </div>
                      
                      {/* Product Type Icon */}
                      <div className="w-16 h-16 border border-gray-400 mb-3 flex items-center justify-center mt-6">
                        <span className="text-2xl">
                          {product.category === 'HEADWEAR' && '🧢'}
                          {product.category === 'APPAREL' && '👕'}
                          {product.category === 'ACCESSORIES' && '🧦'}
                        </span>
                      </div>
                      
                      <h3 className="font-mono font-bold text-base text-center mb-2">
                        {t(`products.${product.id}.name`)}
                      </h3>
                      
                      <p className="font-mono text-xs text-gray-600 text-center">
                        {t(`products.${product.id}.launchDate`)}
                      </p>
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="p-4 border-t-2 border-black space-y-3">
                    <p className="font-mono text-xs text-gray-600 text-center min-h-[2.5rem] flex items-center justify-center">
                      {t(`products.${product.id}.description`)}
                    </p>
                    
                    {notifiedProducts.has(product.id) ? (
                      <div className="bg-gray-100 p-3 text-center">
                        <p className="font-mono text-xs font-medium">
                          ✓ {t('onTheList')}
                        </p>
                        {product.notifyCount && (
                          <p className="font-mono text-xs text-gray-600 mt-1">
                            {t('joinOthersWaiting', { count: product.notifyCount })}
                          </p>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="flex gap-2">
                          <Input
                            type="email"
                            inputMode="email"
                            autoComplete="email"
                            placeholder={t('emailPlaceholder')}
                            value={emailInputs[product.id] || ''}
                            onChange={(e) => setEmailInputs(prev => ({
                              ...prev,
                              [product.id]: e.target.value
                            }))}
                            className="font-mono text-xs"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleNotifyMe(product.id)
                              }
                            }}
                          />
                        </div>
                        
                        <Button 
                          onClick={() => handleNotifyMe(product.id)}
                          className="w-full font-mono text-xs"
                          variant="default"
                        >
                          {t('notifyButton')}
                        </Button>
                        
                        {product.notifyCount && (
                          <p className="font-mono text-xs text-gray-500 text-center">
                            {t('peopleWaiting', { count: product.notifyCount })}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
          
          {/* View All Button - Replace the card */}
          <div className="text-center mt-8">
            <Button 
              variant="outline"
              className="font-mono text-sm"
              onClick={() => {
                // For now, just scroll to top - can be expanded later
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            >
              {t('viewAllDrops')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}