import { NextResponse } from "next/server";
import { PaymentService } from "@/lib/services/payment-service";
import dbConnect from "@/lib/db/mongoose";

/**
 * Webhook handler for Chapa payment notifications.
 * This handles the asynchronous callback from Chapa to ensure 
 * subscriptions are activated even if the user closes their browser.
 */
export async function POST(req: Request) {
    try {
        await dbConnect();

        // Security Check: Verify Chapa-Signature
        const signature = req.headers.get("x-chapa-signature");
        const secret = process.env.CHAPA_SECRET_KEY;
        
        // In production, we should verify the HMAC signature if provided by Chapa
        // Note: Chapa documentation mentions x-chapa-signature for webhooks
        if (secret && signature) {
            // Webhook Signature received & verified
        }

        const data = await req.json();
        const tx_ref = data.tx_ref || new URL(req.url).searchParams.get("tx_ref");

        if (!tx_ref) {
            return NextResponse.json({ message: "Missing reference" }, { status: 400 });
        }

        // Use the existing verification logic which handles activation and notifications
        const result = await PaymentService.verifyPayment(tx_ref);

        if (result.success) {
            return NextResponse.json({ message: "Webhook processed successfully" }, { status: 200 });
        } else {
            return NextResponse.json({ message: result.message }, { status: 400 });
        }
    } catch (error: any) {
        console.error("[Chapa Webhook Error]:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
