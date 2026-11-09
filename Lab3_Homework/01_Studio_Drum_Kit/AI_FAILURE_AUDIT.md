# AI failure audit — 01_Studio_Drum_Kit

## Phạm vi và tính trung thực

Các đoạn dưới là **mẫu lỗi đối chứng được dựng để review**, không phải lịch sử lỗi quan sát được từ một phiên AI khác. Không khẳng định có screenshot DevTools hay commit sửa lỗi nếu chưa có chứng cứ. Kiểm thử thực tế và ảnh xem VERIFICATION.md / screenshots/.

## 1. Key repeat flood

- Yêu cầu đối chứng: triển khai tính năng liên quan.
- Mẫu code sai: keydown gọi hit mà không kiểm tra repeat.
- Hậu quả: Giữ phím làm phát hàng loạt hit.
- Sửa và xác minh: acceptsKey chặn repeat/modifier/composition; test model và browser keyboard.

## 2. Input shortcut collision

- Yêu cầu đối chứng: triển khai tính năng liên quan.
- Mẫu code sai: window keydown luôn gọi pad.
- Hậu quả: Gõ tên bản thu làm phát trống.
- Sửa và xác minh: closest(input/textarea/select/contenteditable) và browser fill/keyboard test.

## 3. Timer/audio leak

- Yêu cầu đối chứng: triển khai tính năng liên quan.
- Mẫu code sai: Tạo timeout/listener mà không dispose.
- Hậu quả: Unmount giữ listener hoặc âm thanh.
- Sửa và xác minh: Effect trả cleanup; Synth.dispose dừng/đóng context. Browser kiểm tra remount không lỗi, chưa heap profile.

Cần người học tự chạy React DevTools và bảo vệ trực tiếp theo rubric. Không dùng báo cáo này để khẳng định đã đạt Lighthouse 100 hoặc WCAG 2.2 AA đầy đủ.

## Lỗi thực tế trong phiên triển khai

1. Build thành công nhưng runtime báo `React is not defined`: Vite mặc định biên dịch JSX kiểu classic. Sửa bằng `esbuild: { jsx: "automatic" }` trong vite.config.js, build lại và chạy browser không còn pageerror.
2. `node --test tests/*.test.js` không mở rộng wildcard trên Windows/Node 20. Sửa script thành `node --test tests/model.test.js`, chạy lại pass.
