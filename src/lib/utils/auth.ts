import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db/mongoose";
import User from "@/lib/models/user";
import UserSubscription from "@/lib/models/user-subscription";
import SubscriptionPlan from "@/lib/models/subscription-plan";

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {},
            async authorize(credentials: any) {
                const { email, password } = credentials;

                try {
                    await connectDB();
                    const user = await User.findOne({ email }).select("+password");

                    if (!user) {
                        return null;
                    }

                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (!passwordsMatch) {
                        return null;
                    }

                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    };
                } catch (error) {
                    console.log("Error: ", error);
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/auth/login",
    },
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.name = user.name;
                token.email = user.email;

                // ADDED: Fetch subscription and store mapping on login
                try {
                    const sub = await UserSubscription.findOne({ userId: user.id }).populate('planId');
                    if (sub) {
                        token.storeId = sub.storeId?.toString();
                        token.planCode = sub.planId?.planCode || 'FREE_TRIAL';
                    } else {
                        token.planCode = 'FREE_TRIAL';
                    }
                } catch (error) {
                    console.error("Error fetching subscription in JWT callback:", error);
                    token.planCode = 'FREE_TRIAL';
                }
            }
            return token;
        },
        async session({ session, token }: any) {
            if (session?.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
                (session.user as any).planCode = token.planCode;
                (session.user as any).storeId = token.storeId;
                session.user.name = token.name;
                session.user.email = token.email;
            }
            return session;
        },
    },
};
