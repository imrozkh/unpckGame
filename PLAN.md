# Pack It Right — Speed Mode: Delivery Plan

## Objectives
- Ship a mobile-first micro-game that satisfies the functional requirements in `README.md`, emphasizing fast load, swipe/tap accessibility, and UNPCK brand alignment.
- Provide a lightweight content/data layer (trip definitions and items) that can be expanded.
- Set up implementation rails that support Shopify embed and social sharing surfaces.

## Workstreams & Milestones

### 1) UX & Visuals
- Produce low-fidelity wireframes for four screens: Welcome, Trip Selection, Gameplay, Results/Share.
- Define component specs: card sizing, button touch targets (≥44px), timer bar, feedback states, safe-area padding.
- Compile brand tokens (Voltage Lime, Charcoal, Vanilla Dust) and typography guidance for mobile readability.

### 2) Game Data & Logic
- Author an item library JSON with tags (essential/useful/not required/trap) and trip relevance matrix.
- Define trip-type metadata: allowed items, traps, difficulty presets, round length (15–20 items).
- Draft scoring/validation rules and shuffle/randomization guardrails.

### 3) Front-End Implementation (Mobile Web First)
- Choose stack: vanilla TS + lightweight state machine, or React + Vite for rapid iteration.
- Implement swipe + tap controls with debounced input; use CSS transforms for 60fps card transitions.
- Add timer bar, vibration hooks (when permitted), and correctness feedback (green/red states).
- Implement results view with score, accuracy, CTA, and share badge export (canvas or html2canvas).

### 4) Performance & Analytics
- Enforce bundle target <2.5MB: WebP assets, tree-shaken builds, code-splitting for share/analytics.
- Measure item transition latency (<150ms) and load time (<3s on 4G) with performance marks.
- Track plays, trip selection, reaction times, drop-off items, CTA clicks, and share attempts (with Do Not Track opt-out).

### 5) Shopify/Embed & Social Outputs
- Provide responsive container that adapts to 360–820px widths and respects safe-area insets.
- Supply share artifacts (9:16 PNG badge) including score, trip type, and UNPCK branding.
- Offer optional PWA manifest + service worker for offline fallback (post-MVP).

## Delivery Phases
- **Phase 0 (Now):** Finalize data structures and spec (this repo update).
- **Phase 1 (Build):** Implement gameplay loop, animations, results/share; hook analytics stubs.
- **Phase 2 (Polish):** Asset optimization, haptics tuning, localization hooks, PWA optionality.
- **Phase 3 (Growth):** Leaderboard, streaks, badges, newsletter integration, campaign mode.

## Acceptance Criteria (MVP)
- Selectable trip types with unique item pools; 15–20 items per round, shuffled.
- Swipe/tap controls with accuracy tracking; items auto-advance after 1.5–2s timeout.
- Results screen showing score, accuracy, recommended loadout, CTA, and share option.
- Mobile-friendly layout (≥16px text, ≥44px touch targets, safe-area aware) with UNPCK brand colors.

## Next Steps
1. Validate item library coverage with marketing/merch teams.
2. Approve wireframe drafts, then lock UI kit tokens.
3. Kick off implementation using the data structures in `data/items.json`, `docs/trip_logic.md`, and the build guidance in `docs/implementation_spec.md`.
4. Stand up the initial Vite/React scaffold with swipe + tap input shell following the spec.
5. Define analytics endpoints and privacy notice copy.
