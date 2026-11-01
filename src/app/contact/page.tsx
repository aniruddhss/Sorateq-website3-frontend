"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MeetingSchedulerModal } from "@/components/MeetingSchedulerModal";
import { Sparkles, ArrowRight, Mail, Calendar, MapPin, Clock, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [isMeetingOpen, setIsMeetingOpen] = useState(false);

  return (
    <div className="flex-1 py-16 px-6 sm:px-12 md:px-16 max-w-6xl mx-auto space-y-20">
      {/* Hero */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] text-xs font-mono text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>DIRECT CONTACT & SCHEDULING</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white uppercase leading-[1.08]">
          Let&apos;s talk about <br />
          <span className="text-zinc-400">what you want to build.</span>
        </h1>
        <p className="text-base sm:text-lg text-zinc-300 font-light leading-relaxed">
          Whether you have an early product thesis or an active RFP, we are ready to dive directly into technical scoping.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Option 1: Schedule Direct Meeting */}
        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-white">Schedule Discovery Call</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Book a 25-minute technical conversation directly with a Sorateq founding engineer.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-zinc-300 font-mono">
              <li className="flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-2" />
                <span>Scope & MVP feasibility review</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-2" />
                <span>Architecture & stack recommendations</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-2" />
                <span>Transparent fixed milestone pricing</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => setIsMeetingOpen(true)}
            className="w-full flex items-center justify-center space-x-2 rounded-xl bg-white px-5 py-3 text-xs font-medium text-zinc-950 hover:bg-zinc-200 transition-all shadow-md"
          >
            <span>Pick a Time Slot</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Option 2: Start with Sora */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 p-1.5 flex items-center justify-center overflow-hidden">
              <Image
                src="/sorateq-logo-medium.png"
                alt="Sora"
                width={28}
                height={28}
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">Fastest Path</div>
              <h3 className="text-2xl font-semibold text-white mt-0.5">Start with Sora</h3>
              <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                Talk through your idea now. Sora will assemble your project brief before our team conversation.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-zinc-300 font-mono">
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2" />
                <span>Instant interactive feedback</span>
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2" />
                <span>Automatic structured PRD brief</span>
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2" />
                <span>No signup required</span>
              </li>
            </ul>
          </div>

          <Link
            href="/sora"
            className="w-full flex items-center justify-center space-x-2 rounded-xl bg-emerald-500 text-zinc-950 px-5 py-3 text-xs font-medium hover:bg-emerald-400 transition-all shadow-lg font-sans"
          >
            <span>Launch Sora Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Direct Contact Meta */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/30 p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs font-mono">
        <div className="space-y-1">
          <div className="flex items-center text-zinc-500 uppercase tracking-wider text-[10px]">
            <Mail className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
            <span>Direct Email</span>
          </div>
          <a href="mailto:hello@sorateq.com" className="text-zinc-200 hover:text-white block text-sm">
            hello@sorateq.com
          </a>
        </div>

        <div className="space-y-1">
          <div className="flex items-center text-zinc-500 uppercase tracking-wider text-[10px]">
            <Clock className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
            <span>Operating Hours</span>
          </div>
          <div className="text-zinc-200 text-sm">Mon – Fri / 24h Global Async</div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center text-zinc-500 uppercase tracking-wider text-[10px]">
            <MapPin className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
            <span>Studio Location</span>
          </div>
          <div className="text-zinc-200 text-sm">San Francisco / Remote First</div>
        </div>
      </div>

      <MeetingSchedulerModal isOpen={isMeetingOpen} onClose={() => setIsMeetingOpen(false)} />
    </div>
  );
}
