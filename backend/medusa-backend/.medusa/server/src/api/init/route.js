"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const seed_1 = __importDefault(require("../../scripts/seed"));
const GET = async (req, res) => {
    try {
        const secret = req.query.secret;
        if (secret !== "init-now-please") {
            return res.status(401).json({ error: "Invalid secret" });
        }
        // Run the seed
        await (0, seed_1.default)({ container: req.scope, args: [] });
        // Get the publishable key
        const query = req.scope.resolve("query");
        const { data: keys } = await query.graph({
            entity: "api_key",
            fields: ["id", "title", "type"],
            filters: { type: "publishable" }
        });
        res.json({
            success: true,
            publishable_key: keys[0]?.id,
            instructions: `Add to your frontend .env.local:
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${keys[0]?.id}
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://indecisive-wear-backend.onrender.com`
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.GET = GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2luaXQvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsOERBQTZDO0FBRXRDLE1BQU0sR0FBRyxHQUFHLEtBQUssRUFBRSxHQUFrQixFQUFFLEdBQW1CLEVBQUUsRUFBRTtJQUNuRSxJQUFJLENBQUM7UUFDSCxNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQWdCLENBQUE7UUFDekMsSUFBSSxNQUFNLEtBQUssaUJBQWlCLEVBQUUsQ0FBQztZQUNqQyxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLGdCQUFnQixFQUFFLENBQUMsQ0FBQTtRQUMxRCxDQUFDO1FBRUQsZUFBZTtRQUNmLE1BQU0sSUFBQSxjQUFZLEVBQUMsRUFBRSxTQUFTLEVBQUUsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUV0RCwwQkFBMEI7UUFDMUIsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDeEMsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUM7WUFDdkMsTUFBTSxFQUFFLFNBQVM7WUFDakIsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUM7WUFDL0IsT0FBTyxFQUFFLEVBQUUsSUFBSSxFQUFFLGFBQW9CLEVBQUU7U0FDeEMsQ0FBQyxDQUFBO1FBRUYsR0FBRyxDQUFDLElBQUksQ0FBQztZQUNQLE9BQU8sRUFBRSxJQUFJO1lBQ2IsZUFBZSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQzVCLFlBQVksRUFBRTtxQ0FDaUIsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7NEVBQzRCO1NBQ3ZFLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2YsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUE7SUFDaEQsQ0FBQztBQUNILENBQUMsQ0FBQTtBQTVCWSxRQUFBLEdBQUcsT0E0QmYifQ==