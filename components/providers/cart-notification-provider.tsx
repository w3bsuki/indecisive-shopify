'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { CartNotification } from '@/components/commerce/cart-notification'
import { CartNotificationConnector } from './cart-notification-connector'

interface CartNotificationContextType {
  showNotification: (product: {
    title: string
    image?: string
    price: string
    quantity: number
  }) => void
}

const CartNotificationContext = createContext<CartNotificationContextType | undefined>(undefined)

export function CartNotificationProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [product, setProduct] = useState<{
    title: string
    image?: string
    price: string
    quantity: number
  } | undefined>()

  const showNotification = useCallback((product: {
    title: string
    image?: string
    price: string
    quantity: number
  }) => {
    setProduct(product)
    setIsOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <CartNotificationContext.Provider value={{ showNotification }}>
      {children}
      <CartNotificationConnector />
      <CartNotification
        isOpen={isOpen}
        onClose={handleClose}
        product={product}
      />
    </CartNotificationContext.Provider>
  )
}

export function useCartNotification() {
  const context = useContext(CartNotificationContext)
  if (context === undefined) {
    throw new Error('useCartNotification must be used within a CartNotificationProvider')
  }
  return context
}