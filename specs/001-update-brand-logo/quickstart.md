# Quickstart & Verification Guide: Brand Logo Assets & Display

**Feature**: Update Brand Logo Assets and Display  
**Branch**: `001-update-brand-logo`  
**Date**: 2026-09-24  

---

## Prerequisites

1. Source assets present at `C:\FPT\Project\smart-wardrobe\logo`:
   - `logo-full.png`
   - `logo-only.png`
   - `logo-text.png`
2. Node.js environment installed (v18+ or v20+).
3. Project dependencies installed (`npm install`).

---

## Verification Scenarios

### Scenario 1: Asset Ingestion & Directory Check
Run a quick file verification to ensure all 3 brand assets and updated favicon are present in `public/brand/` and `public/`:
```bash
powershell -Command "Test-Path public/brand/logo-full.png, public/brand/logo-only.png, public/brand/logo-text.png, public/favicon.ico"
```
**Expected Outcome**: All paths return `True`.

---

### Scenario 2: Development Server & Visual Inspection
Start the local Next.js dev server:
```bash
npm run dev
```
Open a browser and navigate to:
1. `http://localhost:3000/`:
   - Check Guest Header: Verify the logo emblem displays smoothly in both unscrolled and scrolled states.
   - Check Browser Tab: Verify the tab favicon displays the new Closy emblem icon.
2. `http://localhost:3000/auth/login`:
   - Check Authentication Card/Banner: Verify the new brand identity appears cleanly.
3. `http://localhost:3000/wardrobe` (or any authenticated route):
   - Check Sidebar: Confirm the expanded sidebar displays the new brand identity.
   - Click the sidebar collapse toggle: Confirm the collapsed state shows the centered emblem icon cleanly.
4. Mobile Viewport (simulate mobile screen in DevTools, width <= 768px):
   - Check Mobile Topbar: Confirm legacy "SW" text is replaced by the brand emblem.

---

### Scenario 3: Build & Lint Integrity
Execute the production build to ensure TypeScript compilation, linting, and Next.js asset bundling succeed with zero errors:
```bash
npm run build
```
**Expected Outcome**: Build finishes with exit code `0` and static optimization passes.
