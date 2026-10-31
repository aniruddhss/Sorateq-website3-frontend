export interface EmailValidationResult {
  isValid: boolean;
  error?: string;
  normalizedEmail?: string;
}

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "tempmail.com",
  "guerrillamail.com",
  "10minutemail.com",
  "throwawaymail.com",
  "trashmail.com",
  "sharklasers.com",
  "yopmail.com",
]);

export function validateEmail(input: unknown): EmailValidationResult {
  if (!input || typeof input !== "string") {
    return { isValid: false, error: "Enter a valid email address." };
  }

  const raw = input.trim();

  // Basic length checks
  if (raw.length === 0) {
    return { isValid: false, error: "Enter a valid email address." };
  }
  if (raw.length > 254) {
    return { isValid: false, error: "Email address is too long." };
  }

  // Must not contain whitespace
  if (/\s/.test(raw)) {
    return { isValid: false, error: "Email address must not contain spaces." };
  }

  // Exactly one '@' symbol
  const atParts = raw.split("@");
  if (atParts.length !== 2) {
    return { isValid: false, error: "Enter a valid email address with a single '@'." };
  }

  const [localPart, domainPart] = atParts;

  // Local part checks
  if (!localPart || localPart.length === 0 || localPart.length > 64) {
    return { isValid: false, error: "Invalid email username." };
  }
  if (localPart.startsWith(".") || localPart.endsWith(".") || localPart.includes("..")) {
    return { isValid: false, error: "Invalid dot placement in email." };
  }

  // Domain part checks
  if (!domainPart || domainPart.length < 3 || domainPart.length > 253) {
    return { isValid: false, error: "Invalid email domain." };
  }
  if (domainPart.startsWith(".") || domainPart.endsWith(".") || domainPart.includes("..")) {
    return { isValid: false, error: "Invalid dot placement in domain." };
  }

  const domainLabels = domainPart.split(".");
  if (domainLabels.length < 2) {
    return { isValid: false, error: "Email domain must have a valid extension (e.g., .com, .io, .ai)." };
  }

  const tld = domainLabels[domainLabels.length - 1];
  if (!tld || tld.length < 2 || !/^[a-zA-Z]{2,24}$/.test(tld)) {
    return { isValid: false, error: "Invalid top-level domain." };
  }

  for (const label of domainLabels) {
    if (!label || label.startsWith("-") || label.endsWith("-")) {
      return { isValid: false, error: "Invalid domain characters." };
    }
    if (!/^[a-zA-Z0-9-]+$/.test(label)) {
      return { isValid: false, error: "Domain contains invalid characters." };
    }
  }

  // General RFC-like regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(raw)) {
    return { isValid: false, error: "Enter a valid email address." };
  }

  const normalizedDomain = domainPart.toLowerCase();
  if (DISPOSABLE_DOMAINS.has(normalizedDomain)) {
    return { isValid: false, error: "Please use a standard work or personal email address." };
  }

  const normalizedEmail = `${localPart.toLowerCase()}@${normalizedDomain}`;

  return {
    isValid: true,
    normalizedEmail,
  };
}
