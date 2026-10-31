"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "sorateq-theme";
const listeners = new Set<() => void>();

function readDark(): boolean {
  return document.documentElement.classList.contains("dark");
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function emit() {
  listeners.forEach((l) => l());
}

export function setTheme(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
  try {
    localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light");
  } catch {
    // Storage unavailable (private mode); the class still applies for this session.
  }
  emit();
}

export function useTheme() {
  const isDark = useSyncExternalStore(subscribe, readDark, () => false);
  const toggle = useCallback(() => setTheme(!readDark()), []);
  return { isDark, toggle };
}

// Runs before first paint so the page never flashes the wrong theme.
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;
