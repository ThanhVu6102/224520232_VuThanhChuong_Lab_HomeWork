# AI FAILURE MODE REPORT - HW3

## Defect 1: Timezone Drift in Countdown
- **Defect Description:** AI suggested using `setInterval` with a simple decrement counter (`seconds--`). This causes the timer to drift over time, especially when the browser tab is inactive.
- **Diagnostic Method:** Used Chrome DevTools -> Performance tab to monitor timer accuracy. Noticed a 2-second drift after 10 minutes.
- **Refactored Solution:** Replaced the decrement counter with `Date.now()` calculation against a fixed UTC target timestamp. This ensures zero drift.

## Defect 2: XSS Vulnerability via innerHTML
- **Defect Description:** AI used `formMessage.innerHTML = userInput` to display the email. This allows an attacker to inject `<script>` tags (XSS).
- **Diagnostic Method:** Manually entered `<img src=x onerror=alert('XSS')>` into the input field. The alert popped up.
- **Refactored Solution:** Switched to `formMessage.textContent` and implemented a `sanitizeInput()` function using `document.createElement('div')` to escape HTML entities.

## Defect 3: Memory Leak from Uncleared Interval
- **Defect Description:** AI initialized `setInterval` without storing the ID or clearing it when the component unmounted. This causes a memory leak.
- **Diagnostic Method:** Used Chrome DevTools -> Memory tab. Took a heap snapshot, noticed the interval callback was still referencing DOM elements after navigation.
- **Refactored Solution:** Stored `const intervalId = setInterval(...)` and added `clearInterval(intervalId)` when the countdown reaches zero or when the page unloads.
