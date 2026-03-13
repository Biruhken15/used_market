import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex bg-slate-50">
            {/* Form Side */}
            <div className="flex-1 flex items-center justify-center px-4 py-20">
                <RegisterForm />
            </div>

            {/* Brand Side */}
            <div className="hidden lg:flex flex-1 relative items-center justify-center bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 grayscale hover:grayscale-0 transition-all duration-1000"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-accent/40 via-transparent to-accent/20"></div>

                <div className="relative z-10 text-center max-w-lg px-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 rounded-lg border border-accent/30 mb-8 backdrop-blur-md">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Join the Community</span>
                    </div>
                    <h2 className="text-5xl font-black text-white tracking-tighter mb-6 leading-tight">
                        Grow Your <br /> <span className="text-accent underline underline-offset-8">Business.</span>
                    </h2>
                    <p className="text-white/60 font-medium text-lg leading-relaxed">
                        Create your store in minutes and reach thousands of buyers across Ethiopia. Start trading professionally.
                    </p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-12 left-12 flex gap-4">
                    <div className="w-4 h-1 rounded-full bg-white/20"></div>
                    <div className="w-12 h-1 h-accent rounded-full bg-accent"></div>
                    <div className="w-4 h-1 rounded-full bg-white/20"></div>
                </div>
            </div>
        </div>
    );
}
