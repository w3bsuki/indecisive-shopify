'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Palette, Shirt, Ruler, Type, Package } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface CustomBottomNavProps {
  onSectionClick: (section: 'product' | 'color' | 'material' | 'size' | 'text') => void
  onOrderClick: () => void
  activeSection?: string
  isLoading?: boolean
  canOrder?: boolean
}

export function CustomBottomNav({ onSectionClick, onOrderClick, activeSection, isLoading, canOrder }: CustomBottomNavProps) {
  const t = useTranslations('custom.form')
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-black/10 z-40 md:hidden shadow-lg">
      <div className="flex items-center gap-2 py-2 px-2 pb-safe">
        {/* Section Navigation - 4 buttons */}
        <div className="flex-1 grid grid-cols-4 gap-0.5">
          {/* Product Type */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSectionClick('product')}
            className={cn(
              "flex flex-col items-center gap-0.5 h-auto py-1.5 px-1 min-h-[48px] rounded-lg",
              activeSection === 'product' ? "text-black bg-gray-100" : "text-gray-600 hover:text-black hover:bg-gray-50"
            )}
          >
            <Package className="h-4 w-4 stroke-[2.5]" />
            <span className="text-[9px] font-medium">PRODUCT</span>
          </Button>

          {/* Color */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSectionClick('color')}
            className={cn(
              "flex flex-col items-center gap-0.5 h-auto py-1.5 px-1 min-h-[48px] rounded-lg",
              activeSection === 'color' ? "text-black bg-gray-100" : "text-gray-600 hover:text-black hover:bg-gray-50"
            )}
          >
            <Palette className="h-4 w-4 stroke-[2.5]" />
            <span className="text-[9px] font-medium">COLOR</span>
          </Button>

          {/* Material & Size */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSectionClick('material')}
            className={cn(
              "flex flex-col items-center gap-0.5 h-auto py-1.5 px-1 min-h-[48px] rounded-lg",
              activeSection === 'material' || activeSection === 'size' ? "text-black bg-gray-100" : "text-gray-600 hover:text-black hover:bg-gray-50"
            )}
          >
            <Ruler className="h-4 w-4 stroke-[2.5]" />
            <span className="text-[9px] font-medium">OPTIONS</span>
          </Button>

          {/* Text */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSectionClick('text')}
            className={cn(
              "flex flex-col items-center gap-0.5 h-auto py-1.5 px-1 min-h-[48px] rounded-lg",
              activeSection === 'text' ? "text-black bg-gray-100" : "text-gray-600 hover:text-black hover:bg-gray-50"
            )}
          >
            <Type className="h-4 w-4 stroke-[2.5]" />
            <span className="text-[9px] font-medium">TEXT</span>
          </Button>
        </div>

        {/* Order Button - CTA */}
        <Button
          onClick={onOrderClick}
          disabled={isLoading || !canOrder}
          className="h-[48px] px-6 bg-black hover:bg-gray-900 text-white rounded-full font-medium text-sm disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'ORDER'
          )}
        </Button>
      </div>
    </div>
  )
}