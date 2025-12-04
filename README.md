UNPCK MICRO GAME — FUNCTIONAL REQUIREMENTS
GAME: PACK IT RIGHT — SPEED MODE
1. Overview

Pack It Right — Speed Mode is a fast-paced micro-game for UNPCK designed for marketing and engagement.
Players rapidly decide which items belong in a selected trip-type loadout by swiping actions.

The game reinforces UNPCK’s brand values of minimalism, modular packing, and smart travel decisions.

Reference docs for builders:
- Delivery plan: `PLAN.md`
- Trip logic and round composition: `docs/trip_logic.md`
- Implementation spec: `docs/implementation_spec.md`

Phase 1 React + Vite prototype:
- Install dependencies: `npm install`
- Run the dev server: `npm run dev` (default at http://localhost:5173)
- Lint the project: `npm run lint`
- Build for production: `npm run build` (outputs to `dist/`)
- Source lives in `src/` and imports the trip/item JSON from `data/items.json`.

Repository quickstart:
- Content lives entirely in Markdown/JSON to stay tool-agnostic and easy to embed.
- `data/` holds the game item library and trip metadata used by the scoring/validation logic.
- `docs/` contains build-facing specs; start with `implementation_spec.md` for architecture and state flow.
- `PLAN.md` tracks milestones and acceptance criteria to align designers, engineers, and marketing.

Working in this repo:
- Use the `work` branch for ongoing edits and keep commits focused on a single change.
- Run local checks that apply to your contribution (e.g., linting or formatting once the app scaffold lands).
- Include a short summary and testing notes in each commit message to keep PR reviews fast.
- Default remote:
  - `origin` → https://github.com/imrozkh/unpckGame (use `git push -u origin work` to publish changes)

Platforms:

Instagram Stories/Reels Interactive

Web embed (Shopify)

WhatsApp Shareable Mini-Game (optional)

2. Objectives

Increase engagement for pre-launch and launch phases.

Educate users on modular packing concepts through play.

Build shareability via scores and loadout suggestions.

Promote UNPCK products subtly within gameplay.

3. User Personas

1. Urban Professionals (22–40) — frequent short-haul travelers
2. Creatives/Photographers — understand gear decision trade-offs
3. Digital Nomads — appreciate minimalist packing

4. Core Gameplay
4.1 Game Mode

Single mode: Speed Decision Mode

4.2 Goal

Players must correctly accept or reject items shown on screen based on the selected trip type.

5. Functional Requirements
5.1 Game Start
FR-1: Trip-Type Selection

User must choose one trip type from a predefined list:

Photography Shoot

Weekend Travel

Work Trip

Business Day Trip

Himalaya Trek (optional expansion)

FR-2: Trip-Type Metadata

Each trip type contains:

Allowed Items List

Disallowed Items List

Trap Items List (humorous or distracting)

FR-3: Difficulty Level (Optional Release 2)

Easy (slower item flash)

Medium

Hard (1-second item flash)

5.2 Gameplay Mechanics
FR-4: Item Display

One item appears at a time.

Display duration: 1.5–2 seconds.

Items shown in randomized order (shuffled each game).

FR-5: Swipe Actions

Swipe Right = Pack

Swipe Left = Reject

On web: Click “Pack” / “Reject”.

FR-6: Decision Scoring

Correct decision: +1 point

Wrong decision: No negative points, but accuracy drops.

Missed item (no swipe in time): counts as Wrong.

FR-7: Visual Feedback

Green border + quick “✓ Packed!” for correct

Red border + “✗ Wrong!” for incorrect

Vibrational or sound cue (if permitted)

FR-8: Total Items per Round

Each game round: 15–20 items.

Combination of essential, useful, unnecessary, and trap items.

5.3 Item Categories (System Logic)
FR-9: Item Classification

Items must be tagged as:

Essential

Useful

Not Required

Trap Item

FR-10: Decision Validation

System checks player decision against item tag for the selected trip.

5.4 End of Game Output
FR-11: Score Screen

After the last item, show:

Total Score (0–20)

Accuracy %

Time Taken (optional)

FR-12: UNPCK Loadout Recommendation

Based on trip type, show curated modules:

Backpack suggestion (UNPCK Ridge)

Relevant accessories:

Tech Pouch

Camera Cube

Toiletries Pouch

Packing Cubes

Minimal text: “Your smart loadout for this trip”

FR-13: CTA Section

Display:

“Think smarter. Pack sharper.”

Button: Explore UNPCK → unpck.com

FR-14: Share Feature

Player can share:

Their score

Trip type

Branded template with UNPCK colors (Voltage Lime, Charcoal)

Share channels:

Instagram Story

WhatsApp

Screenshot mode

6. UI/UX Requirements
6.1 Style

Minimalist, bold, clean

UNPCK Brand Colors: Voltage Lime, Charcoal, Vanilla Dust

Animated item cards with subtle shadows

Round, snappy motion transitions

6.2 Screens Required
SR-1: Welcome Screen

Game title

Start button

Subtext: “Swipe fast. Pack smart.”

SR-2: Trip Selection Screen

Grid of trip icons + labels.

SR-3: Gameplay Screen

Center: Item card

Bottom-left/right: Swipe indicators

Top: Timer bar (optional)

SR-4: Results Screen

Score

Accuracy

Suggested loadout

CTA button

Share button

7. System Requirements
7.1 Item Library

A JSON or DB structure containing items:

Name

Icon/illustration

Tags (essential/useful/not required/trap)

Trip-type relevance matrix

Weight (optional)

7.2 Scoring Engine

Validates decisions vs relevance matrix

Generates score events

Tracks accuracy and time

7.3 Randomization Engine

Shuffles items for each session

Ensures fair distribution of essential and trap items

8. Performance Requirements

Item transition must occur within <150ms

Game should load in <3 seconds on mobile

Touch/swipe detection <100ms latency

9. Non-Functional Requirements

Brand Consistency: Must look and feel like UNPCK

Accessibility: Buttons visible, clear touch zones

Scalability: Can add more trips or items easily

Localisation Ready (optional future)

10. Analytics Requirements

Track:

Number of plays

Trip-type popularity

Average score

Drop-off items

CTA click-through to UNPCK website

Share actions

11. Future Enhancements (Optional)

Leaderboard

Multi-trip “campaign mode”

Unlockable badges (“Minimalist Master”, “Pro Packer”)

Time-attack rounds

Integration with UNPCK newsletter signup

DONE.

If you want, I can now create:

✅ Wireframes (clean UI sketches)
✅ Item library JSON
✅ Trip-type logic tables
✅ Developer implementation plan
✅ Marketing landing page copy for the game

Just tell me what you want next.

You said:
this should be mobile friendly
ChatGPT said:

Absolutely — here is the mobile-friendly version of the Functional Requirements with added mobile-specific UX, performance, and interaction considerations.
This is a refined FRD optimized for mobile-first design, perfect for Instagram / web embed / WhatsApp mini-game use.

✅ UNPCK: PACK IT RIGHT — SPEED MODE
Functional Requirements (Mobile-First Version)
1. Overview

Pack It Right — Speed Mode is a lightweight, mobile-optimized micro-game designed for quick engagement on social platforms.
It runs smoothly on small screens, supports swipe gestures, and loads fast enough for Instagram users.

Supported Platforms:

Mobile Web (Shopify embed)

Instagram (Reels/Stories interactive)

WhatsApp / Telegram webview

PWA (optional future)

2. Mobile-First Gameplay Principles

The game must be designed to achieve:

Single-hand playability

Clear swipe zones

Fast load (<3 seconds)

Readable item visuals even on 5–6 inch screens

Tap alternatives for users who dislike swipes

Minimal visual clutter

3. Mobile Functional Requirements
3.1 Game Start
FR-1: Mobile Start Screen

Full-screen layout

Center-aligned title

Large “Start” button (minimum 44px touch area)

FR-2: Mobile Trip-Type Selection

Show trip types as large tappable cards (2 per row max).

Icons must be at least 64×64 px for clarity.

Cards must have:

Icon

Trip name

Soft shadow for visual depth

3.2 Mobile Gameplay Mechanics
FR-3: Item Display (Mobile-Optimized)

Items appear as large cards occupying 70–80% of vertical space.

Text label must be at least 16–18px.

Image should auto-scale for small screens.

FR-4: Swipe Interaction

Full-screen swipe detection:

Swipe right anywhere → Pack

Swipe left anywhere → Reject

This improves usability on smaller devices.

FR-5: Tap Interaction (Accessibility Mode)

For users who may prefer tapping:

Two large buttons at bottom:

Left: "Reject"

Right: "Pack"

Each button minimum: 44×44 px

FR-6: Item Timing

Item stays visible for 1.5–2 seconds, adjustable for device performance.

A thin progress bar appears at the top as a time indicator.

FR-7: Feedback (Mobile UI)

Quick vibration on decision (if allowed)

Lightweight animations:

Swipe right → card slides out right

Swipe left → card slides out left

Minimal text, e.g.:

“✓ Packed!”

“✗ Not Needed!”

Animations must not exceed 200ms.

3.3 Mobile Score & Results Screen
FR-8: Results Layout

UI must be compact and readable:

Score displayed prominently (32px font)

Accuracy % below it

Trip-type icon shown again

UNPCK loadout suggestion presented as:

Scrollable row of modules (tech pouch, camera cube etc.)

Each item must be tappable for more info (optional)

FR-9: CTA Section

Large button: Explore UNPCK

Secondary button: Share Score

CTA buttons must be:

Minimum height: 48px

Full-width on mobile

Contrasting color: Voltage Lime

3.4 Mobile Sharing Features
FR-10: Share Modes

Players can share:

A branded static image (score badge)

A short video loop (optional)

Direct link to the UNPCK website or product page

FR-11: Share Platforms

Instagram

WhatsApp

Telegram

Messenger

All share assets must be vertical 9:16 aspect ratio.

4. Mobile UI/UX Requirements
4.1 Layout & Responsiveness
FR-12: Responsive Scaling

Game must work on:

360px width screens

Foldable phone widths (up to 820px)

FR-13: Safe Areas

UI must avoid:

Notch regions

Rounded corners

iOS bottom bar

Use CSS env(safe-area-inset-*) for padding.

4.2 Mobile Accessibility
FR-14: Text Legibility

Minimum font size: 16px

High-contrast text

Optional: “Large Text Mode” toggle

FR-15: One-Hand Use

Place tap buttons:

Along the bottom edge

Reachable by thumb

5. Mobile Performance Requirements
FR-16: Lightweight assets

Total asset bundle < 2.5 MB

Item illustrations optimized to <80 KB each

FR-17: Fast Load Time

Initial screen load < 3 seconds on 4G

No blocking animations on startup

FR-18: GPU-Friendly Animations

Use:

CSS transforms

No heavy opacity transitions

Minimize DOM reflows

6. System Requirements (Mobile-Optimized)
FR-19: Item Library (JSON)

Each item entry includes:

Name

Mobile icon (webp preferred)

Classification (essential, useful, trap)

Trip relevance matrix

Optional: very short description

FR-20: Scoring Engine

Lightweight JS model

Zero computation loops >100ms

Debounce swipe inputs

FR-21: Offline Fallback (Optional PWA)

A cached version loads if offline.

7. Analytics Requirements (Mobile-Focused)

Track:

Device type

Swipe vs tap usage

Drop-off point

Avg reaction time

Screen size

CTA click-through

Share conversions

8. Mobile Security & Privacy
FR-22: No login required

Game must be instantly accessible.

FR-23: No personal data stored

Only aggregated analytics permitted.

FR-24: GDPR/DPDP Ready

Allows “Do Not Track” toggle.

9. Future Mobile Enhancements

Haptic feedback levels

Mobile leaderboard

“Streak” counters

Unlock rewards / badges

Sync to UNPCK account (post-launch)

✅ READY FOR BUILD.

If you want next, I can deliver:

✔ Wireframes (mobile screens)
✔ UI mood board using UNPCK brand colors
✔ JSON Item library skeleton
✔ Developer spec (API contracts + JS architecture)
✔ Marketing screen mockups for this game
## Implementation Assets (Added)
- `PLAN.md`: Delivery plan covering objectives, workstreams, phases, and acceptance criteria.
- `docs/trip_logic.md`: Trip-specific rules, difficulty tuning, feedback, CTA/share, and instrumentation.
- `data/items.json`: Mobile-friendly item library and trip metadata with tags and recommended loadouts.
