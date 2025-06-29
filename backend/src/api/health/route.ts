import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  res.json({ 
    status: "ok",
    message: "Medusa v2 Backend is running",
    version: "2.8.4",
    deployment: "production",
    timestamp: new Date().toISOString(),
    endpoints: {
      store: "/store",
      admin: "/admin", 
      auth: "/auth"
    },
    environment: {
      node_version: process.version,
      medusa_backend: true,
      railway_deployment: process.env.RAILWAY_ENVIRONMENT || "unknown"
    }
  })
}