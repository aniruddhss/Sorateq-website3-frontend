"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Users, Calendar, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/admin/data");
      const json = await res.json();
      if (json.leads) {
        setLeads(json.leads);
      }
    } catch {
      // Failed to load
    } finally {
      setLoading(false);
    }
  };

  const updateLeadState = async (leadId: string, newState: string) => {
    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_lead",
          payload: { id: leadId, updates: { qualificationState: newState } },
        }),
      });
      fetchLeads();
    } catch {
      // Error
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
        <span className="text-xs font-mono text-zinc-500">{leads.length} Identified Leads</span>
      </div>

      {/* CRM Table */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/40 overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Lead Qualification & CRM</h2>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-zinc-500">Loading leads...</div>
        ) : leads.length === 0 ? (
          <div className="py-12 text-center text-xs font-mono text-zinc-500">No leads captured yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-white/10 bg-zinc-950/60 text-zinc-500 uppercase text-[10px]">
                <tr>
                  <th className="p-4">Visitor Email</th>
                  <th className="p-4">Project / Industry</th>
                  <th className="p-4">Lead Score</th>
                  <th className="p-4">Qualification</th>
                  <th className="p-4">Meeting Status</th>
                  <th className="p-4">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-zinc-900/80 transition-colors">
                    <td className="p-4 font-sans font-medium text-white">{lead.email}</td>
                    <td className="p-4 text-zinc-400">
                      {lead.projectType || "General"} {lead.industry ? `(${lead.industry})` : ""}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-semibold">{lead.qualificationScore}</span>
                        <span className="text-[10px] text-zinc-500">/ 100</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <select
                        value={lead.qualificationState}
                        onChange={(e) => updateLeadState(lead.id, e.target.value)}
                        className="bg-zinc-950 border border-white/10 text-xs rounded px-2 py-1 text-zinc-200 focus:outline-none"
                      >
                        <option value="prospect">Prospect</option>
                        <option value="qualified">Qualified</option>
                        <option value="high_intent">High Intent</option>
                        <option value="booked">Booked</option>
                        <option value="unqualified">Unqualified</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-mono ${
                          lead.meetingState === "booked"
                            ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                            : "bg-zinc-800 text-zinc-400 border border-white/5"
                        }`}
                      >
                        {lead.meetingState}
                      </span>
                    </td>
                    <td className="p-4 text-zinc-500">{new Date(lead.updatedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
