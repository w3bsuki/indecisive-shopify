import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { 
  CheckCircle, 
  Package, 
  Mail, 
  ArrowRight,
  Home,
  User,
  MapPin
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Order Confirmation - Indecisive Wear',
  description: 'Thank you for your order',
}

interface OrderConfirmationPageProps {
  searchParams: Promise<{
    order?: string
    email?: string
  }>
}

export default async function OrderConfirmationPage({ searchParams }: OrderConfirmationPageProps) {
  const params = await searchParams
  const orderNumber = params.order
  const customerEmail = params.email

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <Card className="border-2 border-green-300 bg-green-50 mb-6">
            <CardContent className="py-8 text-center">
              <CheckCircle className="h-16 w-16 mx-auto text-green-600 mb-4" />
              <h1 className="text-2xl font-bold font-mono text-green-800 mb-2">
                Order Confirmed!
              </h1>
              <p className="text-green-700">
                Thank you for your purchase. Your order has been successfully placed.
              </p>
              {orderNumber && (
                <div className="mt-4">
                  <Badge variant="outline" className="border-green-300 text-green-700 font-mono">
                    Order #{orderNumber}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* What Happens Next */}
          <Card className="border-2 border-black mb-6">
            <CardHeader>
              <CardTitle className="font-mono flex items-center gap-2">
                <Package className="h-5 w-5" />
                What Happens Next
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-full p-2 mt-1">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Order Confirmation Email</h3>
                    <p className="text-sm text-gray-600">
                      We&apos;ve sent a confirmation email to {customerEmail || 'your email address'} with your order details and receipt.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 rounded-full p-2 mt-1">
                    <Package className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Order Processing</h3>
                    <p className="text-sm text-gray-600">
                      Your order will be processed within 1-2 business days. 
                      You&apos;ll receive a shipping notification once your items are on the way.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-green-100 rounded-full p-2 mt-1">
                    <MapPin className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Delivery</h3>
                    <p className="text-sm text-gray-600">
                      Standard shipping takes 3-7 business days. 
                      You can track your package using the tracking number we&apos;ll send you.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Tracking Info */}
          {orderNumber && (
            <Card className="border-2 border-black mb-6">
              <CardHeader>
                <CardTitle className="font-mono">Order Tracking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded border">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Order Number</p>
                      <p className="font-mono text-sm text-gray-600">#{orderNumber}</p>
                    </div>
                    <Link href={`/account/orders`}>
                      <Button variant="outline" size="sm" className="font-mono border-2 border-black">
                        <User className="h-4 w-4 mr-2" />
                        View in Account
                      </Button>
                    </Link>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  You can view your order status and tracking information in your account. 
                  If you checked out as a guest, use the tracking link in your confirmation email.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Customer Support */}
          <Card className="border-2 border-black mb-6">
            <CardHeader>
              <CardTitle className="font-mono">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">
                If you have any questions about your order, don&apos;t hesitate to reach out:
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Email Support:</span>
                  <a href="mailto:support@indecisivewear.com" className="text-blue-600 hover:underline">
                    support@indecisivewear.com
                  </a>
                </div>
                <div className="flex justify-between">
                  <span>Response Time:</span>
                  <span>Within 24 hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Order Changes:</span>
                  <span>Contact us within 1 hour</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/products" className="flex-1">
              <Button variant="outline" className="w-full font-mono border-2 border-black">
                <ArrowRight className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
            
            <Link href="/" className="flex-1">
              <Button className="w-full font-mono">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Footer Note */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Thank you for choosing Indecisive Wear. We appreciate your business!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}