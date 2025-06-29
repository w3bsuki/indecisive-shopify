import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:3000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:9000",
      authCors: process.env.AUTH_CORS || "http://localhost:9000",
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  admin: {
    disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
    path: "/app",
    backendUrl: process.env.MEDUSA_ADMIN_BACKEND_URL || "http://localhost:9000",
  },
  modules: {
    // Stripe payment provider
    ...(process.env.STRIPE_API_KEY && process.env.STRIPE_WEBHOOK_SECRET && {
      payment: {
        resolve: "@medusajs/payment",
        options: {
          providers: [
            {
              resolve: "@medusajs/payment-stripe",
              id: "stripe",
              options: {
                apiKey: process.env.STRIPE_API_KEY,
                webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
                automaticPaymentMethods: true,
                paymentDescription: "Order from Indecisive Wear",
                capture: true,
              }
            }
          ]
        }
      }
    })
  }
})
