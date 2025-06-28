"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
(0, utils_1.loadEnv)(process.env.NODE_ENV || 'development', process.cwd());
// Validate required environment variables
const requiredEnvVars = [
    'JWT_SECRET',
    'COOKIE_SECRET',
    'DATABASE_URL',
    'STRIPE_API_KEY',
    'STRIPE_WEBHOOK_SECRET'
];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Required environment variable ${envVar} is not set`);
    }
}
module.exports = (0, utils_1.defineConfig)({
    projectConfig: {
        databaseUrl: process.env.DATABASE_URL,
        http: {
            storeCors: process.env.STORE_CORS,
            adminCors: process.env.ADMIN_CORS,
            authCors: process.env.AUTH_CORS,
            jwtSecret: process.env.JWT_SECRET,
            cookieSecret: process.env.COOKIE_SECRET,
        },
    },
    modules: [
        {
            resolve: "@medusajs/medusa/payment",
            options: {
                providers: [
                    {
                        resolve: "@medusajs/medusa/payment-stripe",
                        id: "stripe",
                        options: {
                            apiKey: process.env.STRIPE_API_KEY,
                            webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
                            // Production configuration
                            automatic_payment_methods: false,
                            payment_method_types: [
                                "card",
                                "ideal", // European payments
                                "sepa_debit", // SEPA Direct Debit
                                "bancontact", // Belgium
                                "giropay", // Germany
                                "eps", // Austria
                                "p24", // Poland
                                "alipay", // China
                                "wechat_pay", // China
                                "klarna", // Buy now, pay later
                                "afterpay_clearpay", // Buy now, pay later
                                "link", // Stripe Link
                            ],
                            capture: true, // Auto-capture payments
                            payment_description: "Indecisive Wear Store Purchase",
                            // Fraud prevention
                            stripe_options: {
                                apiVersion: "2024-11-20.acacia",
                            },
                        },
                    },
                ],
            },
        },
        {
            resolve: "@medusajs/medusa/tax",
            options: {
                providers: [
                    {
                        resolve: "@medusajs/medusa/tax-system",
                        id: "system",
                        options: {
                        // Tax configuration for different regions
                        },
                    },
                ],
            },
        },
    ],
    plugins: [
        {
            resolve: `medusa-file-supabase`,
            options: {
                project_url: process.env.SUPABASE_URL,
                api_key: process.env.SUPABASE_KEY,
                bucket: process.env.SUPABASE_BUCKET,
            },
        },
    ],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVkdXNhLWNvbmZpZy5wcm9kdWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbWVkdXNhLWNvbmZpZy5wcm9kdWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscURBQTBFO0FBRTFFLElBQUEsZUFBTyxFQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxJQUFJLGFBQWEsRUFBRSxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQTtBQUU3RCwwQ0FBMEM7QUFDMUMsTUFBTSxlQUFlLEdBQUc7SUFDdEIsWUFBWTtJQUNaLGVBQWU7SUFDZixjQUFjO0lBQ2QsZ0JBQWdCO0lBQ2hCLHVCQUF1QjtDQUN4QixDQUFBO0FBRUQsS0FBSyxNQUFNLE1BQU0sSUFBSSxlQUFlLEVBQUUsQ0FBQztJQUNyQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO1FBQ3pCLE1BQU0sSUFBSSxLQUFLLENBQUMsaUNBQWlDLE1BQU0sYUFBYSxDQUFDLENBQUE7SUFDdkUsQ0FBQztBQUNILENBQUM7QUFFRCxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUEsb0JBQVksRUFBQztJQUM1QixhQUFhLEVBQUU7UUFDYixXQUFXLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFhO1FBQ3RDLElBQUksRUFBRTtZQUNKLFNBQVMsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVc7WUFDbEMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVztZQUNsQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFVO1lBQ2hDLFNBQVMsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVc7WUFDbEMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYztTQUN6QztLQUNGO0lBQ0QsT0FBTyxFQUFFO1FBQ1A7WUFDRSxPQUFPLEVBQUUsMEJBQTBCO1lBQ25DLE9BQU8sRUFBRTtnQkFDUCxTQUFTLEVBQUU7b0JBQ1Q7d0JBQ0UsT0FBTyxFQUFFLGlDQUFpQzt3QkFDMUMsRUFBRSxFQUFFLFFBQVE7d0JBQ1osT0FBTyxFQUFFOzRCQUNQLE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWM7NEJBQ2xDLGFBQWEsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQjs0QkFDaEQsMkJBQTJCOzRCQUMzQix5QkFBeUIsRUFBRSxLQUFLOzRCQUNoQyxvQkFBb0IsRUFBRTtnQ0FDcEIsTUFBTTtnQ0FDTixPQUFPLEVBQUUsb0JBQW9CO2dDQUM3QixZQUFZLEVBQUUsb0JBQW9CO2dDQUNsQyxZQUFZLEVBQUUsVUFBVTtnQ0FDeEIsU0FBUyxFQUFFLFVBQVU7Z0NBQ3JCLEtBQUssRUFBRSxVQUFVO2dDQUNqQixLQUFLLEVBQUUsU0FBUztnQ0FDaEIsUUFBUSxFQUFFLFFBQVE7Z0NBQ2xCLFlBQVksRUFBRSxRQUFRO2dDQUN0QixRQUFRLEVBQUUscUJBQXFCO2dDQUMvQixtQkFBbUIsRUFBRSxxQkFBcUI7Z0NBQzFDLE1BQU0sRUFBRSxjQUFjOzZCQUN2Qjs0QkFDRCxPQUFPLEVBQUUsSUFBSSxFQUFFLHdCQUF3Qjs0QkFDdkMsbUJBQW1CLEVBQUUsZ0NBQWdDOzRCQUNyRCxtQkFBbUI7NEJBQ25CLGNBQWMsRUFBRTtnQ0FDZCxVQUFVLEVBQUUsbUJBQW1COzZCQUNoQzt5QkFDRjtxQkFDRjtpQkFDRjthQUNGO1NBQ0Y7UUFDRDtZQUNFLE9BQU8sRUFBRSxzQkFBc0I7WUFDL0IsT0FBTyxFQUFFO2dCQUNQLFNBQVMsRUFBRTtvQkFDVDt3QkFDRSxPQUFPLEVBQUUsNkJBQTZCO3dCQUN0QyxFQUFFLEVBQUUsUUFBUTt3QkFDWixPQUFPLEVBQUU7d0JBQ1AsMENBQTBDO3lCQUMzQztxQkFDRjtpQkFDRjthQUNGO1NBQ0Y7S0FDRjtJQUNELE9BQU8sRUFBRTtRQUNQO1lBQ0UsT0FBTyxFQUFFLHNCQUFzQjtZQUMvQixPQUFPLEVBQUU7Z0JBQ1AsV0FBVyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWTtnQkFDckMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWTtnQkFDakMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZTthQUNwQztTQUNGO0tBQ0Y7Q0FDRixDQUFDLENBQUEifQ==