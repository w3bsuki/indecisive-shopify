"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = void 0;
const stripe_1 = __importDefault(require("stripe"));
const utils_1 = require("@medusajs/framework/utils");
const stripe = new stripe_1.default(process.env.STRIPE_API_KEY, {
    apiVersion: "2024-11-20.acacia",
});
const POST = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    }
    catch (err) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }
    const paymentModule = req.scope.resolve(utils_1.Modules.PAYMENT);
    try {
        switch (event.type) {
            case "payment_intent.succeeded":
                await handlePaymentIntentSucceeded(event.data.object, paymentModule);
                break;
            case "payment_intent.payment_failed":
                await handlePaymentIntentFailed(event.data.object, paymentModule);
                break;
            case "charge.dispute.created":
                await handleDisputeCreated(event.data.object, paymentModule);
                break;
            case "charge.refunded":
                await handleChargeRefunded(event.data.object, paymentModule);
                break;
            case "checkout.session.completed":
                await handleCheckoutSessionCompleted(event.data.object, paymentModule);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
        res.json({ received: true });
    }
    catch (error) {
        console.error(`Error processing webhook: ${error}`);
        res.status(500).json({ error: "Webhook processing failed" });
    }
};
exports.POST = POST;
async function handlePaymentIntentSucceeded(paymentIntent, paymentModule) {
    // Update payment status in Medusa
    console.log(`Payment ${paymentIntent.id} succeeded`);
    // Find the payment session by payment intent ID
    try {
        const payments = await paymentModule.listPayments({
            provider_id: "pp_stripe_stripe",
            data: {
                id: paymentIntent.id
            }
        });
        if (payments.length > 0) {
            await paymentModule.updatePayment({
                id: payments[0].id,
                data: {
                    status: "captured"
                }
            });
        }
    }
    catch (error) {
        console.error("Error updating payment status:", error);
    }
}
async function handlePaymentIntentFailed(paymentIntent, paymentModule) {
    // Handle failed payment
    console.log(`Payment ${paymentIntent.id} failed: ${paymentIntent.last_payment_error?.message}`);
    try {
        const payments = await paymentModule.listPayments({
            provider_id: "pp_stripe_stripe",
            data: {
                id: paymentIntent.id
            }
        });
        if (payments.length > 0) {
            await paymentModule.updatePayment({
                id: payments[0].id,
                data: {
                    status: "failed",
                    error_message: paymentIntent.last_payment_error?.message
                }
            });
        }
    }
    catch (error) {
        console.error("Error updating failed payment:", error);
    }
}
async function handleDisputeCreated(dispute, paymentModule) {
    // Handle dispute/chargeback
    console.log(`Dispute created: ${dispute.id}`);
    // Log dispute details for manual review
    console.log({
        dispute_id: dispute.id,
        amount: dispute.amount,
        currency: dispute.currency,
        reason: dispute.reason,
        status: dispute.status,
        payment_intent: dispute.payment_intent,
    });
    // TODO: Implement dispute handling workflow
    // - Notify admin
    // - Flag order for review
    // - Gather evidence if needed
}
async function handleChargeRefunded(charge, paymentModule) {
    // Handle refund
    console.log(`Charge ${charge.id} refunded`);
    try {
        const payments = await paymentModule.listPayments({
            provider_id: "pp_stripe_stripe",
            data: {
                id: charge.payment_intent
            }
        });
        if (payments.length > 0) {
            // Create refund record
            await paymentModule.refundPayment({
                payment_id: payments[0].id,
                amount: charge.amount_refunded,
                reason: "customer_request"
            });
        }
    }
    catch (error) {
        console.error("Error processing refund:", error);
    }
}
async function handleCheckoutSessionCompleted(session, paymentModule) {
    // Handle completed checkout session
    console.log(`Checkout session ${session.id} completed`);
    // Additional processing if using Stripe Checkout
    // This might include order confirmation, inventory updates, etc.
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2hvb2tzL3BheW1lbnQvc3RyaXBlL3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLG9EQUEyQjtBQUUzQixxREFBbUQ7QUFFbkQsTUFBTSxNQUFNLEdBQUcsSUFBSSxnQkFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBZSxFQUFFO0lBQ3JELFVBQVUsRUFBRSxtQkFBbUI7Q0FDaEMsQ0FBQyxDQUFBO0FBRUssTUFBTSxJQUFJLEdBQUcsS0FBSyxFQUN2QixHQUFrQixFQUNsQixHQUFtQixFQUNuQixFQUFFO0lBQ0YsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBVyxDQUFBO0lBQ3JELE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXNCLENBQUE7SUFFeEQsSUFBSSxLQUFtQixDQUFBO0lBRXZCLElBQUksQ0FBQztRQUNILEtBQUssR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FDcEMsR0FBRyxDQUFDLElBQUksRUFDUixHQUFHLEVBQ0gsYUFBYSxDQUNkLENBQUE7SUFDSCxDQUFDO0lBQUMsT0FBTyxHQUFRLEVBQUUsQ0FBQztRQUNsQixPQUFPLENBQUMsS0FBSyxDQUFDLDBDQUEwQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQTtRQUN0RSxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLGtCQUFrQixHQUFHLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFBO0lBQ3pFLENBQUM7SUFFRCxNQUFNLGFBQWEsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FDckMsZUFBTyxDQUFDLE9BQU8sQ0FDaEIsQ0FBQTtJQUVELElBQUksQ0FBQztRQUNILFFB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