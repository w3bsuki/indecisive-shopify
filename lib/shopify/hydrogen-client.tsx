'use client';

import React, { ReactNode, useEffect, useRef } from 'react';
import { ShopifyProvider, CartProvider } from '@shopify/hydrogen-react';
import { useMarket } from '@/hooks/use-market';

// OFFICIAL HYDROGEN REACT PATTERN - with CartProvider and seamless market updates
export function HydrogenProvider({ children }: { children: ReactNode }) {
  const { market, isLoading } = useMarket();
  const prevMarketRef = useRef(market);
  
  const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const apiVersion = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || '2025-04';

  // Handle market changes for seamless currency updates
  useEffect(() => {
    const prevMarket = prevMarketRef.current;
    if (prevMarket.id !== market.id) {
      // Market changed
      prevMarketRef.current = market;
    }
  }, [market]);

  // Validation according to official docs
  if (!storeDomain || !storefrontToken) {
    // Gracefully render children without Shopify provider
    return <>{children}</>;
  }

  // CRITICAL FIX: Hydrogen React expects full domain with .myshopify.com
  const fullDomain = storeDomain.includes('.myshopify.com') 
    ? storeDomain 
    : `${storeDomain}.myshopify.com`;

  // Don't render until market is loaded to prevent hydration issues
  if (isLoading) {
    return <>{children}</>;
  }

  return (
    <ShopifyProvider
      storeDomain={fullDomain}
      storefrontToken={storefrontToken}
      storefrontApiVersion={apiVersion}
      countryIsoCode={market.countryCode as Parameters<typeof ShopifyProvider>[0]['countryIsoCode']}
      languageIsoCode={market.languageCode as Parameters<typeof ShopifyProvider>[0]['languageIsoCode']}
      key={`shopify-${market.id}`} // Force re-render when market changes
    >
      <CartProvider
        countryCode={market.countryCode as Parameters<typeof CartProvider>[0]['countryCode']}
        key={`cart-${market.id}`} // Force cart re-initialization with new market
      >
        {children}
      </CartProvider>
    </ShopifyProvider>
  );
}