import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import seedDemoData from "../../scripts/seed"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const secret = req.query.secret as string
    if (secret !== "init-now-please") {
      return res.status(401).json({ error: "Invalid secret" })
    }

    // Run the seed
    await seedDemoData({ container: req.scope, args: [] })
    
    // Get the publishable key
    const query = req.scope.resolve("query")
    const { data: keys } = await query.graph({
      entity: "api_key", 
      fields: ["id", "title", "type"],
      filters: { type: "publishable" as any }
    })
    
    res.json({ 
      success: true,
      publishable_key: keys[0]?.id,
      instructions: `Add to your frontend .env.local:
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${keys[0]?.id}
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://indecisive-wear-backend.onrender.com`
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}