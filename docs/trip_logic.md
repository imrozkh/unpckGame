# Trip Logic & Gameplay Rules

## Trip Types
- **Photography Shoot** — gear-forward, balanced essentials, watch for daily comfort traps.
- **Weekend Travel** — compact essentials, minimal tech, toiletries/pajamas important.
- **Work Trip** — office-ready wardrobe + tech, avoid hobby gear.
- **Business Day Trip** — ultra-light, laptop-first, skip bulk clothing.
- **Himalaya Trek (expansion)** — cold-weather layers, safety gear, high trap risk for urban items.

## Round Composition
- 15–20 items per session.
- Mix: 50–60% essential/useful, 20–30% not required, 10–20% trap.
- Items are shuffled; ensure at least 1 trap and 1 essential in first 5 to teach mechanics.

## Validation Rules
- Swipe right (Pack) is correct when the item is tagged essential/useful for the selected trip.
- Swipe left (Reject) is correct when the item is tagged not required or trap for the selected trip.
- No input before timeout counts as incorrect; item auto-advances.
- Score: +1 per correct decision; accuracy = correct / total shown.

## Difficulty Tuning
- **Easy:** item display 2.0s, generous swipe buffer, fewer traps (10%).
- **Medium:** item display 1.7s, standard buffers, balanced traps (15%).
- **Hard:** item display 1.3–1.5s, tighter swipe debounce, more traps (20%).

## Feedback & Accessibility
- Visual: green border + "✓ Packed!" for correct accept; red border + "✗ Wrong!" for incorrect.
- Haptics: light vibration on correct, double-pulse on incorrect where supported.
- Tap fallback: bottom buttons for Pack/Reject (≥44px height), safe-area padding using `env(safe-area-inset-*)`.

## CTA & Share
- Results must show: total score, accuracy, trip icon, recommended loadout modules, and CTA "Explore UNPCK".
- Share badge: vertical 9:16 with score, trip type, and UNPCK branding (Voltage Lime/Charcoal/Vanilla Dust).

## Instrumentation Checklist
- Events: game_start, trip_selected, item_shown, decision_made (with correctness + reaction time), game_complete, cta_click, share_attempt.
- Params: device type, screen width, input method (swipe/tap), difficulty, do_not_track flag, latency metrics.
