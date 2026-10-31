"use client";

import React, { useState } from "react";
import Link from "next/link";
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

const CONNECT_ITEMS: NavItem[] = [
  { name: "Email", href: "/contact", icon: Mail },
  { name: "Book a meeting", href: "/contact", icon: CalendarDays },
  { name: "Reddit", href: "https://reddit.com", icon: MessageCircle },
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
      <div className="flex h-20 shrink-0 items-center overflow-hidden pl-[18px] pr-5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--border-hover)] font-serif text-sm italic">
          S
        </span>
        <span
          className={`ml-4 whitespace-nowrap font-serif text-lg italic tracking-tight transition-all duration-500 ${
            isOpen ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
          }`}
        >
          Sorateq
        </span>
      </div>

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
                <span className="absolute left-0 top-1/2 h-6 w-[2px] -translate-y-1/2 rounded-full bg-[var(--accent-orange)]" />
              )}
              <Icon
                className={`h-[18px] w-[18px] shrink-0 transition-colors duration-300 ${
                  isActive ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]"
                }`}
                strokeWidth={1.5}
              />
              <span className="ml-4 flex flex-1 items-center justify-between overflow-hidden">
                <span
                  className={`whitespace-nowrap text-[14px] transition-all duration-500 ${
                    isActive ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]"
                  } ${isOpen ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"}`}
                >
                  {item.name}
                </span>
                <span
                  className={`font-mono text-[10px] tracking-widest text-[var(--muted-foreground)]/60 transition-opacity duration-500 ${
                    isOpen ? "opacity-100" : "opacity-0"
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
