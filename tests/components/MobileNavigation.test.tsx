import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MobileNavigation } from '@/components/layout/mobile-navigation'
import { useMobile } from '@/hooks/use-mobile'

// Mock the mobile detection hook
jest.mock('@/hooks/use-mobile', () => ({
  useMobile: jest.fn(),
}))

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>
})

describe('MobileNavigation', () => {
  beforeEach(() => {
    // Default to mobile view
    (useMobile as jest.Mock).mockReturnValue(true)
  })

  it('renders mobile navigation on mobile devices', () => {
    render(<MobileNavigation />)
    
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByLabelText(/menu/i)).toBeInTheDocument()
  })

  it('does not render on desktop', () => {
    (useMobile as jest.Mock).mockReturnValue(false)
    
    const { container } = render(<MobileNavigation />)
    expect(container.firstChild).toBeNull()
  })

  it('opens and closes menu sheet', async () => {
    render(<MobileNavigation />)
    
    const menuButton = screen.getByLabelText(/menu/i)
    
    // Open menu
    fireEvent.click(menuButton)
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
    
    // Close menu
    const closeButton = screen.getByLabelText(/close/i)
    fireEvent.click(closeButton)
    
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('navigates to different pages', async () => {
    render(<MobileNavigation />)
    
    // Open menu
    fireEvent.click(screen.getByLabelText(/menu/i))
    
    await waitFor(() => {
      expect(screen.getByText('Shop')).toBeInTheDocument()
      expect(screen.getByText('New Arrivals')).toBeInTheDocument()
      expect(screen.getByText('Categories')).toBeInTheDocument()
      expect(screen.getByText('About')).toBeInTheDocument()
    })
    
    // Check links
    const shopLink = screen.getByText('Shop').closest('a')
    expect(shopLink).toHaveAttribute('href', '/shop')
  })

  it('shows cart icon with item count', () => {
    render(<MobileNavigation />)
    
    const cartButton = screen.getByLabelText(/cart/i)
    expect(cartButton).toBeInTheDocument()
    
    // Should show cart count if items present
    const cartCount = screen.queryByTestId('cart-count')
    if (cartCount) {
      expect(cartCount).toHaveTextContent(/\d+/)
    }
  })

  it('has search functionality', async () => {
    render(<MobileNavigation />)
    
    const searchButton = screen.getByLabelText(/search/i)
    fireEvent.click(searchButton)
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
    })
    
    // Type in search
    const searchInput = screen.getByPlaceholderText(/search/i)
    fireEvent.change(searchInput, { target: { value: 'dress' } })
    
    // Submit search
    fireEvent.keyPress(searchInput, { key: 'Enter', code: 13 })
    
    // Would navigate to search results
  })

  it('has proper touch target sizes', () => {
    render(<MobileNavigation />)
    
    const buttons = screen.getAllByRole('button')
    
    buttons.forEach(button => {
      const styles = window.getComputedStyle(button)
      const height = parseInt(styles.height)
      const width = parseInt(styles.width)
      
      // Touch targets should be at least 44x44px
      expect(height).toBeGreaterThanOrEqual(44)
      expect(width).toBeGreaterThanOrEqual(44)
    })
  })

  it('handles user account menu', async () => {
    render(<MobileNavigation />)
    
    const accountButton = screen.getByLabelText(/account/i)
    fireEvent.click(accountButton)
    
    await waitFor(() => {
      expect(screen.getByText(/sign in/i)).toBeInTheDocument()
      expect(screen.getByText(/create account/i)).toBeInTheDocument()
    })
  })

  it('shows categories in menu', async () => {
    render(<MobileNavigation />)
    
    // Open menu
    fireEvent.click(screen.getByLabelText(/menu/i))
    
    await waitFor(() => {
      expect(screen.getByText('Categories')).toBeInTheDocument()
    })
    
    // Expand categories
    fireEvent.click(screen.getByText('Categories'))
    
    await waitFor(() => {
      expect(screen.getByText('Women')).toBeInTheDocument()
      expect(screen.getByText('Men')).toBeInTheDocument()
      expect(screen.getByText('Accessories')).toBeInTheDocument()
    })
  })

  it('maintains focus management', async () => {
    render(<MobileNavigation />)
    
    const menuButton = screen.getByLabelText(/menu/i)
    menuButton.focus()
    expect(document.activeElement).toBe(menuButton)
    
    // Open menu
    fireEvent.click(menuButton)
    
    await waitFor(() => {
      // Focus should move to menu
      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeInTheDocument()
    })
  })

  it('handles swipe gestures', async () => {
    render(<MobileNavigation />)
    
    const nav = screen.getByRole('navigation')
    
    // Simulate swipe
    fireEvent.touchStart(nav, {
      touches: [{ clientX: 300, clientY: 100 }],
    })
    
    fireEvent.touchMove(nav, {
      touches: [{ clientX: 50, clientY: 100 }],
    })
    
    fireEvent.touchEnd(nav)
    
    // Menu should open on swipe
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeInTheDocument()
    })
  })

  it('shows active page indicator', () => {
    // Mock current pathname
    jest.mock('next/navigation', () => ({
      ...jest.requireActual('next/navigation'),
      usePathname: () => '/shop',
    }))
    
    render(<MobileNavigation />)
    
    fireEvent.click(screen.getByLabelText(/menu/i))
    
    waitFor(() => {
      const shopLink = screen.getByText('Shop')
      expect(shopLink).toHaveClass('font-bold') // Or whatever active class
    })
  })

  it('is accessible with screen readers', () => {
    render(<MobileNavigation />)
    
    // Check ARIA labels
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label')
    expect(screen.getByLabelText(/menu/i)).toHaveAttribute('aria-expanded', 'false')
    
    // Open menu
    fireEvent.click(screen.getByLabelText(/menu/i))
    
    waitFor(() => {
      expect(screen.getByLabelText(/menu/i)).toHaveAttribute('aria-expanded', 'true')
    })
  })
})