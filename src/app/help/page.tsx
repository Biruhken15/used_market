import React from 'react';
import { HelpCircle, Book, MessageCircle, ShieldCheck, Zap, CreditCard } from 'lucide-react';

export const metadata = {
    title: 'Help Center | ከሰው እጅ Marketplace',
    description: 'Find answers to your questions about using ከሰው እጅ Marketplace.',
};

const faqs = [
    {
        question: "How do I start selling?",
        answer: "To start selling, create an account, go to your dashboard, and set up your store. Once your store is active, you can begin listing products.",
        icon: <Zap className="w-5 h-5 text-violet-500" />
    },
    {
        question: "Is there a listing fee?",
        answer: "We offer multiple subscription plans. Our 'Free Trial' plan allows you to list up to 50 products for free. For higher limits and premium features, check our Pricing page.",
        icon: <CreditCard className="w-5 h-5 text-pink-500" />
    },
    {
        question: "How do buyers contact me?",
        answer: "Buyers can message you directly through our built-in chat system or contact you via the phone/Telegram details provided in your store profile.",
        icon: <MessageCircle className="w-5 h-5 text-blue-500" />
    },
    {
        question: "Is my data secure?",
        answer: "Yes, we use industry-standard encryption and security practices to protect your data and transactions.",
        icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />
    }
];

export default function HelpPage() {
    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-16 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Help Center</h1>
                    <p className="text-lg text-slate-600">Everything you need to know about using our platform.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-4">
                                {faq.icon}
                                <h3 className="font-semibold text-slate-900">{faq.question}</h3>
                            </div>
                            <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-violet-600 rounded-3xl p-10 text-center text-white">
                    <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
                    <p className="mb-8 opacity-90 text-lg">Our support team is here to help you 24/7.</p>
                    <a 
                        href="/contact" 
                        className="inline-flex items-center gap-2 bg-white text-violet-600 px-8 py-4 rounded-full font-bold hover:bg-slate-100 transition-colors"
                    >
                        <MessageCircle className="w-5 h-5" />
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
}
