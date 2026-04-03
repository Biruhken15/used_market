import React from 'react';
import { ShieldCheck, UserCheck, Smartphone, Eye, MapPin, AlertTriangle } from 'lucide-react';

export const metadata = {
    title: 'Safety Tips | ከሰው እጅ Marketplace',
    description: 'Learn how to stay safe while buying and selling on our platform.',
};

const safetyTips = [
    {
        title: "Meet in public",
        description: "Always meet buyers or sellers in a public, well-lit place. Avoid secluded areas and never meet alone if possible.",
        icon: <MapPin className="w-8 h-8 text-violet-500" />
    },
    {
        title: "Inspect before paying",
        description: "Carefully examine the item before handing over any money. Ensure it matches the description and photos provided.",
        icon: <Eye className="w-8 h-8 text-pink-500" />
    },
    {
        title: "Use secure communication",
        description: "Keep all your initial communication within our platform. Be wary of anyone who asks for your private contact details immediately.",
        icon: <Smartphone className="w-8 h-8 text-blue-500" />
    },
    {
        title: "Trust your gut",
        description: "If a deal sounds too good to be true, it probably is. If you feel uncomfortable at any point, walk away from the transaction.",
        icon: <AlertTriangle className="w-8 h-8 text-amber-500" />
    },
    {
        title: "Verify the user",
        description: "Check the seller's profile, ratings, and reviews from previous transactions. A verified badge is another sign of trust.",
        icon: <UserCheck className="w-8 h-8 text-emerald-500" />
    }
];

export default function SafetyPage() {
    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-16 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col items-center text-center mb-16">
                    <div className="p-4 bg-violet-100 rounded-full mb-6">
                        <ShieldCheck className="w-12 h-12 text-violet-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Your Safety is Our Priority</h1>
                    <p className="max-w-2xl text-lg text-slate-600">We want every transaction to be safe and secure. Follow these guidelines to protect yourself while buying and selling.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {safetyTips.map((tip, index) => (
                        <div key={index} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:scale-105 transition-transform duration-300">
                            <div className="mb-6">{tip.icon}</div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{tip.title}</h3>
                            <p className="text-slate-600 leading-relaxed">{tip.description}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-slate-900 rounded-3xl p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold mb-4">Report Suspicious Activity</h2>
                        <p className="text-lg opacity-80 leading-relaxed">Seen something that doesn't look right? Help us keep the community safe by reporting any suspicious listings or behaviors.</p>
                    </div>
                    <button className="bg-pink-500 text-white px-10 py-4 rounded-full font-bold hover:bg-pink-600 transition-colors shrink-0">
                        Report an Issue
                    </button>
                </div>
            </div>
        </div>
    );
}
