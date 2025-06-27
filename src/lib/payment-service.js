import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

export const PaymentService = async (paymentBody) => {
    const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

    if (!stripePromise) {
        throw new Error("Stripe is not initialized. Please check your publishable key.");
    }
    
    try {

        const stripe = await stripePromise;
        const response = await axios.post("/bookings/create-payment-intent", paymentBody)
        if (response.status !== 201) {
            throw new Error("Failed to create payment intent. Please try again later.");
        }
        const { clientSecret, paymentIntentId } = response.data;
        return { clientSecret, paymentIntentId };
    } catch (error) {
        console.error("PaymentService error:", error);
        throw new Error("An error occurred while processing the payment. Please try again later.");
    }
    
}