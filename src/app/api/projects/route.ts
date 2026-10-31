import { NextRequest, NextResponse } from "next/server";
import { data } from "@/lib/data";
import { db } from "@/lib/store";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";
  const industry = searchParams.get("industry") || undefined;
  const projectType = searchParams.get("type") || undefined;

  try {
    const projects = await data.searchProjects(query, {
      industry,
      projectType,
    });
    if (projects && projects.length > 0) {
      return NextResponse.json({ success: true, projects });
    }
  } catch {
    // Backend service unavailable, use local persistent database store
  }

  const projects = db.searchProjects(query, { industry, projectType });
  return NextResponse.json({ success: true, projects });
}
