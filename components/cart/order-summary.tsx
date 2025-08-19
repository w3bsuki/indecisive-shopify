'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Money } from '@/components/commerce/money'
import { DiscountCodeForm } from '@/components/cart/discount-code-form'
import { Loader2, CreditCard, ShieldCheck, Package, Truck } from 'lucide-react'
interface OrderSummaryProps {
  cost: any
  onCheckout: () => void
  isLoading?: boolean
  checkoutUrl?: string | null
  variant?: 'default' | 'sticky'
}

export function OrderSummary({ cost, onCheckout, isLoading, variant = 'default' }: OrderSummaryProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCheckout = async () => {
    setIsProcessing(true)
    await onCheckout()
    // Processing state will be cleared by page navigation or error handling
  }

  const isSticky = variant === 'sticky'

  return (
    <div className={`
      ${isSticky 
        ? 'fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40' 
        : 'border border-gray-200 bg-gray-50'
      } 
      ${isSticky ? 'p-4' : 'p-6'}
    `}>
      {!isSticky && (
        <>
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          
          {/* Trust Badges */}
          <div className="flex items-center gap-4 mb-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Secure checkout</span>
            </div>
            <div className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" />
              <span>Fast shipping</span>
            </div>
          </div>
        </>
      )}

      {/* Price Breakdown */}
      <div className={`space-y-2 ${isSticky ? 'hidden' : 'block'}`}>
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span className="font-medium">
            {cost?.subtotalAmount ? (
              <Money data={cost.subtotalAmount} />
            ) : (
              '$0.00'
            )}
          </span>
        </div>
        
        {cost?.totalTaxAmount && parseFloat(cost.totalTaxAmount.amount) > 0 && (
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span className="font-medium">
              <Money data={cost.totalTaxAmount} />
            </span>
          </div>
        )}
        
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span className="text-gray-500">Calculated at checkout</span>
        </div>
      </div>

      {/* Discount Code - Hidden on sticky mobile */}
      {!isSticky && (
        <div className="mt-4 mb-4">
          <DiscountCodeForm />
        </div>
      )}

      {/* Total */}
      <div className={`flex justify-between items-center ${isSticky ? '' : 'pt-4 mt-4 border-t border-gray-200'}`}>
        <span className={`font-semibold ${isSticky ? 'text-base' : 'text-lg'}`}>Total</span>
        <span className={`font-bold ${isSticky ? 'text-lg' : 'text-xl'}`}>
          {cost?.totalAmount ? (
            <Money data={cost.totalAmount} />
          ) : (
            '$0.00'
          )}
        </span>
      </div>

      {/* Checkout Button */}
      <Button
        onClick={handleCheckout}
        disabled={isLoading || isProcessing}
        size={isSticky ? 'default' : 'lg'}
        className={`w-full font-medium ${isSticky ? 'mt-3' : 'mt-6'}`}
      >
        {isLoading || isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Checkout
          </>
        )}
      </Button>

      {/* Security Notice */}
      {!isSticky && (
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
          <Package className="w-3 h-3" />
          <span>Free returns within 30 days</span>
        </div>
      )}
    </div>
  )
}