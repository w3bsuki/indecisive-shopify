import { Metadata } from 'next'
import { getCurrentCustomer } from '@/app/actions/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, MapPin } from 'lucide-react'
import { AddressForm } from '../address-form'

export const metadata: Metadata = {
  title: 'Add Address - My Account - Indecisive Wear',
  description: 'Add a new shipping address to your account',
}

export default async function AddAddressPage() {
  const customer = await getCurrentCustomer()
  
  // This will be handled by the layout, but keeping for safety
  if (!customer) {
    return null
  }

  // Check if this will be the first address (to set as default)
  const hasExistingAddresses = (customer.addresses?.edges?.length || 0) > 0
  const shouldSetAsDefault = !hasExistingAddresses

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/account/addresses">
          <Button variant="outline" size="sm" className="font-mono border-2 border-black">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Addresses
          </Button>
        </Link>
        
        <div className="flex-1">
          <h2 className="text-2xl font-bold font-mono">Add New Address</h2>
          <p className="text-sm text-gray-600">
            Add a shipping address to make checkout faster
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="border-2 border-black">
        <CardHeader>
          <CardTitle className="font-mono flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Address Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AddressForm 
            defaultValues={{
              firstName: customer.firstName || '',
              lastName: customer.lastName || '',
              phone: customer.phone || '',
            }}
            isEditing={false}
            shouldSetAsDefault={shouldSetAsDefault}
          />
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="border-2 border-black">
        <CardHeader>
          <CardTitle className="font-mono">Address Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="space-y-2">
            <p className="font-medium">📍 Accurate Information</p>
            <p className="text-gray-600">
              Please ensure all address information is accurate. Include apartment numbers, 
              unit numbers, and any special delivery instructions.
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-medium">📞 Contact Information</p>
            <p className="text-gray-600">
              Adding a phone number helps delivery services contact you if needed. 
              Include the country code for international numbers.
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-medium">🏠 Default Address</p>
            <p className="text-gray-600">
              {shouldSetAsDefault 
                ? 'This will be set as your default address since it\'s your first one.'
                : 'You can choose to set this as your default address for faster checkout.'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}