import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils";

export default async function fixAdminAuth({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  
  logger.info("Fixing admin authentication...");
  
  const userModule = container.resolve(Modules.USER);
  const authModule = container.resolve(Modules.AUTH);
  
  const adminEmail = process.env.ADMIN_EMAIL || "admin@indecisive-wear.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "supersecret123";
  
  try {
    // Check if admin user exists
    const existingUsers = await userModule.listUsers({
      email: adminEmail
    });
    
    if (existingUsers.length > 0) {
      const admin = existingUsers[0];
      logger.info(`Found existing admin user: ${adminEmail}`);
      
      // Check if auth identity exists
      const existingAuth = await authModule.listAuthIdentities({
        user_id: admin.id,
        provider_id: "emailpass"
      });
      
      if (existingAuth.length > 0) {
        logger.info("Auth identity already exists. Updating password...");
        
        // Update existing auth identity
        await authModule.updateAuthIdentities({
          id: existingAuth[0].id,
          provider_metadata: {
            email: adminEmail,
            password: adminPassword
          }
        });
        
        logger.info("Admin password updated successfully!");
      } else {
        logger.info("Creating auth identity for existing user...");
        
        // Create auth identity for existing user
        await authModule.createAuthIdentities({
          provider_id: "emailpass",
          user_id: admin.id,
          provider_metadata: {
            email: adminEmail,
            password: adminPassword
          }
        });
        
        logger.info("Auth identity created successfully!");
      }
    } else {
      logger.info("No admin user found. Creating new admin user with auth...");
      
      // Create admin user
      const admin = await userModule.createUsers({
        email: adminEmail,
        first_name: "Admin",
        last_name: "User"
      });
      
      // Create auth identity for the user
      await authModule.createAuthIdentities({
        provider_id: "emailpass",
        user_id: admin.id,
        provider_metadata: {
          email: adminEmail,
          password: adminPassword
        }
      });
      
      logger.info("New admin user created with authentication!");
    }
    
    logger.info(`Admin login credentials:`);
    logger.info(`Email: ${adminEmail}`);
    logger.info(`Password: ${adminPassword}`);
    logger.info("You can now login to the admin panel!");
    
  } catch (error) {
    logger.error("Failed to fix admin authentication:", error);
    throw error;
  }
}