# Data Model & Asset Specifications: Brand Logo Assets

**Feature**: Update Brand Logo Assets and Display  
**Branch**: `001-update-brand-logo`  
**Date**: 2026-09-24  

---

## 1. Static Asset Specification (Brand Visual Assets)

Although this feature is frontend asset and UI focused, the brand asset entities adhere to the following schema and file structure:

### Entity: `BrandAsset`

| Property | Type | Description | Values / Examples |
| :--- | :--- | :--- | :--- |
| `id` | String | Unique identifier of the brand asset variant | `"brand-logo-full"`, `"brand-logo-only"`, `"brand-logo-text"` |
| `fileName` | String | Stored filename under `public/brand/` | `"logo-full.png"`, `"logo-only.png"`, `"logo-text.png"` |
| `publicPath` | String | Web-accessible URL path | `"/brand/logo-full.png"`, `"/brand/logo-only.png"`, `"/brand/logo-text.png"` |
| `sourceWidth` | Integer | Native image width in pixels | `1254` |
| `sourceHeight` | Integer | Native image height in pixels | `1254` |
| `aspectRatio` | String | Fixed aspect ratio | `"1:1"` (square) |
| `format` | String | MIME / File format | `"image/png"` |
| `semanticRole` | Enum | Recommended visual placement role | `FULL_IDENTITY`, `ICON_MARK`, `WORDMARK` |

---

## 2. UI Placement Surface Specification

### Entity: `BrandPlacementSurface`

Defines where and how each brand asset is rendered across the application interface:

| Surface ID | Component File | Variant Used | Desktop Dimensions | Mobile Dimensions | Behavior / Interaction |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `guest-nav-header` | `guest-header.tsx` | `logo-only.png` | 40x40px (normal)<br>32x32px (scrolled) | 36x36px (normal)<br>28x28px (scrolled) | Links to `/`, transitions smoothly on scroll |
| `user-sidebar-expanded` | `sidebar.tsx` | `logo-only.png` + Text | 36x36px icon | N/A (drawer on mobile) | Links to `/` |
| `user-sidebar-collapsed` | `sidebar.tsx` | `logo-only.png` | 36x36px icon | N/A | Centered emblem, tooltip on hover |
| `mobile-topbar` | `topbar.tsx` | `logo-only.png` | N/A | 32x32px icon | Replaces legacy "SW" text, links to `/` |
| `admin-sidebar` | `AdminSidebar.tsx` | `logo-only.png` | 32x32px icon | N/A | Paired with Admin badge, links to `/admin/dashboard` |
| `auth-banner` | `auth/layout.tsx` | `logo-only.png` | 48x48px icon | 40x40px icon | Header icon on authentication screens |
| `browser-favicon` | `favicon.ico` | `logo-only` icon | 32x32 / 48x48px | N/A | Browser tab favicon and bookmark icon |

---

## 3. Validation Rules

- **Aspect Ratio Integrity**: All rendering surfaces MUST preserve the 1:1 aspect ratio without vertical or horizontal stretching.
- **Alt Text Mandatory**: All `<img>` or `<Image>` tags MUST define non-empty `alt="Closy - Smart Wardrobe Logo"`.
- **Preload / Priority**: Above-the-fold header and navigation logo instances MUST include `priority` or standard preload cues to prevent Cumulative Layout Shift (CLS = 0).
