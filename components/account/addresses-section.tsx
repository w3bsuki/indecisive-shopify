'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MapPin, Plus, Edit3, Trash2 } from 'lucide-react'
import type { AccountSectionProps, Address } from './types'
import type { Customer } from '@/lib/shopify/customer-auth'

interface AddressesSectionProps extends AccountSectionProps {
  customer: Customer | null
}

// Mock data
const mockAddresses: Address[] = [
  {
    id: '1',
    type: 'shipping',
    firstName: 'Sarah',
    lastName: 'Johnson',
    street: '123 Fashion Ave',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
    isDefault: true
  },
  {
    id: '2',
    type: 'billing',
    firstName: 'Sarah',
    lastName: 'Johnson',
    street: '456 Style Street',
    city: 'Brooklyn',
    state: 'NY',
    zipCode: '11201',
    country: 'United States',
    isDefault: false
  }
]

export function AddressesSection({ className, customer: _customer }: AddressesSectionProps) {
  const [addresses] = useState<Address[]>(mockAddresses)
  const [showAddAddress, setShowAddAddress] = useState(false)

  return (
    <div className={className}>
      <Card className="border-2 border-black">
        <CardHeader className="border-b-2 border-black">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 font-mono">
                <MapPin className="w-4 h-4" />
                ADDRESSES
              </CardTitle>
              <CardDescription>
                Manage your shipping and billing addresses
              </CardDescription>
            </div>
            
            <Dialog open={showAddAddress} onOpenChange={setShowAddAddress}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-black text-white hover:bg-gray-800 font-mono">
                  <Plus className="w-4 h-4 mr-2" />
                  ADD ADDRESS
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md border-2 border-black">
                <DialogHeader>
                  <DialogTitle className="font-mono">ADD NEW ADDRESS</DialogTitle>
                  <DialogDescription>
                    Add a new shipping or billing address
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="font-mono">FIRST NAME</Label>
                      <Input id="firstName" className="border-2 border-gray-200" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="font-mono">LAST NAME</Label>
                      <Input id="lastName" className="border-2 border-gray-200" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="street" className="font-mono">STREET ADDRESS</Label>
                    <Input id="street" className="border-2 border-gray-200" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="font-mono">CITY</Label>
                      <Input id="city" className="border-2 border-gray-200" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="font-mono">STATE</Label>
                      <Input id="state" className="border-2 border-gray-200" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zipCode" className="font-mono">ZIP CODE</Label>
                      <Input id="zipCode" className="border-2 border-gray-200" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country" className="font-mono">COUNTRY</Label>
                      <Select>
                        <SelectTrigger className="border-2 border-gray-200">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <DialogFooter className="pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddAddress(false)}
                    className="border-2 border-black font-mono"
                  >
                    CANCEL
                  </Button>
                  <Button 
                    onClick={() => setShowAddAddress(false)}
                    className="bg-black text-white hover:bg-gray-800 font-mono"
                  >
                    ADD ADDRESS
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <div key={address.id} className="p-4 border-2 border-gray-200 space-y-3 hover:border-gray-400 transition-colors">
                <div className="flex items-center justify-between">
                  <Badge 
                    className={`font-mono ${
                      address.type === 'shipping' 
                        ? 'bg-black text-white' 
                        : 'bg-gray-100 text-gray-800 border-gray-300'
                    }`}
                  >
                    {address.type === 'shipping' ? 'SHIPPING' : 'BILLING'}
                  </Badge>
                  {address.isDefault && (
                    <Badge variant="outline" className="border-black font-mono">
                      DEFAULT
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-1">
                  <p className="font-bold">{address.firstName} {address.lastName}</p>
                  <p className="text-sm text-muted-foreground">{address.street}</p>
                  <p className="text-sm text-muted-foreground">
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p className="text-sm text-muted-foreground">{address.country}</p>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-2 border-black font-mono"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    EDIT
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-2 border-red-500 text-red-500 hover:bg-red-50 font-mono"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    DELETE
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}