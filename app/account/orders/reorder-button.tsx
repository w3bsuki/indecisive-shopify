'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Loader2, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { getReorderDataAction } from '@/app/actions/orders'
import { useCart } from '@/hooks/use-cart'

interface ReorderButtonProps {
  orderId: string
  variant?: 'default' | 'outline'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  showIcon?: boolean
}

export function ReorderButton({ 
  orderId, 
  variant = 'outline',
  size = 'sm',
  className = '',
  showIcon = false
}: ReorderButtonProps) {
  const [isReordering, setIsReordering] = useState(false)
  const { addItem } = useCart()
  const router = useRouter()

  const handleReorder = async () => {
    setIsReordering(true)
    try {
      // Get order data from server
      const result = await getReorderDataAction(orderId)
      
      if (!result.success || !result.items) {
        throw new Error(result.error || 'Failed to get order data')
      }

      // Add each item to cart
      for (const item of result.items) {
        addItem(item.merchandiseId, item.quantity)
      }

      // Success message
      toast.success(`Added ${result.items.length} items to cart!`, {
        action: {
          label: 'View Cart',
          onClick: () => router.push('/cart')
        }
      })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to reorder')
    } finally {
      setIsReordering(false)
    }
  }

  return (
    <Button 
      variant={variant}
      size={size}
      className={className}
      onClick={handleReorder}
      disabled={isReordering}
    >
      {isReordering ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {showIcon && <span className="ml-2">Adding to cart...</span>}
          {!showIcon && 'Adding...'}
        </>
      ) : (
        <>
          {showIcon && <RefreshCw className="h-4 w-4 mr-2" />}
          Reorder
        </>
      )}
    </Button>
  )
}