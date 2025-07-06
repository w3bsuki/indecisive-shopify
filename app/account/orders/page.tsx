import { Metadata } from 'next'
import { getCurrentCustomer } from '@/app/actions/auth'
import { getCustomerToken } from '@/lib/auth/token'
import { getCustomerOrders } from '@/lib/shopify/customer-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Package, Eye, Calendar, DollarSign, Truck } from 'lucide-react'
import { formatPriceServer } from '@/lib/shopify/server-market'
import { ReorderButton } from './reorder-button'
import { AccountPageWrapper } from '../components/account-page-wrapper'

export const metadata: Metadata = {
  title: 'Orders - My Account - Indecisive Wear',
  description: 'View your order history and track shipments',
}

function getStatusColor(fulfillmentStatus: string, financialStatus: string) {
  if (fulfillmentStatus === 'fulfilled' && financialStatus === 'paid') {
    return 'bg-green-100 text-green-800 border-green-300'
  }
  if (fulfillmentStatus === 'partial' || financialStatus === 'partially_paid') {
    return 'bg-yellow-100 text-yellow-800 border-yellow-300'
  }
  if (fulfillmentStatus === 'unfulfilled' && financialStatus === 'paid') {
    return 'bg-blue-100 text-blue-800 border-blue-300'
  }
  if (financialStatus === 'pending') {
    return 'bg-orange-100 text-orange-800 border-orange-300'
  }
  return 'bg-gray-100 text-gray-800 border-gray-300'
}

function formatStatus(status: string) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

export default async function OrdersPage() {
  const customer = await getCurrentCustomer()
  const token = await getCustomerToken()

  if (!customer || !token) {
    return null
  }

  // Fetch customer orders
  const ordersData = await getCustomerOrders(token, 20) // Get up to 20 orders

  // Format prices for each order
  const ordersWithFormattedPrices = ordersData ? await Promise.all(
    ordersData.orders.map(async (order) => ({
      ...order,
      formattedTotal: await formatPriceServer(
        order.currentTotalPrice.amount,
        order.currentTotalPrice.currencyCode
      )
    }))
  ) : []

  if (!ordersData || ordersData.orders.length === 0) {
    return (
      <AccountPageWrapper>
        <div className="space-y-6">
        <h1 className="text-2xl font-semibold mb-6">Order History</h1>

        <Card className="border-2 border-black">
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="font-semibold mb-2">No Orders Yet</h3>
            <p className="text-gray-600 mb-6">
              You haven&apos;t placed any orders yet. Start shopping to see your orders here.
            </p>
            <Link href="/products">
              <Button>Start Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      </AccountPageWrapper>
    )
  }

  return (
    <AccountPageWrapper>
      <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Order History</h1>
        <p className="text-sm text-gray-600">
          {ordersData.orders.length} {ordersData.orders.length === 1 ? 'order' : 'orders'}
        </p>
      </div>

      <div className="space-y-4">
        {ordersWithFormattedPrices.map((order) => (
          <Card key={order.id} className="border-2 border-black hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Order #{order.orderNumber}
                </CardTitle>
                <div className="flex gap-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs border-2 ${getStatusColor(order.fulfillmentStatus, order.financialStatus)}`}
                  >
                    {formatStatus(order.fulfillmentStatus)}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`text-xs border-2 ${getStatusColor(order.fulfillmentStatus, order.financialStatus)}`}
                  >
                    {formatStatus(order.financialStatus)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-gray-600">Order Date</p>
                    <p className="font-mono">
                      {new Date(order.processedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-gray-600">Total</p>
                    <p className="font-mono font-medium">
                      {order.formattedTotal}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-gray-600">Items</p>
                    <p className="font-mono">
                      {order.lineItems.edges.reduce((total, item) => total + item.node.quantity, 0)} items
                    </p>
                  </div>
                </div>
              </div>

              {/* Order items preview */}
              <div className="border-t pt-3">
                <p className="text-sm text-gray-600 mb-2">Items in this order:</p>
                <div className="space-y-1">
                  {order.lineItems.edges.slice(0, 3).map((item) => (
                    <div key={item.node.variant?.id} className="flex justify-between text-sm">
                      <span>{item.node.title}</span>
                      <span className="font-mono">×{item.node.quantity}</span>
                    </div>
                  ))}
                  {order.lineItems.edges.length > 3 && (
                    <p className="text-xs text-gray-500">
                      +{order.lineItems.edges.length - 3} more items
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t">
                <Link href={`/account/orders/${order.id}`}>
                  <Button variant="outline" size="sm" className="border-2 border-black">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </Link>

                {/* Reorder button - we'll implement this later */}
                <ReorderButton 
                  orderId={order.id}
                  size="sm"
                  className="border-2 border-black"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination - for future implementation */}
      {ordersData.pageInfo.hasNextPage && (
        <div className="text-center pt-6">
          <Button variant="outline" className="border-2 border-black" disabled>
            Load More Orders
          </Button>
        </div>
      )}
    </div>
    </AccountPageWrapper>
  )
}