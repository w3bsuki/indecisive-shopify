"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initStorageBuckets = initStorageBuckets;
exports.uploadProductImage = uploadProductImage;
exports.uploadReviewImage = uploadReviewImage;
exports.deleteProductImages = deleteProductImages;
const client_1 = require("./client");
const PRODUCT_IMAGES_BUCKET = 'product-images';
const REVIEW_IMAGES_BUCKET = 'review-images';
// Initialize storage buckets
async function initStorageBuckets() {
    // Create product images bucket
    const { error: productError } = await client_1.supabaseAdmin.storage.createBucket(PRODUCT_IMAGES_BUCKET, {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    });
    if (productError && !productError.message.includes('already exists')) {
        console.error('Failed to create product images bucket:', productError);
    }
    // Create review images bucket
    const { error: reviewError } = await client_1.supabaseAdmin.storage.createBucket(REVIEW_IMAGES_BUCKET, {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
    });
    if (reviewError && !reviewError.message.includes('already exists')) {
        console.error('Failed to create review images bucket:', reviewError);
    }
}
// Upload product image
async function uploadProductImage(file, fileName, productId) {
    const path = `${productId}/${fileName}`;
    const { data, error } = await client_1.supabaseAdmin.storage
        .from(PRODUCT_IMAGES_BUCKET)
        .upload(path, file, {
        contentType: 'image/jpeg',
        upsert: true
    });
    if (error) {
        throw error;
    }
    // Get public URL
    const { data: { publicUrl } } = client_1.supabaseAdmin.storage
        .from(PRODUCT_IMAGES_BUCKET)
        .getPublicUrl(path);
    return publicUrl;
}
// Upload review image
async function uploadReviewImage(file, fileName, reviewId) {
    const path = `${reviewId}/${fileName}`;
    const { data, error } = await client_1.supabaseAdmin.storage
        .from(REVIEW_IMAGES_BUCKET)
        .upload(path, file, {
        contentType: 'image/jpeg',
        upsert: false
    });
    if (error) {
        throw error;
    }
    // Get public URL
    const { data: { publicUrl } } = client_1.supabaseAdmin.storage
        .from(REVIEW_IMAGES_BUCKET)
        .getPublicUrl(path);
    return publicUrl;
}
// Delete product images
async function deleteProductImages(productId) {
    const { data: files, error: listError } = await client_1.supabaseAdmin.storage
        .from(PRODUCT_IMAGES_BUCKET)
        .list(productId);
    if (listError) {
        console.error('Failed to list product images:', listError);
        return;
    }
    if (files && files.length > 0) {
        const filePaths = files.map(file => `${productId}/${file.name}`);
        const { error: deleteError } = await client_1.supabaseAdmin.storage
            .from(PRODUCT_IMAGES_BUCKET)
            .remove(filePaths);
        if (deleteError) {
            console.error('Failed to delete product images:', deleteError);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy91dGlscy9zdXBhYmFzZS9zdG9yYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBTUEsZ0RBc0JDO0FBR0QsZ0RBb0JDO0FBR0QsOENBb0JDO0FBR0Qsa0RBb0JDO0FBakdELHFDQUF3QztBQUV4QyxNQUFNLHFCQUFxQixHQUFHLGdCQUFnQixDQUFBO0FBQzlDLE1BQU0sb0JBQW9CLEdBQUcsZUFBZSxDQUFBO0FBRTVDLDZCQUE2QjtBQUN0QixLQUFLLFVBQVUsa0JBQWtCO0lBQ3RDLCtCQUErQjtJQUMvQixNQUFNLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxHQUFHLE1BQU0sc0JBQWEsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLHFCQUFxQixFQUFFO1FBQzlGLE1BQU0sRUFBRSxJQUFJO1FBQ1osYUFBYSxFQUFFLE9BQU8sRUFBRSxNQUFNO1FBQzlCLGdCQUFnQixFQUFFLENBQUMsWUFBWSxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsV0FBVyxDQUFDO0tBQ3pFLENBQUMsQ0FBQTtJQUVGLElBQUksWUFBWSxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDO1FBQ3JFLE9BQU8sQ0FBQyxLQUFLLENBQUMseUNBQXlDLEVBQUUsWUFBWSxDQUFDLENBQUE7SUFDeEUsQ0FBQztJQUVELDhCQUE4QjtJQUM5QixNQUFNLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxHQUFHLE1BQU0sc0JBQWEsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLG9CQUFvQixFQUFFO1FBQzVGLE1BQU0sRUFBRSxJQUFJO1FBQ1osYUFBYSxFQUFFLE9BQU8sRUFBRSxNQUFNO1FBQzlCLGdCQUFnQixFQUFFLENBQUMsWUFBWSxFQUFFLFdBQVcsRUFBRSxZQUFZLENBQUM7S0FDNUQsQ0FBQyxDQUFBO0lBRUYsSUFB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