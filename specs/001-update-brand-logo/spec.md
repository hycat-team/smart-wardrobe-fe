# Feature Specification: Update Brand Logo Assets and Display

**Feature Branch**: `001-update-brand-logo`

**Created**: 2026-09-24

**Status**: Draft

**Input**: User description: "tui muốn cập nhật lại logo mới từ các logo trong thư mục \"C:\\FPT\\Project\\smart-wardrobe\\logo\""

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Brand Identity Experience Across Main Navigation & Header (Priority: P1)

As a visitor or registered user, I want to clearly see the modern, official brand logo across the header and sidebar navigation so that I immediately recognize and trust the Smart Wardrobe / Closy platform.

**Why this priority**: Navigation headers and sidebars are the primary visual anchor of the platform, viewed continuously by every user on every page.

**Independent Test**: Can be tested by visiting the homepage, guest landing, and internal app screens to confirm that the official brand logo renders crisply and consistently in both desktop and mobile layouts.

**Acceptance Scenarios**:

1. **Given** a visitor navigates to the landing or public pages, **When** observing the header navigation (both in transparent hero mode and scrolled sticky mode), **Then** the new brand logo is prominently and clearly displayed with balanced proportions and readable branding.
2. **Given** an authenticated user opens the application dashboard, **When** switching the sidebar between expanded and collapsed states, **Then** the sidebar appropriately shows the full brand logo (in expanded state) and the compact brand mark icon (in collapsed state).

---

### User Story 2 - Consistent Brand Presence in Browser Tabs and App Metadata (Priority: P2)

As a user with multiple open tabs or saved bookmarks, I want the browser tab and web bookmarks to show the new brand icon so that I can easily spot and return to the application.

**Why this priority**: Browser favicons and application icons represent the user's quick reference outside the immediate app viewport, establishing brand professionalism.

**Independent Test**: Can be tested by bookmarking the site, opening multiple tabs, or inspecting the tab icon to confirm the new icon-only brand emblem is displayed instead of any generic or outdated icons.

**Acceptance Scenarios**:

1. **Given** a user opens the application in any modern web browser, **When** looking at the browser tab icon, **Then** the new brand icon (`logo-only`) is displayed cleanly without pixelation or visual artifacts.

---

### User Story 3 - Administrative and Authentication Screen Brand Cohesion (Priority: P3)

As an administrator or user accessing login/register and portal pages, I want to see consistent brand identity cues so that all sub-portals feel unified under the platform's brand language.

**Why this priority**: Ensures end-to-end brand continuity across authentication checkpoints and management panels.

**Independent Test**: Can be tested by navigating to auth screens (sign in / sign up) and admin/brand portal navigation to confirm that brand emblems and typography align with the updated identity.

**Acceptance Scenarios**:

1. **Given** a user is on the authentication pages (login, registration) or admin portal, **When** viewing the brand presentation, **Then** the visual identity elements (emblem and wordmark) align with the new brand design standards.

---

### Edge Cases

- **High-DPI / Retina Displays**: High-density mobile and desktop screens must render logos sharply without blurriness or downsampling artifacts.
- **Theme and Background Variations**: The logo variants must remain legible and visually appealing across both light/dark surfaces and during transitions (e.g., guest header scrolling from transparent over hero image to a frosted/solid surface).
- **Layout Shift Prevention**: Space reserved for logo assets must be explicitly defined to avoid layout shift (CLS) as assets load over slower network connections.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST incorporate the new visual identity assets from the source directory (`logo-full.png`, `logo-only.png`, `logo-text.png`) into the platform's public asset collection.
- **FR-002**: The system MUST display the compact brand mark (`logo-only`) in constrained spaces, including browser tab favicons, collapsed sidebar views, and mobile header bars.
- **FR-003**: The system MUST display the comprehensive logo (`logo-full` or unified combination of icon and wordmark) in primary navigation areas, such as the expanded desktop sidebar and guest header.
- **FR-004**: All logo elements MUST provide accessible alternative text ("Smart Wardrobe - Closy Logo") for screen readers and accessibility tools.
- **FR-005**: Logo displays MUST support responsive scaling across mobile, tablet, and desktop viewports without clipping, distortion, or aspect-ratio stretching.
- **FR-006**: Logo instances situated in navigation headers and sidebars MUST function as interactive navigation links redirecting users to the platform's home or dashboard.

### Key Entities *(include if feature involves data)*

- **Brand Visual Asset**: Represents a digital branding file (`logo-full`, `logo-only`, `logo-text`) with designated roles, dimensions, and display contexts.
- **Brand Placement Surface**: Any distinct UI location where brand assets appear (browser tab/favicon, guest header, authenticated sidebar, mobile navigation, authentication views, and admin portal).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of legacy/outdated placeholder logos and generic icons across all public and authenticated viewports are replaced with the new brand assets.
- **SC-002**: The brand logo renders sharply with zero visual distortion across standard screen sizes (from 360px mobile viewports up to 4K displays).
- **SC-003**: Brand asset loading achieves a Cumulative Layout Shift (CLS) of 0 for navigation headers and sidebars during initial page load.
- **SC-004**: 100% of brand logo links correctly direct users back to the homepage or main dashboard within 1 click.

## Assumptions

- The provided source files (`logo-full.png`, `logo-only.png`, `logo-text.png`) represent the approved, authoritative master assets for the platform's brand identity.
- The application supports responsive layouts where compact spaces require an icon-only variant, while expanded layouts can accommodate the full logo or wordmark.
- Standard web browsers (Chrome, Edge, Safari, Firefox) support standard PNG and ICO favicon formats.
