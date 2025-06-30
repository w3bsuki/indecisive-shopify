'use client'

import { useState, useEffect, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { ShopifyProductVariant } from '@/lib/shopify/types'

interface VariantSelectorProps {
  options: Array<{ id: string; name: string; values: string[] }>
  variants: ShopifyProductVariant[]
  onVariantChange: (variant: ShopifyProductVariant | undefined) => void
}

export function VariantSelector({ options, variants, onVariantChange }: VariantSelectorProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})

  // Initialize with first available variant
  useEffect(() => {
    if (variants.length > 0) {
      const firstAvailable = variants.find(v => v.availableForSale) || variants[0]
      const initialOptions: Record<string, string> = {}
      if (firstAvailable?.selectedOptions) {
        firstAvailable.selectedOptions.forEach(opt => {
          initialOptions[opt.name] = opt.value
        })
      }
      setSelectedOptions(initialOptions)
    }
  }, [variants])

  // Find the selected variant based on current options
  const selectedVariant = useMemo(() => {
    return variants.find(variant => 
      variant.selectedOptions?.every(opt => 
        selectedOptions[opt.name] === opt.value
      )
    )
  }, [selectedOptions, variants])

  // Get available option values based on current selection
  const getAvailableValues = (optionName: string) => {
    const availableValues = new Set<string>()
    
    variants.forEach(variant => {
      // Check if variant matches all other selected options
      const matchesOtherOptions = variant.selectedOptions?.every(opt => {
        if (opt.name === optionName) return true
        return selectedOptions[opt.name] === opt.value
      }) ?? false
      
      if (matchesOtherOptions && variant.availableForSale) {
        const option = variant.selectedOptions?.find(opt => opt.name === optionName)
        if (option) availableValues.add(option.value)
      }
    })
    
    return availableValues
  }

  useEffect(() => {
    onVariantChange(selectedVariant)
  }, [selectedVariant, onVariantChange])

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [optionName]: value }))
  }

  if (options.length === 0) return null

  return (
    <div className="space-y-6">
      {options.map((option) => {
        const availableValues = getAvailableValues(option.name)
        const isColorOption = option.name.toLowerCase() === 'color'
        
        return (
          <div key={option.id} className="space-y-3">
            <Label className="text-sm font-medium">
              {option.name}
              {selectedOptions[option.name] && (
                <span className="ml-2 text-gray-600 font-normal">
                  {selectedOptions[option.name]}
                </span>
              )}
            </Label>
            
            {isColorOption ? (
              // Color swatches
              <div className="flex flex-wrap gap-2">
                {option.values.map((value) => {
                  const isAvailable = availableValues.has(value)
                  const isSelected = selectedOptions[option.name] === value
                  
                  return (
                    <button
                      key={value}
                      onClick={() => isAvailable && handleOptionChange(option.name, value)}
                      disabled={!isAvailable}
                      className={cn(
                        "relative w-10 h-10 rounded-full border-2 transition-all",
                        isSelected ? "border-black scale-110" : "border-gray-300",
                        !isAvailable && "opacity-50 cursor-not-allowed"
                      )}
                      title={value}
                    >
                      <span
                        className="absolute inset-1 rounded-full"
                        style={{
                          backgroundColor: getColorFromName(value),
                        }}
                      />
                      {!isAvailable && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="w-8 h-[1px] bg-gray-400 rotate-45 absolute" />
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            ) : (
              // Size or other options as buttons
              <RadioGroup
                value={selectedOptions[option.name]}
                onValueChange={(value) => handleOptionChange(option.name, value)}
                className="flex flex-wrap gap-2"
              >
                {option.values.map((value) => {
                  const isAvailable = availableValues.has(value)
                  
                  return (
                    <div key={value}>
                      <RadioGroupItem
                        value={value}
                        id={`${option.name}-${value}`}
                        disabled={!isAvailable}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`${option.name}-${value}`}
                        className={cn(
                          "flex items-center justify-center px-4 py-2 border-2 cursor-pointer transition-all min-w-[60px]",
                          "peer-checked:border-black peer-checked:bg-black peer-checked:text-white",
                          "hover:border-gray-400",
                          !isAvailable && "opacity-50 cursor-not-allowed line-through"
                        )}
                      >
                        {value}
                      </Label>
                    </div>
                  )
                })}
              </RadioGroup>
            )}
          </div>
        )
      })}
      
      {selectedVariant && !selectedVariant.availableForSale && (
        <p className="text-sm text-red-600">This variant is currently out of stock</p>
      )}
    </div>
  )
}

// Helper function to map color names to actual colors
function getColorFromName(colorName: string): string {
  const colorMap: Record<string, string> = {
    'Black': '#000000',
    'White': '#FFFFFF',
    'Red': '#EF4444',
    'Blue': '#3B82F6',
    'Green': '#10B981',
    'Yellow': '#F59E0B',
    'Purple': '#8B5CF6',
    'Pink': '#EC4899',
    'Gray': '#6B7280',
    'Grey': '#6B7280',
    'Brown': '#92400E',
    'Navy': '#1E3A8A',
    'Beige': '#F5E6D3',
    'Orange': '#F97316',
  }
  
  return colorMap[colorName] || '#E5E7EB' // Default to light gray
}