# Feature Specification: 026 Fix Post Media

**Feature Branch**: `026-fix-post-media`

**Created**: 2026-09-28

**Status**: Draft

**Input**: User description: "fix cái post media nha specs\022-community-social\frontend-integration.md em mới bổ sung thêm vô file"

**Source of truth**: `specs/022-community-social/contracts/frontend-integration.md` (bản đã được cập nhật). Feature này là bản fix tiếp theo của `022-community-social`, chỉ giới hạn ở **bài đăng loại `media`** (đăng ảnh/video tự do).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Xem đầy đủ hình ảnh/video của bài đăng media (Priority: P1)

Là một người dùng duyệt cộng đồng, tôi muốn mở một bài đăng dạng `media` có nhiều ảnh/video và xem được **toàn bộ** tập tin đính kèm (không chỉ ảnh đầu tiên), để thưởng thức trọn vẹn bộ sưu tập thời trang của tác giả.

**Why this priority**: Hiện giao diện chỉ hiển thị tệp `media[0]` ở mọi nơi (feed, chi tiết, modal bình luận) trong khi contract cho phép tối đa 10 tệp — người dùng bị mất phần lớn nội dung bài đăng, đây là lỗi cốt lõi của luồng post media.

**Independent Test**: Có thể kiểm thử độc lập bằng cách mở một bài đăng `media` có từ 2 ảnh trở lên trên trang chi tiết `/posts/[postPublicId]`, kiểm tra tất cả ảnh/video hiển thị theo đúng thứ tự `sortOrder`, và video phát được với điều khiển.

**Acceptance Scenarios**:

1. **Given** bài đăng `media` có 3 hình ảnh, **When** mở trang chi tiết bài đăng, **Then** cả 3 ảnh hiển thị lần lượt theo đúng thứ tự tác giả sắp xếp (ảnh/video đầu tiên làm ảnh chính, phần còn lại hiển thị phía dưới hoặc dạng lưới/điều hướng).
2. **Given** bài đăng `media` có chứa video, **When** mở trang chi tiết, **Then** video phát được bằng trình phát có sẵn (play/pause, âm lượng) thay vì bị xem như ảnh tĩnh.
3. **Given** bài đăng `media` chỉ có nội dung chữ, không có tệp nào, **When** mở bài đăng, **Then** không hiển thị vùng ảnh/video lỗi mà chỉ hiển thị nội dung chữ bình thường.
4. **Given** một trong các tệp của bài đăng `media` bị lỗi tải, **When** hiển thị, **Then** tệp lỗi hiển thị placeholder an toàn (không làm trắng trang, không làm vỡ layout) và các tệp còn lại vẫn hiển thị bình thường.

---

### User Story 2 - Đăng bài media đúng ràng buộc của contract (Priority: P1)

Là một người dùng đã đăng nhập, tôi muốn tạo bài đăng `media` (ảnh/video) tuân thủ đúng giới hạn của backend (số lượng tệp, kích thước, thời lượng, định dạng) để bài đăng xuất bản thành công ngay lần đầu, không bị từ chối 400/429.

**Why this priority**: Nếu validate client-side không khớp contract, người dùng bị lỗi 400/429 ngay khi đăng, làm hỏng trải nghiệm và tăng tỉ lệ từ bỏ.

**Independent Test**: Mở trình tạo bài viết, chọn tab "Hình ảnh / Video", thử đăng 1-10 tệp hợp lệ (kể cả video) kèm nội dung; thử đăng bài trống, bài quá 10 tệp, ảnh > 10MB, video > 100MB hoặc > 60 giây — kiểm tra hệ thống chặn đúng và thông báo rõ ràng trước khi gửi lên máy chủ.

**Acceptance Scenarios**:

1. **Given** người dùng chọn 1-10 tệp ảnh/video hợp lệ và có nội dung chữ, **When** nhấn Đăng bài, **Then** toàn bộ tệp được tải lên và bài đăng xuất bản thành công, hiển thị ngay trên feed.
2. **Given** bài đăng `media` không có nội dung chữ và không có tệp nào, **When** nhấn Đăng bài, **Then** hệ thống chặn và thông báo cần ít nhất nội dung hoặc 1 tệp.
3. **Given** người dùng chọn tệp ảnh vượt 10MB hoặc video vượt 100MB / 60 giây, **When** chọn tệp, **Then** hệ thống chặn ngay và thông báo rõ giới hạn mà không tốn băng thông tải lên.
4. **Given** người dùng chọn định dạng không hỗ trợ (ảnh ngoài jpg/png/webp, video ngoài mp4/webm), **When** chọn tệp, **Then** hệ thống từ chối tệp đó và thông báo định dạng hợp lệ.
5. **Given** người dùng chọn hơn 10 tệp, **When** chọn tệp, **Then** hệ thống chỉ nhận 10 tệp đầu và thông báo vượt giới hạn.
6. **Given** máy chủ trả lỗi 429 (quá nhanh) khi tạo bài, **When** hệ thống nhận lỗi, **Then** hiển thị thông báo tiếng Việt "thao tác quá nhanh, thử lại sau" và không tạo bài viết rác.

---

### User Story 3 - Chỉnh sửa bài đăng media giữ nguyên loại và media (Priority: P2)

Là một tác giả, tôi muốn chỉnh sửa bài đăng `media` của mình (đổi tiêu đề/nội dung, thêm/bớt/sắp xếp ảnh và video) mà không làm thay đổi loại bài đăng, để cập nhật bài viết đúng ý muốn.

**Why this priority**: Chỉnh sửa sai payload sẽ bị backend từ chối (loại bài đăng không được đổi) hoặc làm mất tệp media đã đăng, gây mất nội dung người dùng.

**Independent Test**: Mở bài đăng `media` của chính mình, chọn Chỉnh sửa, thay đổi nội dung, xóa 1 ảnh, thêm 1 video mới, lưu lại — kiểm tra bài đăng cập nhật đúng, tệp còn lại giữ nguyên, loại bài vẫn là `media`.

**Acceptance Scenarios**:

1. **Given** tác giả chỉnh sửa bài `media`, **When** thêm hoặc xóa tệp rồi lưu, **Then** danh sách tệp cập nhật đúng (tệp giữ nguyên không bị tải lại, tệp mới được tải lên) và bài đăng phản ánh đúng sau khi lưu.
2. **Given** tác giả chỉnh sửa bài `media` và xóa hết tệp nhưng vẫn còn nội dung chữ, **When** lưu, **Then** bài đăng lưu thành công dưới dạng bài chữ thuần (không bắt buộc giữ tệp).
3. **Given** tác giả đang chỉnh sửa bài `media`, **When** nhìn vào bộ chọn loại bài, **Then** không thể đổi sang `outfit` (loại bài bị khoá).
4. **Given** tác giả đang chỉnh sửa bài `media` và xóa hết tệp lẫn nội dung, **When** lưu, **Then** hệ thống chặn và thông báo bài cần ít nhất nội dung hoặc 1 tệp.

---

### User Story 4 - Feed và chi tiết hiển thị đúng dấu hiệu nhiều tệp media (Priority: P2)

Là một người dùng duyệt bảng tin, tôi muốn biết bài đăng `media` có bao nhiêu ảnh/video ngay từ thẻ bài viết trong feed, và có thể nhấn vào video để vào trang chi tiết, để quyết định có nên mở xem trọn vẹn hay không.

**Why this priority**: Hiện thẻ feed của bài `media` chỉ bỏ một ảnh mà không có dấu hiệu còn tệp khác; bài có video đầu tiên lại không thể bấm vào để vào chi tiết, gây mất khám phá nội dung.

**Independent Test**: Duyệt feed cộng đồng, kiểm tra thẻ bài `media` nhiều ảnh có hiển thị số lượng ảnh (ví dụ "3 ảnh" hoặc lưới xem trước); nhấn vào thẻ bài video để vào được trang chi tiết.

**Acceptance Scenarios**:

1. **Given** bài đăng `media` có nhiều hơn 1 tệp, **When** nhìn vào thẻ bài trong feed, **Then** thẻ bài hiển thị dấu hiệu rõ ràng về số lượng tệp (badge số ảnh hoặc lưới xem trước 2-3 tệp).
2. **Given** bài đăng `media` có tệp đầu tiên là video, **When** bấm vào vùng video trong feed, **Then** chuyển đến trang chi tiết bài đăng (thay vì bị chặn không điều hướng được).
3. **Given** bài đăng `media` có tệp đầu tiên là ảnh, **When** bấm vào ảnh trong feed, **Then** chuyển đến trang chi tiết bài đăng như hiện tại.
4. **Given** bài đăng `media` trong feed, **When** nhấn vào số bình luận hoặc lượt thích, **Then** modal mở ra và hiển thị đúng tệp media của bài (tệp đầu tiên làm ảnh chính).

---

### Edge Cases

- **Bài `media` chỉ có chữ (không tệp)**: vẫn hợp lệ, không hiển thị vùng media rỗng/lỗi.
- **Bài `media` có tệp lỗi URL**: hiển thị placeholder an toàn, không làm vỡ layout, các tệp khác vẫn hoạt động.
- **Video phát trong feed/detail**: chỉ tự phát khi người dùng bật; có nút tắt/bật tiếng và điều khiển play/pause; không gây tiếng ồn bất ngờ.
- **Tải tệp không phải ảnh/video hợp lệ**: bị chặn ngay khi chọn, không gửi lên máy chủ.
- **Quá hạn mức tạo bài (10 bài/giờ)**: thông báo tiếng Việt, không retry dồn dập.
- **Mất kết nối mạng giữa lúc upload**: thông báo lỗi, cho phép thử lại, không tạo bài đăng một nửa.
- **Tác giả bài bị backend không lấy được hồ sơ (`user = null`)**: giao diện hiển thị phòng thủ ("Người dùng ẩn danh"), không vỡ trang.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Trang chi tiết bài đăng `media` PHẢI hiển thị toàn bộ tệp trong `media[]` theo đúng thứ tự `sortOrder`, với tệp đầu tiên làm ảnh chính và các tệp còn lại hiển thị dạng lưới/điều hướng (carousel/grid) có khả năng xem trọn vẹn từng tệp.
- **FR-002**: Hệ thống PHẢI phân biệt và hiển thị đúng từng loại tệp `mediaType`: ảnh dùng khung ảnh, video dùng trình phát có điều khiển (play/pause, âm lượng), kể cả trong feed, chi tiết và modal bình luận.
- **FR-003**: Thẻ bài đăng trong feed của bài `media` nhiều tệp PHẢI hiển thị dấu hiệu số lượng tệp (badge số lượng hoặc lưới xem trước) để người dùng biết còn nội dung phía sau.
- **FR-004**: Người dùng PHẢI điều hướng được vào trang chi tiết từ vùng media của thẻ feed cho cả ảnh lẫn video (vùng video không chặn sự kiện điều hướng).
- **FR-005**: Khi tạo/sửa bài `media`, hệ thống PHẢI validate client-side trước khi gửi: tối đa 10 tệp; ảnh ≤ 10MB (jpg/png/webp); video ≤ 100MB và ≤ 60 giây (mp4/webm); bài cần ít nhất nội dung chữ không rỗng HOẶC ≥ 1 tệp.
- **FR-006**: Khi tệp không hợp lệ (sai định dạng, quá kích thước, quá thời lượng), hệ thống PHẢI chặn ngay khi chọn và thông báo tiếng Việt rõ ràng, không gửi tệp lên máy chủ.
- **FR-007**: Quá trình tải tệp PHẢI lấy chữ ký upload kèm `resourceType` (image/video) và gửi tệp đến đúng cổng tương ứng; mỗi tệp PHẢI có `sortOrder` theo thứ tự hiển thị của tác giả.
- **FR-008**: Khi chỉnh sửa bài `media`, hệ thống PHẢI giữ nguyên các tệp hiện có (không tải lại), chỉ tải lên tệp mới; người dùng KHÔNG được đổi loại bài đăng sang `outfit`; nếu xóa hết tệp thì bài phải còn nội dung chữ mới được lưu.
- **FR-009**: Hệ thống PHẢI xử lý lỗi tải tệp từng phần: nếu một tệp lỗi, các tệp khác vẫn tải thành công và bài đăng không bị tạo một nửa; thông báo lỗi tiếng Việt cho tệp lỗi.
- **FR-010**: Hệ thống PHẢI hiển thị thông báo lỗi tiếng Việt cho các mã lỗi 400 (dữ liệu không hợp lệ), 401 (chưa đăng nhập), 429 (thao tác quá nhanh) và cho phép thử lại sau; không retry tự động dồn dập.
- **FR-011**: Mọi nơi hiển thị media (feed, chi tiết, modal bình luận, lưới bài viết người dùng) PHẢI xử lý phòng thủ khi URL tệp lỗi (placeholder an toàn) và khi thông tin tác giả `user` vắng mặt (`null`).

### Key Entities

- **MediaPost (Bài đăng media)**: Bài đăng loại `media` chia sẻ ảnh/video tự do, bao gồm tiêu đề (không bắt buộc), nội dung chữ, danh sách tệp đính kèm (`media[]`), và thông tin tác giả lồng `user`.
- **PostMedia (Tệp đính kèm)**: Một tệp ảnh hoặc video của bài đăng, gồm loại tệp (`mediaType`: image/video), đường dẫn (`mediaUrl`), mã công khai (`publicId`), và thứ tự hiển thị (`sortOrder`).
- **MediaUpload (Quá trình tải tệp)**: Luồng lấy chữ ký upload kèm loại tài nguyên, gửi tệp lên dịch vụ lưu trữ đám mây, và thu thập `mediaUrl`/`publicId` để tạo payload bài đăng.
- **PostDetailView (Chế độ xem chi tiết)**: Khung hiển thị trọn vẹn toàn bộ tệp của bài `media` kèm trình phát video, dùng chung cho trang chi tiết và modal bình luận.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% bài đăng `media` có từ 2 tệp trở lên hiển thị được toàn bộ tệp (không mất tệp nào) trên trang chi tiết.
- **SC-002**: 100% bài đăng `media` chứa video phát được bằng trình phát có điều khiển (play/pause/âm lượng) tại trang chi tiết và modal bình luận.
- **SC-003**: 100% thẻ bài trong feed của bài `media` nhiều tệp hiển thị dấu hiệu số lượng tệp.
- **SC-004**: 100% người dùng bấm vào vùng video của thẻ feed điều hướng được vào trang chi tiết bài đăng.
- **SC-005**: 0% yêu cầu tạo bài `media` bị backend từ chối vì dữ liệu vượt giới hạn (số tệp, kích thước, thời lượng) khi người dùng đã qua bước validate giao diện.
- **SC-006**: Người dùng hoàn thành việc đăng bài `media` kèm 10 tệp trong dưới 60 giây trên kết nối mạng thông thường.
- **SC-007**: Tỉ lệ tạo bài `media` thành công ngay lần đầu đạt trên 95% đối với người dùng hợp lệ (không tính lỗi mạng).

## Assumptions

- Contract chuẩn: `specs/022-community-social/contracts/frontend-integration.md` là nguồn sự thật cho payload, giới hạn và định dạng dữ liệu của bài đăng `media`.
- Dịch vụ lưu trữ đám mây Cloudinary đã được tích hợp sẵn và giữ nguyên cách lấy chữ ký upload kèm `resourceType` (không đổi phía backend).
- Giới hạn client-side mặc định: tối đa 10 tệp/bài, ảnh ≤ 10MB (jpg/png/webp), video ≤ 100MB và ≤ 60 giây (mp4/webm), nội dung chữ tối đa 5000 ký tự, tiêu đề tối đa 150 ký tự (tham chiếu §3.12 contract).
- Luồng tạo/sửa bài, chỉnh sửa media, và tải lên Cloudinary hiện có được kế thừa; feature này tập trung **sửa các lỗi hiển thị và ràng buộc** của bài đăng `media` cho khớp contract.
- Loại bài đăng (`postType`) không thể thay đổi khi chỉnh sửa (backend quy định).
- Feed/detail chỉ nhận bài `published`; bài `hidden` chỉ tác giả xem được (không nằm trong phạm vi feature này).