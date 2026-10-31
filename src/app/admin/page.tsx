"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  MessageSquare,
  Sparkles,
  Calendar,
  Layers,
  FileText,
  DollarSign,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  Loader2,
  Lock,
  LogOut,
  HelpCircle,
  Database,
  Cpu,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(false);

  const [data, setData] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const res = await fetch("/api/admin/auth");
      const json = await res.json();
      setAuthorized(json.authorized);
      if (json.authorized) {
        fetchAdminData();
      }
    } catch {
      setAuthorized(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAuth(true);
    setAuthError(null);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Invalid passphrase");
      }
      setAuthorized(true);
      fetchAdminData();
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setLoadingAuth(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAuthorized(false);
    setData(null);
  };

  const fetchAdminData = async () => {
    setLoadingData(true);
    try {
      const res = await fetch("/api/admin/data");
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch {
      // Failed to load
    } finally {
      setLoadingData(false);
    }
  };

  if (authorized === null) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 text-xs font-mono text-zinc-500">
        Verifying administrator authorization...
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 min-h-[60vh]">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-900/80 p-8 space-y-6 shadow-2xl">
          <div className="flex items-center space-x-2 text-zinc-400 text-xs font-mono">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>SORATEQ INTERNAL CONSOLE</span>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">Admin Authentication</h2>
            <p className="text-xs text-zinc-400 mt-1">Enter internal access passphrase.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Passphrase"
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30"
              />
              {authError && <p className="text-[11px] text-red-400 mt-1.5 font-mono">{authError}</p>}
            </div>

            <button
              type="submit"
              disabled={loadingAuth}
              className="w-full flex items-center justify-center space-x-2 rounded-xl bg-white px-4 py-3 text-xs font-medium text-zinc-950 hover:bg-zinc-200 transition-all disabled:opacity-50"
            >
              {loadingAuth ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Access Console</span>}
            </button>
          </form>
          <div className="text-[10px] font-mono text-zinc-600 text-center">
            Default pass: <code className="text-zinc-400">sorateq2026admin</code>
          </div>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {
    totalConversations: 0,
    totalLeads: 0,
    qualifiedLeads: 0,
    bookedMeetings: 0,
    totalProjects: 0,
    totalTokens: 0,
    totalCost: 0,
    conversionRate: "0.0",
  };

  return (
    <div className="flex-1 py-10 px-6 sm:px-10 max-w-7xl mx-auto space-y-10 w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-subtle" />
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
              SORATEQ OPERATING SYSTEM
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">Admin Dashboard</h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchAdminData}
            className="text-xs font-mono px-3 py-1.5 rounded-lg border border-white/10 bg-zinc-900 text-zinc-300 hover:text-white transition-all"
          >
            Refresh Data
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1.5 text-xs font-mono px-3 py-1.5 rounded-lg border border-white/10 bg-zinc-900 text-zinc-400 hover:text-red-400 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Sub-Nav Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4 text-xs font-mono">
        <Link href="/admin" className="px-3.5 py-1.5 rounded-lg bg-white text-zinc-950 font-medium">
          Overview
        </Link>
        <Link
          href="/admin/conversations"
          className="px-3.5 py-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
        >
          Conversations ({data?.conversations?.length || 0})
        </Link>
        <Link
          href="/admin/leads"
          className="px-3.5 py-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
        >
          Leads CRM ({data?.leads?.length || 0})
        </Link>
        <Link
          href="/admin/projects"
          className="px-3.5 py-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
        >
          Projects ({data?.projects?.length || 0})
        </Link>
        <Link
          href="/admin/knowledge"
          className="px-3.5 py-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
        >
          Knowledge Base
        </Link>
        <Link
          href="/admin/faqs"
          className="px-3.5 py-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
        >
          FAQs
        </Link>
        <Link
          href="/admin/prompts"
          className="px-3.5 py-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
        >
          Prompt Engine
        </Link>
        <Link
          href="/admin/analytics"
          className="px-3.5 py-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
        >
          Analytics Funnel
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-5 space-y-1">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-[11px] font-mono uppercase">Total Conversations</span>
            <MessageSquare className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalConversations}</div>
          <div className="text-[10px] font-mono text-emerald-400">100% Retained</div>
        </div>

        <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-5 space-y-1">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-[11px] font-mono uppercase">Qualified Leads</span>
            <Users className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.qualifiedLeads}</div>
          <div className="text-[10px] font-mono text-zinc-400">{stats.totalLeads} Total Prospects</div>
        </div>

        <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-5 space-y-1">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-[11px] font-mono uppercase">Booked Meetings</span>
            <Calendar className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.bookedMeetings}</div>
          <div className="text-[10px] font-mono text-emerald-400">{stats.conversionRate}% Conversion</div>
        </div>

        <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-5 space-y-1">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-[11px] font-mono uppercase">Model Token Cost</span>
            <DollarSign className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-white">${stats.totalCost}</div>
          <div className="text-[10px] font-mono text-zinc-400">{stats.totalTokens.toLocaleString()} Tokens</div>
        </div>
      </div>

      {/* Main Grid: Recent Activity & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Cols: Recent Conversations */}
        <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-zinc-900/40 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-sm font-semibold text-white">Recent Sora Conversations</h3>
            <Link
              href="/admin/conversations"
              className="text-xs font-mono text-emerald-400 hover:underline flex items-center"
            >
              View all <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>

          {loadingData ? (
            <div className="py-12 text-center text-xs font-mono text-zinc-500">Loading conversations...</div>
          ) : !data?.conversations || data.conversations.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono text-zinc-500">No active conversations yet.</div>
          ) : (
            <div className="space-y-2">
              {data.conversations.slice(0, 5).map((c: any) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-xl border border-white/5 bg-zinc-950/60 flex items-center justify-between hover:border-white/15 transition-all text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-white">{c.visitorEmail}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-white/5">
                        {c.state}
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-500">
                      {c.messages.length} messages • {c.projectProfile?.projectCategory || "General"}
                    </div>
                  </div>
                  <Link
                    href={`/admin/conversations?id=${c.id}`}
                    className="text-xs font-mono text-zinc-400 hover:text-white px-2.5 py-1 rounded bg-zinc-900 border border-white/5"
                  >
                    Inspect
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 5 Cols: Management Shortcuts */}
        <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-zinc-900/40 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white border-b border-white/5 pb-3">Knowledge & Engine Management</h3>
          <div className="space-y-2.5">
            <Link
              href="/admin/projects"
              className="p-3.5 rounded-xl border border-white/5 bg-zinc-950/60 hover:bg-zinc-900 hover:border-white/15 flex items-center justify-between transition-all group"
            >
              <div className="flex items-center space-x-3">
                <Layers className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="text-xs font-medium text-white">Project Case Studies</div>
                  <div className="text-[11px] text-zinc-500">{data?.projects?.length || 0} active records</div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/admin/knowledge"
              className="p-3.5 rounded-xl border border-white/5 bg-zinc-950/60 hover:bg-zinc-900 hover:border-white/15 flex items-center justify-between transition-all group"
            >
              <div className="flex items-center space-x-3">
                <Database className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="text-xs font-medium text-white">Knowledge Documents</div>
                  <div className="text-[11px] text-zinc-500">{data?.knowledgeDocs?.length || 0} indexed documents</div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/admin/prompts"
              className="p-3.5 rounded-xl border border-white/5 bg-zinc-950/60 hover:bg-zinc-900 hover:border-white/15 flex items-center justify-between transition-all group"
            >
              <div className="flex items-center space-x-3">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="text-xs font-medium text-white">Sora Prompt & Routing</div>
                  <div className="text-[11px] text-zinc-500">Active: {data?.activePrompt?.version || "1.0.0"}</div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/admin/faqs"
              className="p-3.5 rounded-xl border border-white/5 bg-zinc-950/60 hover:bg-zinc-900 hover:border-white/15 flex items-center justify-between transition-all group"
            >
              <div className="flex items-center space-x-3">
                <HelpCircle className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="text-xs font-medium text-white">Frequently Asked Questions</div>
                  <div className="text-[11px] text-zinc-500">{data?.faqs?.length || 0} FAQs</div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
