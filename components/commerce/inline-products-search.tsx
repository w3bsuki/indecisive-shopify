'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InlineProductsSearchProps {
  className?: string
}

export function InlineProductsSearch({ className = '' }: InlineProductsSearchProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const initial = searchParams.get('q') || ''
  const [value, setValue] = useState(initial)

  // Debounce
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), 400)
    return () => clearTimeout(id)
  }, [value])

  // Push URL on debounce
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (debounced.trim()) params.set('q', debounced.trim()); else params.delete('q')
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced])

  const placeholder = useMemo(() => 'Search products…', [])

  return (
    <div className={cn('px-2 pt-2 sm:pt-3', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="search"
          inputMode="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full h-10 pl-9 pr-3 rounded-full border border-gray-100 bg-white/90 backdrop-blur text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
          aria-label="Search products"
        />
      </div>
    </div>
  )
}
