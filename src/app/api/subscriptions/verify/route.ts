import { NextResponse } from 'next/server';
import { PaymentService } from '@/lib/services/payment-service';

/**
 * API to verify a subscription payment via Chapa tx_ref.
 */
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const tx_ref = searchParams.get('tx_ref');

        if (!tx_ref) {
            return NextResponse.json({ error: 'Missing tx_ref' }, { status: 400 });
        }

        const result = await PaymentService.verifyPayment(tx_ref);

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Payment verification failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { tx_ref } = await req.json();

        if (!tx_ref) {
            return NextResponse.json({ error: 'Missing tx_ref' }, { status: 400 });
        }

        const result = await PaymentService.verifyPayment(tx_ref);

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Payment verification failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
