"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE = exports.POST = void 0;
const client_1 = require("../../../../../utils/supabase/client");
const supabase_auth_1 = require("../../../../middlewares/supabase-auth");
// POST /store/reviews/:id/vote - Vote on a review
exports.POST = [
    supabase_auth_1.authenticateSupabaseUser,
    async (req, res) => {
        try {
            const reviewId = req.params.id;
            const { is_helpful } = req.body;
            if (typeof is_helpful !== 'boolean') {
                return res.status(400).json({
                    error: 'is_helpful must be a boolean value'
                });
            }
            // Get customer ID
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
            if (!customerId) {
                return res.status(400).json({ error: 'Could not identify customer' });
            }
            // Check if review exists
            const { data: review, error: reviewError } = await client_1.supabaseAdmin
                .from('reviews')
                .select('id')
                .eq('id', reviewId)
                .single();
            if (reviewError || !review) {
                return res.status(404).json({ error: 'Review not found' });
            }
            // Check if user is trying to vote on their own review
            const { data: ownReview } = await client_1.supabaseAdmin
                .from('reviews')
                .select('id')
                .eq('id', reviewId)
                .eq('customer_id', customerId)
                .single();
            if (ownReview) {
                return res.status(400).json({
                    error: 'You cannot vote on your own review'
                });
            }
            // Upsert the vote
            const { data: vote, error } = await client_1.supabaseAdmin
                .from('review_votes')
                .upsert({
                review_id: reviewId,
                customer_id: customerId,
                is_helpful
            }, {
                onConflict: 'review_id,customer_id'
            })
                .select()
                .single();
            if (error)
                throw error;
            // Get updated vote counts
            const { data: voteCounts } = await client_1.supabaseAdmin
                .from('review_votes')
                .select('is_helpful')
                .eq('review_id', reviewId);
            const helpfulCount = voteCounts?.filter(v => v.is_helpful).length || 0;
            const notHelpfulCount = voteCounts?.filter(v => !v.is_helpful).length || 0;
            res.json({
                vote,
                helpful_count: helpfulCount,
                not_helpful_count: notHelpfulCount
            });
        }
        catch (error) {
            console.error('Error voting on review:', error);
            res.status(500).json({ error: 'Failed to vote on review' });
        }
    }
];
// DELETE /store/reviews/:id/vote - Remove vote from a review
exports.DELETE = [
    supabase_auth_1.authenticateSupabaseUser,
    async (req, res) => {
        try {
            const reviewId = req.params.id;
            // Get customer ID
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
            if (!customerId) {
                return res.status(400).json({ error: 'Could not identify customer' });
            }
            // Delete the vote
            const { error } = await client_1.supabaseAdmin
                .from('review_votes')
                .delete()
                .eq('review_id', reviewId)
                .eq('customer_id', customerId);
            if (error)
                throw error;
            // Get updated vote counts
            const { data: voteCounts } = await client_1.supabaseAdmin
                .from('review_votes')
                .select('is_helpful')
                .eq('review_id', reviewId);
            const helpfulCount = voteCounts?.filter(v => v.is_helpful).length || 0;
            const notHelpfulCount = voteCounts?.filter(v => !v.is_helpful).length || 0;
            res.json({
                helpful_count: helpfulCount,
                not_helpful_count: notHelpfulCount
            });
        }
        catch (error) {
            console.error('Error removing vote:', error);
            res.status(500).json({ error: 'Failed to remove vote' });
        }
    }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL3Jldmlld3MvW2lkXS92b3RlL3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGlFQUFvRTtBQUNwRSx5RUFBZ0Y7QUFFaEYsa0RBQWtEO0FBQ3JDLFFBQUEsSUFBSSxHQUFHO0lBQ2xCLHdDQUF3QjtJQUN4QixLQUFLLEVBQUUsR0FBa0IsRUFBRSxHQUFtQixFQUFFLEVBQUU7UUFDaEQsSUFBSSxDQUFDO1lBQ0gsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUE7WUFDOUIsTUFBTSxFQUFFLFVBQVUsRUFBRSxHQUFHLEdBQUcsQ0FBQyxJQUFXLENBQUE7WUFFdEMsSUFBSSxPQUFPLFVBQVUsS0FBSyxTQUFTLEVBQUUsQ0FBQztnQkFDcEMsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztvQkFDMUIsS0FBSyxFQUFFLG9DQUFvQztpQkFDNUMsQ0FBQyxDQUFBO1lBQ0osQ0FBQztZQUVELGtCQUFrQjtZQUNsQixJQUFJLFVBQVUsR0FBSSxHQUFXLENBQUMsV0FBVyxDQUFBO1lBRXpDLElBQUksQ0FBQyxVQUFVLElBQUksR0FBRyxDQUFDLFlBQVksRUFBRSxDQUFDO2dCQUNwQyxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxHQUFHLE1BQU0sc0JBQWE7cUJBQzFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQztxQkFDekIsTUFBTSxDQUFDLG9CQUFvQixDQUFDO3FCQUM1QixFQUFFLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUM7cUJBQzNDLE1BQU0sRUFBRSxDQUFBO2dCQUVYLElBQUksT0FBTyxFQUFFLENBQUM7b0JBQ1osVUFBVSxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQTtnQkFDekMs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