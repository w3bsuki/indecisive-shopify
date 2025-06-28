"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = void 0;
const seed_1 = __importDefault(require("../../../scripts/seed"));
const POST = async (req, res) => {
    try {
        // Run the seed
        await (0, seed_1.default)({ container: req.scope, args: [] });
        // Get the publishable key that was created
        const query = req.scope.resolve("query");
        const { data: keys } = await query.graph({
            entity: "api_key",
            fields: ["id", "title", "type", "token"],
            filters: {
                type: "publishable"
            }
        });
        res.json({
            message: "Seed completed successfully",
            publishable_key: keys[0]?.id,
            frontend_env: {
                NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY: keys[0]?.id,
                NEXT_PUBLIC_MEDUSA_BACKEND_URL: "https://indecisive-wear-backend.onrender.com"
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL3NlZWQvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsaUVBQWdEO0FBRXpDLE1BQU0sSUFBSSxHQUFHLEtBQUssRUFBRSxHQUFrQixFQUFFLEdBQW1CLEVBQUUsRUFBRTtJQUNwRSxJQUFJLENBQUM7UUFDSCxlQUFlO1FBQ2YsTUFBTSxJQUFBLGNBQVksRUFBQyxFQUFFLFNBQVMsRUFBRSxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFBO1FBRXRELDJDQUEyQztRQUMzQyxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUN4QyxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FBQztZQUN2QyxNQUFNLEVBQUUsU0FBUztZQUNqQixNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUM7WUFDeEMsT0FBTyxFQUFFO2dCQUNQLElBQUksRUFBRSxhQUFvQjthQUMzQjtTQUNGLENBQUMsQ0FBQTtRQUVGLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDUCxPQUFPLEVBQUUsNkJBQTZCO1lBQ3RDLGVBQWUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtZQUM1QixZQUFZLEVBQUU7Z0JBQ1osa0NBQWtDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7Z0JBQy9DLDhCQUE4QixFQUFFLDhDQUE4QzthQUMvRTtTQUNGLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2YsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUE7SUFDaEQsQ0FBQztBQUNILENBQUMsQ0FBQTtBQTFCWSxRQUFBLElBQUksUUEwQmhCIn0=