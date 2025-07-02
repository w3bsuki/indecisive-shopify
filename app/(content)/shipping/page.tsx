import { Truck, Globe, Package, Clock } from 'lucide-react'

export const metadata = {
  title: 'Shipping Information | Indecisive Wear',
  description: 'Learn about our shipping options, delivery times, and international shipping policies.',
}

export default function ShippingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold font-mono mb-8">SHIPPING INFORMATION</h1>

      {/* Shipping Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="border-2 border-black p-6">
          <div className="flex items-center gap-3 mb-4">
            <Truck className="w-6 h-6" />
            <h2 className="text-xl font-bold font-mono">STANDARD SHIPPING</h2>
          </div>
          <ul className="space-y-2 text-gray-600">
            <li>• 3-5 business days</li>
            <li>• Free on orders over $50</li>
            <li>• $5.95 for orders under $50</li>
            <li>• Tracking included</li>
          </ul>
        </div>

        <div className="border-2 border-black p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6" />
            <h2 className="text-xl font-bold font-mono">EXPRESS SHIPPING</h2>
          </div>
          <ul className="space-y-2 text-gray-600">
            <li>• 1-2 business days</li>
            <li>• $14.95 flat rate</li>
            <li>• Priority handling</li>
            <li>• Full tracking & insurance</li>
          </ul>
        </div>
      </div>

      {/* Processing Times */}
      <div className="border-2 border-black p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Package className="w-6 h-6" />
          <h2 className="text-2xl font-bold font-mono">PROCESSING TIMES</h2>
        </div>
        <p className="text-gray-600 mb-4">
          All orders are processed within 1-2 business days. Orders placed after 2 PM EST will begin processing the next business day.
        </p>
        <div className="bg-gray-50 p-4">
          <p className="font-bold mb-2">Please note:</p>
          <ul className="space-y-1 text-gray-600 text-sm">
            <li>• Processing times may be extended during sale periods</li>
            <li>• We do not ship on weekends or holidays</li>
            <li>• You&apos;ll receive tracking info once your order ships</li>
          </ul>
        </div>
      </div>

      {/* International Shipping */}
      <div className="border-2 border-black p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-6 h-6" />
          <h2 className="text-2xl font-bold font-mono">INTERNATIONAL SHIPPING</h2>
        </div>
        <p className="text-gray-600 mb-6">
          We ship to over 50 countries worldwide! International shipping rates and delivery times vary by destination.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="text-left p-2 font-mono">REGION</th>
                <th className="text-left p-2 font-mono">DELIVERY TIME</th>
                <th className="text-left p-2 font-mono">SHIPPING COST</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              <tr className="border-b border-gray-200">
                <td className="p-2">Canada</td>
                <td className="p-2">5-7 business days</td>
                <td className="p-2">$12.95</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-2">Europe</td>
                <td className="p-2">7-14 business days</td>
                <td className="p-2">$19.95</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-2">Asia</td>
                <td className="p-2">10-15 business days</td>
                <td className="p-2">$24.95</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-2">Australia</td>
                <td className="p-2">10-15 business days</td>
                <td className="p-2">$22.95</td>
              </tr>
              <tr>
                <td className="p-2">Rest of World</td>
                <td className="p-2">14-21 business days</td>
                <td className="p-2">$29.95</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-200">
          <p className="font-bold text-yellow-800 mb-2">Important for International Orders:</p>
          <ul className="space-y-1 text-yellow-700 text-sm">
            <li>• Customs fees and import duties may apply</li>
            <li>• These charges are the responsibility of the customer</li>
            <li>• Delivery times do not include customs processing</li>
          </ul>
        </div>
      </div>

      {/* Shipping Restrictions */}
      <div className="border-2 border-black p-6 mb-8">
        <h2 className="text-2xl font-bold font-mono mb-4">SHIPPING RESTRICTIONS</h2>
        <div className="space-y-4 text-gray-600">
          <div>
            <h3 className="font-bold text-black mb-2">We currently do not ship to:</h3>
            <p>P.O. Boxes, APO/FPO addresses, or freight forwarding services.</p>
          </div>
          <div>
            <h3 className="font-bold text-black mb-2">Address Accuracy:</h3>
            <p>
              Please ensure your shipping address is correct. We are not responsible for packages delivered to incorrect addresses provided by customers.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="border-2 border-black p-6">
        <h2 className="text-2xl font-bold font-mono mb-6">SHIPPING FAQ</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-bold mb-2">When will I receive my tracking number?</h3>
            <p className="text-gray-600">
              You&apos;ll receive your tracking number via email within 24 hours of your order shipping.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Can I change my shipping address?</h3>
            <p className="text-gray-600">
              Address changes can be made within 1 hour of placing your order by contacting support.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Do you offer same-day delivery?</h3>
            <p className="text-gray-600">
              Same-day delivery is currently available in select NYC areas for orders placed before 12 PM EST.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-2">What happens if my package is lost or damaged?</h3>
            <p className="text-gray-600">
              All orders are insured. Contact our support team and we&apos;ll file a claim and send a replacement.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="mt-8 text-center p-6 bg-gray-50">
        <p className="text-gray-600 mb-4">
          Have more questions about shipping?
        </p>
        <a href="/support" className="font-mono underline font-bold">
          CONTACT SUPPORT
        </a>
      </div>
    </div>
  )
}