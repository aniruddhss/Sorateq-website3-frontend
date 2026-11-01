"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  CalendarDays,
  FlaskConical,
  Home,
  Layers,
  Mail,
  MessageCircle,
  MoonStar,
  ShoppingBag,
  Sparkles,
  SunMedium,
} from "lucide-react";
import { useTheme } from "@/lib/theme";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const PRIMARY_ITEMS: NavItem[] = [
  { name: "Home", href: "/", icon: Home },
  { name: "Talk to Sora", href: "/sora", icon: Sparkles },
  { name: "Projects", href: "/projects", icon: Layers },
  { name: "Sorateq Labs", href: "/labs", icon: FlaskConical },
  { name: "Sora Store", href: "/store", icon: ShoppingBag },
];

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const CONNECT_ITEMS: NavItem[] = [
  { name: "Email", href: "mailto:ani@sorateq.com", icon: Mail },
  { name: "Book a meeting", href: "https://calendar.app.google/am18JEY6EjxrDyZd6", icon: CalendarDays },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/sorateqstudio", icon: LinkedinIcon },
];

export function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, toggle } = useTheme();

  return (
    <aside
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-xl transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isOpen ? "w-72" : "w-16"
      }`}
    >
      <Link
        href="/"
        className="group flex h-20 shrink-0 items-center overflow-hidden pl-[15px] pr-5 focus:outline-none"
        title="Sorateq Home"
      >
        <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl overflow-hidden border border-[var(--border-hover)] bg-[var(--card)] p-1 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:border-[var(--accent-orange)]/60 group-hover:shadow-[0_0_14px_rgba(255,90,31,0.25)]">
          <Image
            src="/sorateq-logo-medium.png"
            alt="Sorateq"
            width={32}
            height={32}
            className="h-full w-full object-contain"
            priority
          />
        </span>
        <span
          className={`ml-3.5 whitespace-nowrap font-serif text-lg italic tracking-tight text-[var(--foreground)] transition-all duration-500 ${
            isOpen ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
          }`}
        >
          Sorateq
        </span>
      </Link>

      <nav className="flex flex-col gap-1 px-3 pt-6">
        {PRIMARY_ITEMS.map((item, i) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.name}
              className="group relative flex h-12 items-center overflow-hidden rounded-xl pl-3 pr-3 transition-colors duration-300 hover:bg-[var(--accent)]"
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-6 w-[2.5px] -translate-y-1/2 rounded-full bg-[var(--accent-orange)] shadow-[0_0_8px_rgba(255,90,31,0.6)]" />
              )}
              <Icon
                className={`h-[18px] w-[18px] shrink-0 transition-colors duration-300 ${
                  isActive ? "text-[var(--accent-orange)]" : "text-[var(--muted-foreground)] group-hover:text-[var(--accent-orange)]"
                }`}
                strokeWidth={1.5}
              />
              <span className="ml-4 flex flex-1 items-center justify-between overflow-hidden">
                <span
                  className={`whitespace-nowrap text-[14px] transition-all duration-500 ${
                    isActive ? "text-[var(--foreground)] font-medium" : "text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]"
                  } ${isOpen ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"}`}
                >
                  {item.name}
                </span>
                <span
                  className={`font-mono text-[10px] tracking-widest transition-opacity duration-500 ${
                    isActive ? "text-[var(--accent-orange)] opacity-100" : "text-[var(--muted-foreground)]/60 opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-1 px-3 pb-20">
        <p
          className={`mb-3 px-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--muted-foreground)]/70 transition-opacity duration-500 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          Connect
        </p>
        <button
          type="button"
          onClick={toggle}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          title={isDark ? "Light mode" : "Dark mode"}
          className="group mb-2 flex h-9 items-center overflow-hidden rounded-lg pl-3 pr-3 text-[var(--muted-foreground)] transition-colors duration-300 hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
        >
          {isDark ? (
            <SunMedium className="h-4 w-4 shrink-0 opacity-70 transition-opacity group-hover:opacity-100" strokeWidth={1.5} />
          ) : (
            <MoonStar className="h-4 w-4 shrink-0 opacity-70 transition-opacity group-hover:opacity-100" strokeWidth={1.5} />
          )}
          <span
            className={`ml-4 whitespace-nowrap text-[13px] transition-all duration-500 ${
              isOpen ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"
            }`}
          >
            {isDark ? "Light mode" : "Dark mode"}
          </span>
        </button>

        {CONNECT_ITEMS.map((item) => {
          const Icon = item.icon;
          const external = item.href.startsWith("http");
          return (
            <Link
              key={item.name}
              href={item.href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              title={item.name}
              className="group flex h-9 items-center overflow-hidden rounded-lg pl-3 pr-3 text-[var(--muted-foreground)] transition-colors duration-300 hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
            >
              <Icon className="h-4 w-4 shrink-0 opacity-70 transition-opacity group-hover:opacity-100" strokeWidth={1.5} />
              <span
                className={`ml-4 flex items-center gap-1 whitespace-nowrap text-[13px] transition-all duration-500 ${
                  isOpen ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"
                }`}
              >
                {item.name}
                {external && <ArrowUpRight className="h-3 w-3 opacity-50" />}
              </span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
