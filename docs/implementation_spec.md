# Implementation Spec — Pack It Right (Speed Mode)

This document outlines a concrete build approach for a mobile-first web implementation (Shopify embed + social webview). It assumes a small React + Vite stack, but the state machine and data contracts are framework agnostic.

## Tech Stack
- **Framework:** React + TypeScript + Vite (fast HMR, tree-shaking for small bundle).
- **Gestures:** `@use-gesture/react` or a minimal pointer handler for swipe; fallback tap buttons.
- **Styling:** CSS modules or Tailwind with a slim config; use CSS variables for brand tokens.
- **Asset format:** WebP for item icons; lazy-load share/export utilities (html2canvas) behind a dynamic import.
- **Analytics:** event queue with `do_not_track` opt-out flag; pluggable transport (Segment/GA4/first-party endpoint).

## State Machine
States are event-driven to keep controls predictable and testable.

- **welcome** → trip selection or resume last trip (optional).
- **trip_selected** → pre-game countdown (optional), then `show_item`.
- **show_item** → timer starts; accepts `swipe_left`, `swipe_right`, or `timeout`.
- **feedback** → brief success/error state (<200ms), then advance or finish when items exhausted.
- **results** → shows score, accuracy, loadout suggestions, share/export controls.
- **share_exporting** (optional) → generate image badge; returns to `results`.

Guards:
- Ignore duplicate inputs while in `feedback`.
- Debounce swipe events; clamp to one decision per item.

## Data Contracts (TypeScript)
```ts
// data/items.json provides the source of truth
export type Tag = "essential" | "useful" | "not_required" | "trap";

export interface TripItem {
  name: string;
  tag: Tag;
  icon?: string; // relative path to WebP
}

export interface TripConfig {
  id: string;
  name: string;
  roundItemCount: { min: number; max: number };
  difficultyDefaults: { easy: number; medium: number; hard: number }; // seconds per card
  recommendedLoadout: string[];
  items: TripItem[];
}

export interface GameConfig {
  trips: TripConfig[];
  tags: Record<Tag, { accept: boolean; description: string }>;
}
```

## Rendering & Layout
- **Card sizing:** 70–80% of vertical viewport; safe-area padding using `env(safe-area-inset-*)`.
- **Touch targets:** ≥44px for tap buttons; full-viewport swipe detection.
- **Timer bar:** CSS transform scaleX with `transition` tied to the item duration per difficulty.
- **Feedback:** color tokens applied to border/shadow; microcopy "✓ Packed!" / "✗ Wrong!"; vibration via `navigator.vibrate` when permitted.

## Animation & Performance Guardrails
- Use `transform: translateX` for swipe exits; limit animation to ≤200ms.
- Preload next item image; keep assets <80KB each.
- Use requestAnimationFrame for manual timers only if CSS transitions insufficient; prefer CSS.
- Target total JS <2.5MB post-gzip; split share/export and analytics bundles via `import()`.

## Shuffle & Composition
- At game start, copy the trip's `items` array, enforce at least one trap + one essential in the first five cards.
- Shuffle with Fisher-Yates; slice to configured round length.
- Apply difficulty timing from `difficultyDefaults` with optional `multiplier` for speed mode tweaks.

## Scoring & Validation
- Correct when `tag` is `essential` or `useful` for PACK, and `not_required` or `trap` for REJECT.
- Score = count of correct decisions; accuracy = correct / total shown.
- Store per-item reaction time for analytics and potential streak bonuses (future).

## Share Badge Generation
- Layout: 9:16 canvas with trip name, score, accuracy, UNPCK mark, and brand colors (Voltage Lime/Charcoal/Vanilla Dust).
- Export path: `share_export` event -> generate image -> open native share sheet if available, else download fallback.

## Shopify/Webview Embed Notes
- Game container must be responsive to 360–820px widths; avoid fixed heights.
- Respect reduced motion: honor `prefers-reduced-motion` to shorten/disable swipe exit animations.
- Provide a `doNotTrack` flag in query params to disable analytics.

## Testing Checklist
- Unit: state machine transitions (welcome → results), shuffle integrity, scoring validator.
- Integration: swipe vs tap inputs, timeouts counting as incorrect, safe-area padding.
- Performance: item transition <150ms; initial load <3s on 4G with mocked network throttling.
- Accessibility: 16px+ text, focusable buttons, color contrast for feedback states.
