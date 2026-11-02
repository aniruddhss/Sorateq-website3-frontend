"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChatMessage, ProjectBriefData } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";
import { ProjectBriefModal } from "./ProjectBriefModal";
import { MeetingSchedulerModal } from "./MeetingSchedulerModal";
import { EmailGate } from "./EmailGate";
import {
  Calendar,
  FileText,
  Loader2,
  ArrowRight,
  CornerDownLeft,
  ArrowUpRight,
  Mail,
  PhoneCall,
  Plus
} from "lucide-react";

// Renders [[project:slug|Name]] markers from the backend as highlighted links with an arrow
const PROJECT_MARKER = /\[\[project:([a-z0-9-]+)\|([^\]]+)\]\]/g;

function renderWithProjectLinks(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  PROJECT_MARKER.lastIndex = 0;
  while ((match = PROJECT_MARKER.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const [, slug, name] = match;
    nodes.push(
      <a
        key={`${slug}-${match.index}`}
        href={`/projects/${slug}`}
        className="inline-flex items-center gap-1 font-semibold text-emerald-500 underline underline-offset-4 decoration-emerald-500/50 hover:decoration-emerald-500"
      >
        {name}
        <ArrowUpRight className="w-3.5 h-3.5" />
      </a>
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

interface SoraChatProps {
  conversationId?: string;
  visitorEmail?: string;
  initialMessages?: ChatMessage[];
}

export function SoraChat({ conversationId, visitorEmail = "", initialMessages = [] }: SoraChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [convId, setConvId] = useState<string | undefined>(conversationId);
  const [activeBrief, setActiveBrief] = useState<ProjectBriefData | null>(null);
  const [isBriefOpen, setIsBriefOpen] = useState(false);
  const [isMeetingOpen, setIsMeetingOpen] = useState(false);
  const [meetingBriefData, setMeetingBriefData] = useState<ProjectBriefData | undefined>(undefined);
  const [visitorEmailState, setVisitorEmailState] = useState(visitorEmail);
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);
  const [callbackPhone, setCallbackPhone] = useState("");
  const [callbackTime, setCallbackTime] = useState("");
  const [callbackError, setCallbackError] = useState<string | null>(null);
  const [callbackSent, setCallbackSent] = useState(false);
  const [callbackSubmitting, setCallbackSubmitting] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);
  const [isIdentified, setIsIdentified] = useState(!!visitorEmail);
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Each page load starts a fresh chat for an identified visitor
  useEffect(() => {
    if (!visitorEmail) return;
    let cancelled = false;
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.authenticated && data.conversation) {
          setConvId(data.conversation.id);
          setMessages([]);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [visitorEmail]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || loading) return;

    setInputValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const optimisticUserMsg: ChatMessage = {
      id: `temp_${Date.now()}`,
      conversationId: convId || "",
      sender: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticUserMsg]);

    // Unidentified visitor: the question stays on screen, the email gate opens,
    // and the answer is requested once the email is submitted
    if (!isIdentified) {
      setPendingQuestion(text);
      setGateOpen(true);
      return;
    }

    await requestAnswer(text);
  };

  const requestAnswer = async (text: string) => {
    setLoading(true);

    try {
      const res = await fetch("/api/sora/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversationId: convId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.code === "email_required") {
          setIsIdentified(false);
          setPendingQuestion(text);
          setGateOpen(true);
          setLoading(false);
          return;
        }
        throw new Error(data.error || "Failed to get response");
      }

      if (data.conversationId && !convId) {
        setConvId(data.conversationId);
      }

      const fullReply = (data.replyText || "").replace(/\*\*/g, "").trim();
      const msgId = `msg_res_${Date.now()}`;

      // Initialize empty assistant message
      const initialAssistantMsg: ChatMessage = {
        id: msgId,
        conversationId: data.conversationId || convId || "",
        sender: "assistant",
        content: "",
        blocks: data.blocks,
        intent: data.intent,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, initialAssistantMsg]);
      setLoading(false);

      // Animate word-by-word streaming effect
      const words = fullReply.split(" ");
      let currentIdx = 0;
      let accumulated = "";

      const interval = setInterval(() => {
        if (currentIdx < words.length) {
          accumulated += (currentIdx > 0 ? " " : "") + words[currentIdx];
          const currentText = accumulated;
          setMessages((prev) =>
            prev.map((m) => (m.id === msgId ? { ...m, content: currentText } : m))
          );
          currentIdx++;
        } else {
          clearInterval(interval);
        }
      }, 22);

    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        conversationId: convId || "",
        sender: "assistant",
        content:
          "Sora is having trouble connecting right now. Your conversation is saved. Please send your message again in a moment.",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
  };

  const openBrief = (brief: ProjectBriefData) => {
    setActiveBrief(brief);
    setIsBriefOpen(true);
  };

  const openMeeting = (brief?: ProjectBriefData) => {
    setMeetingBriefData(brief);
    setIsMeetingOpen(true);
  };

  const trackContact = (type: "email") => {
    fetch("/api/contact-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    }).catch(() => {});
  };

  const submitCallback = async (e: React.FormEvent) => {
    e.preventDefault();
    setCallbackSubmitting(true);
    setCallbackError(null);
    try {
      const res = await fetch("/api/contact-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "callback", phone: callbackPhone, preferredTime: callbackTime }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save your request.");
      setCallbackSent(true);
      setCallbackPhone("");
      setCallbackTime("");
    } catch (err: any) {
      setCallbackError(err.message || "Could not save your request.");
    } finally {
      setCallbackSubmitting(false);
    }
  };

  const handleGateSuccess = (visitor: { id: string; email: string }, conversationId: string) => {
    setVisitorEmailState(visitor.email);
    setConvId(conversationId);
    setIsIdentified(true);
    setGateOpen(false);

    const question = pendingQuestion;
    setPendingQuestion(null);
    if (question) {
      requestAnswer(question);
    }
  };

  return (
    <div className={`flex flex-col h-full w-full max-w-3xl mx-auto px-2 sm:px-4 md:px-6 transition-all duration-500 ease-in-out ${messages.length === 0 ? 'justify-center' : 'justify-end'}`}>
      {/* Messages Scroll Area */}
      <div className={`flex-1 overflow-y-auto py-4 sm:py-6 space-y-4 sm:space-y-6 flex flex-col ${messages.length === 0 ? 'hidden' : 'flex'}`}>
        {messages.map((msg) => {
          const isAssistant = msg.sender === "assistant";
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAssistant ? "items-start" : "items-end"} animate-fade-in`}
            >
              {/* Message Header */}
              <div className="flex items-center space-x-2 mb-1.5 px-1">
                {isAssistant && (
                  <span className="relative flex h-4 w-4 shrink-0 items-center justify-center rounded-full overflow-hidden border border-[var(--border)] bg-[var(--card)] p-0.5">
                    <Image
                      src="/sorateq-logo-medium.png"
                      alt="Sora"
                      width={16}
                      height={16}
                      className="h-full w-full object-contain"
                    />
                  </span>
                )}
                <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                  {isAssistant ? "Sora" : visitorEmailState || "You"}
                </span>
                {isAssistant && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`rounded-2xl px-5 py-4 max-w-[90%] sm:max-w-[85%] text-sm leading-relaxed ${
                  isAssistant
                    ? "bg-[var(--accent)] text-[var(--foreground)]"
                    : "bg-[var(--foreground)] text-[var(--background)] font-medium"
                }`}
              >
                <div className="whitespace-pre-wrap">{renderWithProjectLinks(msg.content)}</div>

                {/* Renderable Rich Blocks */}
                {msg.blocks && msg.blocks.length > 0 && (
                  <div className="mt-4 space-y-4 pt-3 border-t border-[var(--border)]">
                    {msg.blocks.map((block, bIdx) => {
                      if (block.type === "project_card") {
                        return <ProjectCard key={bIdx} project={block.project} compact />;
                      }
                      if (block.type === "project_grid") {
                        return (
                          <div key={bIdx} className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                            {block.projects.map((p) => (
                              <ProjectCard key={p.id} project={p} compact />
                            ))}
                          </div>
                        );
                      }
                      if (block.type === "project_brief") {
                        return (
                          <div
                            key={bIdx}
                            className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <FileText className="w-4 h-4 text-emerald-500" />
                                <span className="text-xs font-medium uppercase text-[var(--foreground)]">
                                  Project Brief: {block.brief.projectName}
                                </span>
                              </div>
                              <button
                                onClick={() => openBrief(block.brief)}
                                className="text-xs font-medium text-emerald-500 hover:underline flex items-center"
                              >
                                View Full Brief <ArrowRight className="w-3 h-3 ml-1" />
                              </button>
                            </div>
                            <p className="text-xs text-[var(--muted-foreground)] line-clamp-2">
                              {block.brief.problem}
                            </p>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[var(--accent)] text-[var(--foreground)] border border-[var(--border)]">
                                {block.brief.timeline}
                              </span>
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[var(--accent)] text-[var(--foreground)] border border-[var(--border)]">
                                {block.brief.currentStage}
                              </span>
                            </div>
                          </div>
                        );
                      }
                      if (block.type === "contact_options") {
                        return (
                          <div
                            key={bIdx}
                            className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 space-y-3 shadow-sm"
                          >
                            <div className="text-xs font-semibold text-[var(--foreground)]">
                              How would you like to continue?
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <button
                                onClick={() => openMeeting(block.projectBrief)}
                                className="px-3 py-2 rounded-lg bg-[var(--foreground)] text-[var(--background)] text-xs font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
                              >
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Schedule a call</span>
                              </button>
                              <a
                                href={`mailto:ani@sorateq.com?subject=${encodeURIComponent(
                                  block.projectBrief ? `Project inquiry: ${block.projectBrief.projectName}` : "Project inquiry"
                                )}&body=${encodeURIComponent(
                                  `Hi Sorateq team,\n\nI'd like to discuss a project.\n\nContact email: ${visitorEmailState}`
                                )}`}
                                onClick={() => trackContact("email")}
                                className="px-3 py-2 rounded-lg border border-[var(--border)] text-[var(--foreground)] text-xs font-medium hover:border-[var(--foreground)] transition-colors flex items-center justify-center gap-1.5"
                              >
                                <Mail className="w-3.5 h-3.5" />
                                <span>Send an email</span>
                              </a>
                              <button
                                onClick={() => {
                                  setCallbackError(null);
                                  setCallbackSent(false);
                                  setIsCallbackOpen(true);
                                }}
                                className="px-3 py-2 rounded-lg border border-[var(--border)] text-[var(--foreground)] text-xs font-medium hover:border-[var(--foreground)] transition-colors flex items-center justify-center gap-1.5"
                              >
                                <PhoneCall className="w-3.5 h-3.5" />
                                <span>Request a callback</span>
                              </button>
                            </div>
                          </div>
                        );
                      }
                      if (block.type === "quick_replies") {
                        return (
                          <div key={bIdx} className="flex flex-wrap gap-2 pt-1">
                            {block.options.map((opt, oIdx) => (
                              <button
                                key={oIdx}
                                onClick={() => handleSendMessage(opt)}
                                className="text-xs font-medium px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:border-[var(--foreground)] transition-all text-left shadow-sm"
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center space-x-2.5 text-[var(--muted-foreground)] text-xs font-mono tracking-wide py-2.5 animate-fade-in pl-1">
            <div className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--foreground)] animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--foreground)] animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--foreground)] animate-bounce" />
            </div>
            <span className="text-[11px] opacity-70">sora is thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Centered Empty State & Input Container */}
      <div className={`w-full max-w-3xl mx-auto flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${messages.length === 0 ? 'pb-[10vh]' : 'pb-6'}`}>
        
        {messages.length === 0 && (
          <div className="text-center mb-6 sm:mb-10 animate-fade-in flex flex-col items-center px-2">
            <div className="mb-4 sm:mb-6 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl border border-[var(--accent-orange)]/40 bg-[var(--card)] p-2 shadow-sm shadow-[0_0_24px_rgba(255,90,31,0.15)] transition-transform duration-300 hover:scale-105 hover:border-[var(--accent-orange)]">
              <Image
                src="/sorateq-logo-medium.png"
                alt="Sorateq AI Assistant"
                width={56}
                height={56}
                className="h-full w-full object-contain"
                priority
              />
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif text-[var(--foreground)] tracking-tight mb-2 sm:mb-3">
              What services are you looking for?
            </h1>
            <p className="text-[var(--muted-foreground)] text-xs sm:text-sm font-light">
              Describe your idea, architecture, or project.
            </p>
          </div>
        )}

        <div className="w-full flex flex-col items-center gap-4">
          <div className="w-full relative group">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative flex items-center w-full rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-3 shadow-lg focus-within:ring-2 focus-within:ring-[var(--accent-orange)]/30 focus-within:border-[var(--accent-orange)]/60 transition-all"
            >
              <button 
                type="button" 
                className="p-2 rounded-full text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors mr-2 flex-shrink-0"
                title="Add context"
              >
                <Plus className="w-5 h-5" />
              </button>
              
              <textarea
                ref={textareaRef}
                rows={1}
                value={inputValue}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                disabled={loading}
                className="flex-1 max-h-32 min-h-[26px] resize-none bg-transparent py-1.5 text-base text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none"
              />

              <div className="flex items-center space-x-2 ml-2 shrink-0">
                <button
                  type="submit"
                  disabled={!inputValue.trim() || loading}
                  aria-label="Send message"
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                    inputValue.trim() && !loading
                      ? 'bg-[var(--accent-orange)] text-white hover:bg-[#e04f1a] shadow-md shadow-[0_2px_12px_rgba(255,90,31,0.3)]'
                      : 'bg-[var(--foreground)] text-[var(--background)] opacity-20 cursor-not-allowed'
                  }`}
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CornerDownLeft className="w-5 h-5" />}
                </button>
              </div>
            </form>
          </div>

          {/* Suggestive Questions below search bar */}
          {messages.length === 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 animate-fade-in opacity-80">
              {[
                "I want to build a website for my business",
                "I want to automate something",
                "I want to build a SaaS MVP"
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSendMessage(suggestion)}
                  disabled={loading}
                  className="px-3 py-1.5 text-xs font-medium rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--accent-orange)] hover:border-[var(--accent-orange)]/50 hover:bg-[var(--accent-orange)]/5 transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Brief Viewer Modal */}
      {activeBrief && (
        <ProjectBriefModal
          brief={activeBrief}
          isOpen={isBriefOpen}
          onClose={() => setIsBriefOpen(false)}
          onBookMeeting={() => openMeeting(activeBrief)}
        />
      )}

      {/* Meeting Scheduler Modal */}
      <MeetingSchedulerModal
        isOpen={isMeetingOpen}
        onClose={() => setIsMeetingOpen(false)}
        defaultEmail={visitorEmailState}
        conversationId={convId}
        projectBrief={meetingBriefData}
      />

      {/* Callback request dialog */}
      {isCallbackOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background)]/80 backdrop-blur-sm px-4 animate-fade-in">
          <div className="bg-[var(--card)] border border-[var(--border)] p-6 rounded-2xl w-full max-w-sm shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">Callback</p>
              <button
                type="button"
                onClick={() => setIsCallbackOpen(false)}
                className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                Close
              </button>
            </div>
            {callbackSent ? (
              <>
                <h3 className="text-base font-medium text-[var(--foreground)] mb-1">Request received</h3>
                <p className="text-xs text-[var(--muted-foreground)] mb-5">
                  The Sorateq team will call you at the number you shared.
                </p>
              </>
            ) : (
              <form onSubmit={submitCallback} className="space-y-3">
                <h3 className="text-base font-medium text-[var(--foreground)]">Where should we call you?</h3>
                <input
                  type="tel"
                  required
                  autoFocus
                  placeholder="+1 555 000 0000"
                  value={callbackPhone}
                  onChange={(e) => setCallbackPhone(e.target.value)}
                  className="w-full bg-transparent border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--foreground)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
                />
                <input
                  type="text"
                  placeholder="Best time (optional)"
                  value={callbackTime}
                  onChange={(e) => setCallbackTime(e.target.value)}
                  className="w-full bg-transparent border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--foreground)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
                />
                {callbackError && <p className="text-xs text-red-500">{callbackError}</p>}
                <button
                  type="submit"
                  disabled={callbackSubmitting}
                  className="w-full bg-[var(--foreground)] text-[var(--background)] py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {callbackSubmitting ? "Sending..." : "Request callback"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Email gate: shown before the first answer for unidentified visitors */}
      {gateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background)]/80 backdrop-blur-sm px-4 animate-fade-in">
          <div className="bg-[var(--card)] border border-[var(--border)] p-6 rounded-2xl w-full max-w-sm shadow-xl">
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)] mb-3">One quick step</p>
            <h3 className="text-base font-medium text-[var(--foreground)] mb-1">Enter your email to get Sora&apos;s answer</h3>
            {pendingQuestion && (
              <p className="text-xs text-[var(--foreground)] italic mb-2 line-clamp-2">&ldquo;{pendingQuestion}&rdquo;</p>
            )}
            <p className="text-xs text-[var(--muted-foreground)] mb-5">
              So our team can follow up and pick this conversation up later.
            </p>
            <EmailGate initialEmail={visitorEmailState} onSuccess={handleGateSuccess} />
          </div>
        </div>
      )}
    </div>
  );
}
