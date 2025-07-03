import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCurrentCustomer } from '@/app/actions/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, MapPin, Star } from 'lucide-react'
import { AddressForm } from '../../address-form'

export const metadata: Metadata = {
  title: 'Edit Address - My Account - Indecisive Wear',
  description: 'Edit your shipping address information',
}

interface EditAddressPageProps {
  params: Promise<{ id: string }>
}

export default async function EditAddressPage({ params }: EditAddressPageProps) {
  const { id } = await params
  const customer = await getCurrentCustomer()
  
  // This will be handled by the layout, but keeping for safety
  if (!customer) {
    return null
  }

  // Find the address to edit
  const addressEdge = customer.addresses?.edges.find(edge => edge.node.id === id)
  const address = addressEdge?.node

  if (!address) {
    notFound()
  }

  const isDefault = customer.defaultAddress?.id === address.id

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
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold font-mono">Edit Address</h2>
            {isDefault && (
              <Badge variant="outline" className="border-blue-300 text-blue-700">
                <Star className="h-3 w-3 mr-1" />
                Default
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-600">
            Update your address information
          </p>
        </div>
      </div>

      {/* Current Address Info */}
      <Card className="border-2 border-gray-300 bg-gray-50">
        <CardHeader>
          <CardTitle className="font-mono text-sm">Current Address</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="font-mono text-sm space-y-1">
            <p>{address.firstName} {address.lastName}</p>
            <p>{address.address1}</p>
            {address.address2 && <p>{address.address2}</p>}
            <p>
              {address.city}, {address.provinceCode || address.province} {address.zip}
            </p>
            <p>{address.country}</p>
            {address.phone && <p>Phone: {address.phone}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      <Card className="border-2 border-black">
        <CardHeader>
          <CardTitle className="font-mono flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Update Address Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AddressForm 
            defaultValues={{
              firstName: address.firstName || '',
              lastName: address.lastName || '',
              address1: address.address1 || '',
              address2: address.address2 || '',
              city: address.city || '',
              province: address.province || address.provinceCode || '',
              zip: address.zip || '',
              country: address.country || '',
              phone: address.phone || '',
            }}
            isEditing={true}
            addressId={address.id}
            shouldSetAsDefault={isDefault}
          />
        </CardContent>
      </Card>

      {/* Update Tips */}
      <Card className="border-2 border-black">
        <CardHeader>
          <CardTitle className="font-mono">Update Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="space-y-2">
            <p className="font-medium">✏️ Making Changes</p>
            <p className="text-gray-600">
              You can update any field in your address. Make sure all information 
              is accurate to avoid delivery issues.
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-medium">🏠 Default Address</p>
            <p className="text-gray-600">
              {isDefault 
                ? 'This is currently your default address. You can keep it as default or remove the default status.'
                : 'You can set this as your default address if you want it to be automatically selected during checkout.'
              }
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-medium">🚚 Active Orders</p>
            <p className="text-gray-600">
              Changes to this address will not affect orders that have already been placed. 
              Only future orders will use the updated address.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}