import { AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { ShopifyProduct } from '@/lib/shopify/types'

interface InventoryBadgeProps {
  product: ShopifyProduct
  variant?: {
    availableForSale: boolean
  }
  className?: string
}

export function InventoryBadge({ product, variant, className = '' }: InventoryBadgeProps) {
  // Get low stock threshold from metafields with null safety
  const lowStockThreshold = product.metafields?.find(
    (mf) => mf && mf.namespace === 'inventory' && mf.key === 'low_stock_threshold'
  )?.value

  const threshold = lowStockThreshold ? parseInt(lowStockThreshold) : 10
  const totalInventory = product.totalInventory || 0
  const tracksInventory = totalInventory > 0 // Assume tracking if inventory exists
  const availableForSale = variant ? variant.availableForSale : product.availableForSale

  // Determine stock status
  let status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'pre-order' = 'in-stock'
  let message = ''
  let icon = CheckCircle

  if (!availableForSale) {
    status = 'out-of-stock'
    message = 'Out of Stock'
    icon = AlertCircle
  } else if (tracksInventory && totalInventory === 0) {
    status = 'pre-order'
    message = 'Available for Pre-order'
    icon = Clock
  } else if (tracksInventory && totalInventory > 0 && totalInventory <= threshold) {
    status = 'low-stock'
    message = `Only ${totalInventory} left in stock!`
    icon = AlertCircle
  } else {
    status = 'in-stock'
    message = 'In Stock'
    icon = CheckCircle
  }

  const variantClass = {
    'in-stock': 'bg-green-50 text-green-700 border-green-200',
    'low-stock': 'bg-orange-50 text-orange-700 border-orange-200',
    'out-of-stock': 'bg-red-50 text-red-700 border-red-200',
    'pre-order': 'bg-blue-50 text-blue-700 border-blue-200'
  }[status]

  const IconComponent = icon

  return (
    <Badge 
      variant="outline" 
      className={`${variantClass} ${className} font-medium`}
    >
      <IconComponent className="h-3 w-3 mr-1.5" />
      {message}
    </Badge>
  )
}