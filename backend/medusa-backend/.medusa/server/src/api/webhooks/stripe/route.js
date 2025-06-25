"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = void 0;
const POST = async (req, res) => {
    try {
        // The Stripe payment module handles webhook verification internally
        // This endpoint is automatically registered by the payment-stripe module
        // at the path: /hooks/payment/stripe
        res.status(200).json({ received: true });
    }
    catch (error) {
        console.error("Stripe webhook error:", error);
        res.status(400).json({ error: "Webhook error" });
    }
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3dlYmhvb2tzL3N0cmlwZS9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFTyxNQUFNLElBQUksR0FBRyxLQUFLLEVBQ3ZCLEdBQWtCLEVBQ2xCLEdBQW1CLEVBQ25CLEVBQUU7SUFDRixJQUFJLENBQUM7UUFDSCxvRUFBb0U7UUFDcEUseUVBQXlFO1FBQ3pFLHFDQUFxQztRQUVyQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO0lBQzFDLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUM3QyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxlQUFlLEVBQUUsQ0FBQyxDQUFBO0lBQ2xELENBQUM7QUFDSCxDQUFDLENBQUE7QUFkWSxRQUFBLElBQUksUUFjaEIifQ==