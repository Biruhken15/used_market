import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db/mongoose";
import User from "@/lib/models/user";
import UserSubscription from "@/lib/models/user-subscription";
import SubscriptionPlan from "@/lib/models/subscription-plan";
import Store from "@/lib/models/store";

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {},
            async authorize(credentials: any) {
                const { email, password } = credentials;
                console.log(`[AUTH] Attempting login for: ${email}`);

                try {
                    await connectDB();
                    const user = await User.findOne({ email }).select("+password");

                    if (!user) {
                        console.warn(`[AUTH] User not found: ${email}`);
                        return null;
                    }

                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (!passwordsMatch) {
                        console.warn(`[AUTH] Invalid password for: ${email}`);
                        return null;
                    }

                    console.log(`[AUTH] Successfully authorized: ${email}`);
                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    };
                } catch (error: any) {
                    console.error("[AUTH ERROR] Authorize callback failed:", error.message);
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
    useSecureCookies: process.env.NODE_ENV === "production",
    cookies: {
        sessionToken: {
            name: process.env.NODE_ENV === "production" ? `__Secure-next-auth.session-token` : `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
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
                    console.log(`[AUTH] JWT Callback - Syncing state for: ${user.email}`);
                    await connectDB();
                    
                    // 1. Check for Store Ownership (Primary Source of truth for having a store)
                    const userStore = await Store.findOne({ ownerId: user.id }).select('_id');
                    if (userStore) {
                        token.storeId = userStore._id.toString();
                        console.log(`[AUTH] Store ownership verified: ${token.storeId}`);
                    }

                    // 2. Check for Subscription
                    const sub = await UserSubscription.findOne({ userId: user.id }).populate('planId');
                    if (sub) {
                        // Priority to subscription's store mapping if it exists
                        if (sub.storeId) token.storeId = sub.storeId.toString();
                        token.planCode = (sub.planId as any)?.planCode || 'FREE_TRIAL';
                        console.log(`[AUTH] Subscription found: ${token.planCode}`);
                    } else {
                        token.planCode = 'FREE_TRIAL';
                        console.log(`[AUTH] No subscription found, defaulting to FREE_TRIAL`);
                    }
                } catch (error: any) {
                    console.error("[AUTH ERROR] JWT Callback failed:", error.message);
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

