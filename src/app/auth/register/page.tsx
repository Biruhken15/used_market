import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4 py-20">
            <div className="w-full max-w-lg">
                <RegisterForm />
            </div>
        </div>
    );
}
