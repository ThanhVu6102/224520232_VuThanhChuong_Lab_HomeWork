# PROJECT RULES: HW2 CONCURRENT AUDIO QUEUE
**Constraint:** STRICT Memory Safety & Async Concurrency.

## 1. Core Architecture
- **Queue Engine:** Implement a strict FIFO (First-In-First-Out) queue for audio downloads and decoding.
- **Concurrency:** Only ONE track can be downloaded/decoded at a time. Subsequent requests must wait.
- **Cancellation:** MUST use `AbortController` to cancel ongoing fetches. Handle `AbortError` gracefully.

## 2. Memory Safety (Zero Leaks)
- **Audio Nodes:** MUST call `.disconnect()` on `AudioBufferSourceNode` after playback ends.
- **Animation:** MUST use `cancelAnimationFrame()` in the React `useEffect` cleanup function.
- **URLs:** MUST call `URL.revokeObjectURL()` if using local file blobs.

## 3. Performance
- **60fps Visualizer:** Use `requestAnimationFrame` to read from `AnalyserNode` and draw to Canvas.
- **No State Thrashing:** Do NOT put the visualizer's frame data into React `useState`. Use React `useRef` for the Canvas and AudioContext to prevent unnecessary re-renders.