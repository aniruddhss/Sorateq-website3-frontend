import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/session";
import { data } from "@/lib/data";
import { generateProjectBrief } from "@/lib/sora/brief-generator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conversationId } = body;

    let convId = conversationId;
    if (!convId) {
      const session = await getCurrentSession();
      if (session) {
        const conv = await data.getOrCreateConversation(session.visitorId, session.email);
        convId = conv.id;
      }
    }

    if (!convId) {
      return NextResponse.json({ error: "Conversation ID required." }, { status: 400 });
    }

    const conv = await data.getConversation(convId);
    if (!conv) {
      return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
    }

    const brief = generateProjectBrief(conv.projectProfile, conv.summary);

    // Track analytics event
    await data.trackAnalytics({
      eventType: "project_brief_generated",
      visitorId: conv.visitorId,
      conversationId: conv.id,
      metadata: { projectName: brief.projectName },
    });

    return NextResponse.json({ success: true, brief });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err instanceof Error ? err.message : "Unknown error") }, { status: 500 });
  }
}
