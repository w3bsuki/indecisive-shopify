"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const GET = async (req, res) => {
    try {
        // Get existing publishable keys
        const query = req.scope.resolve("query");
        const { data: keys } = await query.graph({
            entity: "api_key",
            fields: ["id", "title", "type", "created_at"],
            filters: { type: "publishable" }
        });
        if (keys.length === 0) {
            return res.json({
                error: "No publishable keys found",
                message: "Run the seed script first"
            });
        }
        res.json({
            publishable_key: keys[0].id,
            all_keys: keys,
            instructions: `Add to your frontend .env.local:
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${keys[0].id}
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://indecisive-wear-backend.onrender.com`
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.GET = GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2dldC1rZXkvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRU8sTUFBTSxHQUFHLEdBQUcsS0FBSyxFQUFFLEdBQWtCLEVBQUUsR0FBbUIsRUFBRSxFQUFFO0lBQ25FLElBQUksQ0FBQztRQUNILGdDQUFnQztRQUNoQyxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUN4QyxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FBQztZQUN2QyxNQUFNLEVBQUUsU0FBUztZQUNqQixNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxZQUFZLENBQUM7WUFDN0MsT0FBTyxFQUFFLEVBQUUsSUFBSSxFQUFFLGFBQW9CLEVBQUU7U0FDeEMsQ0FBQyxDQUFBO1FBRUYsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQ3RCLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQztnQkFDZCxLQUFLLEVBQUUsMkJBQTJCO2dCQUNsQyxPQUFPLEVBQUUsMkJBQTJCO2FBQ3JDLENBQUMsQ0FBQTtRQUNKLENBQUM7UUFFRCxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQ1AsZUFBZSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQzNCLFFBQVEsRUFBRSxJQUFJO1lBQ2QsWUFBWSxFQUFFO3FDQUNpQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTs0RUFDNkI7U0FDdkUsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQTtJQUNoRCxDQUFDO0FBQ0gsQ0FBQyxDQUFBO0FBM0JZLFFBQUEsR0FBRyxPQTJCZiJ9