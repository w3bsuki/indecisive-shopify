'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { CreditCard, Plus, Edit3, Trash2 } from 'lucide-react'
import type { AccountSectionProps, PaymentMethod } from './types'
import type { Customer } from '@/lib/shopify/customer-auth'

interface BillingSectionProps extends AccountSectionProps {
  customer: Customer | null
}

// Mock data
const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    cardNumber: '**** **** **** 4532',
    expiryDate: '12/26',
    cardholderName: 'Sarah Johnson',
    isDefault: true,
    type: 'visa'
  },
  {
    id: '2',
    cardNumber: '**** **** **** 8901',
    expiryDate: '08/25',
    cardholderName: 'Sarah Johnson',
    isDefault: false,
    type: 'mastercard'
  }
]

export function BillingSection({ className, customer: _customer }: BillingSectionProps) {
  const [paymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods)
  const [showAddPayment, setShowAddPayment] = useState(false)

  return (
    <div className={className}>
      <Card className="border-2 border-black">
        <CardHeader className="border-b-2 border-black">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 font-mono">
                <CreditCard className="w-4 h-4" />
                PAYMENT METHODS
              </CardTitle>
              <CardDescription>
                Manage your saved payment methods
              </CardDescription>
            </div>
            
            <Dialog open={showAddPayment} onOpenChange={setShowAddPayment}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-black text-white hover:bg-gray-800 font-mono">
                  <Plus className="w-4 h-4 mr-2" />
                  ADD PAYMENT METHOD
                </Button>
              </DialogTrigger>
              <DialogContent className="border-2 border-black">
                <DialogHeader>
                  <DialogTitle className="font-mono">ADD PAYMENT METHOD</DialogTitle>
                  <DialogDescription>
                    Add a new credit or debit card
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber" className="font-mono">CARD NUMBER</Label>
                    <Input 
                      id="cardNumber" 
                      placeholder="1234 5678 9012 3456" 
                      className="border-2 border-gray-200" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry" className="font-mono">EXPIRY DATE</Label>
                      <Input 
                        id="expiry" 
                        placeholder="MM/YY" 
                        className="border-2 border-gray-200" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv" className="font-mono">CVV</Label>
                      <Input 
                        id="cvv" 
                        placeholder="123" 
                        className="border-2 border-gray-200" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardName" className="font-mono">CARDHOLDER NAME</Label>
                    <Input 
                      id="cardName" 
                      placeholder="John Doe" 
                      className="border-2 border-gray-200" 
                    />
                  </div>
                </div>
                
                <DialogFooter className="pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddPayment(false)}
                    className="border-2 border-black font-mono"
                  >
                    CANCEL
                  </Button>
                  <Button 
                    onClick={() => setShowAddPayment(false)}
                    className="bg-black text-white hover:bg-gray-800 font-mono"
                  >
                    ADD CARD
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="space-y-4">
            {paymentMethods.map((card) => (
              <div 
                key={card.id} 
                className="flex items-center justify-between p-4 border-2 border-gray-200 hover:border-gray-400 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-black flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold font-mono">{card.cardNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      Expires {card.expiryDate} • {card.cardholderName}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {card.isDefault && (
                    <Badge className="bg-black text-white font-mono">
                      DEFAULT
                    </Badge>
                  )}
                  
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