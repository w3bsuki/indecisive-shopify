"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = exports.GET = void 0;
const client_1 = require("../../../utils/supabase/client");
const supabase_auth_1 = require("../../middlewares/supabase-auth");
// GET /store/reviews - List reviews with optional filtering
exports.GET = [
    supabase_auth_1.optionalSupabaseAuth,
    async (req, res) => {
        try {
            const { product_id, customer_id, rating, verified_only, sort = 'newest', limit = 20, offset = 0 } = req.query;
            let query = client_1.supabaseAdmin
                .from('reviews')
                .select(`
          *,
          review_votes (
            customer_id,
            is_helpful
          )
        `);
            // Apply filters
            if (product_id) {
                query = query.eq('product_id', product_id);
            }
            if (customer_id) {
                query = query.eq('customer_id', customer_id);
            }
            if (rating) {
                query = query.eq('rating', parseInt(rating));
            }
            if (verified_only === 'true') {
                query = query.eq('verified_purchase', true);
            }
            // Apply sorting
            switch (sort) {
                case 'newest':
                    query = query.order('created_at', { ascending: false });
                    break;
                case 'oldest':
                    query = query.order('created_at', { ascending: true });
                    break;
                case 'highest':
                    query = query.order('rating', { ascending: false });
                    break;
                case 'lowest':
                    query = query.order('rating', { ascending: true });
                    break;
            }
            // Apply pagination
            query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);
            const { data: reviews, error, count } = await query;
            if (error)
                throw error;
            // Transform reviews to include vote counts
            const transformedReviews = reviews?.map(review => {
                const votes = review.review_votes || [];
                const helpfulCount = votes.filter((v) => v.is_helpful).length;
                const notHelpfulCount = votes.filter((v) => !v.is_helpful).length;
                // Check if current user voted
                let userVote = null;
                if (req.customer_id) {
                    const vote = votes.find((v) => v.customer_id === req.customer_id);
                    if (vote) {
                        userVote = vote.is_helpful ? 'helpful' : 'not_helpful';
                    }
                }
                return {
                    ...review,
                    helpful_count: helpfulCount,
                    not_helpful_count: notHelpfulCount,
                    user_vote: userVote,
                    review_votes: undefined // Remove raw votes data
                };
            });
            res.json({
                reviews: transformedReviews,
                count,
                limit: parseInt(limit),
                offset: parseInt(offset)
            });
        }
        catch (error) {
            console.error('Error fetching reviews:', error);
            res.status(500).json({ error: 'Failed to fetch reviews' });
        }
    }
];
// POST /store/reviews - Create a new review
exports.POST = [
    supabase_auth_1.authenticateSupabaseUser,
    async (req, res) => {
        try {
            const { product_id, rating, title, content } = req.body;
            // Validate input
            if (!product_id || !rating || !title || !content) {
                return res.status(400).json({
                    error: 'Missing required fields: product_id, rating, title, content'
                });
            }
            if (rating < 1 || rating > 5) {
                return res.status(400).json({ error: 'Rating must be between 1 and 5' });
            }
            // Get or create customer profile
            let customerId = req.customer_id;
            if (!customerId && req.supabaseUser) {
                // Try to find existing profile
                const { data: profile } = await client_1.supabaseAdmin
                    .from('customer_profiles')
                    .select('medusa_customer_id')
                    .eq('supabase_user_id', req.supabaseUser.id)
                    .single();
                if (profile) {
                    customerId = profile.medusa_customer_id;
                }
                else if (req.supabaseUser.email) {
                    // Create new Medusa customer
                    const customerService = req.scope.resolve("customer");
                    const newCustomer = await customerService.create({
                        email: req.supabaseUser.email,
                        first_name: req.supabaseUser.user_metadata?.first_name,
                        last_name: req.supabaseUser.user_metadata?.last_name
                    });
                    // Link to Supabase user
                    await client_1.supabaseAdmin
                        .from('customer_profiles')
                        .insert({
                        medusa_customer_id: newCustomer.id,
                        supabase_user_id: req.supabaseUser.id
                    });
                    customerId = newCustomer.id;
                }
            }
            if (!customerId) {
                return res.status(400).json({ error: 'Could not identify customer' });
            }
            // Check if customer already reviewed this product
            const { data: existingReview } = await client_1.supabaseAdmin
                .from('reviews')
                .select('id')
                .eq('product_id', product_id)
                .eq('customer_id', customerId)
                .single();
            if (existingReview) {
                return res.status(400).json({
                    error: 'You have already reviewed this product'
                });
            }
            // Check if this is a verified purchase
            const orderService = req.scope.resolve("order");
            const orders = await orderService.list({
                customer_id: customerId,
                status: ['completed']
            });
            const hasOrderedProduct = orders.some(order => order.items?.some(item => item.variant?.product_id === product_id));
            // Create the review
            const newReview = {
                product_id,
                customer_id: customerId,
                rating,
                title,
                content,
                verified_purchase: hasOrderedProduct
            };
            const { data: review, error } = await client_1.supabaseAdmin
                .from('reviews')
                .insert(newReview)
                .select()
                .single();
            if (error)
                throw error;
            res.status(201).json({ review });
        }
        catch (error) {
            console.error('Error creating review:', error);
            res.status(500).json({ error: 'Failed to create review' });
        }
    }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL3Jldmlld3Mvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsMkRBQThEO0FBRTlELG1FQUFnRztBQUVoRyw0REFBNEQ7QUFDL0MsUUFBQSxHQUFHLEdBQUc7SUFDakIsb0NBQW9CO0lBQ3BCLEtBQUssRUFBRSxHQUFrQixFQUFFLEdBQW1CLEVBQUUsRUFBRTtRQUNoRCxJQUFJLENBQUM7WUFDSCxNQUFNLEVBQ0osVUFBVSxFQUNWLFdBQVcsRUFDWCxNQUFNLEVBQ04sYUFBYSxFQUNiLElBQUksR0FBRyxRQUFRLEVBQ2YsS0FBSyxHQUFHLEVBQUUsRUFDVixNQUFNLEdBQUcsQ0FBQyxFQUNYLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQTtZQUViLElBQUksS0FBSyxHQUFHLHNCQUFhO2lCQUN0QixJQUFJLENBQUMsU0FBUyxDQUFDO2lCQUNmLE1BQU0sQ0FBQzs7Ozs7O1NBTVAsQ0FBQyxDQUFBO1lBRUosZ0JBQWdCO1lBQ2hCLElBQUksVUFBVSxFQUFFLENBQUM7Z0JBQ2YsS0FBSyxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLFVBQVUsQ0FBQyxDQUFBO1lBQzVDLENBQUM7WUFDRCxJQUFJLFdBQVcsRUFBRSxDQUFDO2dCQUNoQixLQUFLLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsV0FBVyxDQUFDLENBQUE7WUFDOUMsQ0FBQztZQUNELElBQUksTUFBTSxFQUFFLENBQUM7Z0JBQ1gsS0FBSyxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxNQUFnQixDQUFDLENBQUMsQ0FBQTtZQUN4RCxDQUFDO1lBQ0QsSUFBSSxhQUFhLEtBQUssTUFBTSxFQUFFLENBQUM7Z0JBQzdCLEtBQUssR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxDQUFBO1lBQzdDLENBQUM7WUFFRCxnQkFBZ0I7WUFDaEIsUUFBUSxJQUFJLEVBQUUsQ0FBQztnQkFDYixLQUFLLFFBQVE7b0JBQ1gsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUE7b0JBQ3ZELE1BQUs7Z0JBQ1AsS0FBSyxRQUFRO29CQUNYLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO29CQUN0RCxNQUFLO2dCQUNQLEtBQUssU0FBUztvQkFDWixLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQTtvQkFDbkQsTUFBSztnQkFDUCxLQUFLLFFBQVE7b0JBQ1gsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7b0JBQ2xELE1BQUs7WUFDVCxDQUFDO1lBRUQsbUJBQW1CO1lBQ25CLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUNqQixRQUFRLENBQUMsTUFBZ0IsQ0FBQyxFQUMxQixRQUFRLENBQUMsTUFBZ0IsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxLQUFlLENBQUMsR0FBRyxDQUFDLENBQzNELENBQUE7WUFFRCxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsTUFBTSxLQUFLLENBQUE7WUFFbkQsSUFBSSxLQUFLO2dCQUFFLE1BQU0sS0FBSyxDQUFBO1lBRXRCLDJDQUEyQztZQUMzQyxNQUFNLGtCQUFrQixHQUFHLE9BQU8sRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQy9DLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxZQUFZLElBQUksRUFBRSxDQUFBO2dCQUN2QyxNQUFNLFlBQVksR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxDQUFBO2dCQUNsRSxNQUFNLGVBQWUsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQUE7Z0JBRXRFLDhCQUE4QjtnQkFDOUIsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFBO2dCQUNuQixJQUFLLEdBQVcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztvQkFDN0IsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsS0FBTSxHQUFXLENBQUMsV0FBVyxDQUFDLENBQUE7b0JBQy9FLElBQUksSUFBSSxFQUFFLENBQUM7d0JBQ1QsUUFBUSxHQUFJLElBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFBO29CQUNqRSxDQUFDO2dCQUNILENBQUM7Z0JBRUQsT0FBTztvQkFDTCxHQUFHLE1BQU07b0JBQ1QsYUFBYSxFQUFFLFlBQVk7b0JBQzNCLGlCQUFpQixFQUFFLGVBQWU7b0JBQ2xDLFNBQVMsRUFBRSxRQUFRO29CQUNuQixZQUFZLEVBQUUsU0FBUyxDQUFDLHdCQUF3QjtpQkFDakQsQ0FBQTtZQUNILENBQUMsQ0FBQyxDQUFBO1lBRUYsR0FBRyxDQUFDLElBQUksQ0FBQztnQkFDUCxPQUFPLEVBQUUsa0JBQWtCO2dCQUMzQixLQUFLO2dCQUNMLEtBQUssRUFBRSxRQUFRLENBQUMsS0FBZSxDQUFDO2dCQUNoQyxNQUFNLEVBQUUsUUFBUSxDQUFDLE1BQWdCLENBQUM7YUFDbkMsQ0FBQyxDQUFBO1FBQ0osQ0FBQztRQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7WUFDZixPQUFPLENBQUMsS0FBSyxDQUFDLHlCQUF5QixFQUFFLEtBQUssQ0FBQyxDQUFBO1lBQy9DLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLHlCQUF5QixFQUFFLENBQUMsQ0FBQTtRQUM1RCxDQUFDO0lBQ0gsQ0FBQztDQUNGLENBQUE7QUFFRCw0Q0FBNEM7QUFDL0IsUUFBQSxJQUFJLEdBQUc7SUFDbEIsd0NBQXdCO0lBQ3hCLEtBQUssRUFBRSxHQUFrQixFQUFFLEdBQW1CLEVBQUUsRUFBRTtRQUNoRCxJQUFJLENBQUM7WUFDSCxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEdBQUcsR0FBRyxDQUFDLElBQVcsQ0FBQTtZQUU5RCxpQkFBaUI7WUFDakIsSUFBSSxDQUFDLFVBQVUsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUNqRCxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO29CQUMxQixLQUFLLEVBQUUsNkRBQTZEO2lCQUNyRSxDQUFDLENBQUE7WUFDSixDQUFDO1lBRUQsSUFBSSxNQUFNLEdBQUcsQ0FBQyxJQUFJLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQztnQkFDN0IsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxnQ0FBZ0MsRUFBRSxDQUFDLENBQUE7WUFDMUUsQ0FBQztZQUVELGlDQUFpQztZQUNqQyxJQUFJLFVBQVUsR0FBSSxHQUFXLENBQUMsV0FBVyxDQUFBO1lBRXpDLElBQUksQ0FBQyxVQUFVLElBQUksR0FBRyxDQUFDLFlBQVksRUFBRSxDQUFDO2dCQUNwQywrQkFBK0I7Z0JBQy9CLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEdBQUcsTUFBTSxzQkFBYTtxQkFDMUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDO3FCQUN6QixNQUFNLENBQUMsb0JBQW9CLENBQUM7cUJBQzVCLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQztxQkFDM0MsTUFBTSxFQUFFLENBQUE7Z0JBRVgsSUFBSSxPQUFPLEVBQUUsQ0FBQztvQkFDWixVQUFVLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFBO2dCQUN6QyxDQUFDO3FCQUFNLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQztvQkFDbEMsNkJBQTZCO29CQUM3QixNQUFNLGVBQWUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQTtvQkFDckQsTUFBTSxXQUFXLEdBQUcsTUFBTyxlQUF1QixDQUFDLE1BQU0sQ0FBQzt3QkFDeEQsS0FBSyxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsS0FBSzt3QkFDN0IsVUFBVSxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLFVBQVU7d0JBQ3RELFNBQVMsRUFBRSxHQUFHLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxTQUFTO3FCQUNyRCxDQUFDLENBQUE7b0JBRUYsd0JBQXdCO29CQUN4QixNQUFNLHNCQUFhO3lCQUNoQixJQUFJLENBQUMsbUJBQW1CLENBQUM7eUJBQ3pCLE1BQU0sQ0FBQzt3QkFDTixrQkFBa0IsRUFBRSxXQUFXLENBQUMsRUFBRTt3QkFDbEMsZ0JBQWdCLEVBQUUsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFO3FCQUN0QyxDQUFDLENBQUE7b0JBRUosVUFBVSxHQUFHLFdBQVcsQ0FBQyxFQUFFLENBQUE7Z0JBQzdCLENBQUM7WUFDSCxDQUFDO1lBRUQsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO2dCQUNoQixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLDZCQUE2QixFQUFFLENBQUMsQ0FBQTtZQUN2RSxDQUFDO1lBRUQsa0RBQWtEO1lBQ2xELE1BQU0sRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLEdBQUcsTUFBTSxzQkFBYTtpQkFDakQsSUFBSSxDQUFDLFNBQVMsQ0FBQztpQkFDZixNQUFNLENBQUMsSUFBSSxDQUFDO2lCQUNaLEVBQUUsQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDO2lCQUM1QixFQUFFLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQztpQkFDN0IsTUFBTSxFQUFFLENBQUE7WUFFWCxJQUFJLGNBQWMsRUFBRSxDQUFDO2dCQUNuQixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO29CQUMxQixLQUFLLEVBQUUsd0NBQXdDO2lCQUNoRCxDQUFDLENBQUE7WUFDSixDQUFDO1lBRUQsdUNBQXVDO1lBQ3ZDLE1BQU0sWUFBWSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBQy9DLE1BQU0sTUFBTSxHQUFHLE1BQU8sWUFBb0IsQ0FBQyxJQUFJLENBQUM7Z0JBQzlDLFdBQVcsRUFBRSxVQUFVO2dCQUN2QixNQUFNLEVBQUUsQ0FBQyxXQUFXLENBQUM7YUFDdEIsQ0FBQyxDQUFBO1lBRUYsTUFBTSxpQkFBaUIsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQzVDLEtBQUssQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFVLEtBQUssVUFBVSxDQUFDLENBQ25FLENBQUE7WUFFRCxvQkFBb0I7WUFDcEIsTUFBTSxTQUFTLEdBQWM7Z0JBQzNCLFVBQVU7Z0JBQ1YsV0FBVyxFQUFFLFVBQVU7Z0JBQ3ZCLE1BQU07Z0JBQ04sS0FBSztnQkFDTCxPQUFPO2dCQUNQLGlCQUFpQixFQUFFLGlCQUFpQjthQUNyQyxDQUFBO1lBRUQsTUFBTSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsTUFBTSxzQkFBYTtpQkFDaEQsSUFBSSxDQUFDLFNBQVMsQ0FBQztpQkFDZixNQUFNLENBQUMsU0FBUyxDQUFDO2lCQUNqQixNQUFNLEVBQUU7aUJBQ1IsTUFBTSxFQUFFLENBQUE7WUFFWCxJQUFJLEtBQUs7Z0JBQUUsTUFBTSxLQUFLLENBQUE7WUFFdEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFBO1FBQ2xDLENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsRUFBRSxLQUFLLENBQUMsQ0FBQTtZQUM5QyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSx5QkFBeUIsRUFBRSxDQUFDLENBQUE7UUFDNUQsQ0FBQztJQUNILENBQUM7Q0FDRixDQUFBIn0=