import { MedusaRequest, MedusaResponse } from "@medusajs/framework"

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    // The Stripe payment module handles webhook verification internally
    // This endpoint is automatically registered by the payment-stripe module
    // at the path: /hooks/payment/stripe
    
    res.status(200).json({ received: true })
  } catch (error) {
    console.error("Stripe webhook error:", error)
    res.status(400).json({ error: "Webhook error" })
  }
}