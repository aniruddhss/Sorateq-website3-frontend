import { ProjectBriefData, ProjectProfile } from "../types";

export function generateProjectBrief(profile: ProjectProfile, conversationSummary?: string): ProjectBriefData {
  const projectName = profile.projectName || "New Product MVP";
  const problem = profile.problemStatement || "Problem space definition in progress.";
  const targetUsers = profile.targetAudience || profile.users || "Early adopter users & operators";

  const proposedMVP =
    profile.mvpRequirements && profile.mvpRequirements.length > 0
      ? profile.mvpRequirements
      : [
          "Core user onboarding & authentication flow",
          "Primary workflow engine for key user jobs",
          "Automated telemetry & usage metrics dashboard",
          "Essential integrations & webhook notifications",
        ];

  const potentialArchitecture =
    profile.preferredTechnologies && profile.preferredTechnologies.length > 0
      ? profile.preferredTechnologies
      : [
          "Next.js App Router (Full-stack TypeScript)",
          "PostgreSQL with pgvector for relational & semantic storage",
          "Tailwind CSS for ultra-fast, accessible UI",
          "Provider-agnostic LLM orchestration layer",
        ];

  const integrations =
    profile.integrations && profile.integrations.length > 0
      ? profile.integrations
      : ["Authentication (OAuth/Magic Key)", "Stripe Payments (if monetized)", "Transactional Email (Resend)"];

  const openQuestions = [];
  if (!profile.timeline) openQuestions.push("Target release timeline / launch window");
  if (!profile.budget) openQuestions.push("Budget parameters and milestone preferences");
  if (!profile.targetAudience) openQuestions.push("Primary persona validation (B2B vs B2C focus)");
  if (openQuestions.length === 0) {
    openQuestions.push("Initial technical audit of external API dependencies");
  }

  return {
    projectName,
    objective: profile.solution || conversationSummary || "Build and launch a production-ready MVP through lean sprints.",
    problem,
    targetUsers,
    proposedMVP,
    potentialArchitecture,
    integrations,
    timeline: profile.timeline || "4 - 8 Weeks (Target Sprint)",
    budget: profile.budget || "Fixed milestone scope (To be aligned)",
    currentStage: profile.currentStage || "Early Discovery / Concept",
    openQuestions,
    nextStep: "Technical Discovery Call with Sorateq Product Lead",
    generatedAt: new Date().toISOString(),
  };
}
