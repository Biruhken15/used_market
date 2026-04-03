import React from 'react';
import { Lock, FileText, UserCheck, Shield, Eye, Globe } from 'lucide-react';

export const metadata = {
    title: 'Privacy Policy | ከሰው እጅ Marketplace',
    description: 'Our commitment to protecting your personal data and privacy.',
};

const sections = [
    {
        title: "Introduction",
        content: "At ከሰው እጅ Marketplace, your privacy is our top priority. This policy outlines how we collect, use, and protect your information when you use our platform.",
        icon: <FileText className="w-5 h-5 text-violet-500" />
    },
    {
        title: "Information We Collect",
        content: "We collect information you provide directly, such as your name, email, phone number, and store details. We also collect usage data to improve your experience.",
        icon: <UserCheck className="w-5 h-5 text-pink-500" />
    },
    {
        title: "How We Use Your Data",
        content: "Your data is used to provide services, personalize your experience, process transactions, and communicate with you about your account or our services.",
        icon: <Shield className="w-5 h-5 text-blue-500" />
    },
    {
        title: "Third-Party Sharing",
        content: "We do not sell your personal data. We only share information with trusted partners for service delivery (e.g., payment processing or cloud storage).",
        icon: <Globe className="w-5 h-5 text-emerald-500" />
    },
    {
        title: "Your Privacy Choices",
        content: "You have the right to access, update, or delete your information at any time through your account settings or by contacting our support team.",
        icon: <Eye className="w-5 h-5 text-amber-500" />
    }
];

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white pt-24 pb-16 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-center gap-4 mb-12">
                    <div className="p-3 bg-violet-100 rounded-full">
                        <Lock className="w-8 h-8 text-violet-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900">Privacy Policy</h1>
                </div>

                <p className="text-center text-slate-600 mb-16 text-lg">Last updated: April 3, 2026</p>

                <div className="space-y-12 mb-16">
                    {sections.map((section, index) => (
                        <div key={index} className="flex gap-6 group">
                            <div className="shrink-0 mt-1">
                                <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-violet-50 transition-colors">
                                    {section.icon}
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">{section.title}</h3>
                                <p className="text-slate-600 leading-relaxed text-lg">{section.content}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                    <h3 className="text-xl font-bold mb-4 text-slate-900">Questions or Concerns?</h3>
                    <p className="text-slate-600 mb-6 leading-relaxed">If you have any questions about this policy or our privacy practices, please reach out to our dedicated privacy office.</p>
                    <a href="mailto:privacy@ethiousedmarket.com" className="text-violet-600 font-bold hover:underline">privacy@ethiousedmarket.com</a>
                </div>
            </div>
        </div>
    );
}
