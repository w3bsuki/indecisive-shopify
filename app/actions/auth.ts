'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import {
  authenticateCustomer,
  createCustomer,
  logoutCustomer,
  recoverCustomerPassword,
  resetCustomerPassword,
} from '@/lib/shopify/customer-auth';
import { setCustomerToken, getCustomerToken, clearCustomerToken } from '@/lib/auth/token';

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  acceptsMarketing: z.boolean().default(false),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const recoverSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const resetSchema = z.object({
  resetUrl: z.string().url('Invalid reset URL'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// State types for useActionState
export type AuthState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

/**
 * Server Action for customer login
 */
export async function loginAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  // Validate form data
  const validatedFields = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      error: 'Invalid form data',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  // Attempt authentication
  const result = await authenticateCustomer(email, password);

  if (!result.success || !result.customerAccessToken) {
    // Map Shopify errors to user-friendly messages
    const errorMessage = result.errors?.[0]?.message || 'Invalid email or password';
    
    // Log for debugging
    console.error('Login failed:', {
      success: result.success,
      errors: result.errors,
      hasToken: !!result.customerAccessToken
    });
    
    return {
      error: errorMessage,
    };
  }

  // Set secure httpOnly cookie
  await setCustomerToken(result.customerAccessToken);

  // Revalidate all pages to reflect logged-in state
  revalidatePath('/', 'layout');

  // Get redirect URL from form or default to account
  const redirectTo = formData.get('redirectTo') as string || '/account';
  
  // Redirect to account or intended page
  redirect(redirectTo);
}

/**
 * Server Action for customer registration
 */
export async function registerAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  // Registration attempt started
  
  // Validate form data
  const validatedFields = registerSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    acceptsMarketing: formData.get('acceptsMarketing') === 'on',
  });

  if (!validatedFields.success) {
    // Validation failed
    return {
      error: 'Invalid form data',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password, firstName, lastName, acceptsMarketing } = validatedFields.data;
  // Form validation passed

  // Create customer account
  // Creating customer account
  const result = await createCustomer(
    email,
    password,
    firstName,
    lastName,
    acceptsMarketing
  );
  
  // Customer creation attempted

  if (!result.success) {
    // Handle specific error codes
    const error = result.errors?.[0];
    let errorMessage = 'Registration failed. Please try again.';
    
    if (error?.code === 'TAKEN') {
      errorMessage = 'An account with this email already exists.';
    } else if (error?.message) {
      errorMessage = error.message;
    }

    // Registration failed
    return {
      error: errorMessage,
    };
  }

  // Customer created successfully, attempting auto-login

  // After successful registration, automatically log in the customer
  const loginResult = await authenticateCustomer(email, password);
  
  // Auto-login attempted
  
  if (!loginResult.success || !loginResult.customerAccessToken) {
    // Auto-login failed, redirecting to login page
    // Registration succeeded but login failed - still redirect to login page
    redirect('/login?registered=true');
  }

  // Set secure httpOnly cookie
  await setCustomerToken(loginResult.customerAccessToken);
  // Session token set, redirecting to account

  // Revalidate all pages
  revalidatePath('/', 'layout');

  // Redirect to account
  redirect('/account');
}

/**
 * Server Action for customer logout
 */
export async function logoutAction(): Promise<void> {
  const token = await getCustomerToken();
  
  if (token) {
    // Delete access token on Shopify
    await logoutCustomer(token);
  }

  // Clear cookies
  await clearCustomerToken();

  // Revalidate all pages
  revalidatePath('/', 'layout');

  // Redirect to home
  redirect('/');
}

/**
 * Server Action for password recovery
 */
export async function recoverPasswordAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  // Validate form data
  const validatedFields = recoverSchema.safeParse({
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return {
      error: 'Invalid email address',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email } = validatedFields.data;

  // Send recovery email
  const result = await recoverCustomerPassword(email);

  if (!result.success) {
    return {
      error: result.errors?.[0]?.message || 'Failed to send recovery email.',
    };
  }

  return {
    success: true,
    error: undefined, // Clear any previous errors
  };
}

/**
 * Server Action for password reset
 */
export async function resetPasswordAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  // Validate form data
  const validatedFields = resetSchema.safeParse({
    resetUrl: formData.get('resetUrl'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!validatedFields.success) {
    return {
      error: 'Invalid form data',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { resetUrl, password } = validatedFields.data;

  // Reset password
  const result = await resetCustomerPassword(resetUrl, password);

  if (!result.success || !result.customerAccessToken) {
    return {
      error: result.errors?.[0]?.message || 'Failed to reset password.',
    };
  }

  // Set secure httpOnly cookie
  await setCustomerToken(result.customerAccessToken);

  // Revalidate all pages
  revalidatePath('/', 'layout');

  // Redirect to account
  redirect('/account');
}

/**
 * Server Action to get current customer from token
 * This is used to fetch customer data in Server Components
 */
export async function getCurrentCustomer() {
  const token = await getCustomerToken();
  
  if (!token) {
    return null;
  }

  // Import here to avoid circular dependency
  const { getCustomer } = await import('@/lib/shopify/customer-auth');
  
  try {
    const customer = await getCustomer(token);
    return customer;
  } catch (_error) {
    // Token might be invalid, clear it
    await clearCustomerToken();
    return null;
  }
}

/**
 * Server Action to update customer profile
 */
export async function updateCustomerProfileAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const token = await getCustomerToken();
  
  if (!token) {
    return {
      error: 'Not authenticated',
    };
  }

  // Validate form data
  const updateSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    acceptsMarketing: z.boolean().optional(),
  });

  const validatedFields = updateSchema.safeParse({
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    phone: formData.get('phone') || undefined,
    acceptsMarketing: formData.get('acceptsMarketing') === 'on',
  });

  if (!validatedFields.success) {
    return {
      error: 'Invalid form data',
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Import here to avoid circular dependency
  const { updateCustomer } = await import('@/lib/shopify/customer-auth');
  
  try {
    const result = await updateCustomer(token, validatedFields.data);
    
    if (!result.success) {
      return {
        error: result.errors?.[0]?.message || 'Failed to update profile',
      };
    }

    // Revalidate account page
    revalidatePath('/account');

    return {
      success: true,
      error: undefined,
    };
  } catch (_error) {
    return {
      error: 'Failed to update profile. Please try again.',
    };
  }
}

/**
 * Server Action to get customer orders
 */
export async function getCustomerOrdersAction(first: number = 10, after?: string) {
  const token = await getCustomerToken();
  
  if (!token) {
    return null;
  }

  // Import here to avoid circular dependency
  const { getCustomerOrders } = await import('@/lib/shopify/customer-auth');
  
  try {
    const orders = await getCustomerOrders(token, first, after);
    return orders;
  } catch (_error) {
    return null;
  }
}