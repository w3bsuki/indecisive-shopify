import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { supabaseAdmin } from "../../../../utils/supabase/client"
import { optionalSupabaseAuth } from "../../../middlewares/supabase-auth"

// Helper to generate social share URLs
function generateShareUrl(platform: string, data: {
  productUrl: string
  productName: string
  description?: string
  imageUrl?: string
}): string {
  const { productUrl, productName, description, imageUrl } = data
  const encodedUrl = encodeURIComponent(productUrl)
  const encodedText = encodeURIComponent(`Check out ${productName} at Indecisive Wear!`)
  const encodedDescription = encodeURIComponent(description || '')

  switch (platform) {
    case 'twitter':
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`
    
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
    
    case 'pinterest':
      const encodedImage = encodeURIComponent(imageUrl || '')
      return `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImage}&description=${encodedText}`
    
    case 'whatsapp':
      return `https://wa.me/?text=${encodedText}%20${encodedUrl}`
    
    case 'email':
      const subject = encodeURIComponent(`Check out ${productName}`)
      const body = encodeURIComponent(`I found this great product at Indecisive Wear:\n\n${productName}\n${description || ''}\n\n${productUrl}`)
      return `mailto:?subject=${subject}&body=${body}`
    
    default:
      return productUrl
  }
}

// POST /store/social/share - Track social share
export const POST = [
  optionalSupabaseAuth,
  async (req: MedusaRequest, res: MedusaResponse) => {
    try {
      const { product_id, platform } = req.body as any

      if (!product_id || !platform) {
        return res.status(400).json({ 
          error: 'Missing required fields: product_id, platform' 
        })
      }

      // Validate platform
      const validPlatforms = ['twitter', 'facebook', 'pinterest', 'whatsapp', 'email', 'other']
      if (!validPlatforms.includes(platform)) {
        return res.status(400).json({ 
          error: `Invalid platform. Must be one of: ${validPlatforms.join(', ')}` 
        })
      }

      // Get customer ID if authenticated
      let customerId = (req as any).customer_id
      
      if (!customerId && req.supabaseUser) {
        const { data: profile } = await supabaseAdmin
          .from('customer_profiles')
          .select('medusa_customer_id')
          .eq('supabase_user_id', req.supabaseUser.id)
          .single()

        if (profile) {
          customerId = profile.medusa_customer_id
        }
      }

      // Get product details
      const productService = req.scope.resolve("product")
      const product = await (productService as any).retrieve(product_id, {
        relations: ["images", "variants"]
      })

      if (!product) {
        return res.status(404).json({ error: 'Product not found' })
      }

      // Generate share URL
      const storeUrl = process.env.STORE_URL || 'http://localhost:3000'
      const productUrl = `${storeUrl}/products/${product.handle || product.id}`
      const imageUrl = product.images?.[0]?.url

      const shareUrl = generateShareUrl(platform, {
        productUrl,
        productName: product.title,
        description: product.description,
        imageUrl
      })

      // Track the share
      const { data: share, error } = await supabaseAdmin
        .from('social_shares')
        .insert({
          product_id,
          customer_id: customerId,
          platform,
          share_url: shareUrl
        })
        .select()
        .single()

      if (error) throw error

      res.json({
        share,
        share_url: shareUrl,
        product: {
          id: product.id,
          title: product.title,
          handle: product.handle,
          image_url: imageUrl
        }
      })
    } catch (error) {
      console.error('Error tracking social share:', error)
      res.status(500).json({ error: 'Failed to track social share' })
    }
  }
]

// GET /store/social/share - Get share URLs for a product
export const GET = [
  async (req: MedusaRequest, res: MedusaResponse) => {
    try {
      const { product_id } = req.query

      if (!product_id) {
        return res.status(400).json({ error: 'product_id is required' })
      }

      // Get product details
      const productService = req.scope.resolve("product")
      const product = await (productService as any).retrieve(product_id as string, {
        relations: ["images"]
      })

      if (!product) {
        return res.status(404).json({ error: 'Product not found' })
      }

      // Get share statistics
      const { data: shareStats } = await supabaseAdmin
        .from('social_shares')
        .select('platform')
        .eq('product_id', product_id)

      const shareCounts = shareStats?.reduce((acc: Record<string, number>, share) => {
        acc[share.platform] = (acc[share.platform] || 0) + 1
        return acc
      }, {}) || {}

      // Generate share URLs for all platforms
      const storeUrl = process.env.STORE_URL || 'http://localhost:3000'
      const productUrl = `${storeUrl}/products/${product.handle || product.id}`
      const imageUrl = product.images?.[0]?.url

      const shareData = {
        productUrl,
        productName: product.title,
        description: product.description,
        imageUrl
      }

      const shareUrls = {
        twitter: generateShareUrl('twitter', shareData),
        facebook: generateShareUrl('facebook', shareData),
        pinterest: generateShareUrl('pinterest', shareData),
        whatsapp: generateShareUrl('whatsapp', shareData),
        email: generateShareUrl('email', shareData)
      }

      res.json({
        product: {
          id: product.id,
          title: product.title,
          handle: product.handle,
          image_url: imageUrl
        },
        share_urls: shareUrls,
        share_counts: {
          total: shareStats?.length || 0,
          by_platform: shareCounts
        }
      })
    } catch (error) {
      console.error('Error getting share URLs:', error)
      res.status(500).json({ error: 'Failed to get share URLs' })
    }
  }
]