'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Shirt, HardHat, ShoppingBag, Type, Image as ImageIcon, Palette, Package, ChevronRight } from 'lucide-react'
import { useCart } from '@/hooks/use-cart'
import { useToast } from '@/hooks/use-toast'
import { storefront } from '@/lib/shopify'

type ProductType = 'tshirt' | 'hat' | 'bag'
type CustomizationType = 'text' | 'image' | 'both'

interface CustomProduct {
  type: ProductType
  color: string
  material: string
  customization: CustomizationType
  text?: string
  textPosition?: string
  textColor?: string
  imageUrl?: string
  imagePosition?: string
  size?: string
}

const productOptions = {
  tshirt: {
    colors: ['black', 'white', 'gray', 'navy', 'red'],
    materials: ['cotton', 'organic-cotton', 'polyester-blend'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    positions: ['chest-center', 'chest-left', 'back-center', 'sleeve']
  },
  hat: {
    colors: ['black', 'white', 'beige', 'navy', 'green'],
    materials: ['cotton', 'wool-blend', 'polyester'],
    sizes: ['one-size'],
    positions: ['front-center', 'side', 'back']
  },
  bag: {
    colors: ['natural', 'black', 'navy', 'olive'],
    materials: ['canvas', 'organic-cotton', 'recycled-polyester'],
    sizes: ['standard', 'large'],
    positions: ['center', 'bottom-corner', 'full-print']
  }
}

const textColors = ['black', 'white', 'red', 'blue', 'gold']

export function CustomProductConfigurator() {
  const t = useTranslations('custom')
  const { addItem } = useCart()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  
  const [product, setProduct] = useState<CustomProduct>({
    type: 'tshirt',
    color: 'black',
    material: 'cotton',
    customization: 'text',
    text: '',
    textPosition: 'chest-center',
    textColor: 'white',
    size: 'M'
  })

  const selectedProductOptions = productOptions[product.type]

  const handleAddToCart = async () => {
    if (product.customization === 'text' && !product.text) {
      toast({
        title: t('error.noText', { fallback: 'Please add your custom text' }),
        variant: 'destructive'
      })
      return
    }

    setIsLoading(true)
    
    try {
      // Map product type to Shopify variant IDs
      // These need to be actual variant IDs from your Shopify store
      const variantMap: Record<string, string> = {
        'tshirt-black': 'gid://shopify/ProductVariant/YOUR_TSHIRT_BLACK_VARIANT_ID',
        'tshirt-white': 'gid://shopify/ProductVariant/YOUR_TSHIRT_WHITE_VARIANT_ID',
        'hat-black': 'gid://shopify/ProductVariant/YOUR_HAT_BLACK_VARIANT_ID',
        'hat-white': 'gid://shopify/ProductVariant/YOUR_HAT_WHITE_VARIANT_ID',
        'bag-natural': 'gid://shopify/ProductVariant/YOUR_BAG_NATURAL_VARIANT_ID',
        'bag-black': 'gid://shopify/ProductVariant/YOUR_BAG_BLACK_VARIANT_ID',
      }
      
      // Get the variant ID based on product type and color
      const variantKey = `${product.type}-${product.color}`
      const variantId = variantMap[variantKey]
      
      if (!variantId) {
        // For now, store in localStorage and show notice
        const customProducts = JSON.parse(localStorage.getItem('customProducts') || '[]')
        customProducts.push({
          ...product,
          id: `custom-${Date.now()}`,
          price: product.type === 'tshirt' ? '45' : product.type === 'hat' ? '40' : '35',
          createdAt: new Date().toISOString()
        })
        localStorage.setItem('customProducts', JSON.stringify(customProducts))
        
        toast({
          title: t('success.addedToCart', { fallback: 'Custom product request saved!' }),
          description: t('success.description', { fallback: 'Our team will contact you to complete your custom order' })
        })
      } else {
        // Add to cart with custom attributes
        const customAttributes = [
          { key: 'Custom Type', value: product.customization },
          { key: 'Material', value: product.material },
          ...(product.text ? [{ key: 'Custom Text', value: product.text }] : []),
          ...(product.textColor ? [{ key: 'Text Color', value: product.textColor }] : []),
          ...(product.textPosition ? [{ key: 'Text Position', value: product.textPosition }] : []),
          ...(product.size ? [{ key: 'Size', value: product.size }] : []),
        ]
        
        // Add to cart with custom attributes
        await addItem(variantId, 1, customAttributes)
        
        toast({
          title: t('success.addedToCart', { fallback: 'Custom product added to cart!' }),
          description: t('success.description', { fallback: 'You can add special instructions at checkout' })
        })
      }
      
      // Reset form
      setProduct({
        type: 'tshirt',
        color: 'black',
        material: 'cotton',
        customization: 'text',
        text: '',
        textPosition: 'chest-center',
        textColor: 'white',
        size: 'M'
      })
    } catch (error) {
      toast({
        title: t('error.failed', { fallback: 'Failed to add custom product' }),
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Product Preview - Mobile First */}
      <div className="order-1">
        <div className="lg:sticky lg:top-24 bg-white border border-gray-200 rounded-3xl p-6 lg:p-8">
          <div className="aspect-square bg-gray-50 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden">
            <div className="relative w-48 h-48 lg:w-64 lg:h-64">
              {/* Product Icon with color fill */}
              {product.type === 'tshirt' && (
                <Shirt 
                  className="w-full h-full transition-colors duration-300" 
                  strokeWidth={1}
                  style={{ 
                    fill: product.color === 'white' ? '#f5f5f5' : product.color,
                    stroke: product.color === 'white' ? '#e5e5e5' : '#000'
                  }}
                />
              )}
              {product.type === 'hat' && (
                <HardHat 
                  className="w-full h-full transition-colors duration-300" 
                  strokeWidth={1}
                  style={{ 
                    fill: product.color === 'white' ? '#f5f5f5' : product.color,
                    stroke: product.color === 'white' ? '#e5e5e5' : '#000'
                  }}
                />
              )}
              {product.type === 'bag' && (
                <ShoppingBag 
                  className="w-full h-full transition-colors duration-300" 
                  strokeWidth={1}
                  style={{ 
                    fill: product.color === 'natural' ? '#F5F5DC' : product.color === 'white' ? '#f5f5f5' : product.color,
                    stroke: product.color === 'white' || product.color === 'natural' ? '#e5e5e5' : '#000'
                  }}
                />
              )}
              
              {/* Custom Text Preview */}
              {product.customization !== 'image' && product.text && (
                <div 
                  className={cn(
                    "absolute inset-0 flex items-center justify-center p-4",
                    product.textPosition?.includes('back') && "opacity-50"
                  )}
                >
                  <p 
                    className={cn(
                      "font-bold text-lg lg:text-xl max-w-[80%] text-center break-words",
                      `text-${product.textColor}`
                    )}
                    style={{ color: product.textColor }}
                  >
                    {product.text}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Product Details - Clean Grid */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{t('preview.color')}</p>
              <p className="font-semibold capitalize">{product.color}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{t('preview.material')}</p>
              <p className="font-semibold capitalize">{product.material.replace('-', ' ')}</p>
            </div>
            {product.size && (
              <div className="text-center">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{t('preview.size')}</p>
                <p className="font-semibold">{product.size}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Configuration Form - Mobile Optimized */}
      <div className="order-2 space-y-6">
        {/* Product Type Selection - Modern Pills */}
        <div>
          <Label className="text-sm font-medium uppercase tracking-wider text-gray-600 mb-3 block">{t('form.productType')}</Label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setProduct({...product, type: 'tshirt'})}
              className={cn(
                "relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
                product.type === 'tshirt' 
                  ? "border-black bg-black text-white" 
                  : "border-gray-200 hover:border-gray-300 bg-white"
              )}
            >
              <Shirt className="w-6 h-6" />
              <span className="text-xs font-medium">{t('products.tshirt')}</span>
            </button>
            <button
              onClick={() => setProduct({...product, type: 'hat'})}
              className={cn(
                "relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
                product.type === 'hat' 
                  ? "border-black bg-black text-white" 
                  : "border-gray-200 hover:border-gray-300 bg-white"
              )}
            >
              <HardHat className="w-6 h-6" />
              <span className="text-xs font-medium">{t('products.hat')}</span>
            </button>
            <button
              onClick={() => setProduct({...product, type: 'bag'})}
              className={cn(
                "relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
                product.type === 'bag' 
                  ? "border-black bg-black text-white" 
                  : "border-gray-200 hover:border-gray-300 bg-white"
              )}
            >
              <ShoppingBag className="w-6 h-6" />
              <span className="text-xs font-medium">{t('products.bag')}</span>
            </button>
          </div>
        </div>

        {/* Color Selection - Clean Grid */}
        <div>
          <Label className="text-sm font-medium uppercase tracking-wider text-gray-600 mb-3 block">{t('form.color')}</Label>
          <div className="flex gap-2 flex-wrap">
            {selectedProductOptions.colors.map((color) => (
              <button
                key={color}
                onClick={() => setProduct({...product, color})}
                className={cn(
                  "w-10 h-10 rounded-full border-2 transition-all",
                  product.color === color ? "ring-2 ring-offset-2 ring-black scale-110" : "hover:scale-105"
                )}
                style={{ 
                  backgroundColor: color === 'natural' ? '#F5F5DC' : color,
                  borderColor: color === 'white' || color === 'natural' ? '#e5e5e5' : color
                }}
                aria-label={color}
              />
            ))}
          </div>
        </div>

        {/* Material Selection - Modern Buttons */}
        <div>
          <Label className="text-sm font-medium uppercase tracking-wider text-gray-600 mb-3 block">{t('form.material')}</Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {selectedProductOptions.materials.map((material) => (
              <button
                key={material}
                onClick={() => setProduct({...product, material})}
                className={cn(
                  "px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all",
                  product.material === material 
                    ? "border-black bg-black text-white" 
                    : "border-gray-200 hover:border-gray-300 bg-white"
                )}
              >
                {material.replace('-', ' ').charAt(0).toUpperCase() + material.replace('-', ' ').slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Size Selection - Compact Grid */}
        {selectedProductOptions.sizes.length > 1 && (
          <div>
            <Label className="text-sm font-medium uppercase tracking-wider text-gray-600 mb-3 block">{t('form.size')}</Label>
            <div className="grid grid-cols-6 gap-2">
              {selectedProductOptions.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setProduct({...product, size})}
                  className={cn(
                    "py-3 rounded-xl border-2 text-sm font-medium transition-all",
                    product.size === size 
                      ? "border-black bg-black text-white" 
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Customization Type - Clean Tabs */}
        <div>
          <Label className="text-sm font-medium uppercase tracking-wider text-gray-600 mb-3 block">{t('form.customizationType')}</Label>
          <Tabs value={product.customization} onValueChange={(value) => setProduct({...product, customization: value as CustomizationType})}>
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-xl">
              <TabsTrigger value="text" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg gap-2">
                <Type className="w-4 h-4" />
                <span className="hidden sm:inline">{t('customization.text')}</span>
              </TabsTrigger>
              <TabsTrigger value="image" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg gap-2">
                <ImageIcon className="w-4 h-4" />
                <span className="hidden sm:inline">{t('customization.image')}</span>
              </TabsTrigger>
              <TabsTrigger value="both" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg gap-2">
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">{t('customization.both')}</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="mt-6 space-y-4">
              <div>
                <Label htmlFor="customText" className="text-sm font-medium mb-2 block">{t('form.customText')}</Label>
                <Input
                  id="customText"
                  value={product.text}
                  onChange={(e) => setProduct({...product, text: e.target.value})}
                  placeholder={t('form.textPlaceholder')}
                  maxLength={50}
                  className="h-12 rounded-xl border-gray-200 focus:border-black"
                />
                <p className="text-xs text-gray-500 mt-1 text-right">{product.text?.length || 0}/50</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Text Color */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">{t('form.textColor')}</Label>
                  <div className="flex gap-2">
                    {textColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setProduct({...product, textColor: color})}
                        className={cn(
                          "w-8 h-8 rounded-full border-2 transition-all",
                          product.textColor === color ? "ring-2 ring-offset-2 ring-black scale-110" : "hover:scale-105"
                        )}
                        style={{ 
                          backgroundColor: color === 'gold' ? '#FFD700' : color,
                          borderColor: color === 'white' ? '#e5e5e5' : color
                        }}
                        aria-label={color}
                      />
                    ))}
                  </div>
                </div>

                {/* Position */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">{t('form.position')}</Label>
                  <select
                    value={product.textPosition}
                    onChange={(e) => setProduct({...product, textPosition: e.target.value})}
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-black"
                  >
                    {selectedProductOptions.positions.map((position) => (
                      <option key={position} value={position}>
                        {position.replace('-', ' ').charAt(0).toUpperCase() + position.replace('-', ' ').slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="image" className="mt-6">
              <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-2xl hover:border-gray-300 transition-colors cursor-pointer">
                <ImageIcon className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                <p className="text-sm text-gray-600 mb-3">{t('form.uploadInstruction')}</p>
                <Button variant="outline" size="sm" className="rounded-full">
                  {t('form.uploadButton')}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="both" className="mt-6 text-center p-8 bg-gray-50 rounded-2xl">
              <p className="text-gray-600">{t('form.contactForBoth')}</p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Pricing Info - Compact Card */}
        <div className="bg-black text-white rounded-2xl p-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">{t('pricing.basePrice')}</span>
              <span className="font-semibold">
                {product.type === 'tshirt' && '35 лв'}
                {product.type === 'hat' && '30 лв'}
                {product.type === 'bag' && '25 лв'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">{t('pricing.customization')}</span>
              <span className="font-semibold">+10 лв</span>
            </div>
            <div className="border-t border-white/20 pt-3 flex justify-between items-center">
              <span className="text-lg font-bold">{t('pricing.total')}</span>
              <span className="text-2xl font-bold">
                {product.type === 'tshirt' && '45 лв'}
                {product.type === 'hat' && '40 лв'}
                {product.type === 'bag' && '35 лв'}
              </span>
            </div>
          </div>
        </div>

        {/* Add to Cart Button - Modern Style */}
        <Button
          size="lg"
          className="w-full h-14 rounded-full bg-black hover:bg-gray-900 text-white font-medium text-base"
          onClick={handleAddToCart}
          disabled={isLoading || (product.customization === 'text' && !product.text)}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {t('form.adding')}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              {t('form.addToCart')}
              <ChevronRight className="w-4 h-4" />
            </span>
          )}
        </Button>

        {/* Info - Subtle */}
        <div className="space-y-2">
          <p className="text-xs text-gray-500 text-center">
            {t('info.productionTime')}
          </p>
          {/* Note about limitations */}
          <p className="text-xs text-gray-400 text-center">
            Preview is for reference only. Final product may vary.
          </p>
        </div>
      </div>
    </div>
  )
}