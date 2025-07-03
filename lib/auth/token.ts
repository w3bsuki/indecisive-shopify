import { cookies } from 'next/headers';
import type { CustomerAccessToken } from '@/lib/shopify/customer-auth';

const CUSTOMER_TOKEN_COOKIE = 'customer-token';
const CUSTOMER_TOKEN_EXPIRES_COOKIE = 'customer-token-expires';

// Cookie options for security
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

/**
 * Set customer access token in secure httpOnly cookies
 */
export async function setCustomerToken(token: CustomerAccessToken): Promise<void> {
  const cookieStore = await cookies();
  
  // Set the access token
  cookieStore.set(CUSTOMER_TOKEN_COOKIE, token.accessToken, {
    ...cookieOptions,
    expires: new Date(token.expiresAt),
  });
  
  // Also store expiry time for checking
  cookieStore.set(CUSTOMER_TOKEN_EXPIRES_COOKIE, token.expiresAt, {
    ...cookieOptions,
    expires: new Date(token.expiresAt),
  });
}

/**
 * Get customer access token from cookies
 */
export async function getCustomerToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CUSTOMER_TOKEN_COOKIE);
  const expiresAt = cookieStore.get(CUSTOMER_TOKEN_EXPIRES_COOKIE);
  
  if (!token || !expiresAt) {
    return null;
  }
  
  // Check if token is expired
  const expiryDate = new Date(expiresAt.value);
  if (expiryDate <= new Date()) {
    // Token is expired, remove it
    await clearCustomerToken();
    return null;
  }
  
  return token.value;
}

/**
 * Clear customer access token from cookies
 */
export async function clearCustomerToken(): Promise<void> {
  const cookieStore = await cookies();
  
  cookieStore.delete(CUSTOMER_TOKEN_COOKIE);
  cookieStore.delete(CUSTOMER_TOKEN_EXPIRES_COOKIE);
}

/**
 * Check if customer is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await getCustomerToken();
  return !!token;
}

/**
 * Get time until token expires
 */
export async function getTokenExpiryTime(): Promise<Date | null> {
  const cookieStore = await cookies();
  const expiresAt = cookieStore.get(CUSTOMER_TOKEN_EXPIRES_COOKIE);
  
  if (!expiresAt) {
    return null;
  }
  
  return new Date(expiresAt.value);
}