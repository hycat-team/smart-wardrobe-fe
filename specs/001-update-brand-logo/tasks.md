# Tasks: Update Brand Logo Assets and Display

**Feature**: Update Brand Logo Assets and Display  
**Branch**: `001-update-brand-logo`  
**Date**: 2026-09-24  
**Specification**: [specs/001-update-brand-logo/spec.md](./spec.md)  
**Implementation Plan**: [specs/001-update-brand-logo/plan.md](./plan.md)  

---

## Phase 1: Setup (Asset Ingestion & Structure)

**Purpose**: Ingest master assets from source directory and organize platform brand storage.

- [X] T001 Create directory `public/brand/` for platform visual identity assets
- [X] T002 [P] Copy master logo files (`logo-full.png`, `logo-only.png`, `logo-text.png`) from `C:\FPT\Project\smart-wardrobe\logo\` to `public/brand/`
- [X] T003 [P] Verify asset integrity and dimensions (1254x1254px 1:1 square PNGs) under `public/brand/`

---

## Phase 2: Foundational (Core Icon & App Metadata)

**Purpose**: Core application branding infrastructure that MUST be in place before UI surfaces reference new assets.

- [X] T004 Generate crisp favicon asset `public/favicon.ico` from `public/brand/logo-only.png`
- [X] T005 [P] Verify root application metadata and icon definitions in `src/app/layout.tsx`

**Checkpoint**: Foundation ready — brand assets and browser favicon are verified in static storage.

---

## Phase 3: User Story 1 - Brand Identity Experience Across Main Navigation & Header (Priority: P1) 🎯 MVP

**Goal**: Deliver a sharp, cohesive brand logo presentation across the primary public and authenticated navigation surfaces (Guest Header and Main App Sidebar).

**Independent Test**: Navigate to the landing page and app dashboard; verify the new logo renders smoothly without layout shift in normal, scrolled, expanded, and collapsed sidebar states.

### Implementation for User Story 1

- [X] T006 [P] [US1] Update desktop navigation logo in `src/components/layout/guest-header.tsx` to render `/brand/logo-only.png` with smooth scrolling transition, explicit dimensions to prevent CLS, and alt text
- [X] T007 [P] [US1] Update mobile drawer menu logo in `src/components/layout/guest-header.tsx` to replace `/favicon.ico` with `/brand/logo-only.png`
- [X] T008 [P] [US1] Update Shopper Sidebar in `src/components/layout/sidebar.tsx` for both expanded state (brand emblem + editorial typography) and collapsed state (centered 36x36px `/brand/logo-only.png`)
- [X] T009 [US1] Verify navigation link behaviors in `src/components/layout/guest-header.tsx` and `src/components/layout/sidebar.tsx` to ensure clicking the logo smoothly routes to `/`

**Checkpoint**: User Story 1 is fully functional and independently testable — primary visitor and shopper touchpoints display the new branding.

---

## Phase 4: User Story 2 - Consistent Brand Presence in Browser Tabs and App Metadata (Priority: P2)

**Goal**: Guarantee user browser tabs, bookmarks, and mobile home screen shortcuts display the new Closy emblem cleanly across all pages.

**Independent Test**: Open various pages in browser tabs; verify that the tab icon displays the new Closy emblem cleanly without pixelation or outdated icons.

### Implementation for User Story 2

- [X] T010 [P] [US2] Configure web app icon and favicon metadata in `src/app/layout.tsx` using `/brand/logo-only.png`
- [X] T011 [US2] Verify browser tab favicon rendering and cache behavior across public and authenticated routes

**Checkpoint**: User Stories 1 and 2 operate cohesively with unified brand identity from browser tab to in-app navigation.

---

## Phase 5: User Story 3 - Administrative and Authentication Screen Brand Cohesion (Priority: P3)

**Goal**: Align sub-portals, mobile topbars, and authentication checkpoints with the updated brand identity.

**Independent Test**: Navigate to `/auth/login`, `/auth/register`, mobile viewport, and `/admin/dashboard` to verify consistent brand visuals.

### Implementation for User Story 3

- [X] T012 [P] [US3] Update Shopper Mobile Topbar in `src/components/layout/topbar.tsx` to replace legacy text "SW" with `/brand/logo-only.png` (32x32px)
- [X] T013 [P] [US3] Update Admin Portal Sidebar in `src/features/admin/components/AdminSidebar.tsx` to display `/brand/logo-only.png` emblem beside "Closy." typography
- [X] T014 [P] [US3] Update Authentication Layout banner in `src/app/(guest)/auth/layout.tsx` to display the new brand emblem

**Checkpoint**: All user stories (US1, US2, US3) are completed, establishing end-to-end visual cohesion across all application areas.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Quality assurance, build verification, and cleanup.

- [X] T015 [P] Audit and remove any lingering legacy placeholder logo references in `src/`
- [X] T016 Run TypeScript typecheck (`npx tsc --noEmit`) and ESLint to ensure zero compilation warnings or errors
- [X] T017 Execute Next.js production build (`npm run build`) and validate against scenarios in `specs/001-update-brand-logo/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1 completion — blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion — delivers core MVP.
- **User Story 2 (Phase 4)**: Depends on Phase 2 completion — can run in parallel with or after US1.
- **User Story 3 (Phase 5)**: Depends on Phase 2 completion — can run in parallel with or after US1.
- **Polish (Phase 6)**: Depends on completion of all desired user stories.

### User Story Dependencies

- **User Story 1 (P1)**: Independent of US2 and US3.
- **User Story 2 (P2)**: Independent of US1 and US3.
- **User Story 3 (P3)**: Independent of US1 and US2.

### Parallel Opportunities

- In Phase 1: `T002` and `T003` can execute in parallel once `T001` creates the directory.
- In Phase 2: `T005` can run alongside `T004`.
- In Phase 3: `T006`, `T007`, `T008` can execute in parallel (touching separate component files or independent sections).
- In Phase 5: `T012`, `T013`, `T014` can execute in parallel (touching separate files: `topbar.tsx`, `AdminSidebar.tsx`, `auth/layout.tsx`).

---

## Parallel Example: User Story 1

```bash
# Launch implementation tasks for User Story 1 together:
Task: "Update desktop navigation logo in src/components/layout/guest-header.tsx"
Task: "Update mobile drawer menu logo in src/components/layout/guest-header.tsx"
Task: "Update Shopper Sidebar in src/components/layout/sidebar.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (`T001` - `T003`).
2. Complete Phase 2: Foundational (`T004` - `T005`).
3. Complete Phase 3: User Story 1 (`T006` - `T009`).
4. **STOP and VALIDATE**: Test User Story 1 independently on desktop and mobile viewports.
5. Deploy/demo if ready.

### Incremental Delivery

1. Setup + Foundational -> Foundation ready.
2. User Story 1 -> Main Navigation & Header updated -> MVP achieved.
3. User Story 2 -> Browser Tab & Metadata refreshed.
4. User Story 3 -> Mobile Topbar, Admin Portal & Auth screens aligned.
5. Polish & Verification -> Production build confirmed clean.
