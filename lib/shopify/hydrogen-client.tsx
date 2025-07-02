'use client';

import React, { ReactNode } from 'react';
import { ShopifyProvider, CartProvider } from '@shopify/hydrogen-react';
import { useMarket } from '@/hooks/use-market';

// OFFICIAL HYDROGEN REACT PATTERN - with CartProvider and market context
export function HydrogenProvider({ children }: { children: ReactNode }) {
  const { market } = useMarket();
  
  const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
  const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const apiVersion = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || '2025-04';

  // Validation according to official docs
  if (!storeDomain || !storefrontToken) {
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
      countryIsoCode={market.countryCode as any}
      languageIsoCode={market.languageCode as any}
    >
      <CartProvider
        countryCode={market.countryCode as any}
      >
        {children}
      </CartProvider>
    </ShopifyProvider>
  );
}