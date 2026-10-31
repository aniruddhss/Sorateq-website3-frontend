"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, TrendingUp, DollarSign, Activity, Users, MessageSquare, Calendar } from "lucide-react";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("/api/admin/data");
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  const stats = data?.stats || {};
  const events = data?.analytics || [];
  const modelUsage = data?.modelUsage || [];

  // Funnel calculations
  const emailSubmits = events.filter((e: any) => e.eventType === "email_submitted").length;
  const messagesSent = events.filter((e: any) => e.eventType === "message_sent").length;
  const briefsGen = events.filter((e: any) => e.eventType === "project_brief_generated").length;
  const meetingsBooked = events.filter((e: any) => e.eventType === "meeting_booked").length;

  return (
    <div className="flex-1 py-10 px-6 sm:px-10 max-w-7xl mx-auto space-y-8 w-full">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <Link
          href="/admin"
          className="inline-flex items-center text-xs font-mono text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          <span>Back to Dashboard</span>
        </Link>
        <span className="text-xs font-mono text-zinc-500">Live Telemetry & Cost Accounting</span>
      </div>

      {/* Conversion Funnel */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Full Conversion Funnel</h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Stage-by-stage progression from initial email drop to confirmed discovery call.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-zinc-950 p-4 rounded-xl border border-white/5 space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-500">1. Email Submitted</span>
            <div className="text-2xl font-bold text-white">{Math.max(emailSubmits, stats.totalConversations || 0)}</div>
            <div className="text-[10px] font-mono text-emerald-400">100% Entry Rate</div>
          </div>

          <div className="bg-zinc-950 p-4 rounded-xl border border-white/5 space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-500">2. Messages Exchanged</span>
            <div className="text-2xl font-bold text-white">{messagesSent}</div>
            <div className="text-[10px] font-mono text-zinc-400">Active Engagement</div>
          </div>

          <div className="bg-zinc-950 p-4 rounded-xl border border-white/5 space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-500">3. Briefs Formulated</span>
            <div className="text-2xl font-bold text-white">{briefsGen}</div>
            <div className="text-[10px] font-mono text-zinc-400">High Product Intent</div>
          </div>

          <div className="bg-zinc-950 p-4 rounded-xl border border-emerald-500/30 space-y-1">
            <span className="text-[10px] font-mono uppercase text-emerald-400">4. Meetings Booked</span>
            <div className="text-2xl font-bold text-white">{stats.bookedMeetings || meetingsBooked}</div>
            <div className="text-[10px] font-mono text-emerald-400">{stats.conversionRate || "0.0"}% Conversion</div>
          </div>
        </div>
      </div>

      {/* Model Invocations and Cost Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 rounded-2xl border border-white/10 bg-zinc-900/40 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-sm font-semibold text-white">Recent Model Invocations</h3>
            <span className="text-[11px] font-mono text-zinc-400">${stats.totalCost || 0} Total</span>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {modelUsage.length === 0 ? (
              <div className="py-8 text-center text-xs font-mono text-zinc-500">No model calls logged yet.</div>
            ) : (
              modelUsage.slice(-10).reverse().map((u: any) => (
                <div
                  key={u.id}
                  className="p-3 rounded-xl bg-zinc-950/60 border border-white/5 flex items-center justify-between text-xs font-mono"
                >
                  <div>
                    <span className="text-white font-medium">{u.model}</span>
                    <span className="text-[10px] text-zinc-500 ml-2">({u.requestType})</span>
                  </div>
                  <div className="text-right">
                    <span className="text-zinc-300">{u.totalTokens} tokens</span>
                    <span className="text-[10px] text-zinc-500 ml-2">${u.estimatedCostUsd}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-6 rounded-2xl border border-white/10 bg-zinc-900/40 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-sm font-semibold text-white">Recent Telemetry Events</h3>
            <span className="text-[11px] font-mono text-zinc-400">{events.length} Events</span>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {events.length === 0 ? (
              <div className="py-8 text-center text-xs font-mono text-zinc-500">No events logged yet.</div>
            ) : (
              events.slice(-10).reverse().map((ev: any) => (
                <div
                  key={ev.id}
                  className="p-3 rounded-xl bg-zinc-950/60 border border-white/5 flex items-center justify-between text-xs font-mono"
                >
                  <div className="text-emerald-400">{ev.eventType}</div>
                  <div className="text-zinc-500 text-[10px]">
                    {new Date(ev.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
