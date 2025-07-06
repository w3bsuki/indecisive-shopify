import { Metadata } from 'next'
import { getCurrentCustomer } from '@/app/actions/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { 
  MapPin, 
  Plus, 
  Edit, 
  Star,
  Home,
  Building2
} from 'lucide-react'
import { AddressActionButtons } from './address-action-buttons'
import { AccountPageWrapper } from '../components/account-page-wrapper'

export const metadata: Metadata = {
  title: 'Addresses - My Account - Indecisive Wear',
  description: 'Manage your shipping addresses',
}

function formatAddress(address: {
  address1?: string | null
  address2?: string | null
  city?: string | null
  province?: string | null
  provinceCode?: string | null
  zip?: string | null
  country?: string | null
}) {
  const parts = []
  
  if (address.address1) parts.push(address.address1)
  if (address.address2) parts.push(address.address2)
  
  const cityStateZip = [
    address.city,
    address.provinceCode || address.province,
    address.zip
  ].filter(Boolean).join(', ')
  
  if (cityStateZip) parts.push(cityStateZip)
  if (address.country) parts.push(address.country)
  
  return parts
}

export default async function AddressesPage() {
  const customer = await getCurrentCustomer()
  
  // This will be handled by the layout, but keeping for safety
  if (!customer) {
    return null
  }

  const addresses = customer.addresses?.edges || []
  const defaultAddressId = customer.defaultAddress?.id

  return (
    <AccountPageWrapper>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-mono">Shipping Addresses</h2>
        <Link href="/account/addresses/add">
          <Button className="font-mono">
            <Plus className="h-4 w-4 mr-2" />
            Add New Address
          </Button>
        </Link>
      </div>

      {addresses.length === 0 ? (
        <Card className="border-2 border-black">
          <CardContent className="py-12 text-center">
            <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="font-mono font-medium mb-2">No Addresses Yet</h3>
            <p className="text-gray-600 mb-6">
              Add a shipping address to make checkout faster and easier.
            </p>
            <Link href="/account/addresses/add">
              <Button className="font-mono">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Address
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map(({ node: address }) => {
            const isDefault = address.id === defaultAddressId
            const addressLines = formatAddress(address)
            
            return (
              <Card key={address.id} className="border-2 border-black relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-mono text-lg flex items-center gap-2">
                      {isDefault ? (
                        <Home className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Building2 className="h-5 w-5 text-gray-500" />
                      )}
                      {address.firstName} {address.lastName}
                    </CardTitle>
                    {isDefault && (
                      <Badge variant="outline" className="border-blue-300 text-blue-700">
                        <Star className="h-3 w-3 mr-1" />
                        Default
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="font-mono text-sm space-y-1">
                    {addressLines.map((line, index) => (
                      <p key={index} className="text-gray-700">{line}</p>
                    ))}
                  </div>

                  {address.phone && (
                    <div className="text-sm">
                      <span className="text-gray-600">Phone: </span>
                      <span className="font-mono">{address.phone}</span>
                    </div>
                  )}

                  <div className="flex gap-2 pt-3 border-t">
                    <Link href={`/account/addresses/${address.id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full font-mono border-2 border-black">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>

                    <AddressActionButtons 
                      addressId={address.id}
                      isDefault={isDefault}
                      addressName={`${address.firstName} ${address.lastName}`}
                    />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Address Tips */}
      <Card className="border-2 border-black">
        <CardHeader>
          <CardTitle className="font-mono">Address Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <Star className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Default Address</p>
              <p className="text-gray-600">
                Your default address will be automatically selected during checkout. 
                You can change it anytime.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Accurate Information</p>
              <p className="text-gray-600">
                Make sure your address information is accurate to avoid delivery issues. 
                Include apartment numbers and building details.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Building2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Multiple Addresses</p>
              <p className="text-gray-600">
                You can save multiple addresses for home, work, or gift deliveries. 
                Each address can have different contact information.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </AccountPageWrapper>
  )
}