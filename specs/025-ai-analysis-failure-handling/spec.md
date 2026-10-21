# Feature Specification: Luồng xử lý khi AI phân tích ảnh lỗi

**Feature Branch**: `025-ai-analysis-failure-handling`

**Created**: 2026-09-28

**Status**: Draft

**Input**: User description: "luồng xử lí nếu AI phân tích ảnh lỗi specs\023-analyze-status-handling\frontend-guide.md"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Thấy rõ món đồ bị phân tích lỗi và thử lại (Priority: P1)

Người dùng upload ảnh trang phục, chờ AI phân tích, nhưng một hoặc nhiều ảnh bị lỗi. Người dùng thấy ngay món nào lỗi (badge/thông báo), hiểu lý do ở mức thân thiện, và bấm "Thử phân tích lại" để hệ thống chạy lại phân tích cho món đó mà không cần upload lại ảnh.

**Why this priority**: Đây là luồng phục hồi cốt lõi. Nếu không có, ảnh lỗi bị kẹt ở trạng thái treo hoặc biến mất, người dùng mất niềm tin vào tính năng upload AI.

**Independent Test**: Có thể kiểm thử độc lập bằng cách tạo một món đồ ở trạng thái phân tích lỗi, mở trang chi tiết/tủ đồ, xác nhận thấy chỉ báo lỗi + nút thử lại, bấm nút và xác nhận món chuyển sang trạng thái đang phân tích rồi hoàn tất hoặc lỗi lại.

**Acceptance Scenarios**:

1. **Given** một món đồ có trạng thái phân tích lỗi, **When** người dùng mở tủ đồ hoặc trang chi tiết món đó, **Then** hệ thống hiển thị chỉ báo "Phân tích thất bại" và nút/hành động "Thử phân tích lại".
2. **Given** người dùng đang xem món bị lỗi, **When** người dùng bấm "Thử phân tích lại", **Then** hệ thống chuyển món sang trạng thái đang phân tích, hiển thị trạng thái chờ, và sau đó cập nhật kết quả mới (thành công hoặc lỗi lại) mà không yêu cầu upload lại ảnh.

---

### User Story 2 - Nhận thông báo realtime khi phân tích đang chạy bị lỗi (Priority: P1)

Người dùng đang ở trang tủ đồ trong lúc AI phân tích ngầm. Khi một task phân tích thất bại, người dùng nhận được thông báo lỗi ngay lúc đó (không cần tải lại trang), và danh sách tự cập nhật trạng thái món sang lỗi.

**Why this priority**: Phân tích AI tốn 20–40 giây chạy ngầm. Nếu không có thông báo kịp thời, người dùng tưởng hệ thống treo và thoát trang.

**Independent Test**: Có thể kiểm thử độc lập bằng cách upload ảnh rồi ở lại trang tủ đồ, giả lập sự kiện phân tích thất bại, xác nhận toast lỗi hiển thị và item trong danh sách chuyển sang trạng thái lỗi.

**Acceptance Scenarios**:

1. **Given** người dùng đang xem danh sách có món đang phân tích, **When** quá trình phân tích của món đó thất bại, **Then** hệ thống hiển thị thông báo lỗi thân thiện và cập nhật trạng thái món sang lỗi trong danh sách hiện tại.
2. **Given** nhiều món cùng phân tích trong một lần upload, **When** một phần thành công và một phần thất bại, **Then** hệ thống cập nhật đúng từng món (món thành công hiển thị bình thường, món lỗi hiển thị chỉ báo lỗi), không đánh dấu sai toàn bộ.

---

### User Story 3 - Tự phân loại thủ công khi AI bó tay (Priority: P2)

Sau khi thử lại vẫn lỗi (hoặc người dùng không muốn chờ), người dùng có thể tự nhập/chọn danh mục và thuộc tính cơ bản (danh mục, màu, chất liệu...) để đưa món vào tủ đồ và dùng như món bình thường.

**Why this priority**: Đảm bảo không có món nào "kẹt chết". Người dùng luôn có lối thoát thủ công để tiếp tục dùng tủ đồ, phối đồ.

**Independent Test**: Có thể kiểm thử độc lập bằng cách mở món đang lỗi, chọn phân loại thủ công, lưu, và xác nhận món chuyển sang trạng thái dùng được trong tủ đồ.

**Acceptance Scenarios**:

1. **Given** một món đang ở trạng thái lỗi, **When** người dùng mở hành động phân loại/sửa thủ công và lưu thông tin hợp lệ, **Then** món chuyển sang trạng thái dùng được với thông tin do người dùng nhập.
2. **Given** người dùng đã phân loại thủ công cho món từng lỗi, **When** mở lại trang chi tiết, **Then** thông tin thủ công được hiển thị như mọi món bình thường khác.

---

### User Story 4 - Dọn dẹp món lỗi không muốn giữ (Priority: P3)

Người dùng có thể xóa một hoặc nhiều món đang lỗi khỏi tủ đồ để danh sách gọn gàng.

**Why this priority**: Giảm rác dữ liệu và giảm bối rối khi có nhiều ảnh lỗi (ảnh mờ, sai đối tượng, trùng lặp).

**Independent Test**: Có thể kiểm thử độc lập bằng cách chọn món lỗi, thực hiện xóa, xác nhận món biến mất khỏi danh sách và không còn xuất hiện sau khi tải lại.

**Acceptance Scenarios**:

1. **Given** có ít nhất một món ở trạng thái lỗi, **When** người dùng xóa món đó và xác nhận, **Then** món biến mất khỏi tủ đồ và không quay lại sau khi tải lại trang.

### Edge Cases

- Mất kết nối realtime giữa chừng (timeout gateway, rớt mạng): hệ thống phải tự đồng bộ lại trạng thái khi người dùng mở lại trang hoặc kết nối lại, không để món kẹt mãi ở "đang phân tích".
- Task đã xong trước khi màn hình realtime kịp mở (xử lý quá nhanh): khi mở trang, hệ thống phải hiển thị trạng thái cuối cùng đúng (thành công/lỗi), không chờ vô hạn.
- Lỗi hàng loạt khi upload nhiều ảnh: mỗi ảnh có trạng thái độc lập; một ảnh lỗi không chặn các ảnh khác hoàn tất.
- Người dùng bấm thử lại nhiều lần liên tiếp: hệ thống ngăn chạy trùng lặp (vô hiệu hóa nút khi đang thử lại) và mỗi lần thử lại đều cho kết quả rõ ràng.
- Phân biệt "lỗi hẳn" với "cần người dùng chọn lại danh mục": hai trạng thái hiển thị và hành động khác nhau, không gộp chung thành một thông báo lỗi chung.
- Ảnh gốc vẫn phải xem được khi phân tích lỗi: người dùng luôn thấy được ảnh đã upload để quyết định thử lại, tự phân loại, hay xóa.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Hệ thống MUST hiển thị trạng thái phân tích của từng món (đang phân tích / thành công / thất bại / cần xem lại) ở cả danh sách tủ đồ và trang chi tiết món.
- **FR-002**: Hệ thống MUST thông báo cho người dùng ngay khi một quá trình phân tích đang theo dõi chuyển sang thất bại, bằng thông điệp thân thiện, không dùng mã lỗi kỹ thuật thô.
- **FR-003**: Người dùng MUST có thể kích hoạt "thử phân tích lại" từ món đang lỗi mà không phải upload lại ảnh.
- **FR-004**: Hệ thống MUST chuyển món sang trạng thái "đang phân tích" ngay sau khi người dùng bấm thử lại và cập nhật kết quả cuối cùng khi quá trình mới kết thúc.
- **FR-005**: Hệ thống MUST ngăn kích hoạt thử lại trùng lặp trong khi một lần thử lại đang chạy (ví dụ vô hiệu hóa nút và hiển thị trạng thái đang thử).
- **FR-006**: Người dùng MUST có thể tự phân loại thủ công (chọn danh mục và thuộc tính cơ bản) cho món đang lỗi để đưa món về trạng thái dùng được.
- **FR-007**: Người dùng MUST có thể xóa món đang lỗi (đơn lẻ) và món lỗi biến mất khỏi mọi danh sách sau khi xóa.
- **FR-008**: Hệ thống MUST giữ ảnh gốc của món lỗi luôn xem được để người dùng ra quyết định (thử lại / tự phân loại / xóa).
- **FR-009**: Hệ thống MUST đồng bộ lại trạng thái đúng khi người dùng mở/tải lại trang, kể cả khi sự kiện realtime bị lỡ (task xong trước khi theo dõi, mất mạng, timeout).
- **FR-010**: Hệ thống MUST xử lý trạng thái độc lập cho từng ảnh trong một lần upload hàng loạt; lỗi của một ảnh không chặn hoặc ghi đè trạng thái các ảnh khác.
- **FR-011**: Hệ thống MUST phân biệt và hiển thị khác nhau giữa "phân tích thất bại" và "cần người dùng xem lại/chọn lại danh mục", mỗi loại có hành động tiếp theo phù hợp.
- **FR-012**: Hệ thống MUST ghi nhận số lần thử lại và kết quả cuối cùng của món để hỗ trợ chẩn đoán (hiển thị cho người dùng ở mức đơn giản, chi tiết kỹ thuật chỉ dành cho chẩn đoán nội bộ).

### Key Entities

- **Món tủ đồ (Wardrobe Item)**: Trang phục người dùng upload; có trạng thái phân tích (đang phân tích, trong tủ, thất bại, cần xem lại), ảnh gốc, và dữ liệu thuộc tính do AI hoặc người dùng nhập.
- **Tác vụ phân tích (Analysis Task)**: Một lần chạy phân tích AI cho một hoặc nhiều món; có trạng thái cuối (hoàn tất / thất bại / cần xem lại) và thông điệp lỗi thân thiện khi thất bại.
- **Kết quả lỗi phân tích (Analysis Failure)**: Bản ghi khi phân tích thất bại; gồm lý do thân thiện với người dùng, thời điểm xảy ra, và số lần đã thử lại.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% món bị phân tích lỗi hiển thị chỉ báo lỗi và hành động phục hồi (thử lại / tự phân loại / xóa) khi người dùng mở tủ đồ hoặc trang chi tiết.
- **SC-002**: Người dùng nhận được thông báo khi phân tích thất bại trong vòng 5 giây kể từ khi hệ thống xác định thất bại, khi đang ở trang theo dõi.
- **SC-003**: 95% thao tác "thử phân tích lại" hoàn tất việc chuyển trạng thái (sang đang phân tích rồi sang kết quả cuối) mà không yêu cầu upload lại trong lần thử đầu tiên.
- **SC-004**: Không còn món nào kẹt ở trạng thái "đang phân tích" quá 10 phút sau khi tải lại trang — mọi món đều hội tụ về trạng thái cuối đúng (thành công / lỗi / cần xem lại).
- **SC-005**: 90% người dùng gặp lỗi hoàn tất được một trong ba lối thoát (thử lại thành công, tự phân loại, hoặc xóa) mà không cần hỗ trợ ngoài trong lần đầu gặp lỗi.

## Assumptions

- Tham chiếu `specs\023-analyze-status-handling\frontend-guide.md` trong yêu cầu hiện không tồn tại trong kho (chỉ có `023-profile-limits-auth-session` và `024-ai-stylist-canvas-layout`); spec này được viết độc lập dựa trên hành vi hiện tại của tủ đồ (upload hàng loạt tối đa 5 ảnh, trạng thái đang phân tích/thất bại/cần xem lại, thử lại phân tích, cập nhật realtime).
- Luồng này chỉ bao phủ phía trải nghiệm người dùng; các sửa đổi phía máy chủ/cập nhật realtime (heartbeat, loại sự kiện, kiểm tra sở hữu, idempotency) được ghi trong `docs/Note.md` được xem là phụ thuộc ngoài, không thuộc phạm vi spec này.
- Thông điệp lỗi hiển thị cho người dùng dùng tiếng Việt, thân thiện; không lộ chi tiết kỹ thuật nội bộ.
- Giới hạn upload 5 ảnh/lần và các quy tắc upload hiện tại được giữ nguyên.
- Người dùng đã đăng nhập; phân quyền xem/sửa món thuộc về chủ sở hữu (kế thừa từ spec 023).
