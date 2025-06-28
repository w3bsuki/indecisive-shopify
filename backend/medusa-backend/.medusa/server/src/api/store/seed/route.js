"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = void 0;
const seed_1 = __importDefault(require("../../../scripts/seed"));
const POST = async (req, res) => {
    try {
        // Check for a secret key to prevent abuse
        const secret = req.query.secret;
        if (secret !== "run-seed-now") {
            return res.status(401).json({ error: "Invalid secret" });
        }
        // Run the seed
        await (0, seed_1.default)({ container: req.scope, args: [] });
        // Get the publishable key that was created
        const query = req.scope.resolve("query");
        const { data: keys } = await query.graph({
            entity: "api_key",
            fields: ["id", "title", "type"],
            filters: {
                type: "publishable"
            }
        });
        res.json({
            message: "Seed completed successfully",
            publishable_key: keys[0]?.id,
            usage: `Add to frontend .env: NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${keys[0]?.id}`
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL3NlZWQvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsaUVBQWdEO0FBRXpDLE1BQU0sSUFBSSxHQUFHLEtBQUssRUFBRSxHQUFrQixFQUFFLEdBQW1CLEVBQUUsRUFBRTtJQUNwRSxJQUFJLENBQUM7UUFDSCwwQ0FBMEM7UUFDMUMsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFnQixDQUFBO1FBQ3pDLElBQUksTUFBTSxLQUFLLGNBQWMsRUFBRSxDQUFDO1lBQzlCLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFBO1FBQzFELENBQUM7UUFFRCxlQUFlO1FBQ2YsTUFBTSxJQUFBLGNBQVksRUFBQyxFQUFFLFNBQVMsRUFBRSxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFBO1FBRXRELDJDQUEyQztRQUMzQyxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUN4QyxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FBQztZQUN2QyxNQUFNLEVBQUUsU0FBUztZQUNqQixNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQztZQUMvQixPQUFPLEVBQUU7Z0JBQ1AsSUFBSSxFQUFFLGFBQW9CO2FBQzNCO1NBQ0YsQ0FBQyxDQUFBO1FBRUYsR0FBRyxDQUFDLElBQUksQ0FBQztZQUNQLE9BQU8sRUFBRSw2QkFBNkI7WUFDdEMsZUFBZSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQzVCLEtBQUssRUFBRSw0REFBNEQsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRTtTQUNqRixDQUFDLENBQUE7SUFDSixDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFBO0lBQ2hELENBQUM7QUFDSCxDQUFDLENBQUE7QUE3QlksUUFBQSxJQUFJLFFBNkJoQiJ9