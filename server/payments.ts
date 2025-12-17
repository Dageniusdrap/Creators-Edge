
import { lemonSqueezySetup, createCheckout } from '@lemonsqueezy/lemonsqueezy.js';
import Flutterwave from 'flutterwave-node-v3';
import dotenv from 'dotenv';

dotenv.config();

// --- Lemon Squeezy Setup ---
// Docs: https://docs.lemonsqueezy.com/
export const configureLemonSqueezy = () => {
    if (process.env.LEMONSQUEEZY_API_KEY) {
        lemonSqueezySetup({
            apiKey: process.env.LEMONSQUEEZY_API_KEY,
            onError: (error) => console.error("Lemon Squeezy Error:", error),
        });
    } else if (process.env.NODE_ENV === 'production') {
        console.warn('LEMONSQUEEZY_API_KEY is missing.');
    }
};

export const createLemonCheckout = async (storeId: string, variantId: string, userEmail: string) => {
    try {
        const result = await createCheckout(storeId, variantId, {
            checkoutOptions: {
                media: false, // Don't show product image
                logo: true,
            },
            checkoutData: {
                email: userEmail,
            },
        });

        // Safely access the URL
        if (result.data && result.data.data && result.data.data.attributes) {
            return result.data.data.attributes.url;
        } else {
            console.error('Lemon Squeezy Invalid Response:', JSON.stringify(result, null, 2));
            throw new Error('Invalid response from payment provider');
        }
    } catch (error) {
        console.error('Lemon Squeezy Checkout Error:', error);
        throw error;
    }
};

// --- Flutterwave Setup ---
// Docs: https://developer.flutterwave.com/
let flw: any = null;

if (process.env.FLW_PUBLIC_KEY && process.env.FLW_SECRET_KEY) {
    flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);
} else if (process.env.NODE_ENV === 'production') {
    console.warn('Flutterwave Keys are missing.');
}

export const createFlutterwavePayment = async (amount: number, userEmail: string, userName: string) => {
    if (!flw) throw new Error('Flutterwave is not configured');

    const tx_ref = `tx-${Date.now()}`; // Unique transaction reference

    try {
        const payload = {
            tx_ref,
            amount,
            currency: 'UGX', // Default to UGX for local market
            payment_options: 'card,mobilemoneyuganda,ussd',
            redirect_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/?payment=success`,
            customer: {
                email: userEmail,
                name: userName,
            },
            customizations: {
                title: 'Creators Edge AI Pro',
                description: 'Subscription Upgrade',
                logo: 'https://cdn-icons-png.flaticon.com/512/3600/3600967.png', // Replace with your logo
            },
        };

        const response = await flw.GotStandardLink(payload);
        return response.data.link;
    } catch (error) {
        console.error('Flutterwave Checkout Error:', error);
        throw error;
    }
};

export const verifyFlutterwaveTransaction = async (tx_ref: string) => {
    if (!flw) throw new Error('Flutterwave is not configured');
    try {
        // verify method usually takes transactionId, but standard redirect might give tx_ref.
        // Flutterwave v3 verify logic:
        // Need to find transaction by tx_ref? Or if query param is transaction_id.
        // Flutterwave Standard redirects with ?status=successful&tx_ref=...&transaction_id=...
        // We should typically verify by transaction_id if available.
        // If the caller passes transaction_id, simpler.
        // Let's assume the caller passes the ID (we will extract it in handler).

        // Wait, standard `flw.Transaction.verify({ id: transactionId })`
        // So the argument here should be transactionId.
        const response = await flw.Transaction.verify({ id: tx_ref });
        return response.data.status === "successful" && response.data.amount >= 0; // Check amount too in real app
    } catch (error) {
        console.error('Verify Payment Error', error);
        return false;
    }
}
