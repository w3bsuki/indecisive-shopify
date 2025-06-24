import { supabaseAdmin } from './client'

const PRODUCT_IMAGES_BUCKET = 'product-images'
const REVIEW_IMAGES_BUCKET = 'review-images'

// Initialize storage buckets
export async function initStorageBuckets() {
  // Create product images bucket
  const { error: productError } = await supabaseAdmin.storage.createBucket(PRODUCT_IMAGES_BUCKET, {
    public: true,
    fileSizeLimit: 5242880, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  })

  if (productError && !productError.message.includes('already exists')) {
    console.error('Failed to create product images bucket:', productError)
  }

  // Create review images bucket
  const { error: reviewError } = await supabaseAdmin.storage.createBucket(REVIEW_IMAGES_BUCKET, {
    public: true,
    fileSizeLimit: 5242880, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
  })

  if (reviewError && !reviewError.message.includes('already exists')) {
    console.error('Failed to create review images bucket:', reviewError)
  }
}

// Upload product image
export async function uploadProductImage(file: Buffer, fileName: string, productId: string) {
  const path = `${productId}/${fileName}`
  
  const { data, error } = await supabaseAdmin.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(path, file, {
      contentType: 'image/jpeg',
      upsert: true
    })

  if (error) {
    throw error
  }

  // Get public URL
  const { data: { publicUrl } } = supabaseAdmin.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .getPublicUrl(path)

  return publicUrl
}

// Upload review image
export async function uploadReviewImage(file: Buffer, fileName: string, reviewId: string) {
  const path = `${reviewId}/${fileName}`
  
  const { data, error } = await supabaseAdmin.storage
    .from(REVIEW_IMAGES_BUCKET)
    .upload(path, file, {
      contentType: 'image/jpeg',
      upsert: false
    })

  if (error) {
    throw error
  }

  // Get public URL
  const { data: { publicUrl } } = supabaseAdmin.storage
    .from(REVIEW_IMAGES_BUCKET)
    .getPublicUrl(path)

  return publicUrl
}

// Delete product images
export async function deleteProductImages(productId: string) {
  const { data: files, error: listError } = await supabaseAdmin.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .list(productId)

  if (listError) {
    console.error('Failed to list product images:', listError)
    return
  }

  if (files && files.length > 0) {
    const filePaths = files.map(file => `${productId}/${file.name}`)
    const { error: deleteError } = await supabaseAdmin.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .remove(filePaths)

    if (deleteError) {
      console.error('Failed to delete product images:', deleteError)
    }
  }
}