import { ProjectRecord } from "../types";

// Contact options appear once the visitor has taken this many turns.
export const CONTACT_OPTIONS_AFTER_TURNS = 3;

const STOP_WORDS = new Set([
  "the", "and", "for", "are", "but", "not", "you", "all", "can", "had", "her", "was", "one", "our",
  "out", "has", "have", "this", "that", "with", "from", "they", "will", "would", "could", "should",
  "about", "into", "just", "like", "your", "their", "want", "need", "make", "build", "help", "tell",
  "looking", "something", "idea", "project", "projects", "example", "examples", "website", "business",
  "company", "product", "platform", "system", "tool", "service", "services", "really", "also", "more",
  "what", "which", "when", "where", "how", "who", "why", "yes", "its", "it's", "is", "to", "of", "in",
  "on", "at", "be", "do", "we", "i", "a", "an", "or", "my", "me", "any", "some", "there", "here",
  // Generic product-type words: shared by almost every project, so they do not signal relatedness
  "saas", "ai", "app", "apps", "web", "mobile", "dashboard", "software", "digital", "online", "cloud",
  "automation", "workflow", "workflows", "portal", "application", "solution", "solutions", "mvp",
  "track", "tracking", "tracker", "management", "platform", "tool", "tools",
]);

export function extractKeywords(text: string): string[] {
  const tokens = text
    .toLowerCase()
    .split(/[^a-z0-9+#]+/)
    .filter((t) => t.length >= 2 && !STOP_WORDS.has(t));
  return Array.from(new Set(tokens));
}

// A project is related only when the visitor's message shares a specific term with it.
// Broad category labels (e.g. "cybersecurity & compliance saas") are excluded, because a
// shared category word such as "compliance" does not mean the visitor wants that project.
export function isProjectRelated(project: ProjectRecord, text: string): boolean {
  const keywords = extractKeywords(text);
  if (keywords.length === 0) return false;

  const categoryTokens = new Set(
    [project.industry, project.projectType, ...(project.services || [])]
      .join(" ")
      .toLowerCase()
      .split(/[^a-z0-9+#]+/)
      .filter(Boolean)
  );

  const specificFields = [project.name, ...(project.keywords || [])].filter(Boolean);
  const specificText = specificFields.join(" ").toLowerCase();
  const specificTokens = new Set(specificText.split(/[^a-z0-9+#]+/).filter(Boolean));

  return keywords.some(
    (k) =>
      !categoryTokens.has(k) &&
      (specificTokens.has(k) || (k.length >= 5 && specificText.includes(k)))
  );
}
