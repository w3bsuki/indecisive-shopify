import { renderHook, act, waitFor } from '@testing-library/react'
import { useCart, CartProvider } from '@/hooks/use-cart'
import { ReactNode } from 'react'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock as any

// Mock fetch for API calls
global.fetch = jest.fn()

const wrapper = ({ children }: { children: ReactNode }) => (
  <CartProvider>{children}</CartProvider>
)

describe('useCart Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  it('initializes with empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    expect(result.current.items).toEqual([])
    expect(result.current.itemCount).toBe(0)
    expect(result.current.totalPrice).toBe(0)
  })

  it('loads cart from localStorage on mount', () => {
    const savedCart = {
      items: [
        { id: '1', productId: 'p1', variantId: 'v1', quantity: 2, price: 1000 }
      ]
    }
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedCart))
    
    const { result } = renderHook(() => useCart(), { wrapper })
    
    expect(result.current.items).toEqual(savedCart.items)
    expect(result.current.itemCount).toBe(2)
    expect(result.current.totalPrice).toBe(2000)
  })

  it('adds item to cart', async () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    await act(async () => {
      await result.current.addItem({
        productId: 'p1',
        variantId: 'v1',
        quantity: 1,
        price: 1500
      })
    })
    
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0]).toMatchObject({
      productId: 'p1',
      variantId: 'v1',
      quantity: 1,
      price: 1500
    })
    expect(result.current.totalPrice).toBe(1500)
    expect(localStorageMock.setItem).toHaveBeenCalled()
  })

  it('updates quantity of existing item', async () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    // Add initial item
    await act(async () => {
      await result.current.addItem({
        productId: 'p1',
        variantId: 'v1',
        quantity: 1,
        price: 1000
      })
    })
    
    // Add same item again
    await act(async () => {
      await result.current.addItem({
        productId: 'p1',
        variantId: 'v1',
        quantity: 2,
        price: 1000
      })
    })
    
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].quantity).toBe(3)
    expect(result.current.totalPrice).toBe(3000)
  })

  it('removes item from cart', async () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    // Add items
    await act(async () => {
      await result.current.addItem({
        productId: 'p1',
        variantId: 'v1',
        quantity: 1,
        price: 1000
      })
      await result.current.addItem({
        productId: 'p2',
        variantId: 'v2',
        quantity: 1,
        price: 2000
      })
    })
    
    expect(result.current.items).toHaveLength(2)
    
    // Remove first item
    await act(async () => {
      await result.current.removeItem(result.current.items[0].id)
    })
    
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].productId).toBe('p2')
    expect(result.current.totalPrice).toBe(2000)
  })

  it('updates item quantity', async () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    // Add item
    await act(async () => {
      await result.current.addItem({
        productId: 'p1',
        variantId: 'v1',
        quantity: 1,
        price: 1000
      })
    })
    
    const itemId = result.current.items[0].id
    
    // Update quantity
    await act(async () => {
      await result.current.updateQuantity(itemId, 5)
    })
    
    expect(result.current.items[0].quantity).toBe(5)
    expect(result.current.totalPrice).toBe(5000)
  })

  it('clears the cart', async () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    // Add items
    await act(async () => {
      await result.current.addItem({
        productId: 'p1',
        variantId: 'v1',
        quantity: 2,
        price: 1000
      })
    })
    
    expect(result.current.items).toHaveLength(1)
    
    // Clear cart
    await act(async () => {
      await result.current.clearCart()
    })
    
    expect(result.current.items).toEqual([])
    expect(result.current.itemCount).toBe(0)
    expect(result.current.totalPrice).toBe(0)
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('cart')
  })

  it('handles errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    const { result } = renderHook(() => useCart(), { wrapper })
    
    // Mock API error
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'))
    
    await act(async () => {
      await result.current.addItem({
        productId: 'p1',
        variantId: 'v1',
        quantity: 1,
        price: 1000
      })
    })
    
    // Item should still be added optimistically
    expect(result.current.items).toHaveLength(1)
    expect(consoleSpy).toHaveBeenCalledWith('Failed to sync cart:', expect.any(Error))
    
    consoleSpy.mockRestore()
  })

  it('calculates totals correctly', async () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    await act(async () => {
      await result.current.addItem({
        productId: 'p1',
        variantId: 'v1',
        quantity: 2,
        price: 1000
      })
      await result.current.addItem({
        productId: 'p2',
        variantId: 'v2',
        quantity: 3,
        price: 500
      })
    })
    
    expect(result.current.itemCount).toBe(5) // 2 + 3
    expect(result.current.totalPrice).toBe(3500) // (2 * 1000) + (3 * 500)
  })

  it('persists cart across hook instances', async () => {
    const { result: result1 } = renderHook(() => useCart(), { wrapper })
    
    await act(async () => {
      await result1.current.addItem({
        productId: 'p1',
        variantId: 'v1',
        quantity: 1,
        price: 1000
      })
    })
    
    // Unmount first hook
    result1.current = null as any
    
    // Mount new hook instance
    const { result: result2 } = renderHook(() => useCart(), { wrapper })
    
    // Should load from localStorage
    expect(result2.current.items).toHaveLength(1)
    expect(result2.current.items[0].productId).toBe('p1')
  })
})