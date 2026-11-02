import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/store";
import {
  ArrowLeft,
  ArrowUpRight,
} from "lucide-react";
import { MarkdownContent } from "@/components/MarkdownContent";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = db.getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found | Sorateq" };

  return {
    title: `${project.name} — Sorateq`,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = db.getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans antialiased selection:bg-[var(--foreground)] selection:text-[var(--background)]">
      <main className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-12 py-10 sm:py-16 md:py-24 flex flex-col gap-16 sm:gap-24 md:gap-32">
        
        {/* Navigation */}
        <nav className="border-b border-[var(--border)] pb-6 sm:pb-8">
          <Link
            href="/projects"
            className="inline-flex items-center text-sm font-medium hover:opacity-60 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Index
          </Link>
        </nav>

        {/* Hero Section */}
        <section className="flex flex-col md:flex-row gap-10 md:gap-24 items-start">
          <div className="flex-1 space-y-4 sm:space-y-6">
            <h1 className="text-[clamp(2.5rem,7vw,6.25rem)] font-serif leading-[0.9] tracking-tighter">
              {project.name}
            </h1>
            <p className="text-xl sm:text-3xl md:text-4xl font-light text-[var(--muted-foreground)] tracking-tight max-w-2xl leading-snug">
              {project.tagline}
            </p>
          </div>
          
          <div className="w-full md:w-[400px] shrink-0 flex flex-col gap-6 sm:gap-8">
            {project.publicUrl && (
              <a
                href={project.publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between border border-[var(--border)] p-5 sm:p-6 rounded-sm hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors"
              >
                <span className="text-xs sm:text-sm font-medium uppercase tracking-widest">View Live Site</span>
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            )}
            
            <div className="grid grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-6 sm:gap-y-12">
              <div>
                <span className="block text-[10px] font-mono uppercase tracking-widest text-[var(--muted-foreground)] mb-1 sm:mb-2">Industry</span>
                <span className="text-xs sm:text-sm font-medium">{project.industry}</span>
              </div>
              <div>
                <span className="block text-[10px] font-mono uppercase tracking-widest text-[var(--muted-foreground)] mb-1 sm:mb-2">Stage</span>
                <span className="text-xs sm:text-sm font-medium">{project.stage}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Overview Image / Video Placeholder */}
        <section className="w-full aspect-[16/10] sm:aspect-[21/9] bg-[var(--muted)] border border-[var(--border)] rounded-sm flex items-center justify-center relative overflow-hidden">
          {project.heroImage ? (
            <img
              src={encodeURI(project.heroImage)}
              alt={`${project.name} Overview`}
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <span className="font-mono text-xs sm:text-sm tracking-widest text-[var(--muted-foreground)] uppercase text-center p-4">Hero Media / Video Walkthrough</span>
          )}
        </section>

        {/* Curated Executive Summary & Metrics */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          <div className="lg:col-span-8 flex flex-col gap-16">
            
            {/* What the product is */}
            <div>
              <h2 className="text-sm font-mono uppercase tracking-widest text-[var(--muted-foreground)] mb-8 border-b border-[var(--border)] pb-4">Executive Summary</h2>
              <MarkdownContent content={project.fullDescription} />
            </div>

            {/* The Problem */}
            <div>
              <h3 className="text-sm font-mono uppercase tracking-widest text-[var(--muted-foreground)] mb-8 border-b border-[var(--border)] pb-4">The Problem It Solves</h3>
              <MarkdownContent content={project.problem} />
            </div>

            {/* Features List */}
            <div>
              <h3 className="text-sm font-mono uppercase tracking-widest text-[var(--muted-foreground)] mb-8 border-b border-[var(--border)] pb-4">Core Features & Capabilities</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {project.features.map((feat, idx) => (
                  <li key={idx} className="text-base font-light flex flex-col gap-1 border-t border-[var(--border)] pt-4">
                    <span className="text-[10px] text-[var(--muted-foreground)] font-mono uppercase">Capability 0{idx + 1}</span>
                    <span className="text-[var(--foreground)]">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
          
          {/* Metrics Column */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="lg:col-span-4 flex flex-col gap-10">
              <h2 className="text-sm font-mono uppercase tracking-widest text-[var(--muted-foreground)] mb-8 border-b border-[var(--border)] pb-4">Impact Metrics</h2>
              {project.metrics.map((m, idx) => (
                <div key={idx} className="border-t border-[var(--border)] pt-6">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted-foreground)] mb-2">{m.label}</div>
                  <div className="text-4xl sm:text-5xl font-serif tracking-tight">{m.value}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* System Architecture */}
        <section className="border-y border-[var(--border)] py-12 sm:py-20 md:py-24 flex flex-col gap-12 sm:gap-16 md:gap-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-24">
            <div className="md:col-span-4">
              <h3 className="text-2xl sm:text-3xl font-serif tracking-tight">System Architecture<br className="hidden md:inline" />& Solution</h3>
            </div>
            <div className="md:col-span-8">
              <MarkdownContent content={project.solution} />
            </div>
          </div>
        </section>

        {/* Multi-Image Gallery Layout */}
        {((project.galleryImages && project.galleryImages.length > 0) || (project.images && project.images.length > 0)) ? (
          <section className="space-y-8">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
              <span className="text-sm font-mono uppercase tracking-widest text-[var(--muted-foreground)]">
                Interface & Artifacts ({((project.galleryImages || project.images)?.length || 0)} views)
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(project.galleryImages || project.images)!.slice(0, 2).map((img, idx) => (
                <div key={idx} className="group relative aspect-[16/10] bg-[var(--card)] border border-[var(--border)] rounded-sm overflow-hidden flex flex-col">
                  <img
                    src={encodeURI(img)}
                    alt={`${project.name} preview ${idx + 1}`}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-mono text-white/90">Fig {idx + 1}. Interface View</span>
                  </div>
                </div>
              ))}
            </div>
            {((project.galleryImages || project.images)!.length > 2) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {(project.galleryImages || project.images)!.slice(2, 8).map((img, idx) => (
                  <div key={idx} className="group relative aspect-[4/3] bg-[var(--card)] border border-[var(--border)] rounded-sm overflow-hidden flex flex-col">
                    <img
                      src={encodeURI(img)}
                      alt={`${project.name} detail ${idx + 3}`}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs font-mono text-white/90">Fig {idx + 3}. Detail View</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : (
          <section className="space-y-6">
            <div className="text-sm font-mono uppercase tracking-widest text-[var(--muted-foreground)] mb-8">Interface & Artifacts</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="aspect-[4/3] bg-[var(--card)] border border-[var(--border)] rounded-sm flex items-center justify-center">
                <span className="text-xs font-mono text-[var(--muted-foreground)]">Fig 1. Dashboard UI</span>
              </div>
              <div className="aspect-[4/3] bg-[var(--card)] border border-[var(--border)] rounded-sm flex items-center justify-center">
                <span className="text-xs font-mono text-[var(--muted-foreground)]">Fig 2. Component Details</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="aspect-square bg-[var(--card)] border border-[var(--border)] rounded-sm flex items-center justify-center">
                <span className="text-xs font-mono text-[var(--muted-foreground)]">Fig 3. Mobile View</span>
              </div>
              <div className="aspect-square bg-[var(--card)] border border-[var(--border)] rounded-sm flex items-center justify-center">
                <span className="text-xs font-mono text-[var(--muted-foreground)]">Fig 4. Data Viz</span>
              </div>
              <div className="aspect-square bg-[var(--card)] border border-[var(--border)] rounded-sm flex items-center justify-center">
                <span className="text-xs font-mono text-[var(--muted-foreground)]">Fig 5. Settings</span>
              </div>
            </div>
          </section>
        )}

        {/* Technical Details & Scope */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 pt-16">
          <div>
            <h3 className="text-sm font-mono uppercase tracking-widest text-[var(--muted-foreground)] mb-8 border-b border-[var(--border)] pb-4">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span key={tech} className="px-3 py-1 text-sm font-mono border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] rounded-sm">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div>
            {project.services && project.services.length > 0 && (
              <div>
                <h3 className="text-sm font-mono uppercase tracking-widest text-[var(--muted-foreground)] mb-8 border-b border-[var(--border)] pb-4">Services Engaged</h3>
                <ul className="space-y-4">
                  {project.services.map((service, idx) => (
                    <li key={idx} className="text-base font-light border-b border-[var(--border)] pb-4">{service}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Final Outcome */}
        {project.projectOutcome && (
          <section className="bg-[var(--foreground)] text-[var(--background)] p-12 md:p-24 rounded-sm flex flex-col gap-8 items-center text-center">
            <span className="text-xs font-mono uppercase tracking-widest opacity-60">Business Impact</span>
            <p className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-tight leading-tight max-w-4xl">
              "{project.projectOutcome}"
            </p>
          </section>
        )}

      </main>
    </div>
  );
}
