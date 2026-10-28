# Ziki Issues Redesign — React Application

**Target Product:** [Ziki](https://ziki.dev)  
**Target Page:** Issues (`/issues`)  
**Architecture:** React 19 + TypeScript + Vite + Tailwind CSS  
**Focus:** Human–Agent Interaction UX Improvement (HNG15 Week 5 Task 1)

---

## Overview

This project is a modern, modular React implementation of the **Ziki Issues** redesigned interface (`ziki.dev/issues`). It implements the complete **Human-to-Agent Issue Reporting and Work Delegation** UX system for HNG15 Week 5 Task 1, paired with the exact Ziki header from production and an accessible light/dark theme switch.

---

## Key Capabilities & UX Architecture

### 1. Header Preservation & Light/Dark Theme Switch
- **Header Fidelity:** Faithfully matches the exact production Ziki header layout from `ziki.dev/issues`:
  - Electric blue custom geometric `Z` glyph and lowercase `ziki` logotype.
  - Organization switcher dropdown (`Ziki ⌵` / `HNG Labs`).
  - Space navigation tabs: active `⊙ Product` pill, `🔊 Marketing`, and `🛡️ Security`.
  - Fleet launcher pill: `🤖 Agents ⌵`.
  - User profile pill with monochrome hijab portrait avatar for `Maryam Gana Mohamm... ⌵`.
  - Reputation points badge: `🏆 4720 pts`.
  - Notification bell with blue `9` badge indicator.
- **Header Constraint:** Preserves every element, dimension, positioning, font, and control from production.
- **Light/Dark Mode Toggle:** The only addition to the header is a compact, keyboard-accessible theme toggle button (Sun/Moon icon).
- **Default Theme:** **Light mode is the default on first visit**, rendering the entire page on a pure white background (`#ffffff`), with instant class switching and `localStorage` persistence.

### 2. Human-to-Agent Issue Reporting & Work Delegation Flow
- **Stage A — Human Reports the Problem:**
  - Structured reporting wizard capturing issue title, problem description, expected vs. actual behavior, reproduction steps, platform, and priority.
- **Stage B — Human Delegates the Work:**
  - Clear delegation scope selector:
    - *Investigate & Diagnose*
    - *Propose a Solution*
    - *Implement a Fix*
    - *Review Existing Implementation*
  - Explicit assignment to `Contributor Alpha` with option to create as an unassigned issue.
- **Stage C — Agent Analyses & Plans:**
  - Structured 6-step roadmap clearly marked as a simulated workflow prototype.
- **Stage D — Agent Requests Human Input Only When Needed:**
  - Displays context, ambiguity rationale, and selectable options with trade-off consequences.
  - Interactive decision submission unblocks the agent and updates execution status.
- **Stage E — Agent Executes the Task:**
  - Live state tracking (`Queued`, `Analysing`, `Needs your input`, `Agent Working`, `In Review`, `Completed`).
  - Interactive step advancement simulating agent progress.
- **Stage F — Human Reviews Outcome & Signs Off:**
  - Pull request review tab with visual code diff, file touch list, and test coverage evidence.
  - Approve & close or request changes.

---

## Development & Verification

```bash
# Run development server
npm run dev

# Run type checker
npm run lint

# Compile production build
npm run build
```
