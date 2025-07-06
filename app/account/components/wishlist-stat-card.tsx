'use client'

import { Heart } from 'lucide-react'

export function WishlistStatCard() {
  return (
    <div className="group cursor-pointer" onClick={() => {
      const event = new CustomEvent('open-wishlist')
      window.dispatchEvent(event)
    }}>
      <div className="bg-white border-2 border-black p-6 hover:bg-black hover:text-white transition-all relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gray-100 -mr-10 -mt-10 group-hover:bg-gray-900" />
        <div className="relative">
          <Heart className="h-8 w-8 mb-3" />
          <p className="font-bold text-2xl mb-1">0</p>
          <p className="text-sm uppercase tracking-wider">Wishlist</p>
        </div>
      </div>
    </div>
  )
}