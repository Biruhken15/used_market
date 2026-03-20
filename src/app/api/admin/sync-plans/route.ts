import { NextResponse } from "next/server";
import { SubscriptionService } from "@/lib/services/subscription-service";

export async function GET() {
  try {
    const result = await SubscriptionService.seedPlans();
    return NextResponse.json({ success: true, message: "Plans synchronized successfully", result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
