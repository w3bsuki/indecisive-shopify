import { Metadata } from 'next'
import { getCurrentCustomer } from '@/app/actions/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, Mail, Phone, Settings, CheckCircle, XCircle } from 'lucide-react'
import { ProfileEditForm } from './profile-edit-form'

export const metadata: Metadata = {
  title: 'Profile - My Account - Indecisive Wear',
  description: 'Manage your personal information and preferences',
}

import { AccountPageWrapper } from '../components/account-page-wrapper'

export default async function ProfilePage() {
  const customer = await getCurrentCustomer()
  
  // This will be handled by the layout, but keeping for safety
  if (!customer) {
    return null
  }

  return (
    <AccountPageWrapper>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-mono">Profile Information</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Profile Information */}
        <Card className="border-2 border-black">
          <CardHeader>
            <CardTitle className="font-mono flex items-center gap-3">
              <User className="h-5 w-5 flex-shrink-0" />
              Current Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Full Name</p>
              <p className="font-mono">
                {customer.firstName} {customer.lastName}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Display Name</p>
              <p className="font-mono">
                {customer.displayName || `${customer.firstName} ${customer.lastName}`.trim()}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Email Address</p>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <p className="font-mono">{customer.email}</p>
              </div>
            </div>

            {customer.phone ? (
              <div>
                <p className="text-sm text-gray-600 mb-1">Phone Number</p>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <p className="font-mono">{customer.phone}</p>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-1">Phone Number</p>
                <p className="text-gray-400 italic">Not provided</p>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-600 mb-1">Marketing Preferences</p>
              <div className="flex items-center gap-2">
                {customer.acceptsMarketing ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <Badge variant="outline" className="border-green-300 text-green-700">
                      Subscribed
                    </Badge>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-gray-400" />
                    <Badge variant="outline" className="border-gray-300 text-gray-600">
                      Not Subscribed
                    </Badge>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {customer.acceptsMarketing 
                  ? 'You will receive marketing emails and promotional offers'
                  : 'You will not receive marketing communications'
                }
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Customer ID</p>
              <p className="font-mono text-xs text-gray-500">
                {customer.id.split('/').pop()?.split('?')[0] || 'Unknown'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        <Card className="border-2 border-black">
          <CardHeader>
            <CardTitle className="font-mono flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Edit Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProfileEditForm customer={customer} />
          </CardContent>
        </Card>
      </div>

      {/* Profile Tips */}
      <Card className="border-2 border-black">
        <CardHeader>
          <CardTitle className="font-mono">Profile Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <Mail className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Email Address</p>
              <p className="text-gray-600">
                Your email is used for order confirmations and account security. 
                Make sure it&apos;s accurate and accessible.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Phone Number</p>
              <p className="text-gray-600">
                Adding a phone number helps with delivery notifications and account recovery.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Settings className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Marketing Preferences</p>
              <p className="text-gray-600">
                Subscribe to get exclusive offers, new product announcements, and style tips.
                You can unsubscribe at any time.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </AccountPageWrapper>
  )
}