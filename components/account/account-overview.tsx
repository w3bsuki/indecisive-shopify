'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Package, Heart, ShoppingBag, User, CheckCircle, Clock } from 'lucide-react'
import { getCustomerOrdersAction } from '@/app/actions/auth'
import { useWishlist } from '@/hooks/use-wishlist'
import { formatPrice } from '@/lib/utils/price'
import type { Customer, Order } from '@/lib/shopify/customer-auth'

import type { AccountTab } from './types'

interface AccountOverviewProps {
  customer: Customer | null
  onTabChange: (tab: AccountTab) => void
}

export function AccountOverview({ customer, onTabChange }: AccountOverviewProps) {
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [orderStats, setOrderStats] = useState({
    total: 0,
    pending: 0,
    delivered: 0
  })
  const [_isLoading, setIsLoading] = useState(true)
  const { totalItems: wishlistCount } = useWishlist()

  useEffect(() => {
    const loadRecentOrders = async () => {
      if (!customer) {
        setIsLoading(false)
        return
      }

      try {
        const ordersData = await getCustomerOrdersAction(5) // Load last 5 orders
        if (ordersData?.orders) {
          setRecentOrders(ordersData.orders)
          
          // Calculate stats
          const total = ordersData.orders.length
          const pending = ordersData.orders.filter(order => 
            order.fulfillmentStatus === 'UNFULFILLED' && order.financialStatus === 'PAID'
          ).length
          const delivered = ordersData.orders.filter(order => 
            order.fulfillmentStatus === 'FULFILLED'
          ).length
          
          setOrderStats({ total, pending, delivered })
        }
      } catch (error) {
        console.error('Failed to load orders:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadRecentOrders()
  }, [customer])

  if (!customer) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading account...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="border-2 border-black">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center">
              <span className="text-xl font-mono font-bold">
                {customer.firstName?.[0]?.toUpperCase() || customer.email[0]?.toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold font-mono">
                Welcome back, {customer.firstName || 'Customer'}!
              </h1>
              <p className="text-muted-foreground">{customer.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border border-gray-200">
          <CardContent className="p-4 text-center">
            <Package className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold font-mono">{orderStats.total}</p>
            <p className="text-sm text-muted-foreground">Total Orders</p>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200">
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <p className="text-2xl font-bold font-mono">{orderStats.pending}</p>
            <p className="text-sm text-muted-foreground">Processing</p>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold font-mono">{orderStats.delivered}</p>
            <p className="text-sm text-muted-foreground">Delivered</p>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200">
          <CardContent className="p-4 text-center">
            <Heart className="w-8 h-8 mx-auto mb-2 text-red-600" />
            <p className="text-2xl font-bold font-mono">{wishlistCount}</p>
            <p className="text-sm text-muted-foreground">Wishlist</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <Card className="border-2 border-black">
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <CardTitle className="font-mono">RECENT ORDERS</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onTabChange('orders')}
                className="font-mono"
              >
                VIEW ALL
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {recentOrders.slice(0, 3).map((order) => {
                const isDelivered = order.fulfillmentStatus === 'FULFILLED'
                const isPending = order.fulfillmentStatus === 'UNFULFILLED'
                
                return (
                  <div key={order.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-bold">#{order.orderNumber}</span>
                          <Badge 
                            variant={isDelivered ? 'default' : isPending ? 'secondary' : 'outline'}
                            className="text-xs"
                          >
                            {isDelivered ? 'Delivered' : isPending ? 'Processing' : 'Shipped'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.processedAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm">
                          {order.lineItems.edges.length} item{order.lineItems.edges.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold">
                          {formatPrice(parseFloat(order.currentTotalPrice.amount), order.currentTotalPrice.currencyCode)}
                        </p>
                        {isPending && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2 text-xs"
                            onClick={() => onTabChange('orders')}
                          >
                            Track
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border border-gray-200 hover:border-black transition-colors cursor-pointer" 
              onClick={() => onTabChange('profile')}>
          <CardContent className="p-6 text-center">
            <User className="w-8 h-8 mx-auto mb-3" />
            <h3 className="font-mono font-bold mb-2">UPDATE PROFILE</h3>
            <p className="text-sm text-muted-foreground">
              Manage your personal information
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 hover:border-black transition-colors">
          <CardContent className="p-6 text-center">
            <Link href="/products" className="block">
              <ShoppingBag className="w-8 h-8 mx-auto mb-3" />
              <h3 className="font-mono font-bold mb-2">CONTINUE SHOPPING</h3>
              <p className="text-sm text-muted-foreground">
                Discover new arrivals
              </p>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}