# Changelog & Implementation Documentation

All changes are implemented sequentially with full respect to the current design system, visual layouts, and strict type safety.

## 1. Pagination & Active Sorting (Backend-Driven)
Transitioned the following modules from client-side filtering/sorting/pagination to high-performance, backend-filtered data fetch patterns:
* **Faculty (Teachers)**
  * Enabled paginated retrieval with real-time controls for changing page size (`10`, `25`, `50`, `100`), first/previous/next/last buttons, and "Page X of Y" displays.
  * Added active sort triggers (Index ID, Faculty Entity, and Core Expertise) backed by dynamic `ChevronUp`/`ChevronDown` indicators.
  * Configured backend handler to support status-based and theme-based filtering.
* **Institutions (Schools)**
  * Substituted local client-side array sorting with `sortBy` and `sortOrder` pagination triggers.
  * Added unified bottom pagination component that indicates standard entries counts and state controls.
* **User Accounts (Users)**
  * Wired up `roleId` filtering and real-time backend-driven keyword search.
  * Implemented sorting triggers for User Identity, Username, and System Role.
* **System Metrics (SystemLogs)**
  * Segregated pagination states for **Audit Events** and **Operational Errors**.
  * Replaced mock placeholder HTML structures with fully functioning `@/components/ui/select` blocks.

## 2. API Interface Updates (`src/lib/api.ts`)
* Added `[key: string]: any;` index signature to `PaginatedParams` interface to securely support extra custom filter keys (like `roleId`) passed from components on the fly while retaining strict type validation for predefined parameters (`page`, `pageSize`, `sortBy`, `sortOrder`, `search`).

## 3. Server-Side Handlers (`server.ts`)
* Extended `/api/teachers` to handle dynamic `status` and `subject`/`department` query matching.
* Extended `/api/users` to handle direct `roleId` string filtering on backend collection.
* Maintained fallback for unsorted or unpaginated parameters.

## 4. Lint & Dependency Corrections
* Added missing Lucide React icon imports: `ChevronLeft`, `ChevronRight`, `ChevronsLeft`, `ChevronsRight` to `Teachers.tsx`.
* Removed redundant `sortConfig` variables from `Schools.tsx`.
* Replaced non-existent `UISelect` tag occurrences in `SystemLogs.tsx` with standard `@/components/ui/select` imports.

## 5. Deployed Photo Path Prefix Bugfix (`src/lib/utils.ts` & Component Integrations)
* **Root Cause**: Relative photo paths returned by the server (e.g. `/photos/1/052984923774.jpeg`) bypass the custom backend reverse-proxy endpoint (e.g. `https://scaniderp.com/scanid_erp_api`) under production builds when used natively in standard HTML images or avatars.
* **Resolution**: Added `resolvePhotoUrl` helper in `src/lib/utils.ts` to dynamically resolve photo URLs against `VITE_API_BASE_URL` (stripping trailing `/api` segments where necessary) to produce a fully qualified path for both development (`/photos/...` with local fallback) and production (`https://scaniderp.com/scanid_erp_api/photos/...`).
* **Integration**: Applied `resolvePhotoUrl` globally in image sources rendering dynamic uploaded photos:
  * **Students (`src/pages/Students.tsx`)**: Loaded within the new student detail identity photograph and list view avatars.
  * **Faculty (`src/pages/Teachers.tsx`)**: Loaded for profile update displays and main row avatars.
  * **Institutions (`src/pages/Schools.tsx`)**: Loaded inside edit institutional branding logos and main list rows.
  * **Configuration (`src/pages/Configuration.tsx`)**: Loaded for system configuration school logo previews.

