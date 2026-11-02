"use client";

import React, { useState, useEffect } from "react";
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
  MoonStar,
  ShoppingBag,
  SunMedium,
  Terminal,
} from "lucide-react";
import { useTheme } from "@/lib/theme";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const PRIMARY_ITEMS: NavItem[] = [
  { name: "Home", href: "/", icon: Home },
  { name: "Talk to Sora", href: "/sora", icon: Terminal },
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
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { isDark, toggle } = useTheme();

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Lock scroll when mobile menu is active
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  return (
    <>
      {/* MOBILE TOP BAR (screens < 768px) */}
      <header className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--background)]/85 px-4 sm:px-6 backdrop-blur-xl md:hidden">
        <Link
          href="/"
          className="group flex items-center gap-3 focus:outline-none"
          onClick={() => setIsMobileOpen(false)}
        >
          <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl overflow-hidden border border-[var(--border-hover)] bg-[var(--card)] p-1 shadow-sm transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/sorateq-logo-medium.png"
              alt="Sorateq"
              width={32}
              height={32}
              className="h-full w-full object-contain"
              priority
            />
          </span>
          <span className="font-serif text-lg italic tracking-tight text-[var(--foreground)]">
            Sorateq
          </span>
        </Link>

        {/* Header Controls: ONLY the original theme toggle and menu toggle */}
        <div className="flex items-center gap-2">
          {/* Theme Switcher */}
          <button
            type="button"
            onClick={toggle}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
          >
            {isDark ? <SunMedium className="h-4 w-4" strokeWidth={1.5} /> : <MoonStar className="h-4 w-4" strokeWidth={1.5} />}
          </button>

          {/* Bespoke Kinetic Architectural Hamburger Trigger */}
          <button
            type="button"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label={isMobileOpen ? "Close navigation" : "Open navigation"}
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-hover)] bg-[var(--card)] text-[var(--foreground)] transition-all duration-300 focus:outline-none hover:border-[var(--accent-orange)]"
          >
            <div className="relative flex h-3.5 w-4 flex-col justify-between">
              <span
                className={`h-[1.5px] w-full rounded-full bg-current transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isMobileOpen ? "translate-y-[6px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-[1.5px] w-full rounded-full bg-current transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isMobileOpen ? "-translate-y-[6px] -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </header>

      {/* MOBILE FULLSCREEN MENU DRAWER */}
      {isMobileOpen && (
        <div className="fixed inset-0 top-16 z-40 flex flex-col justify-between overflow-y-auto bg-[var(--background)]/98 px-6 py-8 backdrop-blur-2xl md:hidden animate-fade-in">
          {/* Exact Primary Items with High Agency Typography */}
          <nav className="flex flex-col gap-2 pt-2">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 mb-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--muted-foreground)]">
                Navigation
              </span>
              <span className="font-mono text-[10px] text-[var(--accent-orange)]">
                EST. 2026
              </span>
            </div>

            <div className="flex flex-col">
              {PRIMARY_ITEMS.map((item, i) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="group flex items-center justify-between border-b border-[var(--border)]/60 py-4 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="font-mono text-xs text-[var(--muted-foreground)] transition-colors group-hover:text-[var(--accent-orange)]">
                        0{i + 1}
                      </span>
                      <Icon
                        className={`h-4 w-4 transition-colors ${
                          isActive ? "text-[var(--accent-orange)]" : "text-[var(--muted-foreground)] group-hover:text-[var(--accent-orange)]"
                        }`}
                        strokeWidth={1.5}
                      />
                      <span
                        className={`font-serif text-2xl italic tracking-tight transition-colors ${
                          isActive
                            ? "text-[var(--accent-orange)] font-medium"
                            : "text-[var(--foreground)] group-hover:text-[var(--accent-orange)]"
                        }`}
                      >
                        {item.name}
                      </span>
                    </div>

                    <ArrowUpRight className="h-4 w-4 text-[var(--muted-foreground)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent-orange)]" />
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Exact Connect Items */}
          <div className="mt-8 border-t border-[var(--border)] pt-6 space-y-4">
            <div>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
                Connect
              </p>
              <div className="flex flex-col gap-2">
                {CONNECT_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const external = item.href.startsWith("http");
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      onClick={() => setIsMobileOpen(false)}
                      className="flex items-center justify-between py-1 text-sm text-[var(--foreground)] transition-colors hover:text-[var(--accent-orange)]"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4 text-[var(--muted-foreground)]" strokeWidth={1.5} />
                        <span>{item.name}</span>
                      </div>
                      {external && <ArrowUpRight className="h-3.5 w-3.5 text-[var(--muted-foreground)] opacity-60" />}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Studio Operating Status */}
            <div className="flex items-center justify-between border-t border-[var(--border)] pt-4 text-[10px] font-mono uppercase tracking-widest text-[var(--muted-foreground)]">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent-orange)] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent-orange)]" />
                </span>
                <span>Accepting Projects</span>
              </div>
              <span>Global Async</span>
            </div>
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR (screens >= 768px) */}
      <aside
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className={`fixed left-0 top-0 z-40 hidden md:flex h-screen flex-col border-r border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-xl transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
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
                    0{i + 1}
                  </span>
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-1 px-3 pb-8">
          <p
            className={`mb-2 px-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--muted-foreground)]/70 transition-opacity duration-500 ${
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
            className="group mb-1.5 flex h-9 items-center overflow-hidden rounded-lg pl-3 pr-3 text-[var(--muted-foreground)] transition-colors duration-300 hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
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
                  {external && <ArrowUpRight className="h-3.5 w-3.5 opacity-50" />}
                </span>
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
}
