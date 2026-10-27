# Ziki Issues Page — HNG15 Week 5 Task 1: Human–Agent Interaction UX Improvement

**Target Page:**
**Product:** Ziki (ziki.dev)
**Page:** Issues — https://ziki.dev/issues
**Status:** Frontend prototype (original source code not available)
---
## A. Problem Statement
Before the change, the Issues page at ziki.dev/issues had three directly observed human–agent interaction problems:
1. **Contradictory empty state.** The page displays *"Nothing here right now. No agent is waiting on an answer."* while the "New ideas" tab shows a count of **2**.
2. **Opaque agent status.** The agent card ("Contributor Alpha") shows only *"Offline"* with no explanation of what to do next.
3. **No clear "what needs my attention" section.** The "Need your input" tab shows 0 with no consolidated view of pending items.
---
## B. Design Decision
The most important interaction to improve is helping the user understand what the agent is doing, what needs attention, and what to do next — at a glance.
This addresses all three observed problems in one cohesive section because they are fundamentally the same issue: the user cannot answer "What is happening?", "What needs my attention?", or "What should I do next?"
---
## C. Before-and-After Comparison
| Area | Before | After |
|------|--------|-------|
| Agent status | "Offline" — no context, no action | Clear indicator + plain-language status + "Activate agent" button |
| Attention | "Need your input" shows 0; no consolidated view | Consolidated section with counts, titles, descriptions, action buttons |
| Empty state | Contradicts "New ideas: 2" | Dynamic — consistent with tab counts and agent state |
| Next action | None obvious | Obvious primary button or clear attention items |
---
## D. User Journey
**Step 1 — Arrive.** User lands on ziki.dev/issues. The new "Agent status & your attention" section appears at the top of the content area.
**Step 2 — Understand.** Agent status row shows a visual indicator (○ grey offline / ● blue working), plain-language text, and supporting detail.
**Step 3 — See attention.** Attention tabs show counts per category. Clicking reveals item cards with title, count, description, and action buttons.
**Step 4 — Act.** "Activate agent" button when offline. Primary action buttons on attention items when items exist. Toast confirms each action.
**Step 5 — Outcome.** Status changes to "Agent is working" with progress. Item counts decrement on resolution.
---
## E. Validation
| Test | Result |
|------|--------|
| Agent offline → "Activate agent" visible | Passed |
| Click "Activate agent" → status changes to working | Passed |
| Empty state consistent with tab counts | Passed |
| Keyboard navigation: Tab reaches all elements | Passed |
| Visible focus rings on all buttons | Passed |
| Responsive on mobile | Passed |
| Colour is supporting signal (icons + text) | Passed |
Not tested: real API integration, live data, persistent state, screen reader testing.
---
## F. Limitations
1. Frontend prototype only — original Ziki source code was not available.
2. Simulated agent behavior — no real API calls made.
3. Static demo data — counts are hardcoded, not live.
4. No backend integration — does not connect to ziki.dev API endpoints.
5. No production deployment performed.
---
## G. Deployment
Not performed. The prototype is a local HTML file. To deploy, copy `issues-prototype.html` to a static hosting platform and verify interactions.
---
## How to View the Prototype
1. Open `issues-prototype.html` in any modern web browser
2. Click "Activate agent" to see the agent working state
3. Click attention tabs to see different categories
4. Click action buttons to see count updates and toasts
---
*Built for HNG15 Week 5 — Task 1: Human–Agent Interaction UX Improvement*
*Product: Ziki | Page: Issues (ziki.dev/issues)*
