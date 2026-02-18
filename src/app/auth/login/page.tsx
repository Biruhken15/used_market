import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
    return (
        <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <LoginForm />
            </div>
        </div>
    );
}
