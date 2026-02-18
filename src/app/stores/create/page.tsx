"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { StoreForm } from "@/components/store/store-form";

export default function CreateStorePage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!session) return null;

    return (
        <div className="min-h-screen bg-slate-50/50 pt-32 pb-24 px-6">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                        Create your storefront
                    </h1>
                    <p className="text-slate-500 font-medium text-lg max-w-xl mx-auto leading-relaxed">
                        Set up your professional marketplace and start selling your used products in minutes.
                    </p>
                </div>

                <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm">
                    <StoreForm />
                </div>

                <div className="mt-12 text-center">
                    <button
                        onClick={() => router.back()}
                        className="text-slate-400 font-bold text-sm hover:text-slate-900 transition-colors"
                    >
                        ← Return to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
