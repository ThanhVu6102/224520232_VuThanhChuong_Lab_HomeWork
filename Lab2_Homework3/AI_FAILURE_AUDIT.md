# AI FAILURE MODE AUDIT (HW3)

**Vulnerability 01: Drift-Prone setInterval Timer**
- **AI Output:** `setInterval(() => setTime(t => t - 1), 1000)`
- **Risk:** `setInterval` pauses when the tab is inactive (e.g., user switches tabs). When they return, the timer will be completely out of sync with the actual server time.
- **Fix:** Implemented `createAntiDriftTimer` using `Date.now()` delta and `requestAnimationFrame` to calculate exact remaining milliseconds.

**Vulnerability 02: Race Condition in Inventory Check**
- **AI Output:** `if (stock > 0) { await api.buy(); setStock(stock - 1); }`
- **Risk:** In a flash sale, 100 users can check `stock > 0` simultaneously before the `api.buy()` resolves, leading to overselling.
- **Fix:** Implemented Optimistic Locking State Machine. The UI immediately transitions to `LOCKED` and starts a 5-minute timer, simulating a server-side reservation before actual checkout.

**Vulnerability 03: Memory Leak on Early Unmount**
- **AI Output:** Starting a `setTimeout` for checkout but not clearing it if the user navigates away.
- **Risk:** React throws a warning "Can't perform a React state update on an unmounted component" causing memory leaks.
- **Fix:** Stored the request ID and used `cancelAnimationFrame()` and `clearTimeout()` inside the `useEffect` cleanup function.