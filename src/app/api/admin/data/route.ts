import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { data } from "@/lib/data";
import { ADMIN_COOKIE, isValidAdminToken } from "@/lib/admin-auth";

async function isAuthorized(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    return isValidAdminToken(cookieStore.get(ADMIN_COOKIE)?.value);
  } catch {
    return false;
  }
}

export async function GET() {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const [leads, conversations, projects, faqs, capabilities, knowledgeDocs, promptVersions, activePrompt, meetings, analytics, modelUsage] =
    await Promise.all([
      data.getAllLeads(),
      data.getAllConversations(),
      data.getProjects("INTERNAL"),
      data.getFAQs("INTERNAL"),
      data.getCapabilities("INTERNAL"),
      data.getKnowledgeDocs("INTERNAL"),
      data.getPromptVersions(),
      data.getActivePromptVersion(),
      data.getMeetings(),
      data.getAnalytics(),
      data.getModelUsage(),
    ]);
  const totalTokens = modelUsage.reduce((acc, curr) => acc + curr.totalTokens, 0);
  const totalCost = modelUsage.reduce((acc, curr) => acc + curr.estimatedCostUsd, 0);

  const stats = {
    totalConversations: conversations.length,
    totalLeads: leads.length,
    qualifiedLeads: leads.filter((l) => l.qualificationState === "qualified" || l.qualificationState === "high_intent" || l.qualificationState === "booked").length,
    bookedMeetings: meetings.length,
    totalProjects: projects.length,
    totalTokens,
    totalCost: Number(totalCost.toFixed(4)),
    conversionRate: conversations.length > 0 ? ((meetings.length / conversations.length) * 100).toFixed(1) : "0.0",
  };

  return NextResponse.json({
    success: true,
    stats,
    leads,
    conversations,
    projects,
    faqs,
    capabilities,
    knowledgeDocs,
    promptVersions,
    activePrompt,
    meetings,
    analytics: analytics.slice(-100),
    modelUsage: modelUsage.slice(-100),
  });
}

export async function POST(req: NextRequest) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, payload } = body;

    switch (action) {
      case "upsert_project": {
        const saved = await data.upsertProject(payload);
        return NextResponse.json({ success: true, project: saved });
      }
      case "delete_project": {
        const deleted = await data.deleteProject(payload.id);
        return NextResponse.json({ success: deleted });
      }
      case "upsert_faq": {
        const saved = await data.upsertFAQ(payload);
        return NextResponse.json({ success: true, faq: saved });
      }
      case "delete_faq": {
        const deleted = await data.deleteFAQ(payload.id);
        return NextResponse.json({ success: deleted });
      }
      case "upsert_capability": {
        const saved = await data.upsertCapability(payload);
        return NextResponse.json({ success: true, capability: saved });
      }
      case "upsert_knowledge": {
        const saved = await data.upsertKnowledgeDoc(payload);
        return NextResponse.json({ success: true, document: saved });
      }
      case "upsert_prompt": {
        const saved = await data.upsertPromptVersion(payload);
        return NextResponse.json({ success: true, promptVersion: saved });
      }
      case "update_lead": {
        const updated = await data.updateLeadAdmin(payload.id, payload.updates);
        return NextResponse.json({ success: true, lead: updated });
      }
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}
