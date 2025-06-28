'use server'

import { cookies } from 'next/headers'
import { revalidatePath, revalidateTag } from 'next/cache'

export interface CartItem {
  productId: string
  quantity: number
  price: number
  name: string
}

export interface Cart {
  items: CartItem[]
  total: number
  count: number
}

// Get cart from cookies
export async function getCart(): Promise<Cart> {
  const cartData = cookies().get('cart')?.value
  
  if (!cartData) {
    return { items: [], total: 0, count: 0 }
  }
  
  try {
    const cart = JSON.parse(cartData) as Cart
    return cart
  } catch {
    return { items: [], total: 0, count: 0 }
  }
}

// Add item to cart
export async function addToCart(productId: string, productData: { name: string; price: number }) {
  const cart = await getCart()
  
  const existingItem = cart.items.find(item => item.productId === productId)
  
  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.items.push({
      productId,
      quantity: 1,
      price: productData.price,
      name: productData.name
    })
  }
  
  // Recalculate totals
  cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  cart.count = cart.items.reduce((sum, item) => sum + item.quantity, 0)
  
  // Save to cookie
  cookies().set('cart', JSON.stringify(cart), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 1 week
  })
  
  // Revalidate affected pages
  revalidateTag('cart')
  revalidatePath('/')
  revalidatePath('/checkout')
}

// Remove item from cart
export async function removeFromCart(productId: string) {
  const cart = await getCart()
  
  cart.items = cart.items.filter(item => item.productId !== productId)
  
  // Recalculate totals
  cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  cart.count = cart.items.reduce((sum, item) => sum + item.quantity, 0)
  
  cookies().set('cart', JSON.stringify(cart), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7
  })
  
  revalidateTag('cart')
  revalidatePath('/')
  revalidatePath('/checkout')
}

// Update item quantity
export async function updateCartItemQuantity(productId: string, quantity: number) {
  if (quantity <= 0) {
    return removeFromCart(productId)
  }
  
  const cart = await getCart()
  const item = cart.items.find(item => item.productId === productId)
  
  if (item) {
    item.quantity = quantity
    
    // Recalculate totals
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    cart.count = cart.items.reduce((sum, item) => sum + item.quantity, 0)
    
    cookies().set('cart', JSON.stringify(cart), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    })
    
    revalidateTag('cart')
    revalidatePath('/')
    revalidatePath('/checkout')
  }
}

// Clear entire cart
export async function clearCart() {
  cookies().delete('cart')
  revalidateTag('cart')
  revalidatePath('/')
  revalidatePath('/checkout')
}