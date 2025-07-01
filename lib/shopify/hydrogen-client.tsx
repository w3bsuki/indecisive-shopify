'use client';

import React, { ReactNode } from 'react';
import { ShopifyProvider, CartProvider } from '@shopify/hydrogen-react';

// OFFICIAL HYDROGEN REACT PATTERN - with CartProvider included
export function HydrogenProvider({ children }: { children: ReactNode }) {
  const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
  const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const apiVersion = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || '2025-04';

  // Validation according to official docs
  if (!storeDomain || !storefrontToken) {
    console.warn('Missing required Shopify environment variables - Shopify features disabled:', {
      storeDomain: !!storeDomain,
      storefrontToken: !!storefrontToken,
      apiVersion
    });
    // Gracefully render children without Shopify provider
    return <>{children}</>;
  }

  // CRITICAL FIX: Hydrogen React expects full domain with .myshopify.com
  const fullDomain = storeDomain.includes('.myshopify.com') 
    ? storeDomain 
    : `${storeDomain}.myshopify.com`;


  return (
    <ShopifyProvider
      storeDomain={fullDomain}
      storefrontToken={storefrontToken}
      storefrontApiVersion={apiVersion}
      countryIsoCode="US"
      languageIsoCode="EN"
    >
      <CartProvider>
        {children}
      </CartProvider>
    </ShopifyProvider>
  );
}