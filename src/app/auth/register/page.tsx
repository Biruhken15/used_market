import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-16">
            <div className="w-full max-w-6xl">
                <div className="grid gap-6 lg:grid-cols-[minmax(380px,1.1fr)_minmax(300px,0.9fr)] items-stretch">
                    <div className="flex flex-col justify-center">
                        <RegisterForm />
                    </div>

                    <aside className="hidden lg:flex flex-col justify-center rounded-[2rem] bg-white p-8 shadow-sm h-full">
                        <div className="max-w-sm">
                            <p className="text-[11px] uppercase tracking-[0.4em] text-violet-600 font-black mb-4">About KesewEj</p>
                            <h2 className="text-2xl font-black text-slate-950 tracking-tight mb-4">A SaaS ecommerce platform for used products.</h2>
                            <p className="text-sm text-slate-600 leading-7 mb-6">KesewEj is a software-as-a-service ecommerce platform designed for buying and selling used goods with secure listings, messaging, and local discovery tools.</p>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-violet-600" />
                                    <p className="text-sm text-slate-700">Create product listings quickly with clean pricing and item details.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-violet-600" />
                                    <p className="text-sm text-slate-700">Message buyers and sellers securely inside the platform.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-violet-600" />
                                    <p className="text-sm text-slate-700">Discover local used items with modern search and filter tools.</p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
