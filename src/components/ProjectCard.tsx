import React from "react";
import Link from "next/link";
import { ProjectRecord } from "@/lib/types";
import { ArrowUpRight, ArrowRight } from "lucide-react";

interface ProjectCardProps {
  project: ProjectRecord;
  compact?: boolean;
}

export function ProjectCard({ project, compact = false }: ProjectCardProps) {
  if (compact) {
    return (
      <Link
        href={`/projects/${project.slug}`}
        className="group flex flex-col justify-between gap-4 border-b border-[var(--border)] py-6 transition-colors hover:bg-[var(--accent)] cursor-pointer"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            {project.heroImage && (
              <img
                src={encodeURI(project.heroImage)}
                alt={project.name}
                className="w-12 h-12 rounded object-cover border border-[var(--border)] shrink-0"
              />
            )}
            <div className="space-y-1 min-w-0">
              <h4 className="text-xl font-serif tracking-tight text-[var(--foreground)] transition-colors truncate">
                {project.name}
              </h4>
              <div className="text-xs font-mono uppercase tracking-widest text-[var(--muted-foreground)]">
                {project.industry}
              </div>
            </div>
          </div>
          <ArrowUpRight className="w-5 h-5 text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform shrink-0" />
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block border-t border-[var(--border)] pt-12 pb-16 transition-colors hover:bg-[var(--accent)]/30 cursor-pointer"
    >
      <div className="flex flex-col md:flex-row gap-8 md:gap-16 lg:gap-24 px-4 sm:px-0">
        
        {/* Left Column: Meta & Tech */}
        <div className="md:w-1/4 shrink-0 flex flex-col gap-8">
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-widest text-[var(--muted-foreground)] mb-2 group-hover:text-[var(--foreground)] transition-colors">Industry</span>
            <span className="text-sm font-medium">{project.industry}</span>
          </div>
          
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-widest text-[var(--muted-foreground)] mb-3 group-hover:text-[var(--foreground)] transition-colors">Tech Stack</span>
            <div className="flex flex-wrap gap-2">
              {project.technologies.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="text-[10px] font-mono px-2 py-1 border border-[var(--border)] text-[var(--foreground)] bg-[var(--background)] group-hover:border-[var(--foreground)] transition-colors"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 4 && (
                <span className="text-[10px] font-mono px-2 py-1 text-[var(--muted-foreground)]">
                  +{project.technologies.length - 4}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Content */}
        <div className="md:w-3/4 flex flex-col justify-between gap-8">
          <div>
            <h3 className="text-4xl md:text-5xl lg:text-7xl font-serif tracking-tight leading-[0.9] text-[var(--foreground)] transition-transform duration-300 group-hover:translate-x-2 mb-6">
              {project.name}
            </h3>
            
            <p className="text-2xl md:text-3xl font-light text-[var(--muted-foreground)] max-w-3xl leading-snug group-hover:text-[var(--foreground)] transition-colors">
              {project.tagline}
            </p>
          </div>

          <p className="text-lg font-light max-w-3xl leading-relaxed mt-2">
            {project.summary}
          </p>

          {project.heroImage && (
            <div className="relative w-full aspect-[21/9] sm:aspect-[21/8] overflow-hidden rounded-sm border border-[var(--border)] bg-[var(--card)] my-2">
              <img
                src={encodeURI(project.heroImage)}
                alt={project.name}
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                loading="lazy"
              />
            </div>
          )}

          {project.metrics && project.metrics.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-8 border-t border-[var(--border)] mt-4">
              {project.metrics.map((m, idx) => (
                <div key={idx}>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted-foreground)] mb-2 group-hover:text-[var(--foreground)] transition-colors">
                    {m.label}
                  </div>
                  <div className="text-3xl md:text-4xl font-serif tracking-tight">
                    {m.value}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Loud & Clear CTA */}
          <div className="mt-8 pt-12 border-t border-[var(--border)] flex items-center justify-start">
            <div className="flex items-center gap-6 text-3xl sm:text-4xl md:text-5xl font-serif tracking-tight text-[var(--foreground)]/60 group-hover:text-[var(--foreground)] transition-colors">
              <span>Click to view case study</span>
              <div className="w-14 h-14 rounded-full border-2 border-[var(--border)] group-hover:border-[var(--foreground)] group-hover:bg-[var(--foreground)] group-hover:text-[var(--background)] flex items-center justify-center transition-all duration-300 group-hover:translate-x-4">
                <ArrowRight className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
