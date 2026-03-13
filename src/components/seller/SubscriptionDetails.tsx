"use client";

// Custom high-fidelity CheckIcon to replace lucide-react
const CheckIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

interface PlanFeature {
    [key: string]: any;
}

interface SubscriptionDetailsProps {
    subscription: any;
    plan: any;
}

export function SubscriptionDetails({ subscription, plan }: SubscriptionDetailsProps) {
    if (!plan) return null;

    const expiryDate = new Date(subscription?.currentPeriodEnd);
    const isExpired = new Date() > expiryDate;
    const daysRemaining = Math.max(0, Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));

    // Highlight key features for the current plan
    const featureHighlights = [
        { label: "Active Listings", value: plan.limits.maxActiveListings, icon: "📦" },
        { label: "Images/Product", value: plan.limits.imagesPerProduct, icon: "🖼️" },
        { label: "Staff Accounts", value: plan.limits.maxStaffAccounts, icon: "👥" },
        { label: "Search Boost", value: `${plan.features.searchRankingBoost}%`, icon: "🚀" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Current Plan Overview Card */}
            <div className="relative overflow-hidden bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                {/* Decorative background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl -z-10" />

                <div className="p-8 md:p-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                        <div className="space-y-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Active Managed Protocol</span>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
                                {plan.planName}
                            </h2>
                            <p className="text-slate-500 font-medium">{plan.metadata?.tagline || "Your current merchant tier."}</p>
                        </div>

                        <div className="text-right">
                            <div className="text-4xl font-black text-slate-900">{plan.price.toLocaleString()} <span className="text-sm text-slate-400">ETB</span></div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                                {subscription.billingCycle === 'yearly' ? 'billed annually' :
                                    subscription.billingCycle === 'quarterly' ? 'billed quarterly' : 'billed monthly'}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {featureHighlights.map((item) => (
                            <div key={item.label} className="bg-slate-50/50 p-6 rounded-[2rem] border border-transparent hover:border-slate-100 transition-all hover:bg-white hover:shadow-lg hover:shadow-slate-100 group">
                                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{item.icon}</div>
                                <div className="text-xl font-black text-slate-900 tracking-tight">{item.value === 9999 ? '∞' : item.value}</div>
                                <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status Footer */}
                <div className={`px-8 py-4 flex items-center justify-between border-t ${isExpired ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'}`}>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full animate-pulse ${isExpired ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${isExpired ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {isExpired ? 'Subscription Expired' : 'System Secure & Active'}
                        </span>
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Refreshes in {daysRemaining} days • {expiryDate.toLocaleDateString()}
                    </div>
                </div>
            </div>

            {/* Feature List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight mb-6">Protocol Capabilities</h3>
                    <div className="grid grid-cols-1 gap-4">
                        {Object.entries(plan.features).filter(([_, enabled]) => enabled === true).map(([key, _]) => (
                            <div key={key} className="flex items-center gap-3">
                                <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-[10px]">
                                    <CheckIcon className="w-3 h-3 stroke-[3]" />
                                </div>
                                <span className="text-sm font-bold text-slate-600 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                    <div>
                        <h3 className="text-xl font-black tracking-tight mb-2">Need more power?</h3>
                        <p className="text-slate-400 text-sm font-medium">Upgrade your tier to unlock bulk uploads, custom branding, and a verified badge.</p>
                    </div>

                    <Link href="/pricing" className="w-full">
                        <button className="mt-8 w-full py-4 bg-white text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-slate-100 transition-all active:scale-95">
                            Upgrade Intelligence
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
