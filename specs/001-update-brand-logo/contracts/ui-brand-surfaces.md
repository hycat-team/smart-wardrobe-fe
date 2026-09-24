# UI Contract: Brand Logo Surfaces & Component Integration

**Feature**: Update Brand Logo Assets and Display  
**Branch**: `001-update-brand-logo`  
**Date**: 2026-09-24  

---

## 1. Scope of UI Contracts
This contract defines the integration specifications for all application components displaying the brand logo, ensuring uniform styling, zero layout shifts, and accessibility compliance.

---

## 2. Component Integration Contracts

### Contract 1: Guest Navigation Header (`guest-header.tsx`)

- **Component Path**: `src/components/layout/guest-header.tsx`
- **Target Element**: Header logo anchor (`<Link href="/">`)
- **Asset**: `/brand/logo-only.png` (or `/brand/logo-full.png`)
- **Visual Spec**:
  - Unscrolled State: Icon height `h-10 w-10 md:h-12 md:w-12`, paired with font styling `text-4xl md:text-5xl text-[#1A1A1A] font-semibold tracking-[-0.03em] CLOSY`.
  - Scrolled State: Icon height `h-7 w-7 md:h-8 md:w-8`, paired with `text-2xl text-white font-semibold CLOSY`.
  - Transition: `transition-all duration-500`.
- **Accessibility**: `alt="Closy - Smart Wardrobe Logo"`.

---

### Contract 2: Authenticated Shopper Sidebar (`sidebar.tsx`)

- **Component Path**: `src/components/layout/sidebar.tsx`
- **Target Element**: Editorial Logo header section
- **Asset**: `/brand/logo-only.png`
- **Visual Spec**:
  - Expanded State:
    - Display logo emblem (e.g. 36x36px or 40x40px) accompanied by `"Closy."` typography.
    - Preserves `"Tủ đồ thông minh"` subtitle badge and Sparkles icon.
  - Collapsed State:
    - Display centered `/brand/logo-only.png` (36x36px) with rounded corners/smooth borders.
    - Replaces legacy `<img src="/favicon.ico" width={50} height={50}>`.
- **Interactivity**: Clicking redirects to `/` with no reload.

---

### Contract 3: Shopper Mobile Topbar (`topbar.tsx`)

- **Component Path**: `src/components/layout/topbar.tsx`
- **Target Element**: Mobile Topbar brand link (`<Link href="/">`)
- **Asset**: `/brand/logo-only.png`
- **Visual Spec**:
  - Height: `h-8 w-8` (32x32px).
  - Replaces hardcoded text `{isPremium ? "S W" : "SW"}` with the actual brand mark.
- **Interactivity**: Links to `/`.

---

### Contract 4: Admin Console Sidebar (`AdminSidebar.tsx`)

- **Component Path**: `src/features/admin/components/AdminSidebar.tsx`
- **Target Element**: Admin Editorial Logo area
- **Asset**: `/brand/logo-only.png`
- **Visual Spec**:
  - Size: `size-8` (32x32px) icon adjacent to `"Closy."` text.
  - Preserves the `"System Admin"` badge with Shield icon.
- **Interactivity**: Links to `/admin/dashboard`.

---

### Contract 5: Authentication Pages Layout (`auth/layout.tsx`)

- **Component Path**: `src/app/(guest)/auth/layout.tsx`
- **Target Element**: Top banner and brand title
- **Asset**: `/brand/logo-only.png`
- **Visual Spec**:
  - Display brand emblem beside or above `"Closy."` in the authentication banner/sidebar.
- **Interactivity**: Links to `/` via `"Quay lại Closy"`.

---

### Contract 6: Browser Tab Favicon (`favicon.ico`)

- **Target Path**: `public/favicon.ico`
- **Asset**: Derived from `logo-only.png`
- **Dimensions**: Multi-resolution (16x16, 32x32, 48x48) or crisp 32x32 square icon.
- **Outcome**: Browser tabs and bookmarks display the Closy emblem sharply.
