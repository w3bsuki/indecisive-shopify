import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <ShoppingBag className="h-12 w-12 text-gray-300 mb-4" />
      <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
      <p className="text-sm text-gray-600 mb-6">Add items to start shopping</p>
      <Link href="/products">
        <Button size="lg" className="min-w-[200px]">
          CONTINUE SHOPPING
        </Button>
      </Link>
    </div>
  )
}