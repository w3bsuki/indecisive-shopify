import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCurrentCustomer } from '@/app/actions/auth'
import { getCustomerToken } from '@/lib/auth/token'
import { getCustomerOrder } from '@/lib/shopify/customer-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowLeft, 
  Package, 
  MapPin,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'
import { formatPriceServer } from '@/lib/shopify/server-market'
import { ReorderButton } from '../reorder-button'

export const metadata: Metadata = {
  title: 'Order Details - My Account - Indecisive Wear',
  description: 'View order details and track your shipment',
}

interface OrderDetailsPageProps {
  params: Promise<{ id: string }>
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

function getStatusIcon(fulfillmentStatus: string, financialStatus: string) {
  if (fulfillmentStatus === 'fulfilled' && financialStatus === 'paid') {
    return CheckCircle
  }
  if (fulfillmentStatus === 'partial' || financialStatus === 'partially_paid') {
    return Clock
  }
  if (fulfillmentStatus === 'unfulfilled' && financialStatus === 'paid') {
    return Package
  }
  if (financialStatus === 'pending') {
    return Clock
  }
  return XCircle
}

function formatStatus(status: string) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { id } = await params
  const customer = await getCurrentCustomer()
  const token = await getCustomerToken()

  if (!customer || !token) {
    return null
  }

  // Fetch order details
  const order = await getCustomerOrder(token, id)

  if (!order) {
    notFound()
  }

  // Format prices
  const formattedTotal = await formatPriceServer(
    order.currentTotalPrice.amount,
    order.currentTotalPrice.currencyCode
  )

  const formattedShipping = order.totalShippingPrice ? await formatPriceServer(
    order.totalShippingPrice.amount,
    order.totalShippingPrice.currencyCode
  ) : null

  const formattedSubtotal = order.subtotalPrice ? await formatPriceServer(
    order.subtotalPrice.amount,
    order.subtotalPrice.currencyCode
  ) : null

  const formattedTax = order.totalTax ? await formatPriceServer(
    order.totalTax.amount,
    order.totalTax.currencyCode
  ) : null

  // Format individual item prices
  const itemsWithFormattedPrices = await Promise.all(
    order.lineItems.edges.map(async (item) => ({
      ...item,
      formattedPrice: item.node.variant ? await formatPriceServer(
        item.node.variant.price.amount,
        item.node.variant.price.currencyCode
      ) : null
    }))
  )

  const StatusIcon = getStatusIcon(order.fulfillmentStatus, order.financialStatus)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/account/orders">
          <Button variant="outline" size="sm" className="font-mono border-2 border-black">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </Link>
        
        <div className="flex-1">
          <h2 className="text-2xl font-bold font-mono">Order #{order.orderNumber}</h2>
          <p className="text-sm text-gray-600">
            Placed on {new Date(order.processedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Order Status */}
      <Card className="border-2 border-black">
        <CardHeader>
          <CardTitle className="font-mono flex items-center gap-2">
            <StatusIcon className="h-5 w-5" />
            Order Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Badge 
              variant="outline" 
              className={`font-mono border-2 ${getStatusColor(order.fulfillmentStatus, order.financialStatus)}`}
            >
              {formatStatus(order.fulfillmentStatus)}
            </Badge>
            <Badge 
              variant="outline" 
              className={`font-mono border-2 ${getStatusColor(order.fulfillmentStatus, order.financialStatus)}`}
            >
              {formatStatus(order.financialStatus)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-2 border-black">
            <CardHeader>
              <CardTitle className="font-mono">Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {itemsWithFormattedPrices.map((item) => (
                <div key={item.node.variant?.id || item.node.title} className="flex gap-4 pb-4 border-b last:border-b-0">
                  {item.node.variant?.image && (
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.node.variant.image.url}
                        alt={item.node.variant.image.altText || item.node.title}
                        fill
                        className="object-cover border-2 border-black"
                        sizes="64px"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <h4 className="font-mono font-medium">{item.node.title}</h4>
                    {item.node.variant?.title && item.node.variant.title !== 'Default Title' && (
                      <p className="text-sm text-gray-600">{item.node.variant.title}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-600">Quantity: {item.node.quantity}</span>
                      {item.formattedPrice && (
                        <span className="font-mono font-medium">{item.formattedPrice}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary & Shipping */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card className="border-2 border-black">
            <CardHeader>
              <CardTitle className="font-mono">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {formattedSubtotal && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-mono">{formattedSubtotal}</span>
                </div>
              )}
              
              {formattedShipping && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-mono">{formattedShipping}</span>
                </div>
              )}
              
              {formattedTax && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-mono">{formattedTax}</span>
                </div>
              )}
              
              <div className="border-t pt-3">
                <div className="flex justify-between font-medium">
                  <span className="font-mono">Total</span>
                  <span className="font-mono">{formattedTotal}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <Card className="border-2 border-black">
              <CardHeader>
                <CardTitle className="font-mono flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-mono text-sm space-y-1">
                  <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                  <p>{order.shippingAddress.address1}</p>
                  {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.provinceCode || order.shippingAddress.province} {order.shippingAddress.zip}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full font-mono border-2 border-black"
              disabled
            >
              <Package className="h-4 w-4 mr-2" />
              Track Shipment
            </Button>
            
            <ReorderButton 
              orderId={order.id}
              variant="outline"
              size="default"
              className="w-full font-mono border-2 border-black"
              showIcon={true}
            />
          </div>
        </div>
      </div>
    </div>
  )
}