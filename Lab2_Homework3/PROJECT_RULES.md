# Project Rules — Flash-Sale E-Commerce Engine (Lab2 Homework3)

## 1. Hard constraints

1. UI state must be modeled as a Finite State Machine with exactly six states:
   `IDLE | RESERVING | LOCKED | CHECKOUT | EXPIRED | SUCCESS`.
2. The countdown must be **zero-drift**: driven by `requestAnimationFrame` +
   `Date.now()` delta against a fixed target timestamp. `setInterval` is forbidden.
3. Clicking "Buy" locks the inventory for **5 minutes (300,000 ms)**. During the
   hold the user may click "Checkout". When the timer reaches 0 the lock expires
   and the inventory is restored to the pool.
4. `requestAnimationFrame` must always be cleaned up on unmount / state change
   (every `setTimeout` too).

## 2. Code rules

- Strict TypeScript: discriminated-union state, exhaustive `switch` on `status`,
  no `any`, no implicit returns.
- All async transitions use functional `setState` guarded by the current status
  so late callbacks can never overwrite a newer state.
- Semantics: `role="timer"`, `role="progressbar"`, `aria-live="polite"`,
  visible focus states, disabled controls for non-actionable buttons.
- Comments are not allowed; names must be self-documenting.

## 3. Task decomposition (commit plan)

| # | Commit | Scope |
| --- | --- | --- |
| 1 | `chore(setup): initialize vite react-ts project` | Vite + TS scaffold, entry files |
| 2 | `docs(rules): add project rules and task decomposition` | This document |
| 3 | `feat(utils): implement zero-drift timer using requestAnimationFrame` | `src/utils/timer.ts` |
| 4 | `feat(ui): build semantic flash sale card layout` | `App.tsx`, CSS shell, static card markup (all six panels) |
| 5 | `feat(state): implement IDLE and RESERVING state transitions` | `useState`, IDLE → RESERVING → LOCKED wiring |
| 6 | `feat(core): implement inventory lock and countdown integration` | rAF timer lifecycle in `LOCKED`, live mm:ss countdown |
| 7 | `feat(checkout): add mock payment and lock expiry logic` | CHECKOUT → SUCCESS, remaining ≤ 0 → EXPIRED |
| 8 | `style(a11y): finalize CSS animations and accessibility checks` | Keyframes, urgent pulse, focus-visible, reduced motion |
