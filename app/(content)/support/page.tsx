import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { MessageSquare, Mail, Clock, Phone } from 'lucide-react'

export const metadata = {
  title: 'Customer Support | Indecisive Wear',
  description: 'Get help with your orders, returns, and more. Contact our customer support team.',
}

export default function SupportPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold font-mono mb-8">CUSTOMER SUPPORT</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="border-2 border-black p-6">
            <h2 className="text-2xl font-bold font-mono mb-6">GET IN TOUCH</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Your name"
                    className="font-mono"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="you@example.com"
                    className="font-mono"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="orderNumber">Order Number (optional)</Label>
                <Input 
                  id="orderNumber" 
                  placeholder="e.g., #1001"
                  className="font-mono"
                />
              </div>

              <div>
                <Label htmlFor="subject">Subject</Label>
                <select 
                  id="subject" 
                  className="w-full h-10 px-3 border-2 border-input bg-background font-mono"
                >
                  <option value="">Select a topic</option>
                  <option value="order">Order inquiry</option>
                  <option value="shipping">Shipping question</option>
                  <option value="return">Return or exchange</option>
                  <option value="product">Product information</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="How can we help you?"
                  className="font-mono min-h-[150px]"
                />
              </div>

              <Button className="font-mono" size="lg">
                SEND MESSAGE
              </Button>
            </form>
          </div>

          {/* FAQ Section */}
          <div className="mt-8 border-2 border-black p-6">
            <h2 className="text-2xl font-bold font-mono mb-6">FREQUENTLY ASKED QUESTIONS</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-bold mb-2">How long does shipping take?</h3>
                <p className="text-gray-600">
                  Standard shipping typically takes 3-5 business days. Express shipping is available for 1-2 business day delivery.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">What is your return policy?</h3>
                <p className="text-gray-600">
                  We accept returns within 30 days of purchase. Items must be unworn with tags attached.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Do you ship internationally?</h3>
                <p className="text-gray-600">
                  Yes! We ship to over 50 countries. International shipping rates and times vary by location.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">How do I track my order?</h3>
                <p className="text-gray-600">
                  Once your order ships, you&apos;ll receive a tracking number via email. You can also track orders in your account.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="lg:col-span-1">
          <div className="border-2 border-black p-6 space-y-6">
            <h2 className="text-xl font-bold font-mono">CONTACT INFO</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 mt-1" />
                <div>
                  <p className="font-bold">Email</p>
                  <p className="text-gray-600">support@indecisivewear.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 mt-1" />
                <div>
                  <p className="font-bold">Phone</p>
                  <p className="text-gray-600">1-800-INDECISIVE</p>
                  <p className="text-sm text-gray-500">Mon-Fri 9AM-6PM EST</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 mt-1" />
                <div>
                  <p className="font-bold">Live Chat</p>
                  <p className="text-gray-600">Available Mon-Fri 9AM-6PM EST</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 mt-1" />
                <div>
                  <p className="font-bold">Response Time</p>
                  <p className="text-gray-600">We typically respond within 24 hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-6 border-2 border-black p-6">
            <h2 className="text-xl font-bold font-mono mb-4">QUICK LINKS</h2>
            <ul className="space-y-2">
              <li>
                <a href="/shipping" className="underline">Shipping Information</a>
              </li>
              <li>
                <a href="/size-guide" className="underline">Size Guide</a>
              </li>
              <li>
                <a href="/account/orders" className="underline">Track Order</a>
              </li>
              <li>
                <a href="/returns" className="underline">Returns & Exchanges</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}