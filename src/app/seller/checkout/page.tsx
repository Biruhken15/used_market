import React, { Suspense } from 'react';
import CheckoutForm from './CheckoutForm';
import { Navbar } from '@/components/common/navbar';

export const metadata = {
    title: 'Subscribe | KesewEj',
    description: 'Upgrade your store with premium plans.',
};

export default function CheckoutPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-32 pb-20 px-6">
                <Suspense fallback={<div className="p-20 text-center">Loading checkout...</div>}>
                    <CheckoutForm />
                </Suspense>
            </div>
        </main>
    );
}
