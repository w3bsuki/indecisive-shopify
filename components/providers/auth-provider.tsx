'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Customer } from '@/lib/shopify/customer-auth';

interface AuthContextValue {
  customer: Customer | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
  initialCustomer?: Customer | null;
}

export function AuthProvider({ children, initialCustomer = null }: AuthProviderProps) {
  const [customer, setCustomer] = useState<Customer | null>(initialCustomer);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    
    try {
      // Import and call the logout server action
      const { logoutAction } = await import('@/app/actions/auth');
      await logoutAction();
      
      // The server action will handle redirect
      setCustomer(null);
    } catch (error) {
      console.error('Logout failed:', error);
      // Still try to redirect on error
      router.push('/');
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    // If we have an initial customer, we're authenticated
    if (initialCustomer) {
      setCustomer(initialCustomer);
    }
  }, [initialCustomer]);

  const value: AuthContextValue = {
    customer,
    isLoading,
    isAuthenticated: !!customer,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// Hook to require authentication
export function useRequireAuth(redirectTo: string = '/login') {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`${redirectTo}?redirectTo=${encodeURIComponent(window.location.pathname)}`);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  return { isAuthenticated, isLoading };
}