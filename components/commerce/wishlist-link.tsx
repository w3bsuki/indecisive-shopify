'use client'

import { useState } from 'react'
import { WishlistDrawer } from './wishlist-drawer'
import { cn } from '@/lib/utils'

interface WishlistLinkProps {
  children: React.ReactNode
  className?: string
}

export function WishlistLink({ children, className }: WishlistLinkProps) {
  const [open, setOpen] = useState(false)
  
  return (
    <>
      <div 
        onClick={() => setOpen(true)}
        className={cn("cursor-pointer", className)}
      >
        {children}
      </div>
      
      <WishlistDrawer 
        open={open} 
        onOpenChange={setOpen} 
      />
    </>
  )
}