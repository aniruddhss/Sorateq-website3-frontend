import React from "react";
import Link from "next/link";
import { data } from "@/lib/data";
import { ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How We Work | 6-Phase Lean Methodology | Sorateq",
  description:
    "Learn about Sorateq's 6-step lean execution process: Understand, Define, Prototype, Build, Iterate, and Launch.",
};

export default async function HowWeWorkPage() {
  const steps = await data.getMethodology();

  return (
    <div className="flex-1 py-10 sm:py-16 px-4 sm:px-8 md:px-16 max-w-6xl mx-auto space-y-12 sm:space-y-16 md:space-y-20">
      {/* Hero */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] text-xs font-mono text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>METHODOLOGY & EXECUTION</span>
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white uppercase leading-[1.08]">
          How We Work. <br />
          <span className="text-zinc-400">From concept to production.</span>
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-zinc-300 font-light leading-relaxed">
          We strip out guesswork and replace it with a transparent 6-stage engineering sprint model.
        </p>
      </div>

      {/* Steps Timeline */}
      <div className="space-y-6 sm:space-y-8">
        {steps.map((step) => (
          <div
            key={step.step}
            className="rounded-2xl border border-white/10 bg-zinc-900/40 p-5 sm:p-7 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start hover:border-white/20 transition-all"
          >
            <div className="md:col-span-3 space-y-1.5 sm:space-y-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">0{step.step}.</span>
              <h3 className="text-xl sm:text-2xl font-semibold text-white">{step.title}</h3>
              <div className="flex items-center text-xs font-mono text-zinc-500">
                <Clock className="w-3.5 h-3.5 mr-1" />
                <span>{step.duration}</span>
              </div>
            </div>

            <div className="md:col-span-5 space-y-2">
              <div className="text-xs font-mono uppercase text-zinc-400">{step.subtitle}</div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">{step.description}</p>
            </div>

            <div className="md:col-span-4 bg-zinc-950/60 p-4 rounded-xl border border-white/5 space-y-2">
              <div className="text-[10px] font-mono uppercase text-zinc-500">Phase Deliverables</div>
              <ul className="space-y-1.5">
                {step.deliverables.map((item, idx) => (
                  <li key={idx} className="text-xs text-zinc-300 flex items-start">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-2 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Banner */}
      <div className="rounded-2xl border border-white/15 bg-zinc-900/80 p-6 sm:p-10 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span>ALIGN ON A SPRINT</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold text-white">
            Ready to plan your development roadmap?
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Talk with Sora to generate your product brief and review phase milestones.
          </p>
        </div>
        <Link
          href="/sora"
          className="w-full sm:w-auto min-h-[44px] justify-center px-6 py-3.5 rounded-xl bg-white text-zinc-950 font-medium text-xs hover:bg-zinc-200 transition-all flex items-center space-x-2 shrink-0 shadow-lg"
        >
          <span>Plan with Sora</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
