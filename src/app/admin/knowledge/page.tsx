"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Save, Database, Search } from "lucide-react";

export default function AdminKnowledgePage() {
  const [docs, setDocs] = useState<any[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [testQuery, setTestQuery] = useState("");
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const res = await fetch("/api/admin/data");
      const json = await res.json();
      if (json.knowledgeDocs) {
        setDocs(json.knowledgeDocs);
        if (json.knowledgeDocs.length > 0) {
          setSelectedDoc(json.knowledgeDocs[0]);
        }
      }
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoc?.title || !selectedDoc?.content) return;

    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "upsert_knowledge",
          payload: {
            id: selectedDoc.id || `kb_${Date.now()}`,
            title: selectedDoc.title,
            category: selectedDoc.category || "company",
            content: selectedDoc.content,
            visibility: selectedDoc.visibility || "PUBLIC",
            tags: selectedDoc.tags || [],
          },
        }),
      });
      fetchDocs();
    } catch {
      //
    }
  };

  const handleTestSearch = () => {
    if (!testQuery.trim()) {
      setTestResults([]);
      return;
    }
    const q = testQuery.toLowerCase();
    const results = docs.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.content.toLowerCase().includes(q) ||
        d.tags.some((t: string) => t.toLowerCase().includes(q))
    );
    setTestResults(results);
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
            setSelectedDoc({
              id: "",
              title: "New Knowledge Document",
              category: "company",
              content: "",
              visibility: "PUBLIC",
              tags: [],
            })
          }
          className="flex items-center space-x-1.5 text-xs font-medium px-4 py-2 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Document</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 4 Cols: Document List & Search Test */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-4 space-y-2 max-h-[50vh] overflow-y-auto">
            <div className="text-xs font-mono uppercase text-zinc-500 px-2 py-1">Knowledge Documents</div>
            {docs.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDoc(d)}
                className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                  selectedDoc?.id === d.id
                    ? "border-emerald-500/50 bg-emerald-950/20 text-white"
                    : "border-white/5 bg-zinc-950/60 text-zinc-400 hover:border-white/15"
                }`}
              >
                <div className="font-medium text-white">{d.title}</div>
                <div className="text-[10px] font-mono text-zinc-500 uppercase mt-0.5">{d.category}</div>
              </button>
            ))}
          </div>

          {/* Search Testing Panel */}
          <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-4 space-y-3">
            <div className="text-xs font-mono uppercase text-zinc-400 flex items-center space-x-1.5">
              <Search className="w-3.5 h-3.5 text-emerald-400" />
              <span>Test Sora Hybrid Retrieval</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                placeholder="Query (e.g. pricing, ai)..."
                className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
              />
              <button
                onClick={handleTestSearch}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 text-xs font-mono text-white hover:bg-zinc-700"
              >
                Test
              </button>
            </div>
            {testResults.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Matches ({testResults.length})</span>
                {testResults.map((r) => (
                  <div key={r.id} className="p-2 rounded bg-zinc-950 border border-white/5 text-[11px] text-zinc-300">
                    {r.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 8 Cols: Document Editor */}
        <div className="lg:col-span-8 rounded-2xl border border-white/10 bg-zinc-900/40 p-6 space-y-4">
          {selectedDoc ? (
            <form onSubmit={handleSaveDoc} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={selectedDoc.title || ""}
                  onChange={(e) => setSelectedDoc({ ...selectedDoc, title: e.target.value })}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Category</label>
                  <select
                    value={selectedDoc.category || "company"}
                    onChange={(e) => setSelectedDoc({ ...selectedDoc, category: e.target.value })}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                  >
                    <option value="company">Company</option>
                    <option value="capabilities">Capabilities</option>
                    <option value="methodology">Methodology</option>
                    <option value="technology">Technology</option>
                    <option value="commercial">Commercial / Pricing</option>
                    <option value="guidelines">Guidelines</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Visibility Level</label>
                  <select
                    value={selectedDoc.visibility || "PUBLIC"}
                    onChange={(e) => setSelectedDoc({ ...selectedDoc, visibility: e.target.value })}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2 text-xs text-white"
                  >
                    <option value="PUBLIC">PUBLIC (Retrievable by Sora for visitors)</option>
                    <option value="INTERNAL">INTERNAL (Internal only)</option>
                    <option value="PRIVATE">PRIVATE (Restricted)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Knowledge Content</label>
                <textarea
                  rows={10}
                  required
                  value={selectedDoc.content || ""}
                  onChange={(e) => setSelectedDoc({ ...selectedDoc, content: e.target.value })}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl p-4 text-xs font-mono text-zinc-200 leading-relaxed"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center space-x-1.5 text-xs font-medium px-5 py-2.5 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Document</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="py-20 text-center text-xs font-mono text-zinc-500">Select a document to edit.</div>
          )}
        </div>
      </div>
    </div>
  );
}
