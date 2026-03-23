"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminNavbar } from "@/components/admin/admin-navbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);

    // The /admin/login page handles its own auth — skip the wrapper
    const isLoginPage = pathname === '/admin/login';

    useEffect(() => {
        if (isLoginPage) {
            setIsAuthorized(true);
            return;
        }
        if (status === 'unauthenticated') {
            router.push('/admin/login');
        } else if (status === 'authenticated') {
            if ((session?.user as any)?.role !== 'admin') {
                router.push('/admin/login');
            } else {
                setIsAuthorized(true);
            }
        }
    }, [session, status, router, isLoginPage]);

    // Show loading spinner while checking auth (skip for login page)
    if (!isAuthorized) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin" />
                    <p className="text-[10px] font-black uppercase text-slate-600 tracking-[0.3em]">Verifying Access...</p>
                </div>
            </div>
        );
    }

    // Render the login page without sidebar/navbar
    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <AdminSidebar />
            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                <AdminNavbar />
                <main className="flex-1 overflow-x-hidden py-2">
                    {children}
                </main>
            </div>
        </div>
    );
}

