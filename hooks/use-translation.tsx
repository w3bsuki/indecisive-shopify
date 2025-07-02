'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useMarket } from '@/hooks/use-market'

export function useTranslation() {
  const { market } = useMarket()
  const locale = useLocale()
  
  // Get translation function for each namespace
  const nav = useTranslations('nav')
  const home = useTranslations('home')
  const products = useTranslations('products')
  const cart = useTranslations('cart')
  const auth = useTranslations('auth')
  const account = useTranslations('account')
  const common = useTranslations('common')
  const footer = useTranslations('footer')
  const messages = useTranslations('messages')

  return {
    nav,
    home,
    products,
    cart,
    auth,
    account,
    common,
    footer,
    messages,
    locale,
    isRTL: false, // None of our supported languages are RTL
    currentLanguage: market.languageCode
  }
}