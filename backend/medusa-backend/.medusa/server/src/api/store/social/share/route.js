"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = exports.POST = void 0;
const client_1 = require("../../../../utils/supabase/client");
const supabase_auth_1 = require("../../../middlewares/supabase-auth");
// Helper to generate social share URLs
function generateShareUrl(platform, data) {
    const { productUrl, productName, description, imageUrl } = data;
    const encodedUrl = encodeURIComponent(productUrl);
    const encodedText = encodeURIComponent(`Check out ${productName} at Indecisive Wear!`);
    const encodedDescription = encodeURIComponent(description || '');
    switch (platform) {
        case 'twitter':
            return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
        case 'facebook':
            return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        case 'pinterest':
            const encodedImage = encodeURIComponent(imageUrl || '');
            return `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImage}&description=${encodedText}`;
        case 'whatsapp':
            return `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        case 'email':
            const subject = encodeURIComponent(`Check out ${productName}`);
            const body = encodeURIComponent(`I found this great product at Indecisive Wear:\n\n${productName}\n${description || ''}\n\n${productUrl}`);
            return `mailto:?subject=${subject}&body=${body}`;
        default:
            return productUrl;
    }
}
// POST /store/social/share - Track social share
exports.POST = [
    supabase_auth_1.optionalSupabaseAuth,
    async (req, res) => {
        try {
            const { product_id, platform } = req.body;
            if (!product_id || !platform) {
                return res.status(400).json({
                    error: 'Missing required fields: product_id, platform'
                });
            }
            // Validate platform
            const validPlatforms = ['twitter', 'facebook', 'pinterest', 'whatsapp', 'email', 'other'];
            if (!validPlatforms.includes(platform)) {
                return res.status(400).json({
                    error: `Invalid platform. Must be one of: ${validPlatforms.join(', ')}`
                });
            }
            // Get customer ID if authenticated
            let customerId = req.customer_id;
            if (!customerId && req.supabaseUser) {
                const { data: profile } = await client_1.supabaseAdmin
                    .from('customer_profiles')
                    .select('medusa_customer_id')
                    .eq('supabase_user_id', req.supabaseUser.id)
                    .single();
                if (profile) {
                    customerId = profile.medusa_customer_id;
                }
            }
            // Get product details
            const productService = req.scope.resolve("product");
            const product = await productService.retrieve(product_id, {
                relations: ["images", "variants"]
            });
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            // Generate share URL
            const storeUrl = process.env.STORE_URL || 'http://localhost:3000';
            const productUrl = `${storeUrl}/products/${product.handle || product.id}`;
            const imageUrl = product.images?.[0]?.url;
            const shareUrl = generateShareUrl(platform, {
                productUrl,
                productName: product.title,
                description: product.description,
                imageUrl
            });
            // Track the share
            const { data: share, error } = await client_1.supabaseAdmin
                .from('social_shares')
                .insert({
                product_id,
                customer_id: customerId,
                platform,
                share_url: shareUrl
            })
                .select()
                .single();
            if (error)
                throw error;
            res.json({
                share,
                share_url: shareUrl,
                product: {
                    id: product.id,
                    title: product.title,
                    handle: product.handle,
                    image_url: imageUrl
                }
            });
        }
        catch (error) {
            console.error('Error tracking social share:', error);
            res.status(500).json({ error: 'Failed to track social share' });
        }
    }
];
// GET /store/social/share - Get share URLs for a product
exports.GET = [
    async (req, res) => {
        try {
            const { product_id } = req.query;
            if (!product_id) {
                return res.status(400).json({ error: 'product_id is required' });
            }
            // Get product details
            const productService = req.scope.resolve("product");
            const product = await productService.retrieve(product_id, {
                relations: ["images"]
            });
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            // Get share statistics
            const { data: shareStats } = await client_1.supabaseAdmin
                .from('social_shares')
                .select('platform')
                .eq('product_id', product_id);
            const shareCounts = shareStats?.reduce((acc, share) => {
                acc[share.platform] = (acc[share.platform] || 0) + 1;
                return acc;
            }, {}) || {};
            // Generate share URLs for all platforms
            const storeUrl = process.env.STORE_URL || 'http://localhost:3000';
            const productUrl = `${storeUrl}/products/${product.handle || product.id}`;
            const imageUrl = product.images?.[0]?.url;
            const shareData = {
                productUrl,
                productName: product.title,
                description: product.description,
                imageUrl
            };
            const shareUrls = {
                twitter: generateShareUrl('twitter', shareData),
                facebook: generateShareUrl('facebook', shareData),
                pinterest: generateShareUrl('pinterest', shareData),
                whatsapp: generateShareUrl('whatsapp', shareData),
                email: generateShareUrl('email', shareData)
            };
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
            });
        }
        catch (error) {
            console.error('Error getting share URLs:', error);
            res.status(500).json({ error: 'Failed to get share URLs' });
        }
    }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL3NvY2lhbC9zaGFyZS9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSw4REFBaUU7QUFDakUsc0VBQXlFO0FBRXpFLHVDQUF1QztBQUN2QyxTQUFTLGdCQUFnQixDQUFDLFFBQWdCLEVBQUUsSUFLM0M7SUFDQyxNQUFNLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFBO0lBQy9ELE1BQU0sVUFBVSxHQUFHLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFBO0lBQ2pELE1BQU0sV0FBVyxHQUFHLGtCQUFrQixDQUFDLGFBQWEsV0FBVyxzQkFBc0IsQ0FBQyxDQUFBO0lBQ3RGLE1BQU0sa0JBQWtCLEdBQUcsa0JBQWtCLENBQUMsV0FBVyxJQUFJLEVBQUUsQ0FBQyxDQUFBO0lBRWhFLFFBQVEsUUFBUSxFQUFFLENBQUM7UUFDakIsS0FBSyxTQUFTO1lBQ1osT0FBTyx3Q0FBd0MsVUFBVSxTQUFTLFdBQVcsRUFBRSxDQUFBO1FBRWpGLEtBQUssVUFBVTtZQUNiLE9BQU8sZ0RBQWdELFVBQVUsRUFBRSxDQUFBO1FBRXJFLEtBQUssV0FBVztZQUNkLE1BQU0sWUFBWSxHQUFHLGtCQUFrQixDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUMsQ0FBQTtZQUN2RCxPQUFPLGdEQUFnRCxVQUFVLFVBQVUsWUFBWSxnQkFBZ0IsV0FBVyxFQUFFLENBQUE7UUFFdEgsS0FBSyxVQUFVO1lBQ2IsT0FBTyx1QkFBdUIsV0FBVyxNQUFNLFVBQVUsRUFBRSxDQUFBO1FBRTdELEtBQUssT0FBTztZQUNWLE1BQU0sT0FBTyxHQUFHLGtCQUFrQixDQUFDLGFBQWEsV0FBVyxFQUFFLENBQUMsQ0FBQTtZQUM5RCxNQUFNLElBQUksR0FBRyxrQkFBa0IsQ0FBQyxxREFBcUQsV0FBVyxLQUFL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