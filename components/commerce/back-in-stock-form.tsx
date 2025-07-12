'use client'

import { useState } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

interface BackInStockFormProps {
  productTitle: string
  variantTitle?: string
  productId: string
  variantId?: string
}

export function BackInStockForm({ 
  productTitle, 
  variantTitle, 
  productId: _productId, 
  variantId: _variantId 
}: BackInStockFormProps) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email && !phone) {
      toast.error('Please provide either an email or phone number')
      return
    }

    setIsSubmitting(true)

    try {
      // TODO: Implement actual back-in-stock notification API
      // For now, we'll simulate the request
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('You\'ll be notified when this item is back in stock!')
      setOpen(false)
      setEmail('')
      setPhone('')
    } catch (_error) {
      toast.error('Failed to subscribe. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => setOpen(true)}
      >
        <Bell className="h-4 w-4 mr-2" />
        Notify When Available
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Get Notified</DialogTitle>
            <DialogDescription>
              We'll let you know when "{productTitle}{variantTitle && ` - ${variantTitle}`}" is back in stock.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="text-xs text-gray-600">
              <p>• We'll only contact you about this product</p>
              <p>• You can unsubscribe at any time</p>
              <p>• We respect your privacy</p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || (!email && !phone)}
            >
              {isSubmitting ? 'Subscribing...' : 'Notify Me'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}