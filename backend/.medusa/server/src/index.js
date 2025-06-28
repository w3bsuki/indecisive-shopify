"use strict";
/**
 * Application Entry Point with Production Enhancements
 *
 * This file integrates all production-ready components:
 * - Environment validation
 * - Worker management
 * - Database pooling
 * - Redis caching
 * - Graceful shutdown
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startApplication = startApplication;
const worker_manager_1 = require("./utils/worker-manager");
const validate_env_1 = require("./scripts/validate-env");
const database_config_1 = require("./utils/database-config");
const redis_config_1 = require("./utils/redis-config");
const cluster_1 = __importDefault(require("cluster"));
/**
 * Start the application with production features
 */
async function startApplication(config = {
    enableClustering: process.env.ENABLE_CLUSTERING === 'true',
    enableRedis: !!process.env.REDIS_URL,
    validateEnvironment: process.env.NODE_ENV === 'production',
}) {
    try {
        // Validate environment variables
        if (config.validateEnvironment) {
            console.log('🔍 Validating environment configuration...');
            (0, validate_env_1.validateEnv)();
        }
        // Initialize database pool
        console.log('🗄️  Initializing database connection pool...');
        const dbPool = (0, database_config_1.getDatabasePool)();
        await dbPool.testConnection();
        console.log('✅ Database connection established');
        // Initialize Redis if configured
        if (config.enableRedis) {
            console.log('🔴 Initializing Redis connection...');
            const redis = (0, redis_config_1.getRedisClient)();
            await new Promise((resolve, reject) => {
                redis.once('ready', () => {
                    console.log('✅ Redis connection established');
                    resolve();
                });
                redis.once('error', reject);
                // Timeout after 10 seconds
                setTimeout(() => reject(new Error('Redis connection timeout')), 10000);
            });
        }
        // Start worker manager if clustering is enabled
        if (config.enableClustering && cluster_1.default.isPrimary) {
            console.log('👷 Starting worker manager...');
            const workerManager = await (0, worker_manager_1.startWorkerManager)({
                maxMemoryMB: parseInt(process.env.WORKER_MAX_MEMORY || '512', 10),
                minWorkers: parseInt(process.env.WORKER_MIN || '2', 10),
                maxWorkers: parseInt(process.env.WORKER_MAX || '4', 10),
                autoScale: process.env.WORKER_AUTO_SCALE === 'true',
            });
            // Monitor worker events
            workerManager.on('worker:started', (workerId) => {
                console.log(`✅ Worker ${workerId} started`);
            });
            workerManager.on('worker:died', (workerId, code, signal) => {
                console.error(`❌ Worker ${workerId} died (${signal || code})`);
            });
            workerManager.on('worker:memory-exceeded', (workerId, memory) => {
                console.warn(`⚠️  Worker ${workerId} memory exceeded: ${memory.toFixed(2)}MB`);
            });
        }
        else {
            // Start Medusa application
            console.log('🚀 Starting Medusa application...');
            require('./medusa-start');
        }
        // Set up graceful shutdown
        setupGracefulShutdown();
    }
    catch (error) {
        console.error('❌ Failed to start application:', error);
        process.exit(1);
    }
}
/**
 * Set up graceful shutdown handlers
 */
function setupGracefulShutdown() {
    let isShuttingDown = false;
    const shutdown = async (signal) => {
        if (isShuttingDown)
            return;
        isShuttingDown = true;
        console.log(`\n🛑 Received ${signal}, starting graceful shutdown...`);
        try {
            // Shutdown database connections
            console.log('📤 Closing database connections...');
            await (0, database_config_1.shutdownDatabasePool)();
            // Shutdown Redis connections
            if (process.env.REDIS_URL) {
                console.log('📤 Closing Redis connections...');
                await (0, redis_config_1.shutdownRedis)();
            }
            console.log('✅ Graceful shutdown completed');
            process.exit(0);
        }
        catch (error) {
            console.error('❌ Error during shutdown:', error);
            process.exit(1);
        }
    };
    // Handle termination signals
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    // Handle uncaught errors
    process.on('uncaughtException', (error) => {
        console.error('❌ Uncaught Exception:', error);
        shutdown('uncaughtException');
    });
    process.on('unhandledRejection', (reason, promise) => {
        console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
        shutdown('unhandledRejection');
    });
}
/**
 * Create Medusa start wrapper
 */
function createMedusaStart() {
    const content = `/**
 * Medusa Application Starter
 * This file starts the Medusa application with the standard configuration
 */

import { Medusa } from '@medusajs/medusa'
import express from 'express'
import { getConfigFile } from '@medusajs/medusa/dist/core/config'
import { track } from '@medusajs/medusa/dist/event-bus'

async function start() {
  const configModule = getConfigFile(process.cwd(), 'medusa-config')
  
  const app = express()
  const { shutdown } = await Medusa(app, configModule)
  
  const port = process.env.PORT || 9000
  
  const server = app.listen(port, () => {
    console.log(\`✅ Medusa server started on port \${port}\`)
    track('CLI_START')
  })
  
  // Store server reference for graceful shutdown
  ;(global as any).server = server
  
  return { app, server, shutdown }
}

// Start if called directly
if (require.main === module) {
  start().catch((err) => {
    console.error('Failed to start Medusa:', err)
    process.exit(1)
  })
}

export default start
`;
    require('fs').writeFileSync(require('path').join(__dirname, 'medusa-start.ts'), content);
}
// Ensure medusa-start.ts exists
if (!require('fs').existsSync(require('path').join(__dirname, 'medusa-start.ts'))) {
    createMedusaStart();
}
// Start the application
if (require.main === module) {
    startApplication();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7R0FTRzs7Ozs7QUF1TU0sNENBQWdCO0FBck16QiwyREFBMEU7QUFDMUUseURBQW9EO0FBQ3BELDZEQUErRTtBQUMvRSx1REFBb0U7QUFDcEUsc0RBQTZCO0FBVzdCOztHQUVHO0FBQ0gsS0FBSyxVQUFVLGdCQUFnQixDQUFDLFNBQW9CO0lBQ2xELGdCQUFnQixFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEtBQUssTUFBTTtJQUMxRCxXQUFXLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUztJQUNwQyxtQkFBbUIsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsS0FBSyxZQUFZO0NBQzNEO0lBQ0MsSUFBSSxDQUFDO1FBQ0gsaUNBQWlDO1FBQ2pDLElBQUksTUFBTSxDQUFDLG1CQUFtQixFQUFFLENBQUM7WUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFBO1lBQ3pELElBQUEsMEJBQVcsR0FBRSxDQUFBO1FBQ2YsQ0FBQztRQUVELDJCQUEyQjtRQUMzQixPQUFPLENBQUMsR0FBRyxDQUFDLCtDQUErQyxDQUFDLENBQUE7UUFDNUQsTUFBTSxNQUFNLEdBQUcsSUFBQSxpQ0FBZSxHQUFFLENBQUE7UUFDaEMsTUFBTSxNQUFNLENBQUMsY0FBYyxFQUFFLENBQUE7UUFDN0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFBO1FBRWhELGlDQUFpQztRQUNqQyxJQUFJLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLHFDQUFxQyxDQUFDLENBQUE7WUFDbEQsTUFBTSxLQUFLLEdBQUcsSUFBQSw2QkFBYyxHQUFFLENBQUE7WUFFOUIsTUFBTSxJQUFJLE9BQU8sQ0FBTyxD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