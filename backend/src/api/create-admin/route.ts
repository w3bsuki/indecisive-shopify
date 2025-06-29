import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const userModule = req.scope.resolve(Modules.USER)
  
  try {
    // Create admin user
    const user = await userModule.createUsers({
      email: "admin@indecisive-wear.com",
      first_name: "Admin",
      last_name: "User",
    })
    
    res.json({ 
      message: "Admin user created successfully",
      email: "admin@indecisive-wear.com",
      password: "supersecret123",
      warning: "CHANGE THIS PASSWORD IMMEDIATELY!"
    })
  } catch (error: any) {
    if (error.message?.includes("already exists")) {
      res.status(400).json({ 
        error: "Admin user already exists",
        email: "admin@indecisive-wear.com",
        hint: "Try logging in with the password you set"
      })
    } else {
      res.status(500).json({ error: error.message })
    }
  }
}