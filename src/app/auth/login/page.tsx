import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4 py-20">
            <div className="w-full max-w-md">
                <LoginForm />
            </div>
        </div>
    );
}
