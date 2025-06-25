"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
(0, utils_1.loadEnv)(process.env.NODE_ENV || 'development', process.cwd());
module.exports = (0, utils_1.defineConfig)({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVkdXNhLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21lZHVzYS1jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxREFBaUU7QUFFakUsSUFBQSxlQUFPLEVBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLElBQUksYUFBYSxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFBO0FBRTdELE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBQSxvQkFBWSxFQUFDO0lBQzVCLGFBQWEsRUFBRTtRQUNiLFdBQVcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVk7UUFDckMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUztRQUMvQixJQUFJLEVBQUU7WUFDSixTQUFTLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFXO1lBQ2xDLFNBQVMsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVc7WUFDbEMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBVTtZQUNoQyxTQUFTLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLElBQUksYUFBYTtZQUNsRCxZQUFZLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLElBQUksYUFBYTtTQUN6RDtLQUNGO0lBQ0QsS0FBSyxFQUFFO1FBQ0wsT0FBTyxFQUFFLElBQUk7S0FDZDtJQUNELE9BQU8sRUFBRTtRQUNQLDBCQUEwQjtRQUMxQixHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsSUFBSTtZQUNyRSxPQUFPLEVBQUU7Z0JBQ1AsT0FBTyxFQUFFLG1CQUFtQjtnQkFDNUIsT0FBTyxFQUFFO29CQUNQLFNBQVMsRUFBRTt3QkFDVDs0QkFDRSxPQUFPLEVBQUUsMEJBQTBCOzRCQUNuQyxFQUFFLEVBQUUsUUFBUTs0QkFDWixPQUFPLEVBQUU7Z0NBQ1AsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYztnQ0FDbEMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCO2dDQUNoRCx1QkFBdUIsRUFBRSxJQUFJO2dDQUM3QixrQkFBa0IsRUFBRSw0QkFBNEI7Z0NBQ2hELE9BQU8sRUFBRSxJQUFJOzZCQUNkO3lCQUNGO3FCQUNGO2lCQUNGO2FBQ0Y7U0FDRixDQUFDO0tBQ0g7Q0FDRixDQUFDLENBQUEifQ==