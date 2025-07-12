'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Package, 
  Heart, 
  User, 
  Clock, 
  MapPin, 
  Settings,
  CreditCard,
  FileText,
  Mail,
  Shield,
  HelpCircle,
  Calendar,
  ChevronRight
} from 'lucide-react'
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
    active: 0,
    delivered: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const { totalItems: wishlistCount } = useWishlist()

  useEffect(() => {
    const loadRecentOrders = async () => {
      if (!customer) {
        setIsLoading(false)
        return
      }

      try {
        const ordersData = await getCustomerOrdersAction(5)
        if (ordersData?.orders) {
          setRecentOrders(ordersData.orders)
          
          const total = ordersData.orders.length
          const active = ordersData.orders.filter(order => 
            order.fulfillmentStatus === 'UNFULFILLED' || 
            order.fulfillmentStatus === 'PARTIALLY_FULFILLED'
          ).length
          const delivered = ordersData.orders.filter(order => 
            order.fulfillmentStatus === 'FULFILLED'
          ).length
          
          setOrderStats({ total, active, delivered })
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
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Loading account information...</p>
        </div>
      </div>
    )
  }

  // Format member since date - using current year as placeholder
  const memberSince = new Date().getFullYear()

  return (
    <div className="space-y-6">
      {/* Welcome Section - Minimal and Clean */}
      <div>
        <h1 className="text-2xl font-semibold">
          Welcome back, {customer.firstName || 'Customer'}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{customer.email}</p>
      </div>

      {/* Quick Actions Bar - Primary Tasks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Button
          variant="outline"
          className="relative h-auto justify-start p-4"
          onClick={() => onTabChange('orders')}
        >
          <div className="flex items-center gap-3 w-full">
            <Package className="h-5 w-5 text-muted-foreground" />
            <div className="text-left">
              <p className="text-sm font-medium">My Orders</p>
              <p className="text-xs text-muted-foreground">Track & manage orders</p>
            </div>
          </div>
          {orderStats.total > 0 && (
            <Badge variant="secondary" className="absolute -top-2 -right-2 h-5 min-w-[20px] px-1.5">
              {orderStats.total}
            </Badge>
          )}
        </Button>

        <Button
          variant="outline"
          className="h-auto justify-start p-4"
          onClick={() => onTabChange('profile')}
        >
          <div className="flex items-center gap-3 w-full">
            <User className="h-5 w-5 text-muted-foreground" />
            <div className="text-left">
              <p className="text-sm font-medium">Profile</p>
              <p className="text-xs text-muted-foreground">Personal information</p>
            </div>
          </div>
        </Button>

        <Button
          variant="outline"
          className="h-auto justify-start p-4"
          onClick={() => onTabChange('addresses')}
        >
          <div className="flex items-center gap-3 w-full">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div className="text-left">
              <p className="text-sm font-medium">Addresses</p>
              <p className="text-xs text-muted-foreground">Shipping addresses</p>
            </div>
          </div>
        </Button>

        <Button
          variant="outline"
          className="h-auto justify-start p-4"
          onClick={() => onTabChange('billing')}
        >
          <div className="flex items-center gap-3 w-full">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <div className="text-left">
              <p className="text-sm font-medium">Settings</p>
              <p className="text-xs text-muted-foreground">Account preferences</p>
            </div>
          </div>
        </Button>
      </div>

      {/* Account Stats - Clean Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-2xl font-semibold">{orderStats.total}</p>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </div>
              <Package className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-2xl font-semibold">{orderStats.active}</p>
                <p className="text-sm text-muted-foreground">Active Orders</p>
              </div>
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-2xl font-semibold">{wishlistCount}</p>
                <p className="text-sm text-muted-foreground">Wishlist Items</p>
              </div>
              <Heart className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-2xl font-semibold">{memberSince}</p>
                <p className="text-sm text-muted-foreground">Member Since</p>
              </div>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Section */}
      {recentOrders.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">Recent Orders</h2>
            </div>
            
            <div className="divide-y divide-gray-100">
              {recentOrders.slice(0, 3).map((order) => {
                const isDelivered = order.fulfillmentStatus === 'FULFILLED'
                const isActive = order.fulfillmentStatus === 'UNFULFILLED' || 
                               order.fulfillmentStatus === 'PARTIALLY_FULFILLED'
                
                return (
                  <div 
                    key={order.id} 
                    className="px-6 py-4 hover:bg-accent transition-colors cursor-pointer"
                    onClick={() => onTabChange('orders')}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-medium">
                            Order #{order.orderNumber}
                          </span>
                          <Badge 
                            variant={isDelivered ? 'secondary' : isActive ? 'default' : 'outline'}
                            className="text-xs"
                          >
                            {isDelivered ? 'Delivered' : isActive ? 'Active' : 'In Transit'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>
                            {new Date(order.processedAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </span>
                          <span>•</span>
                          <span>{order.lineItems.edges.length} items</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-semibold">
                            {formatPrice(parseFloat(order.currentTotalPrice.amount), order.currentTotalPrice.currencyCode)}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="px-6 py-3 border-t">
              <Button
                variant="ghost"
                className="w-full sm:w-auto text-sm"
                onClick={() => onTabChange('orders')}
              >
                View All Orders
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        !isLoading && (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-1">No orders yet</h3>
              <p className="text-sm text-muted-foreground">Start shopping to see your orders here</p>
            </CardContent>
          </Card>
        )
      )}

      {/* Quick Links Grid - Secondary Tasks */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Button
            variant="ghost"
            className="h-auto justify-start p-4 border"
            onClick={() => onTabChange('profile')}
          >
            <Shield className="h-5 w-5 text-muted-foreground mr-3" />
            <span className="text-sm font-medium">Change Password</span>
          </Button>

          <Button
            variant="ghost"
            className="h-auto justify-start p-4 border"
            onClick={() => onTabChange('billing')}
          >
            <CreditCard className="h-5 w-5 text-muted-foreground mr-3" />
            <span className="text-sm font-medium">Payment Methods</span>
          </Button>

          <Button
            variant="ghost"
            className="h-auto justify-start p-4 border"
            onClick={() => onTabChange('profile')}
          >
            <Mail className="h-5 w-5 text-muted-foreground mr-3" />
            <span className="text-sm font-medium">Email Preferences</span>
          </Button>

          <Button
            variant="ghost"
            className="h-auto justify-start p-4 border"
            onClick={() => onTabChange('orders')}
          >
            <FileText className="h-5 w-5 text-muted-foreground mr-3" />
            <span className="text-sm font-medium">Download Invoices</span>
          </Button>

          <Button
            variant="ghost"
            className="h-auto justify-start p-4 border"
            asChild
          >
            <a href="/contact">
              <HelpCircle className="h-5 w-5 text-muted-foreground mr-3" />
              <span className="text-sm font-medium">Contact Support</span>
            </a>
          </Button>

          <Button
            variant="ghost"
            className="h-auto justify-start p-4 border"
            onClick={() => onTabChange('profile')}
          >
            <Settings className="h-5 w-5 text-muted-foreground mr-3" />
            <span className="text-sm font-medium">Preferences</span>
          </Button>
        </div>
      </div>
    </div>
  )
}