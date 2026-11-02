"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, CalendarDays, Mail, Terminal } from "lucide-react";
import { ProjectRecord } from "@/lib/types";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { SmoothScroll } from "@/components/home/SmoothScroll";
import { HeroScene } from "@/components/home/HeroScene";
import { Magnetic } from "@/components/home/Magnetic";
import { ServiceIndex } from "@/components/home/ServiceIndex";
import { HomeFooter } from "@/components/home/HomeFooter";

const stats = [
  { to: 54, prefix: "", suffix: "+", label: "projects shipped" },
  { to: 11, prefix: "", suffix: "", label: "countries served" },
  { to: 98, prefix: "", suffix: "%", label: "client satisfaction" },
  { to: 100, prefix: "$", suffix: "K+", label: "client revenue earned" },
];

const FEATURED_LIMIT = 4;

function projectLinkLabel(url?: string) {
  return url?.includes("youtu") ? "Watch demo" : "Visit site";
}

const eyebrow = "text-[11px] font-medium uppercase tracking-[0.35em] text-[var(--muted-foreground)]";

export default function Home() {
  const scope = useRef<HTMLDivElement>(null);
  const heroTitle = useRef<HTMLHeadingElement>(null);
  const ctaTitle = useRef<HTMLHeadingElement>(null);
  const [featured, setFeatured] = useState<ProjectRecord[]>([]);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        const list: ProjectRecord[] = (data.projects ?? []).filter((p: ProjectRecord) => p.featured);
        setFeatured(list.slice(0, FEATURED_LIMIT));
      })
      .catch(() => setFeatured([]));
  }, []);

  useGSAP(
    () => {
      const q = gsap.utils.selector(scope);

      // Hero entrance: headline lines rise out of a mask
      const heroSplit = SplitText.create(heroTitle.current!, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
      });
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .from(heroSplit.lines, { yPercent: 110, duration: 1.6, stagger: 0.14 })
        .from(q(".hero-meta"), { opacity: 0, y: 18, duration: 1.1, stagger: 0.12 }, "-=1.2");

      // Hero exit parallax as you scroll away
      gsap.to(q(".hero-inner"), {
        yPercent: 35,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: q(".hero-section"), start: "top top", end: "bottom top", scrub: true },
      });

      // Count-up stats
      q("[data-count]").forEach((el) => {
        const to = Number(el.dataset.count);
        const prefix = el.dataset.prefix ?? "";
        const suffix = el.dataset.suffix ?? "";
        const obj = { v: 0 };
        gsap.to(obj, {
          v: to,
          duration: 2.2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate: () => {
            el.innerHTML = `${prefix}${Math.round(obj.v)}${
              suffix ? `<span class="text-[var(--accent-orange)]">${suffix}</span>` : ""
            }`;
          },
        });
      });

      // Generic scroll reveals
      q("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 60,
          opacity: 0,
          filter: "blur(10px)",
          duration: 1.3,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      // Case studies: cards stack and recede as the next one arrives
      const cards = q<HTMLElement>("[data-card]");
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        gsap.to(card, {
          scale: 0.92,
          opacity: 0.35,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top top+=140",
            endTrigger: next,
            end: "top top+=140",
            scrub: true,
          },
        });
      });

      // CTA: word-by-word reveal and rotating orbit rings with parallax
      const ctaSplit = SplitText.create(ctaTitle.current!, { type: "words", mask: "words" });
      gsap.from(ctaSplit.words, {
        yPercent: 110,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.06,
        scrollTrigger: { trigger: ctaTitle.current, start: "top 80%" },
      });

      gsap.to(q(".ring-a"), { rotation: 360, duration: 60, repeat: -1, ease: "none" });
      gsap.to(q(".ring-b"), { rotation: -360, duration: 45, repeat: -1, ease: "none" });
      gsap.to(q(".cta-rings"), {
        yPercent: -18,
        ease: "none",
        scrollTrigger: { trigger: q(".cta-section"), start: "top bottom", end: "bottom top", scrub: true },
      });

      ScrollTrigger.refresh();
    },
    { scope, dependencies: [featured], revertOnUpdate: true }
  );

  return (
    <div ref={scope} className="min-h-screen w-full overflow-x-hidden bg-[var(--background)] text-[var(--foreground)]">
      <SmoothScroll />

      {/* HERO */}
      <section className="hero-section relative flex min-h-[92vh] sm:min-h-screen items-center justify-center overflow-hidden px-4 sm:px-8 md:px-16 pt-12 pb-24 sm:pt-16 sm:pb-36">
        <div className="grid-bg pointer-events-none absolute inset-0" />
        <HeroScene />

        <div className="hero-inner relative z-10 mx-auto max-w-6xl text-center">
          <p className={`hero-meta mb-6 sm:mb-8 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.25em] sm:tracking-[0.35em] text-[var(--muted-foreground)]`}>
            AI Business Operating Systems
          </p>

          <h1
            ref={heroTitle}
            className="text-[clamp(1.9rem,5.6vw,5.25rem)] font-medium leading-[1.08] sm:leading-[1.02] tracking-[-0.035em] sm:tracking-[-0.05em] text-[var(--foreground)] px-1 sm:px-0"
          >
            We Build AI-Powered
            <br />
            <span className="font-serif italic text-[var(--muted-foreground)]">Business Operating</span> Systems.
          </h1>

          <h2 className="hero-meta mx-auto mt-6 sm:mt-8 max-w-3xl text-sm sm:text-xl md:text-2xl lg:text-3xl font-normal leading-snug sm:leading-snug tracking-tight text-[var(--foreground)]/90 px-2 sm:px-0">
            Everything your business needs to attract, manage, operate, and grow —{" "}
            <span className="font-serif italic text-[var(--muted-foreground)]">
              connected in one intelligent ecosystem.
            </span>
          </h2>

          <p className="hero-meta mx-auto mt-4 sm:mt-6 max-w-2xl text-xs sm:text-base md:text-lg leading-relaxed sm:leading-8 text-[var(--muted-foreground)] font-light px-2 sm:px-0">
            We combine websites, customer acquisition, CRM, business operations, payments, AI-powered tools, and
            intelligent automation into tailored business systems — helping companies streamline operations, capture
            more opportunities, and scale smarter.
          </p>
        </div>

        <div className="hero-meta absolute bottom-6 sm:bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 sm:gap-3 text-[var(--muted-foreground)]">
          <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.35em]">Scroll</span>
          <div className="relative h-8 sm:h-12 w-px overflow-hidden bg-[var(--border-hover)]">
            <div className="scroll-line absolute inset-0 bg-[var(--foreground)]" />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="flex min-h-0 sm:min-h-screen items-center px-4 sm:px-8 md:px-16 py-16 sm:py-24 md:py-32">
        <div className="mx-auto w-full max-w-6xl">
          <p className={eyebrow} data-reveal>By the numbers</p>
          <div className="mt-8 sm:mt-16 grid grid-cols-2 gap-6 sm:gap-x-12 sm:gap-y-16 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                data-reveal
                className="group relative border-t border-[var(--border-hover)] pt-6 sm:pt-8 transition-colors duration-500 hover:border-[var(--accent-orange)]"
              >
                <div className="absolute -top-[1px] left-0 h-[2px] w-0 bg-[var(--accent-orange)] transition-all duration-500 group-hover:w-full" />
                <div className="text-[clamp(2.25rem,4.5vw,5rem)] font-medium leading-none tracking-[-0.05em]">
                  <span data-count={stat.to} data-prefix={stat.prefix} data-suffix={stat.suffix}>
                    {stat.prefix}0{stat.suffix ? <span className="text-[var(--accent-orange)]">{stat.suffix}</span> : null}
                  </span>
                </div>
                <div className="mt-4 sm:mt-6 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[var(--muted-foreground)] transition-colors duration-300 group-hover:text-[var(--foreground)]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="flex min-h-0 sm:min-h-screen items-center px-4 sm:px-8 md:px-16 py-16 sm:py-24 md:py-32">
        <div data-reveal className="w-full">
          <ServiceIndex />
        </div>
      </section>

      {/* CASE STUDIES */}
      <section className="px-4 sm:px-8 md:px-16 py-16 sm:py-24 md:py-32">
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex flex-col items-start justify-between gap-6 sm:gap-8 md:flex-row md:items-end" data-reveal>
            <div>
              <p className={eyebrow}>Case studies</p>
              <h2 className="mt-4 sm:mt-6 text-3xl sm:text-5xl md:text-7xl font-medium tracking-[-0.04em] sm:tracking-[-0.05em]">Selected work.</h2>
            </div>
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 border-b border-[var(--foreground)] pb-1 text-xs sm:text-sm font-medium"
            >
              See all case studies
              <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent-orange)]" />
            </Link>
          </div>

          <div className="mt-12 sm:mt-20 flex flex-col gap-6 sm:gap-10">
            {featured.map((project, i) => (
              <article
                key={project.id}
                data-card
                className="static sm:sticky sm:top-24 md:top-32 flex min-h-0 sm:min-h-[60vh] md:min-h-[70vh] flex-col justify-between rounded-2xl sm:rounded-[32px] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-8 md:p-14 transition-all"
              >
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[var(--muted-foreground)]">
                  <span>
                    Case <span className="text-[var(--accent-orange)] font-mono">{String(i + 1).padStart(2, "0")}</span> · {project.industry}
                  </span>
                  {project.metrics?.[0] && (
                    <span className="rounded-full border border-[var(--accent-orange)]/50 bg-[var(--accent-orange)]/10 px-2.5 sm:px-3.5 py-0.5 sm:py-1 text-[var(--accent-orange)] font-medium shadow-[0_0_15px_rgba(255,90,31,0.12)]">
                      {project.metrics[0].value} {project.metrics[0].label}
                    </span>
                  )}
                </div>

                <div className="mt-4 sm:mt-6">
                  <h3 className="max-w-2xl text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-[-0.04em]">{project.name}</h3>
                  <p className="mt-2 sm:mt-4 max-w-2xl text-sm sm:text-xl font-serif italic text-[var(--muted-foreground)]">
                    {project.tagline}
                  </p>
                  <p className="mt-3 sm:mt-6 max-w-md text-xs sm:text-sm md:text-base leading-relaxed text-[var(--muted-foreground)]">{project.summary}</p>
                </div>

                {project.heroImage && (
                  <div className="relative my-4 sm:my-6 w-full aspect-[21/9] sm:aspect-[21/8] max-h-[220px] sm:max-h-[300px] overflow-hidden rounded-xl sm:rounded-2xl border border-[var(--border)] bg-[var(--background)]">
                    <img
                      src={encodeURI(project.heroImage)}
                      alt={project.name}
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                    />
                  </div>
                )}

                <div className="flex flex-wrap items-end justify-between gap-4 sm:gap-6 mt-4 sm:mt-0">
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {project.technologies.slice(0, 5).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-[var(--border)] px-2.5 sm:px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs text-[var(--muted-foreground)] transition-colors duration-200 hover:border-[var(--accent-orange)]/60 hover:bg-[var(--accent-orange)]/5 hover:text-[var(--accent-orange)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  {project.publicUrl && (
                    <a
                      href={project.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1.5 sm:gap-2 border-b border-[var(--foreground)] pb-1 text-xs sm:text-sm font-medium"
                    >
                      {projectLinkLabel(project.publicUrl)}
                      <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent-orange)]" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section relative flex min-h-0 sm:min-h-screen items-center justify-center overflow-hidden px-4 sm:px-8 md:px-16 py-20 sm:py-28 md:py-32">
        <div className="grid-bg pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] sm:h-[550px] w-[350px] sm:w-[550px] rounded-full bg-[var(--accent-orange)]/[0.04] blur-3xl" />
        <div className="cta-rings pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.55] sm:scale-75 md:scale-100 origin-center">
          <div className="ring-a absolute left-1/2 top-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[var(--border-hover)]" />
          <div className="ring-b absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--border)]" />
          <div className="absolute left-1/2 top-[calc(50%-360px)] h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[var(--accent-orange)] shadow-[0_0_12px_rgba(255,90,31,0.9)] animate-pulse-subtle" />
          <div className="absolute left-1/2 top-[calc(50%+240px)] h-2 w-2 -translate-x-1/2 rounded-full bg-[var(--accent-orange)]/80 shadow-[0_0_10px_rgba(255,90,31,0.6)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl text-center w-full">
          <div className="mx-auto mb-5 sm:mb-6 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl border border-[var(--accent-orange)]/30 bg-[var(--card)] p-2 shadow-sm shadow-[0_0_24px_rgba(255,90,31,0.12)] transition-transform duration-300 hover:scale-105 hover:border-[var(--accent-orange)]/60" data-reveal>
            <Image
              src="/sorateq-logo-medium.png"
              alt="Sorateq"
              width={56}
              height={56}
              className="h-full w-full object-contain"
            />
          </div>
          <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.25em] sm:tracking-[0.35em] text-[var(--muted-foreground)]" data-reveal>
            <span className="text-[var(--accent-orange)] font-bold mr-1.5">/</span>
            Start with clarity
          </p>
          <h2
            ref={ctaTitle}
            className="mt-6 sm:mt-8 text-[clamp(1.9rem,5vw,5.5rem)] font-medium leading-[1.04] tracking-[-0.04em] px-2 sm:px-0"
          >
            Let&apos;s build your <span className="font-serif italic text-[var(--muted-foreground)]">next version.</span>
          </h2>

          <div className="mt-8 sm:mt-14 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-sm sm:max-w-none mx-auto" data-reveal>
            <Magnetic>
              <Link
                href="/sora"
                className="btn-sweep w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent-orange)] px-6 sm:px-8 py-3.5 sm:py-4 text-sm font-medium text-white shadow-[0_4px_24px_rgba(255,90,31,0.28)] transition-all hover:bg-[#e04f1a] hover:shadow-[0_6px_32px_rgba(255,90,31,0.4)]"
              >
                <Terminal className="h-4 w-4" />
                Talk to Sora
              </Link>
            </Magnetic>
            <Magnetic>
              <a
                href="https://calendar.app.google/am18JEY6EjxrDyZd6"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border-hover)] bg-[var(--background)] px-6 sm:px-8 py-3.5 sm:py-4 text-sm font-medium transition-colors duration-300 hover:border-[var(--accent-orange)] hover:text-[var(--accent-orange)] hover:bg-[var(--accent)]"
              >
                <CalendarDays className="h-4 w-4" />
                Book a call
                <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="mailto:ani@sorateq.com"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border-hover)] bg-[var(--background)] px-6 sm:px-8 py-3.5 sm:py-4 text-sm font-medium transition-colors duration-300 hover:border-[var(--accent-orange)] hover:text-[var(--accent-orange)] hover:bg-[var(--accent)]"
              >
                <Mail className="h-4 w-4" />
                Email us
                <ArrowRight className="h-3.5 w-3.5 opacity-60" />
              </a>
            </Magnetic>
          </div>
        </div>
      </section>

      <HomeFooter />
    </div>
  );
}
