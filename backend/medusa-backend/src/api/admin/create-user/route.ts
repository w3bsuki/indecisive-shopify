import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const secret = req.query.secret as string
    if (secret !== "create-admin-now") {
      return res.status(401).json({ error: "Invalid secret" })
    }

    const userModule = req.scope.resolve(Modules.USER)
    
    const adminEmail = process.env.ADMIN_EMAIL || "admin@indecisive-wear.com"
    const adminPassword = process.env.ADMIN_PASSWORD || "supersecret123"
    
    // Check if admin already exists
    const existingUsers = await userModule.listUsers({
      email: adminEmail
    })
    
    if (existingUsers.length > 0) {
      return res.json({
        message: "Admin user already exists",
        email: adminEmail,
        instructions: "Use the existing credentials to login"
      })
    }
    
    // Create admin user
    const admin = await userModule.createUsers({
      email: adminEmail,
      first_name: "Admin",
      last_name: "User"
    })
    
    res.json({
      message: "Admin user created successfully",
      email: adminEmail,
      password: adminPassword,
      warning: "CHANGE THIS PASSWORD AFTER FIRST LOGIN!",
      login_url: `${process.env.MEDUSA_ADMIN_BACKEND_URL || req.headers.host}/admin`
    })
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    })
  }
}