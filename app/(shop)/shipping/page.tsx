import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Truck, Clock, Package, Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Shipping Information - Indecisive Wear',
  description: 'Learn about our shipping options, delivery times, and policies',
}

export default function ShippingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Shipping Information</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
        {/* Delivery Options */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Truck className="h-4 w-4 sm:h-5 sm:w-5" />
              Delivery Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm sm:text-base">
            <div>
              <h3 className="font-semibold mb-1">Speedy Delivery</h3>
              <p className="text-gray-600">Fast delivery to your door or office within 1-2 business days</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Econt Express</h3>
              <p className="text-gray-600">Reliable delivery with office pickup option, 2-3 business days</p>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Times */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
              Delivery Times
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm sm:text-base">
            <div>
              <h3 className="font-semibold mb-1">Processing Time</h3>
              <p className="text-gray-600">Orders are processed within 24 hours on business days</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Estimated Delivery</h3>
              <p className="text-gray-600">1-3 business days for Bulgaria, 5-7 days for EU countries</p>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Costs */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Package className="h-4 w-4 sm:h-5 sm:w-5" />
              Shipping Costs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm sm:text-base">
            <div>
              <h3 className="font-semibold mb-1">Bulgaria</h3>
              <p className="text-gray-600">Calculated at checkout based on weight and location</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Free Shipping</h3>
              <p className="text-gray-600">On orders over 150 BGN within Bulgaria</p>
            </div>
          </CardContent>
        </Card>

        {/* International Shipping */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
              International Shipping
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm sm:text-base">
            <div>
              <h3 className="font-semibold mb-1">EU Countries</h3>
              <p className="text-gray-600">We ship to all EU countries with tracking</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Customs & Duties</h3>
              <p className="text-gray-600">No additional fees for EU shipments</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Information */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl">Important Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm sm:text-base">
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>All orders are tracked and you'll receive tracking information via email</li>
            <li>Delivery times may vary during peak seasons or holidays</li>
            <li>For office delivery, please provide a valid phone number</li>
            <li>Signature may be required for high-value orders</li>
            <li>Contact our support team for any shipping inquiries</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}