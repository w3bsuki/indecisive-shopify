import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    // Get existing publishable keys
    const query = req.scope.resolve("query")
    const { data: keys } = await query.graph({
      entity: "api_key", 
      fields: ["id", "title", "type", "created_at"],
      filters: { type: "publishable" as any }
    })
    
    if (keys.length === 0) {
      return res.json({ 
        error: "No publishable keys found",
        message: "Run the seed script first"
      })
    }
    
    res.json({ 
      publishable_key: keys[0].id,
      all_keys: keys,
      instructions: `Add to your frontend .env.local:
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${keys[0].id}
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://indecisive-wear-backend.onrender.com`
    })
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    })
  }
}