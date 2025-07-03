'use client'

import { useActionState } from 'react'
import { createAddressAction, updateAddressAction } from '@/app/actions/addresses'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  User, 
  MapPin, 
  Building, 
  Phone, 
  Globe,
  Save,
  Loader2,
  Star
} from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'
import type { CustomerAddress } from '@/lib/shopify/customer-auth'

interface AddressFormProps {
  defaultValues?: Partial<CustomerAddress> & {
    firstName?: string
    lastName?: string
    phone?: string
  }
  isEditing?: boolean
  addressId?: string
  shouldSetAsDefault?: boolean
}

// Common countries for the select dropdown
const COUNTRIES = [
  { code: 'BG', name: 'Bulgaria' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'AT', name: 'Austria' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
]

export function AddressForm({ 
  defaultValues = {}, 
  isEditing = false, 
  addressId,
  shouldSetAsDefault = false
}: AddressFormProps) {
  const [selectedCountry, setSelectedCountry] = useState(defaultValues.country || 'BG')
  const [setAsDefault, setSetAsDefault] = useState(shouldSetAsDefault)

  // Create the appropriate action based on whether we're editing or creating
  const action = isEditing && addressId 
    ? updateAddressAction.bind(null, addressId)
    : createAddressAction

  const [state, formAction, isPending] = useActionState(action, {})

  // Show success/error toasts
  if (state.success && !isPending) {
    toast.success(isEditing ? 'Address updated successfully!' : 'Address added successfully!')
  }
  
  if (state.error && !isPending) {
    toast.error(state.error)
  }

  return (
    <form action={formAction} className="space-y-6">
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="font-mono font-medium text-lg border-b pb-2">Personal Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="font-mono">First Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="firstName"
                name="firstName"
                type="text"
                required
                className="pl-10 border-2 border-black"
                placeholder="Enter first name"
                defaultValue={defaultValues.firstName || ''}
                disabled={isPending}
              />
            </div>
            {state.fieldErrors?.firstName && (
              <p className="text-sm text-red-600">{state.fieldErrors.firstName[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="font-mono">Last Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="lastName"
                name="lastName"
                type="text"
                required
                className="pl-10 border-2 border-black"
                placeholder="Enter last name"
                defaultValue={defaultValues.lastName || ''}
                disabled={isPending}
              />
            </div>
            {state.fieldErrors?.lastName && (
              <p className="text-sm text-red-600">{state.fieldErrors.lastName[0]}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="font-mono">Phone Number (Optional)</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="phone"
              name="phone"
              type="tel"
              className="pl-10 border-2 border-black"
              placeholder="+359888123456"
              defaultValue={defaultValues.phone || ''}
              disabled={isPending}
            />
          </div>
          <p className="text-xs text-gray-600">
            Include country code (e.g., +359 for Bulgaria, +1 for US)
          </p>
          {state.fieldErrors?.phone && (
            <p className="text-sm text-red-600">{state.fieldErrors.phone[0]}</p>
          )}
        </div>
      </div>

      {/* Address Information */}
      <div className="space-y-4">
        <h3 className="font-mono font-medium text-lg border-b pb-2">Address Information</h3>
        
        <div className="space-y-2">
          <Label htmlFor="address1" className="font-mono">Address Line 1</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="address1"
              name="address1"
              type="text"
              required
              className="pl-10 border-2 border-black"
              placeholder="Street address, apartment, suite, etc."
              defaultValue={defaultValues.address1 || ''}
              disabled={isPending}
            />
          </div>
          {state.fieldErrors?.address1 && (
            <p className="text-sm text-red-600">{state.fieldErrors.address1[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address2" className="font-mono">Address Line 2 (Optional)</Label>
          <div className="relative">
            <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="address2"
              name="address2"
              type="text"
              className="pl-10 border-2 border-black"
              placeholder="Apartment, suite, unit, building, floor, etc."
              defaultValue={defaultValues.address2 || ''}
              disabled={isPending}
            />
          </div>
          {state.fieldErrors?.address2 && (
            <p className="text-sm text-red-600">{state.fieldErrors.address2[0]}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city" className="font-mono">City</Label>
            <Input
              id="city"
              name="city"
              type="text"
              required
              className="border-2 border-black"
              placeholder="Enter city"
              defaultValue={defaultValues.city || ''}
              disabled={isPending}
            />
            {state.fieldErrors?.city && (
              <p className="text-sm text-red-600">{state.fieldErrors.city[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="province" className="font-mono">State/Province</Label>
            <Input
              id="province"
              name="province"
              type="text"
              required
              className="border-2 border-black"
              placeholder={selectedCountry === 'US' ? 'State' : 'Province/Region'}
              defaultValue={defaultValues.province || defaultValues.provinceCode || ''}
              disabled={isPending}
            />
            {state.fieldErrors?.province && (
              <p className="text-sm text-red-600">{state.fieldErrors.province[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="zip" className="font-mono">ZIP/Postal Code</Label>
            <Input
              id="zip"
              name="zip"
              type="text"
              required
              className="border-2 border-black"
              placeholder={selectedCountry === 'US' ? 'ZIP Code' : 'Postal Code'}
              defaultValue={defaultValues.zip || ''}
              disabled={isPending}
            />
            {state.fieldErrors?.zip && (
              <p className="text-sm text-red-600">{state.fieldErrors.zip[0]}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="country" className="font-mono">Country</Label>
          <div className="relative">
            <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
            <Select 
              name="country" 
              value={selectedCountry} 
              onValueChange={setSelectedCountry}
              disabled={isPending}
            >
              <SelectTrigger className="pl-10 border-2 border-black">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((country) => (
                  <SelectItem key={country.code} value={country.name}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {state.fieldErrors?.country && (
            <p className="text-sm text-red-600">{state.fieldErrors.country[0]}</p>
          )}
        </div>
      </div>

      {/* Options */}
      <div className="space-y-4">
        <h3 className="font-mono font-medium text-lg border-b pb-2">Options</h3>
        
        <div className="flex items-start space-x-3">
          <Checkbox 
            id="setAsDefault" 
            name="setAsDefault" 
            checked={setAsDefault}
            onCheckedChange={(checked) => setSetAsDefault(checked === true)}
            disabled={isPending}
          />
          <div className="space-y-1 leading-none">
            <Label 
              htmlFor="setAsDefault" 
              className="text-sm cursor-pointer flex items-center gap-2"
            >
              <Star className="h-4 w-4" />
              Set as default address
            </Label>
            <p className="text-xs text-gray-600">
              This address will be automatically selected during checkout
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6 border-t">
        <Button
          type="submit"
          disabled={isPending}
          className="w-full font-mono"
          size="lg"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {isEditing ? 'UPDATING ADDRESS...' : 'ADDING ADDRESS...'}
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {isEditing ? 'UPDATE ADDRESS' : 'ADD ADDRESS'}
            </>
          )}
        </Button>
      </div>

      {/* Display errors for debugging in development */}
      {process.env.NODE_ENV === 'development' && state.error && (
        <div className="text-xs text-red-600 mt-2 p-2 bg-red-50 border border-red-200">
          Debug: {JSON.stringify(state, null, 2)}
        </div>
      )}
    </form>
  )
}