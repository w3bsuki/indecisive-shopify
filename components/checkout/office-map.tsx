'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2, Search, MapPin, Clock, Phone } from 'lucide-react'
import { getDeliveryManager } from '@/lib/delivery/manager'
import type { DeliveryOffice } from '@/lib/delivery/types'

interface OfficeMapProps {
  provider: 'econt' | 'speedy'
  city: string
  onSelect: (officeId: string) => void
  onClose: () => void
}

export function OfficeMap({ provider, city, onSelect, onClose }: OfficeMapProps) {
  const [loading, setLoading] = useState(true)
  const [offices, setOffices] = useState<DeliveryOffice[]>([])
  const [filteredOffices, setFilteredOffices] = useState<DeliveryOffice[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOffice, setSelectedOffice] = useState<string | null>(null)

  useEffect(() => {
    loadOffices()
  }, [provider, city])

  useEffect(() => {
    if (searchQuery) {
      const filtered = offices.filter(office => 
        office.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        office.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredOffices(filtered)
    } else {
      setFilteredOffices(offices)
    }
  }, [searchQuery, offices])

  const loadOffices = async () => {
    setLoading(true)
    try {
      const manager = getDeliveryManager()
      const deliveryProvider = manager.getProvider(provider)
      
      if (deliveryProvider) {
        const officeList = await deliveryProvider.getOffices(city)
        setOffices(officeList)
        setFilteredOffices(officeList)
      }
    } catch (error) {
      console.error('Failed to load offices:', error)
      setOffices([])
      setFilteredOffices([])
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = () => {
    if (selectedOffice) {
      onSelect(selectedOffice)
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="font-mono">
            Select {provider === 'econt' ? 'Econt' : 'Speedy'} Office in {city}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by office name or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Office List */}
          {loading ? (
            <div className="py-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Loading offices...</p>
            </div>
          ) : filteredOffices.length === 0 ? (
            <div className="py-12 text-center">
              <MapPin className="h-8 w-8 mx-auto mb-4 text-gray-400" />
              <p>No offices found in {city}</p>
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {filteredOffices.map((office) => (
                  <Card 
                    key={office.id}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedOffice === office.id 
                        ? 'border-2 border-black bg-gray-50' 
                        : 'border hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedOffice(office.id)}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium">{office.name}</h4>
                        {selectedOffice === office.id && (
                          <Badge className="bg-black text-white">Selected</Badge>
                        )}
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <span>{office.address}</span>
                        </div>
                        
                        {office.workingHours && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 flex-shrink-0" />
                            <span>{office.workingHours}</span>
                          </div>
                        )}
                        
                        {office.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3 flex-shrink-0" />
                            <span>{office.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSelect}
              disabled={!selectedOffice}
            >
              Select Office
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}