# Feature Specification: Community Admin Dashboard (Giao diện Quản trị Cộng đồng)

**Feature Branch**: `029-community-admin-dashboard`

**Created**: 2026-10-04

**Status**: Ready for Planning

**Input**: User description: "làm giao diện dashboard cho admin quản lí community" kèm ảnh Swagger API Community Admin (quản lý bài đăng & bình luận: xem danh sách, ẩn, khôi phục, xóa).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Bảng điều khiển tổng quan và định hướng quản trị cộng đồng (Priority: P1)

Là một Quản trị viên hệ thống (Admin), tôi muốn truy cập một bảng điều khiển tập trung dành riêng cho cộng đồng ngay từ thanh điều hướng chính (Admin Sidebar), hiển thị các thẻ chỉ số tổng quan (tổng bài đăng, tổng bình luận, bài đăng đang ẩn, bình luận cần chú ý) để nhanh chóng nắm bắt tình trạng hoạt động và khối lượng nội dung cần kiểm duyệt.

**Why this priority**: Giúp quản trị viên có cái nhìn toàn cảnh về sức khỏe cộng đồng, dễ dàng chuyển đổi giữa các tác vụ kiểm duyệt bài đăng và bình luận mà không bị phân tán.

**Independent Test**: Đăng nhập bằng tài khoản Admin, nhấn vào mục "Cộng đồng" trên thanh điều hướng bên trái, kiểm tra hiển thị trang Dashboard với các thẻ chỉ số tổng hợp và các tab chuyển đổi nhanh.

**Acceptance Scenarios**:

1. **Given** quản trị viên đăng nhập vào hệ thống quản trị, **When** quan sát thanh menu bên trái (Sidebar), **Then** nhìn thấy mục điều hướng "Cộng đồng" với biểu tượng rõ ràng và trạng thái kích hoạt khi đang ở trang này.
2. **Given** quản trị viên truy cập trang quản trị cộng đồng, **When** trang tải xong, **Then** hệ thống hiển thị các thẻ thống kê tổng quan (Tổng số bài viết, Tổng số bình luận, Số bài viết đang ẩn, Số bình luận cần xử lý).
3. **Given** quản trị viên ở trang quản trị cộng đồng, **When** bấm vào các tab chuyển đổi ("Bài đăng", "Bình luận"), **Then** nội dung danh mục tương ứng được hiển thị mượt mà mà không làm tải lại toàn bộ trang.

---

### User Story 2 - Quản lý và kiểm duyệt bài đăng cộng đồng (Priority: P1)

Là một Quản trị viên, tôi muốn xem danh sách bài đăng toàn hệ thống, tìm kiếm theo từ khóa/tác giả, lọc theo trạng thái (`published`, `hidden`, `deleted`), xem trước nội dung chi tiết bài viết (hình ảnh, video, trang phục liên kết), và thực hiện các thao tác quản trị trực tiếp (ẩn bài viết vi phạm, khôi phục bài viết, xóa bài viết).

**Why this priority**: Đảm bảo môi trường mạng xã hội thời trang văn minh, lành mạnh; loại bỏ nội dung vi phạm tiêu chuẩn cộng đồng kịp thời và khôi phục nội dung khi có khiếu nại hợp lệ.

**Independent Test**: Mở tab "Bài đăng", tìm kiếm một bài viết theo tiêu đề hoặc tên tác giả, lọc trạng thái "Đang ẩn", nhấn nút "Ẩn bài viết" cho một bài công khai và kiểm tra trạng thái cập nhật tức thì; sau đó thử "Khôi phục" và "Xóa" với hộp thoại xác nhận.

**Acceptance Scenarios**:

1. **Given** quản trị viên ở tab Bài đăng, **When** danh sách hiển thị, **Then** mỗi dòng/thẻ bài viết cung cấp thông tin: tác giả (ảnh đại diện, tên, username), tóm tắt tiêu đề/nội dung, ảnh/video hoặc trang phục liên kết, chỉ số tương tác (lượt thích, bình luận), ngày đăng và nhãn trạng thái (Công khai, Đang ẩn, Đã xóa).
2. **Given** quản trị viên muốn tìm bài viết cụ thể, **When** nhập từ khóa vào ô tìm kiếm hoặc chọn lọc trạng thái, **Then** danh sách lọc đúng các bài viết phù hợp kèm phân trang rõ ràng.
3. **Given** một bài viết có nội dung vi phạm hoặc nhạy cảm, **When** quản trị viên bấm "Ẩn bài viết", **Then** hệ thống cập nhật trạng thái bài viết thành "Đang ẩn", bài viết lập tức không còn hiển thị với công chúng trên bảng tin người dùng, và hiển thị thông báo thành công.
4. **Given** một bài viết đang ở trạng thái ẩn do nhầm lẫn, **When** quản trị viên bấm "Khôi phục bài viết", **Then** trạng thái bài chuyển về "Công khai" và hiển thị trở lại trên bảng tin cộng đồng.
5. **Given** một bài viết vi phạm nghiêm trọng cần loại bỏ, **When** quản trị viên bấm "Xóa bài viết", **Then** một hộp thoại cảnh báo an toàn hiển thị yêu cầu xác nhận trước khi thực hiện xóa vĩnh viễn/đánh dấu xóa.
6. **Given** quản trị viên cần kiểm tra kỹ nội dung bài viết trước khi quyết định, **When** bấm xem chi tiết bài đăng, **Then** một cửa sổ xem trước (Preview Modal) mở ra hiển thị toàn văn nội dung, tệp đa phương tiện kích thước đầy đủ và thông tin trang phục phối đồ liên kết.

---

### User Story 3 - Quản lý và kiểm duyệt bình luận (Priority: P2)

Là một Quản trị viên, tôi muốn xem danh sách bình luận trên toàn bộ sàn, tìm kiếm theo nội dung/người bình luận, lọc theo trạng thái, và thực hiện các hành động ẩn, khôi phục hoặc xóa các bình luận chứa từ ngữ thô tục, quảng cáo rác hoặc công kích cá nhân.

**Why this priority**: Giữ cho các cuộc thảo luận thời trang luôn tích cực, xử lý triệt để spam và bình luận tiêu cực ảnh hưởng đến trải nghiệm của cộng đồng.

**Independent Test**: Mở tab "Bình luận", xem danh sách bình luận toàn sàn, lọc theo trạng thái, tìm kiếm bình luận chứa từ khóa nhất định, thực hiện ẩn/khôi phục/xóa một bình luận và xác nhận cập nhật trên giao diện.

**Acceptance Scenarios**:

1. **Given** quản trị viên ở tab Bình luận, **When** danh sách tải xong, **Then** hiển thị đầy đủ thông tin: người bình luận, nội dung bình luận, mã/tiêu đề bài viết chứa bình luận, thời gian bình luận và trạng thái (Hoạt động, Đã ẩn/xóa).
2. **Given** quản trị viên nhập từ khóa tìm kiếm bình luận hoặc chọn lọc trạng thái, **When** dữ liệu được nạp, **Then** bảng hiển thị danh sách kết quả phù hợp với số trang phân đoạn chính xác.
3. **Given** bình luận có nội dung rác hoặc xúc phạm, **When** quản trị viên bấm "Ẩn bình luận", **Then** bình luận bị ẩn khỏi luồng thảo luận công khai và cập nhật trạng thái trên bảng kiểm duyệt.
4. **Given** bình luận đã bị ẩn cần được hiển thị lại, **When** quản trị viên chọn "Khôi phục bình luận", **Then** bình luận trở lại trạng thái hoạt động bình thường.
5. **Given** bình luận vi phạm nghiêm trọng cần xóa, **When** quản trị viên chọn "Xóa bình luận" và xác nhận trong hộp thoại, **Then** bình luận được xóa an toàn kèm thông báo phản hồi rõ ràng.

---

### User Story 4 - Xem và xử lý bình luận theo ngữ cảnh bài viết (Priority: P3)

Là một Quản trị viên đang xem một bài đăng cụ thể, tôi muốn mở danh sách toàn bộ các bình luận thuộc bài viết đó trong một khung nhìn tiện lợi (Drawer hoặc Modal) để kiểm duyệt toàn bộ luồng thảo luận của bài viết đó mà không cần rời khỏi trang quản lý bài đăng.

**Why this priority**: Tăng tốc độ kiểm duyệt và giúp quản trị viên hiểu rõ ngữ cảnh của cuộc thảo luận trước khi đưa ra quyết định xử phạt.

**Independent Test**: Tại một bài đăng có nhiều bình luận, nhấn nút "Xem bình luận", kiểm tra khung nhìn danh sách bình luận của riêng bài viết đó mở ra, thực hiện thao tác ẩn/xóa một bình luận bên trong và xác nhận giao diện cập nhật ngay lập tức.

**Acceptance Scenarios**:

1. **Given** quản trị viên xem một bài đăng trong danh sách, **When** nhấn nút "Xem bình luận" (kèm số lượng bình luận), **Then** khung hiển thị danh sách bình luận riêng của bài viết đó mở ra.
2. **Given** khung bình luận ngữ cảnh đang mở, **When** quản trị viên thao tác ẩn hoặc xóa một bình luận vi phạm, **Then** bình luận đó được cập nhật trạng thái ngay tại chỗ và số lượng bình luận trên bài viết được đồng bộ.

---

### Edge Cases

- **Mất kết nối mạng hoặc lỗi phản hồi từ máy chủ khi thực hiện thao tác**: Hệ thống hiển thị thông báo lỗi thân thiện bằng tiếng Việt ("Không thể thực hiện thao tác, vui lòng thử lại"), đồng thời giữ nguyên trạng thái cũ trên giao diện, không để xảy ra hiện tượng lệch dữ liệu.
- **Thao tác lặp lại nhiều lần liên tục (Double-click)**: Các nút bấm hành động (Ẩn, Khôi phục, Xóa) tự động chuyển sang trạng thái đang xử lý (loading spinner và disabled) trong lúc chờ phản hồi từ máy chủ để ngăn chặn gửi nhiều yêu cầu trùng lặp.
- **Bài viết chứa tệp đa phương tiện bị lỗi tải hoặc đã xóa trên dịch vụ lưu trữ**: Giao diện hiển thị khung giữ chỗ (placeholder) hình ảnh mặc định trang nhã, tránh làm bể bố cục hoặc gây lỗi ứng dụng.
- **Nội dung văn bản quá dài**: Văn bản tiêu đề và nội dung trên bảng danh sách tự động cắt gọn với dấu ba chấm, kèm nút xem thêm hoặc tooltip để xem trọn vẹn mà không phá vỡ cấu trúc bảng.
- **Không tìm thấy kết quả tìm kiếm/lọc**: Hiển thị trạng thái rỗng (Empty State) với thông điệp rõ ràng hướng dẫn người dùng thử tìm kiếm bằng từ khóa khác hoặc đặt lại bộ lọc.
- **Xóa nhầm nội dung**: Bắt buộc phải có hộp thoại xác nhận (AlertDialog) giải thích rõ hậu quả trước khi thực hiện thao tác xóa bài viết hoặc bình luận.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Hệ thống PHẢI bổ sung mục điều hướng "Cộng đồng" trên thanh điều hướng bên trái (`AdminSidebar`) của khu vực quản trị viên, liên kết trực tiếp tới giao diện Quản trị Cộng đồng.
- **FR-002**: Hệ thống PHẢI cung cấp bảng điều khiển trung tâm hiển thị các chỉ số tổng quan về cộng đồng: Tổng số bài viết, Tổng số bình luận, Số lượng bài viết đang ẩn, và Số lượng bình luận đã xử lý.
- **FR-003**: Hệ thống PHẢI cung cấp cơ chế chuyển đổi dạng tab mượt mà giữa hai khu vực quản lý chính: "Quản lý bài đăng" và "Quản lý bình luận".
- **FR-004**: Bảng quản lý bài đăng PHẢI hiển thị danh sách bài viết phân trang gồm: mã định danh, thông tin tác giả (ảnh đại diện, họ tên, username), tóm tắt tiêu đề/nội dung, loại nội dung (`outfit` hoặc `media`), hình ảnh/video xem trước, chỉ số tương tác (lượt thích, lượt bình luận), thời điểm đăng và nhãn trạng thái trực quan.
- **FR-005**: Hệ thống PHẢI hỗ trợ lọc bài viết theo trạng thái (`Tất cả`, `Công khai`, `Đang ẩn`, `Đã xóa`) và tìm kiếm bài viết theo từ khóa nội dung hoặc tên tác giả.
- **FR-006**: Quản trị viên PHẢI có khả năng ẩn một bài viết công khai vi phạm tiêu chuẩn cộng đồng, bài viết sau khi ẩn sẽ không còn hiển thị với người dùng thông thường trên bảng tin.
- **FR-007**: Quản trị viên PHẢI có khả năng khôi phục một bài viết đang ẩn trở lại trạng thái công khai.
- **FR-008**: Quản trị viên PHẢI có khả năng xóa một bài viết, và hệ thống BẮT BUỘC hiển thị hộp thoại xác nhận cảnh báo trước khi tiến hành xóa.
- **FR-009**: Hệ thống PHẢI cung cấp cửa sổ xem trước bài viết chi tiết (Preview Modal) hiển thị toàn bộ nội dung, danh sách ảnh/video kích thước lớn, thông tin chi tiết bộ trang phục tủ đồ liên kết và đường dẫn xem bài viết thực tế.
- **FR-010**: Bảng quản lý bình luận PHẢI hiển thị danh sách bình luận phân trang gồm: thông tin người bình luận (ảnh đại diện, họ tên, username), nội dung bình luận, mã/tiêu đề bài viết liên kết, thời điểm bình luận và nhãn trạng thái.
- **FR-011**: Hệ thống PHẢI hỗ trợ lọc bình luận theo trạng thái (`Tất cả`, `Hoạt động`, `Đã ẩn/xóa`) và tìm kiếm bình luận theo từ khóa nội dung hoặc tên người gửi.
- **FR-012**: Quản trị viên PHẢI có khả năng ẩn một bình luận vi phạm tiêu chuẩn cộng đồng khỏi bài viết tương ứng.
- **FR-013**: Quản trị viên PHẢI có khả năng khôi phục một bình luận đã bị ẩn trở lại hoạt động bình thường.
- **FR-014**: Quản trị viên PHẢI có khả năng xóa vĩnh viễn hoặc đánh dấu xóa một bình luận vi phạm, kèm hộp thoại xác nhận an toàn.
- **FR-015**: Hệ thống PHẢI cho phép mở nhanh danh sách các bình luận thuộc về một bài viết cụ thể trực tiếp từ danh sách bài đăng để quản trị theo ngữ cảnh.
- **FR-016**: Mọi thao tác thay đổi trạng thái (ẩn, khôi phục, xóa) PHẢI hiển thị trạng thái đang xử lý (loading state), tự động cập nhật lại danh sách dữ liệu ngay khi hoàn tất và thông báo kết quả bằng tiếng Việt rõ ràng.
- **FR-017**: Giao diện PHẢI tuân thủ đầy đủ hệ thống thiết kế chung của khu vực quản trị viên Smart Wardrobe (phối màu đồng bộ, hỗ trợ giao diện sáng/tối, bố cục lưới chuẩn mực và trải nghiệm phản hồi nhanh nhạy).

### Key Entities

- **CommunityPostAdmin**: Đại diện cho bài viết trong hệ thống quản trị, bao gồm mã công khai nhận diện, thông tin tác giả đầy đủ (ID, username, họ tên, ảnh đại diện), loại bài đăng (`outfit` hoặc `media`), tiêu đề, nội dung, danh sách tệp đa phương tiện, thông tin bộ trang phục đính kèm, số lượt thích, số lượng bình luận, trạng thái kiểm duyệt (`published`, `hidden`, `deleted`) và thời gian tạo/cập nhật.
- **CommunityCommentAdmin**: Đại diện cho bình luận trong hệ thống quản trị, bao gồm mã định danh bình luận, thông tin tác giả bình luận (ID, username, họ tên, ảnh đại diện), nội dung bình luận, mã bài viết cha, trạng thái bình luận (`active`, `hidden`, `deleted`) và thời gian đăng.
- **CommunityDashboardMetrics**: Đại diện cho các chỉ số tổng hợp báo cáo sức khỏe cộng đồng, bao gồm tổng số lượng bài viết, tổng số lượng bình luận, số bài viết đang bị ẩn và số lượng nội dung đã xóa.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Quản trị viên có thể tìm kiếm, xác định và thực hiện thao tác ẩn hoặc khôi phục bất kỳ bài viết hoặc bình luận vi phạm nào trong vòng dưới 15 giây.
- **SC-002**: 100% các thao tác có tính hủy hoại (xóa bài viết, xóa bình luận) đều bắt buộc trải qua bước xác nhận qua hộp thoại cảnh báo an toàn.
- **SC-003**: Thời gian chuyển đổi giữa các tab và áp dụng bộ lọc trạng thái diễn ra tức thì, danh sách hiển thị cập nhật dữ liệu mới trong vòng dưới 1 giây.
- **SC-004**: Phản hồi trực quan (thông báo toast và cập nhật nhãn trạng thái trên giao diện) xuất hiện ngay sau khi thao tác kiểm duyệt hoàn thành trong vòng dưới 500ms.
- **SC-005**: 100% văn bản giao diện, thông báo lỗi, thông báo thành công và nhãn trạng thái được trình bày bằng tiếng Việt chuẩn xác, thân thiện và chuyên nghiệp.
- **SC-006**: Đạt mức độ hài lòng về tính dễ sử dụng và rõ ràng của giao diện quản trị từ người dùng nội bộ trên 90%.

## Assumptions

- Người dùng truy cập trang quản trị cộng đồng đã được xác thực danh tính và có quyền quản trị viên (`admin`) hoặc kiểm duyệt viên (`moderator`).
- Các cổng giao tiếp dữ liệu máy chủ (API) của quản trị cộng đồng (/admin/posts, /admin/comments, các tác vụ /hide, /restore, /delete) đã sẵn sàng và tuân thủ định dạng phản hồi chuẩn của hệ thống.
- Các chỉ số tổng quan (KPIs) có thể được tổng hợp trực tiếp từ thông tin phân trang (metadata) của các danh sách bài viết/bình luận theo từng trạng thái.
- Bài viết và bình luận bị ẩn bởi quản trị viên vẫn được lưu giữ trong cơ sở dữ liệu để phục vụ việc tra soát và khôi phục khi cần thiết.
