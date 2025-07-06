'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calculator, Truck, Clock, MapPin, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/utils/price'

interface ShippingOption {
  id: string
  name: string
  description: string
  price: number
  currency: string
  estimatedDays: string
  icon: React.ReactNode
  popular?: boolean
}

interface ShippingCalculatorProps {
  className?: string
  subtotal: number
  currency?: string
  onShippingChange?: (option: ShippingOption | null) => void
}

export function ShippingCalculator({ 
  className, 
  subtotal, 
  currency = 'USD',
  onShippingChange 
}: ShippingCalculatorProps) {
  const [zipCode, setZipCode] = useState('')
  const [selectedOption, setSelectedOption] = useState<ShippingOption | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([])
  const [showOptions, setShowOptions] = useState(false)

  // Mock shipping calculation (in real app, this would call shipping API)
  const calculateShipping = async (_zip: string) => {
    setIsCalculating(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock shipping options based on subtotal and location
    const freeShippingThreshold = 75
    const isFreeShipping = subtotal >= freeShippingThreshold
    
    const options: ShippingOption[] = [
      {
        id: 'standard',
        name: 'Standard Shipping',
        description: 'Delivered to your door',
        price: isFreeShipping ? 0 : 5.99,
        currency,
        estimatedDays: '5-7 business days',
        icon: <Truck className="w-4 h-4" />,
        popular: isFreeShipping
      },
      {
        id: 'express',
        name: 'Express Shipping',
        description: 'Faster delivery',
        price: isFreeShipping ? 9.99 : 15.99,
        currency,
        estimatedDays: '2-3 business days',
        icon: <Clock className="w-4 h-4" />
      },
      {
        id: 'overnight',
        name: 'Overnight Shipping',
        description: 'Next business day',
        price: 24.99,
        currency,
        estimatedDays: '1 business day',
        icon: <MapPin className="w-4 h-4" />
      }
    ]
    
    setShippingOptions(options)
    setShowOptions(true)
    
    // Auto-select free shipping if available, otherwise standard
    const defaultOption = isFreeShipping ? options[0] : options[0]
    setSelectedOption(defaultOption)
    onShippingChange?.(defaultOption)
    
    setIsCalculating(false)
  }

  const handleZipSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (zipCode.length >= 5) {
      calculateShipping(zipCode)
    }
  }

  const handleOptionSelect = (option: ShippingOption) => {
    setSelectedOption(option)
    onShippingChange?.(option)
  }

  useEffect(() => {
    // Reset options when subtotal changes significantly
    if (showOptions && Math.abs(subtotal - (selectedOption?.price || 0)) > 10) {
      setShowOptions(false)
      setSelectedOption(null)
    }
  }, [subtotal, selectedOption, showOptions])

  return (
    <div className={cn("space-y-4", className)}>
      {/* Calculator Input */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-gray-600" />
          <span className="font-mono font-bold text-xs uppercase tracking-wider text-gray-700">
            Shipping Calculator
          </span>
        </div>
        
        <form onSubmit={handleZipSubmit} className="flex gap-2">
          <Input
            type="text"
            placeholder="ZIP Code"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            className="flex-1 font-mono text-sm border-2 border-gray-200 focus:border-black"
            maxLength={10}
          />
          <Button 
            type="submit" 
            variant="outline" 
            size="sm"
            disabled={zipCode.length < 5 || isCalculating}
            className="font-mono text-xs border-2 border-black hover:bg-black hover:text-white"
          >
            {isCalculating ? 'Calculating...' : 'Calculate'}
          </Button>
        </form>
      </div>

      {/* Shipping Options */}
      {showOptions && (
        <div className="space-y-3">
          <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-gray-700">
            Shipping Options to {zipCode}
          </h4>
          
          <div className="space-y-2">
            {shippingOptions.map((option) => (
              <Card 
                key={option.id}
                className={cn(
                  "cursor-pointer transition-all border-2",
                  selectedOption?.id === option.id 
                    ? "border-black bg-black/5" 
                    : "border-gray-200 hover:border-gray-400"
                )}
                onClick={() => handleOptionSelect(option)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded">
                        {option.icon}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{option.name}</span>
                          {option.popular && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                              Recommended
                            </Badge>
                          )}
                          {option.price === 0 && (
                            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                              FREE
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">{option.description}</p>
                        <p className="text-xs text-gray-500 font-mono">{option.estimatedDays}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm font-mono">
                        {option.price === 0 
                          ? 'FREE' 
                          : formatPrice(option.price, option.currency)
                        }
                      </span>
                      {selectedOption?.id === option.id && (
                        <Check className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Free Shipping Notice */}
          {subtotal < 75 && (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded">
              <p className="text-sm text-blue-800">
                <strong>💡 Tip:</strong> Add {formatPrice(75 - subtotal, currency)} more for free standard shipping!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}