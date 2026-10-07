# TASK DECOMPOSITION - HW2: Drum Kit Engine (Contract-First)

## WBS Task HW2-01: Contract-First Drum Kit Architecture
- **Goal:** Build a real-time interactive Drum Kit application, strictly adhering to the "Contract-First" architecture (Data contract first, code later).
- **Architectural Decoupling Constraints:**
  - Do NOT write JavaScript before finalizing the HTML data contract.
  - Must separate audio logic (Audio Engine) from UI/event logic (App Logic).
  - Must prevent "key repeat" errors when the user holds down a key.
  - Must record events using a FIFO (First-In-First-Out) queue with timestamps.

---

## Mandatory Decomposition Pipeline (4 Steps)

### Step 1: HTML Data-Sound Contract
- **Description:** Create the HTML structure for the Drum Kit and define the "data contract" via `data-*` attributes. Absolutely NO JavaScript in this step.
- **Contract Details:**
  - `data-key`: Keyboard key binding (e.g., `a`, `s`, `d`, `f`).
  - `data-sound`: Corresponding audio file name (e.g., `clap`, `hihat`, `kick`, `snare`).
- **Deliverable:** `index.html`, `style.css` (basic layout only).
- **Commit Message:** `feat(html): drum pad data-sound contract`

### Step 2: Polyphonic Audio Playback Engine
- **Description:** Write an independent audio module (`engine.js`) capable of playing multiple sounds simultaneously (polyphonic). This module must not depend on the DOM.
- **Technical Details:**
  - Use the browser's `Audio` object.
  - Reset `currentTime = 0` before each play to allow rapid triggering.
  - Implement error handling for failed audio file loading.
- **Deliverable:** `engine.js`.
- **Commit Message:** `feat(audio): polyphonic playback engine`

### Step 3: Keyboard Listener with Event.Repeat Throttling
- **Description:** Connect keyboard inputs to the Audio Engine. Crucially, prevent "key repeat" errors by checking the `event.repeat` property.
- **Technical Details:**
  - Listen for `keydown` events on `document`.
  - Check `if (event.repeat) return;` to throttle repeated triggers.
  - Find the corresponding `.pad` element based on `data-key` (Contract-First).
  - Call `playSound()` from the Engine.
- **Deliverable:** `app.js`, update `index.html` to link JS.
- **Commit Message:** `feat(input): keydown listener with repeat throttling`

### Step 4: FIFO Beat Recorder (Timestamped Event Queue)
- **Description:** Record keystroke events with timestamps into a queue (FIFO). Then play them back in the exact recorded sequence.
- **Technical Details:**
  - Use an array `recordedBeats = []` as a FIFO queue.
  - Each element stores: `{ key, sound, time }`.
  - Use `setTimeout` to play back at the exact recorded times.
  - Add "Record" and "Play" buttons to the UI.
- **Deliverable:** `app.js` (update), `index.html` (add buttons).
- **Commit Message:** `feat(recorder): FIFO beat recorder with timestamps`

---

## Verification Gate & Live Defense Strategy

### 1. Verification Gate (Pre-submission Checklist)
- [ ] Open Chrome DevTools -> Console -> Ensure no red errors when pressing keys.
- [ ] Hold down key `A` continuously -> Sound plays only once (due to `event.repeat`).
- [ ] Click "Record", press some keys, click "Stop", then click "Play" -> Audio plays back in correct order and rhythm.
- [ ] Check project structure: `engine.js` must NOT contain any DOM-related code (e.g., `document.querySelector`).

### 2. Live Defense Strategy (3-Minute Q&A Prep)
- **Scenario:** Instructor asks to change a key binding (e.g., change key `A` to key `Z`).
- **Action (within 3 minutes):**
  1. Open `index.html`.
  2. Find the line: `<button class="pad" data-key="a" data-sound="clap">A (Clap)</button>`.
  3. Change `data-key="a"` to `data-key="z"` and update the text to `Z (Clap)`.
  4. Save the file (`Ctrl + S`), refresh the browser (`Ctrl + F5`).
  5. Press key `Z` to verify.
- **Explanation:** No JavaScript changes are needed because we adhered to the "Contract-First" architecture; JS dynamically finds elements based on `data-key`.

---

## Project Structure
```text
Lab1_Homework2/
├── index.html
├── style.css
├── engine.js
├── app.js
├── sounds/
│   ├── clap.wav
│   ├── hihat.wav
│   ├── kick.wav
│   └── snare.wav
└── TASK_DECOMPOSITION.md