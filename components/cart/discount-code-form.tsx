'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tag, Loader2, X } from 'lucide-react'
import { useCart } from '@/hooks/use-cart'
import { toast } from 'sonner'

export function DiscountCodeForm() {
  const { discountCodesUpdate } = useCart()
  const [code, setCode] = useState('')
  const [isApplying, setIsApplying] = useState(false)
  const [appliedCodes, setAppliedCodes] = useState<string[]>([])

  const handleApplyCode = async () => {
    if (!code.trim()) {
      toast.error('Please enter a discount code')
      return
    }

    setIsApplying(true)
    
    try {
      // Add the new code to existing codes
      const newCodes = [...appliedCodes, code.trim()]
      await discountCodesUpdate(newCodes)
      
      // Update local state
      setAppliedCodes(newCodes)
      
      // Clear input on success
      setCode('')
      toast.success('Discount code applied!')
    } catch (_error) {
      toast.error('Invalid discount code')
    } finally {
      setIsApplying(false)
    }
  }

  const handleRemoveCode = async (codeToRemove: string) => {
    setIsApplying(true)
    
    try {
      // Remove the code from the list
      const newCodes = appliedCodes.filter(c => c !== codeToRemove)
      
      await discountCodesUpdate(newCodes)
      
      // Update local state
      setAppliedCodes(newCodes)
      
      toast.success('Discount code removed')
    } catch (_error) {
      toast.error('Failed to remove discount code')
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="discount-code" className="text-sm font-medium">
          Discount Code
        </Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="absolute left-2.5 top-2.5 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
            <Input
              id="discount-code"
              type="text"
              placeholder="Enter code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleApplyCode()
                }
              }}
              disabled={isApplying}
              className="pl-8 sm:pl-10 h-9 sm:h-10 text-sm sm:text-base"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleApplyCode}
            disabled={isApplying || !code.trim()}
            className="h-9 sm:h-10 px-3 sm:px-4"
          >
            {isApplying ? (
              <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
            ) : (
              'Apply'
            )}
          </Button>
        </div>
      </div>

      {/* Display applied discount codes */}
      {appliedCodes.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs sm:text-sm text-gray-600">Applied discounts:</p>
          <div className="space-y-1">
            {appliedCodes.map((code, index) => (
              <div
                key={`${code}-${index}`}
                className="flex items-center justify-between bg-green-50 border border-green-200 rounded px-2 py-1.5 sm:px-3 sm:py-2"
              >
                <div className="flex items-center gap-2">
                  <Tag className="h-3 w-3 text-green-600" />
                  <span className="text-xs sm:text-sm font-medium text-green-700">
                    {code}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveCode(code)}
                  disabled={isApplying}
                  className="text-green-600 hover:text-green-700 p-0.5"
                  aria-label={`Remove ${code} discount`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}