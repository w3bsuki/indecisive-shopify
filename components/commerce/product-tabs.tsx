'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Package, Ruler, MessageSquare } from 'lucide-react'

interface ProductTabsProps {
  description?: string
}

export function ProductTabs({ description }: ProductTabsProps) {
  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="details" className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          Details
        </TabsTrigger>
        <TabsTrigger value="size" className="flex items-center gap-2">
          <Ruler className="h-4 w-4" />
          Size Guide
        </TabsTrigger>
        <TabsTrigger value="reviews" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Reviews
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="details" className="space-y-4 pt-4">
        <div className="prose prose-sm max-w-none">
          {description ? (
            <p>{description}</p>
          ) : (
            <p className="text-gray-500">No additional details available.</p>
          )}
        </div>
        
        <div className="space-y-2 text-sm">
          <h4 className="font-semibold">Care Instructions</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>Machine wash cold with like colors</li>
            <li>Do not bleach</li>
            <li>Tumble dry low</li>
            <li>Cool iron if needed</li>
          </ul>
        </div>
      </TabsContent>
      
      <TabsContent value="size" className="pt-4">
        <div className="space-y-4">
          <h4 className="font-semibold">Size Chart</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Size</th>
                  <th className="text-center py-2">Chest (in)</th>
                  <th className="text-center py-2">Waist (in)</th>
                  <th className="text-center py-2">Length (in)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">XS</td>
                  <td className="text-center py-2">32-34</td>
                  <td className="text-center py-2">26-28</td>
                  <td className="text-center py-2">26</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">S</td>
                  <td className="text-center py-2">34-36</td>
                  <td className="text-center py-2">28-30</td>
                  <td className="text-center py-2">27</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">M</td>
                  <td className="text-center py-2">36-38</td>
                  <td className="text-center py-2">30-32</td>
                  <td className="text-center py-2">28</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">L</td>
                  <td className="text-center py-2">38-40</td>
                  <td className="text-center py-2">32-34</td>
                  <td className="text-center py-2">29</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">XL</td>
                  <td className="text-center py-2">40-42</td>
                  <td className="text-center py-2">34-36</td>
                  <td className="text-center py-2">30</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="text-sm text-gray-600">
            <p className="font-semibold mb-1">How to Measure</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Chest:</strong> Measure around the fullest part of your chest</li>
              <li><strong>Waist:</strong> Measure around your natural waistline</li>
              <li><strong>Length:</strong> Measure from the highest point of your shoulder to the hem</li>
            </ul>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="reviews" className="pt-4">
        <div className="text-center py-8 text-gray-500">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium mb-2">No reviews yet</p>
          <p className="text-sm">Be the first to review this product!</p>
        </div>
      </TabsContent>
    </Tabs>
  )
}