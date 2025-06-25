"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
(0, utils_1.loadEnv)(process.env.NODE_ENV || 'development', process.cwd());
exports.default = (0, utils_1.defineConfig)({
    projectConfig: {
        databaseUrl: process.env.DATABASE_URL,
        redisUrl: process.env.REDIS_URL,
        http: {
            storeCors: process.env.STORE_CORS,
            adminCors: process.env.ADMIN_CORS,
            authCors: process.env.AUTH_CORS,
            jwtSecret: process.env.JWT_SECRET || "supersecret",
            cookieSecret: process.env.COOKIE_SECRET || "supersecret",
        }
    },
    admin: {
        disable: true,
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVkdXNhLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21lZHVzYS1jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxREFBaUU7QUFFakUsSUFBQSxlQUFPLEVBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLElBQUksYUFBYSxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFBO0FBRTdELGtCQUFlLElBQUEsb0JBQVksRUFBQztJQUMxQixhQUFhLEVBQUU7UUFDYixXQUFXLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZO1FBQ3JDLFFBQVEsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVM7UUFDL0IsSUFBSSxFQUFFO1lBQ0osU0FBUyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVztZQUNsQyxTQUFTLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFXO1lBQ2xDLFFBQVEsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVU7WUFDaEMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxJQUFJLGFBQWE7WUFDbEQsWUFBWSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxJQUFJLGFBQWE7U0FDekQ7S0FDRjtJQUNELEtBQUssRUFBRTtRQUNMLE9BQU8sRUFBRSxJQUFJO0tBQ2Q7SUFDRCxPQUFPLEVBQUU7UUFDUCwwQkFBMEI7UUFDMUIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLElBQUk7WUFDckUsT0FBTyxFQUFFO2dCQUNQLE9BQU8sRUFBRSxtQkFBbUI7Z0JBQzVCLE9BQU8sRUFBRTtvQkFDUCxTQUFTLEVBQUU7d0JBQ1Q7NEJBQ0UsT0FBTyxFQUFFLDBCQUEwQjs0QkFDbkMsRUFBRSxFQUFFLFFBQVE7NEJBQ1osT0FBTyxFQUFFO2dDQUNQLE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWM7Z0NBQ2xDLGFBQWEsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQjtnQ0FDaEQsdUJBQXVCLEVBQUUsSUFBSTtnQ0FDN0Isa0JBQWtCLEVBQUUsNEJBQTRCO2dDQUNoRCxPQUFPLEVBQUUsSUFBSTs2QkFDZDt5QkFDRjtxQkFDRjtpQkFDRjthQUNGO1NBQ0YsQ0FBQztLQUNIO0NBQ0YsQ0FBQyxDQUFBIn0=