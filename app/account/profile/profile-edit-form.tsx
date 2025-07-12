'use client'

import { useState } from 'react'
import { useActionState } from 'react'
import { updateProfileAction } from '@/app/actions/profile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { User, Mail, Phone, Save, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Customer } from '@/lib/shopify/customer-auth'

interface ProfileEditFormProps {
  customer: Customer
}

export function ProfileEditForm({ customer }: ProfileEditFormProps) {
  const [state, formAction, isPending] = useActionState(updateProfileAction, {})
  const [acceptsMarketing, setAcceptsMarketing] = useState(customer.acceptsMarketing)

  // Show success/error toasts
  if (state.success && !isPending) {
    toast.success('Profile updated successfully!')
  }
  
  if (state.error && !isPending) {
    toast.error(state.error)
  }

  return (
    <form action={formAction} className="space-y-3 sm:space-y-4">
      {/* First Name */}
      <div className="space-y-1.5 sm:space-y-2">
        <Label htmlFor="firstName" className="text-sm sm:text-base">First Name</Label>
        <div className="relative">
          <User className="absolute left-2.5 top-2.5 sm:left-3 sm:top-3 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
          <Input
            id="firstName"
            name="firstName"
            type="text"
            required
            className="pl-8 sm:pl-10 h-9 sm:h-10 text-sm sm:text-base"
            placeholder="Enter your first name"
            defaultValue={customer.firstName || ''}
            disabled={isPending}
          />
        </div>
        {state.fieldErrors?.firstName && (
          <p className="text-xs sm:text-sm text-red-600">{state.fieldErrors.firstName[0]}</p>
        )}
      </div>

      {/* Last Name */}
      <div className="space-y-1.5 sm:space-y-2">
        <Label htmlFor="lastName" className="text-sm sm:text-base">Last Name</Label>
        <div className="relative">
          <User className="absolute left-2.5 top-2.5 sm:left-3 sm:top-3 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
          <Input
            id="lastName"
            name="lastName"
            type="text"
            required
            className="pl-8 sm:pl-10 h-9 sm:h-10 text-sm sm:text-base"
            placeholder="Enter your last name"
            defaultValue={customer.lastName || ''}
            disabled={isPending}
          />
        </div>
        {state.fieldErrors?.lastName && (
          <p className="text-xs sm:text-sm text-red-600">{state.fieldErrors.lastName[0]}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1.5 sm:space-y-2">
        <Label htmlFor="email" className="text-sm sm:text-base">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-2.5 top-2.5 sm:left-3 sm:top-3 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="pl-8 sm:pl-10 h-9 sm:h-10 text-sm sm:text-base"
            placeholder="your@email.com"
            defaultValue={customer.email}
            disabled={isPending}
          />
        </div>
        {state.fieldErrors?.email && (
          <p className="text-xs sm:text-sm text-red-600">{state.fieldErrors.email[0]}</p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-1.5 sm:space-y-2">
        <Label htmlFor="phone" className="text-sm sm:text-base">Phone Number (Optional)</Label>
        <div className="relative">
          <Phone className="absolute left-2.5 top-2.5 sm:left-3 sm:top-3 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className="pl-8 sm:pl-10 h-9 sm:h-10 text-sm sm:text-base"
            placeholder="+1234567890"
            defaultValue={customer.phone || ''}
            disabled={isPending}
          />
        </div>
        <p className="text-xs text-gray-600">
          Include country code for international numbers (e.g., +1 for US, +44 for UK)
        </p>
        {state.fieldErrors?.phone && (
          <p className="text-xs sm:text-sm text-red-600">{state.fieldErrors.phone[0]}</p>
        )}
      </div>

      {/* Marketing Preferences */}
      <div className="space-y-2 sm:space-y-3">
        <Label className="text-sm sm:text-base">Marketing Preferences</Label>
        <div className="flex items-start space-x-2 sm:space-x-3">
          <Checkbox 
            id="acceptsMarketing" 
            name="acceptsMarketing" 
            checked={acceptsMarketing}
            onCheckedChange={(checked) => setAcceptsMarketing(checked === true)}
            disabled={isPending}
            className="mt-0.5"
          />
          <div className="space-y-1 leading-none">
            <Label 
              htmlFor="acceptsMarketing" 
              className="text-sm cursor-pointer font-normal"
            >
              Subscribe to marketing communications
            </Label>
            <p className="text-xs text-gray-600">
              Get exclusive offers, new product announcements, and style tips. 
              You can unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-3 sm:pt-4 border-t">
        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-10 sm:h-11 text-sm sm:text-base"
        >
          {isPending ? (
            <>
              <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />
              <span className="uppercase">Updating Profile...</span>
            </>
          ) : (
            <>
              <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              <span className="uppercase">Update Profile</span>
            </>
          )}
        </Button>
      </div>

      {/* Display state for debugging in development */}
      {process.env.NODE_ENV === 'development' && state.error && (
        <div className="text-xs text-red-600 mt-2">
          Debug: {JSON.stringify(state, null, 2)}
        </div>
      )}
    </form>
  )
}