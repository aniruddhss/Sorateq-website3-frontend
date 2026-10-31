"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FAQItem } from "@/lib/types";
import { ArrowLeft, Plus, Edit2, Trash2, Save, X } from "lucide-react";

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [editingFAQ, setEditingFAQ] = useState<Partial<FAQItem> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const res = await fetch("/api/admin/data");
      const json = await res.json();
      if (json.faqs) {
        setFaqs(json.faqs);
      }
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFAQ?.question || !editingFAQ?.answer) return;

    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "upsert_faq",
          payload: {
            id: editingFAQ.id || `faq_${Date.now()}`,
            question: editingFAQ.question,
            answer: editingFAQ.answer,
            category: editingFAQ.category || "general",
            visibility: editingFAQ.visibility || "PUBLIC",
            tags: editingFAQ.tags || [],
          },
        }),
      });

      setEditingFAQ(null);
      fetchFAQs();
    } catch {
      //
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;
    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_faq", payload: { id } }),
      });
      fetchFAQs();
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
        <button
          onClick={() =>
            setEditingFAQ({
              id: "",
              question: "",
              answer: "",
              category: "general",
              visibility: "PUBLIC",
              tags: [],
            })
          }
          className="flex items-center space-x-1.5 text-xs font-medium px-4 py-2 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add FAQ</span>
        </button>
      </div>

      {editingFAQ && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fade-in">
          <form
            onSubmit={handleSave}
            className="w-full max-w-xl bg-zinc-950 border border-white/15 rounded-2xl p-6 sm:p-8 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-semibold text-white">{editingFAQ.id ? "Edit FAQ" : "New FAQ"}</h3>
              <button
                type="button"
                onClick={() => setEditingFAQ(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white bg-zinc-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Question</label>
              <input
                type="text"
                required
                value={editingFAQ.question || ""}
                onChange={(e) => setEditingFAQ({ ...editingFAQ, question: e.target.value })}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Category</label>
              <select
                value={editingFAQ.category || "general"}
                onChange={(e) => setEditingFAQ({ ...editingFAQ, category: e.target.value as any })}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
              >
                <option value="general">General</option>
                <option value="pricing">Pricing</option>
                <option value="process">Process</option>
                <option value="technical">Technical</option>
                <option value="timeline">Timeline</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Answer</label>
              <textarea
                rows={5}
                required
                value={editingFAQ.answer || ""}
                onChange={(e) => setEditingFAQ({ ...editingFAQ, answer: e.target.value })}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3 text-xs text-white leading-relaxed"
              />
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setEditingFAQ(null)}
                className="text-xs font-mono px-4 py-2 text-zinc-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center space-x-1.5 text-xs font-medium px-5 py-2.5 rounded-lg bg-white text-zinc-950"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save FAQ</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FAQ List */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/40 divide-y divide-white/5 overflow-hidden">
        {faqs.map((faq) => (
          <div key={faq.id} className="p-5 flex items-start justify-between gap-4 hover:bg-zinc-900/80 transition-colors">
            <div className="space-y-1.5 max-w-2xl">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-white/5">
                {faq.category}
              </span>
              <h4 className="text-sm font-semibold text-white">{faq.question}</h4>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">{faq.answer}</p>
            </div>
            <div className="flex items-center space-x-2 shrink-0 pt-1">
              <button
                onClick={() => setEditingFAQ(faq)}
                className="p-1.5 text-zinc-400 hover:text-white rounded bg-zinc-950 border border-white/5"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(faq.id)}
                className="p-1.5 text-zinc-500 hover:text-red-400 rounded bg-zinc-950 border border-white/5"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
