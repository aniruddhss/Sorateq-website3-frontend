import { NextRequest, NextResponse } from "next/server";
import { validateEmail } from "@/lib/email-validator";
import { data } from "@/lib/data";
import { setSessionCookie } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, source, utmParams } = body;

    const validation = validateEmail(email);
    if (!validation.isValid || !validation.normalizedEmail) {
      return NextResponse.json(
        { success: false, error: validation.error || "Enter a valid email address." },
        { status: 400 }
      );
    }

    const userAgent = req.headers.get("user-agent") || undefined;
    const visitor = await data.getOrCreateVisitor(validation.normalizedEmail, {
      source: source || "landing_hero",
      utmParams,
      userAgent,
    });

    const session = await data.createSession(visitor.id, visitor.email);
    const conversation = await data.getOrCreateConversation(visitor.id, visitor.email);

    await setSessionCookie(session.sessionId);

    // Track analytics event
    await data.trackAnalytics({
      eventType: "email_submitted",
      visitorId: visitor.id,
      sessionId: session.sessionId,
      conversationId: conversation.id,
      metadata: { email: visitor.email, source },
    });

    return NextResponse.json({
      success: true,
      visitor: {
        id: visitor.id,
        email: visitor.email,
        emailValid: visitor.emailValid,
      },
      sessionId: session.sessionId,
      conversationId: conversation.id,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error && err.message ? err.message : "Failed to initialize visitor session." },
      { status: 500 }
    );
  }
}
