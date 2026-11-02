"use client";

import React, { useState, useEffect, useCallback } from "react";
import { SoraChat } from "@/components/SoraChat";

type Visitor = { id: string; email: string };

export default function SoraPage() {
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      if (data.authenticated && data.visitor) {
        setVisitor(data.visitor);
        if (data.conversation?.id) {
          setConversationId(data.conversation.id);
        }
      }
    } catch {
      // Guest state
    } finally {
      setSessionChecked(true);
    }
  }, []);

  useEffect(() => {
    // Syncs the visitor session from the server on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkSession();
  }, [checkSession]);

  return (
    <main className="relative flex min-h-[calc(100dvh-4rem)] md:min-h-screen w-full flex-col overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center p-2 sm:p-4 md:p-6">
        {sessionChecked && (
          <SoraChat
            key={visitor?.email || "guest"}
            conversationId={conversationId || undefined}
            visitorEmail={visitor?.email || ""}
          />
        )}
      </div>
    </main>
  );
}
