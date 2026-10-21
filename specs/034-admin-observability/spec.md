# Feature Specification: Khả năng quan sát & Giám sát vận hành cho Admin (Admin Observability)

**Feature Branch**: `034-admin-observability`

**Created**: 2026-10-16

**Status**: Draft

**Input**: User description: "specs\029-admin-observability\frontend-guide.md - Triển khai 2 trang quản trị mới (Hoạt động người dùng, Giao dịch payOS) và cải tổ Dashboard Admin theo hướng dẫn frontend-guide.md"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Giám sát & Đối soát Giao dịch payOS (Priority: P1)

Là Quản trị viên hệ thống (Admin), tôi muốn xem danh sách toàn bộ các giao dịch thanh toán payOS (bao gồm cả mua gói đăng ký và nạp ví), lọc theo trạng thái và khoảng thời gian, xem chi tiết từng giao dịch và thực hiện các thao tác đối soát thủ công khi có sai lệch cổng thanh toán, để đảm bảo quyền lợi của người dùng và tính toàn vẹn của doanh thu hệ thống.

**Why this priority**: Thanh toán và đối soát tiền tệ là luồng nghiệp vụ nhạy cảm và quan trọng nhất đối với doanh thu dịch vụ. Khi người dùng gặp sự cố chuyển khoản hoặc cổng thanh toán chưa đồng bộ webhook, admin phải có công cụ tra cứu tức thì và xử lý thủ công có kiểm soát.

**Independent Test**: Quản trị viên có thể truy cập trang Giao dịch payOS, lọc giao dịch theo trạng thái "Cần đối soát" (`reconciliation_required`), mở chi tiết một giao dịch, nhấn nút xác nhận "Đã thanh toán" (`resolve-paid`) kèm mã tham chiếu đối tác, và giao dịch được cập nhật trạng thái mới nhất ngay lập tức.

**Acceptance Scenarios**:

1. **Given** Quản trị viên đã đăng nhập với quyền admin, **When** truy cập menu "Giao dịch payOS", **Then** hệ thống hiển thị bảng danh sách giao dịch sắp xếp thời gian tạo mới nhất, đầy đủ mã đơn, loại giao dịch (Mua gói / Nạp ví), số tiền VND, trạng thái với huy hiệu màu sắc tương ứng (11 trạng thái chuẩn), và phân trang.
2. **Given** Quản trị viên đang ở bảng giao dịch, **When** chọn bộ lọc trạng thái bất kỳ trong 11 trạng thái hoặc chọn "Tất cả", **Then** danh sách giao dịch hiển thị đúng các bản ghi khớp bộ lọc mà không bị lỗi dữ liệu.
3. **Given** một giao dịch có trạng thái chưa thành công, **When** Quản trị viên nhấn xem chi tiết và chọn một hành động đối soát (Xác nhận đã thanh toán, Đã hủy, Tạo link thất bại, hoặc Gửi lại đối soát), **Then** hệ thống mở hộp thoại yêu cầu nhập lý do (và mã tham chiếu + mã link thanh toán nếu là Xác nhận đã thanh toán), sau khi xác nhận thành công sẽ thông báo và cập nhật lại trạng thái giao dịch.
4. **Given** một giao dịch đã ở trạng thái `success`, **When** Quản trị viên xem chi tiết, **Then** các nút hành động đổi trạng thái sang đã hủy hoặc gửi lại đối soát bị vô hiệu hóa để ngăn ngừa sai phạm nghiệp vụ.
5. **Given** Quản trị viên mở liên kết chi tiết giao dịch với mã định danh không tồn tại, **Then** hệ thống hiển thị thông báo "Không tìm thấy giao dịch" rõ ràng thay vì trang trắng hoặc sập ứng dụng.

---

### User Story 2 - Cải tổ Dashboard Vận hành & Số liệu theo kỳ (Priority: P1)

Là Quản trị viên hệ thống, tôi muốn giao diện Dashboard được phân tách rành mạch giữa các chỉ số ảnh chụp tức thời (snapshot định kỳ) và các báo cáo phân tích theo kỳ thời gian thực, với các preset ngày tiện lợi theo giờ Việt Nam, để nắm bắt chuẩn xác sức khỏe hệ thống, tỷ lệ lỗi AI thực tế và doanh thu mà không bị sai lệch số liệu hay nhầm lẫn kỳ báo cáo.

**Why this priority**: Dashboard là trung tâm chỉ huy vận hành hàng ngày của Admin. Dữ liệu sai lệch kỳ (ví dụ tỷ lệ lỗi >100%, nhầm lẫn giữa doanh thu hôm nay và doanh thu 6 tháng) dẫn tới quyết định sai lầm trong vận hành và kinh doanh.

**Independent Test**: Quản trị viên chọn preset "Tháng này" trên Dashboard, tất cả các panel phân tích (Đối soát PayOS, Biên lợi nhuận AI, Biểu đồ xu hướng, Doanh thu theo gói, Phân tích lỗi AI) đều cập nhật số liệu chính xác theo cùng khoảng thời gian từ ngày 01 đến ngày hiện tại (giờ VN), trong khi các thẻ KPI hiển thị nhãn "Ảnh chụp" kèm mốc thời gian cập nhật gần nhất.

**Acceptance Scenarios**:

1. **Given** Quản trị viên vào Dashboard, **Then** khu vực thẻ KPI được gắn nhãn rõ ràng là số liệu ảnh chụp định kỳ (~15 phút/lần) kèm mốc thời gian cập nhật (`updatedAt`), tách biệt khỏi các bảng biểu phân tích theo kỳ đã chọn.
2. **Given** Quản trị viên chọn bộ lọc ngày, **Then** giao diện cung cấp sẵn các nút chọn nhanh ("Hôm nay", "Tháng này", "30 ngày gần nhất", "Tùy chọn") tính toán chuẩn xác theo ngày lịch Việt Nam (+07:00).
3. **Given** Quản trị viên thay đổi khoảng ngày, **Then** toàn bộ các panel theo kỳ (Đối soát PayOS, AI Margin, Phân bổ gói, Doanh thu gói, Gia hạn, Hoạt động AI, Phân tích lỗi AI) đều được gửi đầy đủ tham số ngày bắt đầu và ngày kết thúc đồng bộ.
4. **Given** bảng Phân tích lỗi AI hiển thị, **Then** tỷ lệ lỗi AI (`errorRate`) được hiển thị trực tiếp từ hệ thống, luôn đảm bảo giá trị từ 0% đến 100%, không bị vượt quá 100% khi tính trên các tập dữ liệu khác kỳ.
5. **Given** Quản trị viên nhập hoặc truy cập URL có khoảng ngày không hợp lệ (ví dụ ngày bắt đầu sau ngày kết thúc), **Then** hệ thống hiển thị thông báo lỗi bằng tiếng Việt dễ hiểu và giữ nguyên nội dung ô nhập để sửa, không âm thầm chuyển về mặc định gây hiểu lầm.

---

### User Story 3 - Truy vết Nhật ký Hoạt động Người dùng (Priority: P2)

Là Quản trị viên bảo mật và vận hành, tôi muốn tra cứu nhật ký đăng nhập và làm mới phiên của người dùng trong hệ thống theo tài khoản, loại hoạt động và mốc thời gian, để phát hiện các dấu hiệu truy cập bất thường, hỗ trợ xử lý khiếu nại tài khoản và kiểm soát mức độ hoạt động của người dùng.

**Why this priority**: Nhật ký đăng nhập là thành phần bắt buộc của khả năng quan sát hệ thống (observability) và tuân thủ an toàn thông tin, giúp admin trả lời câu hỏi "ai đã đăng nhập lúc nào".

**Independent Test**: Quản trị viên lọc theo loại hoạt động "Đăng nhập" (`login`) trong ngày "Hôm nay", hệ thống trả về danh sách phân trang hiển thị tên người dùng (hoặc email nếu chưa đặt tên), thời điểm phát sinh theo giờ Việt Nam, mã người dùng kèm nút sao chép nhanh.

**Acceptance Scenarios**:

1. **Given** Quản trị viên mở menu "Hoạt động người dùng", **Then** hệ thống hiển thị bảng nhật ký sắp xếp theo thời điểm phát sinh giảm dần, hiển thị tên đầy đủ của người dùng (tự động ghép họ tên hoặc hiển thị email nếu chưa có tên), loại hoạt động (Đăng nhập / Làm mới phiên), mã sự kiện và phân trang.
2. **Given** Quản trị viên nhập mã định danh người dùng (User ID) vào ô tìm kiếm, **Then** hệ thống kiểm tra tính hợp lệ của mã UUID trước khi gửi và trả về các hoạt động của riêng người dùng đó.
3. **Given** Quản trị viên lọc loại hoạt động với tùy chọn "Tất cả", **Then** hệ thống hiển thị mọi loại hoạt động mà không truyền giá trị lọc không hợp lệ lên máy chủ.
4. **Given** không có bản ghi nào khớp với điều kiện tìm kiếm, **Then** hệ thống hiển thị trạng thái rỗng thân thiện kèm nút xóa bộ lọc.

---

### User Story 4 - Điều hướng & Đồng bộ Trải nghiệm Quản trị (Priority: P3)

Là Quản trị viên, tôi muốn thanh điều hướng thanh bên (Sidebar) có đầy đủ liên kết tới các trang quản trị mới ("Giao dịch payOS" và "Hoạt động người dùng"), với giao diện và thuật ngữ tiếng Việt nhất quán, liên kết có thể lưu trữ qua URL query parameters để chia sẻ thuận tiện với đồng nghiệp.

**Why this priority**: Tính công thái học (ergonomics) và sự đồng bộ trong trải nghiệm quản trị giúp admin làm việc nhanh chóng, giảm thiểu nhầm lẫn thuật ngữ Anh-Việt lẫn lộn.

**Independent Test**: Quản trị viên có thể chuyển đổi mượt mà giữa Dashboard, Giao dịch payOS và Hoạt động người dùng từ Sidebar; khi sao chép URL kèm bộ lọc gửi sang tab trình duyệt mới, toàn bộ bộ lọc và trang hiện tại được phục hồi chính xác.

**Acceptance Scenarios**:

1. **Given** Quản trị viên mở trang quản trị ở bất kỳ màn hình nào, **Then** Sidebar hiển thị 2 mục mới: "Giao dịch payOS" và "Hoạt động người dùng" với icon và trạng thái đang chọn (active) chuẩn xác.
2. **Given** toàn bộ các trang quản trị được tải, **Then** các thuật ngữ tiếng Anh trước đây (như "AI Health", "Paid tokens", "FAILED") được đồng hóa sang tiếng Việt thân thiện ("Sức khỏe AI", "Tokens trả phí", "Thất bại").
3. **Given** bảng sự kiện AI trên Dashboard, **Then** tiêu đề cột hiển thị đúng "Mô hình" và "Mã lỗi", không hiển thị nhầm mô hình vào cột loại lỗi.

---

### Edge Cases

- **Khoảng ngày đảo chiều**: Người dùng vô tình chọn ngày bắt đầu lớn hơn ngày kết thúc -> Hệ thống hiển thị thông báo lỗi rõ ràng "Ngày bắt đầu không được sau ngày kết thúc" và giữ nguyên ô chọn để người dùng chỉnh lại.
- **Tài khoản người dùng chưa cập nhật họ tên**: Bản ghi hoạt động hoặc giao dịch có `userFirstName` và `userLastName` rỗng -> Giao diện tự động sử dụng `userEmail` làm định danh hiển thị, không để trống ô tên.
- **Giao dịch thiếu thông tin phụ**: Các trường không bắt buộc như `paymentUrl`, `targetPlanId`, `failureReason`, `cancelledAt` có giá trị null/vắng mặt -> Hiển thị ký tự "—" trang nhã, không hiển thị chữ `null` hoặc `undefined`.
- **Trạng thái giao dịch ngoài hợp đồng**: Dữ liệu có trạng thái không thuộc 11 giá trị chuẩn (giá trị `unknown` do sửa tay cơ sở dữ liệu) -> Hiển thị nhãn cảnh báo "Không xác định" với màu sắc trung tính thay vì gây lỗi giao diện.
- **Thực hiện thao tác đối soát khi trạng thái đã thay đổi**: Admin bấm xác nhận thanh toán nhưng giao dịch đã được hệ thống tự động ghi nhận trước đó vài giây -> Máy chủ từ chối, giao diện hiển thị thông báo lỗi nghiệp vụ cụ thể từ máy chủ và giữ nguyên hộp thoại để admin nắm bắt tình hình.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Hệ thống PHẢI cung cấp trang "Giao dịch payOS" chuyên biệt cho quản trị viên, hỗ trợ lọc theo 11 trạng thái giao dịch chuẩn: `pending`, `success`, `failed_legacy`, `creating`, `reconciliation_required`, `reconciling`, `creation_failed`, `cancelled`, `expired`, `investigation_required`, `refunded`.
- **FR-002**: Hệ thống PHẢI hỗ trợ xem chi tiết giao dịch với đầy đủ các thuộc tính thanh toán và cung cấp 4 hành động đối soát thủ công có điều kiện kích hoạt theo trạng thái hiện tại (`resolve-paid`, `resolve-cancelled`, `resolve-creation-failed`, `retry-investigation`).
- **FR-003**: Hệ thống PHẢI tự động làm mới lại chi tiết và danh sách giao dịch sau khi một hành động đối soát được thực hiện thành công, hiển thị thông báo phản hồi từ máy chủ.
- **FR-004**: Hệ thống PHẢI cung cấp trang "Hoạt động người dùng" ghi nhận lịch sử xác thực, hỗ trợ lọc theo mã người dùng (UUID), loại hoạt động (`login`, `refresh`), và khoảng thời gian.
- **FR-005**: Hệ thống PHẢI phân tách rõ ràng trên giao diện Dashboard giữa khối chỉ số "Ảnh chụp hiện tại" (KPI snapshot kèm mốc thời gian cập nhật) và khối "Theo kỳ đã chọn".
- **FR-006**: Hệ thống PHẢI hỗ trợ các preset khoảng ngày ("Hôm nay", "Tháng này", "30 ngày gần nhất", "Tùy chọn") được tính toán chuẩn theo ngày lịch Việt Nam (`Asia/Ho_Chi_Minh`, `YYYY-MM-DD`).
- **FR-007**: Hệ thống PHẢI gửi đồng thời và nhất quán cả 2 tham số `fromDate` và `toDate` cho tất cả 7 bảng biểu phân tích theo kỳ trên Dashboard khi người dùng thay đổi bộ lọc.
- **FR-008**: Hệ thống PHẢI hiển thị trực tiếp giá trị tỷ lệ lỗi AI (`errorRate`) và tổng giá trị thanh toán thành công (`totalSuccessValue`) được trả về từ máy chủ mà không tính toán lại cục bộ từ các nguồn dữ liệu lệch kỳ.
- **FR-009**: Hệ thống PHẢI phân biệt rõ các nhãn doanh thu khác nhau trên Dashboard: "Doanh thu hôm nay (ảnh chụp)", "Doanh thu gói trong kỳ", và "Doanh thu theo kỳ đã chọn".
- **FR-010**: Hệ thống PHẢI duy trì trạng thái của bộ lọc và phân trang trong URL query parameters trên cả Dashboard, trang Giao dịch và trang Hoạt động người dùng.
- **FR-011**: Hệ thống PHẢI hiển thị thông báo lỗi tiếng Việt cụ thể khi máy chủ phản hồi lỗi `400` do khoảng ngày hoặc tham số không hợp lệ, giữ nguyên dữ liệu đầu vào của người dùng.
- **FR-012**: Hệ thống PHẢI tích hợp 2 liên kết mới vào thanh điều hướng Sidebar của quản trị viên: "Giao dịch payOS" và "Hoạt động người dùng".
- **FR-013**: Hệ thống PHẢI đồng bộ ngôn ngữ hiển thị toàn bộ giao diện quản trị sang tiếng Việt nhất quán.

### Key Entities *(include if feature involves data)*

- **Giao dịch payOS (Deposit Transaction)**: Đại diện cho một giao dịch thanh toán qua cổng payOS, bao gồm mã đơn hàng (`orderCode`), số tiền, loại giao dịch (`direct_purchase` - Mua gói hoặc `wallet_topup` - Nạp ví), trạng thái (1 trong 11 trạng thái), thông tin đối soát, và thời gian tạo/cập nhật.
- **Sự kiện hoạt động người dùng (Activity Event)**: Đại diện cho một hành vi xác thực của tài khoản trong hệ thống, bao gồm mã định danh sự kiện, mã người dùng (`userId`), loại hoạt động (`login` hoặc `refresh`), email, họ tên, và thời điểm phát sinh (`occurredAt`).
- **Báo cáo đối soát PayOS (PayOS Reconciliation Summary)**: Bản tổng hợp số liệu giao dịch thanh toán trong kỳ được chọn, bao gồm tổng số giao dịch, số giao dịch thành công, thất bại, đang chờ xử lý, đã hủy/hết hạn, và tổng giá trị tiền thành công thực tế.
- **Phân tích lỗi AI (AI Error Breakdown)**: Số liệu thống kê lỗi gọi dịch vụ AI trong kỳ, bao gồm tổng số lượt gọi, tổng số lỗi, tỷ lệ lỗi chuẩn hóa (≤ 100%), và chi tiết lỗi phân nhóm theo mã lỗi, nhà cung cấp và mô hình.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Quản trị viên có thể tra cứu và hiển thị đầy đủ thông tin chi tiết của một giao dịch bất kỳ trong vòng dưới 3 giây từ bảng danh sách.
- **SC-002**: 100% các yêu cầu truy vấn theo ngày trên giao diện quản trị phản ánh đúng trọn vẹn 24 giờ ngày lịch Việt Nam (+07:00), không có độ trễ lệch 7 tiếng do múi giờ UTC.
- **SC-003**: 100% các hành động đối soát giao dịch cung cấp phản hồi thông báo thành công hoặc báo lỗi nghiệp vụ rõ ràng, không có trường hợp nút bấm bị đơ hoặc mất dấu vết trạng thái.
- **SC-004**: Tỷ lệ lỗi AI trên bảng tổng quan luôn hiển thị trong khoảng từ 0% đến 100%, chấm dứt hoàn toàn hiện tượng tỷ lệ lỗi vượt quá 100%.
- **SC-005**: 100% các trường hợp người dùng chọn khoảng ngày không hợp lệ nhận được thông báo hướng dẫn cụ thể thay vì bị tự động thay thế bằng khoảng ngày mặc định.
- **SC-006**: Quản trị viên có thể sao chép URL của bảng giao dịch hoặc nhật ký hoạt động có chứa bộ lọc và khi mở ở tab khác, kết quả hiển thị khớp 100% với bộ lọc đã chọn.

## Assumptions

- Quản trị viên đăng nhập bằng tài khoản có vai trò `admin` và phiên đăng nhập hợp lệ với access token được quản lý tự động.
- Cổng dịch vụ Backend (API v1) đã hoàn thiện và đối chiếu live các endpoint thuộc feature 029 như mô tả trong tài liệu hướng dẫn tích hợp.
- Định dạng tiền tệ mặc định hiển thị cho mọi giao dịch thanh toán là Việt Nam Đồng (VND) theo quy chuẩn định dạng số học Việt Nam (`vi-VN`).
- Granularity (độ chi tiết biểu đồ doanh thu) của backend hiện tại cố định theo tháng lịch (`month`), do đó giao diện sẽ hiển thị biểu đồ theo tháng thay vì chia nhỏ theo ngày.
