"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ProjectBriefData } from "@/lib/types";
import { X, Calendar, Clock, CheckCircle2, Loader2, ArrowRight } from "lucide-react";

interface MeetingSchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
  conversationId?: string;
  projectBrief?: ProjectBriefData;
}

interface Slot {
  id: string;
  date: string;
  time: string;
  fullIso: string;
}

export function MeetingSchedulerModal({
  isOpen,
  onClose,
  defaultEmail = "",
  conversationId,
  projectBrief,
}: MeetingSchedulerModalProps) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState(defaultEmail);
  const [company, setCompany] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (defaultEmail && !email) {
      setEmail(defaultEmail);
    }
  }, [defaultEmail, email]);

  useEffect(() => {
    if (isOpen) {
      fetchSlots();
    }
  }, [isOpen]);

  const fetchSlots = async () => {
    setLoadingSlots(true);
    try {
      const res = await fetch("/api/meetings");
      const data = await res.json();
      if (data.slots) {
        setSlots(data.slots);
        if (data.slots.length > 0) {
          setSelectedSlot(data.slots[0]);
        }
      }
    } catch {
      // Slot load fallback
    } finally {
      setLoadingSlots(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      setError("Please select an available time slot.");
      return;
    }
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          notes,
          scheduledTime: selectedSlot.fullIso,
          conversationId,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to schedule meeting.");
      }

      setConfirmed(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-xl bg-zinc-950 border border-white/15 rounded-2xl p-6 sm:p-8 flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-2.5">
            <span className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-lg overflow-hidden border border-white/15 bg-zinc-900 p-0.5">
              <Image
                src="/sorateq-logo-medium.png"
                alt="Sorateq"
                width={24}
                height={24}
                className="h-full w-full object-contain"
              />
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
              SORATEQ TECHNICAL DISCOVERY
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close meeting scheduler"
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white bg-zinc-900 border border-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {confirmed ? (
          <div className="py-12 text-center space-y-4 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-white">Discovery Session Scheduled</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
              We&apos;ve sent an invitation to <span className="text-white font-medium">{email}</span> with Google Meet
              links and the structured project brief.
            </p>
            {selectedSlot && (
              <div className="inline-block bg-zinc-900/80 border border-white/10 px-4 py-2.5 rounded-lg text-xs font-mono text-zinc-300">
                {selectedSlot.date} at {selectedSlot.time} (25 mins)
              </div>
            )}
            <div className="pt-4">
              <button
                onClick={onClose}
                className="text-xs font-medium px-6 py-2.5 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="my-4 space-y-5">
            <div>
              <h3 className="text-lg font-semibold text-white">25-Minute Architecture Call</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Direct discussion with a Sorateq founding engineer to review your MVP scope and architecture.
              </p>
            </div>

            {error && (
              <div className="text-xs text-red-400 bg-red-950/40 border border-red-800/50 p-2.5 rounded-lg">
                {error}
              </div>
            )}

            {/* Slots Selection */}
            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-2">Select Time Slot</label>
              {loadingSlots ? (
                <div className="py-6 flex items-center justify-center text-zinc-500 text-xs font-mono">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading calendar availability...
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
                  {slots.map((s) => {
                    const isSelected = selectedSlot?.id === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSelectedSlot(s)}
                        className={`text-left p-2.5 rounded-lg border text-xs transition-all ${
                          isSelected
                            ? "border-emerald-500/60 bg-emerald-950/20 text-white"
                            : "border-white/5 bg-zinc-900/60 text-zinc-400 hover:border-white/15 hover:text-zinc-200"
                        }`}
                      >
                        <div className="font-mono text-[10px] text-zinc-500">{s.date}</div>
                        <div className="font-medium text-xs mt-0.5">{s.time}</div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* User Form Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Company / Project (Optional)</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Apex Technologies"
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30"
              />
            </div>

            {projectBrief && (
              <div className="p-3 bg-zinc-900/50 border border-white/5 rounded-lg text-xs">
                <span className="font-mono text-[10px] uppercase text-zinc-500">Brief Context Attached: </span>
                <span className="text-zinc-300 font-medium">{projectBrief.projectName}</span>
              </div>
            )}

            <div className="pt-2 border-t border-white/10 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-mono px-4 py-2 text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 text-xs font-medium px-5 py-2.5 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Clock className="w-3.5 h-3.5" />}
                <span>Confirm Meeting</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
