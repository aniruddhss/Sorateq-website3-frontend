import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface ComingSoonProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function ComingSoon({ eyebrow, title, description }: ComingSoonProps) {
  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[var(--background)] px-6 text-center text-[var(--foreground)] md:px-16">
      <div className="grid-bg pointer-events-none absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-3xl">
        <p className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.35em] text-[var(--muted-foreground)]">
          <span className="relative flex h-2 w-2">
            <span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-[var(--accent-orange)] opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent-orange)]" />
          </span>
          {eyebrow} · Coming soon
        </p>

        <h1 className="mt-8 text-[clamp(3rem,8vw,6.5rem)] font-medium leading-[0.95] tracking-[-0.06em]">
          {title}
          <span className="font-serif italic text-[var(--muted-foreground)]">.</span>
        </h1>

        <p className="mx-auto mt-8 max-w-xl text-base leading-7 text-[var(--muted-foreground)] md:text-lg">{description}</p>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--foreground)] px-7 py-3.5 text-sm font-medium text-[var(--background)] transition-transform duration-300 hover:-translate-y-0.5"
          >
            Get notified
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border-hover)] px-7 py-3.5 text-sm font-medium transition-colors duration-300 hover:bg-[var(--accent)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
