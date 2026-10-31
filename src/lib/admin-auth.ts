import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE = "sorateq_admin_token";

const DEV_FALLBACK_SECRET = "dev-only-admin-secret";

export function getAdminSecret(): string {
  const secret = process.env.ADMIN_SECRET;
  if (secret && secret.length >= 16) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_SECRET must be set (16+ characters) in production.");
  }
  return DEV_FALLBACK_SECRET;
}

export function adminToken(): string {
  return createHmac("sha256", getAdminSecret()).update("sorateq-admin-session").digest("hex");
}

export function isValidAdminToken(value: string | undefined): boolean {
  if (!value) return false;
  const expected = Buffer.from(adminToken());
  const given = Buffer.from(value);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export function isValidAdminPassword(password: unknown): boolean {
  if (typeof password !== "string") return false;
  const expected = Buffer.from(getAdminSecret());
  const given = Buffer.from(password);
  return given.length === expected.length && timingSafeEqual(given, expected);
}
