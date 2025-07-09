'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import Link from 'next/link'
import { ArrowLeft, Bell, Calendar, Mail } from 'lucide-react'

interface ComingSoonProduct {
  id: string
  name: string
  category: string
  launchDate: string
  description: string
  features: string[]
  estimatedPrice?: string
  notifyCount?: number
}

const upcomingProducts: ComingSoonProduct[] = [
  {
    id: 'caps-001',
    name: 'SIGNATURE SNAPBACK',
    category: 'HEADWEAR',
    launchDate: 'FEBRUARY 2025',
    description: 'Premium snapback cap with embroidered branding and adjustable strap',
    features: ['100% Cotton', 'Embroidered Logo', 'Adjustable Strap', 'Flat Brim'],
    estimatedPrice: '$45-55',
    notifyCount: 142
  },
  {
    id: 'caps-002',
    name: 'TRUCKER CAP',
    category: 'HEADWEAR',
    launchDate: 'FEBRUARY 2025',
    description: 'Classic mesh-back trucker with custom patch',
    features: ['Mesh Back', 'Structured Front', 'Snap Closure', 'Custom Patch'],
    estimatedPrice: '$40-50',
    notifyCount: 89
  },
  {
    id: 'tshirts-001',
    name: 'ESSENTIAL OVERSIZED TEE',
    category: 'APPAREL',
    launchDate: 'MARCH 2025',
    description: 'Premium heavyweight cotton tee with signature fit',
    features: ['240GSM Cotton', 'Oversized Fit', 'Drop Shoulder', 'Custom Graphics'],
    estimatedPrice: '$60-70',
    notifyCount: 289
  },
  {
    id: 'tshirts-002',
    name: 'GRAPHIC TEE PACK',
    category: 'APPAREL',
    launchDate: 'MARCH 2025',
    description: 'Limited edition graphic tees with unique designs',
    features: ['Premium Cotton', 'Screen Printed', 'Regular Fit', 'Limited Edition'],
    estimatedPrice: '$50-60',
    notifyCount: 167
  },
  {
    id: 'socks-001',
    name: 'CREW SOCK 3-PACK',
    category: 'ACCESSORIES',
    launchDate: 'APRIL 2025',
    description: 'Premium cotton blend crew socks with signature branding',
    features: ['Cotton Blend', 'Ribbed Cuff', 'Reinforced Heel', '3 Pairs'],
    estimatedPrice: '$25-30',
    notifyCount: 67
  },
  {
    id: 'accessories-001',
    name: 'CANVAS TOTE',
    category: 'ACCESSORIES',
    launchDate: 'APRIL 2025',
    description: 'Heavy-duty canvas tote with reinforced handles',
    features: ['16oz Canvas', 'Reinforced Handles', 'Interior Pocket', 'Screen Print'],
    estimatedPrice: '$35-45',
    notifyCount: 93
  },
  {
    id: 'hoodies-001',
    name: 'HEAVYWEIGHT HOODIE',
    category: 'APPAREL',
    launchDate: 'MAY 2025',
    description: 'Premium fleece hoodie with embroidered details',
    features: ['450GSM Fleece', 'Oversized Hood', 'Kangaroo Pocket', 'Embroidered Logo'],
    estimatedPrice: '$120-140',
    notifyCount: 198
  },
  {
    id: 'pants-001',
    name: 'CARGO PANTS',
    category: 'APPAREL',
    launchDate: 'JUNE 2025',
    description: 'Technical cargo pants with multiple pockets',
    features: ['Ripstop Fabric', '6 Pockets', 'Adjustable Cuffs', 'YKK Zippers'],
    estimatedPrice: '$90-110',
    notifyCount: 156
  }
]

export default function ComingSoonPage() {
  const [emailInputs, setEmailInputs] = useState<Record<string, string>>({})
  const [notifiedProducts, setNotifiedProducts] = useState<Set<string>>(new Set())
  const [globalEmail, setGlobalEmail] = useState('')
  const [isSubscribedAll, setIsSubscribedAll] = useState(false)

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
    setNotifiedProducts(prev => new Set([...prev, productId]))
    toast.success('You\'ll be notified when this drops!')
    
    // Clear the email input for this product
    setEmailInputs(prev => ({ ...prev, [productId]: '' }))
  }

  const handleNotifyAll = async () => {
    if (!globalEmail) {
      toast.error('Please enter your email')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(globalEmail)) {
      toast.error('Please enter a valid email')
      return
    }

    // Subscribe to all products
    setIsSubscribedAll(true)
    toast.success('You\'ll be notified about all upcoming drops!')
    setGlobalEmail('')
  }

  // Group products by launch date
  const productsByDate = upcomingProducts.reduce((acc, product) => {
    if (!acc[product.launchDate]) {
      acc[product.launchDate] = []
    }
    acc[product.launchDate].push(product)
    return acc
  }, {} as Record<string, ComingSoonProduct[]>)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 px-safe">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-mono hover:underline mb-4">
          <ArrowLeft className="w-4 h-4" />
          BACK TO SHOP
        </Link>
        
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-mono mb-3 sm:mb-4">COMING SOON</h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-xl sm:max-w-2xl">
          Get exclusive early access to our upcoming drops. Be the first to know when new products launch.
        </p>
      </div>

      {/* Global Notification Signup */}
      {!isSubscribedAll && (
        <div className="bg-gray-50 border border-gray-300 p-4 sm:p-6 mb-8 sm:mb-12">
          <div className="flex items-start gap-4">
            <Bell className="w-6 h-6 mt-1" />
            <div className="flex-1">
              <h3 className="font-mono font-bold text-base sm:text-lg mb-2">GET NOTIFIED ABOUT ALL DROPS</h3>
              <p className="text-gray-600 text-sm mb-4">
                Subscribe once to receive notifications for all upcoming products
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={globalEmail}
                  onChange={(e) => setGlobalEmail(e.target.value)}
                  className="w-full sm:max-w-sm font-mono min-h-[44px] touch-optimized"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleNotifyAll()
                    }
                  }}
                />
                <Button onClick={handleNotifyAll} className="font-mono min-h-[44px] touch-optimized w-full sm:w-auto">
                  <Mail className="w-4 h-4 mr-2" />
                  NOTIFY ME
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products grouped by launch date */}
      {Object.entries(productsByDate).map(([date, products]) => (
        <div key={date} className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-5 h-5" />
            <h2 className="text-xl sm:text-2xl font-bold font-mono">{date}</h2>
            <span className="text-sm text-gray-600 font-mono">({products.length} {products.length === 1 ? 'PRODUCT' : 'PRODUCTS'})</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white border border-gray-300 hover:border-gray-500 transition-all duration-200 touch-optimized">
                {/* Product Preview */}
                <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex flex-col items-center justify-center p-6">
                    {/* Coming Soon Badge */}
                    <div className="absolute top-4 right-4">
                      <div className="bg-black text-white px-3 py-1 font-mono text-xs font-medium">
                        {product.category}
                      </div>
                    </div>
                    
                    {/* Product Type Icon */}
                    <div className="w-24 h-24 border-2 border-gray-400 mb-4 flex items-center justify-center">
                      <span className="text-4xl">
                        {product.category === 'HEADWEAR' && '🧢'}
                        {product.category === 'APPAREL' && '👕'}
                        {product.category === 'ACCESSORIES' && '🎒'}
                      </span>
                    </div>
                    
                    <h3 className="font-mono font-bold text-xl text-center">
                      {product.name}
                    </h3>
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-4 space-y-4">
                  <div>
                    <p className="font-mono text-sm text-gray-600 mb-3">
                      {product.description}
                    </p>
                    
                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {product.features.map((feature, idx) => (
                        <span key={idx} className="text-xs font-mono bg-gray-100 px-2 py-1">
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    {/* Price Range */}
                    {product.estimatedPrice && (
                      <p className="font-mono text-sm font-medium">
                        EST. {product.estimatedPrice}
                      </p>
                    )}
                  </div>
                  
                  {/* Notification Signup */}
                  {isSubscribedAll || notifiedProducts.has(product.id) ? (
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
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={emailInputs[product.id] || ''}
                        onChange={(e) => setEmailInputs(prev => ({
                          ...prev,
                          [product.id]: e.target.value
                        }))}
                        className="font-mono text-sm min-h-[44px] touch-optimized"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleNotifyMe(product.id)
                          }
                        }}
                      />
                      
                      <Button 
                        onClick={() => handleNotifyMe(product.id)}
                        className="w-full font-mono min-h-[44px] touch-optimized"
                        variant="default"
                      >
                        NOTIFY ME WHEN AVAILABLE
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
            ))}
          </div>
        </div>
      ))}

      {/* Bottom CTA */}
      <div className="mt-16 text-center py-8 border-t border-gray-200">
        <h3 className="text-xl sm:text-2xl font-bold font-mono mb-4">STAY IN THE LOOP</h3>
        <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-xl sm:max-w-2xl mx-auto">
          Follow us on social media for sneak peeks, behind-the-scenes content, and exclusive updates.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Button variant="outline" className="font-mono min-h-[44px] touch-optimized w-full sm:w-auto">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
            </svg>
            INSTAGRAM
          </Button>
          <Button variant="outline" className="font-mono min-h-[44px] touch-optimized w-full sm:w-auto">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.321 5.562a5.122 5.122 0 01-.443-.258 6.228 6.228 0 01-1.137-.966c-.849-.849-1.133-1.72-1.139-1.736l-.006-.016c-.126-.31-.205-.646-.228-.995h-3.314v12.737c0 .54-.06 1.074-.178 1.591a4.818 4.818 0 01-4.644 3.707c-2.653 0-4.818-2.165-4.818-4.818s2.165-4.818 4.818-4.818c.273 0 .541.023.801.067v-3.4c-.26-.02-.523-.03-.801-.03C4.486 6.827 0 11.313 0 16.632S4.486 26.438 9.805 26.438c5.319 0 9.632-4.313 9.632-9.632V9.649c1.098.69 2.381 1.123 3.563 1.123v-3.277c-.693 0-1.344-.195-1.892-.526l.213.593z"/>
            </svg>
            TIKTOK
          </Button>
        </div>
      </div>
    </div>
  )
}