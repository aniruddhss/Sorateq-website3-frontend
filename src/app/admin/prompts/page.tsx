"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PromptVersion } from "@/lib/types";
import { ArrowLeft, Cpu, Save, Plus, CheckCircle2, ShieldCheck } from "lucide-react";

export default function AdminPromptsPage() {
  const [prompts, setPrompts] = useState<PromptVersion[]>([]);
  const [activePrompt, setActivePrompt] = useState<PromptVersion | null>(null);
  const [editingPrompt, setEditingPrompt] = useState<Partial<PromptVersion> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const res = await fetch("/api/admin/data");
      const json = await res.json();
      if (json.promptVersions) {
        setPrompts(json.promptVersions);
        const active = json.promptVersions.find((p: any) => p.isActive);
        if (active) {
          setActivePrompt(active);
          setEditingPrompt(active);
        }
      }
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPrompt?.version || !editingPrompt?.systemPrompt) return;

    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "upsert_prompt",
          payload: {
            id: editingPrompt.id || `prompt_v${Date.now()}`,
            version: editingPrompt.version,
            name: editingPrompt.name || "Custom Version",
            systemPrompt: editingPrompt.systemPrompt,
            isActive: editingPrompt.isActive ?? true,
            model: editingPrompt.model || "primary",
            temperature: editingPrompt.temperature ?? 0.6,
            maxTokens: editingPrompt.maxTokens ?? 1200,
            createdAt: new Date().toISOString(),
          },
        }),
      });
      fetchPrompts();
    } catch {
      //
    }
  };

  return (
    <div className="flex-1 py-10 px-6 sm:px-10 max-w-7xl mx-auto space-y-6 w-full">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <Link
          href="/admin"
          className="inline-flex items-center text-xs font-mono text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          <span>Active Engine Prompt: v{activePrompt?.version || "1.0.0"}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 4 Cols: Version History & Model Routing */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-4 space-y-2">
            <div className="text-xs font-mono uppercase text-zinc-500 px-2 py-1">Prompt Versions</div>
            {prompts.map((p) => (
              <button
                key={p.id}
                onClick={() => setEditingPrompt(p)}
                className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                  editingPrompt?.id === p.id
                    ? "border-emerald-500/50 bg-emerald-950/20 text-white"
                    : "border-white/5 bg-zinc-950/60 text-zinc-400 hover:border-white/15"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">v{p.version} — {p.name}</span>
                  {p.isActive && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div className="text-[10px] font-mono text-zinc-500 mt-1">
                  Model: {p.model} • Temp: {p.temperature}
                </div>
              </button>
            ))}
          </div>

          {/* Model Routing Settings */}
          <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-5 space-y-3">
            <div className="text-xs font-mono uppercase text-zinc-400">Multi-Model Routing Architecture</div>
            <div className="space-y-2 text-xs font-mono text-zinc-300">
              <div className="p-2.5 rounded bg-zinc-950 border border-white/5">
                <span className="text-zinc-500 block text-[10px]">Intent & Routing Layer</span>
                <span className="text-emerald-400 font-semibold">Fast / Inexpensive Model</span>
              </div>
              <div className="p-2.5 rounded bg-zinc-950 border border-white/5">
                <span className="text-zinc-500 block text-[10px]">Product Architecture & Chat</span>
                <span className="text-emerald-400 font-semibold">Primary Core Model</span>
              </div>
              <div className="p-2.5 rounded bg-zinc-950 border border-white/5">
                <span className="text-zinc-500 block text-[10px]">PRD Synthesis & Briefs</span>
                <span className="text-emerald-400 font-semibold">Reasoning Model</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 8 Cols: Prompt Editor */}
        <div className="lg:col-span-8 rounded-2xl border border-white/10 bg-zinc-900/40 p-6 space-y-4">
          {editingPrompt && (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Version String</label>
                  <input
                    type="text"
                    required
                    value={editingPrompt.version || ""}
                    onChange={(e) => setEditingPrompt({ ...editingPrompt, version: e.target.value })}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Version Label</label>
                  <input
                    type="text"
                    required
                    value={editingPrompt.name || ""}
                    onChange={(e) => setEditingPrompt({ ...editingPrompt, name: e.target.value })}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Model Target</label>
                  <select
                    value={editingPrompt.model || "primary"}
                    onChange={(e) => setEditingPrompt({ ...editingPrompt, model: e.target.value })}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                  >
                    <option value="primary">Primary (Default)</option>
                    <option value="reasoning">Reasoning</option>
                    <option value="fast">Fast</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Temperature</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={editingPrompt.temperature ?? 0.6}
                    onChange={(e) => setEditingPrompt({ ...editingPrompt, temperature: parseFloat(e.target.value) })}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                  />
                </div>

                <div className="flex items-end pb-1">
                  <label className="flex items-center space-x-2 text-xs text-zinc-300 font-mono cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPrompt.isActive ?? false}
                      onChange={(e) => setEditingPrompt({ ...editingPrompt, isActive: e.target.checked })}
                      className="rounded border-white/20 bg-zinc-950 text-emerald-500 focus:ring-0"
                    />
                    <span>Set as Active Version</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                  System Prompt Definition
                </label>
                <textarea
                  rows={14}
                  required
                  value={editingPrompt.systemPrompt || ""}
                  onChange={(e) => setEditingPrompt({ ...editingPrompt, systemPrompt: e.target.value })}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl p-4 text-xs font-mono text-zinc-200 leading-relaxed focus:outline-none focus:border-white/30"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center space-x-1.5 text-xs font-medium px-5 py-2.5 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Version</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
