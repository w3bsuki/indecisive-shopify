'use client'

import { useRouter } from 'next/navigation'

interface ScrollToTopLinkProps {
  children: React.ReactNode
  href: string
  className?: string
}

export function ScrollToTopLink({ children, href, className }: ScrollToTopLinkProps) {
  const router = useRouter()
  
  const handleClick = () => {
    // Navigate first (which will preserve scroll on same page)
    router.push(href)
    // Then scroll to top after a tiny delay to ensure navigation has started
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 50)
  }
  
  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  )
}