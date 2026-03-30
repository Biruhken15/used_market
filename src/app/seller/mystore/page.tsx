import { Metadata } from 'next';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/utils/auth";
import { redirect } from "next/navigation";
import { StoreService } from "@/lib/services/store-service";
import { SubscriptionService } from "@/lib/services/subscription-service";
import { AnalyticsService } from "@/lib/services/analytics-service";
import { ProductService } from "@/lib/services/product-service";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import InventoryList from "@/components/seller/InventoryList";
import ProductForm from "@/components/seller/ProductForm";
import TrialExpiryPopup from "@/components/seller/TrialExpiryPopup";
import StoreInsights from "@/components/seller/StoreInsights";
import StoreSettings from "@/components/seller/StoreSettings";
import { StaffList } from "@/components/seller/StaffList";
import { SubscriptionDetails } from "@/components/seller/SubscriptionDetails";
import { TransactionHistory } from "@/components/seller/TransactionHistory";
import { getStoreTransactions } from "@/lib/actions/billing-actions";

export const metadata: Metadata = {
    title: 'Merchant Dashboard | Manage Your Store',
    description: 'Manage your listings, view analytics, and grow your business on Ethiopia\'s premier used marketplace.',
};

export default async function MyStorePage({ searchParams }: { searchParams: Promise<{ mode?: string }> }) {
    const params = await searchParams;
    const isAddingProduct = params?.mode === "add-product";
    const isAnalytics = params?.mode === "analytics";
    const isSettings = params?.mode === "settings";
    const isStaff = params?.mode === "staff";
    const isBilling = params?.mode === "billing";

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/auth/login");
    }

    const store = await StoreService.getStoreByOwner(session.user.id);

    if (!store) {
        return (
            <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-6">
                <div className="max-w-3xl w-full bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="relative h-48 bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <div className="relative w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-5xl shadow-2xl border border-white/30">
                            🏪
                        </div>
                    </div>

                    <div className="p-10 md:p-16 text-center space-y-10">
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
                                Your <span className="text-blue-600">Professional</span> Presence Starts Here
                            </h1>
                            <p className="text-slate-500 font-bold text-lg max-w-xl mx-auto leading-relaxed">
                                To start selling and managing products, you first need to establish your store identity on our protocol.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                            {[
                                { title: "Reach Buyers", desc: "Showcase products to thousands of active shoppers.", icon: "🎯" },
                                { title: "Brand Identity", desc: "Build trust with a custom logo and professional cover.", icon: "✨" },
                                { title: "Full Control", desc: "Manage inventory, staff, and analytics in one place.", icon: "🛠️" }
                            ].map((benefit) => (
                                <div key={benefit.title} className="p-6 bg-slate-50 rounded-3xl border border-slate-100/50 space-y-3">
                                    <div className="text-2xl">{benefit.icon}</div>
                                    <h3 className="font-black text-slate-900 text-sm uppercase tracking-tight">{benefit.title}</h3>
                                    <p className="text-slate-500 text-xs font-medium leading-relaxed">{benefit.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6">
                            <Link href="/stores/create">
                                <Button className="w-full md:w-auto !h-16 !px-12 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-black text-sm uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-2xl shadow-indigo-100 border-none flex items-center justify-center gap-4 group active:scale-95">
                                    Create Store for Free
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                                </Button>
                            </Link>
                            <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                Join +500 Successful Merchants Today
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Parallelize data fetching for better performance
    const [subscription, metrics, products, transactions] = await Promise.all([
        SubscriptionService.getStoreSubscription(store._id.toString()),
        AnalyticsService.getStoreMetrics(store._id.toString()),
        ProductService.getStoreProducts(store._id.toString()),
        isBilling ? getStoreTransactions(store._id.toString()) : Promise.resolve([])
    ]);

    const plan = subscription?.planId as any;
    const isProOrEnterprise = plan?.planCode === 'PRO_SELLER' || plan?.planCode === 'ENTERPRISE_SELLER';

    // Fetch activity only if in analytics mode and user has the plan for it
    const recentActivity = isAnalytics && isProOrEnterprise
        ? await AnalyticsService.getRecentActivity(store._id.toString())
        : [];

    // Check for expiry status
    const expiryStatus = await SubscriptionService.checkSubscriptionExpiry(store._id.toString());
    const isExpired = expiryStatus?.expired || subscription?.status === 'expired';

    // Parse data for client components
    const serializedProducts = JSON.parse(JSON.stringify(products));
    const serializedActivity = JSON.parse(JSON.stringify(recentActivity));
    const serializedPlanFeatures = JSON.parse(JSON.stringify({
        ...(plan?.features || { canMarkAsSold: false }),
        featuredListingsPerMonth: plan?.limits?.featuredListingsPerMonth || 0
    }));
    const serializedStaff = JSON.parse(JSON.stringify(store.staff || []));
    const serializedPlanLimits = JSON.parse(JSON.stringify({
        ...(plan?.limits || { maxActiveListings: 3, imagesPerProduct: 3 }),
        planCode: plan?.planCode,
        canMarkAsUrgent: plan?.features?.canMarkAsUrgent,
        canMarkAsFeatured: (plan?.limits?.featuredListingsPerMonth || 0) > 0
    }));

    return (
        <div className="min-h-screen bg-slate-50/50 pb-24">
            <TrialExpiryPopup
                isExpired={!!isExpired}
                planName={plan?.planName || 'Free Trial'}
            />
            {/* Store Header / Branding */}
            <div className="relative h-64 md:h-80 w-full overflow-hidden bg-slate-200">
                {store.coverImage?.url ? (
                    <img
                        src={store.coverImage.url}
                        alt="Store Cover"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-600 to-indigo-700 opacity-20" />
                )}
                <div className="absolute inset-0 bg-black/20" />
            </div>

            <div className="max-w-5xl mx-auto px-4 md:px-6 relative">
                {/* Store Profile Section */}
                <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 -mt-16 md:-mt-20 relative z-10 text-center md:text-left">
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-white border-4 md:border-8 border-white rounded-[2.5rem] md:rounded-[3rem] shadow-2xl overflow-hidden shrink-0">
                        {store.logo?.url ? (
                            <img
                                src={store.logo.url}
                                alt="Store Logo"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-4xl md:text-5xl">
                                🏪
                            </div>
                        )}
                    </div>
                    <div className="flex-1 pb-2 md:pb-4 space-y-2 md:space-y-3">
                        <div className="flex flex-col md:flex-row items-center md:items-center gap-3 md:gap-4">
                            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">
                                {store.storeName}
                            </h1>
                            <div className="flex items-center gap-2">
                                <span className={`px-4 py-1.5 text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg ${plan?.planCode === 'ENTERPRISE_SELLER' ? 'bg-amber-500 shadow-amber-200' :
                                    plan?.planCode === 'PRO_SELLER' ? 'bg-purple-600 shadow-purple-200' :
                                        'bg-blue-600 shadow-blue-200'
                                    }`}>
                                    {plan?.planName || 'Free Trial'} Plan
                                </span>
                            </div>
                        </div>
                        <p className="text-slate-500 font-bold text-sm md:text-base flex items-center justify-center md:justify-start gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                            <span className="truncate">{Array.isArray(store.category) ? store.category.join(', ') : store.category} • {store.city}, {store.country}</span>
                        </p>
                    </div>
                </div>

                {/* Dashboard Navigation */}
                <div className="mt-16 flex items-center justify-between pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-10 overflow-x-auto no-scrollbar">
                        {isAddingProduct ? (
                            <Link href="/seller/mystore" className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest group">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6" /></svg>
                                Back to Inventory
                            </Link>
                        ) : (
                            [
                                { name: "Inventory", mode: null },
                                { name: "Analytics", mode: "analytics" },
                                { name: "Staff", mode: "staff" },
                                { name: "Your Plan", mode: "billing" },
                                { name: "Settings", mode: "settings" }
                            ].map((tab) => {
                                const isActive = (tab.mode === null && !isAddingProduct && !isAnalytics && !isSettings && !isBilling && !isStaff) ||
                                    (tab.mode === "analytics" && isAnalytics) ||
                                    (tab.mode === "settings" && isSettings) ||
                                    (tab.mode === "staff" && isStaff) ||
                                    (tab.mode === "billing" && isBilling);
                                return (
                                    <Link
                                        key={tab.name}
                                        href={tab.mode ? `/seller/mystore?mode=${tab.mode}` : '/seller/mystore'}
                                        className={`pb-4 text-sm font-medium md:font-black uppercase tracking-widest md:tracking-[0.2em] transition-all border-b-2 ${isActive ? "border-violet-600 text-violet-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}
                                    >
                                        {tab.name}
                                    </Link>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Action Row - Moved below navigation links */}
                <div className="mt-8 flex flex-wrap items-center justify-end gap-3 px-2">
                    {!isAddingProduct && !isAnalytics && !isSettings && (
                        products.length >= (plan?.limits?.maxActiveListings || 3) ? (
                            <div className="group relative">
                                <Button disabled className="!h-10 !px-6 rounded-xl bg-slate-200 text-slate-400 font-black text-[10px] uppercase tracking-widest border-none flex items-center gap-2 cursor-not-allowed">
                                    Limit Reached
                                </Button>
                                <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-center shadow-xl">
                                    You reached the max listing limit for {plan?.planName || 'Free'} plan. Upgrade to add more!
                                </div>
                            </div>
                        ) : (
                            <Link href="/seller/mystore?mode=add-product">
                                <Button className="!h-10 !px-6 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-indigo-100 border-none flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                                    Add Product
                                </Button>
                            </Link>
                        )
                    )}
                    <Link href="/pricing">
                        <Button variant="outline" className="!h-10 !px-6 rounded-xl border-2 border-violet-600 text-violet-600 font-black text-[10px] uppercase tracking-widest hover:bg-violet-50 transition-all">
                            {plan ? 'Upgrade Plan' : 'Go Premium'}
                        </Button>
                    </Link>
                </div>

                {isAddingProduct && (
                    <ProductForm
                        storeId={store._id.toString()}
                        storeSlug={store.storeSlug}
                        planLimits={serializedPlanLimits}
                        viewType="drawer"
                        closeUrl="/seller/mystore"
                    />
                )}

                {isAnalytics ? (
                    <div className="py-12">
                        {/* Summary Metrics moved here for consistency */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                            {[
                                { label: 'Store Views', value: metrics.store_view, icon: '👁️' },
                                { label: 'Product Views', value: metrics.product_view, icon: '📦' },
                                { label: 'Contact Clicks', value: metrics.contact_click, icon: '📞' },
                                { label: 'Rank Boost', value: `${plan?.features?.searchRankingBoost || 0}%`, icon: '🚀' }
                            ].map((m) => (
                                <div key={m.label} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                    <div className="text-2xl mb-2">{m.icon}</div>
                                    <div className="text-2xl font-black text-slate-900">{m.value}</div>
                                    <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{m.label}</div>
                                </div>
                            ))}
                        </div>
                        <StoreInsights
                            metrics={metrics}
                            recentActivity={serializedActivity}
                            planName={plan?.planName || 'Free Trial'}
                            isProOrEnterprise={isProOrEnterprise}
                        />
                    </div>
                ) : isSettings ? (
                    <div className="py-12">
                        <StoreSettings store={JSON.parse(JSON.stringify(store))} />
                    </div>
                ) : isStaff ? (
                    <div className="py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center mb-10">
                            <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Team <span className="text-blue-600">Protocol</span></h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Store Access & Permission Control</p>
                        </div>
                        <div className="max-w-4xl mx-auto bg-white rounded-[3rem] p-8 md:p-12 border border-slate-200 shadow-sm relative overflow-hidden">
                            <StaffList storeId={store._id.toString()} staff={serializedStaff} />
                        </div>
                    </div>
                ) : isBilling ? (
                    <div className="py-12 space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center">
                            <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Your Plan & <span className="text-blue-600">Billing</span></h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Subscriptions & Receipts</p>
                        </div>
                        <SubscriptionDetails
                            subscription={JSON.parse(JSON.stringify(subscription))}
                            plan={JSON.parse(JSON.stringify(plan))}
                        />
                        <TransactionHistory transactions={transactions} />
                    </div>
                ) : (
                    <>
                        {/* Inventory List */}
                        <div className="py-20">
                            <InventoryList
                                initialProducts={serializedProducts}
                                storeId={store._id.toString()}
                                subscriptionFeatures={serializedPlanFeatures}
                            />
                        </div>
                    </>
                )}
            </div>
        </div >
    );
}
