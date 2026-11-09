# TASK DECOMPOSITION — WBS

Project: 03_PUBG_Vietnam_Arena. Người thực hiện: Vũ Thành Chương, 24520232.

| WBS | Work package | Deliverable / nghiệm thu | Commit dự kiến |
|---|---|---|---|
| 3.1 | Phân tích slide 28 và contract | project_rules.md, model, WBS | docs(hw3): contracts and WBS |
| 3.2 | Epoch timer và four-state contract | src/model.js, boundary tests | feat(hw3): domain contracts |
| 3.3 | Mock claim, in-flight lock và rollback | audio/hook logic, cleanup | feat(hw3): lifecycle engine |
| 3.4 | Leaderboard filter/sort và virtual kill feed | App.jsx, CSS Module | feat(hw3): interactive UI |
| 3.5 | Kiểm thử và audit | tests, audit, desktop/mobile screenshots | test(hw3): verification evidence |

Dependencies: .1 → .2 → .3 → .4 → .5. Hoàn tất khi build/test pass và báo cáo dẫn đúng chứng cứ. Commit thực tế xem GIT_COMMITS.md ở folder cha; bảng là kế hoạch, không khẳng định mọi bước đều được commit riêng.
