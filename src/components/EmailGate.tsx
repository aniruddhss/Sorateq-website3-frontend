"use client";

import React, { useState } from "react";
import { validateEmail } from "@/lib/email-validator";
import { ArrowRight, Loader2, Sparkles, CheckCircle2 } from "lucide-react";

interface EmailGateProps {
  onSuccess: (visitor: { id: string; email: string }, conversationId: string) => void;
  initialEmail?: string;
}

export function EmailGate({ onSuccess, initialEmail = "" }: EmailGateProps) {
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (touched) {
      const check = validateEmail(val);
      if (!check.isValid && val.length > 0) {
        setError(check.error || "Enter a valid email address.");
      } else {
        setError(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    const check = validateEmail(email);
    if (!check.isValid || !check.normalizedEmail) {
      setError(check.error || "Enter a valid email address.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/visitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: check.normalizedEmail,
          source: "landing_hero",
          utmParams: {
            referrer: typeof document !== "undefined" ? document.referrer : "",
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to start conversation.");
      }

      onSuccess(data.visitor, data.conversationId);
    } catch (err: any) {
      setError(err.message || "Failed to initialize session.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative group w-full max-w-[320px] sm:max-w-[400px]">
      <form
        onSubmit={handleSubmit}
        className={`flex items-center w-full rounded-full bg-white/60 backdrop-blur-xl border transition-all duration-500 p-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ${
          error ? "border-red-500/30" : "border-black/5 hover:border-black/15 hover:bg-white/80"
        }`}
      >
        <div className="flex-1 relative flex items-center pl-4 sm:pl-6">
          <input
            type="email"
            value={email}
            onChange={handleInputChange}
            onBlur={() => setTouched(true)}
            placeholder="Initiate session with your email"
            disabled={loading}
            className="w-full bg-transparent text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 placeholder:font-light focus:outline-none disabled:opacity-50"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || (touched && !!error)}
          className="shrink-0 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-zinc-900 text-white hover:bg-zinc-800 transition-all disabled:opacity-50 active:scale-95"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </button>
      </form>
      
      {/* Absolute positioned minimal error text */}
      <div
        className={`absolute -bottom-6 left-0 w-full text-center transition-all duration-300 ${
          error ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <p className="text-[10px] font-mono tracking-wider text-red-500 uppercase">{error}</p>
      </div>
    </div>
  );
}
