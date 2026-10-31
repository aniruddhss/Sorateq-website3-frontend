import { ConversationState, IntentType, ProjectProfile } from "../types";

export function transitionState(
  currentState: ConversationState,
  intent: IntentType,
  messageCount: number,
  profile: ProjectProfile
): ConversationState {
  if (intent === "meeting") {
    return "MEETING_INTENT";
  }

  if (currentState === "BOOKING") {
    return "COMPLETED";
  }

  if (intent === "portfolio") {
    return "PORTFOLIO_EXPLORATION";
  }

  if (intent === "pricing") {
    return "PRICING_DISCUSSION";
  }

  if (intent === "project_inquiry") {
    return "PROJECT_DISCOVERY";
  }

  // Profile-driven progression
  if (profile.problemStatement && profile.targetAudience && profile.mvpRequirements?.length) {
    if (profile.budget || profile.timeline || profile.urgency) {
      return "QUALIFICATION";
    }
    return "PROJECT_PLANNING";
  }

  if (profile.problemStatement || profile.industry || profile.projectCategory) {
    return "PROJECT_DEFINITION";
  }

  if (messageCount <= 1) {
    return "INTRODUCTION";
  }

  return "GENERAL_DISCOVERY";
}
