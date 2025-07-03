'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { 
  createCustomerAddress, 
  updateCustomerAddress, 
  deleteCustomerAddress,
  setDefaultCustomerAddress 
} from '@/lib/shopify/customer-auth'
import { getCustomerToken } from '@/lib/auth/token'

// Validation schema for address operations
const addressSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
  address1: z.string().min(1, 'Address line 1 is required').max(100, 'Address is too long'),
  address2: z.string().max(100, 'Address line 2 is too long').optional(),
  city: z.string().min(1, 'City is required').max(50, 'City name is too long'),
  province: z.string().min(1, 'State/Province is required').max(50, 'Province is too long'),
  zip: z.string().min(1, 'ZIP/Postal code is required').max(20, 'ZIP code is too long'),
  country: z.string().min(1, 'Country is required').max(50, 'Country name is too long'),
  phone: z.string().optional().refine((phone) => {
    if (!phone || phone.trim() === '') return true
    // Basic phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
  }, 'Invalid phone number format'),
})

// State type for useActionState
export type AddressActionState = {
  success?: boolean
  error?: string
  fieldErrors?: Record<string, string[]>
}

/**
 * Server Action for creating a new address
 */
export async function createAddressAction(
  prevState: AddressActionState,
  formData: FormData
): Promise<AddressActionState> {
  // Get customer token
  const token = await getCustomerToken()
  if (!token) {
    return {
      error: 'You must be logged in to add an address'
    }
  }

  // Validate form data
  const validatedFields = addressSchema.safeParse({
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    address1: formData.get('address1'),
    address2: formData.get('address2'),
    city: formData.get('city'),
    province: formData.get('province'),
    zip: formData.get('zip'),
    country: formData.get('country'),
    phone: formData.get('phone'),
  })

  if (!validatedFields.success) {
    return {
      error: 'Invalid form data',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    // Clean phone number if provided
    const cleanPhone = validatedFields.data.phone 
      ? validatedFields.data.phone.replace(/[\s\-\(\)]/g, '') 
      : undefined

    // Create address
    // Action executed
    const result = await createCustomerAddress(token, {
      ...validatedFields.data,
      phone: cleanPhone,
    })

    if (!result.success) {
      const error = result.errors?.[0]
      const errorMessage = error?.message || 'Failed to create address. Please try again.'

      // Action executed
      return {
        error: errorMessage,
      }
    }

    // Check if this should be set as default (first address)
    const setAsDefault = formData.get('setAsDefault') === 'on'
    if (setAsDefault && result.address) {
      // Action executed
      const defaultResult = await setDefaultCustomerAddress(token, result.address.id)
      
      if (!defaultResult.success) {
        // Failed to set as default - non-critical error
      }
    }

    // Revalidate relevant pages
    revalidatePath('/account/addresses')
    revalidatePath('/account')

    // Redirect to addresses page
    redirect('/account/addresses')
  } catch (error) {
    console.error('💥 [ADDRESS CREATE] Unexpected error:', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
    }
  }
}

/**
 * Server Action for updating an existing address
 */
export async function updateAddressAction(
  addressId: string,
  prevState: AddressActionState,
  formData: FormData
): Promise<AddressActionState> {
  // Action executed
  
  // Get customer token
  const token = await getCustomerToken()
  if (!token) {
    return {
      error: 'You must be logged in to update an address'
    }
  }

  // Validate form data
  const validatedFields = addressSchema.safeParse({
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    address1: formData.get('address1'),
    address2: formData.get('address2'),
    city: formData.get('city'),
    province: formData.get('province'),
    zip: formData.get('zip'),
    country: formData.get('country'),
    phone: formData.get('phone'),
  })

  if (!validatedFields.success) {
    return {
      error: 'Invalid form data',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    // Clean phone number if provided
    const cleanPhone = validatedFields.data.phone 
      ? validatedFields.data.phone.replace(/[\s\-\(\)]/g, '') 
      : undefined

    // Update address
    // Action executed
    const result = await updateCustomerAddress(token, addressId, {
      ...validatedFields.data,
      phone: cleanPhone,
    })

    if (!result.success) {
      const error = result.errors?.[0]
      const errorMessage = error?.message || 'Failed to update address. Please try again.'

      // Action executed
      return {
        error: errorMessage,
      }
    }

    // Check if this should be set as default
    const setAsDefault = formData.get('setAsDefault') === 'on'
    if (setAsDefault && result.address) {
      // Action executed
      const defaultResult = await setDefaultCustomerAddress(token, result.address.id)
      
      if (!defaultResult.success) {
        // Failed to set as default - non-critical error
      }
    }

    // Revalidate relevant pages
    revalidatePath('/account/addresses')
    revalidatePath('/account')

    // Redirect to addresses page
    redirect('/account/addresses')
  } catch (error) {
    console.error('💥 [ADDRESS UPDATE] Unexpected error:', error)
    return {
      error: 'An unexpected error occurred. Please try again.',
    }
  }
}

/**
 * Server Action for deleting an address
 */
export async function deleteAddressAction(addressId: string): Promise<void> {
  // Action executed
  
  // Get customer token
  const token = await getCustomerToken()
  if (!token) {
    throw new Error('You must be logged in to delete an address')
  }

  try {
    // Delete address
    // Action executed
    const result = await deleteCustomerAddress(token, addressId)

    if (!result.success) {
      const error = result.errors?.[0]
      const errorMessage = error?.message || 'Failed to delete address.'
      // Action executed
      throw new Error(errorMessage)
    }

    // Revalidate relevant pages
    revalidatePath('/account/addresses')
    revalidatePath('/account')
  } catch (error) {
    console.error('💥 [ADDRESS DELETE] Unexpected error:', error)
    throw error
  }
}

/**
 * Server Action for setting an address as default
 */
export async function setDefaultAddressAction(addressId: string): Promise<void> {
  // Action executed
  
  // Get customer token
  const token = await getCustomerToken()
  if (!token) {
    throw new Error('You must be logged in to set a default address')
  }

  try {
    // Set default address
    // Action executed
    const result = await setDefaultCustomerAddress(token, addressId)

    if (!result.success) {
      const error = result.errors?.[0]
      const errorMessage = error?.message || 'Failed to set default address.'
      // Action executed
      throw new Error(errorMessage)
    }

    // Revalidate relevant pages
    revalidatePath('/account/addresses')
    revalidatePath('/account')
  } catch (error) {
    console.error('💥 [ADDRESS DEFAULT] Unexpected error:', error)
    throw error
  }
}