import { Modules } from "@medusajs/framework/utils"

export default async function createAdminUser({ container }) {
  const userModule = container.resolve(Modules.USER)
  
  const adminEmail = process.env.ADMIN_EMAIL || "admin@indecisive-wear.com"
  const adminPassword = process.env.ADMIN_PASSWORD || "supersecret123"
  
  try {
    // Check if admin already exists
    const existingUsers = await userModule.listUsers({
      email: adminEmail
    })
    
    if (existingUsers.length > 0) {
      console.log("Admin user already exists:", adminEmail)
      return existingUsers[0]
    }
    
    // Create admin user
    const admin = await userModule.createUsers({
      email: adminEmail,
      password: adminPassword,
      first_name: "Admin",
      last_name: "User"
    })
    
    console.log("Admin user created successfully!")
    console.log("Email:", adminEmail)
    console.log("Password:", adminPassword)
    console.log("IMPORTANT: Change this password after first login!")
    
    return admin
  } catch (error) {
    console.error("Error creating admin user:", error)
    throw error
  }
}