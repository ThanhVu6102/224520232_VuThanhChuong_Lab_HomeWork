# Kết quả kiểm thử

Ngày: 09/11/2026 (Asia/Saigon). Node 20.20.0, React 19.2.9, Vite 6.4.6, Chromium qua Playwright 1.65.0.

- npm test: 3 test pass.
- npm run build: pass.
- Browser trên production build: 
  - Render counters: only A0 key renders on note-on
  - Keyboard mounted
  - 88 algorithmic keys in DOM
  - Recording captures note
  - Stop cancels playback and silences voices
  - 375px no page overflow
  - No runtime page errors
- axe WCAG 2 A/AA, 2.1 AA, 2.2 AA: 0 violation tự động ở viewport desktop.
- Ảnh thật: screenshots/desktop-1440.png và screenshots/mobile-375.png.

Không thay thế audit WCAG thủ công, Lighthouse hoặc kiểm tra âm thanh bằng tai. Chưa đo heap snapshot và chưa sử dụng React DevTools Profiler. Không khẳng định điểm Lighthouse 100.
