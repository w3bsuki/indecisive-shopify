'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Truck, Calculator, Loader2 } from 'lucide-react'
import { getDeliveryManager } from '@/lib/delivery/manager'
import type { DeliveryCalculationResponse } from '@/lib/delivery/types'
import { formatPrice } from '@/lib/utils/price'

interface ShippingCalculatorProps {
  weight?: number // in kg
  className?: string
}

export function ShippingCalculator({ weight = 0.5, className }: ShippingCalculatorProps) {
  const [city, setCity] = useState('')
  const [zip, setZip] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<DeliveryCalculationResponse[]>([])
  const [showResults, setShowResults] = useState(false)

  const calculateShipping = async () => {
    if (!city || !zip) return

    setLoading(true)
    setShowResults(false)
    
    try {
      const manager = getDeliveryManager()
      const results = await manager.calculateAllPrices({
        from: {
          firstName: 'Store',
          lastName: 'Warehouse',
          phone: '0888000000',
          address1: 'Warehouse Street 1',
          city: 'Sofia',
          zip: '1000',
          country: 'Bulgaria',
          countryCode: 'BG'
        },
        to: {
          firstName: 'Customer',
          lastName: 'Name',
          phone: '0888000000',
          address1: 'Customer Street 1',
          city,
          zip,
          country: 'Bulgaria',
          countryCode: 'BG'
        },
        weight
      })
      
      setResults(results.filter(r => !r.errors || r.errors.length === 0))
      setShowResults(true)
    } catch (error) {
      console.error('Shipping calculation failed:', error)
      setResults([])
      setShowResults(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-4">
        <Truck className="h-5 w-5" />
        <h3 className="font-semibold">Calculate Shipping</h3>
      </div>

      <div className="space-y-3">
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            placeholder="Enter your city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="zip">Postal Code</Label>
          <Input
            id="zip"
            placeholder="Enter postal code"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
          />
        </div>

        <Button 
          onClick={calculateShipping}
          disabled={!city || !zip || loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Calculating...
            </>
          ) : (
            <>
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Shipping
            </>
          )}
        </Button>

        {showResults && (
          <Card className="mt-4">
            <CardContent className="pt-4">
              {results.length === 0 ? (
                <p className="text-sm text-gray-600 text-center">
                  No shipping options available for this location
                </p>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-medium">Shipping Options:</p>
                  {results.map((result) => (
                    <div key={result.provider} className="flex justify-between items-center text-sm">
                      <div>
                        <p className="font-medium">
                          {result.provider === 'econt' ? 'Econt' : 'Speedy'}
                        </p>
                        <p className="text-xs text-gray-600">
                          Delivery in {result.deliveryDays} {result.deliveryDays === 1 ? 'day' : 'days'}
                        </p>
                      </div>
                      <p className="font-mono font-medium">
                        {formatPrice(result.price.toString(), result.currency)}
                      </p>
                    </div>
                  ))}
                  <p className="text-xs text-gray-500 pt-2 border-t">
                    * Office pickup available with 20% discount
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}