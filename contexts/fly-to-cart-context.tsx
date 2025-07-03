'use client'

import React, { createContext, useContext, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FlyingProduct {
  id: string
  imageUrl: string
  position: { x: number; y: number }
  size: { width: number; height: number }
}

interface FlyToCartContextType {
  flyToCart: (productData: {
    imageUrl: string
    elementRef: HTMLElement
  }) => void
  setCartIconRef: (ref: HTMLElement | null) => void
}

const FlyToCartContext = createContext<FlyToCartContextType | undefined>(undefined)

export function FlyToCartProvider({ children }: { children: React.ReactNode }) {
  const [flyingProducts, setFlyingProducts] = useState<FlyingProduct[]>([])
  const cartIconRef = useRef<HTMLElement | null>(null)

  const setCartIconRef = useCallback((ref: HTMLElement | null) => {
    cartIconRef.current = ref
  }, [])

  const flyToCart = useCallback((productData: {
    imageUrl: string
    elementRef: HTMLElement
  }) => {
    if (!cartIconRef.current) return

    const rect = productData.elementRef.getBoundingClientRect()
    const cartRect = cartIconRef.current.getBoundingClientRect()

    const flyingProduct: FlyingProduct = {
      id: `${Date.now()}-${Math.random()}`,
      imageUrl: productData.imageUrl,
      position: {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      },
      size: {
        width: rect.width,
        height: rect.height
      }
    }

    setFlyingProducts(prev => [...prev, flyingProduct])

    // Remove the flying product after animation completes
    setTimeout(() => {
      setFlyingProducts(prev => prev.filter(p => p.id !== flyingProduct.id))
    }, 800)

    // Add bounce effect to cart icon when product arrives
    setTimeout(() => {
      if (cartIconRef.current) {
        cartIconRef.current.classList.add('cart-bounce')
        setTimeout(() => {
          cartIconRef.current?.classList.remove('cart-bounce')
        }, 600)
      }
    }, 400) // Start bounce when product is near cart
  }, [])

  return (
    <FlyToCartContext.Provider value={{ flyToCart, setCartIconRef }}>
      {children}
      <AnimatePresence>
        {flyingProducts.map((product) => {
          const cartRect = cartIconRef.current?.getBoundingClientRect()
          if (!cartRect) return null

          return (
            <motion.div
              key={product.id}
              className="fixed pointer-events-none z-[9999]"
              initial={{
                x: product.position.x - product.size.width / 2,
                y: product.position.y - product.size.height / 2,
                width: product.size.width,
                height: product.size.height,
                opacity: 1,
                scale: 1,
              }}
              animate={{
                x: cartRect.left + cartRect.width / 2 - 16,
                y: cartRect.top + cartRect.height / 2 - 16,
                width: 32,
                height: 32,
                opacity: 0,
                scale: 0.3,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.6,
                ease: [0.32, 0.72, 0, 1],
                opacity: { duration: 0.4, delay: 0.2 },
                scale: { duration: 0.6 }
              }}
            >
              <div className="relative w-full h-full overflow-hidden border-2 border-black/10 bg-white shadow-lg">
                <img
                  src={product.imageUrl}
                  alt="Flying product"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </FlyToCartContext.Provider>
  )
}

export function useFlyToCart() {
  const context = useContext(FlyToCartContext)
  if (!context) {
    throw new Error('useFlyToCart must be used within a FlyToCartProvider')
  }
  return context
}