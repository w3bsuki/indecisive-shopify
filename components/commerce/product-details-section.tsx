'use client'

import { useState } from 'react'
import { ChevronDown, Package, Sparkles, Ruler } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { ShopifyProduct } from '@/lib/shopify/types'

interface ProductDetailsSectionProps {
  product: ShopifyProduct
  description?: string
}

export function ProductDetailsSection({ product, description }: ProductDetailsSectionProps) {
  const [openSizeGuide, setOpenSizeGuide] = useState(false)
  
  // Extract metafields by key
  const getMetafieldValue = (namespace: string, key: string) => {
    const metafield = product.metafields?.find(
      (mf) => mf && mf.namespace === namespace && mf.key === key
    )
    return metafield?.value
  }

  const materials = getMetafieldValue('custom', 'materials')
  const careInstructions = getMetafieldValue('custom', 'care_instructions')
  const fitGuide = getMetafieldValue('custom', 'fit_guide')
  const sizeChart = getMetafieldValue('custom', 'size_chart')

  // Parse size chart if it's JSON
  let sizeChartData = null
  if (sizeChart) {
    try {
      sizeChartData = JSON.parse(sizeChart)
    } catch (_e) {
      // If not JSON, treat as plain text
    }
  }

  return (
    <>
      <div className="mt-8 space-y-4">
        {/* Materials & Fabric */}
        {materials && (
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer py-4 border-t">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span className="font-medium">Materials & Fabric</span>
              </div>
              <ChevronDown className="h-5 w-5 text-gray-400 group-open:rotate-180 transition-transform" />
            </summary>
            <div className="pb-6 text-sm md:text-base text-gray-700 leading-relaxed">
              {materials}
            </div>
          </details>
        )}

        {/* Description */}
        {description && (
          <details className="group" open>
            <summary className="flex items-center justify-between cursor-pointer py-4 border-t">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span className="font-medium">Product Details</span>
              </div>
              <ChevronDown className="h-5 w-5 text-gray-400 group-open:rotate-180 transition-transform" />
            </summary>
            <div className="pb-6 text-sm md:text-base text-gray-700 leading-relaxed">
              <div className="prose prose-sm md:prose-base max-w-none">
                {description}
              </div>
            </div>
          </details>
        )}

        {/* Fit Guide & Size Chart */}
        {(fitGuide || sizeChart) && (
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer py-4 border-t">
              <div className="flex items-center gap-2">
                <Ruler className="h-4 w-4" />
                <span className="font-medium">Fit & Sizing</span>
              </div>
              <ChevronDown className="h-5 w-5 text-gray-400 group-open:rotate-180 transition-transform" />
            </summary>
            <div className="pb-6 text-sm md:text-base text-gray-700 leading-relaxed space-y-4">
              {fitGuide && (
                <div>
                  <h4 className="font-medium mb-2">Fit Guide</h4>
                  <p>{fitGuide}</p>
                </div>
              )}
              
              {sizeChart && (
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOpenSizeGuide(true)}
                    className="mb-4"
                  >
                    View Size Chart
                  </Button>
                </div>
              )}
            </div>
          </details>
        )}

        {/* Care Instructions */}
        {careInstructions && (
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer py-4 border-t">
              <span className="font-medium">Care Instructions</span>
              <ChevronDown className="h-5 w-5 text-gray-400 group-open:rotate-180 transition-transform" />
            </summary>
            <div className="pb-6 text-sm md:text-base text-gray-700 leading-relaxed">
              {careInstructions.split('\n').map((line, i) => (
                <p key={i} className="mb-1">• {line}</p>
              ))}
            </div>
          </details>
        )}

        {/* Shipping & Returns */}
        <details className="group">
          <summary className="flex items-center justify-between cursor-pointer py-4 border-t">
            <span className="font-medium">Shipping & Returns</span>
            <ChevronDown className="h-5 w-5 text-gray-400 group-open:rotate-180 transition-transform" />
          </summary>
          <div className="pb-6 text-sm md:text-base text-gray-700 leading-relaxed space-y-3">
            <p>• Free standard shipping on orders over €50</p>
            <p>• Express shipping available at checkout</p>
            <p>• 30-day return policy</p>
            <p>• Items must be unworn with tags attached</p>
          </div>
        </details>
      </div>

      {/* Size Guide Modal */}
      <Dialog open={openSizeGuide} onOpenChange={setOpenSizeGuide}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Size Guide - {product.title}</DialogTitle>
          </DialogHeader>
          
          <div className="mt-4">
            {sizeChartData ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      {Object.keys(sizeChartData[0] || {}).map((key) => (
                        <th key={key} className="text-left py-2 px-3 font-medium">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sizeChartData.map((row: any, i: number) => (
                      <tr key={i} className="border-b">
                        {Object.values(row).map((value: any, j: number) => (
                          <td key={j} className="py-2 px-3">
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                {sizeChart}
              </div>
            )}
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">How to Measure</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Use a flexible measuring tape</li>
                <li>• Measure over light clothing or underwear</li>
                <li>• Keep the tape snug but not tight</li>
                <li>• If between sizes, size up for comfort</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}