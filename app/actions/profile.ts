'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { updateCustomer } from '@/lib/shopify/customer-auth'
import { getCustomerToken } from '@/lib/auth/token'

// Validation schema for profile updates
const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional().refine((phone) => {
    if (!phone || phone.trim() === '') return true
    // Basic phone validation - allow various international formats
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
  }, 'Invalid phone number format'),
  acceptsMarketing: z.boolean().default(false),
})

// State type for useActionState
export type ProfileUpdateState = {
  success?: boolean
  error?: string
  fieldErrors?: Record<string, string[]>
}

/**
 * Server Action for updating customer profile
 */
export async function updateProfileAction(
  prevState: ProfileUpdateState,
  formData: FormData
): Promise<ProfileUpdateState> {
  // Starting profile update...
  
  // Get customer token
  const token = await getCustomerToken()
  if (!token) {
    return {
      error: 'You must be logged in to update your profile'
    }
  }

  // Validate form data
  const validatedFields = updateProfileSchema.safeParse({
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    acceptsMarketing: formData.get('acceptsMarketing') === 'on',
  })

  if (!validatedFields.success) {
    // Validation failed
    return {
      error: 'Invalid form data',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { firstName, lastName, email, phone, acceptsMarketing } = validatedFields.data
  // Form validation passed

  try {
    // Clean phone number (remove spaces, hyphens, parentheses)
    const cleanPhone = phone ? phone.replace(/[\s\-\(\)]/g, '') : undefined

    // Update customer profile
    // Updating customer profile...
    const result = await updateCustomer(token, {
      firstName,
      lastName,
      email,
      phone: cleanPhone,
      acceptsMarketing,
    })

    // Update result received

    if (!result.success) {
      // Handle specific error codes
      const error = result.errors?.[0]
      let errorMessage = 'Failed to update profile. Please try again.'
      
      if (error?.code === 'TAKEN') {
        errorMessage = 'This email address is already in use.'
      } else if (error?.code === 'INVALID') {
        errorMessage = 'Invalid information provided.'
      } else if (error?.message) {
        errorMessage = error.message
      }

      // Update failed
      return {
        error: errorMessage,
      }
    }

    // Profile updated successfully

    // Revalidate the profile and account pages
    revalidatePath('/account/profile')
    revalidatePath('/account')

    return {
      success: true,
      error: undefined, // Clear any previous errors
    }
  } catch (error) {
    console.error('💥 [PROFILE UPDATE] Unexpected error:', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
    }
  }
}