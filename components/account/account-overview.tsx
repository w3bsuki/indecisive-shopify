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
    <div className="space-y-8">
      {/* Welcome Section - Modern and Clean */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {customer.firstName || 'Customer'} 👋
        </h1>
        <p className="text-gray-300">{customer.email}</p>
      </div>

      {/* Quick Actions Bar - Modern Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          className="relative bg-white border-2 border-gray-200 hover:border-gray-900 rounded-2xl p-6 text-left transition-all duration-200 hover:shadow-lg group"
          onClick={() => onTabChange('orders')}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-100 rounded-xl group-hover:bg-gray-900 transition-colors">
              <Package className="h-5 w-5 text-gray-600 group-hover:text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">My Orders</p>
              <p className="text-sm text-gray-600">Track & manage</p>
            </div>
          </div>
          {orderStats.total > 0 && (
            <Badge className="absolute -top-2 -right-2 h-6 min-w-[24px] px-2 bg-red-500 text-white rounded-full font-bold">
              {orderStats.total}
            </Badge>
          )}
        </button>

        <button
          className="bg-white border-2 border-gray-200 hover:border-gray-900 rounded-2xl p-6 text-left transition-all duration-200 hover:shadow-lg group"
          onClick={() => onTabChange('profile')}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-100 rounded-xl group-hover:bg-gray-900 transition-colors">
              <User className="h-5 w-5 text-gray-600 group-hover:text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Profile</p>
              <p className="text-sm text-gray-600">Personal info</p>
            </div>
          </div>
        </button>

        <button
          className="bg-white border-2 border-gray-200 hover:border-gray-900 rounded-2xl p-6 text-left transition-all duration-200 hover:shadow-lg group"
          onClick={() => onTabChange('addresses')}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-100 rounded-xl group-hover:bg-gray-900 transition-colors">
              <MapPin className="h-5 w-5 text-gray-600 group-hover:text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Addresses</p>
              <p className="text-sm text-gray-600">Shipping</p>
            </div>
          </div>
        </button>

        <button
          className="bg-white border-2 border-gray-200 hover:border-gray-900 rounded-2xl p-6 text-left transition-all duration-200 hover:shadow-lg group"
          onClick={() => onTabChange('billing')}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-100 rounded-xl group-hover:bg-gray-900 transition-colors">
              <Settings className="h-5 w-5 text-gray-600 group-hover:text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Settings</p>
              <p className="text-sm text-gray-600">Preferences</p>
            </div>
          </div>
        </button>
      </div>

      {/* Account Stats - Modern Glass Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{orderStats.total}</p>
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-50 rounded-xl">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{orderStats.active}</p>
              <p className="text-sm text-gray-600">Active Orders</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 rounded-xl">
              <Heart className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{wishlistCount}</p>
              <p className="text-sm text-gray-600">Wishlist Items</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{memberSince}</p>
              <p className="text-sm text-gray-600">Member Since</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      {recentOrders.length > 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          </div>
            
          <div className="divide-y divide-gray-100">
            {recentOrders.slice(0, 3).map((order) => {
              const isDelivered = order.fulfillmentStatus === 'FULFILLED'
              const isActive = order.fulfillmentStatus === 'UNFULFILLED' || 
                             order.fulfillmentStatus === 'PARTIALLY_FULFILLED'
              
              return (
                <div 
                  key={order.id} 
                  className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer group"
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

          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <Button
              variant="outline"
              className="w-full sm:w-auto text-sm rounded-xl border-gray-300 hover:border-gray-900 hover:bg-white transition-colors"
              onClick={() => onTabChange('orders')}
            >
              View All Orders
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      ) : (
        !isLoading && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
            <div className="p-4 bg-gray-50 rounded-2xl w-fit mx-auto mb-4">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600">Start shopping to see your orders here</p>
          </div>
        )
      )}

      {/* Quick Links Grid - Modern Cards */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            className="bg-white border border-gray-200 hover:border-gray-900 rounded-2xl p-4 text-left transition-all duration-200 hover:shadow-md group"
            onClick={() => onTabChange('profile')}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-xl group-hover:bg-gray-900 transition-colors">
                <Shield className="h-4 w-4 text-gray-600 group-hover:text-white" />
              </div>
              <span className="font-medium text-gray-900">Change Password</span>
            </div>
          </button>

          <button
            className="bg-white border border-gray-200 hover:border-gray-900 rounded-2xl p-4 text-left transition-all duration-200 hover:shadow-md group"
            onClick={() => onTabChange('billing')}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-xl group-hover:bg-gray-900 transition-colors">
                <CreditCard className="h-4 w-4 text-gray-600 group-hover:text-white" />
              </div>
              <span className="font-medium text-gray-900">Payment Methods</span>
            </div>
          </button>

          <button
            className="bg-white border border-gray-200 hover:border-gray-900 rounded-2xl p-4 text-left transition-all duration-200 hover:shadow-md group"
            onClick={() => onTabChange('profile')}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-xl group-hover:bg-gray-900 transition-colors">
                <Mail className="h-4 w-4 text-gray-600 group-hover:text-white" />
              </div>
              <span className="font-medium text-gray-900">Email Preferences</span>
            </div>
          </button>

          <button
            className="bg-white border border-gray-200 hover:border-gray-900 rounded-2xl p-4 text-left transition-all duration-200 hover:shadow-md group"
            onClick={() => onTabChange('orders')}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-xl group-hover:bg-gray-900 transition-colors">
                <FileText className="h-4 w-4 text-gray-600 group-hover:text-white" />
              </div>
              <span className="font-medium text-gray-900">Download Invoices</span>
            </div>
          </button>

          <a
            href="/contact"
            className="bg-white border border-gray-200 hover:border-gray-900 rounded-2xl p-4 text-left transition-all duration-200 hover:shadow-md group block"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-xl group-hover:bg-gray-900 transition-colors">
                <HelpCircle className="h-4 w-4 text-gray-600 group-hover:text-white" />
              </div>
              <span className="font-medium text-gray-900">Contact Support</span>
            </div>
          </a>

          <button
            className="bg-white border border-gray-200 hover:border-gray-900 rounded-2xl p-4 text-left transition-all duration-200 hover:shadow-md group"
            onClick={() => onTabChange('profile')}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-xl group-hover:bg-gray-900 transition-colors">
                <Settings className="h-4 w-4 text-gray-600 group-hover:text-white" />
              </div>
              <span className="font-medium text-gray-900">Preferences</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}