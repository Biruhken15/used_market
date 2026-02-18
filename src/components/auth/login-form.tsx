"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import Link from "next/link";

export const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError("Invalid credentials. Please check your email and password.");
                setIsLoading(false);
                return;
            }

            router.replace("/dashboard");
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto card-premium p-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Welcome Back</h1>
                <p className="text-slate-500 font-medium">Sign in to your Ethio Market account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 text-sm py-3 px-4 rounded-xl text-center font-semibold">
                        {error}
                    </div>
                )}

                <Input
                    label="Email Address"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <div className="flex justify-end pt-1">
                    <Link href="/" className="text-sm text-blue-600 hover:text-blue-700 font-bold underline transition-colors">Forgot password?</Link>
                </div>

                <Button type="submit" fullWidth disabled={isLoading}>
                    {isLoading ? "Signing In..." : "Sign In"}
                </Button>

                <p className="text-center text-slate-500 text-sm font-medium">
                    Don't have an account?{" "}
                    <Link href="/auth/register" className="text-blue-600 hover:text-blue-700 font-bold underline transition-colors">Create account</Link>
                </p>
            </form>
        </Card>
    );
};
