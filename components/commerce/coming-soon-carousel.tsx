'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

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
    description: 'Premium snapbacks with embroidered logo',
    notifyCount: 142
  },
  {
    id: 'tshirts-001',
    name: 'ESSENTIAL TEES',
    category: 'APPAREL',
    launchDate: 'MARCH 2025',
    description: 'Oversized cotton tees with custom graphics',
    notifyCount: 289
  },
  {
    id: 'socks-001',
    name: 'CREW SOCKS',
    category: 'ACCESSORIES',
    launchDate: 'APRIL 2025',
    description: 'Premium cotton blend with signature branding',
    notifyCount: 67
  },
  {
    id: 'hoodies-001',
    name: 'HEAVYWEIGHT HOODIES',
    category: 'APPAREL',
    launchDate: 'MAY 2025',
    description: 'Premium fleece with embroidered details',
    notifyCount: 198
  }
]

export function ComingSoonCarousel() {
  const [emailInputs, setEmailInputs] = useState<Record<string, string>>({})
  const [notifiedProducts, setNotifiedProducts] = useState<Set<string>>(new Set())

  const handleNotifyMe = async (productId: string) => {
    const email = emailInputs[productId]
    
    if (!email) {
      toast.error('Please enter your email')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email')
      return
    }

    // Here you would typically send to your API
    // For now, we'll just show success and mark as notified
    setNotifiedProducts(prev => new Set([...prev, productId]))
    toast.success('You\'ll be notified when this drops!')
    
    // Clear the email input for this product
    setEmailInputs(prev => ({ ...prev, [productId]: '' }))
  }

  return (
    <section className="py-8 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="px-4 sm:px-6 lg:px-8 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 font-mono tracking-wide">
            COMING SOON
          </h2>
          <p className="text-gray-600 text-center font-mono text-sm">
            Get notified when these drop
          </p>
        </div>
        
        {/* Horizontal Scrolling Carousel */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 px-4 sm:px-6 lg:px-8 pb-4">
            {upcomingProducts.map((product) => (
              <div 
                key={product.id} 
                className="group relative flex-shrink-0 w-64 snap-start"
              >
                {/* Product Card */}
                <div className="bg-white border border-gray-950 hover:border-gray-600 hover:shadow-md transition-all duration-200">
                  {/* Preview Image Area */}
                  <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex flex-col items-center justify-center p-6">
                      {/* Coming Soon Badge */}
                      <div className="absolute top-4 right-4">
                        <div className="bg-black text-white px-3 py-1 font-mono text-xs font-medium">
                          COMING SOON
                        </div>
                      </div>
                      
                      {/* Product Type Icon */}
                      <div className="w-20 h-20 border border-gray-400 mb-4 flex items-center justify-center">
                        <span className="text-3xl">
                          {product.category === 'HEADWEAR' && '🧢'}
                          {product.category === 'APPAREL' && '👕'}
                          {product.category === 'ACCESSORIES' && '🧦'}
                        </span>
                      </div>
                      
                      <h3 className="font-mono font-bold text-lg text-center mb-2">
                        {product.name}
                      </h3>
                      
                      <p className="font-mono text-xs text-gray-600 text-center">
                        {product.launchDate}
                      </p>
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="p-4 border-t-2 border-black space-y-3">
                    <p className="font-mono text-xs text-gray-600 text-center">
                      {product.description}
                    </p>
                    
                    {notifiedProducts.has(product.id) ? (
                      <div className="bg-gray-100 p-3 text-center">
                        <p className="font-mono text-xs font-medium">
                          ✓ YOU&apos;RE ON THE LIST
                        </p>
                        {product.notifyCount && (
                          <p className="font-mono text-xs text-gray-600 mt-1">
                            Join {product.notifyCount} others waiting
                          </p>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="flex gap-2">
                          <Input
                            type="email"
                            placeholder="Enter your email"
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
                          NOTIFY ME
                        </Button>
                        
                        {product.notifyCount && (
                          <p className="font-mono text-xs text-gray-500 text-center">
                            {product.notifyCount} people waiting
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* View All Coming Soon Card */}
            <div className="flex-shrink-0 w-64 snap-start">
              <a 
                href="/coming-soon"
                className="block h-full"
              >
                <div className="bg-white border border-dashed border-gray-950 hover:border-solid hover:border-gray-600 hover:shadow-md transition-all duration-200 group h-full">
                  <div className="aspect-[4/5] bg-gray-50 relative overflow-hidden flex flex-col items-center justify-center p-6">
                    <svg className="w-16 h-16 text-gray-400 group-hover:text-black transition-colors mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="font-mono font-bold text-lg text-gray-600 group-hover:text-black transition-colors text-center mb-2">
                      VIEW ALL
                    </h3>
                    <p className="font-mono text-xs text-gray-500 text-center">
                      See everything coming soon
                    </p>
                  </div>
                  
                  <div className="p-4 border-t-2 border-black">
                    <Button 
                      variant="outline"
                      className="w-full font-mono text-xs group-hover:bg-black group-hover:text-white transition-colors"
                    >
                      EXPLORE UPCOMING DROPS
                    </Button>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
        
        {/* Scroll hint */}
        <div className="text-center mt-4">
          <p className="text-xs text-gray-500 font-mono">← Scroll to see more →</p>
        </div>
      </div>
    </section>
  )
}