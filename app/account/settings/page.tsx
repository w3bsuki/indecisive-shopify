import { Metadata } from 'next'
import { getCurrentCustomer } from '@/app/actions/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { 
  Settings, 
  Shield, 
  Mail, 
  Key, 
  Trash2, 
  ExternalLink,
  User,
  MapPin,
  AlertTriangle,
  Eye,
  Bell
} from 'lucide-react'
import { PasswordResetSection } from './password-reset-section'
import { DataPrivacySection } from './data-privacy-section'

export const metadata: Metadata = {
  title: 'Settings - My Account - Indecisive Wear',
  description: 'Manage your account settings and preferences',
}

export default async function SettingsPage() {
  const customer = await getCurrentCustomer()
  
  // This will be handled by the layout, but keeping for safety
  if (!customer) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-mono">Account Settings</h2>
      </div>

      {/* Account Overview */}
      <Card className="border-2 border-black">
        <CardHeader>
          <CardTitle className="font-mono flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">Account Status</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-green-300 text-green-700">
                  Active
                </Badge>
                <span className="text-sm text-gray-600">Account in good standing</span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Member Since</p>
              <p className="font-mono text-sm">
                {new Date(customer.id.split('/').pop()?.split('?')[0] || '').toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long'
                }) || 'Recently'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Default Address</p>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  {customer.defaultAddress 
                    ? `${customer.defaultAddress.city}, ${customer.defaultAddress.country}`
                    : 'No default address set'
                  }
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Marketing</p>
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  {customer.acceptsMarketing ? 'Subscribed' : 'Not subscribed'}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex flex-wrap gap-3">
              <Link href="/account/profile">
                <Button variant="outline" size="sm" className="font-mono border-2 border-black">
                  <User className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </Link>
              
              <Link href="/account/addresses">
                <Button variant="outline" size="sm" className="font-mono border-2 border-black">
                  <MapPin className="h-4 w-4 mr-2" />
                  Manage Addresses
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="border-2 border-black">
        <CardHeader>
          <CardTitle className="font-mono flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-mono font-medium mb-2">Password</h4>
            <p className="text-sm text-gray-600 mb-3">
              Change your password to keep your account secure. We&apos;ll send you a reset link via email.
            </p>
            <PasswordResetSection customerEmail={customer.email} />
          </div>

          <div className="border-t pt-4">
            <h4 className="font-mono font-medium mb-2">Account Security</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span>Email: {customer.email}</span>
                </div>
                <Badge variant="outline" className="border-blue-300 text-blue-700">
                  Verified
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-green-600" />
                  <span>Password</span>
                </div>
                <Badge variant="outline" className="border-green-300 text-green-700">
                  Secured
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <DataPrivacySection customer={customer} />

      {/* Quick Actions */}
      <Card className="border-2 border-black">
        <CardHeader>
          <CardTitle className="font-mono flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Link href="/account/orders">
              <Button variant="outline" className="w-full justify-start font-mono border-2 border-black">
                <Eye className="h-4 w-4 mr-2" />
                View Order History
              </Button>
            </Link>

            <Link href="/wishlist">
              <Button variant="outline" className="w-full justify-start font-mono border-2 border-black">
                <Eye className="h-4 w-4 mr-2" />
                View Wishlist
              </Button>
            </Link>

            <Link href="/support">
              <Button variant="outline" className="w-full justify-start font-mono border-2 border-black">
                <ExternalLink className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </Link>

            <Link href="/privacy-policy" target="_blank">
              <Button variant="outline" className="w-full justify-start font-mono border-2 border-black">
                <ExternalLink className="h-4 w-4 mr-2" />
                Privacy Policy
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-2 border-red-300">
        <CardHeader>
          <CardTitle className="font-mono flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-mono font-medium text-red-700 mb-2">Delete Account</h4>
            <p className="text-sm text-gray-600 mb-3">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <Button 
              variant="outline" 
              className="font-mono border-2 border-red-300 text-red-600 hover:bg-red-50"
              disabled
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Request Account Deletion
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              Account deletion is currently handled through customer support. 
              Please contact us if you need to delete your account.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Settings Tips */}
      <Card className="border-2 border-black">
        <CardHeader>
          <CardTitle className="font-mono">Settings Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Keep Your Account Secure</p>
              <p className="text-gray-600">
                Use a strong, unique password and keep your email address up to date 
                for account recovery purposes.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Bell className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Marketing Preferences</p>
              <p className="text-gray-600">
                You can update your marketing preferences in the Profile section. 
                We only send relevant updates and you can unsubscribe anytime.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Eye className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Data Privacy</p>
              <p className="text-gray-600">
                We respect your privacy and only collect data necessary to provide our services. 
                Review our privacy policy for full details.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}