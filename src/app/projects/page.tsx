"use client";

import React, { useState, useEffect } from "react";
import { ProjectRecord } from "@/lib/types";
import { ProjectCard } from "@/components/ProjectCard";
import { Search } from "lucide-react";

const CATEGORIES = [
  "All",
  "AI & Generative Media",
  "EdTech",
  "FinTech & Web3",
  "ConTech",
  "Logistics",
  "Cybersecurity",
  "Developer Tools"
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.projects) {
        setProjects(data.projects);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    if (selectedCategory !== "All") {
      const catLower = selectedCategory.toLowerCase();
      const match =
        p.industry.toLowerCase().includes(catLower) ||
        p.projectType.toLowerCase().includes(catLower) ||
        p.tags.some((t) => t.toLowerCase().includes(catLower)) ||
        p.technologies.some((t) => t.toLowerCase().includes(catLower));
      if (!match) return false;
    }
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    const haystack = [p.name, p.tagline, p.summary, p.industry, ...p.technologies, ...p.tags].join(" ").toLowerCase();
    return haystack.includes(q);
  });

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans antialiased selection:bg-[var(--foreground)] selection:text-[var(--background)]">
      <main className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-12 py-12 sm:py-20 md:py-28 flex flex-col gap-12 sm:gap-16 md:gap-24">
        
        {/* Header */}
        <section className="space-y-4 sm:space-y-6 max-w-4xl">
          <h1 className="text-[clamp(2.75rem,7vw,6.25rem)] font-serif tracking-tighter leading-[0.9]">
            Index of Work
          </h1>
          <p className="text-lg sm:text-xl md:text-3xl font-light text-[var(--muted-foreground)] leading-snug">
            A curated selection of software architecture, engineering platforms, and robust SaaS solutions.
          </p>
        </section>

        {/* Filters & Search */}
        <section className="flex flex-col xl:flex-row gap-6 sm:gap-8 xl:items-end justify-between border-b border-[var(--border)] pb-6 sm:pb-8">
          <div className="flex flex-wrap gap-x-6 gap-y-4 max-w-3xl">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[11px] font-mono uppercase tracking-widest transition-opacity ${
                  selectedCategory === cat
                    ? "text-[var(--foreground)] border-b border-[var(--foreground)]"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full xl:w-96">
            <Search className="w-4 h-4 absolute left-0 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter keywords, tech..."
              className="w-full bg-transparent border-b border-[var(--border)] pl-8 pr-4 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--foreground)] transition-colors rounded-none"
            />
          </div>
        </section>

        {/* Projects Stack (One Card Per Row) */}
        <section className="flex flex-col gap-12">
          {loading ? (
            <div className="py-24 text-center">
              <div className="text-xs font-mono tracking-widest uppercase text-[var(--muted-foreground)]">Loading Index...</div>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="py-24 text-center border-t border-[var(--border)]">
              <p className="text-lg font-light text-[var(--muted-foreground)] mb-4">No results found.</p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="text-xs font-mono uppercase tracking-widest hover:opacity-60 transition-opacity underline underline-offset-4"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="flex flex-col">
              {filteredProjects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
