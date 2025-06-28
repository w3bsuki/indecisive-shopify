import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  res.json({ 
    message: "Admin API is working",
    cors: {
      admin: process.env.ADMIN_CORS,
      store: process.env.STORE_CORS,
      auth: process.env.AUTH_CORS
    },
    admin_disabled: process.env.DISABLE_MEDUSA_ADMIN === "true",
    backend_url: process.env.MEDUSA_ADMIN_BACKEND_URL
  })
}