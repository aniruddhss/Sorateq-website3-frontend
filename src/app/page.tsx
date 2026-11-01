"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, CalendarDays, Mail, Sparkles } from "lucide-react";
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
            el.textContent = `${prefix}${Math.round(obj.v)}${suffix}`;
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
      <section className="hero-section relative flex min-h-screen items-center justify-center overflow-hidden px-6 pb-40 pt-16 md:px-16">
        <div className="grid-bg pointer-events-none absolute inset-0" />
        <HeroScene />

        <div className="hero-inner relative z-10 mx-auto max-w-6xl text-center">
          <p className={`hero-meta mb-10 ${eyebrow}`}>
            <span className="pulse-dot mr-3 inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent-orange)] align-middle" />
            AI product studio
          </p>

          <h1
            ref={heroTitle}
            className="text-[clamp(2.75rem,8vw,7.5rem)] font-medium leading-[0.95] tracking-[-0.06em]"
          >
            We help turn messy
            <br />
            <span className="font-serif italic text-[var(--muted-foreground)]">AI codebases</span> into
            <br />
            production code.
          </h1>

          <p className="hero-meta mx-auto mt-10 max-w-xl text-base leading-7 text-[var(--muted-foreground)] md:text-lg">
            We fix what AI cannot.
          </p>
        </div>

        <div className="hero-meta absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-[var(--muted-foreground)]">
          <span className="text-[10px] uppercase tracking-[0.35em]">Scroll</span>
          <div className="relative h-12 w-px overflow-hidden bg-[var(--border-hover)]">
            <div className="scroll-line absolute inset-0 bg-[var(--foreground)]" />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="flex min-h-screen items-center px-6 py-32 md:px-16">
        <div className="mx-auto w-full max-w-6xl">
          <p className={eyebrow} data-reveal>By the numbers</p>
          <div className="mt-16 grid grid-cols-1 gap-x-12 gap-y-20 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} data-reveal className="border-t border-[var(--border-hover)] pt-8">
                <div className="text-[clamp(3rem,6vw,5.5rem)] font-medium leading-none tracking-[-0.06em]">
                  <span data-count={stat.to} data-prefix={stat.prefix} data-suffix={stat.suffix}>
                    {stat.prefix}0{stat.suffix}
                  </span>
                </div>
                <div className="mt-6 text-[11px] uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="flex min-h-screen items-center px-6 py-24 md:px-16">
        <div data-reveal className="w-full">
          <ServiceIndex />
        </div>
      </section>

      {/* CASE STUDIES */}
      <section className="px-6 py-32 md:px-16">
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end" data-reveal>
            <div>
              <p className={eyebrow}>Case studies</p>
              <h2 className="mt-6 text-5xl font-medium tracking-[-0.05em] md:text-7xl">Selected work.</h2>
            </div>
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 border-b border-[var(--foreground)] pb-1 text-sm font-medium"
            >
              See all case studies
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent-orange)]" />
            </Link>
          </div>

          <div className="mt-20 flex flex-col gap-10">
            {featured.map((project, i) => (
              <article
                key={project.id}
                data-card
                className="sticky top-32 flex min-h-[70vh] flex-col justify-between rounded-[32px] border border-[var(--border)] bg-[var(--card)] p-8 md:p-14"
              >
                <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
                  <span>
                    Case {String(i + 1).padStart(2, "0")} · {project.industry}
                  </span>
                  {project.metrics?.[0] && (
                    <span className="rounded-full border border-[var(--accent-orange)]/40 px-3 py-1 text-[var(--accent-orange)]">
                      {project.metrics[0].value} {project.metrics[0].label}
                    </span>
                  )}
                </div>


                <div>
                  <h3 className="max-w-2xl text-4xl font-medium tracking-[-0.05em] md:text-6xl">{project.name}</h3>
                  <p className="mt-4 max-w-2xl text-xl font-serif italic text-[var(--muted-foreground)]">
                    {project.tagline}
                  </p>
                  <p className="mt-6 max-w-md text-base leading-7 text-[var(--muted-foreground)]">{project.summary}</p>
                </div>

                {project.heroImage && (
                  <div className="relative my-6 w-full aspect-[21/9] sm:aspect-[21/8] max-h-[300px] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)]">
                    <img
                      src={encodeURI(project.heroImage)}
                      alt={project.name}
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                    />
                  </div>
                )}


                <div className="flex flex-wrap items-end justify-between gap-6">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 5).map((tech) => (
                      <span key={tech} className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted-foreground)]">
                        {tech}
                      </span>
                    ))}
                  </div>
                  {project.publicUrl && (
                    <a
                      href={project.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 border-b border-[var(--foreground)] pb-1 text-sm font-medium"
                    >
                      {projectLinkLabel(project.publicUrl)}
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent-orange)]" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-32 md:px-16">
        <div className="grid-bg pointer-events-none absolute inset-0" />
        <div className="cta-rings pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="ring-a absolute left-1/2 top-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[var(--border-hover)]" />
          <div className="ring-b absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--border)]" />
          <div className="absolute left-1/2 top-[calc(50%-360px)] h-2 w-2 -translate-x-1/2 rounded-full bg-[var(--accent-orange)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--border-hover)] bg-[var(--card)] p-2 shadow-sm transition-transform duration-300 hover:scale-105" data-reveal>
            <Image
              src="/sorateq-logo-medium.png"
              alt="Sorateq"
              width={56}
              height={56}
              className="h-full w-full object-contain"
            />
          </div>
          <p className={eyebrow} data-reveal>Start with clarity</p>
          <h2
            ref={ctaTitle}
            className="mt-8 text-[clamp(2.75rem,7vw,6rem)] font-medium leading-[0.98] tracking-[-0.06em]"
          >
            Let&apos;s build your <span className="font-serif italic text-[var(--muted-foreground)]">next version.</span>
          </h2>

          <div className="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row" data-reveal>
            <Magnetic>
              <Link
                href="/contact"
                className="btn-sweep inline-flex items-center gap-2 rounded-full bg-[var(--foreground)] px-8 py-4 text-sm font-medium text-[var(--background)]"
              >
                <Sparkles className="h-4 w-4" />
                Talk to Sora
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                href="/meeting"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border-hover)] bg-[var(--background)] px-8 py-4 text-sm font-medium transition-colors duration-300 hover:bg-[var(--accent)]"
              >
                <CalendarDays className="h-4 w-4" />
                Meet us
              </Link>
            </Magnetic>
            <Magnetic>
              <a
                href="mailto:hello@sorateq.com"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border-hover)] bg-[var(--background)] px-8 py-4 text-sm font-medium transition-colors duration-300 hover:bg-[var(--accent)]"
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
