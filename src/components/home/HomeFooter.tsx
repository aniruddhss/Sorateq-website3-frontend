"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Magnetic } from "./Magnetic";

const columns = [
  {
    title: "Sora",
    links: [
      { label: "Talk to Sora", href: "/sora" },
      { label: "How We Work", href: "/how-we-work" },
      { label: "Capabilities", href: "/capabilities" },
    ],
  },
  {
    title: "Studio",
    links: [
      { label: "Projects", href: "/projects" },
      { label: "Web Experiences", href: "/web-experiences" },
      { label: "Architecture & Stack", href: "/technology" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Book a meeting", href: "/contact" },
      { label: "hello@sorateq.com", href: "mailto:hello@sorateq.com" },
    ],
  },
];

const WORD = "SORATEQ";

function useLocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZoneName: "short",
        }).format(new Date())
      );
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return time;
}

export function HomeFooter() {
  const localTime = useLocalTime();

  return (
    <footer className="relative overflow-hidden border-t border-[var(--border)] bg-[var(--background)] px-6 pb-10 pt-24 text-[var(--foreground)] md:px-16">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-16 lg:grid-cols-[1.2fr_1fr] lg:gap-24">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[var(--muted-foreground)]">
              Ideas in. Products out.
            </p>
            <h2 className="mt-8 text-[clamp(2.5rem,6vw,5rem)] font-medium leading-[0.98] tracking-[-0.05em]">
              Have an idea
              <br />
              <span className="font-serif italic text-[var(--muted-foreground)]">worth building?</span>
            </h2>

            <Magnetic>
              <Link
                href="/contact"
                className="group mt-10 inline-flex items-center gap-3 rounded-full border border-[var(--border-hover)] px-6 py-3 text-sm font-medium transition-colors duration-300 hover:border-[var(--accent-orange)] hover:text-[var(--accent-orange)]"
              >
                Start a project
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </Magnetic>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
                  {col.title}
                </p>
                <ul className="flex flex-col gap-3.5 text-sm">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[var(--foreground)]/80 underline-offset-4 transition-colors hover:text-[var(--accent-orange)] hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="group mt-24 select-none overflow-hidden">
          <div className="flex justify-between text-[clamp(3.5rem,15vw,15rem)] font-medium leading-[0.8] tracking-[-0.07em]">
            {WORD.split("").map((letter, i) => (
              <span
                key={`${letter}-${i}`}
                className="inline-block text-[var(--border-hover)] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2 group-hover:text-[var(--foreground)]"
                style={{ transitionDelay: `${i * 45}ms` }}
              >
                {letter}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-[var(--border)] pt-8 text-[11px] uppercase tracking-[0.25em] text-[var(--muted-foreground)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-[var(--accent-orange)] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent-orange)]" />
            </span>
            <span>Accepting new projects</span>
            {localTime && <span className="font-mono normal-case tracking-normal">· {localTime}</span>}
          </div>
          <span>© {new Date().getFullYear()} Sorateq Studio. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
