import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/session";
import { data } from "@/lib/data";
import { processSoraMessage, extractProjectParameters } from "@/lib/sora/engine";
import { detectIntent } from "@/lib/sora/intent";
import { transitionState } from "@/lib/sora/state-machine";
import { CONTACT_OPTIONS_AFTER_TURNS, isProjectRelated } from "@/lib/sora/policy";
import { ChatBlock, IntentType, ProjectRecord } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, conversationId } = body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ error: "Message content cannot be empty." }, { status: 400 });
    }

    // Sora answers only identified visitors; the email is collected before the first answer
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json(
        { error: "Please share your email to continue.", code: "email_required" },
        { status: 401 }
      );
    }

    // Use the conversation this page load started; create one only if the client has none
    const knownConv = typeof conversationId === "string" ? await data.getConversation(conversationId) : undefined;
    const targetConvId =
      knownConv && knownConv.visitorId === session.visitorId
        ? knownConv.id
        : (await data.createConversation(session.visitorId, session.email)).id;

    // Record user message
    await data.addMessage(targetConvId, {
      sender: "user",
      content: message.trim(),
    });

    const updatedConv = await data.getConversation(targetConvId);

    // Keep the visitor's project profile and conversation state current on every turn,
    // whichever reply path runs, so the next turn and the admin view see the same data.
    if (updatedConv) {
      const detected = detectIntent(message.trim());
      const nextProfile = extractProjectParameters(message.trim(), updatedConv.projectProfile);
      const nextState = transitionState(
        updatedConv.state,
        detected,
        updatedConv.messages.length + 1,
        nextProfile
      );
      await data.updateConversation(targetConvId, { projectProfile: nextProfile, state: nextState });
      updatedConv.projectProfile = nextProfile;
      updatedConv.state = nextState;
    }

    // 1. Try FastAPI Backend with Gemini + Supabase pgvector RAG
    const FASTAPI_URL = process.env.FASTAPI_BACKEND_URL || "http://127.0.0.1:8000";
    let llmReplyText = "";
    let soraBlocks: ChatBlock[] = [];
    let detectedIntent = "general_discovery";
    let backendOfferedNextStep = false;
    let projectProfile = updatedConv?.projectProfile || {};

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const userMessages = updatedConv?.messages.filter(m => m.sender === "user") || [];
      const questionCount = userMessages.length;

      // Build history array for the backend LLM
      const historyForLLM = (updatedConv?.messages || [])
        .filter(m => m.content && m.content.trim().length > 0)
        .slice(-10) // last 10 messages for context window
        .map(m => ({ role: m.sender === "assistant" ? "assistant" : "user", content: m.content }));

      const streamRes = await fetch(`${FASTAPI_URL}/api/v1/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.trim(),
          conversation_id: targetConvId,
          context_state: updatedConv?.state || "NEW",
          history: historyForLLM,
          current_profile: updatedConv?.projectProfile || {},
          question_count: questionCount,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (streamRes.ok && streamRes.body) {
        const reader = streamRes.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const event = JSON.parse(line.slice(6));
                if (event.type === "meta") {
                  detectedIntent = event.intent || detectedIntent;
                  projectProfile = event.project_profile || projectProfile;
                  if (event.stage === "offer_next_step") {
                    backendOfferedNextStep = true;
                  }
                } else if (event.type === "token") {
                  llmReplyText += event.token;
                }
              } catch {
                // Ignore parse errors on partial chunks
              }
            }
          }
        }
      }
    } catch {
      // FastAPI stream unavailable — fallback to local engine
    }

    // 2. Clean & Sanitize LLM response
    llmReplyText = llmReplyText
      .replace(/\*\*/g, "")
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
      .trim();

    // 3. Fallback if FastAPI LLM did not return text
    if (!llmReplyText) {
      const fallbackResult = await processSoraMessage({
        conversationId: targetConvId,
        userMessage: message.trim(),
      });
      llmReplyText = fallbackResult.replyText.replace(/\*\*/g, "").trim();
      if (soraBlocks.length === 0) {
        soraBlocks = fallbackResult.blocks;
      }
      detectedIntent = fallbackResult.intent;
      projectProfile = fallbackResult.projectProfile;
    }

    // Reference past projects only when they relate to this visitor's message
    const relatedProjects: ProjectRecord[] = (await data
      .getProjects("PUBLIC"))
      .filter((p) => isProjectRelated(p, message.trim()))
      .slice(0, 3);

    // Mark each related project name in the reply so the chat renders it as a link to its page
    for (const p of relatedProjects) {
      const escaped = p.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      llmReplyText = llmReplyText.replace(
        new RegExp(`(?<!\\[)\\b${escaped}\\b(?!\\])`, "g"),
        `[[project:${p.slug}|${p.name}]]`
      );
    }
    if (relatedProjects.length > 0 && !soraBlocks.some((b: ChatBlock) => b.type === "project_grid")) {
      soraBlocks.unshift({ type: "project_grid", projects: relatedProjects });
    }

    // Offer contact options after enough turns, once per conversation
    const userMessageCount = updatedConv?.messages.filter((m) => m.sender === "user").length || 0;
    const contactAlreadyOffered = (updatedConv?.messages || []).some(
      (m) => m.sender === "assistant" && m.blocks?.some((b: ChatBlock) => b.type === "contact_options")
    );
    const shouldOfferNow = backendOfferedNextStep || userMessageCount >= CONTACT_OPTIONS_AFTER_TURNS;
    if (shouldOfferNow && !contactAlreadyOffered && !soraBlocks.some((b: ChatBlock) => b.type === "contact_options")) {
      soraBlocks.push({ type: "contact_options" });
    }

    // The reply may only point to the options when they are attached to it
    const hasOptions = soraBlocks.some((b: ChatBlock) => b.type === "contact_options");
    if (!hasOptions) {
      llmReplyText = llmReplyText.replace(/\s*Choose an option below[^.!?]*[.!?]?/gi, "").trim();
    }

    // A reply must move the conversation forward: ask one question or name a next step
    const endsWithQuestion = /\?\s*$/.test(llmReplyText);
    const namesNextStep = /\b(choose|schedule|book|call|email|callback)\b/i.test(llmReplyText);
    if (!endsWithQuestion && !namesNextStep && !hasOptions && llmReplyText.length > 0) {
      llmReplyText = `${llmReplyText.trim()} What is the main outcome you need this to deliver?`;
    }

    // Record the reply with its final blocks so reloads show the same content
    await data.recordModelUsage({
      conversationId: targetConvId,
      model: "sora-architect-v1",
      promptTokens: Math.ceil(message.trim().length / 4),
      completionTokens: Math.ceil(llmReplyText.length / 4),
      totalTokens: Math.ceil((message.trim().length + llmReplyText.length) / 4),
      estimatedCostUsd: 0.0004,
      requestType: "chat",
      latencyMs: 0,
    });

    await data.addMessage(targetConvId, {
      sender: "assistant",
      content: llmReplyText,
      blocks: soraBlocks,
      intent: detectedIntent as IntentType,
    });

    return NextResponse.json({
      success: true,
      conversationId: targetConvId,
      replyText: llmReplyText,
      blocks: soraBlocks,
      intent: detectedIntent,
      projectProfile: projectProfile,
      state: updatedConv?.state || "GENERAL_DISCOVERY",
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error: "Sora is having trouble responding right now. Your conversation is still here. Try again in a moment.",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
