"use client";

import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, MapPin, Send, Instagram, Twitter, Facebook } from 'lucide-react';

const contactMethods = [
    {
        title: "Email Support",
        detail: "support@ethiousedmarket.com",
        icon: <Mail className="w-6 h-6 text-violet-500" />
    },
    {
        title: "Call Us",
        detail: "+251 900 000 000",
        icon: <Phone className="w-6 h-6 text-pink-500" />
    },
    {
        title: "Visit Us",
        detail: "Addis Ababa, Ethiopia",
        icon: <MapPin className="w-6 h-6 text-blue-500" />
    }
];

const initialFormState = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
};

export default function ContactPage() {
    const [form, setForm] = useState(initialFormState);
    const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (field: keyof typeof initialFormState, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatus(null);
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            });

            const data = await response.json();

            if (!response.ok) {
                setStatus({ type: 'error', text: data.error || 'Failed to submit your message.' });
            } else {
                setStatus({ type: 'success', text: data.message || 'Your message was sent successfully.' });
                setForm(initialFormState);
            }
        } catch (error) {
            setStatus({ type: 'error', text: 'Failed to send message. Please try again later.' });
            console.error('Contact form submission failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-16 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Get in Touch</h1>
                    <p className="text-lg text-slate-600">We're here to help and answer any questions you may have.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {contactMethods.map((method, index) => (
                        <div key={index} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                            <div className="mb-4">{method.icon}</div>
                            <h3 className="font-bold text-slate-900 mb-2">{method.title}</h3>
                            <p className="text-slate-600 italic">{method.detail}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-[40px] shadow-xl overflow-hidden flex flex-col lg:flex-row border border-slate-100">
                    <div className="lg:w-1/2 p-12 lg:p-16 bg-violet-600 text-white">
                        <h2 className="text-3xl font-bold mb-6">Send us a Message</h2>
                        <p className="text-lg opacity-80 mb-12">Whether you have a suggestion, a problem, or just want to say hi, our team is waiting to hear from you.</p>

                        <div className="space-y-8 mb-12">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-violet-600 rounded-2xl">
                                    <MessageSquare className="w-6 h-6" />
                                </div>
                                <span className="text-xl">Available 24/7 for you</span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <a href="#" className="p-4 bg-violet-600 rounded-full hover:bg-violet-700 transition-colors"><Instagram className="w-5 h-5" /></a>
                            <a href="#" className="p-4 bg-violet-600 rounded-full hover:bg-violet-700 transition-colors"><Twitter className="w-5 h-5" /></a>
                            <a href="#" className="p-4 bg-violet-600 rounded-full hover:bg-violet-700 transition-colors"><Facebook className="w-5 h-5" /></a>
                        </div>
                    </div>

                    <div className="lg:w-1/2 p-12 lg:p-16">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="contact-name" className="text-sm font-bold text-slate-700">Your Name</label>
                                    <input
                                        id="contact-name"
                                        value={form.name}
                                        onChange={(event) => handleChange('name', event.target.value)}
                                        type="text"
                                        placeholder="John Doe"
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="contact-email" className="text-sm font-bold text-slate-700">Email Address</label>
                                    <input
                                        id="contact-email"
                                        value={form.email}
                                        onChange={(event) => handleChange('email', event.target.value)}
                                        type="email"
                                        placeholder="john@example.com"
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label htmlFor="contact-phone" className="text-sm font-bold text-slate-700">Phone</label>
                                    <input
                                        id="contact-phone"
                                        value={form.phone}
                                        onChange={(event) => handleChange('phone', event.target.value)}
                                        type="tel"
                                        placeholder="0912 345 678"
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="contact-subject" className="text-sm font-bold text-slate-700">Subject</label>
                                <input
                                    id="contact-subject"
                                    value={form.subject}
                                    onChange={(event) => handleChange('subject', event.target.value)}
                                    type="text"
                                    placeholder="How can we help?"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="contact-message" className="text-sm font-bold text-slate-700">Message</label>
                                <textarea
                                    id="contact-message"
                                    value={form.message}
                                    onChange={(event) => handleChange('message', event.target.value)}
                                    rows={4}
                                    placeholder="Type your message here..."
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none"
                                ></textarea>
                            </div>
                            {status ? (
                                <div className={`rounded-3xl px-5 py-4 text-sm font-bold ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                                    {status.text}
                                </div>
                            ) : null}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-violet-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-5 h-5" />
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
