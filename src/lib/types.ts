export type ConversationState =
  | "NEW"
  | "INTRODUCTION"
  | "GENERAL_DISCOVERY"
  | "PROJECT_DISCOVERY"
  | "PROJECT_DEFINITION"
  | "QUALIFICATION"
  | "PORTFOLIO_EXPLORATION"
  | "PROJECT_PLANNING"
  | "PRICING_DISCUSSION"
  | "MEETING_INTENT"
  | "BOOKING"
  | "COMPLETED";

export type IntentType =
  | "company"
  | "portfolio"
  | "project_inquiry"
  | "technology"
  | "methodology"
  | "pricing"
  | "timeline"
  | "capabilities"
  | "contact"
  | "meeting"
  | "unrelated"
  | "follow_up"
  | "clarification"
  | "prompt_injection";

export type VisibilityLevel = "PUBLIC" | "INTERNAL" | "PRIVATE";

export interface Visitor {
  id: string;
  email: string;
  emailValid: boolean;
  createdAt: string;
  lastSeenAt: string;
  source?: string;
  utmParams?: Record<string, string>;
  userAgent?: string;
}

export interface VisitorSession {
  sessionId: string;
  visitorId: string;
  email: string;
  createdAt: string;
  expiresAt: string;
  activeConversationId?: string;
}

export interface ProjectProfile {
  projectName?: string;
  problemStatement?: string;
  solution?: string;
  industry?: string;
  projectCategory?: "SaaS" | "AI_App" | "Mobile" | "Web_Platform" | "Internal_Tool" | "Automation" | "MVP" | string;
  targetAudience?: string;
  users?: string;
  currentStage?: "idea" | "prototype" | "mvp" | "existing_code" | "scaling" | string;
  existingProduct?: string;
  mvpRequirements?: string[];
  advancedRequirements?: string[];
  platform?: string[];
  integrations?: string[];
  aiRequirements?: string[];
  technicalConstraints?: string[];
  preferredTechnologies?: string[];
  timeline?: string;
  budget?: string;
  businessModel?: string;
  urgency?: "immediate" | "within_1_month" | "within_3_months" | "exploratory" | string;
  decisionMakerStatus?: "founder" | "executive" | "tech_lead" | "product_manager" | "individual" | string;
  meetingIntent?: boolean;
}

export interface Lead {
  id: string;
  visitorId: string;
  email: string;
  name?: string;
  company?: string;
  role?: string;
  projectType?: string;
  industry?: string;
  stage?: string;
  budget?: string;
  timeline?: string;
  urgency?: string;
  qualificationState: "unqualified" | "prospect" | "qualified" | "high_intent" | "booked";
  qualificationScore: number; // 0 - 100
  meetingState: "none" | "offered" | "requested" | "booked" | "completed";
  summary?: string;
  notes?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectRecord {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  fullDescription: string;
  industry: string;
  projectType: "SaaS" | "AI Application" | "Web Platform" | "Mobile App" | "Automation" | "Developer Tool";
  problem: string;
  solution: string;
  features: string[];
  technologies: string[];
  services: string[];
  stage: string;
  projectOutcome: string;
  metrics?: { label: string; value: string }[];
  publicUrl?: string;
  caseStudyContent?: string;
  featured: boolean;
  visibility: VisibilityLevel;
  tags: string[];
  keywords: string[];
  heroImage?: string;
  galleryImages?: string[];
  images?: string[];
  updatedAt: string;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: "company" | "capabilities" | "methodology" | "technology" | "commercial" | "guidelines";
  content: string;
  visibility: VisibilityLevel;
  tags: string[];
  updatedAt: string;
}

export interface CapabilityItem {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  deliverables: string[];
  techStack: string[];
  icon: string;
  visibility: VisibilityLevel;
}

export interface MethodologyStep {
  step: number;
  title: string;
  subtitle: string;
  description: string;
  deliverables: string[];
  duration: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "general" | "pricing" | "process" | "technical" | "ai" | "timeline";
  visibility: VisibilityLevel;
  tags: string[];
}

export interface PromptVersion {
  id: string;
  version: string;
  name: string;
  systemPrompt: string;
  isActive: boolean;
  model: string;
  temperature: number;
  maxTokens: number;
  createdAt: string;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
  blocks?: ChatBlock[];
  intent?: IntentType;
  metadata?: {
    model?: string;
    tokens?: number;
    latencyMs?: number;
    retrievedProjects?: string[];
  };
}

export type ChatBlock =
  | { type: "text"; content: string }
  | { type: "project_card"; project: ProjectRecord }
  | { type: "project_grid"; projects: ProjectRecord[] }
  | { type: "project_brief"; brief: ProjectBriefData }
  | { type: "scope_estimate"; estimate: ScopeEstimateData }
  | { type: "contact_options"; projectBrief?: ProjectBriefData }
  | { type: "quick_replies"; options: string[] };

export interface ProjectBriefData {
  projectName: string;
  objective: string;
  problem: string;
  targetUsers: string;
  proposedMVP: string[];
  potentialArchitecture: string[];
  integrations: string[];
  timeline: string;
  budget: string;
  currentStage: string;
  openQuestions: string[];
  nextStep: string;
  generatedAt: string;
}

export interface ScopeEstimateData {
  projectName: string;
  phase1MVP: { duration: string; focus: string[] };
  phase2Enhance: { duration: string; focus: string[] };
  recommendedStack: string[];
  keyRisks: string[];
  approximateDuration: string;
}

export interface Conversation {
  id: string;
  visitorId: string;
  visitorEmail: string;
  state: ConversationState;
  summary: string;
  projectProfile: ProjectProfile;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
}

export interface MeetingRequest {
  id: string;
  conversationId?: string;
  visitorId: string;
  email: string;
  name: string;
  company?: string;
  scheduledTime: string;
  timezone: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes?: string;
  projectBrief?: ProjectBriefData;
  createdAt: string;
}

export interface ContactRequest {
  id: string;
  type: "callback" | "email";
  visitorId: string;
  conversationId?: string;
  email: string;
  phone?: string;
  preferredTime?: string;
  createdAt: string;
}

export interface AnalyticsEvent {
  id: string;
  eventType:
    | "landing_view"
    | "email_submitted"
    | "email_valid"
    | "sora_opened"
    | "chat_started"
    | "message_sent"
    | "project_discussed"
    | "portfolio_viewed"
    | "pricing_discussed"
    | "project_brief_generated"
    | "meeting_cta_shown"
    | "meeting_started"
    | "meeting_booked"
    | "contact_options_shown"
    | "callback_requested"
    | "contact_email_opened";
  visitorId?: string;
  sessionId?: string;
  conversationId?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface ModelUsageRecord {
  id: string;
  conversationId: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
  requestType: "chat" | "intent" | "extraction" | "brief";
  latencyMs: number;
  timestamp: string;
}
