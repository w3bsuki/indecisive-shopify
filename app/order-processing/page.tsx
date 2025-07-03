import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  Clock, 
  Package, 
  Mail, 
  Home,
  User,
  RefreshCw
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Order Processing - Indecisive Wear',
  description: 'Your order is being processed',
}

interface OrderProcessingPageProps {
  searchParams: Promise<{
    order?: string
    email?: string
  }>
}

export default async function OrderProcessingPage({ searchParams }: OrderProcessingPageProps) {
  const params = await searchParams
  const orderNumber = params.order
  const customerEmail = params.email

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Processing Header */}
          <Card className="border-2 border-blue-300 bg-blue-50 mb-6">
            <CardContent className="py-8 text-center">
              <div className="relative mb-4">
                <Clock className="h-16 w-16 mx-auto text-blue-600" />
                <RefreshCw className="h-6 w-6 absolute top-0 right-1/2 transform translate-x-8 text-blue-400 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold font-mono text-blue-800 mb-2">
                Processing Your Order
              </h1>
              <p className="text-blue-700">
                We&apos;re currently processing your payment and preparing your order.
              </p>
              {orderNumber && (
                <div className="mt-4">
                  <span className="inline-block px-3 py-1 bg-blue-100 border border-blue-300 rounded font-mono text-sm text-blue-800">
                    Order #{orderNumber}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* What's Happening */}
          <Card className="border-2 border-black mb-6">
            <CardHeader>
              <CardTitle className="font-mono flex items-center gap-2">
                <Package className="h-5 w-5" />
                What&apos;s Happening Now
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-full p-2 mt-1">
                    <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <h3 className="font-medium">Payment Verification</h3>
                    <p className="text-sm text-gray-600">
                      We&apos;re securely processing your payment information.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 rounded-full p-2 mt-1">
                    <Package className="h-4 w-4 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-600">Inventory Check</h3>
                    <p className="text-sm text-gray-600">
                      Verifying product availability and reserving your items.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 rounded-full p-2 mt-1">
                    <Mail className="h-4 w-4 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-600">Order Confirmation</h3>
                    <p className="text-sm text-gray-600">
                      Preparing your confirmation email and receipt.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Processing Time Info */}
          <Card className="border-2 border-black mb-6">
            <CardHeader>
              <CardTitle className="font-mono">Processing Time</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-gray-50 p-4 rounded border">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Estimated Processing Time</span>
                  <span className="text-sm text-gray-600">2-5 minutes</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600">
                Most orders are processed within 2-5 minutes. If processing takes longer than 10 minutes, 
                please check your email for updates or contact our support team.
              </p>

              {customerEmail && (
                <div className="border-t pt-3">
                  <p className="text-sm">
                    <strong>Confirmation will be sent to:</strong> {customerEmail}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Auto-refresh Notice */}
          <Card className="border-2 border-black mb-6">
            <CardContent className="py-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <RefreshCw className="h-4 w-4" />
                <span>
                  This page will automatically update when your order is confirmed. 
                  You can also check your email for confirmation.
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/account/orders" className="flex-1">
              <Button variant="outline" className="w-full font-mono border-2 border-black">
                <User className="h-4 w-4 mr-2" />
                Check Account
              </Button>
            </Link>
            
            <Link href="/" className="flex-1">
              <Button className="w-full font-mono">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Support Info */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              Having issues? Contact support at{' '}
              <a href="mailto:support@indecisivewear.com" className="text-blue-600 hover:underline">
                support@indecisivewear.com
              </a>
            </p>
          </div>

          {/* Auto-refresh Script */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Auto-refresh every 30 seconds to check for order completion
                setTimeout(() => {
                  window.location.reload();
                }, 30000);
              `
            }}
          />
        </div>
      </div>
    </div>
  )
}