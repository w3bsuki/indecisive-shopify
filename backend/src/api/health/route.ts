import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  res.json({ 
    status: "ok",
    message: "Backend is running",
    endpoints: {
      store: "/store",
      admin: "/admin", 
      auth: "/auth"
    }
  })
}