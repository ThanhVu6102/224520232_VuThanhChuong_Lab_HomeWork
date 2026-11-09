# AI failure audit — 02_Grand_Piano_88

## Phạm vi và tính trung thực

Các đoạn dưới là **mẫu lỗi đối chứng được dựng để review**, không phải lịch sử lỗi quan sát được từ một phiên AI khác. Không khẳng định có screenshot DevTools hay commit sửa lỗi nếu chưa có chứng cứ. Kiểm thử thực tế và ảnh xem VERIFICATION.md / screenshots/.

## 1. Unbounded polyphony

- Yêu cầu đối chứng: triển khai tính năng liên quan.
- Mẫu code sai: voices.set mà không giới hạn.
- Hậu quả: Nốt thứ 9 không giải phóng voice cũ.
- Sửa và xác minh: Map FIFO, unit test xác nhận 8 voice và oldest steal.

## 2. Replay cannot cancel

- Yêu cầu đối chứng: triển khai tính năng liên quan.
- Mẫu code sai: await setTimeout không nhận signal.
- Hậu quả: Stop vẫn phát nốt sau đó.
- Sửa và xác minh: wait nhận AbortSignal và remove listener; unit + browser stop test.

## 3. 88 key render cascade

- Yêu cầu đối chứng: triển khai tính năng liên quan.
- Mẫu code sai: Key thường và callback inline trên parent.
- Hậu quả: Parent update đổi props toàn bộ phím.
- Sửa và xác minh: React.memo và useCallback ổn định; browser đo bộ đếm render gắn trong PianoKey: note-on A0 chỉ đổi bộ đếm MIDI 21; chưa chạy React DevTools Profiler.

Cần người học tự chạy React DevTools và bảo vệ trực tiếp theo rubric. Không dùng báo cáo này để khẳng định đã đạt Lighthouse 100 hoặc WCAG 2.2 AA đầy đủ.

## Lỗi thực tế trong phiên triển khai

1. Build thành công nhưng runtime báo `React is not defined`: Vite mặc định biên dịch JSX kiểu classic. Sửa bằng `esbuild: { jsx: "automatic" }` trong vite.config.js, build lại và chạy browser không còn pageerror.
2. `node --test tests/*.test.js` không mở rộng wildcard trên Windows/Node 20. Sửa script thành `node --test tests/model.test.js`, chạy lại pass.
3. axe phát hiện 36 phím đen vi phạm target-size. Tăng phím đen 20 → 24px, phím trắng 30 → 40px và cập nhật tọa độ. Chạy lại axe không còn violation.
