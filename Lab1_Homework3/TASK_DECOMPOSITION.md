# TASK DECOMPOSITION - HW3: Resilient Event Hub & AI Failure Audit

## WBS Task HW3-01: Resilient Landing Page (3 Slices)
- **Goal:** Build a resilient landing page for a tech event, featuring a drift-free countdown timer, a state-machine registration form, and strict input sanitization.
- **Architectural Constraints:**
  - **One-Shot Prompting Ban:** Never pass the entire prompt to AI at once. Each Slice must be developed and committed independently.
  - **Git Audit Rule:** Minimum 5 atomic commits corresponding to slices.
  - **Timezone Safety:** Countdown must use UTC ISO 8601 timestamps.
  - **XSS Prevention:** All user input must be sanitized before rendering.

---

## Mandatory Decomposition Pipeline (3 Slices + Documentation)

### SLICE 1: Drift-Free Countdown Engine (UTC ISO 8601)
- **Description:** Build a countdown timer that does not drift over time, using UTC ISO 8601 target timestamps.
- **Technical Details:**
  - Use `new Date('2026-12-31T23:59:59Z').getTime()` to define the target.
  - Calculate remaining time using `Date.now()` on every tick (NOT a simple `seconds--` decrement, which causes drift).
  - Store `setInterval` ID to allow proper cleanup (`clearInterval`).
  - Update DOM via `textContent` (not `innerHTML`).
- **Deliverable:** `index.html`, `style.css`, `countdown.js`
- **Commit Message:** `feat(js): drift-free countdown engine with UTC`

### SLICE 2: State-Machine Form (Idle -> Submitting -> Success/Error)
- **Description:** Build a registration form that transitions through 4 distinct states, updating UI accordingly.
- **Technical Details:**
  - Define state enum: `IDLE`, `SUBMITTING`, `SUCCESS`, `ERROR`.
  - Create a `setState(newState, message)` helper function.
  - Disable submit button during `SUBMITTING` state (prevents double-submit).
  - Simulate API call with `setTimeout` and random success/failure for testing.
- **Deliverable:** `form.js`, updated `index.html`
- **Commit Message:** `feat(js): state-machine form logic`

### SLICE 3: Double-Submit Prevention & Input Sanitization (Zero XSS)
- **Description:** Harden the form against XSS attacks and ensure users cannot submit twice.
- **Technical Details:**
  - Implement `sanitizeInput(input)` function using `document.createElement('div')` to escape HTML entities.
  - Use `textContent` instead of `innerHTML` when displaying user input.
  - Guard clause at top of submit handler: `if (currentState === STATES.SUBMITTING) return;`.
  - Test by manually entering `<img src=x onerror=alert('XSS')>` into the input.
- **Deliverable:** updated `form.js`
- **Commit Message:** `fix(security): double-submit prevention and XSS sanitization`

### Documentation & Polish
- **Description:** Update WBS, finalize styles for form states, and ensure Lighthouse audit passes.
- **Deliverable:** `TASK_DECOMPOSITION.md`, `style.css`
- **Commit Message:** `docs: update WBS and project structure`

---

## Mandatory AI Failure Mode Report (15% of Grade)

### Report File: `AI_FAILURE_AUDIT.md`
Students must document **3 AI-induced defects** caught during review. Each defect must include:
1. **Defect Description** (e.g., `setInterval` drift, `innerHTML` vulnerability).
2. **Diagnostic Method** (Git diff inspection, DevTools breakpoint, Memory heap snapshot).
3. **Refactored Solution** (Your clean, verified engineering fix).

### Pre-Identified Defects (For Reference)

#### Defect 1: Timezone Drift in Countdown
- **Description:** AI suggested a simple `seconds--` decrement inside `setInterval`. This causes drift because `setInterval` does not guarantee exact 1000ms intervals, especially when the browser tab is inactive.
- **Diagnostic Method:** Chrome DevTools -> Performance tab. Noticed a 2-second drift after 10 minutes of runtime.
- **Refactored Solution:** Replaced the decrement counter with `Date.now()` calculations against a fixed UTC target timestamp. This ensures zero drift regardless of browser throttling.

#### Defect 2: XSS Vulnerability via innerHTML
- **Description:** AI used `formMessage.innerHTML = userInput` to display the email. This allows an attacker to inject `<script>` tags, leading to XSS.
- **Diagnostic Method:** Manually entered `<img src=x onerror=alert('XSS')>` into the input field. The alert popped up, confirming the vulnerability.
- **Refactored Solution:** Switched to `formMessage.textContent` and implemented a `sanitizeInput()` function using `document.createElement('div')` to escape HTML entities before rendering.

#### Defect 3: Memory Leak from Uncleared Interval
- **Description:** AI initialized `setInterval` without storing the ID or clearing it when the countdown finished. This causes a memory leak as the callback keeps running and referencing DOM elements.
- **Diagnostic Method:** Chrome DevTools -> Memory tab. Took a heap snapshot after navigating away, noticed the interval callback was still referencing DOM elements.
- **Refactored Solution:** Stored `const intervalId = setInterval(...)` and added `clearInterval(intervalId)` inside the countdown function when `distance < 0`, and also on `window.beforeunload`.

---

## Verification Gate (Pre-submission Checklist)
- [ ] Open Chrome DevTools -> Console -> Ensure no red errors when loading the page.
- [ ] Watch the countdown for 60 seconds. Compare displayed time with actual elapsed time. Ensure no drift.
- [ ] Click "Register" rapidly 5 times. Ensure only ONE request is sent (button disabled after first click).
- [ ] Enter `<img src=x onerror=alert('XSS')>` into the email field. Ensure no alert pops up.
- [ ] Verify project structure matches the specified layout.
- [ ] Verify Git history has at least 5 atomic commits with the correct messages.

---

## Live Defense Strategy (3-Minute Q&A Prep)

### Scenario 1: "Why use `Date.now()` instead of decrementing a counter?"
**Answer:** `setInterval` is not guaranteed to fire exactly every 1000ms. Browser throttling (especially when the tab is in the background) causes the timer to drift over time. By recalculating `targetDate - Date.now()` on every tick, we always display the accurate remaining time regardless of interval irregularities.

### Scenario 2: "Why use `textContent` instead of `innerHTML`?"
**Answer:** `innerHTML` parses the input as HTML, allowing attackers to inject malicious `<script>` tags (XSS). `textContent` treats the input as plain text and automatically escapes HTML entities, preventing script execution.

### Scenario 3: "How do you prevent double-submit?"
**Answer:** When the user submits the form, we immediately set the state to `SUBMITTING` and disable the submit button (`submitBtn.disabled = true`). Additionally, the submit handler has a guard clause at the top: `if (currentState === STATES.SUBMITTING) return;`. This double-layer protection ensures no duplicate requests are sent, even if a user bypasses the UI and triggers the event programmatically.

---

## Project Structure
```text
Lab1_Homework3/
├── index.html
├── style.css
├── countdown.js
├── form.js
├── AI_FAILURE_AUDIT.md
└── TASK_DECOMPOSITION.md
```
