'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useTranslations } from 'next-intl'
import { ProductFiltersContent } from '@/components/commerce/product-filters-content'

interface FilterDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FilterDrawer({ open, onOpenChange }: FilterDrawerProps) {
  const t = useTranslations('filters')
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh] rounded-t-2xl">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-center font-mono tracking-wider">{t('title')}</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto h-[calc(100%-80px)] pb-20 px-4">
          <ProductFiltersContent />
        </div>
      </SheetContent>
    </Sheet>
  )
}