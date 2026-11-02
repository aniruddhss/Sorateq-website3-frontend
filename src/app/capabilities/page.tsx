import React from "react";
import Link from "next/link";
import { data } from "@/lib/data";
import { ArrowRight, CheckCircle2, Layers } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studio Capabilities | Sorateq",
  description:
    "Explore Sorateq's full-stack engineering capabilities: AI agents, SaaS development, rapid MVPs, mobile applications, and system architecture.",
};

export default async function CapabilitiesPage() {
  const capabilities = await data.getCapabilities("PUBLIC");

  return (
    <div className="flex-1 py-10 sm:py-16 px-4 sm:px-8 md:px-16 max-w-6xl mx-auto space-y-12 sm:space-y-16 md:space-y-20">
      {/* Hero */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] text-xs font-mono text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>TECHNICAL PILLARS</span>
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white uppercase leading-[1.08]">
          Capabilities & <br />
          <span className="text-zinc-400">Engineering Scope.</span>
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-zinc-300 font-light leading-relaxed">
          From multi-model AI agent pipelines to production SaaS multi-tenancy, we build scalable software systems designed for high velocity.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {capabilities.map((cap) => (
          <div
            key={cap.id}
            className="rounded-2xl border border-white/10 bg-zinc-900/40 p-5 sm:p-7 md:p-8 space-y-6 hover:border-white/20 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-white">{cap.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">{cap.fullDescription}</p>
            </div>

            <div className="space-y-2">
              <div className="text-[11px] font-mono uppercase text-zinc-500">Core Deliverables</div>
              <ul className="space-y-1.5">
                {cap.deliverables.map((item, idx) => (
                  <li key={idx} className="text-xs text-zinc-300 flex items-start">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-2 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-white/5">
              <div className="text-[10px] font-mono uppercase text-zinc-500 mb-2">Primary Stack</div>
              <div className="flex flex-wrap gap-1.5">
                {cap.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-white/5"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Banner */}
      <div className="rounded-2xl border border-white/15 bg-zinc-900/80 p-6 sm:p-10 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span>NOT SURE WHAT YOU NEED?</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold text-white">
            Talk it through with Sora
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Sora will analyze your feature wishlist and recommend the leanest technology stack for your V1.
          </p>
        </div>
        <Link
          href="/sora"
          className="w-full sm:w-auto min-h-[44px] justify-center px-6 py-3.5 rounded-xl bg-white text-zinc-950 font-medium text-xs hover:bg-zinc-200 transition-all flex items-center space-x-2 shrink-0 shadow-lg"
        >
          <span>Talk with Sora</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
