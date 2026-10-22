# PROJECT RULES: HW3 FLASH-SALE ENGINE
**Constraint:** STRICT State Machine & Zero-Drift Timer.

## 1. Core Architecture
- **Finite State Machine:** The UI must strictly follow these states: `IDLE`, `RESERVING`, `LOCKED`, `CHECKOUT`, `EXPIRED`.
- **Zero-Drift Timer:** Use `Date.now()` and `requestAnimationFrame` for the countdown. DO NOT use `setInterval` (prone to drift).
- **Optimistic Inventory Lock:** When a user clicks "Buy", the item is temporarily reserved for 5 minutes. If checkout is not completed in time, the lock expires and inventory is restored.

## 2. Performance & Safety
- **No State Mutation:** Never mutate state directly. Always use the setter function from `useState` to return a new state object.
- **Memory Cleanup:** MUST call `cancelAnimationFrame` in the `useEffect` cleanup to prevent the timer from running in the background after component unmount.
- **Prevent Double-Click:** The "Buy" button must be disabled during the `RESERVING` state to prevent duplicate requests.