import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
    return (
        <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <RegisterForm />
            </div>
        </div>
    );
}
