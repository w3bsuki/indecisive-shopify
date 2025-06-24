import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { supabaseAdmin } from "../../../../../utils/supabase/client"
import { authenticateSupabaseUser } from "../../../../middlewares/supabase-auth"

// POST /store/reviews/:id/vote - Vote on a review
export const POST = [
  authenticateSupabaseUser,
  async (req: MedusaRequest, res: MedusaResponse) => {
    try {
      const reviewId = req.params.id
      const { is_helpful } = req.body

      if (typeof is_helpful !== 'boolean') {
        return res.status(400).json({ 
          error: 'is_helpful must be a boolean value' 
        })
      }

      // Get customer ID
      let customerId = req.customer_id
      
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

      if (!customerId) {
        return res.status(400).json({ error: 'Could not identify customer' })
      }

      // Check if review exists
      const { data: review, error: reviewError } = await supabaseAdmin
        .from('reviews')
        .select('id')
        .eq('id', reviewId)
        .single()

      if (reviewError || !review) {
        return res.status(404).json({ error: 'Review not found' })
      }

      // Check if user is trying to vote on their own review
      const { data: ownReview } = await supabaseAdmin
        .from('reviews')
        .select('id')
        .eq('id', reviewId)
        .eq('customer_id', customerId)
        .single()

      if (ownReview) {
        return res.status(400).json({ 
          error: 'You cannot vote on your own review' 
        })
      }

      // Upsert the vote
      const { data: vote, error } = await supabaseAdmin
        .from('review_votes')
        .upsert({
          review_id: reviewId,
          customer_id: customerId,
          is_helpful
        }, {
          onConflict: 'review_id,customer_id'
        })
        .select()
        .single()

      if (error) throw error

      // Get updated vote counts
      const { data: voteCounts } = await supabaseAdmin
        .from('review_votes')
        .select('is_helpful')
        .eq('review_id', reviewId)

      const helpfulCount = voteCounts?.filter(v => v.is_helpful).length || 0
      const notHelpfulCount = voteCounts?.filter(v => !v.is_helpful).length || 0

      res.json({
        vote,
        helpful_count: helpfulCount,
        not_helpful_count: notHelpfulCount
      })
    } catch (error) {
      console.error('Error voting on review:', error)
      res.status(500).json({ error: 'Failed to vote on review' })
    }
  }
]

// DELETE /store/reviews/:id/vote - Remove vote from a review
export const DELETE = [
  authenticateSupabaseUser,
  async (req: MedusaRequest, res: MedusaResponse) => {
    try {
      const reviewId = req.params.id

      // Get customer ID
      let customerId = req.customer_id
      
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

      if (!customerId) {
        return res.status(400).json({ error: 'Could not identify customer' })
      }

      // Delete the vote
      const { error } = await supabaseAdmin
        .from('review_votes')
        .delete()
        .eq('review_id', reviewId)
        .eq('customer_id', customerId)

      if (error) throw error

      // Get updated vote counts
      const { data: voteCounts } = await supabaseAdmin
        .from('review_votes')
        .select('is_helpful')
        .eq('review_id', reviewId)

      const helpfulCount = voteCounts?.filter(v => v.is_helpful).length || 0
      const notHelpfulCount = voteCounts?.filter(v => !v.is_helpful).length || 0

      res.json({
        helpful_count: helpfulCount,
        not_helpful_count: notHelpfulCount
      })
    } catch (error) {
      console.error('Error removing vote:', error)
      res.status(500).json({ error: 'Failed to remove vote' })
    }
  }
]