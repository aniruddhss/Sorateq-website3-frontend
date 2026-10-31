import { cookies } from "next/headers";
import { data } from "./data";
import { VisitorSession } from "./types";

const SESSION_COOKIE_NAME = "sorateq_session";

export async function getCurrentSession(): Promise<VisitorSession | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (!sessionCookie || !sessionCookie.value) {
      return null;
    }

    const session = await data.getSession(sessionCookie.value);
    return session || null;
  } catch {
    return null;
  }
}

export async function setSessionCookie(sessionId: string) {
  try {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });
  } catch {
    // In edge/client contexts where cookies() is not modifiable
  }
}

export async function clearSessionCookie() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch {
    // Best effort
  }
}
