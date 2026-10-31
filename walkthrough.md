# Sorateq Website + Sora AI Operating Layer — Implementation Walkthrough

The Sorateq AI-native company website and Sora conversational operating layer have been implemented according to the [master_instructions.md](file:///d:/Sorateq%202026/website3/master_instructions.md) specification.

---

## 1. Architecture Overview

```
                        ┌─────────────────────────────────────────┐
                        │      SORATEQ APPLICATION (Next.js)      │
                        ├───────────────────┬─────────────────────┤
                        │    PUBLIC PAGES   │      SORA LAYER     │
                        │  /                │  - Email Gate       │
                        │  /about           │  - State Machine    │
                        │  /projects        │  - Hybrid Search    │
                        │  /projects/[slug] │  - Progressive Extr │
                        │  /web-experiences │  - Brief Generator  │
                        │  /capabilities    │  - Meeting Widget   │
                        │  /how-we-work     │  - Rich Chat Blocks │
                        │  /technology      │                     │
                        │  /contact         │                     │
                        └─────────┬─────────┴──────────┬──────────┘
                                  │                    │
                    ┌─────────────┴────────────────────┴─────────────┐
                    │               API & STORAGE LAYER              │
                    ├────────────────────────────────────────────────┤
                    │  - /api/auth/visitor (Email validation)        │
                    │  - /api/auth/session (Visitor session state)   │
                    │  - /api/sora/chat (Conversational engine)      │
                    │  - /api/sora/brief (PRD Brief generation)      │
                    │  - /api/meetings (Slot booking & discovery)    │
                    │  - /api/projects (Portfolio search)            │
                    │  - /api/admin/* (Secured management API)       │
                    │  - In-Memory & File-Backed Persistent Store    │
                    └────────────────────────────────────────────────┘
```

---

## 2. Key Modules Implemented

### 1. Data Models & Store (`src/lib/`)
* **[types.ts](file:///d:/Sorateq%202026/website3/src/lib/types.ts)**: Type definitions for Visitors, Sessions, Conversations, Messages, Project Profiles, Project Records, Knowledge Documents, Capabilities, FAQs, Methodology, Meeting Requests, Prompt Versions, and Analytics.
* **[store.ts](file:///d:/Sorateq%202026/website3/src/lib/store.ts)**: Persistent data store pre-seeded with 8 rich case studies (Kairo AI, ApexMetrics, Synthetix Cloud, NexusDesk, Veritas Health, Aura Design System, Chronicle, VoltStream), 8 capabilities, 6 methodology steps, FAQs, prompt versions, and CRUD operations.
* **[email-validator.ts](file:///d:/Sorateq%202026/website3/src/lib/email-validator.ts)**: Structural client-side & server-side email validation with domain, RFC regex, and disposable-domain protection.
* **[session.ts](file:///d:/Sorateq%202026/website3/src/lib/session.ts)**: HTTP-only visitor session management.

### 2. Sora AI Operating Engine (`src/lib/sora/`)
* **[intent.ts](file:///d:/Sorateq%202026/website3/src/lib/sora/intent.ts)**: Intent classification (company, portfolio, project_inquiry, technology, methodology, pricing, timeline, capabilities, meeting, contact, off-topic, and prompt-injection defense).
* **[state-machine.ts](file:///d:/Sorateq%202026/website3/src/lib/sora/state-machine.ts)**: Conversation lifecycle transitions (`NEW` → `INTRODUCTION` → `PROJECT_DISCOVERY` → `PROJECT_DEFINITION` → `QUALIFICATION` → `PROJECT_PLANNING` → `MEETING_INTENT` → `BOOKING`).
* **[lead-scorer.ts](file:///d:/Sorateq%202026/website3/src/lib/sora/lead-scorer.ts)**: Deterministic lead qualification scoring (0 to 100) based on project clarity, budget, timeline, and meeting intent.
* **[brief-generator.ts](file:///d:/Sorateq%202026/website3/src/lib/sora/brief-generator.ts)**: Automatically structures project context into a clear Project Brief (problem, MVP features, potential architecture, timeline, open questions).
* **[engine.ts](file:///d:/Sorateq%202026/website3/src/lib/sora/engine.ts)**: Core processing loop combining hybrid knowledge search, prompt layering, progressive extraction, rich block generation (`project_card`, `project_grid`, `project_brief`, `meeting_cta`, `quick_replies`), model cost tracking, and analytics.

### 3. Design System & UI Components (`src/components/`)
* **[EmailGate.tsx](file:///d:/Sorateq%202026/website3/src/components/EmailGate.tsx)**: Phase A right-hand email input with live client feedback and instant Sora transition.
* **[SoraChat.tsx](file:///d:/Sorateq%202026/website3/src/components/SoraChat.tsx)**: Editorial dark chat workspace with quick prompt suggestions, typewriter streaming, interactive project cards, brief modal triggers, and discovery scheduling widgets.
* **[ProjectCard.tsx](file:///d:/Sorateq%202026/website3/src/components/ProjectCard.tsx)**: Interactive card with metrics, technology tags, and case study links.
* **[ProjectBriefModal.tsx](file:///d:/Sorateq%202026/website3/src/components/ProjectBriefModal.tsx)**: Full modal viewer for the generated PRD brief with clipboard copy and scheduling actions.
* **[MeetingSchedulerModal.tsx](file:///d:/Sorateq%202026/website3/src/components/MeetingSchedulerModal.tsx)**: Interactive calendar slot picker for 25-minute technical discovery calls.
* **[Navigation.tsx](file:///d:/Sorateq%202026/website3/src/components/Navigation.tsx)**: Minimal persistent overlay navigation menu.
* **[Header.tsx](file:///d:/Sorateq%202026/website3/src/components/Header.tsx)** & **[Footer.tsx](file:///d:/Sorateq%202026/website3/src/components/Footer.tsx)**: Top bar with Sorateq wordmark and status indicators, plus editorial footer.

### 4. Pages & Routes (`src/app/`)
* **[page.tsx](file:///d:/Sorateq%202026/website3/src/app/page.tsx)**: Homepage with Phase A (65% positioning + 35% email gate) transitioning seamlessly into Phase B Sora workstation.
* **[sora/page.tsx](file:///d:/Sorateq%202026/website3/src/app/sora/page.tsx)**: Dedicated Sora conversational operating layer.
* **[about/page.tsx](file:///d:/Sorateq%202026/website3/src/app/about/page.tsx)**: Studio manifesto, comparison against traditional agencies, core engineering principles.
* **[projects/page.tsx](file:///d:/Sorateq%202026/website3/src/app/projects/page.tsx)**: Portfolio showcase with category filtering and instant search.
* **[projects/[slug]/page.tsx](file:///d:/Sorateq%202026/website3/src/app/projects/%5Bslug%5D/page.tsx)**: Individual case study page with challenge, solution, stack, and metrics.
* **[web-experiences/page.tsx](file:///d:/Sorateq%202026/website3/src/app/web-experiences/page.tsx)**: Showcase of digital craft, headless design tokens, and edge performance.
* **[capabilities/page.tsx](file:///d:/Sorateq%202026/website3/src/app/capabilities/page.tsx)**: Deep-dive into technical capabilities (AI engineering, SaaS, mobile, cloud).
* **[how-we-work/page.tsx](file:///d:/Sorateq%202026/website3/src/app/how-we-work/page.tsx)**: 6-phase lean execution methodology timeline.
* **[technology/page.tsx](file:///d:/Sorateq%202026/website3/src/app/technology/page.tsx)**: Production technology stack and architectural philosophy.
* **[contact/page.tsx](file:///d:/Sorateq%202026/website3/src/app/contact/page.tsx)**: Direct lines, timezone info, and scheduling.
* **[admin/page.tsx](file:///d:/Sorateq%202026/website3/src/app/admin/page.tsx)**: Authenticated dashboard with funnel metrics and token accounting.
* **[admin/conversations/page.tsx](file:///d:/Sorateq%202026/website3/src/app/admin/conversations/page.tsx)**: Full conversation inspector and profile transcript viewer.
* **[admin/leads/page.tsx](file:///d:/Sorateq%202026/website3/src/app/admin/leads/page.tsx)**: Leads CRM table with qualification scoring.
* **[admin/projects/page.tsx](file:///d:/Sorateq%202026/website3/src/app/admin/projects/page.tsx)**: Case studies CRUD manager.
* **[admin/knowledge/page.tsx](file:///d:/Sorateq%202026/website3/src/app/admin/knowledge/page.tsx)**: Knowledge base documents editor with retrieval test simulator.
* **[admin/faqs/page.tsx](file:///d:/Sorateq%202026/website3/src/app/admin/faqs/page.tsx)**: FAQ CRUD manager.
* **[admin/prompts/page.tsx](file:///d:/Sorateq%202026/website3/src/app/admin/prompts/page.tsx)**: Sora system prompt versioning and model routing settings.
* **[admin/analytics/page.tsx](file:///d:/Sorateq%202026/website3/src/app/admin/analytics/page.tsx)**: Funnel analytics and model cost tracking.
