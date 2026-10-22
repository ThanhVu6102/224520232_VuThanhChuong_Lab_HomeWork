# AI FAILURE MODE AUDIT (HW2)

**Vulnerability 01: Unhandled Promise Rejection (AbortError)**
- **AI Output:** `const res = await fetch(url, { signal });`
- **Risk:** If the user clicks "Cancel", `fetch` throws an `AbortError`. If not caught, it crashes the app.
- **Fix:** Wrap fetch in `try...catch` and check `if (err.name === 'AbortError')` to silently ignore cancellation.

**Vulnerability 02: Memory Leak in requestAnimationFrame**
- **AI Output:** `useEffect(() => { function draw() { ... requestAnimationFrame(draw) } draw(); }, [])`
- **Risk:** When the component unmounts, the `draw` loop continues running in the background, causing a massive memory leak.
- **Fix:** Store the request ID in a ref and call `cancelAnimationFrame(id)` in the `useEffect` cleanup return.

**Vulnerability 03: AudioContext Limit Reached**
- **AI Output:** `new AudioContext()` called on every play.
- **Risk:** Browsers limit the number of `AudioContext` instances (usually 6). Creating new ones will freeze the browser.
- **Fix:** Instantiate `AudioContext` ONCE as a singleton (or in a `useRef`) and reuse it.