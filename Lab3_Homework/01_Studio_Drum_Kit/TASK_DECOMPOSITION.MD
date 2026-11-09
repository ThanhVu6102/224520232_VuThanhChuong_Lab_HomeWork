# TASK DECOMPOSITION — WBS

Project: 01_Studio_Drum_Kit. Người thực hiện: Vũ Thành Chương, 24520232.

| WBS | Work package | Deliverable / nghiệm thu | Commit dự kiến |
|---|---|---|---|
| 1.1 | Phân tích slide 26 và contract | project_rules.md, model, WBS | docs(hw1): contracts and WBS |
| 1.2 | Physical key contract, 7 pad data | src/model.js, boundary tests | feat(hw1): domain contracts |
| 1.3 | Web Audio engine và cleanup | audio/hook logic, cleanup | feat(hw1): lifecycle engine |
| 1.4 | Accessible pad UI, hit log và keyboard isolation | App.jsx, CSS Module | feat(hw1): interactive UI |
| 1.5 | Kiểm thử và audit | tests, audit, desktop/mobile screenshots | test(hw1): verification evidence |

Dependencies: .1 → .2 → .3 → .4 → .5. Hoàn tất khi build/test pass và báo cáo dẫn đúng chứng cứ. Commit thực tế xem GIT_COMMITS.md ở folder cha; bảng là kế hoạch, không khẳng định mọi bước đều được commit riêng.
