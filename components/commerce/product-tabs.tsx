'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Package, Ruler, Truck } from 'lucide-react'

interface ProductTabsProps {
  description?: string
}

export function ProductTabs({ description }: ProductTabsProps) {
  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsList>
        <TabsTrigger value="details" className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          Details
        </TabsTrigger>
        <TabsTrigger value="size" className="flex items-center gap-2">
          <Ruler className="h-4 w-4" />
          Size Guide
        </TabsTrigger>
        <TabsTrigger value="shipping" className="flex items-center gap-2">
          <Truck className="h-4 w-4" />
          Shipping
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="details" className="space-y-6">
        <div className="prose prose-sm md:prose-base max-w-none text-gray-700 leading-relaxed">
          {description ? (
            <p>{description}</p>
          ) : (
            <p className="text-gray-500">No additional details available.</p>
          )}
        </div>
        
        <div className="space-y-3">
          <h4 className="font-semibold font-mono uppercase tracking-wide text-black">Care Instructions</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 bg-black rounded-full mt-2 flex-shrink-0"></span>
              Machine wash cold with like colors
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 bg-black rounded-full mt-2 flex-shrink-0"></span>
              Do not bleach
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 bg-black rounded-full mt-2 flex-shrink-0"></span>
              Tumble dry low
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 bg-black rounded-full mt-2 flex-shrink-0"></span>
              Cool iron if needed
            </li>
          </ul>
        </div>
      </TabsContent>
      
      <TabsContent value="size" className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-semibold font-mono uppercase tracking-wide text-black">Size Chart</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-2 border-gray-200">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-mono font-medium">Size</th>
                  <th className="text-center py-3 px-4 font-mono font-medium">Head Circumference</th>
                  <th className="text-center py-3 px-4 font-mono font-medium">Fit</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium">S/M</td>
                  <td className="text-center py-3 px-4">56-58 cm</td>
                  <td className="text-center py-3 px-4">Snug</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium">L/XL</td>
                  <td className="text-center py-3 px-4">58-60 cm</td>
                  <td className="text-center py-3 px-4">Relaxed</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="text-sm text-gray-700 space-y-3">
            <h5 className="font-semibold font-mono uppercase tracking-wide text-black">How to Measure</h5>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 bg-black rounded-full mt-2 flex-shrink-0"></span>
                <span><strong>Head Circumference:</strong> Measure around your head just above your ears</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 bg-black rounded-full mt-2 flex-shrink-0"></span>
                <span><strong>Fit:</strong> Choose based on your preferred comfort level</span>
              </li>
            </ul>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="shipping" className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-semibold font-mono uppercase tracking-wide text-black">Shipping & Returns</h4>
          
          <div className="space-y-4 text-sm text-gray-700">
            <div className="space-y-2">
              <h5 className="font-medium text-black">Shipping Options</h5>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-black rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Free Standard Shipping:</strong> 5-7 business days on orders over $50</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-black rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Express Shipping:</strong> 2-3 business days ($9.99)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-black rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Overnight Shipping:</strong> Next business day ($19.99)</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h5 className="font-medium text-black">Returns & Exchanges</h5>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-black rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>30-day return window:</strong> Items must be unworn with tags attached</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-black rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Free returns:</strong> Prepaid return label included</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-black rounded-full mt-2 flex-shrink-0"></span>
                  <span><strong>Exchanges:</strong> Size exchanges processed within 2-3 business days</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}