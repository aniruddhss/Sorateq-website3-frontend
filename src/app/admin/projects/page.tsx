"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ProjectRecord } from "@/lib/types";
import { ArrowLeft, Plus, Edit2, Trash2, Eye, EyeOff, Save, X } from "lucide-react";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [editingProject, setEditingProject] = useState<Partial<ProjectRecord> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/admin/data");
      const json = await res.json();
      if (json.projects) {
        setProjects(json.projects);
      }
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.name || !editingProject?.slug) return;

    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "upsert_project",
          payload: {
            id: editingProject.id || `proj_${Date.now()}`,
            slug: editingProject.slug,
            name: editingProject.name,
            tagline: editingProject.tagline || "",
            summary: editingProject.summary || "",
            fullDescription: editingProject.fullDescription || "",
            industry: editingProject.industry || "Technology",
            projectType: editingProject.projectType || "SaaS",
            problem: editingProject.problem || "",
            solution: editingProject.solution || "",
            features: editingProject.features || [],
            technologies: editingProject.technologies || [],
            services: editingProject.services || [],
            stage: editingProject.stage || "Production",
            projectOutcome: editingProject.projectOutcome || "",
            featured: editingProject.featured ?? true,
            visibility: editingProject.visibility || "PUBLIC",
            tags: editingProject.tags || [],
            keywords: editingProject.keywords || [],
          },
        }),
      });

      setEditingProject(null);
      fetchProjects();
    } catch {
      //
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_project", payload: { id } }),
      });
      fetchProjects();
    } catch {
      //
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
        <button
          onClick={() =>
            setEditingProject({
              id: "",
              slug: "",
              name: "",
              tagline: "",
              summary: "",
              fullDescription: "",
              industry: "AI & SaaS",
              projectType: "AI Application",
              problem: "",
              solution: "",
              features: ["Core Workflow", "Telemetry"],
              technologies: ["Next.js", "TypeScript", "PostgreSQL"],
              services: ["AI Engineering", "SaaS Development"],
              stage: "Production",
              projectOutcome: "",
              featured: true,
              visibility: "PUBLIC",
              tags: ["AI", "SaaS"],
              keywords: [],
            })
          }
          className="flex items-center space-x-1.5 text-xs font-medium px-4 py-2 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Project</span>
        </button>
      </div>

      {/* Project Editor Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 sm:p-6 backdrop-blur-md overflow-y-auto animate-fade-in">
          <form
            onSubmit={handleSave}
            className="w-full max-w-2xl bg-zinc-950 border border-white/15 rounded-2xl p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-semibold text-white">
                {editingProject.id ? "Edit Project" : "New Studio Project"}
              </h3>
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white bg-zinc-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={editingProject.name || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Slug URL</label>
                <input
                  type="text"
                  required
                  value={editingProject.slug || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Tagline</label>
              <input
                type="text"
                value={editingProject.tagline || ""}
                onChange={(e) => setEditingProject({ ...editingProject, tagline: e.target.value })}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Short Summary</label>
              <textarea
                rows={2}
                value={editingProject.summary || ""}
                onChange={(e) => setEditingProject({ ...editingProject, summary: e.target.value })}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Category</label>
                <select
                  value={editingProject.projectType || "SaaS"}
                  onChange={(e) => setEditingProject({ ...editingProject, projectType: e.target.value as any })}
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                >
                  <option value="SaaS">SaaS</option>
                  <option value="AI Application">AI Application</option>
                  <option value="Web Platform">Web Platform</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="Developer Tool">Developer Tool</option>
                  <option value="Automation">Automation</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Visibility</label>
                <select
                  value={editingProject.visibility || "PUBLIC"}
                  onChange={(e) => setEditingProject({ ...editingProject, visibility: e.target.value as any })}
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                >
                  <option value="PUBLIC">PUBLIC (Searchable by Sora & visitors)</option>
                  <option value="INTERNAL">INTERNAL (Admin only)</option>
                  <option value="PRIVATE">PRIVATE</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="text-xs font-mono px-4 py-2 text-zinc-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center space-x-1 text-xs font-medium px-5 py-2.5 rounded-lg bg-white text-zinc-950"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Project</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects Table */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/40 overflow-hidden">
        <table className="w-full text-left text-xs font-mono">
          <thead className="border-b border-white/10 bg-zinc-950/60 text-zinc-500 uppercase text-[10px]">
            <tr>
              <th className="p-4">Project Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Industry</th>
              <th className="p-4">Visibility</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {projects.map((p) => (
              <tr key={p.id} className="hover:bg-zinc-900/80">
                <td className="p-4 font-sans font-medium text-white">{p.name}</td>
                <td className="p-4 text-zinc-400">{p.projectType}</td>
                <td className="p-4 text-zinc-400">{p.industry}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] ${
                      p.visibility === "PUBLIC" ? "bg-emerald-950/60 text-emerald-400" : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {p.visibility}
                  </span>
                </td>
                <td className="p-4 space-x-3">
                  <button
                    onClick={() => setEditingProject(p)}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
