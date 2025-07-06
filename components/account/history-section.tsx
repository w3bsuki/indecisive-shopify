'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { History } from 'lucide-react'
import type { AccountSectionProps, Order } from './types'
import type { Customer } from '@/lib/shopify/customer-auth'

interface HistorySectionProps extends AccountSectionProps {
  customer: Customer | null
}

// Mock data - using same orders as orders section
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    date: '2024-01-15',
    status: 'delivered',
    total: 299.99,
    trackingNumber: 'TRK123456789',
    items: [
      {
        id: '1',
        name: 'Premium Cotton T-Shirt',
        size: 'M',
        color: 'Navy Blue',
        quantity: 2,
        price: 49.99,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop'
      },
      {
        id: '2',
        name: 'Designer Jeans',
        size: '32',
        color: 'Dark Wash',
        quantity: 1,
        price: 199.99,
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&h=100&fit=crop'
      }
    ]
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    date: '2024-01-20',
    status: 'shipped',
    total: 159.99,
    trackingNumber: 'TRK987654321',
    estimatedDelivery: '2024-01-25',
    items: [
      {
        id: '3',
        name: 'Wool Sweater',
        size: 'L',
        color: 'Cream',
        quantity: 1,
        price: 159.99,
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=100&h=100&fit=crop'
      }
    ]
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    date: '2024-01-22',
    status: 'processing',
    total: 89.99,
    items: [
      {
        id: '4',
        name: 'Casual Sneakers',
        size: '8',
        color: 'White',
        quantity: 1,
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&h=100&fit=crop'
      }
    ]
  }
]

export function HistorySection({ className, customer: _customer }: HistorySectionProps) {
  const [orders] = useState<Order[]>(mockOrders)

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

  return (
    <div className={className}>
      <Card className="border-2 border-black">
        <CardHeader className="border-b-2 border-black">
          <CardTitle className="flex items-center gap-2 font-mono">
            <History className="w-4 h-4" />
            PURCHASE HISTORY
          </CardTitle>
          <CardDescription>
            View your complete purchase history and analytics
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-gray-50 border-2 border-gray-200">
              <h3 className="font-medium text-sm text-muted-foreground font-mono">TOTAL ORDERS</h3>
              <p className="text-2xl font-bold font-mono">{orders.length}</p>
            </div>
            
            <div className="p-4 bg-gray-50 border-2 border-gray-200">
              <h3 className="font-medium text-sm text-muted-foreground font-mono">TOTAL SPENT</h3>
              <p className="text-2xl font-bold font-mono">
                ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 border-2 border-gray-200">
              <h3 className="font-medium text-sm text-muted-foreground font-mono">AVERAGE ORDER</h3>
              <p className="text-2xl font-bold font-mono">
                ${(orders.reduce((sum, order) => sum + order.total, 0) / orders.length).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-4">
            <h3 className="font-bold font-mono">RECENT ACTIVITY</h3>
            
            {orders.slice(0, 5).map((order) => (
              <div 
                key={order.id} 
                className="flex items-center justify-between p-3 border-2 border-gray-200 hover:border-gray-400 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-black" />
                  <div>
                    <p className="font-bold font-mono">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-bold font-mono">${order.total.toFixed(2)}</p>
                  <Badge 
                    variant="outline" 
                    className={`font-mono uppercase border ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}