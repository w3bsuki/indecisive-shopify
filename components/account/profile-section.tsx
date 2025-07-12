'use client'

import { useState, useEffect } from 'react'
import { useActionState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { User, Mail, Bell, Shield, Loader2, Check, AlertCircle } from 'lucide-react'
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
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Loading profile information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Profile Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Profile Information</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage your personal information and preferences</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
          disabled={isPending}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>

      {/* Success/Error Messages */}
      {state.success && (
        <Alert>
          <Check className="h-4 w-4" />
          <AlertDescription>
            Profile updated successfully
          </AlertDescription>
        </Alert>
      )}
      
      {state.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {state.error}
          </AlertDescription>
        </Alert>
      )}

      {/* Profile Form */}
      <form action={formAction} className="space-y-8">
        {/* Personal Information */}
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-semibold mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">
                  First name
                </Label>
                <div className="relative">
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    disabled={!isEditing || isPending}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    placeholder="Enter your first name"
                    className={`h-11 ${isEditing ? 'bg-background' : 'bg-muted/50'} ${state.fieldErrors?.firstName ? 'border-destructive' : ''}`}
                  />
                  {isEditing && (
                    <User className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                {state.fieldErrors?.firstName && (
                  <p className="text-sm text-destructive">{state.fieldErrors.firstName[0]}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Last name
                </Label>
                <div className="relative">
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    disabled={!isEditing || isPending}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    placeholder="Enter your last name"
                    className={`h-11 ${isEditing ? 'bg-background' : 'bg-muted/50'} ${state.fieldErrors?.lastName ? 'border-destructive' : ''}`}
                  />
                  {isEditing && (
                    <User className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                {state.fieldErrors?.lastName && (
                  <p className="text-sm text-destructive">{state.fieldErrors.lastName[0]}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-base font-semibold mb-4">Contact Information</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    disabled={!isEditing || isPending}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="your@email.com"
                    className={`h-11 pl-4 pr-10 ${isEditing ? 'bg-background' : 'bg-muted/50'} ${state.fieldErrors?.email ? 'border-destructive' : ''}`}
                  />
                  <Mail className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                </div>
                {state.fieldErrors?.email && (
                  <p className="text-sm text-destructive">{state.fieldErrors.email[0]}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone number
                </Label>
                <div className="relative">
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    placeholder="+1 (555) 000-0000"
                    disabled={!isEditing || isPending}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className={`h-11 pl-4 pr-10 ${isEditing ? 'bg-background' : 'bg-muted/50'} ${state.fieldErrors?.phone ? 'border-destructive' : ''}`}
                  />
                  <div className="absolute right-3 top-3 h-5 w-5 text-muted-foreground">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </div>
                </div>
                {state.fieldErrors?.phone && (
                  <p className="text-sm text-destructive">{state.fieldErrors.phone[0]}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="border-t pt-6">
          <h3 className="text-base font-semibold mb-4">Email Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
              <Switch
                id="marketing"
                name="acceptsMarketing"
                checked={formData.acceptsMarketing}
                onCheckedChange={(checked) => setFormData({...formData, acceptsMarketing: checked})}
                disabled={!isEditing || isPending}
                className="mt-0.5"
              />
              <div className="space-y-1 flex-1">
                <Label htmlFor="marketing" className="text-sm font-medium cursor-pointer">
                  Marketing emails
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about new products, exclusive offers, and sales
                </p>
              </div>
              <Bell className="h-4 w-4 text-muted-foreground mt-0.5" />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="border-t pt-6">
          <h3 className="text-base font-semibold mb-4">Security</h3>
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Password</p>
                <p className="text-sm text-muted-foreground">Last changed: Never</p>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={isPending}
                className="gap-2"
              >
                <Shield className="h-4 w-4" />
                Change
              </Button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="flex gap-3 pt-2">
            <Button 
              type="submit"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
            <Button 
              type="button"
              variant="outline" 
              onClick={handleCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>
        )}
      </form>
    </div>
  )
}