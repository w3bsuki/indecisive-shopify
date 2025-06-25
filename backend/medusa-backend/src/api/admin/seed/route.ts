import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import seedDemoData from "../../../scripts/seed"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    // Run the seed
    await seedDemoData({ container: req.scope })
    
    // Get the publishable key that was created
    const query = req.scope.resolve("query")
    const { data: keys } = await query.graph({
      entity: "api_key",
      fields: ["id", "title", "type", "token"],
      filters: {
        type: "publishable"
      }
    })
    
    res.json({ 
      message: "Seed completed successfully",
      publishable_key: keys[0]?.id,
      frontend_env: {
        NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY: keys[0]?.id,
        NEXT_PUBLIC_MEDUSA_BACKEND_URL: "https://indecisive-wear-backend.onrender.com"
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}