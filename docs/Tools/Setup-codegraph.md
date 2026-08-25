# Hướng Dẫn Cài Đặt & Sử Dụng CodeGraph trong Dự Án Smart Wardrobe

Tài liệu này hướng dẫn các thành viên trong team cách cài đặt, khởi tạo và sử dụng **CodeGraph** trong repository `smart-wardrobe-fe` để hỗ trợ tra cứu kiến trúc mã nguồn nhanh chóng và tối ưu token khi làm việc cùng AI Coding Assistants (Antigravity IDE, Cursor, Claude Code, v.v.).

---

## 1. Giới thiệu CodeGraph là gì?

**CodeGraph** là công cụ phân tích mã nguồn dạng đồ thị tri thức (Knowledge Graph & Code Intelligence) dành cho codebase:
* **Tối ưu Token:** Thay vì để AI phải dùng nhiều vòng lặp `list_dir`, `grep_search` và đọc hàng chục file rời rạc gây tốn kém token và chậm chạp, CodeGraph trích xuất toàn bộ cây quan hệ (Call paths, Dynamic Dispatch, Component hierarchy) và mã nguồn chuẩn xác chỉ trong **1 lần gọi duy nhất**.
* **Đánh giá ảnh hưởng (Blast Radius):** Xác định ngay lập tức những trang, component, store hoặc API nào sẽ bị ảnh hưởng trước khi thực hiện refactor code.
* **Tự động đồng bộ (Auto-sync):** Daemon chạy nền tự động cập nhật đồ thị tri thức mỗi khi bạn lưu thay đổi trong file mã nguồn.

---

## 2. Cấu trúc CodeGraph trong Repository

Trong thư mục dự án `smart-wardrobe-fe`, CodeGraph được cấu hình gồm 2 phần:
1. **`.agents/skills/codegraph/SKILL.md` (Được commit lên Git):**
   * Chứa hướng dẫn và quy tắc để các AI Agent (Antigravity, Cursor,...) tự động kích hoạt MCP tool `codegraph_explore` khi bạn hỏi về luồng logic, kiến trúc hoặc tìm kiếm components.
2. **`.codegraph/` (Cục bộ trên máy cá nhân):**
   * Chứa cơ sở dữ liệu SQLite `codegraph.db`, socket và PID của daemon chạy nền.
   * **Lưu ý:** Thư mục này đã có sẵn [.codegraph/.gitignore](file:///.codegraph/.gitignore), **không commit file database lên Git** vì cơ sở dữ liệu sẽ được tạo tự động trên từng máy.

---

## 3. Hướng Dẫn Cài Đặt & Khởi Tạo Cho Thành Viên Mới

### Bước 1: Cài đặt CodeGraph CLI & MCP Server
Mở Terminal trên máy của bạn và chạy lệnh cài đặt / đăng ký MCP vào các Agent / IDE bạn đang sử dụng:

```bash
# Tự động đăng ký CodeGraph MCP vào các AI Agent đang có trên máy (Antigravity, Cursor, Claude Code...)
codegraph install
```

> *Nếu chưa có lệnh `codegraph`, vui lòng cài đặt CodeGraph CLI theo hướng dẫn của hệ điều hành hoặc qua package manager.*

---

### Bước 2: Khởi tạo Index cho Repository
Mở terminal tại thư mục gốc của dự án `smart-wardrobe-fe` và chạy:

```bash
codegraph init
```

* Quá trình khởi tạo sẽ quét toàn bộ 350+ files trong dự án, xây dựng hàng ngàn nodes/edges quan hệ giữa các component, hook, store và API services.
* Quá trình này chỉ mất từ 3 - 5 giây và tạo ra cơ sở dữ liệu đồ thị `.codegraph/codegraph.db` trên máy của bạn.

---

### Bước 3: Xác minh trạng thái
Kiểm tra xem CodeGraph đã sẵn sàng và index đủ dữ liệu chưa:

```bash
codegraph status
```

Kết quả hiển thị tương tự:
```text
Project: smart-wardrobe-fe
Index:   Indexed (353 files, 3,574 nodes, 8,238 edges)
Daemon:  Running (watching for changes)
```

---

## 4. Hướng Dẫn Sử Dụng

### Cách 1: Sử dụng cùng AI Coding Assistant (Khuyến nghị)
Khi bạn hỏi AI trong Antigravity IDE hoặc các AI Agent tương thích, AI sẽ tự động đọc `SKILL.md` và gọi `codegraph_explore` trong nền.

**Các câu hỏi mẫu để AI khai thác sức mạnh CodeGraph tối đa:**
* *"Khảo sát luồng upload trang phục vào tủ đồ và cho biết những component nào phụ thuộc vào nó?"*
* *"Store `useAuthStore` hoặc `useWardrobeStore` đang được sử dụng ở những trang/component nào?"*
* *"Đánh giá blast radius nếu tôi thay đổi interface `WardrobeItemRes` hoặc hàm `useBatchUploadWardrobeItems`?"*
* *"Luồng gọi từ nút 'Thêm vào tủ đồ' ở trang chi tiết sản phẩm Brand về Backend diễn ra như thế nào?"*

---

### Cách 2: Sử dụng trực tiếp bằng CLI qua Terminal

Bạn có thể tự tra cứu nhanh cấu trúc code mà không cần mở file hoặc grep thủ công:

| Lệnh CLI | Mục đích | Ví dụ |
| :--- | :--- | :--- |
| `codegraph status` | Kiểm tra trạng thái index và daemon nền | `codegraph status` |
| `codegraph explore "<query>"` | Khảo sát luồng logic, trích xuất source code & call paths liên quan | `codegraph explore "upload item wardrobe store modal"` |
| `codegraph callers <symbol>` | Tìm tất cả các hàm/component đang gọi symbol này | `codegraph callers useBatchUploadWardrobeItems` |
| `codegraph callees <symbol>` | Xem symbol này đang gọi tới những hàm/component/API nào | `codegraph callees WardrobeClient` |
| `codegraph impact <symbol>` | Đánh giá phạm vi ảnh hưởng (blast radius) trước khi refactor | `codegraph impact WardrobeCard` |
| `codegraph node <symbol \| path>` | Xem chi tiết 1 symbol hoặc đọc file kèm line numbers và dependents | `codegraph node UploadClient` |
| `codegraph sync` | Buộc đồng bộ thủ công lại index sau khi git checkout/merge lớn | `codegraph sync` |
| `codegraph index` | Xóa và build lại toàn bộ index từ đầu nếu cần | `codegraph index` |

---

## 5. Các Lưu Ý & Xử Lý Sự Cố (Troubleshooting)

1. **Không commit file database lên Git:**
   * File `.codegraph/codegraph.db` đã được cấu hình ignore. Chỉ commit các file `.agents/skills/` và tài liệu hướng dẫn.
2. **Sau khi chuyển nhánh (Git Checkout / Git Pull):**
   * Nếu có lượng lớn thay đổi file từ nhánh khác, bạn có thể chạy `codegraph sync` để cập nhật index mới nhất.
3. **Lỗi Stale Lock (Bị khóa tiến trình index):**
   * Nếu tiến trình bị tắt đột ngột và báo lỗi lock file, chạy lệnh:
     ```bash
     codegraph unlock
     ```
4. **Khởi động lại Daemon giám sát:**
   * Nếu muốn dừng hoặc restart daemon nền:
     ```bash
     codegraph daemon
     ```
