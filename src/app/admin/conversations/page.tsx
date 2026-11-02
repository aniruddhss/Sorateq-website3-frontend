"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, MessageSquare, Clock, User, FileText, CheckCircle2 } from "lucide-react";

function ConversationInspectorContent() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConv, setSelectedConv] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const queryId = searchParams.get("id");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/data");
      const json = await res.json();
      if (json.conversations) {
        setConversations(json.conversations);
        if (queryId) {
          const matched = json.conversations.find((c: any) => c.id === queryId);
          if (matched) setSelectedConv(matched);
        } else if (json.conversations.length > 0) {
          setSelectedConv(json.conversations[0]);
        }
      }
    } catch {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 py-10 px-6 sm:px-10 max-w-7xl mx-auto space-y-6 w-full">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <Link
          href="/admin"
          className="inline-flex items-center text-xs font-mono text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          <span>Back to Dashboard</span>
        </Link>
        <span className="text-xs font-mono text-zinc-500">{conversations.length} Active Conversations</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 4 Cols: Conversation List */}
        <div className="lg:col-span-4 rounded-2xl border border-white/10 bg-zinc-900/40 p-4 space-y-2 max-h-[80vh] overflow-y-auto">
          <div className="text-xs font-mono uppercase text-zinc-500 px-2 py-1">Conversations Log</div>
          {loading ? (
            <div className="py-8 text-center text-xs font-mono text-zinc-500">Loading...</div>
          ) : conversations.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono text-zinc-500">No conversations yet.</div>
          ) : (
            conversations.map((c) => {
              const isSelected = selectedConv?.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedConv(c)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    isSelected
                      ? "border-emerald-500/50 bg-emerald-950/20 text-white"
                      : "border-white/5 bg-zinc-950/60 text-zinc-400 hover:border-white/15 hover:text-zinc-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-white truncate max-w-[180px]">{c.visitorEmail}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                      {c.state}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-1 flex items-center justify-between">
                    <span>{c.messages.length} msgs</span>
                    <span>{new Date(c.lastMessageAt).toLocaleDateString()}</span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Right 8 Cols: Inspector */}
        <div className="lg:col-span-8 rounded-2xl border border-white/10 bg-zinc-900/40 p-6 space-y-6">
          {selectedConv ? (
            <div className="space-y-6">
              {/* Visitor & Profile Metadata Banner */}
              <div className="rounded-xl border border-white/5 bg-zinc-950/80 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono uppercase text-zinc-500">Visitor Identity</div>
                    <div className="text-base font-semibold text-white">{selectedConv.visitorEmail}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-mono uppercase text-zinc-500">Conversation State</div>
                    <span className="inline-block text-xs font-mono px-2.5 py-1 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-400">
                      {selectedConv.state}
                    </span>
                  </div>
                </div>

                {/* Extracted Profile Tags */}
                {selectedConv.projectProfile && (
                  <div className="pt-2 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                    <div>
                      <span className="text-zinc-500 text-[10px] uppercase block">Category</span>
                      <span className="text-zinc-300">{selectedConv.projectProfile.projectCategory || "Unknown"}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[10px] uppercase block">Industry</span>
                      <span className="text-zinc-300">{selectedConv.projectProfile.industry || "Unknown"}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[10px] uppercase block">Stage</span>
                      <span className="text-zinc-300">{selectedConv.projectProfile.currentStage || "Unknown"}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[10px] uppercase block">Timeline</span>
                      <span className="text-zinc-300">{selectedConv.projectProfile.timeline || "TBD"}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Message Transcript */}
              <div className="space-y-4">
                <div className="text-xs font-mono uppercase text-zinc-400">Message Transcript</div>
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {selectedConv.messages.map((msg: any, idx: number) => {
                    const isAssistant = msg.sender === "assistant";
                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl border text-xs leading-relaxed ${
                          isAssistant
                            ? "bg-zinc-950/80 border-white/10 text-zinc-200"
                            : "bg-zinc-900 border-white/5 text-zinc-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1 text-[10px] font-mono text-zinc-500">
                          <span>{isAssistant ? "Sora Assistant" : selectedConv.visitorEmail}</span>
                          <span>{new Date(msg.createdAt).toLocaleTimeString()}</span>
                        </div>
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-xs font-mono text-zinc-500">Select a conversation to inspect.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminConversationsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center py-20 text-xs font-mono text-zinc-500">
          Loading conversation inspector...
        </div>
      }
    >
      <ConversationInspectorContent />
    </Suspense>
  );
}
