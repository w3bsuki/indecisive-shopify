import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - Indecisive Wear',
  description: 'Privacy policy for Indecisive Wear. Learn how we protect and handle your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold font-mono mb-8">PRIVACY POLICY</h1>
        <p className="text-sm text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="prose prose-sm max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-bold font-mono mb-4">1. INFORMATION WE COLLECT</h2>
            <p className="text-gray-700 mb-4">
              We collect information you provide directly to us, such as when you create an account, 
              make a purchase, or contact us for support.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Personal information (name, email, shipping address)</li>
              <li>Payment information (processed securely through Stripe)</li>
              <li>Purchase history and preferences</li>
              <li>Communications with our support team</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold font-mono mb-4">2. HOW WE USE YOUR INFORMATION</h2>
            <p className="text-gray-700 mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Process and fulfill your orders</li>
              <li>Send you order confirmations and updates</li>
              <li>Respond to your comments and questions</li>
              <li>Personalize your shopping experience</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Improve our website and services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold font-mono mb-4">3. DATA SECURITY</h2>
            <p className="text-gray-700">
              We implement appropriate technical and organizational measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or destruction. However, 
              no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-mono mb-4">4. COOKIES AND TRACKING</h2>
            <p className="text-gray-700 mb-4">
              We use cookies and similar tracking technologies to track activity on our website and 
              hold certain information. You can instruct your browser to refuse all cookies or to 
              indicate when a cookie is being sent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-mono mb-4">5. THIRD-PARTY SERVICES</h2>
            <p className="text-gray-700 mb-4">We work with the following third-party services:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Shopify</strong>: E-commerce platform and order processing</li>
              <li><strong>Stripe</strong>: Payment processing</li>
              <li><strong>Google Analytics</strong>: Website analytics (if enabled)</li>
              <li><strong>Meta Pixel</strong>: Advertising analytics (if enabled)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold font-mono mb-4">6. YOUR RIGHTS</h2>
            <p className="text-gray-700 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold font-mono mb-4">7. CONTACT US</h2>
            <p className="text-gray-700">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-gray-700 mt-4">
              <strong>Email:</strong> hello@indecisivewear.com<br />
              <strong>Address:</strong> [Your Business Address]
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}