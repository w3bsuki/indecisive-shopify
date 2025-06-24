import { NextFunction, MedusaRequest, MedusaResponse } from "@medusajs/framework"
import jwt from 'jsonwebtoken'
import { supabaseAdmin } from "../../utils/supabase/client"

declare module "@medusajs/framework" {
  interface MedusaRequest {
    supabaseUser?: {
      id: string
      email?: string
      user_metadata?: Record<string, any>
    }
  }
}

// Helper function to extract bearer token
function extractBearerToken(authorization?: string): string | null {
  if (!authorization) return null
  const parts = authorization.split(' ')
  if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
    return parts[1]
  }
  return null
}

// Middleware to verify Supabase JWT tokens
export async function authenticateSupabaseUser(
  req: MedusaRequest,
  res: MedusaResponse,
  next: NextFunction
) {
  try {
    const token = extractBearerToken(req.headers.authorization)
    
    if (!token) {
      return res.status(401).json({ error: 'No authorization token provided' })
    }

    // Verify JWT signature
    const jwtSecret = process.env.SUPABASE_JWT_SECRET
    if (!jwtSecret) {
      console.error('SUPABASE_JWT_SECRET not configured')
      return res.status(500).json({ error: 'Authentication not configured' })
    }

    // Decode and verify the JWT
    const decoded = jwt.verify(token, jwtSecret) as any
    
    // Get user from Supabase to ensure they still exist
    const { data: { user }, error } = await supabaseAdmin.auth.admin.getUserById(decoded.sub)
    
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    // Attach user to request
    req.supabaseUser = {
      id: user.id,
      email: user.email,
      user_metadata: user.user_metadata
    }

    // Try to link with Medusa customer if email matches
    if (user.email) {
      const customerService = req.scope.resolve("customer")
      try {
        const customer = await customerService.retrieveByEmail(user.email)
        if (customer) {
          req.customer = customer
          req.customer_id = customer.id
        }
      } catch (e) {
        // Customer doesn't exist yet, that's ok
      }
    }

    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

// Optional authentication - doesn't fail if no token
export async function optionalSupabaseAuth(
  req: MedusaRequest,
  res: MedusaResponse,
  next: NextFunction
) {
  const token = extractBearerToken(req.headers.authorization)
  
  if (!token) {
    return next()
  }

  try {
    const jwtSecret = process.env.SUPABASE_JWT_SECRET
    if (!jwtSecret) {
      return next()
    }

    const decoded = jwt.verify(token, jwtSecret) as any
    const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(decoded.sub)
    
    if (user) {
      req.supabaseUser = {
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata
      }

      // Try to link with Medusa customer
      if (user.email) {
        const customerService = req.scope.resolve("customer")
        try {
          const customer = await customerService.retrieveByEmail(user.email)
          if (customer) {
            req.customer = customer
            req.customer_id = customer.id
          }
        } catch (e) {
          // Ignore
        }
      }
    }
  } catch (error) {
    // Ignore errors in optional auth
  }

  next()
}