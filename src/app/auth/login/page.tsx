import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex bg-slate-50">
            {/* Form Side */}
            <div className="flex-1 flex items-center justify-center px-4 py-20">
                <LoginForm />
            </div>

            {/* Brand Side */}
            <div className="hidden lg:flex flex-1 relative items-center justify-center bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 grayscale hover:grayscale-0 transition-all duration-1000"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-accent/40 via-transparent to-accent/20"></div>

                <div className="relative z-10 text-center max-w-lg px-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 rounded-lg border border-accent/30 mb-8 backdrop-blur-md">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Market Evolution</span>
                    </div>
                    <h2 className="text-5xl font-black text-white tracking-tighter mb-6 leading-tight">
                        Quality Meets <br /> <span className="text-accent underline underline-offset-8">Simplicity.</span>
                    </h2>
                    <p className="text-white/60 font-medium text-lg leading-relaxed">
                        Ethio Market is the professional way to trade used goods. Join thousands of verified sellers today.
                    </p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-12 left-12 flex gap-4">
                    <div className="w-12 h-1 h-accent rounded-full bg-accent"></div>
                    <div className="w-4 h-1 rounded-full bg-white/20"></div>
                    <div className="w-4 h-1 rounded-full bg-white/20"></div>
                </div>
            </div>
        </div>
    );
}
