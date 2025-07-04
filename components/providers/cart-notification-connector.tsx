'use client'

import { useEffect } from 'react'
import { useCartNotification } from './cart-notification-provider'
import { setCartNotificationCallback } from '@/hooks/use-cart'

export function CartNotificationConnector() {
  const { showNotification } = useCartNotification()

  useEffect(() => {
    setCartNotificationCallback(showNotification)
    
    return () => {
      setCartNotificationCallback(null)
    }
  }, [showNotification])

  return null
}