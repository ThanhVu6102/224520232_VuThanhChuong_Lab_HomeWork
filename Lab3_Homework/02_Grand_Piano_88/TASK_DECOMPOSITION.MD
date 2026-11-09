# TASK DECOMPOSITION — WBS

Project: 02_Grand_Piano_88. Người thực hiện: Vũ Thành Chương, 24520232.

| WBS | Work package | Deliverable / nghiệm thu | Commit dự kiến |
|---|---|---|---|
| 2.1 | Phân tích slide 27 và contract | project_rules.md, model, WBS | docs(hw2): contracts and WBS |
| 2.2 | 88-key generation, frequency contract | src/model.js, boundary tests | feat(hw2): domain contracts |
| 2.3 | 8-voice FIFO synth, envelope và cleanup | audio/hook logic, cleanup | feat(hw2): lifecycle engine |
| 2.4 | Memoized key UI, recording và abortable replay | App.jsx, CSS Module | feat(hw2): interactive UI |
| 2.5 | Kiểm thử và audit | tests, audit, desktop/mobile screenshots | test(hw2): verification evidence |

Dependencies: .1 → .2 → .3 → .4 → .5. Hoàn tất khi build/test pass và báo cáo dẫn đúng chứng cứ. Commit thực tế xem GIT_COMMITS.md ở folder cha; bảng là kế hoạch, không khẳng định mọi bước đều được commit riêng.
