"use client";

import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";

const services = [
  { name: "AI SaaS platforms", note: "Multi-tenant products with billing, auth, and AI at the core." },
  { name: "Internal AI tools", note: "Copilots and dashboards that make your team faster." },
  { name: "Workflow automations", note: "Repetitive operations, handled end to end." },
  { name: "Beautiful websites", note: "Fast, editorial sites that convert visitors into clients." },
  { name: "Mobile applications", note: "Native-quality apps shipped for iOS and Android." },
  { name: "Telegram AI bots", note: "Assistants that live where your users already are." },
  { name: "Knowledge bases & RAG", note: "Your documents, searchable and answered with sources." },
  { name: "D2C AI sales bots", note: "Sales conversations that qualify and close around the clock." },
  { name: "Pitch decks & presentations", note: "Stories and visuals that help you raise and close." },
];

export function ServiceIndex() {
  const [active, setActive] = useState(0);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[var(--muted-foreground)]">
            What we build
          </p>
          <h2 className="mt-5 text-4xl font-medium leading-[1.02] tracking-[-0.05em] md:text-6xl">
            AI products that actually ship.
          </h2>
        </div>
        <p className="max-w-xs text-sm leading-6 text-[var(--muted-foreground)]">
          Hover a service to see how we approach it.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, i) => {
          const isActive = i === active;
          return (
            <button
              key={service.name}
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              className="group relative flex min-h-[150px] flex-col justify-between overflow-hidden bg-[var(--background)] p-6 text-left transition-colors duration-500 md:min-h-[20vh] md:p-8"
            >
              <div
                className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
                style={{ background: "radial-gradient(circle at 30% 0%, rgba(255, 90, 31, 0.12), transparent 75%)" }}
              />

              <div
                className={`absolute top-0 left-0 right-0 h-[2px] bg-[var(--accent-orange)] transition-all duration-300 origin-left ${
                  isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-50 group-hover:opacity-40"
                }`}
              />

              <div className="relative flex items-center justify-between">
                <span
                  className={`font-mono text-xs tracking-[0.3em] transition-colors duration-300 ${
                    isActive ? "text-[var(--accent-orange)] font-semibold" : "text-[var(--muted-foreground)]"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <ArrowUpRight
                  className={`h-4 w-4 transition-all duration-500 ${
                    isActive
                      ? "translate-x-0 translate-y-0 text-[var(--accent-orange)] opacity-100"
                      : "-translate-x-1 translate-y-1 opacity-0"
                  }`}
                />
              </div>

              <div className="relative">
                <h3 className="text-xl font-medium leading-tight tracking-[-0.03em] md:text-2xl">{service.name}</h3>
                <p
                  className={`overflow-hidden text-sm leading-6 text-[var(--muted-foreground)] transition-all duration-500 ${
                    isActive ? "mt-3 max-h-24 opacity-100" : "mt-0 max-h-0 opacity-0"
                  }`}
                >
                  {service.note}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
