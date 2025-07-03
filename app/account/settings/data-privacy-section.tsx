'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { 
  Eye, 
  Download, 
  Shield, 
  ExternalLink,
  Database,
  Cookie,
  Mail
} from 'lucide-react'
import type { Customer } from '@/lib/shopify/customer-auth'

interface DataPrivacySectionProps {
  customer: Customer
}

export function DataPrivacySection({ customer }: DataPrivacySectionProps) {
  return (
    <Card className="border-2 border-black">
      <CardHeader>
        <CardTitle className="font-mono flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Privacy & Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Data Collection Overview */}
        <div>
          <h4 className="font-mono font-medium mb-2">Data We Store</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-600" />
              <span>Profile information</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-600" />
              <span>Order history</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-600" />
              <span>Shipping addresses</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-600" />
              <span>Shopping preferences</span>
            </div>
          </div>
        </div>

        {/* Marketing Preferences */}
        <div className="border-t pt-4">
          <h4 className="font-mono font-medium mb-2">Communication Preferences</h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Marketing emails</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={customer.acceptsMarketing 
                  ? "border-green-300 text-green-700" 
                  : "border-gray-300 text-gray-600"
                }
              >
                {customer.acceptsMarketing ? 'Subscribed' : 'Not subscribed'}
              </Badge>
              <Link href="/account/profile">
                <Button variant="outline" size="sm" className="font-mono border-2 border-black">
                  Change
                </Button>
              </Link>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {customer.acceptsMarketing 
              ? 'You receive promotional emails and product updates. You can unsubscribe anytime.'
              : 'You only receive essential emails like order confirmations and account updates.'
            }
          </p>
        </div>

        {/* Cookies & Tracking */}
        <div className="border-t pt-4">
          <h4 className="font-mono font-medium mb-2">Cookies & Tracking</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Cookie className="h-4 w-4 text-orange-600" />
              <span>Essential cookies: <strong>Always enabled</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Cookie className="h-4 w-4 text-blue-600" />
              <span>Analytics cookies: <strong>Enabled</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Cookie className="h-4 w-4 text-purple-600" />
              <span>Marketing cookies: <strong>Configurable</strong></span>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Essential cookies are required for the site to function. 
            You can manage other cookie preferences in your browser settings.
          </p>
        </div>

        {/* Data Rights */}
        <div className="border-t pt-4">
          <h4 className="font-mono font-medium mb-3">Your Data Rights</h4>
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start font-mono border-2 border-black"
              disabled
            >
              <Download className="h-4 w-4 mr-2" />
              Download My Data
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start font-mono border-2 border-black"
              disabled
            >
              <Shield className="h-4 w-4 mr-2" />
              Request Data Deletion
            </Button>

            <p className="text-xs text-gray-600">
              Data export and deletion requests are currently handled through customer support. 
              Contact us if you need to exercise these rights.
            </p>
          </div>
        </div>

        {/* Privacy Policy Link */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-mono font-medium">Privacy Policy</h4>
              <p className="text-sm text-gray-600">
                Learn more about how we handle your data
              </p>
            </div>
            <Link href="/privacy-policy" target="_blank">
              <Button variant="outline" size="sm" className="font-mono border-2 border-black">
                <ExternalLink className="h-4 w-4 mr-2" />
                Read Policy
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}