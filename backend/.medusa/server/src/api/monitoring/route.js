"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.HEAD = HEAD;
const utils_1 = require("@medusajs/framework/utils");
async function GET(req, res) {
    const startTime = Date.now();
    // Get services from container
    const container = req.scope;
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    // Basic health metrics
    const metrics = {
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development",
        version: process.env.npm_package_version || "unknown",
        // System metrics
        system: {
            platform: process.platform,
            nodeVersion: process.version,
            memory: {
                used: process.memoryUsage().heapUsed / 1024 / 1024,
                total: process.memoryUsage().heapTotal / 1024 / 1024,
                rss: process.memoryUsage().rss / 1024 / 1024,
                external: process.memoryUsage().external / 1024 / 1024,
            },
            cpu: process.cpuUsage(),
        },
        // Service health checks
        services: {
            database: "unknown",
            redis: "unknown",
            storage: "unknown",
        },
    };
    // Check database health
    try {
        const knex = container.resolve(utils_1.ContainerRegistrationKeys.PG_CONNECTION);
        await knex.raw("SELECT 1");
        metrics.services.database = "healthy";
    }
    catch (error) {
        metrics.services.database = "unhealthy";
        metrics.status = "degraded";
        logger.error("Database health check failed", error);
    }
    // Check Redis health
    try {
        const redis = container.resolve(utils_1.ContainerRegistrationKeys.REDIS);
        if (redis && redis.ping) {
            await redis.ping();
            metrics.services.redis = "healthy";
        }
        else {
            metrics.services.redis = "not configured";
        }
    }
    catch (error) {
        metrics.services.redis = "unhealthy";
        metrics.status = "degraded";
        logger.error("Redis health check failed", error);
    }
    // Check storage health (Supabase)
    try {
        if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
            // Simple check to see if environment is configured
            metrics.services.storage = "configured";
        }
        else {
            metrics.services.storage = "not configured";
        }
    }
    catch (error) {
        metrics.services.storage = "error";
        logger.error("Storage health check failed", error);
    }
    // Add response time
    const responseTime = Date.now() - startTime;
    // Set appropriate status code
    const statusCode = metrics.status === "healthy" ? 200 : 503;
    res.status(statusCode).json({
        ...metrics,
        responseTime: `${responseTime}ms`,
    });
}
// Lightweight health check endpoint
async function HEAD(req, res) {
    res.status(200).end();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvYXBpL21vbml0b3Jpbmcvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSxrQkFxRkM7QUFHRCxvQkFFQztBQTVGRCxxREFBcUU7QUFFOUQsS0FBSyxVQUFVLEdBQUcsQ0FBQyxHQUFrQixFQUFFLEdBQW1CO0lBQy9ELE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQTtJQUU1Qiw4QkFBOEI7SUFDOUIsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQTtJQUMzQixNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBRWxFLHVCQUF1QjtJQUN2QixNQUFNLE9BQU8sR0FBRztRQUNkLE1BQU0sRUFBRSxTQUFTO1FBQ2pCLFNBQVMsRUFBRSxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRTtRQUNuQyxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU0sRUFBRTtRQUN4QixXQUFXLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLElBQUksYUFBYTtRQUNsRCxPQUFPLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsSUFBSSxTQUFTO1FBRXJELGlCQUFpQjtRQUNqQixNQUFNLEVBQUU7WUFDTixRQUFRLEVBQUUsT0FBTyxDQUFDLFFBQVE7WUFDMUIsV0FBVyxFQUFFLE9BQU8sQ0FBQyxPQUFPO1lBQzVCLE1BQU0sRUFBRTtnQkFDTixJQUFJLEVBQUUsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsR0FBRyxJQUFJLEdBQUcsSUFBSTtnQkFDbEQsS0FBSyxFQUFFLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxTQUFTLEdBQUcsSUFBSSxHQUFHLElBQUk7Z0JBQ3BELEdBQUcsRUFBRSxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksR0FBRyxJQUFJO2dCQUM1QyxRQUFRLEVBQUUsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsR0FBRyxJQUFJLEdBQUcsSUFBSTthQUN2RDtZQUNELEdBQUcsRUFBRSxPQUFPLENBQUMsUUFBUSxFQUFFO1NBQ3hCO1FBRUQsd0JBQXdCO1FBQ3hCLFFBQVEsRUFBRTtZQUNSLFFBQVEsRUFBRSxTQUFTO1lBQ25CLEtBQUssRUFBRSxTQUFTO1lBQ2hCLE9BQU8sRUFBRSxTQUFTO1NBQ25CO0tBQ0YsQ0FBQTtJQUVELHdCQUF3QjtJQUN4QixJQUFJLENBQUM7UUFDSCxNQUFNLElBQUksR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLGFBQWEsQ0FBQyxDQUFBO1FBQ3ZFLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQTtRQUMxQixPQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUE7SUFDdkMsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZixPQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUE7UUFDdkMsT0FBTyxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUE7UUFDM0IsTUFBTSxDQUFDLEtBQUssQ0FBQyw4QkFBOEIsRUFBRSxLQUFLLENBQUMsQ0FBQTtJQUNyRCxDQUFDO0lBRUQscUJBQXFCO0lBQ3JCLElBQUksQ0FBQztRQUNILE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsS0FBSyxDQUFRLENBQUE7UUFDdkUsSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3hCLE1BQU0sS0FBSyxDQUFDLElBQUksRUFBRSxDQUFBO1lBQ2xCLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQTtRQUNwQyxDQUFDO2FBQU0sQ0FBQztZQUNOLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLGdCQUFnQixDQUFBO1FBQzNDLENBQUM7SUFDSCxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQTtRQUNwQyxPQUFPLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQTtRQUMzQixNQUFNLENBQUMsS0FBSyxDQUFDLDJCQUEyQixFQUFFLEtBQUssQ0FBQyxDQUFBO0lBQ2xELENBQUM7SUFFRCxrQ0FBa0M7SUFDbEMsSUFBSSxDQUFDO1FBQ0gsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3pELG1EQUFtRDtZQUNuRCxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUE7UUFDekMsQ0FBQzthQUFNLENBQUM7WUFDTixPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQTtRQUM3QyxDQUFDO0lBQ0gsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZixPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7UUFDbEMsTUFBTSxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsRUFBRSxLQUFLLENBQUMsQ0FBQTtJQUNwRCxDQUFDO0lBRUQsb0JBQW9CO0lBQ3BCLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxTQUFTLENBQUE7SUFFM0MsOEJBQThCO0lBQzlCLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQTtJQUUzRCxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUMxQixHQUFHLE9BQU87UUFDVixZQUFZLEVBQUUsR0FBRyxZQUFZLElBQUk7S0FDbEMsQ0FBQyxDQUFBO0FBQ0osQ0FBQztBQUVELG9DQUFvQztBQUM3QixLQUFLLFVBQVUsSUFBSSxDQUFDLEdBQWtCLEVBQUUsR0FBbUI7SUFDaEUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQTtBQUN2QixDQUFDIn0=