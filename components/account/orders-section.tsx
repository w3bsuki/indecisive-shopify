'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Package, 
  Search, 
  Filter, 
  Eye, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  X,
  Download,
  Star,
  Loader2
} from 'lucide-react'
import Image from 'next/image'
import { getCustomerOrdersAction } from '@/app/actions/auth'
import { formatPrice } from '@/lib/utils/price'
import type { AccountSectionProps } from './types'
import type { Customer, Order } from '@/lib/shopify/customer-auth'

interface OrdersSectionProps extends AccountSectionProps {
  customer: Customer | null
}

export function OrdersSection({ className, customer }: OrdersSectionProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadOrders = async () => {
      if (!customer) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const ordersData = await getCustomerOrdersAction(20) // Load up to 20 orders
        if (ordersData) {
          setOrders(ordersData.orders)
        } else {
          setOrders([])
        }
      } catch (err) {
        console.error('Failed to load orders:', err)
        setError('Failed to load orders. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    loadOrders()
  }, [customer])
  
  // Map Shopify fulfillment status to display status
  const getDisplayStatus = (fulfillmentStatus: string, financialStatus: string) => {
    if (fulfillmentStatus === 'FULFILLED') return 'delivered'
    if (fulfillmentStatus === 'PARTIAL') return 'shipped'
    if (fulfillmentStatus === 'UNFULFILLED') {
      if (financialStatus === 'PAID') return 'processing'
      if (financialStatus === 'PENDING') return 'pending'
      if (financialStatus === 'VOIDED' || financialStatus === 'REFUNDED') return 'cancelled'
    }
    return 'pending'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800 border-green-300'
      case 'shipped': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'processing': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-300'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />
      case 'shipped': return <Truck className="w-4 h-4" />
      case 'processing': return <Clock className="w-4 h-4" />
      case 'pending': return <AlertCircle className="w-4 h-4" />
      case 'cancelled': return <X className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const filteredOrders = orders.filter(order => {
    const displayStatus = getDisplayStatus(order.fulfillmentStatus, order.financialStatus)
    const matchesSearch = order.orderNumber.toString().includes(searchTerm) ||
                         order.lineItems.edges.some(edge => 
                           edge.node.title.toLowerCase().includes(searchTerm.toLowerCase())
                         )
    const matchesStatus = statusFilter === 'all' || displayStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className={className}>
      <Card className="border-2 border-black">
        <CardHeader className="border-b-2 border-black">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 font-mono">
                <Package className="w-4 h-4" />
                ORDER MANAGEMENT
              </CardTitle>
              <CardDescription>
                Track and manage your orders
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64 border-2 border-gray-200"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40 border-2 border-gray-200">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mr-2" />
              <span>Loading orders...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2 font-mono text-red-600">ERROR LOADING ORDERS</h3>
              <p className="text-muted-foreground">{error}</p>
              <Button 
                variant="outline" 
                className="mt-4 border-2 border-black font-mono"
                onClick={() => window.location.reload()}
              >
                RETRY
              </Button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2 font-mono">NO ORDERS FOUND</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'You haven\'t placed any orders yet'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const displayStatus = getDisplayStatus(order.fulfillmentStatus, order.financialStatus)
                return (
                  <div key={order.id} className="border-2 border-gray-200 overflow-hidden">
                    {/* Order Header */}
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold font-mono">#{order.orderNumber}</h3>
                            <Badge className={`flex items-center gap-1 border font-mono ${getStatusColor(displayStatus)}`}>
                              {getStatusIcon(displayStatus)}
                              <span className="ml-1 uppercase">{displayStatus}</span>
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Ordered on {new Date(order.processedAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Financial: {order.financialStatus} • Fulfillment: {order.fulfillmentStatus}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-lg font-bold font-mono">
                            {formatPrice(parseFloat(order.currentTotalPrice.amount), order.currentTotalPrice.currencyCode)}
                          </p>
                          {order.totalShippingPrice && parseFloat(order.totalShippingPrice.amount) > 0 && (
                            <p className="text-sm text-muted-foreground">
                              Shipping: {formatPrice(parseFloat(order.totalShippingPrice.amount), order.totalShippingPrice.currencyCode)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Order Items */}
                    <div className="p-4">
                      <div className="space-y-3">
                        {order.lineItems.edges.map((edge) => {
                          const item = edge.node
                          return (
                            <div key={`${order.id}-${item.variant?.id || item.title}`} className="flex items-center gap-4">
                              {item.variant?.image && (
                                <Image
                                  src={item.variant.image.url}
                                  alt={item.title}
                                  width={64}
                                  height={64}
                                  className="w-16 h-16 object-cover border-2 border-gray-200"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium truncate">{item.title}</h4>
                                {item.variant && (
                                  <p className="text-sm text-muted-foreground">
                                    {item.variant.title} • Qty: {item.quantity}
                                  </p>
                                )}
                              </div>
                              {item.variant && (
                                <p className="font-bold font-mono">
                                  {formatPrice(parseFloat(item.variant.price.amount), item.variant.price.currencyCode)}
                                </p>
                              )}
                            </div>
                          )
                        })}
                      </div>
                      
                      <Separator className="my-4 border-gray-200" />
                      
                      {/* Order Actions */}
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" className="border-2 border-black font-mono">
                          <Eye className="w-4 h-4 mr-2" />
                          VIEW DETAILS
                        </Button>
                        
                        {displayStatus === 'shipped' && (
                          <Button variant="outline" size="sm" className="border-2 border-black font-mono">
                            <Truck className="w-4 h-4 mr-2" />
                            TRACK PACKAGE
                          </Button>
                        )}
                        
                        {displayStatus === 'delivered' && (
                          <>
                            <Button variant="outline" size="sm" className="border-2 border-black font-mono">
                              <Download className="w-4 h-4 mr-2" />
                              DOWNLOAD INVOICE
                            </Button>
                            <Button variant="outline" size="sm" className="border-2 border-black font-mono">
                              <Star className="w-4 h-4 mr-2" />
                              LEAVE REVIEW
                            </Button>
                          </>
                        )}
                        
                        <Button variant="outline" size="sm" className="border-2 border-black font-mono">
                          <Package className="w-4 h-4 mr-2" />
                          REORDER
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}