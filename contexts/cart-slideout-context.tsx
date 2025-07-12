'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface CartSlideoutContextType {
  isOpen: boolean
  openSlideout: () => void
  closeSlideout: () => void
}

const CartSlideoutContext = createContext<CartSlideoutContextType | undefined>(undefined)

export function CartSlideoutProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openSlideout = () => setIsOpen(true)
  const closeSlideout = () => setIsOpen(false)

  return (
    <CartSlideoutContext.Provider value={{ isOpen, openSlideout, closeSlideout }}>
      {children}
    </CartSlideoutContext.Provider>
  )
}

export function useCartSlideout() {
  const context = useContext(CartSlideoutContext)
  if (context === undefined) {
    throw new Error('useCartSlideout must be used within a CartSlideoutProvider')
  }
  return context
}