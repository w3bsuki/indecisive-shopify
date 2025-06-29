import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

// Log critical environment variables for debugging
console.log('🔍 Medusa Config Loading...')
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('PORT:', process.env.PORT || 'Not set (will default to 9000)')
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'NOT SET!')
console.log('REDIS_URL:', process.env.REDIS_URL ? 'Set' : 'Not set')

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    // Worker mode configuration for container dependency resolution
    workerMode: process.env.MEDUSA_WORKER_MODE as "shared" | "worker" | "server" || "shared",
    http: {
      storeCors: process.env.STORE_CORS || "*",
      adminCors: process.env.ADMIN_CORS || "*",
      authCors: process.env.AUTH_CORS || "*",
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  admin: {
    disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
    backendUrl: process.env.MEDUSA_BACKEND_URL || "http://localhost:9000",
  },
  modules: {
    // Redis modules for production scaling - only enable when Redis is available
    ...(process.env.REDIS_URL && {
      cacheService: {
        resolve: "@medusajs/cache-redis",
        options: {
          redisUrl: process.env.REDIS_URL,
        },
      },
      eventBus: {
        resolve: "@medusajs/event-bus-redis",
        options: {
          redisUrl: process.env.REDIS_URL,
        },
      },
      // Workflow engine: only enable when Redis is available and in production
      // This resolves the "AwilixResolutionError: Could not resolve 'sharedContainer'" error
      ...(process.env.NODE_ENV === 'production' && process.env.REDIS_URL && {
        workflowEngine: {
          resolve: "@medusajs/workflow-engine-redis",
          options: {
            redis: {
              url: process.env.REDIS_URL,
            },
          },
        },
      }),
    }),
    
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
