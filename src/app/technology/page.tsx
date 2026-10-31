import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Code, Database, Cpu, Cloud, Smartphone, Lock } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Technology Stack & Architecture | Sorateq",
  description:
    "Explore the production technology stack, architectural choices, and infrastructure philosophy powering Sorateq products.",
};

const TECH_CATEGORIES = [
  {
    title: "Frontend & Web Architecture",
    description: "Next.js App Router, React 19, TypeScript, Tailwind CSS, Radix UI, Framer Motion.",
    why: "Server-side rendering, sub-100ms first paint, edge streaming, and strict type safety across components.",
    icon: Code,
  },
  {
    title: "Backend & Systems",
    description: "Node.js, Python / FastAPI, Go, GraphQL, REST, WebSocket engines.",
    why: "Fast asynchronous execution, lightweight runtime overhead, and clean microservices where needed.",
    icon: Cpu,
  },
  {
    title: "Database & Vector Intelligence",
    description: "PostgreSQL, pgvector, Redis, ClickHouse, TimescaleDB.",
    why: "ACID transactional reliability combined with native sub-second semantic vector similarity search.",
    icon: Database,
  },
  {
    title: "Cloud & Edge Infrastructure",
    description: "AWS, Cloudflare Edge Workers, Vercel, Docker, Terraform.",
    why: "Zero-downtime automated deployments, DDoS protection, global low latency, and predictable compute costs.",
    icon: Cloud,
  },
  {
    title: "AI Model Ecosystem",
    description: "OpenAI GPT-4o, Anthropic Claude 3.5 Sonnet, Google Gemini 2.0, DeepSeek, Groq, Ollama.",
    why: "Multi-provider model routing, fallback matrices, latency optimization, and automated evaluation suites.",
    icon: Sparkles,
  },
  {
    title: "Security & Compliance",
    description: "SOC2-ready telemetry, HIPAA compliance frameworks, end-to-end encryption, automated linting.",
    why: "Zero security debt from Day 1. Granular RBAC, audit trails, and encrypted storage.",
    icon: Lock,
  },
];

export default function TechnologyPage() {
  return (
    <div className="flex-1 py-16 px-6 sm:px-12 md:px-16 max-w-6xl mx-auto space-y-20">
      {/* Hero */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] text-xs font-mono text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>PRODUCTION STACK & ARCHITECTURE</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white uppercase leading-[1.08]">
          Engineered for <br />
          <span className="text-zinc-400">speed, clarity and scale.</span>
        </h1>
        <p className="text-base sm:text-lg text-zinc-300 font-light leading-relaxed">
          We don&apos;t use hype-driven technologies. We choose proven, battle-tested modern foundations that let small teams ship at breakneck speed.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {TECH_CATEGORIES.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-zinc-900/40 p-8 space-y-4 hover:border-white/20 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white">
                  <Icon className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <div className="text-xs font-mono text-emerald-400">{item.description}</div>
              </div>

              <div className="pt-3 border-t border-white/5 text-xs text-zinc-400 leading-relaxed font-sans">
                <span className="font-mono text-zinc-500 uppercase text-[10px] block mb-1">Architectural Rationale</span>
                {item.why}
              </div>
            </div>
          );
        })}
      </div>

      {/* Banner */}
      <div className="rounded-2xl border border-white/15 bg-zinc-900/80 p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ARCHITECTURAL AUDIT</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold text-white">
            Have an existing stack or technical questions?
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Sora can review your backend architecture, assess refactoring feasibility, or recommend database topologies.
          </p>
        </div>
        <Link
          href="/sora"
          className="px-6 py-3.5 rounded-xl bg-white text-zinc-950 font-medium text-xs hover:bg-zinc-200 transition-all flex items-center space-x-2 shrink-0 shadow-lg"
        >
          <span>Ask Sora</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
