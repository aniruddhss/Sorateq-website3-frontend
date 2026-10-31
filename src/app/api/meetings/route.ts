import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/session";
import { data } from "@/lib/data";
import { validateEmail } from "@/lib/email-validator";

export async function GET() {
  try {
    // Generate realistic calendar slots for the upcoming 7 business days
    const slots: { id: string; date: string; time: string; fullIso: string }[] = [];
    const now = new Date();

    for (let dayOffset = 1; dayOffset <= 8; dayOffset++) {
      const d = new Date(now.getTime() + dayOffset * 24 * 60 * 60 * 1000);
      const dayOfWeek = d.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue; // Skip weekends

      const dateStr = d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });

      const times = ["10:00 AM", "11:30 AM", "2:00 PM", "3:30 PM", "5:00 PM"];
      for (const t of times) {
        const [hourStr, minStr, ampm] = t.match(/(\d+):(\d+)\s+(AM|PM)/)?.slice(1) || ["10", "00", "AM"];
        let hours = parseInt(hourStr, 10);
        if (ampm === "PM" && hours !== 12) hours += 12;
        if (ampm === "AM" && hours === 12) hours = 0;

        const slotDate = new Date(d);
        slotDate.setHours(hours, parseInt(minStr, 10), 0, 0);

        slots.push({
          id: `slot_${slotDate.getTime()}`,
          date: dateStr,
          time: t,
          fullIso: slotDate.toISOString(),
        });
      }
    }

    return NextResponse.json({
      success: true,
      duration: "25 mins",
      topic: "Sorateq Product & Technical Discovery",
      slots: slots.slice(0, 15),
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err instanceof Error ? err.message : "Unknown error") }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, scheduledTime, timezone, conversationId, notes } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    }

    const emailCheck = validateEmail(email);
    if (!emailCheck.isValid || !emailCheck.normalizedEmail) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (!scheduledTime) {
      return NextResponse.json({ error: "Please select an available meeting time slot." }, { status: 400 });
    }

    const session = await getCurrentSession();
    const visitor = await data.getOrCreateVisitor(emailCheck.normalizedEmail);

    let conv = conversationId ? await data.getConversation(conversationId) : undefined;
    if (!conv && session) {
      conv = await data.getOrCreateConversation(session.visitorId, session.email);
    }

    const meeting = await data.createMeetingRequest({
      visitorId: visitor.id,
      conversationId: conv?.id,
      email: emailCheck.normalizedEmail,
      name: name.trim(),
      company: company?.trim(),
      scheduledTime,
      timezone: timezone || "UTC",
      notes: notes?.trim(),
    });

    // Track analytics event
    await data.trackAnalytics({
      eventType: "meeting_booked",
      visitorId: visitor.id,
      conversationId: conv?.id,
      metadata: { scheduledTime, email: visitor.email },
    });

    return NextResponse.json({
      success: true,
      message: "Your discovery meeting with the Sorateq engineering team is confirmed.",
      meeting,
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err instanceof Error ? err.message : "Unknown error") }, { status: 500 });
  }
}
