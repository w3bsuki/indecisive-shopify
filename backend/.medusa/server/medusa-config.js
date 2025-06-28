"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
(0, utils_1.loadEnv)(process.env.NODE_ENV || 'development', process.cwd());
const plugins = [
    {
        resolve: `@medusajs/payment-stripe`,
        options: {
            api_key: process.env.STRIPE_API_KEY,
            webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
        },
    },
    {
        resolve: `medusa-file-supabase`,
        options: {
            project_url: process.env.SUPABASE_URL,
            api_key: process.env.SUPABASE_KEY,
            bucket: process.env.SUPABASE_BUCKET,
        },
    },
];
// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'COOKIE_SECRET', 'DATABASE_URL'];
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
    plugins,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVkdXNhLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21lZHVzYS1jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxxREFBaUU7QUFFakUsSUFBQSxlQUFPLEVBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLElBQUksYUFBYSxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFBO0FBRzdELE1BQU0sT0FBTyxHQUFHO0lBQ2Q7UUFDRSxPQUFPLEVBQUUsMEJBQTBCO1FBQ25DLE9BQU8sRUFBRTtZQUNQLE9BQU8sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWM7WUFDbkMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCO1NBQ2xEO0tBQ0Y7SUFDRDtRQUNFLE9BQU8sRUFBRSxzQkFBc0I7UUFDL0IsT0FBTyxFQUFFO1lBQ1AsV0FBVyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWTtZQUNyQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZO1lBQ2pDLE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWU7U0FDcEM7S0FDRjtDQUNGLENBQUM7QUFFRiwwQ0FBMEM7QUFDMUMsTUFBTSxlQUFlLEdBQUcsQ0FBQyxZQUFZLEVBQUUsZUFBZSxFQUFFLGNBQWMsQ0FBQyxDQUFBO0FBQ3ZFLEtBQUssTUFBTSxNQUFNLElBQUksZUFBZSxFQUFFLENBQUM7SUFDckMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUN6QixNQUFNLElBQUksS0FBSyxDQUFDLGlDQUFpQyxNQUFNLGFBQWEsQ0FBQyxDQUFBO0lBQ3ZFLENBQUM7QUFDSCxDQUFDO0FBRUQsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFBLG9CQUFZLEVBQUM7SUFDNUIsYUFBYSxFQUFFO1FBQ2IsV0FBVyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBYTtRQUN0QyxJQUFJLEVBQUU7WUFDSixTQUFTLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFXO1lBQ2xDLFNBQVMsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVc7WUFDbEMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBVTtZQUNoQyxTQUFTLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFXO1lBQ2xDLFlBQVksRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWM7U0FDekM7S0FDRjtJQUNELE9BQU87Q0FDUixDQUFDLENBQUEifQ==