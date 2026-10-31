import { data } from "../data";
import {
  ChatBlock,
  ChatMessage,
  Conversation,
  IntentType,
  ProjectProfile,
  ProjectRecord,
} from "../types";
import { detectIntent } from "./intent";
import { transitionState } from "./state-machine";
import { evaluateLeadScore } from "./lead-scorer";
import { generateProjectBrief } from "./brief-generator";
import { CONTACT_OPTIONS_AFTER_TURNS, isProjectRelated } from "./policy";

export interface SoraProcessInput {
  conversationId: string;
  userMessage: string;
}

export interface SoraProcessOutput {
  replyText: string;
  blocks: ChatBlock[];
  intent: IntentType;
  projectProfile: ProjectProfile;
}

export function extractProjectParameters(text: string, current: ProjectProfile): ProjectProfile {
  const updated: ProjectProfile = { ...current };
  const lower = text.toLowerCase();

  // Category extraction
  if (lower.includes("saas") || lower.includes("b2b platform") || lower.includes("dashboard")) {
    updated.projectCategory = "SaaS";
  } else if (lower.includes("ai") || lower.includes("llm") || lower.includes("agent") || lower.includes("copilot")) {
    updated.projectCategory = "AI_App";
  } else if (lower.includes("mobile") || lower.includes("ios") || lower.includes("android") || lower.includes("app")) {
    updated.projectCategory = "Mobile";
  } else if (lower.includes("internal tool") || lower.includes("admin portal")) {
    updated.projectCategory = "Internal_Tool";
  } else if (lower.includes("automation") || lower.includes("pipeline") || lower.includes("crawler")) {
    updated.projectCategory = "Automation";
  }

  // Industry extraction
  if (lower.includes("health") || lower.includes("clinic") || lower.includes("patient") || lower.includes("medical")) {
    updated.industry = "Healthcare";
  } else if (lower.includes("fintech") || lower.includes("finance") || lower.includes("crypto") || lower.includes("payment")) {
    updated.industry = "Fintech";
  } else if (lower.includes("school") || lower.includes("education") || lower.includes("student") || lower.includes("teacher") || lower.includes("course")) {
    updated.industry = "EdTech / Education";
  } else if (lower.includes("real estate") || lower.includes("property")) {
    updated.industry = "Real Estate / PropTech";
  } else if (lower.includes("agency") || lower.includes("marketing") || lower.includes("creator")) {
    updated.industry = "Marketing & Agency";
  } else if (lower.includes("logistics") || lower.includes("supply chain") || lower.includes("fleet")) {
    updated.industry = "Logistics & Fleet";
  }

  // Stage extraction
  if (lower.includes("idea") || lower.includes("concept") || lower.includes("thinking of")) {
    updated.currentStage = "idea";
  } else if (lower.includes("prototype") || lower.includes("figma") || lower.includes("wireframe")) {
    updated.currentStage = "prototype";
  } else if (lower.includes("existing code") || lower.includes("messy backend") || lower.includes("refactor") || lower.includes("v1 already")) {
    updated.currentStage = "existing_code";
  } else if (lower.includes("scaling") || lower.includes("active users") || lower.includes("series a") || lower.includes("revenue")) {
    updated.currentStage = "scaling";
  }

  // Timeline
  if (lower.includes("asap") || lower.includes("next month") || lower.includes("4 weeks") || lower.includes("1 month") || lower.includes("immediately")) {
    updated.urgency = "immediate";
    updated.timeline = "4 - 6 Weeks (Immediate Sprint)";
  } else if (lower.includes("2 months") || lower.includes("8 weeks") || lower.includes("this quarter")) {
    updated.urgency = "within_3_months";
    updated.timeline = "6 - 8 Weeks";
  } else if (lower.includes("exploratory") || lower.includes("just researching")) {
    updated.urgency = "exploratory";
    updated.timeline = "Exploratory / Q2-Q3";
  }

  // Budget
  if (lower.includes("$15k") || lower.includes("$20k") || lower.includes("$30k") || lower.includes("$40k") || lower.includes("$50k") || lower.includes("15,000") || lower.includes("25,000")) {
    updated.budget = "Standard MVP Scope (~$20k - $40k)";
  } else if (lower.includes("<10k") || lower.includes("bootstrap") || lower.includes("lean")) {
    updated.budget = "Lean MVP Scope (<$20k)";
  } else if (lower.includes("enterprise") || lower.includes(">50k") || lower.includes("100k")) {
    updated.budget = "Enterprise Sprint ($50k+)";
  }

  // Extract core problem statement if user describes it
  if (!updated.problemStatement && text.length > 25) {
    if (lower.includes("i want to") || lower.includes("we need") || lower.includes("trying to") || lower.includes("problem is")) {
      updated.problemStatement = text.trim();
    }
  }

  // Target users
  if (lower.includes("for teachers") || lower.includes("for doctors") || lower.includes("for founders") || lower.includes("for developers") || lower.includes("for consumers") || lower.includes("for enterprises")) {
    const match = text.match(/for\s+([a-zA-Z0-9\s]+?)(?:[.,;]|$)/i);
    if (match && match[1]) {
      updated.targetAudience = match[1].trim();
    }
  }

  return updated;
}

export async function processSoraMessage(input: SoraProcessInput): Promise<SoraProcessOutput> {
  const startTime = Date.now();
  const conv = await data.getConversation(input.conversationId);
  if (!conv) {
    throw new Error("Conversation not found");
  }

  const userText = input.userMessage.trim();
  const intent = detectIntent(userText);

  // Extract and update project parameters
  const updatedProfile = extractProjectParameters(userText, conv.projectProfile);

  // A short reply answers the question Sora asked last turn (e.g. "students" for the audience question)
  // Only plain, short replies count as answers; questions and complaints are not stored as profile data
  const lastAssistantText = [...conv.messages].reverse().find((m) => m.sender === "assistant")?.content || "";
  const looksLikeAnswer =
    userText.length > 0 &&
    userText.length <= 60 &&
    !/[?!]/.test(userText) &&
    userText.split(/\s+/).length <= 6 &&
    !/\b(why|what|how|cost|price|mvp|website|saying|asking)\b/i.test(userText);
  if (looksLikeAnswer && !updatedProfile.targetAudience && /primary target audience/i.test(lastAssistantText)) {
    updatedProfile.targetAudience = userText;
  }
  if (looksLikeAnswer && !updatedProfile.timeline && /ideal timeframe/i.test(lastAssistantText)) {
    updatedProfile.timeline = userText;
  }
  conv.projectProfile = updatedProfile;

  // Retrieve relevant knowledge
  // Only past projects that share a domain term with the visitor's message are referenced
  const relevantProjects: ProjectRecord[] = (await data
    .getProjects("PUBLIC"))
    .filter((p) => isProjectRelated(p, userText))
    .slice(0, 3);


  // State machine transition
  const nextState = transitionState(conv.state, intent, conv.messages.length + 1, updatedProfile);
  conv.state = nextState;

  // Lead qualification update
  const { score, state: leadState } = evaluateLeadScore(updatedProfile, intent === "meeting");
  await data.updateConversation(conv.id, { state: nextState, projectProfile: updatedProfile });
  const lead = await data.getOrCreateLead(conv.visitorId, conv.visitorEmail);
  await data.updateLead(lead.id, {
    qualificationScore: score,
    qualificationState: leadState,
    projectType: updatedProfile.projectCategory,
    industry: updatedProfile.industry,
    stage: updatedProfile.currentStage,
    budget: updatedProfile.budget,
    timeline: updatedProfile.timeline,
  });

  // Generate Response
  const blocks: ChatBlock[] = [];
  let replyText = "";

  if (intent === "prompt_injection") {
    replyText =
      "I am Sora, Sorateq's AI product assistant. I'm here specifically to discuss product architecture, software engineering, and things you are looking to design and build. How can I help with your project?";
    blocks.push({ type: "text", content: replyText });
    blocks.push({
      type: "quick_replies",
      options: ["Discuss a project idea", "Show relevant past work", "How does Sorateq build MVPs?", "Schedule a conversation"],
    });
  } else if (intent === "unrelated") {
    replyText =
      "I'm Sora, Sorateq's product assistant. I'm mainly here to help with our work, software products, and technical roadmaps for things you're looking to build. Let me know what product or concept you'd like to explore.";
    blocks.push({ type: "text", content: replyText });
    blocks.push({
      type: "quick_replies",
      options: ["Explore our work", "Discuss a project", "Ask about our tech stack", "Talk to the team"],
    });
  } else if (intent === "company") {
    replyText =
      "Sorateq is an AI-native product and software engineering studio. Our positioning is simple: Ideas in. Products out.\n\nWe partner with founders and teams to design, engineer, and launch production-grade SaaS platforms, AI workflows, and web apps through fast 4 to 8 week iterations. Unlike traditional agencies, we operate like an agile technical partner.";
    blocks.push({ type: "text", content: replyText });
    blocks.push({
      type: "quick_replies",
      options: ["Show me your best SaaS projects", "What is your typical build timeline?", "How do you handle pricing?", "I have a project idea"],
    });
  } else if (intent === "portfolio") {
    if (relevantProjects.length > 0) {
      replyText = `Here are the Sorateq projects closest to what you described:`;
      blocks.push({ type: "text", content: replyText });
      blocks.push({ type: "project_grid", projects: relevantProjects });
    } else {
      replyText = `We have not built a public example that closely matches what you described yet. Tell me the core problem and who it is for, and I will show you how we would approach it.`;
      blocks.push({ type: "text", content: replyText });
    }
    blocks.push({
      type: "quick_replies",
      options: ["Tell me more about Kairo AI", "How do you build AI workflows?", "Can we build something similar?", "Schedule a discovery call"],
    });
  } else if (intent === "pricing") {
    replyText =
      "We operate on fixed-scope milestone sprints for MVPs and dedicated sprint retainers for ongoing product engineering.\n\nA production MVP sprint generally ranges from $15,000 to $40,000 delivered over 4 to 8 weeks with fixed deliverables and no surprise overruns. Dedicated engineering retainers run $12,000 to $25,000 monthly for senior product engineers.\n\nWhat target scope or timeline are you considering?";
    blocks.push({ type: "text", content: replyText });
    blocks.push({
      type: "quick_replies",
      options: ["Help me define an MVP scope", "See our methodology", "Schedule a quick scoping call"],
    });
  } else if (intent === "timeline") {
    replyText =
      "A focused, revenue-ready MVP typically takes 4 to 8 weeks from kickoff to production deployment. More complex platforms or multi-model AI systems generally take 8 to 12 weeks.\n\nOur process is divided into 6 distinct phases: Understand, Define, Prototype, Build, Iterate, and Launch.";
    blocks.push({ type: "text", content: replyText });
    blocks.push({
      type: "quick_replies",
      options: ["What does the 4-week sprint include?", "How do you work with existing code?", "Discuss my timeline"],
    });
  } else if (intent === "technology") {
    replyText =
      "We engineer production systems with a modern, high-velocity stack including Next.js App Router, React 19, TypeScript, Python FastAPI, PostgreSQL, pgvector, Redis, and multimodal AI models (Gemini, Claude, GPT).\n\nDo you have an existing codebase or preferred technology constraints?";
    blocks.push({ type: "text", content: replyText });
    blocks.push({
      type: "quick_replies",
      options: ["Can you work with existing code?", "Show me AI projects", "Let's discuss my architecture"],
    });
  } else if (intent === "methodology") {
    replyText =
      "We follow a rigorous 6-step product execution model: Understand, Define, Prototype, Build, Iterate, and Launch.\n\nEvery sprint produces tangible, deployable software with full source code ownership transferred directly to you.";
    blocks.push({ type: "text", content: replyText });
    blocks.push({
      type: "quick_replies",
      options: ["What is included in the MVP deliverable?", "Show me past case studies", "Schedule a conversation"],
    });
  } else if (intent === "capabilities") {
    replyText =
      "Sorateq specializes in AI engineering and agentic workflows, multi-tenant SaaS platforms, high-throughput async backends, and rapid MVP builds.\n\nWhich area aligns best with what you are looking to build?";
    blocks.push({ type: "text", content: replyText });
    blocks.push({
      type: "quick_replies",
      options: ["I want to build an AI product", "I need a SaaS platform", "I have an existing app to refactor"],
    });
  } else if (intent === "meeting") {
    replyText =
      "I have structured the context from our conversation so our team is fully briefed before we speak.\n\nSelect a time that works best for a 25-minute technical discovery session:";
    blocks.push({ type: "text", content: replyText });

    const brief = generateProjectBrief(updatedProfile, conv.summary);
    blocks.push({ type: "project_brief", brief });
    blocks.push({ type: "contact_options", projectBrief: brief });
  } else if (intent === "project_inquiry" || updatedProfile.problemStatement) {
    // Project inquiry synthesis
    const categoryLabel = updatedProfile.projectCategory ? `${updatedProfile.projectCategory} ` : "";
    const industryLabel = updatedProfile.industry ? `in ${updatedProfile.industry}` : "";

    replyText = `That sounds like a great direction. `;

    if (!updatedProfile.targetAudience) {
      replyText += `To make sure we build the right experience, who is the primary target audience for this?`;
    } else if (!updatedProfile.timeline) {
      replyText += `What is your ideal timeframe for getting this live?`;
    } else {
      replyText += `We have enough context to structure a concrete project plan. Would you like me to schedule a scoping call?`;
    }

    blocks.push({ type: "text", content: replyText });

    // Reference a past project only when it is related to the visitor's request
    if (relevantProjects.length > 0) {
      blocks.push({ type: "project_card", project: relevantProjects[0] });
    }

    // If we have enough parameters, generate brief and contact options
    if (updatedProfile.targetAudience && updatedProfile.industry) {
      const brief = generateProjectBrief(updatedProfile, conv.summary);
      blocks.push({ type: "project_brief", brief });
    } else {
      blocks.push({
        type: "quick_replies",
        options: ["Show me similar projects", "Schedule a quick call"],
      });
    }
  } else {
    // General follow up
    replyText =
      "Understood. We can approach this through a targeted 4-to-8 week sprint to get a clean, scalable version live with minimum technical debt.\n\nWhat is the most critical feature or workflow you want validated first?";
    blocks.push({ type: "text", content: replyText });
    blocks.push({
      type: "quick_replies",
      options: ["Help me define the MVP", "Show relevant case studies", "How much would this cost?", "Schedule a call"],
    });
  }

  // Offer contact options once the conversation has had enough turns, and only once
  const userTurns = conv.messages.filter((m) => m.sender === "user").length;
  const contactAlreadyOffered = conv.messages.some(
    (m) => m.sender === "assistant" && m.blocks?.some((b) => b.type === "contact_options")
  );
  if (userTurns >= CONTACT_OPTIONS_AFTER_TURNS && !contactAlreadyOffered && !blocks.some((b) => b.type === "contact_options")) {
    blocks.push({ type: "contact_options" });
  }

  // Record assistant message
  await data.addMessage(conv.id, {
    sender: "assistant",
    content: replyText,
    blocks,
    intent,
    metadata: {
      model: "sora-architect-v1",
      latencyMs: Date.now() - startTime,
      tokens: Math.ceil((userText.length + replyText.length) / 4),
    },
  });

  // Record usage metrics
  await data.recordModelUsage({
    conversationId: conv.id,
    model: "sora-architect-v1",
    promptTokens: Math.ceil(userText.length / 4),
    completionTokens: Math.ceil(replyText.length / 4),
    totalTokens: Math.ceil((userText.length + replyText.length) / 4),
    estimatedCostUsd: 0.0004,
    requestType: "chat",
    latencyMs: Date.now() - startTime,
  });

  // Track analytics event
  await data.trackAnalytics({
    eventType: "message_sent",
    visitorId: conv.visitorId,
    conversationId: conv.id,
    metadata: { intent, state: conv.state, score },
  });

  return {
    replyText,
    blocks,
    intent,
    projectProfile: updatedProfile,
  };
}
