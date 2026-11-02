"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MeetingSchedulerModal } from "@/components/MeetingSchedulerModal";
import { ArrowRight, Mail, Calendar, MapPin, Clock, CheckCircle2, ArrowUpRight } from "lucide-react";

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export default function ContactPage() {
  const [isMeetingOpen, setIsMeetingOpen] = useState(false);

  return (
    <div className="flex-1 py-10 sm:py-16 px-4 sm:px-8 md:px-16 max-w-6xl mx-auto space-y-12 sm:space-y-16 md:space-y-20">
      {/* Hero */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] text-xs font-mono text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>DIRECT CONTACT & SCHEDULING</span>
        </div>
        <h1 className="text-[clamp(1.85rem,5.5vw,3.75rem)] font-bold tracking-tight text-white uppercase leading-[1.08]">
          Let&apos;s talk about <br />
          <span className="text-zinc-400">what you want to build.</span>
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-zinc-300 font-light leading-relaxed">
          Whether you have an early product thesis or an active RFP, we are ready to dive directly into technical scoping.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* Option 1: Schedule Direct Meeting */}
        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5 sm:p-7 md:p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold text-white">Schedule Discovery Call</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Book a 25-minute technical conversation directly with a Sorateq founding engineer.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-zinc-300 font-mono">
              <li className="flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-2 shrink-0" />
                <span>Scope & MVP feasibility review</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-2 shrink-0" />
                <span>Architecture & stack recommendations</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-2 shrink-0" />
                <span>Transparent fixed milestone pricing</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://calendar.app.google/am18JEY6EjxrDyZd6"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-h-[44px] flex items-center justify-center space-x-2 rounded-xl bg-white px-5 py-3 text-xs font-medium text-zinc-950 hover:bg-zinc-200 transition-all shadow-md"
            >
              <span>Book on Google Calendar</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <button
              onClick={() => setIsMeetingOpen(true)}
              className="min-h-[44px] flex items-center justify-center space-x-1.5 rounded-xl border border-white/10 bg-zinc-800/80 px-4 py-3 text-xs font-medium text-zinc-200 hover:text-white hover:bg-zinc-800 transition-all"
            >
              <span>Quick Slot</span>
            </button>
          </div>
        </div>

        {/* Option 2: Start with Sora */}
        <div className="rounded-2xl border border-[var(--accent-orange)]/30 bg-[var(--accent-orange)]/[0.03] p-5 sm:p-7 md:p-8 space-y-6 flex flex-col justify-between hover:border-[var(--accent-orange)]/50 transition-colors">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-[var(--accent-orange)]/30 p-1.5 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(255,90,31,0.15)]">
              <Image
                src="/sorateq-logo-medium.png"
                alt="Sora"
                width={28}
                height={28}
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <div className="text-[11px] font-mono text-[var(--accent-orange)] uppercase tracking-wider font-semibold">Fastest Path</div>
              <h3 className="text-xl sm:text-2xl font-semibold text-white mt-0.5">Start with Sora</h3>
              <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                Talk through your idea now. Sora will assemble your project brief before our team conversation.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-zinc-300 font-mono">
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-orange)] mr-2 shrink-0 shadow-[0_0_6px_rgba(255,90,31,0.8)]" />
                <span>Instant interactive feedback</span>
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-orange)] mr-2 shrink-0 shadow-[0_0_6px_rgba(255,90,31,0.8)]" />
                <span>Automatic structured PRD brief</span>
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-orange)] mr-2 shrink-0 shadow-[0_0_6px_rgba(255,90,31,0.8)]" />
                <span>No signup required</span>
              </li>
            </ul>
          </div>

          <Link
            href="/sora"
            className="w-full min-h-[44px] flex items-center justify-center space-x-2 rounded-xl bg-[var(--accent-orange)] text-white px-5 py-3 text-xs font-medium hover:bg-[#e04f1a] transition-all shadow-[0_4px_20px_rgba(255,90,31,0.25)] font-sans"
          >
            <span>Launch Sora Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Direct Contact Meta */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/30 p-5 sm:p-7 md:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs font-mono">
        <div className="space-y-1">
          <div className="flex items-center text-zinc-500 uppercase tracking-wider text-[10px]">
            <Mail className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
            <span>Direct Email</span>
          </div>
          <a href="mailto:ani@sorateq.com" className="text-zinc-200 hover:text-white block text-sm">
            ani@sorateq.com
          </a>
        </div>

        <div className="space-y-1">
          <div className="flex items-center text-zinc-500 uppercase tracking-wider text-[10px]">
            <Calendar className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
            <span>Google Calendar</span>
          </div>
          <a
            href="https://calendar.app.google/am18JEY6EjxrDyZd6"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-200 hover:text-white inline-flex items-center gap-1 text-sm"
          >
            Schedule 25m Call
            <ArrowUpRight className="w-3 h-3 text-zinc-400" />
          </a>
        </div>

        <div className="space-y-1">
          <div className="flex items-center text-zinc-500 uppercase tracking-wider text-[10px]">
            <LinkedinIcon className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
            <span>LinkedIn</span>
          </div>
          <a
            href="https://www.linkedin.com/company/sorateqstudio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-200 hover:text-white inline-flex items-center gap-1 text-sm"
          >
            sorateqstudio
            <ArrowUpRight className="w-3 h-3 text-zinc-400" />
          </a>
        </div>

        <div className="space-y-1">
          <div className="flex items-center text-zinc-500 uppercase tracking-wider text-[10px]">
            <Clock className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
            <span>Operating Hours</span>
          </div>
          <div className="text-zinc-200 text-sm">Mon – Fri / 24h Global Async</div>
        </div>
      </div>

      <MeetingSchedulerModal isOpen={isMeetingOpen} onClose={() => setIsMeetingOpen(false)} />
    </div>
  );
}
