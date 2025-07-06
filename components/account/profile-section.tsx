'use client'

import { useState, useEffect } from 'react'
import { useActionState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { User, Edit3, Loader2, Check, AlertCircle } from 'lucide-react'
import { updateCustomerProfileAction } from '@/app/actions/auth'
import type { AccountSectionProps } from './types'
import type { Customer } from '@/lib/shopify/customer-auth'

interface ProfileSectionProps extends AccountSectionProps {
  customer: Customer | null
}

export function ProfileSection({ className, customer }: ProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [state, formAction, isPending] = useActionState(updateCustomerProfileAction, {})
  
  // Local form state
  const [formData, setFormData] = useState({
    firstName: customer?.firstName || '',
    lastName: customer?.lastName || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    acceptsMarketing: customer?.acceptsMarketing || false,
  })

  // Update form data when customer changes
  useEffect(() => {
    if (customer) {
      setFormData({
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        email: customer.email || '',
        phone: customer.phone || '',
        acceptsMarketing: customer.acceptsMarketing || false,
      })
    }
  }, [customer])

  // Handle success state
  useEffect(() => {
    if (state.success) {
      setIsEditing(false)
    }
  }, [state.success])

  const handleCancel = () => {
    // Reset form data to original customer data
    if (customer) {
      setFormData({
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        email: customer.email || '',
        phone: customer.phone || '',
        acceptsMarketing: customer.acceptsMarketing || false,
      })
    }
    setIsEditing(false)
  }

  if (!customer) {
    return (
      <div className={className}>
        <Card className="border-2 border-black">
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Loading profile...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={className}>
      <Card className="border-2 border-black">
        <CardHeader className="border-b-2 border-black">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 font-mono">
                <User className="w-4 h-4" />
                PROFILE INFORMATION
              </CardTitle>
              <CardDescription>
                Manage your personal information and preferences
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
              disabled={isPending}
              className="border-2 border-black font-mono"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              {isEditing ? 'CANCEL' : 'EDIT'}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {/* Success/Error Messages */}
          {state.success && (
            <Alert className="border-green-500 bg-green-50">
              <Check className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">
                Profile updated successfully!
              </AlertDescription>
            </Alert>
          )}
          
          {state.error && (
            <Alert className="border-red-500 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-600">
                {state.error}
              </AlertDescription>
            </Alert>
          )}

          {/* Avatar and Basic Info */}
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20 border-2 border-black">
              <AvatarFallback className="text-lg font-mono">
                {(formData.firstName[0] || '').toUpperCase()}{(formData.lastName[0] || '').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-xl font-bold font-mono">
                {customer.displayName}
              </h3>
              <p className="text-muted-foreground">{customer.email}</p>
              <p className="text-sm text-muted-foreground">
                Customer ID: {customer.id.split('/').pop()}
              </p>
            </div>
          </div>

          <Separator className="border-gray-200" />

          {/* Profile Form */}
          <form action={formAction} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="font-mono">FIRST NAME</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  disabled={!isEditing || isPending}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="border-2 border-gray-200 disabled:bg-gray-50"
                />
                {state.fieldErrors?.firstName && (
                  <p className="text-sm text-red-600">{state.fieldErrors.firstName[0]}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName" className="font-mono">LAST NAME</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  disabled={!isEditing || isPending}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="border-2 border-gray-200 disabled:bg-gray-50"
                />
                {state.fieldErrors?.lastName && (
                  <p className="text-sm text-red-600">{state.fieldErrors.lastName[0]}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="font-mono">EMAIL</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  disabled={!isEditing || isPending}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="border-2 border-gray-200 disabled:bg-gray-50"
                />
                {state.fieldErrors?.email && (
                  <p className="text-sm text-red-600">{state.fieldErrors.email[0]}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="font-mono">PHONE</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  disabled={!isEditing || isPending}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="border-2 border-gray-200 disabled:bg-gray-50"
                />
                {state.fieldErrors?.phone && (
                  <p className="text-sm text-red-600">{state.fieldErrors.phone[0]}</p>
                )}
              </div>
            </div>

            {/* Marketing Preferences */}
            <div className="space-y-4">
              <Separator className="border-gray-200" />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="font-mono">MARKETING EMAILS</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive promotional emails and product updates
                  </p>
                </div>
                <Switch
                  name="acceptsMarketing"
                  checked={formData.acceptsMarketing}
                  onCheckedChange={(checked) => setFormData({...formData, acceptsMarketing: checked})}
                  disabled={!isEditing || isPending}
                />
              </div>
            </div>

            {/* Save Button */}
            {isEditing && (
              <div className="flex gap-2 pt-4">
                <Button 
                  type="submit"
                  disabled={isPending}
                  className="bg-black text-white hover:bg-gray-800 font-mono"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      SAVING...
                    </>
                  ) : (
                    'SAVE CHANGES'
                  )}
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={handleCancel}
                  disabled={isPending}
                  className="border-2 border-black font-mono"
                >
                  CANCEL
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}