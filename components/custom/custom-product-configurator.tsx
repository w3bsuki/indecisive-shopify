'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Shirt, HardHat, ShoppingBag, Type, Image as ImageIcon, Palette, Package } from 'lucide-react'
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
    <div className="grid lg:grid-cols-2 gap-12">
      {/* Product Preview */}
      <div className="bg-gray-50 rounded-2xl p-8 flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <div className="relative w-64 h-64 mx-auto mb-6">
            {/* Product Icon */}
            {product.type === 'tshirt' && <Shirt className="w-full h-full" strokeWidth={1} />}
            {product.type === 'hat' && <HardHat className="w-full h-full" strokeWidth={1} />}
            {product.type === 'bag' && <ShoppingBag className="w-full h-full" strokeWidth={1} />}
            
            {/* Custom Text Preview */}
            {product.customization !== 'image' && product.text && (
              <div 
                className={cn(
                  "absolute inset-0 flex items-center justify-center",
                  product.textPosition?.includes('back') && "opacity-50"
                )}
              >
                <p 
                  className={cn(
                    "font-bold text-xl max-w-[80%] text-center",
                    `text-${product.textColor}`
                  )}
                  style={{ color: product.textColor }}
                >
                  {product.text}
                </p>
              </div>
            )}
          </div>
          
          {/* Product Details */}
          <div className="space-y-2 text-sm text-gray-600">
            <p>{t('preview.color')}: <span className="font-semibold capitalize">{product.color}</span></p>
            <p>{t('preview.material')}: <span className="font-semibold capitalize">{product.material.replace('-', ' ')}</span></p>
            {product.size && <p>{t('preview.size')}: <span className="font-semibold">{product.size}</span></p>}
          </div>
        </div>
      </div>

      {/* Configuration Form */}
      <div className="space-y-8">
        {/* Product Type Selection */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold">{t('form.productType')}</Label>
          <Tabs value={product.type} onValueChange={(value) => setProduct({...product, type: value as ProductType})}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tshirt" className="gap-2">
                <Shirt className="w-4 h-4" />
                {t('products.tshirt')}
              </TabsTrigger>
              <TabsTrigger value="hat" className="gap-2">
                <HardHat className="w-4 h-4" />
                {t('products.hat')}
              </TabsTrigger>
              <TabsTrigger value="bag" className="gap-2">
                <ShoppingBag className="w-4 h-4" />
                {t('products.bag')}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Color Selection */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold">{t('form.color')}</Label>
          <div className="flex gap-3 flex-wrap">
            {selectedProductOptions.colors.map((color) => (
              <button
                key={color}
                onClick={() => setProduct({...product, color})}
                className={cn(
                  "w-12 h-12 rounded-full border-2 transition-all",
                  product.color === color ? "ring-2 ring-offset-2 ring-black" : "hover:scale-110"
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

        {/* Material Selection */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold">{t('form.material')}</Label>
          <RadioGroup value={product.material} onValueChange={(value) => setProduct({...product, material: value})}>
            {selectedProductOptions.materials.map((material) => (
              <div key={material} className="flex items-center space-x-2">
                <RadioGroupItem value={material} id={material} />
                <Label htmlFor={material} className="capitalize cursor-pointer">
                  {material.replace('-', ' ')}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Size Selection (if applicable) */}
        {selectedProductOptions.sizes.length > 1 && (
          <div className="space-y-4">
            <Label className="text-lg font-semibold">{t('form.size')}</Label>
            <div className="flex gap-2 flex-wrap">
              {selectedProductOptions.sizes.map((size) => (
                <Button
                  key={size}
                  variant={product.size === size ? "default" : "outline"}
                  size="sm"
                  onClick={() => setProduct({...product, size})}
                  className="min-w-[60px]"
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Customization Type */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold">{t('form.customizationType')}</Label>
          <Tabs value={product.customization} onValueChange={(value) => setProduct({...product, customization: value as CustomizationType})}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="text" className="gap-2">
                <Type className="w-4 h-4" />
                {t('customization.text')}
              </TabsTrigger>
              <TabsTrigger value="image" className="gap-2">
                <ImageIcon className="w-4 h-4" />
                {t('customization.image')}
              </TabsTrigger>
              <TabsTrigger value="both" className="gap-2">
                <Package className="w-4 h-4" />
                {t('customization.both')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="space-y-4">
              <div>
                <Label htmlFor="customText">{t('form.customText')}</Label>
                <Input
                  id="customText"
                  value={product.text}
                  onChange={(e) => setProduct({...product, text: e.target.value})}
                  placeholder={t('form.textPlaceholder')}
                  maxLength={50}
                />
                <p className="text-xs text-gray-500 mt-1">{product.text?.length || 0}/50</p>
              </div>

              <div className="space-y-2">
                <Label>{t('form.textColor')}</Label>
                <div className="flex gap-3">
                  {textColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setProduct({...product, textColor: color})}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-all",
                        product.textColor === color ? "ring-2 ring-offset-2 ring-black" : "hover:scale-110"
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

              <div className="space-y-2">
                <Label>{t('form.position')}</Label>
                <RadioGroup value={product.textPosition} onValueChange={(value) => setProduct({...product, textPosition: value})}>
                  {selectedProductOptions.positions.map((position) => (
                    <div key={position} className="flex items-center space-x-2">
                      <RadioGroupItem value={position} id={position} />
                      <Label htmlFor={position} className="capitalize cursor-pointer">
                        {position.replace('-', ' ')}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </TabsContent>

            <TabsContent value="image" className="space-y-4">
              <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-sm text-gray-600 mb-4">{t('form.uploadInstruction')}</p>
                <Button variant="outline" size="sm">
                  {t('form.uploadButton')}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="both" className="text-center p-8">
              <p className="text-gray-600">{t('form.contactForBoth')}</p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Pricing Info */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold">{t('pricing.basePrice')}:</span>
            <span className="text-xl font-bold">
              {product.type === 'tshirt' && '35 лв'}
              {product.type === 'hat' && '30 лв'}
              {product.type === 'bag' && '25 лв'}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>{t('pricing.customization')}:</span>
            <span>+10 лв</span>
          </div>
          <hr className="my-4" />
          <div className="flex justify-between items-center">
            <span className="font-semibold text-lg">{t('pricing.total')}:</span>
            <span className="text-2xl font-bold">
              {product.type === 'tshirt' && '45 лв'}
              {product.type === 'hat' && '40 лв'}
              {product.type === 'bag' && '35 лв'}
            </span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          size="lg"
          className="w-full"
          onClick={handleAddToCart}
          disabled={isLoading || (product.customization === 'text' && !product.text)}
        >
          <Palette className="w-5 h-5 mr-2" />
          {isLoading ? t('form.adding') : t('form.addToCart')}
        </Button>

        {/* Info */}
        <p className="text-xs text-gray-500 text-center">
          {t('info.productionTime')}
        </p>
      </div>
    </div>
  )
}