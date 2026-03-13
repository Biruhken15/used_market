import dbConnect from "@/lib/db/mongoose";
import Transaction from "@/lib/models/transaction";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/utils/auth";

export async function getStoreTransactions(storeId: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return [];

        await dbConnect();
        const transactions = await Transaction.find({ storeId })
            .populate('subscriptionPlanId')
            .sort({ createdAt: -1 });

        return JSON.parse(JSON.stringify(transactions));
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return [];
    }
}
