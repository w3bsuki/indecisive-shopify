'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Package, Ruler, Truck } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ShippingCalculator } from '@/components/checkout/shipping-calculator'

interface ProductTabsProps {
  description?: string
}

export function ProductTabs({ description }: ProductTabsProps) {
  const t = useTranslations('products')
  const tc = useTranslations('common')
  
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
        <div className="prose prose-sm md:prose-base max-w-none text-gray-700 leading-relaxed text-product-description">
          {description ? (
            <p>{description}</p>
          ) : (
            <p className="text-gray-500">No additional details available.</p>
          )}
        </div>
        
        <div className="space-y-3">
          <h4 className="font-semibold font-mono uppercase tracking-wide text-black">{t('careInstructions')}</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 bg-black rounded-full mt-2 flex-shrink-0"></span>
              {t('care.machineWash')}
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 bg-black rounded-full mt-2 flex-shrink-0"></span>
              {t('care.noBleach')}
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 bg-black rounded-full mt-2 flex-shrink-0"></span>
              {t('care.tumbleDry')}
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1 h-1 bg-black rounded-full mt-2 flex-shrink-0"></span>
              {t('care.coolIron')}
            </li>
          </ul>
        </div>
      </TabsContent>
      
      <TabsContent value="size" className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-semibold font-mono uppercase tracking-wide text-black">{t('sizeGuide')}</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-2 border-gray-200">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-mono font-medium">{tc('size')}</th>
                  <th className="text-center py-3 px-4 font-mono font-medium">{t('size.headCircumference')}</th>
                  <th className="text-center py-3 px-4 font-mono font-medium">{t('size.fit')}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium">S/M</td>
                  <td className="text-center py-3 px-4">56-58 cm</td>
                  <td className="text-center py-3 px-4">{t('size.snug')}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium">L/XL</td>
                  <td className="text-center py-3 px-4">58-60 cm</td>
                  <td className="text-center py-3 px-4">{t('size.relaxed')}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="text-sm text-gray-700 space-y-3">
            <h5 className="font-semibold font-mono uppercase tracking-wide text-black">{t('size.howToMeasure')}</h5>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 bg-black rounded-full mt-2 flex-shrink-0"></span>
                <span>{t('size.headMeasurement')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 bg-black rounded-full mt-2 flex-shrink-0"></span>
                <span>{t('size.fitPreference')}</span>
              </li>
            </ul>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="shipping" className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-semibold font-mono uppercase tracking-wide text-black">{t('shippingReturns')}</h4>
          
          <div className="space-y-4 text-sm text-gray-700">
            <div className="space-y-2">
              <h5 className="font-medium text-black">{t('shipping.deliveryPartners')}</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-2 border-black p-4">
                  <h6 className="font-semibold mb-2">Econt Express</h6>
                  <ul className="space-y-1 text-xs">
                    <li>• Nationwide coverage in Bulgaria</li>
                    <li>• Home delivery & office pickup</li>
                    <li>• 1-2 business days delivery</li>
                    <li>• Real-time tracking</li>
                  </ul>
                </div>
                <div className="border-2 border-black p-4">
                  <h6 className="font-semibold mb-2">Speedy</h6>
                  <ul className="space-y-1 text-xs">
                    <li>• Express delivery service</li>
                    <li>• Home delivery & office pickup</li>
                    <li>• 1-2 business days delivery</li>
                    <li>• SMS notifications</li>
                  </ul>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                * Office pickup available with 20% discount on shipping
              </p>
            </div>
            
            <div className="space-y-2">
              <h5 className="font-medium text-black">{t('shipping.returnsExchanges')}</h5>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-black rounded-full mt-2 flex-shrink-0"></span>
                  <span>{t('shipping.returnWindow')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-black rounded-full mt-2 flex-shrink-0"></span>
                  <span>{t('shipping.freeReturns')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-black rounded-full mt-2 flex-shrink-0"></span>
                  <span>{t('shipping.exchanges')}</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Shipping Calculator */}
          <div className="border-t pt-6">
            <ShippingCalculator weight={0.3} />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}