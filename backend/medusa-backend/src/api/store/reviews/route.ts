import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { supabaseAdmin } from "../../../utils/supabase/client"
import { Review, NewReview } from "../../../utils/supabase/types"
import { authenticateSupabaseUser, optionalSupabaseAuth } from "../../middlewares/supabase-auth"

// GET /store/reviews - List reviews with optional filtering
export const GET = [
  optionalSupabaseAuth,
  async (req: MedusaRequest, res: MedusaResponse) => {
    try {
      const { 
        product_id, 
        customer_id, 
        rating,
        verified_only,
        sort = 'newest',
        limit = 20,
        offset = 0 
      } = req.query

      let query = supabaseAdmin
        .from('reviews')
        .select(`
          *,
          review_votes (
            customer_id,
            is_helpful
          )
        `)

      // Apply filters
      if (product_id) {
        query = query.eq('product_id', product_id)
      }
      if (customer_id) {
        query = query.eq('customer_id', customer_id)
      }
      if (rating) {
        query = query.eq('rating', parseInt(rating as string))
      }
      if (verified_only === 'true') {
        query = query.eq('verified_purchase', true)
      }

      // Apply sorting
      switch (sort) {
        case 'newest':
          query = query.order('created_at', { ascending: false })
          break
        case 'oldest':
          query = query.order('created_at', { ascending: true })
          break
        case 'highest':
          query = query.order('rating', { ascending: false })
          break
        case 'lowest':
          query = query.order('rating', { ascending: true })
          break
      }

      // Apply pagination
      query = query.range(
        parseInt(offset as string), 
        parseInt(offset as string) + parseInt(limit as string) - 1
      )

      const { data: reviews, error, count } = await query

      if (error) throw error

      // Transform reviews to include vote counts
      const transformedReviews = reviews?.map(review => {
        const votes = review.review_votes || []
        const helpfulCount = votes.filter((v: any) => v.is_helpful).length
        const notHelpfulCount = votes.filter((v: any) => !v.is_helpful).length
        
        // Check if current user voted
        let userVote = null
        if ((req as any).customer_id) {
          const vote = votes.find((v: any) => v.customer_id === (req as any).customer_id)
          if (vote) {
            userVote = (vote as any).is_helpful ? 'helpful' : 'not_helpful'
          }
        }

        return {
          ...review,
          helpful_count: helpfulCount,
          not_helpful_count: notHelpfulCount,
          user_vote: userVote,
          review_votes: undefined // Remove raw votes data
        }
      })

      res.json({
        reviews: transformedReviews,
        count,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      })
    } catch (error) {
      console.error('Error fetching reviews:', error)
      res.status(500).json({ error: 'Failed to fetch reviews' })
    }
  }
]

// POST /store/reviews - Create a new review
export const POST = [
  authenticateSupabaseUser,
  async (req: MedusaRequest, res: MedusaResponse) => {
    try {
      const { product_id, rating, title, content } = req.body as any

      // Validate input
      if (!product_id || !rating || !title || !content) {
        return res.status(400).json({ 
          error: 'Missing required fields: product_id, rating, title, content' 
        })
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' })
      }

      // Get or create customer profile
      let customerId = (req as any).customer_id
      
      if (!customerId && req.supabaseUser) {
        // Try to find existing profile
        const { data: profile } = await supabaseAdmin
          .from('customer_profiles')
          .select('medusa_customer_id')
          .eq('supabase_user_id', req.supabaseUser.id)
          .single()

        if (profile) {
          customerId = profile.medusa_customer_id
        } else if (req.supabaseUser.email) {
          // Create new Medusa customer
          const customerService = req.scope.resolve("customer")
          const newCustomer = await (customerService as any).create({
            email: req.supabaseUser.email,
            first_name: req.supabaseUser.user_metadata?.first_name,
            last_name: req.supabaseUser.user_metadata?.last_name
          })

          // Link to Supabase user
          await supabaseAdmin
            .from('customer_profiles')
            .insert({
              medusa_customer_id: newCustomer.id,
              supabase_user_id: req.supabaseUser.id
            })

          customerId = newCustomer.id
        }
      }

      if (!customerId) {
        return res.status(400).json({ error: 'Could not identify customer' })
      }

      // Check if customer already reviewed this product
      const { data: existingReview } = await supabaseAdmin
        .from('reviews')
        .select('id')
        .eq('product_id', product_id)
        .eq('customer_id', customerId)
        .single()

      if (existingReview) {
        return res.status(400).json({ 
          error: 'You have already reviewed this product' 
        })
      }

      // Check if this is a verified purchase
      const orderService = req.scope.resolve("order")
      const orders = await (orderService as any).list({
        customer_id: customerId,
        status: ['completed']
      })

      const hasOrderedProduct = orders.some(order => 
        order.items?.some(item => item.variant?.product_id === product_id)
      )

      // Create the review
      const newReview: NewReview = {
        product_id,
        customer_id: customerId,
        rating,
        title,
        content,
        verified_purchase: hasOrderedProduct
      }

      const { data: review, error } = await supabaseAdmin
        .from('reviews')
        .insert(newReview)
        .select()
        .single()

      if (error) throw error

      res.status(201).json({ review })
    } catch (error) {
      console.error('Error creating review:', error)
      res.status(500).json({ error: 'Failed to create review' })
    }
  }
]