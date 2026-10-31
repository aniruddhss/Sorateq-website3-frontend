import { Lead, ProjectProfile } from "../types";

export function evaluateLeadScore(profile: ProjectProfile, hasMeetingIntent: boolean): { score: number; state: Lead["qualificationState"] } {
  let score = 20; // Base score for entering email

  if (profile.projectName || profile.projectCategory) score += 15;
  if (profile.problemStatement) score += 15;
  if (profile.targetAudience || profile.users) score += 10;
  if (profile.mvpRequirements && profile.mvpRequirements.length > 0) score += 15;
  if (profile.budget) score += 10;
  if (profile.timeline) score += 10;
  if (profile.urgency === "immediate" || profile.urgency === "within_1_month") score += 10;
  if (hasMeetingIntent || profile.meetingIntent) score += 20;

  score = Math.min(100, Math.max(0, score));

  let state: Lead["qualificationState"] = "prospect";
  if (score >= 80 || hasMeetingIntent) {
    state = "high_intent";
  } else if (score >= 50) {
    state = "qualified";
  } else {
    state = "prospect";
  }

  return { score, state };
}
