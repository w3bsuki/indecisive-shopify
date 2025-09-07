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
      <SheetContent side="bottom" className="h-auto max-h-[80vh] rounded-t-3xl">
        {/* Modern handle bar */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-gray-300 rounded-full" />
        
        <SheetHeader className="mb-6 pt-2">
          <SheetTitle className="text-xl font-semibold">{t('title')}</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-1 pb-safe overflow-y-auto max-h-[calc(80vh-120px)]">
          <ProductFiltersContent />
        </div>
      </SheetContent>
    </Sheet>
  )
}