const { loadEnv, defineConfig } = require('@medusajs/framework/utils')

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS,
      adminCors: process.env.ADMIN_CORS,
      authCors: process.env.AUTH_CORS,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
      port: process.env.PORT || 9000,
    }
  },
  admin: {
    disable: false,
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