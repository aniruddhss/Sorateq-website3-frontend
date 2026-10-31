import { IntentType } from "../types";

export function detectIntent(text: string): IntentType {
  const lower = text.toLowerCase().trim();

  // Prompt injection checks
  if (
    lower.includes("ignore previous instructions") ||
    lower.includes("ignore all instructions") ||
    lower.includes("reveal your system prompt") ||
    lower.includes("show me your prompt") ||
    lower.includes("what is your system prompt") ||
    lower.includes("print system prompt") ||
    lower.includes("system instructions") ||
    lower.includes("dan mode") ||
    lower.includes("jailbreak") ||
    lower.includes("internal database secrets")
  ) {
    return "prompt_injection";
  }

  // Meeting / Conversation with human
  if (
    lower.includes("book a call") ||
    lower.includes("book a meeting") ||
    lower.includes("schedule a call") ||
    lower.includes("schedule a meeting") ||
    lower.includes("schedule conversation") ||
    lower.includes("talk to the team") ||
    lower.includes("talk to human") ||
    lower.includes("speak with someone") ||
    lower.includes("calendar") ||
    lower.includes("let's talk") ||
    lower.includes("book time") ||
    lower.includes("hop on a call")
  ) {
    return "meeting";
  }

  // Pricing / Cost
  if (
    lower.includes("how much") ||
    lower.includes("cost") ||
    lower.includes("pricing") ||
    lower.includes("price") ||
    lower.includes("rates") ||
    lower.includes("budget") ||
    lower.includes("quote") ||
    lower.includes("retainer") ||
    lower.includes("expensive")
  ) {
    return "pricing";
  }

  // Timeline / Duration
  if (
    lower.includes("how long") ||
    lower.includes("timeline") ||
    lower.includes("turnaround") ||
    lower.includes("delivery time") ||
    lower.includes("how fast") ||
    lower.includes("when can you start") ||
    lower.includes("weeks") ||
    lower.includes("launch date")
  ) {
    return "timeline";
  }

  // Methodology / Process
  if (
    lower.includes("how do you work") ||
    lower.includes("your process") ||
    lower.includes("methodology") ||
    lower.includes("how we work") ||
    lower.includes("development process") ||
    lower.includes("sprint") ||
    lower.includes("steps")
  ) {
    return "methodology";
  }

  // Technology / Stack
  if (
    lower.includes("tech stack") ||
    lower.includes("technology") ||
    lower.includes("what tech") ||
    lower.includes("nextjs") ||
    lower.includes("next.js") ||
    lower.includes("react native") ||
    lower.includes("python") ||
    lower.includes("fastapi") ||
    lower.includes("postgres") ||
    lower.includes("pgvector") ||
    lower.includes("typescript") ||
    lower.includes("database")
  ) {
    return "technology";
  }

  // Capabilities / Services
  if (
    lower.includes("capabilities") ||
    lower.includes("what can you build") ||
    lower.includes("services") ||
    lower.includes("do you build mobile") ||
    lower.includes("can you build ai") ||
    lower.includes("do you do saas") ||
    lower.includes("offer product strategy")
  ) {
    return "capabilities";
  }

  // Portfolio / Past work
  if (
    lower.includes("show me projects") ||
    lower.includes("portfolio") ||
    lower.includes("what have you built") ||
    lower.includes("case studies") ||
    lower.includes("past work") ||
    lower.includes("examples") ||
    lower.includes("kairo") ||
    lower.includes("apexmetrics") ||
    lower.includes("synthetix") ||
    lower.includes("nexusdesk") ||
    lower.includes("veritas") ||
    lower.includes("chronicle") ||
    lower.includes("voltstream") ||
    lower.includes("show me saas") ||
    lower.includes("show me ai")
  ) {
    return "portfolio";
  }

  // Company info
  if (
    lower.includes("what is sorateq") ||
    lower.includes("who are you") ||
    lower.includes("about sorateq") ||
    lower.includes("tell me about sorateq") ||
    lower.includes("who is sora") ||
    lower.includes("who made you") ||
    lower.includes("where are you located")
  ) {
    return "company";
  }

  // Project Inquiry (intent to build something)
  if (
    lower.includes("i want to build") ||
    lower.includes("i have an idea") ||
    lower.includes("we need an app") ||
    lower.includes("we are building") ||
    lower.includes("looking for an agency") ||
    lower.includes("looking for a studio") ||
    lower.includes("develop an mvp") ||
    lower.includes("create a platform") ||
    lower.includes("build a saas") ||
    lower.includes("make an ai") ||
    lower.includes("refactor our code") ||
    lower.includes("need a developer") ||
    lower.includes("we are working on") ||
    lower.includes("building a") ||
    lower.includes("project idea")
  ) {
    return "project_inquiry";
  }

  // Unrelated questions
  if (
    lower.includes("write a poem") ||
    lower.includes("weather in") ||
    lower.includes("recipe for") ||
    lower.includes("capital of") ||
    lower.includes("translate this") ||
    lower.includes("who won the") ||
    lower.includes("homework")
  ) {
    return "unrelated";
  }

  return "follow_up";
}
