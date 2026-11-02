import React from "react";
import Link from "next/link";
import { ArrowRight, Eye, Layout, Monitor, Smartphone, Palette, Zap } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web Experiences & Digital Craft | Sorateq",
  description:
    "Explore how Sorateq crafts visually commanding, ultra-fast web experiences and interactive digital products.",
};

const EXPERIENCES = [
  {
    title: "Spatial & Fluid Micro-Interactions",
    subtitle: "Tactile Digital Ergonomics",
    description:
      "We design interfaces that respond with weight, momentum, and precision. Every transition is calibrated to make navigation feel instantaneous and delightful.",
    icon: Layout,
    metrics: "Sub-16ms Animation Frametime",
  },
  {
    title: "Headless Design Tokens & Systems",
    subtitle: "Unified Multi-Platform Tokens",
    description:
      "Design tokens distributed directly from Figma to React and iOS via automated CI pipelines, guaranteeing zero brand divergence across multi-team codebases.",
    icon: Palette,
    metrics: "100% WCAG AAA Accessibility",
  },
  {
    title: "Sub-Second Global Edge Delivery",
    subtitle: "Performance & SEO Architecture",
    description:
      "Server-rendered HTML cached across worldwide Cloudflare and Vercel edge nodes. Zero layout shifts, perfect Lighthouse scores, and effortless organic discovery.",
    icon: Zap,
    metrics: "99+ Mobile Performance Score",
  },
  {
    title: "Interactive WebGL Data Canvases",
    subtitle: "Spatial Product Visualizers",
    description:
      "High-throughput canvas graphics and 3D digital twins built with WebGL and Three.js for complex telemetry, research graphs, and analytics.",
    icon: Monitor,
    metrics: "60 FPS Fluid Rendering",
  },
];

export default function WebExperiencesPage() {
  return (
    <div className="flex-1 py-16 px-6 sm:px-12 md:px-16 max-w-6xl mx-auto space-y-20">
      {/* Hero */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] text-xs font-mono text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>DIGITAL CRAFT & INTERFACE DESIGN</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white uppercase leading-[1.08]">
          Web Experiences <br />
          <span className="text-zinc-400">that command respect.</span>
        </h1>
        <p className="text-base sm:text-lg text-zinc-300 font-light leading-relaxed">
          We treat digital products as tactile editorial artifacts. Restrained typography, generous whitespace, and lightning-fast edge performance.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {EXPERIENCES.map((exp, idx) => {
          const Icon = exp.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-zinc-900/50 p-8 space-y-4 hover:border-white/20 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white">
                  <Icon className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-zinc-500 uppercase">{exp.subtitle}</span>
                  <h3 className="text-xl font-semibold text-white mt-0.5">{exp.title}</h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">{exp.description}</p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>Standard</span>
                <span className="text-zinc-200 font-semibold">{exp.metrics}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Banner */}
      <div className="rounded-2xl border border-white/15 bg-zinc-900/80 p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span>DESIGN CONSULTATION</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold text-white">
            Need an editorial, premium web application?
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Discuss your design system, responsive ergonomics, and frontend architecture with Sora.
          </p>
        </div>
        <Link
          href="/sora"
          className="px-6 py-3.5 rounded-xl bg-white text-zinc-950 font-medium text-xs hover:bg-zinc-200 transition-all flex items-center space-x-2 shrink-0 shadow-lg"
        >
          <span>Talk with Sora</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
