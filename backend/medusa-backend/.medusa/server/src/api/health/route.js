"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const GET = async (req, res) => {
    res.json({
        status: "ok",
        message: "Backend is running",
        endpoints: {
            store: "/store",
            admin: "/admin",
            auth: "/auth"
        }
    });
};
exports.GET = GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2hlYWx0aC9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFTyxNQUFNLEdBQUcsR0FBRyxLQUFLLEVBQUUsR0FBa0IsRUFBRSxHQUFtQixFQUFFLEVBQUU7SUFDbkUsR0FBRyxDQUFDLElBQUksQ0FBQztRQUNQLE1BQU0sRUFBRSxJQUFJO1FBQ1osT0FBTyxFQUFFLG9CQUFvQjtRQUM3QixTQUFTLEVBQUU7WUFDVCxLQUFLLEVBQUUsUUFBUTtZQUNmLEtBQUssRUFBRSxRQUFRO1lBQ2YsSUFBSSxFQUFFLE9BQU87U0FDZDtLQUNGLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQTtBQVZZLFFBQUEsR0FBRyxPQVVmIn0=