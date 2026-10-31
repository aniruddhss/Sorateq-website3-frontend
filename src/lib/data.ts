// Data access for the Next.js app. Server-only. Backed by the FastAPI app-store
// (Supabase). Methods return the TypeScript shapes from ./types.
import "server-only";
import { backend } from "./backend";
import type {
  AnalyticsEvent,
  CapabilityItem,
  ChatBlock,
  ChatMessage,
  Conversation,
  ContactRequest,
  FAQItem,
  KnowledgeDocument,
  Lead,
  MeetingRequest,
  MethodologyStep,
  ModelUsageRecord,
  ProjectRecord,
  PromptVersion,
  Visitor,
  VisitorSession,
  VisibilityLevel,
} from "./types";

// ---- wire shapes returned by the backend ----

type WireMessage = {
  id: string;
  conversationId: string;
  role: "user" | "assistant" | "system";
  content: string;
  intent?: string | null;
  confidence?: number | null;
  uiBlocks: ChatBlock[];
  toolCalls: unknown[];
  createdAt: string;
};

type WireConversation = {
  id: string;
  visitorId: string;
  visitorEmail: string;
  state: Conversation["state"];
  summary: string;
  projectProfile: Conversation["projectProfile"];
  messages: WireMessage[];
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
};

// ---- mappers ----

function toChatMessage(m: WireMessage): ChatMessage {
  return {
    id: m.id,
    conversationId: m.conversationId,
    sender: m.role,
    content: m.content,
    createdAt: m.createdAt,
    blocks: m.uiBlocks?.length ? m.uiBlocks : undefined,
    intent: (m.intent ?? undefined) as ChatMessage["intent"],
  };
}

function toConversation(c: WireConversation): Conversation {
  return {
    id: c.id,
    visitorId: c.visitorId,
    visitorEmail: c.visitorEmail,
    state: c.state,
    summary: c.summary,
    projectProfile: c.projectProfile,
    messages: c.messages.map(toChatMessage),
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    lastMessageAt: c.lastMessageAt,
  };
}

async function must<T>(promise: Promise<T | null>, what: string): Promise<T> {
  const value = await promise;
  if (value === null) throw new Error(`${what} not found`);
  return value;
}

// ---- visitors & sessions ----

export const data = {
  async getOrCreateVisitor(
    email: string,
    metadata?: { source?: string; utmParams?: Record<string, string>; userAgent?: string }
  ): Promise<Visitor> {
    const v = await must(
      backend.post<Visitor>("/visitors/get-or-create", { email, ...metadata }),
      "Visitor"
    );
    return v;
  },

  async getVisitor(id: string): Promise<Visitor | undefined> {
    return (await backend.get<Visitor>(`/visitors/${encodeURIComponent(id)}`)) ?? undefined;
  },

  async createSession(visitorId: string, email: string): Promise<VisitorSession> {
    return must(backend.post<VisitorSession>("/sessions", { visitorId, email }), "Session");
  },

  async getSession(sessionId: string): Promise<VisitorSession | undefined> {
    return (await backend.get<VisitorSession>(`/sessions/${encodeURIComponent(sessionId)}`)) ?? undefined;
  },

  async deleteSession(sessionId: string): Promise<void> {
    await backend.delete(`/sessions/${encodeURIComponent(sessionId)}`);
  },

  // ---- conversations & messages ----

  async getOrCreateConversation(visitorId: string, email: string): Promise<Conversation> {
    const c = await must(
      backend.post<WireConversation>("/conversations/get-or-create", { visitorId, visitorEmail: email }),
      "Conversation"
    );
    return toConversation(c);
  },

  async createConversation(visitorId: string, email: string): Promise<Conversation> {
    const c = await must(
      backend.post<WireConversation>("/conversations", { visitorId, visitorEmail: email }),
      "Conversation"
    );
    return toConversation(c);
  },

  async getConversation(id: string): Promise<Conversation | undefined> {
    const c = await backend.get<WireConversation>(`/conversations/${encodeURIComponent(id)}`);
    return c ? toConversation(c) : undefined;
  },

  async updateConversation(
    id: string,
    updates: Partial<Pick<Conversation, "state" | "summary" | "projectProfile">>
  ): Promise<void> {
    await backend.patch(`/conversations/${encodeURIComponent(id)}`, updates);
  },

  async addMessage(
    conversationId: string,
    message: Pick<ChatMessage, "sender" | "content"> & Partial<Pick<ChatMessage, "intent" | "blocks" | "metadata">>
  ): Promise<ChatMessage> {
    const m = await must(
      backend.post<WireMessage>(`/conversations/${encodeURIComponent(conversationId)}/messages`, {
        role: message.sender,
        content: message.content,
        intent: message.intent ?? null,
        uiBlocks: message.blocks ?? [],
        toolCalls: [],
      }),
      "Message"
    );
    return toChatMessage(m);
  },

  // ---- leads ----

  async getOrCreateLead(visitorId: string, email: string): Promise<Lead> {
    return must(backend.post<Lead>("/leads/ensure", { visitorId, email }), "Lead");
  },

  async updateLead(id: string, updates: Partial<Lead>): Promise<Lead | undefined> {
    const { id: _id, createdAt: _c, updatedAt: _u, visitorId: _v, email: _e, notes: _n, ...rest } = updates as Lead;
    void _id; void _c; void _u; void _v; void _e; void _n;
    return (await backend.patch<Lead>(`/leads/${encodeURIComponent(id)}`, rest)) ?? undefined;
  },

  async getAllLeads(): Promise<Lead[]> {
    return (await backend.get<Lead[]>("/leads")) ?? [];
  },

  // ---- admin writes ----

  async upsertProject(project: ProjectRecord): Promise<ProjectRecord> {
    return must(backend.put<ProjectRecord>("/admin/projects", project), "Project");
  },

  async deleteProject(id: string): Promise<boolean> {
    const res = await backend.delete<{ success: boolean }>(`/admin/projects/${encodeURIComponent(id)}`);
    return res?.success ?? false;
  },

  async upsertFAQ(faq: FAQItem): Promise<FAQItem> {
    return must(backend.put<FAQItem>("/admin/faqs", faq), "FAQ");
  },

  async deleteFAQ(id: string): Promise<boolean> {
    const res = await backend.delete<{ success: boolean }>(`/admin/faqs/${encodeURIComponent(id)}`);
    return res?.success ?? false;
  },

  async upsertCapability(cap: CapabilityItem): Promise<CapabilityItem> {
    return must(backend.put<CapabilityItem>("/admin/capabilities", cap), "Capability");
  },

  async upsertKnowledgeDoc(doc: KnowledgeDocument): Promise<KnowledgeDocument> {
    return must(backend.put<KnowledgeDocument>("/admin/knowledge", doc), "Knowledge document");
  },

  async upsertPromptVersion(prompt: PromptVersion): Promise<PromptVersion> {
    return must(backend.put<PromptVersion>("/admin/prompts", prompt), "Prompt version");
  },

  async updateLeadAdmin(id: string, updates: Partial<Lead>): Promise<Lead | undefined> {
    return (await backend.patch<Lead>("/admin/leads", { id, updates })) ?? undefined;
  },

  async getAllConversations(): Promise<Conversation[]> {
    const list = (await backend.get<WireConversation[]>("/conversations")) ?? [];
    return list.map(toConversation);
  },

  // ---- content (read) ----

  async getFAQs(visibility: VisibilityLevel = "PUBLIC"): Promise<FAQItem[]> {
    return (await backend.get<FAQItem[]>(`/faqs?visibility=${visibility}`)) ?? [];
  },

  async getCapabilities(visibility: VisibilityLevel = "PUBLIC"): Promise<CapabilityItem[]> {
    return (await backend.get<CapabilityItem[]>(`/capabilities?visibility=${visibility}`)) ?? [];
  },

  async getPromptVersions(): Promise<PromptVersion[]> {
    return (await backend.get<PromptVersion[]>("/prompts")) ?? [];
  },

  async getActivePromptVersion(): Promise<PromptVersion | undefined> {
    return (await backend.get<PromptVersion>("/prompts/active")) ?? undefined;
  },

  async getMethodology(): Promise<MethodologyStep[]> {
    return (await backend.get<MethodologyStep[]>("/methodology")) ?? [];
  },

  async getKnowledgeDocs(visibility: VisibilityLevel = "PUBLIC"): Promise<KnowledgeDocument[]> {
    return (await backend.get<KnowledgeDocument[]>(`/knowledge?visibility=${visibility}`)) ?? [];
  },

  // ---- projects (read) ----

  async getProjects(visibility: VisibilityLevel = "PUBLIC"): Promise<ProjectRecord[]> {
    return (await backend.get<ProjectRecord[]>(`/projects?visibility=${visibility}`)) ?? [];
  },

  async getProjectBySlug(slug: string): Promise<ProjectRecord | undefined> {
    return (await backend.get<ProjectRecord>(`/projects/${encodeURIComponent(slug)}`)) ?? undefined;
  },

  async searchProjects(query: string, options?: { industry?: string; projectType?: string }): Promise<ProjectRecord[]> {
    const params = new URLSearchParams({ q: query });
    if (options?.industry) params.set("industry", options.industry);
    if (options?.projectType) params.set("type", options.projectType);
    return (await backend.get<ProjectRecord[]>(`/projects/search?${params.toString()}`)) ?? [];
  },

  // ---- meetings, contact, analytics, usage ----

  async createMeetingRequest(req: {
    visitorId: string;
    conversationId?: string;
    email: string;
    name?: string;
    company?: string;
    scheduledTime?: string;
    preferredDate?: string;
    preferredTimeSlot?: string;
    timezone?: string;
    notes?: string;
  }): Promise<{ id: string }> {
    return must(backend.post<{ id: string }>("/meetings", req), "Meeting");
  },

  async getMeetings(): Promise<MeetingRequest[]> {
    return (await backend.get<MeetingRequest[]>("/meetings")) ?? [];
  },

  async createContactRequest(req: {
    type: ContactRequest["type"];
    visitorId: string;
    conversationId?: string;
    email: string;
    phone?: string;
    preferredTime?: string;
  }): Promise<{ id: string }> {
    return must(
      backend.post<{ id: string }>("/contact-requests", {
        visitorId: req.visitorId,
        email: req.email,
        payload: {
          type: req.type,
          conversationId: req.conversationId,
          phone: req.phone,
          preferredTime: req.preferredTime,
        },
      }),
      "Contact request"
    );
  },

  async trackAnalytics(event: {
    eventType: AnalyticsEvent["eventType"];
    visitorId?: string;
    sessionId?: string;
    conversationId?: string;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    await backend.post("/analytics", event);
  },

  async getAnalytics(): Promise<AnalyticsEvent[]> {
    return (await backend.get<AnalyticsEvent[]>("/analytics")) ?? [];
  },

  async recordModelUsage(usage: Omit<ModelUsageRecord, "id" | "timestamp">): Promise<void> {
    await backend.post("/model-usage", usage);
  },

  async getModelUsage(): Promise<ModelUsageRecord[]> {
    return (await backend.get<ModelUsageRecord[]>("/model-usage")) ?? [];
  },
};
