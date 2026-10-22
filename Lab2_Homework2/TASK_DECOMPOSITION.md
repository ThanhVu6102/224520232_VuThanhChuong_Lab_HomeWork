# TASK DECOMPOSITION (HW2)

- [ ] **Task 1: Contract Definition**
  - Define `AudioTask` interface and `AudioTaskQueue` class signature.
- [ ] **Task 2: FIFO Queue Engine**
  - Implement `enqueue`, `processNext`, and `cancel` methods using `AbortController`.
- [ ] **Task 3: Audio Context Setup**
  - Initialize `AudioContext` and `AnalyserNode` (fftSize = 256). Handle browser autoplay policies.
- [ ] **Task 4: Canvas Visualizer**
  - Setup `<canvas>` ref. Create `requestAnimationFrame` loop to draw frequency bars.
- [ ] **Task 5: Memory Cleanup & UI**
  - Add UI buttons (Play, Stop, Queue). Ensure all listeners and animation frames are destroyed on unmount.