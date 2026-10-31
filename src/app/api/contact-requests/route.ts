import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/session";
import { data } from "@/lib/data";

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Please share your email to continue." }, { status: 401 });
    }

    const body = await req.json();
    const { type, phone, preferredTime } = body as { type?: unknown; phone?: unknown; preferredTime?: unknown };

    if (type !== "callback" && type !== "email") {
      return NextResponse.json({ error: "Unsupported request type." }, { status: 400 });
    }

    let cleanPhone: string | undefined;
    if (type === "callback") {
      cleanPhone = typeof phone === "string" ? phone.trim() : "";
      if (cleanPhone.length < 7 || cleanPhone.length > 25 || !/^[+0-9()\-\s]+$/.test(cleanPhone)) {
        return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
      }
    }

    const conv = await data.getOrCreateConversation(session.visitorId, session.email);
    const record = await data.createContactRequest({
      type,
      visitorId: session.visitorId,
      conversationId: conv.id,
      email: session.email,
      phone: cleanPhone,
      preferredTime: typeof preferredTime === "string" ? preferredTime.trim().slice(0, 120) : undefined,
    });

    await data.trackAnalytics({
      eventType: type === "callback" ? "callback_requested" : "contact_email_opened",
      visitorId: session.visitorId,
      conversationId: conv.id,
      metadata: { type },
    });

    return NextResponse.json({ success: true, request: record });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err instanceof Error ? err.message : "Unknown error") }, { status: 500 });
  }
}
