import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import seedDemoData from "../../../scripts/seed"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    // Check for a secret key to prevent abuse
    const secret = req.query.secret as string
    if (secret !== "run-seed-now") {
      return res.status(401).json({ error: "Invalid secret" })
    }

    // Run the seed
    await seedDemoData({ container: req.scope, args: [] })
    
    // Get the publishable key that was created
    const query = req.scope.resolve("query")
    const { data: keys } = await query.graph({
      entity: "api_key",
      fields: ["id", "title", "type"],
      filters: {
        type: "publishable" as any
      }
    })
    
    res.json({ 
      message: "Seed completed successfully",
      publishable_key: keys[0]?.id,
      usage: `Add to frontend .env: NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${keys[0]?.id}`
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}