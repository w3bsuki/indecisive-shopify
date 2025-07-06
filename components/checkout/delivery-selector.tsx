'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, MapPin, Package, Clock } from 'lucide-react'
import { getDeliveryManager } from '@/lib/delivery/manager'
import type { DeliveryCalculationResponse, DeliveryAddress } from '@/lib/delivery/types'
import { OfficeMap } from './office-map'
import { formatPrice } from '@/lib/utils/price'

interface DeliverySelectorProps {
  shippingAddress: DeliveryAddress
  weight: number
  onSelect: (option: DeliveryCalculationResponse & { toOffice?: string }) => void
}

export function DeliverySelector({ shippingAddress, weight, onSelect }: DeliverySelectorProps) {
  const [loading, setLoading] = useState(true)
  const [options, setOptions] = useState<DeliveryCalculationResponse[]>([])
  const [selectedOption, setSelectedOption] = useState<string>('')
  const [showOfficeMap, setShowOfficeMap] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<'econt' | 'speedy' | null>(null)
  const [selectedOffice, setSelectedOffice] = useState<string | null>(null)

  useEffect(() => {
    loadDeliveryOptions()
  }, [shippingAddress, weight])

  const loadDeliveryOptions = async () => {
    setLoading(true)
    try {
      const manager = getDeliveryManager()
      const options = await manager.calculateAllPrices({
        from: shippingAddress, // Assuming store ships from same city
        to: shippingAddress,
        weight
      })
      
      // Filter out options with errors
      const validOptions = options.filter(opt => !opt.errors || opt.errors.length === 0)
      setOptions(validOptions)
      
      // Auto-select cheapest option
      if (validOptions.length > 0) {
        const cheapest = validOptions.reduce((min, opt) => 
          opt.price < min.price ? opt : min
        )
        setSelectedOption(`${cheapest.provider}-home`)
      }
    } catch (error) {
      console.error('Failed to load delivery options:', error)
      setOptions([])
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = () => {
    const [provider, type] = selectedOption.split('-') as ['econt' | 'speedy', 'home' | 'office']
    const option = options.find(opt => opt.provider === provider)
    
    if (option) {
      onSelect({
        ...option,
        ...(type === 'office' && selectedOffice ? { toOffice: selectedOffice } : {})
      })
    }
  }

  if (loading) {
    return (
      <Card className="border-2 border-black">
        <CardContent className="py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading delivery options...</p>
        </CardContent>
      </Card>
    )
  }

  if (options.length === 0) {
    return (
      <Card className="border-2 border-black">
        <CardContent className="py-12 text-center">
          <Package className="h-8 w-8 mx-auto mb-4 text-gray-400" />
          <p>No delivery options available for your location</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-black">
        <CardHeader>
          <CardTitle className="font-mono">Select Delivery Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
            {options.map((option) => (
              <div key={option.provider} className="space-y-3">
                {/* Home Delivery Option */}
                <div className="flex items-start space-x-3">
                  <RadioGroupItem 
                    value={`${option.provider}-home`} 
                    id={`${option.provider}-home`} 
                    className="mt-1"
                  />
                  <Label 
                    htmlFor={`${option.provider}-home`} 
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          <span className="font-medium">
                            {option.provider === 'econt' ? 'Econt' : 'Speedy'} - Home Delivery
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Delivered to your address
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {option.deliveryDays} {option.deliveryDays === 1 ? 'day' : 'days'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-medium">
                          {formatPrice(option.price.toString(), option.currency)}
                        </p>
                      </div>
                    </div>
                  </Label>
                </div>

                {/* Office Delivery Option */}
                <div className="flex items-start space-x-3">
                  <RadioGroupItem 
                    value={`${option.provider}-office`} 
                    id={`${option.provider}-office`} 
                    className="mt-1"
                  />
                  <Label 
                    htmlFor={`${option.provider}-office`} 
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span className="font-medium">
                            {option.provider === 'econt' ? 'Econt' : 'Speedy'} - Office Pickup
                          </span>
                          <Badge variant="outline" className="text-xs">Save 20%</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Pick up from a nearby office
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {option.deliveryDays - 1} {option.deliveryDays - 1 === 1 ? 'day' : 'days'}
                          </span>
                          {selectedOption === `${option.provider}-office` && (
                            <Button
                              type="button"
                              variant="link"
                              size="sm"
                              className="h-auto p-0"
                              onClick={() => {
                                setSelectedProvider(option.provider)
                                setShowOfficeMap(true)
                              }}
                            >
                              {selectedOffice ? 'Change Office' : 'Select Office'}
                            </Button>
                          )}
                        </div>
                        {selectedOption === `${option.provider}-office` && selectedOffice && (
                          <p className="text-sm font-medium text-green-600">
                            Office selected ✓
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-medium">
                          {formatPrice((option.price * 0.8).toString(), option.currency)}
                        </p>
                        <p className="text-xs text-gray-500 line-through">
                          {formatPrice(option.price.toString(), option.currency)}
                        </p>
                      </div>
                    </div>
                  </Label>
                </div>
              </div>
            ))}
          </RadioGroup>

          <div className="pt-4 border-t">
            <Button 
              onClick={handleSelect}
              disabled={
                !selectedOption || 
                (selectedOption.includes('-office') && !selectedOffice)
              }
              className="w-full"
            >
              Continue with Selected Delivery
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Office Map Modal */}
      {showOfficeMap && selectedProvider && (
        <OfficeMap
          provider={selectedProvider}
          city={shippingAddress.city}
          onSelect={(officeId) => {
            setSelectedOffice(officeId)
            setShowOfficeMap(false)
          }}
          onClose={() => setShowOfficeMap(false)}
        />
      )}
    </div>
  )
}