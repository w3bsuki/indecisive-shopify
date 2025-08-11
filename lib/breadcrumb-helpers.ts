export interface BreadcrumbItem {
  label: string
  href: string
  current?: boolean
}

// Helper functions to generate breadcrumbs for common page types
export const BreadcrumbHelpers = {
  // For product pages: Home → Collections → Category → Product
  product: (productTitle: string, category?: string, collection?: string, translations?: { home: string; products: string }): BreadcrumbItem[] => [
    { label: translations?.home || 'Home', href: '/' },
    { label: translations?.products || 'Products', href: '/products' },
    ...(collection ? [{ label: collection, href: `/collections/${collection.toLowerCase().replace(/\s+/g, '-')}` }] : []),
    ...(category && category !== collection ? [{ label: category, href: `/collections/${category.toLowerCase().replace(/\s+/g, '-')}` }] : []),
    { label: productTitle, href: '#', current: true }
  ],

  // For collection pages: Home → Collections → Category
  collection: (collectionName: string): BreadcrumbItem[] => [
    { label: 'Home', href: '/' },
    { label: 'Collections', href: '/products' },
    { label: collectionName, href: '#', current: true }
  ],

  // For search results: Home → Products → Search Results
  search: (query?: string): BreadcrumbItem[] => [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: query ? `Search: "${query}"` : 'Search Results', href: '#', current: true }
  ],

  // For account pages: Home → Account → Section
  account: (section?: string): BreadcrumbItem[] => [
    { label: 'Home', href: '/' },
    { label: 'My Account', href: '/account' },
    ...(section ? [{ label: section, href: '#', current: true }] : [])
  ],

  // For cart/checkout: Home → Shopping Cart / Checkout
  checkout: (step: 'cart' | 'checkout' | 'confirmation' = 'cart'): BreadcrumbItem[] => {
    const steps = [
      { label: 'Home', href: '/' },
      { label: 'Shopping Cart', href: '/cart', current: step === 'cart' },
      { label: 'Checkout', href: '/checkout', current: step === 'checkout' },
      { label: 'Order Confirmation', href: '#', current: step === 'confirmation' }
    ]
    
    return steps.filter(item => {
      if (step === 'cart') return item.href !== '/checkout' && item.href !== '#'
      if (step === 'checkout') return item.href !== '#'
      return true
    })
  },

  // For static pages: Home → Page
  page: (pageTitle: string, parentPage?: { title: string; href: string }): BreadcrumbItem[] => [
    { label: 'Home', href: '/' },
    ...(parentPage ? [{ label: parentPage.title, href: parentPage.href }] : []),
    { label: pageTitle, href: '#', current: true }
  ]
}