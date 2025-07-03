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
    <form action={formAction} className="space-y-4">
      {/* First Name */}
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
            placeholder="Enter your first name"
            defaultValue={customer.firstName || ''}
            disabled={isPending}
          />
        </div>
        {state.fieldErrors?.firstName && (
          <p className="text-sm text-red-600">{state.fieldErrors.firstName[0]}</p>
        )}
      </div>

      {/* Last Name */}
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
            placeholder="Enter your last name"
            defaultValue={customer.lastName || ''}
            disabled={isPending}
          />
        </div>
        {state.fieldErrors?.lastName && (
          <p className="text-sm text-red-600">{state.fieldErrors.lastName[0]}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="font-mono">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="pl-10 border-2 border-black"
            placeholder="your@email.com"
            defaultValue={customer.email}
            disabled={isPending}
          />
        </div>
        {state.fieldErrors?.email && (
          <p className="text-sm text-red-600">{state.fieldErrors.email[0]}</p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="font-mono">Phone Number (Optional)</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className="pl-10 border-2 border-black"
            placeholder="+1234567890"
            defaultValue={customer.phone || ''}
            disabled={isPending}
          />
        </div>
        <p className="text-xs text-gray-600">
          Include country code for international numbers (e.g., +1 for US, +44 for UK)
        </p>
        {state.fieldErrors?.phone && (
          <p className="text-sm text-red-600">{state.fieldErrors.phone[0]}</p>
        )}
      </div>

      {/* Marketing Preferences */}
      <div className="space-y-3">
        <Label className="font-mono">Marketing Preferences</Label>
        <div className="flex items-start space-x-3">
          <Checkbox 
            id="acceptsMarketing" 
            name="acceptsMarketing" 
            checked={acceptsMarketing}
            onCheckedChange={(checked) => setAcceptsMarketing(checked === true)}
            disabled={isPending}
          />
          <div className="space-y-1 leading-none">
            <Label 
              htmlFor="acceptsMarketing" 
              className="text-sm cursor-pointer"
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
      <div className="pt-4 border-t">
        <Button
          type="submit"
          disabled={isPending}
          className="w-full font-mono"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              UPDATING PROFILE...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              UPDATE PROFILE
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