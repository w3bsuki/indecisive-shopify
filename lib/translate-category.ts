// Map Shopify tags to translation keys
const categoryMap: Record<string, string> = {
  'hat': 'hats',
  'hats': 'hats',
  'cap': 'hats',
  'caps': 'hats',
  'tshirt': 'tshirts',
  'tshirts': 'tshirts',
  't-shirt': 'tshirts',
  't-shirts': 'tshirts',
  'hoodie': 'hoodies',
  'hoodies': 'hoodies',
  'sweatshirt': 'hoodies',
  'jacket': 'jackets',
  'jackets': 'jackets',
  'pants': 'pants',
  'trousers': 'pants',
  'accessories': 'accessories',
  'accessory': 'accessories',
  'bag': 'bags',
  'bags': 'bags'
}

export function getCategoryTranslationKey(tag: string): string {
  const normalized = tag.toLowerCase().trim()
  return categoryMap[normalized] || normalized
}