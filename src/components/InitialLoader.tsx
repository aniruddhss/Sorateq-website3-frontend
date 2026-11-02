"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export function InitialLoader() {
  const [shouldRender, setShouldRender] = useState(false);
  const [phase, setPhase] = useState<"enter" | "active" | "exit" | "done">("enter");

  useEffect(() => {
    // Only runs once per browser session
    try {
      const alreadyLoaded = sessionStorage.getItem("sorateq_intro_seen");
      if (alreadyLoaded) {
        setPhase("done");
        return;
      }
    } catch {
      // Storage unavailable in restricted/private modes
    }

    setShouldRender(true);
    document.body.style.overflow = "hidden";

    // Precise, architectural choreography (~950ms total)
    const tActive = setTimeout(() => {
      setPhase("active");
    }, 120);

    const tExit = setTimeout(() => {
      setPhase("exit");
      try {
        sessionStorage.setItem("sorateq_intro_seen", "true");
      } catch {}
    }, 820);

    const tDone = setTimeout(() => {
      setPhase("done");
      document.body.style.overflow = "";
    }, 1450);

    return () => {
      clearTimeout(tActive);
      clearTimeout(tExit);
      clearTimeout(tDone);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "done" || !shouldRender) return null;

  const isExiting = phase === "exit";
  const isActive = phase === "active" || phase === "exit";

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-between bg-[#08080a] text-zinc-100 transition-all duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] ${
        isExiting ? "-translate-y-full opacity-90 pointer-events-none" : "translate-y-0 opacity-100"
      }`}
      aria-hidden={isExiting}
    >
      {/* Editorial Frame Top */}
      <div className="flex items-center justify-between px-6 py-6 font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 sm:px-12 sm:py-8">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-orange)]" />
          <span>SORATEQ STUDIO</span>
        </div>
        <span>ARCHITECTURAL INGENUITY</span>
      </div>

      {/* Centerpiece Monogram & Typography */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Subtle, restrained warm light pool */}
        <div
          className={`pointer-events-none absolute h-[320px] w-[320px] rounded-full bg-[var(--accent-orange)]/[0.06] blur-[90px] transition-opacity duration-700 ${
            isActive ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Center Container with Architectural Framing */}
        <div
          className={`relative z-10 flex flex-col items-center transition-all duration-700 ease-out ${
            isActive ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-3"
          }`}
        >
          {/* Emblem */}
          <div className="relative mb-5 flex h-16 w-16 items-center justify-center">
            <Image
              src="/sorateq-logo-medium.png"
              alt="Sorateq"
              width={64}
              height={64}
              className="h-full w-full object-contain drop-shadow-[0_4px_24px_rgba(255,90,31,0.22)]"
              priority
            />
          </div>

          {/* Studio Wordmark */}
          <h1 className="font-serif text-3xl sm:text-4xl italic tracking-tight text-white">
            Sorateq
          </h1>

          {/* Architectural Laser Hairline */}
          <div className="relative my-4 h-[1px] w-32 overflow-hidden bg-zinc-800">
            <div
              className={`absolute inset-0 bg-gradient-to-r from-transparent via-[var(--accent-orange)] to-transparent transition-transform duration-700 ease-out ${
                isActive ? "translate-x-0" : "-translate-x-full"
              }`}
            />
          </div>

          {/* Subtitle */}
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-zinc-400">
            Systems Architecture & AI Engineering
          </p>
        </div>
      </div>

      {/* Editorial Frame Bottom */}
      <div className="flex items-center justify-between px-6 py-6 font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 sm:px-12 sm:py-8">
        <span>TOKYO / GLOBAL</span>
        <span>EDITION 2026</span>
      </div>
    </div>
  );
}
