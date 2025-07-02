import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy - Indecisive Wear',
  description: 'Cookie policy for Indecisive Wear. Learn about how we use cookies on our website.',
}

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold font-mono mb-8">COOKIE POLICY</h1>
        <p className="text-sm text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="prose prose-sm max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-bold font-mono mb-4">1. WHAT ARE COOKIES?</h2>
            <p className="text-gray-700">
              Cookies are small text files that are placed on your device when you visit our website. 
              They help us provide you with a better experience by remembering your preferences and 
              understanding how you use our site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-mono mb-4">2. TYPES OF COOKIES WE USE</h2>
            
            <div className="space-y-4">
              <div className="border border-gray-300 p-4">
                <h3 className="font-bold mb-2">Essential Cookies</h3>
                <p className="text-gray-700 text-sm mb-2">
                  These cookies are necessary for the website to function properly. They enable basic 
                  functions like page navigation and access to secure areas of the website.
                </p>
                <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
                  <li><strong>Session ID:</strong> Maintains your session while browsing</li>
                  <li><strong>Cart Items:</strong> Remembers items in your shopping cart</li>
                  <li><strong>Cookie Consent:</strong> Remembers your cookie preferences</li>
                </ul>
              </div>

              <div className="border border-gray-300 p-4">
                <h3 className="font-bold mb-2">Analytics Cookies</h3>
                <p className="text-gray-700 text-sm mb-2">
                  These cookies help us understand how visitors interact with our website by collecting 
                  and reporting information anonymously.
                </p>
                <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
                  <li><strong>Google Analytics:</strong> Tracks page views, session duration, and user behavior</li>
                  <li><strong>Hotjar:</strong> Records user sessions to improve user experience</li>
                </ul>
              </div>

              <div className="border border-gray-300 p-4">
                <h3 className="font-bold mb-2">Marketing Cookies</h3>
                <p className="text-gray-700 text-sm mb-2">
                  These cookies are used to track visitors across websites to display ads that are 
                  relevant and engaging for individual users.
                </p>
                <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
                  <li><strong>Meta Pixel:</strong> Tracks conversions from Facebook ads</li>
                  <li><strong>Google Ads:</strong> Measures ad campaign effectiveness</li>
                  <li><strong>TikTok Pixel:</strong> Tracks conversions from TikTok ads</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold font-mono mb-4">3. HOW TO MANAGE COOKIES</h2>
            <p className="text-gray-700 mb-4">
              You can manage your cookie preferences at any time by clicking the &quot;Cookie Settings&quot; 
              link in our website footer. You can also control cookies through your browser settings:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies</li>
              <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies</li>
              <li><strong>Safari:</strong> Preferences → Privacy → Cookies</li>
              <li><strong>Edge:</strong> Settings → Privacy, search, and services → Cookies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold font-mono mb-4">4. THIRD-PARTY COOKIES</h2>
            <p className="text-gray-700">
              Some cookies are placed by third-party services that appear on our pages. We do not 
              control these cookies, and you should refer to the third party&apos;s privacy policy for 
              more information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-mono mb-4">5. UPDATES TO THIS POLICY</h2>
            <p className="text-gray-700">
              We may update this Cookie Policy from time to time to reflect changes in our practices 
              or for other operational, legal, or regulatory reasons. The date at the top of this 
              policy indicates when it was last updated.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold font-mono mb-4">6. CONTACT US</h2>
            <p className="text-gray-700">
              If you have any questions about our use of cookies, please contact us at:
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