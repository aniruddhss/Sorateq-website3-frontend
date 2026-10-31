import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession, clearSessionCookie } from "@/lib/session";
import { data } from "@/lib/data";

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ authenticated: false });
    }

    const visitor = await data.getVisitor(session.visitorId);
    if (!visitor) {
      await clearSessionCookie();
      return NextResponse.json({ authenticated: false });
    }

    // Each page load starts a fresh chat; the visitor's identity (session) is kept
    const conversation = await data.createConversation(visitor.id, visitor.email);

    return NextResponse.json({
      authenticated: true,
      session,
      visitor: {
        id: visitor.id,
        email: visitor.email,
        emailValid: visitor.emailValid,
      },
      conversation: {
        id: conversation.id,
        state: conversation.state,
        messages: conversation.messages,
        projectProfile: conversation.projectProfile,
      },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { authenticated: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  await clearSessionCookie();
  return NextResponse.json({ success: true });
}
