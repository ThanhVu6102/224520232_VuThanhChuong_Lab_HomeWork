# AI failure audit — 03_PUBG_Vietnam_Arena

## Phạm vi và tính trung thực

Các đoạn dưới là **mẫu lỗi đối chứng được dựng để review**, không phải lịch sử lỗi quan sát được từ một phiên AI khác. Không khẳng định có screenshot DevTools hay commit sửa lỗi nếu chưa có chứng cứ. Kiểm thử thực tế và ảnh xem VERIFICATION.md / screenshots/.

## 1. Countdown drift

- Yêu cầu đối chứng: triển khai tính năng liên quan.
- Mẫu code sai: setSeconds(s=>s-1).
- Hậu quả: Background throttling làm lệch thời gian.
- Sửa và xác minh: remaining(target, now), visibilitychange; unit test nhảy clock.

## 2. Double claim race

- Yêu cầu đối chứng: triển khai tính năng liên quan.
- Mẫu code sai: Chỉ dùng busy state để khóa.
- Hậu quả: Hai click cùng event frame vẫn gửi 2 request.
- Sửa và xác minh: Ref lock đồng bộ trước await; browser double invocation xác nhận stock giảm 1.

## 3. 409 inventory desync

- Yêu cầu đối chứng: triển khai tính năng liên quan.
- Mẫu code sai: Giảm stock nhưng không xử lý 409.
- Hậu quả: Kho sai sau khi server từ chối.
- Sửa và xác minh: Functional rollback theo item; browser kiểm tra trước/trong/sau 409.

Cần người học tự chạy React DevTools và bảo vệ trực tiếp theo rubric. Không dùng báo cáo này để khẳng định đã đạt Lighthouse 100 hoặc WCAG 2.2 AA đầy đủ.

## Lỗi thực tế trong phiên triển khai

1. Build thành công nhưng runtime báo `React is not defined`: Vite mặc định biên dịch JSX kiểu classic. Sửa bằng `esbuild: { jsx: "automatic" }` trong vite.config.js, build lại và chạy browser không còn pageerror.
2. `node --test tests/*.test.js` không mở rộng wildcard trên Windows/Node 20. Sửa script thành `node --test tests/model.test.js`, chạy lại pass.
