# Research & Technical Decisions: Update Brand Logo Assets and Display

**Feature**: Update Brand Logo Assets and Display  
**Branch**: `001-update-brand-logo`  
**Date**: 2026-09-24  

---

## 1. Asset Storage Strategy & Structure

### Decision
Store the master brand assets under `public/brand/` as:
- `public/brand/logo-full.png` (Emblem + Wordmark, 1254x1254 source)
- `public/brand/logo-only.png` (Emblem only, 1254x1254 source)
- `public/brand/logo-text.png` (Wordmark only, 1254x1254 source)

In addition, derive or update browser favicon and app icon representations:
- `public/favicon.ico`: updated to use the crisp `logo-only` emblem.
- Optional web app icon `src/app/icon.png`: standard Next.js 15 metadata icon endpoint.

### Rationale
- `public/brand/` cleanly segregates platform-level brand identity from uploaded tenant/merchant brand assets (which reside in cloud storage / `brand-portal`).
- Keeping standard filenames in `public/` guarantees zero-overhead direct static serving via Next.js and CDN caching with immutable cache headers.
- Direct Next.js Image component (`next/image`) can easily reference `/brand/logo-only.png`, `/brand/logo-full.png`, etc., enabling automatic image optimization, layout shift prevention, and modern format delivery (WebP/AVIF).

### Alternatives Considered
- **Root `public/` placement** (`public/logo-full.png`): Rejected because root `public/` already contains mixed assets (`file.svg`, `globe.svg`, `footer.png`). Grouping under `public/brand/` maintains project hygiene.
- **Inlining SVG**: The user provided high-resolution PNG source files (1254x1254px). Inlining raster images as base64 in SVGs inflates bundle sizes unnecessarily. Direct optimized static PNGs are superior.

---

## 2. Component Rendering Strategy (Next.js `<Image>` vs `<img>`)

### Decision
Use Next.js `<Image>` from `next/image` for key static surfaces (Sidebar, Guest Header, Auth layout) with explicit width, height, and layout priority (`priority={true}`) for above-the-fold elements.

### Rationale
- Above-the-fold brand images are critical for Cumulative Layout Shift (CLS). Providing intrinsic aspect ratio and dimensions via `next/image` guarantees zero layout shift.
- Next.js handles downscaling from 1254x1254 to client display dimensions (e.g. 32x32, 48x48, 120x40), reducing network payload from ~900KB to <20KB per request.
- `priority` flag ensures Next.js injects `<link rel="preload">` in the document head for the primary logo.

### Alternatives Considered
- **Raw `<img>` tags**: Currently used in `sidebar.tsx` (`<img src="/favicon.ico" width={50} height={50}>`) and `guest-header.tsx`. While lightweight, raw `<img>` without preloading causes minor flash/flicker and does not automatically optimize high-resolution PNGs for mobile viewports.

---

## 3. UI Surface Mapping & Responsive Variants

### Decision
Map the 3 brand asset variations to user interface contexts as follows:

| Placement Surface | Component File | Variant Used | Display Rules |
| :--- | :--- | :--- | :--- |
| **Guest Header** | `src/components/layout/guest-header.tsx` | `logo-only.png` + Typography or `logo-full.png` | In transparent & sticky states, render `logo-only.png` (40x40px / 32x32px) alongside modern "CLOSY" text. |
| **Shopper Sidebar (Expanded)** | `src/components/layout/sidebar.tsx` | `logo-only.png` + "Closy." or `logo-full.png` | Seamless brand header with logo emblem and editorial typography. |
| **Shopper Sidebar (Collapsed)** | `src/components/layout/sidebar.tsx` | `logo-only.png` | 36x36px centered emblem icon replacing `/favicon.ico`. |
| **Mobile Topbar** | `src/components/layout/topbar.tsx` | `logo-only.png` | Replace legacy text "SW" with compact 28x28px brand emblem link. |
| **Auth Layout** | `src/app/(guest)/auth/layout.tsx` | `logo-only.png` / `logo-full.png` | Elegant brand header above login and registration cards. |
| **Admin Sidebar** | `src/features/admin/components/AdminSidebar.tsx` | `logo-only.png` | Brand emblem paired with "Closy." and "System Admin" badge. |
| **Browser Favicon** | `public/favicon.ico` & metadata | `logo-only.png` | Crisp favicon in browser tabs and bookmark bars. |

### Rationale
- `logo-only.png` provides maximum readability at small dimensions (16px to 48px) because complex typography becomes illegible when scaled down.
- Expanding sidebars and desktop headers have sufficient horizontal space to display the brand emblem together with clean typography or `logo-full.png`.

### Alternatives Considered
- **Using `logo-full.png` everywhere**: In small contexts (mobile topbar, collapsed sidebar, favicon), the text portion of `logo-full` shrinks into unreadable blur.
- **Using `logo-text.png` in collapsed sidebar**: A wordmark cannot fit in an 80px-wide collapsed sidebar.

---

## 4. Theme & Background Adaptability

### Decision
Verify that the logo assets render clearly across light and dark theme surfaces. If the provided PNG has a dark or light background that requires neutral rendering, ensure proper CSS container styling (or transparent background handling) to prevent jarring background boxes.

### Rationale
The smart wardrobe application supports light/dark themes (`theme-controller.tsx`) and dynamic header states (transparent over dark hero image vs frosted white/dark sticky navbar).

---

## 5. Summary of Technical Approach
1. Copy source files from `C:\FPT\Project\smart-wardrobe\logo\` to `smart-wardrobe-fe/public/brand/`.
2. Generate/update `public/favicon.ico` using `logo-only.png`.
3. Update `guest-header.tsx`, `sidebar.tsx`, `topbar.tsx`, `auth/layout.tsx`, and `AdminSidebar.tsx` to reference the new assets.
4. Verify responsive layout, zero CLS, and Next.js build compilation (`npm run build`).
