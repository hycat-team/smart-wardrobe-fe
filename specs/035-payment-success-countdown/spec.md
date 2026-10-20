# Feature Specification: 035 Payment Success Countdown Redirect

**Feature Branch**: `035-payment-success-countdown`

**Created**: 2026-10-16

**Status**: Draft

**Input**: User description: "ở phần thanh toán thành công thêm thời gian đếm ngược và tự động quay về trang nếu người dùng không nhấn tiếp tục (lưu ý quay về trang theo trang khi người dùng nhấn tiếp tục)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Tự động quay về trang đích sau khi thanh toán thành công (Priority: P1)

Là một người dùng vừa hoàn tất giao dịch thanh toán thành công (nạp tiền vào ví hoặc mua gói hội viên), tôi muốn sau khi nhìn thấy màn hình thông báo thanh toán thành công, hệ thống sẽ hiển thị thời gian đếm ngược và tự động đưa tôi trở về trang đích tương ứng nếu tôi không thực hiện thao tác nào, giúp trải nghiệm liền mạch và không bắt buộc tôi phải tự tay bấm nút.

**Why this priority**: Sau khi quét mã QR hoặc hoàn tất thanh toán từ cổng thanh toán bên thứ ba quay về, người dùng thường có xu hướng chỉ nhìn màn hình xác nhận thành công rồi chờ đợi. Việc tự động chuyển hướng giúp giảm thao tác thừa, tối ưu hành trình người dùng và đưa họ về đúng khu vực sử dụng tính năng ngay lập tức.

**Independent Test**: Thực hiện giao dịch thanh toán (nạp ví hoặc mua gói) thành công; chuyển hướng về trang kết quả thanh toán; quan sát giao diện hiển thị đồng hồ đếm ngược thời gian và giữ nguyên không bấm bất kỳ nút nào; kiểm tra sau khi đếm ngược về 0 thì trình duyệt tự động điều hướng về đúng trang đích (ví dụ: tab Ví trong trang cá nhân khi nạp ví, hoặc trang Bảng giá khi mua gói dịch vụ).

**Acceptance Scenarios**:

1. **Given** người dùng hoàn tất nạp tiền thành công và đang ở trang kết quả thanh toán, **When** hệ thống hoàn tất đồng bộ số dư ví, **Then** đồng hồ đếm ngược (5 giây) bắt đầu chạy và hiển thị rõ ràng trên giao diện.
2. **Given** đồng hồ đếm ngược đang hiển thị và người dùng không nhấn nút tiếp tục, **When** thời gian đếm ngược kết thúc (chạm mốc 0 giây), **Then** hệ thống tự động chuyển hướng người dùng về đúng trang quản lý ví cá nhân với số dư mới đã cập nhật.
3. **Given** người dùng mua gói dịch vụ thành công từ trang bảng giá, **When** thời gian đếm ngược kết thúc mà người dùng không nhấn tiếp tục, **Then** hệ thống tự động chuyển hướng người dùng quay lại đúng trang bảng giá với trạng thái gói dịch vụ đã kích hoạt.

---

### User Story 2 - Người dùng chủ động nhấn tiếp tục trong thời gian đếm ngược (Priority: P1)

Là một người dùng không muốn chờ hết thời gian đếm ngược, tôi muốn có thể bấm nút "Tiếp tục" bất kỳ lúc nào để chuyển hướng ngay lập tức đến trang đích mà không phải chờ đợi.

**Why this priority**: Mang lại quyền kiểm soát tối đa cho người dùng chủ động, đảm bảo thời gian đếm ngược không làm cản trở hay làm chậm trải nghiệm của những người dùng muốn quay lại trang làm việc ngay lập tức.

**Independent Test**: Tại màn hình thanh toán thành công khi đồng hồ đếm ngược đang chạy, nhấn ngay nút "Tiếp tục"; kiểm tra hệ thống điều hướng tức thì tới trang đích và hủy bỏ hoàn toàn tác vụ hẹn giờ tự động để không xảy ra chuyển hướng trùng lặp.

**Acceptance Scenarios**:

1. **Given** người dùng đang ở trang kết quả thanh toán thành công và đồng hồ đếm ngược đang chạy, **When** người dùng nhấn nút "Tiếp tục", **Then** hệ thống lập tức điều hướng đến trang đích tương ứng.
2. **Given** người dùng đã nhấn nút "Tiếp tục" thủ công, **When** điều hướng diễn ra, **Then** bộ đếm ngược bị hủy bỏ ngay lập tức và không thực hiện bất kỳ lệnh điều hướng tự động bổ sung nào sau đó.

---

### User Story 3 - Giữ nguyên màn hình khi giao dịch bị hủy hoặc không thành công (Priority: P2)

Là một người dùng gặp sự cố thanh toán hoặc chủ động hủy giao dịch trên cổng thanh toán, tôi muốn màn hình kết quả thông báo rõ ràng lý do hủy/thất bại và KHÔNG tự động chuyển hướng rời đi, để tôi có đủ thời gian đọc thông tin và lựa chọn hành động thử lại phù hợp.

**Why this priority**: Trong kịch bản giao dịch có vấn đề, việc tự động chuyển trang sẽ làm người dùng mất thông tin lỗi hoặc nghi ngờ về việc tiền có bị trừ hay chưa. Người dùng cần chủ động đọc thông báo và quyết định hành động tiếp theo.

**Independent Test**: Hủy thanh toán hoặc mô phỏng giao dịch thất bại; kiểm tra trang kết quả hiển thị thông báo hủy/lỗi tương ứng; xác nhận không có bất kỳ bộ đếm ngược nào chạy và màn hình không tự động chuyển trang nếu người dùng không tương tác.

**Acceptance Scenarios**:

1. **Given** giao dịch bị hủy trên cổng thanh toán, **When** người dùng được đưa về trang kết quả, **Then** giao diện hiển thị thông báo giao dịch đã bị hủy, không hiển thị đồng hồ đếm ngược và không tự động chuyển trang.
2. **Given** giao dịch gặp lỗi xử lý hoặc không xác định, **When** người dùng ở trên trang kết quả, **Then** hệ thống giữ nguyên màn hình để người dùng chủ động xem xét hoặc tự bấm nút chuyển trang khi đã sẵn sàng.

---

### Edge Cases

- **Người dùng rời khỏi trang hoặc đóng trình duyệt trước khi đếm ngược kết thúc**: Tiến trình đếm ngược và hẹn giờ tự động phải được dọn dẹp an toàn trong bộ nhớ để tránh rò rỉ hoặc kích hoạt chuyển trang ngầm.
- **Tham số trang đích (`next`) được tùy biến hoặc không hợp lệ**: Cơ chế xác định trang đích cho việc tự động chuyển hướng phải sử dụng chung logic kiểm tra an toàn với nút bấm thủ công (chặn các liên kết ngoài, ngăn open redirect); nếu không hợp lệ thì fallback về trang mặc định theo luồng giao dịch.
- **Quá trình cập nhật dữ liệu tài khoản mất thời gian**: Bộ đếm ngược tự động chuyển trang chỉ được kích hoạt sau khi hệ thống hoàn tất đồng bộ dữ liệu tài khoản (số dư ví, gói dịch vụ), đảm bảo khi chuyển về trang đích thì dữ liệu đã được làm mới hoàn chỉnh.
- **Người dùng bấm liên tiếp vào nút "Tiếp tục"**: Thao tác chỉ kích hoạt điều hướng một lần duy nhất, vô hiệu hóa các lần nhấn tiếp theo để tránh xung đột lịch sử duyệt trang.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Hệ thống PHẢI hiển thị đồng hồ đếm ngược thời gian trực quan trên trang kết quả thanh toán khi giao dịch ở trạng thái thành công.
- **FR-002**: Thời gian đếm ngược mặc định PHẢI là 5 giây (đếm lùi từ 5 về 0) tính từ thời điểm dữ liệu tài khoản hoàn tất cập nhật.
- **FR-003**: Hệ thống PHẢI tự động điều hướng người dùng về trang đích tương ứng khi thời gian đếm ngược chạm mốc 0 giây mà người dùng không bấm nút "Tiếp tục".
- **FR-004**: Trang đích khi tự động điều hướng PHẢI hoàn toàn trùng khớp với trang đích khi người dùng bấm nút "Tiếp tục" (ưu tiên tham số trang đích hợp lệ `next`; nếu không có thì điều hướng theo loại giao dịch: mua gói chuyển về trang bảng giá, nạp ví chuyển về tab ví trong trang hồ sơ).
- **FR-005**: Nếu người dùng bấm nút "Tiếp tục" trong khi thời gian đếm ngược đang chạy, hệ thống PHẢI ngay lập tức chuyển hướng người dùng tới trang đích và hủy bỏ tiến trình đếm ngược tự động.
- **FR-006**: Trong thời gian hệ thống đang cập nhật dữ liệu tài khoản sau thanh toán thành công, bộ đếm ngược chuyển trang KHÔNG ĐƯỢC chạy sớm để tránh việc chuyển trang trước khi dữ liệu kịp hoàn tất đồng bộ.
- **FR-007**: Hệ thống KHÔNG ĐƯỢC hiển thị đếm ngược và KHÔNG ĐƯỢC tự động chuyển hướng khi giao dịch thanh toán ở trạng thái bị hủy hoặc gặp lỗi thất bại.
- **FR-008**: Giao diện PHẢI hiển thị thông tin thời gian còn lại một cách trực quan, rõ ràng cho người dùng (ví dụ: hiển thị số giây còn lại trên nút thao tác hoặc đoạn văn bản chỉ dẫn bên cạnh nút).

### Key Entities *(include if feature involves data)*

- **Payment Result State**: Đại diện cho trạng thái kết quả thanh toán được trả về từ cổng thanh toán (thành công, hủy, lỗi), mã đơn hàng, loại giao dịch (nạp tiền ví hoặc mua gói), và đường dẫn đích tiếp theo.
- **Countdown Redirect State**: Đại diện cho tiến trình đếm ngược bao gồm số giây còn lại, cờ trạng thái đang đếm ngược và trạng thái sẵn sàng chuyển trang.
- **Target Destination**: Đường dẫn chuyển hướng nội bộ an toàn trong hệ thống, được tính toán thống nhất cho cả thao tác tự động và thao tác thủ công.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% người dùng thanh toán thành công mà không thao tác bấm nút sẽ được tự động chuyển hướng về đúng trang đích sau 5 giây kể từ khi dữ liệu tài khoản hoàn tất đồng bộ.
- **SC-002**: Tỷ lệ trùng khớp giữa trang đích chuyển hướng tự động và trang đích khi bấm thủ công nút "Tiếp tục" đạt 100% trên tất cả các luồng giao dịch.
- **SC-003**: 0% trường hợp tự động chuyển trang xảy ra khi giao dịch ở trạng thái bị hủy hoặc thất bại.
- **SC-004**: Thao tác bấm nút "Tiếp tục" thủ công trong thời gian đếm ngược phản hồi chuyển trang ngay lập tức (dưới 300ms) và không có hiện tượng giật lag hoặc chuyển trang kép.

## Assumptions

- Khoảng thời gian đếm ngược 5 giây là phù hợp để người dùng vừa kịp đọc thông tin xác nhận thanh toán (mã đơn hàng, lời nhắn thành công) vừa không phải đợi quá lâu nếu không muốn bấm nút.
- Quy tắc xác thực đường dẫn đích (`next` an toàn, bắt đầu bằng `/` và không bắt đầu bằng `//`) được áp dụng nhất quán giữa tự động chuyển trang và chuyển trang thủ công để phòng tránh lỗ hổng bảo mật open redirect.
- Trải nghiệm tự động đếm ngược chỉ áp dụng riêng cho trường hợp thanh toán thành công nhằm tối ưu trải nghiệm chuyển đổi (conversion flow). Với trường hợp hủy hoặc thất bại, người dùng cần chủ động quyết định nên không áp dụng đếm ngược.
- Quá trình làm mới dữ liệu tài khoản (invalidate/refetch) được hoàn tất trước khi đếm ngược bắt đầu, đảm bảo thông tin số dư ví hoặc gói hội viên luôn ở trạng thái mới nhất khi người dùng được đưa về trang đích.
