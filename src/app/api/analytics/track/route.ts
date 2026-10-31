import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/session";
import { data } from "@/lib/data";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventType, metadata } = body;

    if (!eventType) {
      return NextResponse.json({ error: "eventType is required" }, { status: 400 });
    }

    const session = await getCurrentSession();

    await data.trackAnalytics({
      eventType,
      visitorId: session?.visitorId,
      sessionId: session?.sessionId,
      metadata,
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err instanceof Error ? err.message : "Unknown error") }, { status: 500 });
  }
}
