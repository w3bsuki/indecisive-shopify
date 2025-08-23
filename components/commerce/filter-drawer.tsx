'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useTranslations } from 'next-intl'
import { ProductFiltersContent } from '@/components/commerce/product-filters-content'

interface FilterDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FilterDrawer({ open, onOpenChange }: FilterDrawerProps) {
  const t = useTranslations('products.filters')
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-[28px] bg-white border-t-0">
        {/* Modern handle bar */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-gray-300 rounded-full" />
        
        <SheetHeader className="mb-6 pt-2">
          <SheetTitle className="text-xl font-bold font-mono tracking-tight text-black">{t('title')}</SheetTitle>
        </SheetHeader>
        
        <div className="overflow-y-auto h-[calc(100%-100px)] pb-24 px-2">
          <ProductFiltersContent />
        </div>
      </SheetContent>
    </Sheet>
  )
}