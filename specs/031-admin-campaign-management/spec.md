# Feature Specification: Admin Campaign Management & Eligibility Lookup (Quản lý Chiến dịch Tặng gói & Tra cứu Điều kiện Tài khoản)

**Feature Branch**: `031-admin-campaign-management`

**Created**: 2026-10-05

**Status**: Ready for Planning

**Input**: User description: "đọc file specs\025-signup-campaign-grant\frontend-guide.md specs\026-campaign-registry-db\frontend-guide.md" - Xây dựng giao diện trang quản trị để vận hành toàn diện vòng đời các chiến dịch tặng gói đăng ký mới (tạo mới, xem chi tiết, sửa đổi hạn mức/thời gian, đóng cưỡng bức, kiểm tra nhật ký kiểm toán, xem danh sách lượt cấp) và công cụ tra cứu tức thời điều kiện nhận gói của tài khoản khách hàng để giải đáp khiếu nại.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Giám sát Danh sách Chiến dịch & Cảnh báo Sức khỏe Cơ chế Cấp (Priority: P1)

Là một Quản trị viên (Admin) hoặc Nhân viên Vận hành, tôi muốn xem danh sách tập trung toàn bộ các chiến dịch tặng gói trên hệ thống, nắm bắt ngay trạng thái vòng đời, tình trạng ngân sách (hạn mức chính, suất dự phòng, số lượng đã cấp, số lượng còn lại) và đặc biệt là nhận diện ngay lập tức nếu cơ chế cấp gói bị suy giảm/lỗi kỹ thuật (`degraded = true`), để có thể phát hiện và xử lý sự cố cấp gói kịp thời trước khi khách hàng phản ánh.

**Why this priority**: Đây là màn hình điều khiển cốt lõi giúp quản trị viên có cái nhìn toàn cục về tất cả các chiến dịch khuyến mãi đang chạy hoặc đã kết thúc, đồng thời là chốt chặn giám sát kỹ thuật quan trọng nhất để cảnh báo sự cố ngừng cấp gói trên hệ thống.

**Independent Test**: Truy cập menu Quản trị Chiến dịch, kiểm tra bảng danh sách chiến dịch hiển thị đầy đủ các cột thông tin, các nhãn trạng thái chính xác (6 trạng thái), chỉ báo cảnh báo nổi bật màu đỏ khi `degraded = true`, huy hiệu khóa ngân sách (`budgetLocked`) và các nút điều hướng thao tác.

**Acceptance Scenarios**:

1. **Given** Quản trị viên truy cập mục "Quản lý chiến dịch" trên thanh điều hướng quản trị, **When** trang tải xong, **Then** hệ thống hiển thị bảng danh sách các chiến dịch với đầy đủ thông tin: Mã chiến dịch, Gói áp dụng, Hạn mức chính (`quota`), Suất dự phòng (`reserve`), Tổng số đã cấp (`grantedTotalCount`), Số lượng còn lại, Thời gian bắt đầu/kết thúc, Trạng thái vòng đời và Tình trạng vận hành.
2. **Given** một chiến dịch đang mở nhưng cơ chế cấp nền bị lỗi kỹ thuật (`degraded = true`), **When** quản trị viên xem bảng danh sách hoặc chi tiết, **Then** giao diện PHẢI hiển thị cảnh báo đỏ nổi bật (Urgent Banner/Badge) kèm lý do kỹ thuật (`degradedReason`), cảnh báo rõ ràng rằng hệ thống đang bị lỗi không thể cấp gói dù chiến dịch đang mở.
3. **Given** một chiến dịch hiển thị trạng thái vòng đời, **When** hệ thống xác định trạng thái, **Then** hiển thị chính xác một trong 6 trạng thái nghiệp vụ theo thứ tự ưu tiên:
   - `closed`: "Đã đóng" (kèm mốc thời gian đóng `closedAt`) - ưu tiên cao nhất,
   - `exhausted`: "Đã hết suất" (khi tổng cấp đạt trần cứng `quota + reserve`),
   - `expired`: "Đã kết thúc" (khi đồng hồ hệ thống vượt qua `endsAt`),
   - `compensation`: "Đang chạy — chỉ còn suất dự phòng" (khi đã hết hạn mức chính, đã chốt mốc ưu tiên),
   - `running`: "Đang chạy" (đang mở, còn suất chính),
   - `not_started`: "Sắp mở" (chưa tới `startsAt`, kèm ngày giờ mở).
4. **Given** một chiến dịch đã cấp ít nhất một suất cho người dùng (`budgetLocked = true`), **When** hiển thị trên danh sách, **Then** hiển thị huy hiệu "Đã khóa ngân sách" để báo hiệu rằng các thông số ngân sách cốt lõi không thể sửa đổi tự do.
5. **Given** người dùng chuyển trang hoặc làm mới dữ liệu, **When** dữ liệu danh sách được yêu cầu, **Then** hệ thống hỗ trợ phân trang chuẩn xác và luôn tải dữ liệu số đếm thời gian thực từ máy chủ (không cache cục bộ số liệu ngân sách).

---

### User Story 2 - Tra cứu Điều kiện & Giải đáp Thắc mắc Cấp gói của Khách hàng (Priority: P1)

Là một Nhân viên Hỗ trợ Khách hàng (CS) hoặc Quản trị viên, khi nhận được thắc mắc từ khách hàng *"Tại sao tôi đăng ký tài khoản mới mà chưa/không được tặng gói Premium?"*, tôi muốn tra cứu tức thời tình trạng của tài khoản đó theo mã người dùng (`userId`) trong một chiến dịch cụ thể để đưa ra câu trả lời chính xác, minh bạch kèm lý do cụ thể.

**Why this priority**: Khách hàng gọi lên hỏi về quyền lợi đăng ký mới là tình huống phổ biến nhất trong các đợt phát hành sản phẩm. Độ chính xác tại màn hình này mang tính sống còn để tránh việc nhân viên hỗ trợ nhầm lẫn giữa "hệ thống đang xử lý" và "chiến dịch đã hết suất", giúp bảo vệ uy tín thương hiệu.

**Independent Test**: Nhập mã chiến dịch và mã tài khoản khách hàng (`userId`) vào ô tra cứu, kiểm tra kết quả trả về đúng 1 trong 6 trạng thái điều kiện (`eligibility`), hiển thị đúng thông điệp giải thích tương ứng với mã lý do (`reason`), phân biệt rõ ràng trường hợp "đang chờ xử lý" (`eligible_pending`) với "đã hết suất" (`eligible_but_exhausted`).

**Acceptance Scenarios**:

1. **Given** nhân viên hỗ trợ nhập mã khách hàng (`userId`) và mã chiến dịch hợp lệ, **When** nhấn nút "Tra cứu điều kiện", **Then** hệ thống hiển thị thẻ kết quả gồm: Mã chiến dịch, Mã khách hàng, Thời điểm khách đăng ký tài khoản, Trạng thái điều kiện (`eligibility`), Kết luận cấp gói (`granted`), và Thời điểm mốc ưu tiên (`watermarkAt` nếu có).
2. **Given** khách hàng đủ điều kiện, còn suất nhưng thông điệp hệ thống đang xử lý dở dang (`eligibility = eligible_pending`), **When** kết quả hiển thị, **Then** giao diện PHẢI hiển thị thông báo màu xanh/vàng nhạt: *"Bạn đủ điều kiện, hệ thống đang xử lý — thường chưa tới 1 phút"*, TUYỆT ĐỐI KHÔNG được hiển thị "Hết suất" hay báo lỗi.
3. **Given** khách hàng đã được cấp gói thành công (`eligibility = granted`), **When** kết quả hiển thị, **Then** giao diện thông báo *"Bạn đã được tặng gói, hết hạn ngày [ngày hết hạn]"*.
4. **Given** khách hàng không được cấp gói với lý do cụ thể (`not_eligible`, `eligible_but_exhausted`, `already_claimed_other_campaign`, `created_by_admin`), **When** kết quả hiển thị, **Then** hệ thống dịch chính xác 12 mã `reason` nghiệp vụ sang câu tiếng Việt rõ ràng, dễ hiểu:
   - `campaign_not_configured`: "Chưa có chiến dịch nào đang chạy"
   - `campaign_not_started`: "Chiến dịch chưa bắt đầu"
   - `campaign_sleeping`: "Chiến dịch đã kết thúc hoặc đã bị đóng"
   - `created_by_admin`: "Tài khoản do quản trị viên tạo nên không áp dụng chiến dịch"
   - `already_claimed`: "Tài khoản đã được tặng gói rồi"
   - `already_on_plan`: "Bạn đang có gói này rồi (còn hạn)"
   - `plan_not_settled`: "Gói cũ vừa hết hạn chưa dọn xong, thử lại sau ít phút"
   - `outside_window`: "Tài khoản tạo ngoài thời gian diễn ra chiến dịch"
   - `quota_main`: "Chiến dịch đã hết suất chính"
   - `quota_compensation`: "Chiến dịch đã hết suất dự phòng (đạt trần tối đa)"
   - `quota_anomaly`: "Hệ thống đang kiểm tra tính toàn vẹn dữ liệu, vui lòng thử lại sau"
   - `plan_unavailable`: "Gói cước tặng đang được cấu hình lại"
   - *Lý do rỗng*: Hợp lệ đối với `eligible_pending` và `granted`, không được coi là lỗi.
5. **Given** nhân viên gõ nhầm mã khách hàng hoặc mã chiến dịch, **When** nhận phản hồi lỗi từ máy chủ, **Then** giao diện PHẢI phân biệt rõ:
   - Lỗi do mã chiến dịch không tồn tại: "Không tìm thấy chiến dịch với mã đã nhập: [mã]"
   - Lỗi do mã tài khoản không tồn tại: "Không tìm thấy tài khoản người dùng."
   - Tuyệt đối không gộp chung thành một câu "Không tìm thấy dữ liệu".

---

### User Story 3 - Mở Mới Chiến Dịch Tặng Gói (Priority: P2)

Là một Quản trị viên, tôi muốn khởi tạo một chiến dịch tặng gói mới trực tiếp trên giao diện quản trị mà không cần phải can thiệp cấu hình mã nguồn hay triển khai lại máy chủ, với các quy tắc kiểm tra dữ liệu nghiêm ngặt ngay trên form nhập liệu.

**Why this priority**: Cung cấp khả năng tự phục vụ linh hoạt cho đội ngũ vận hành và tiếp thị khi cần tung ra các chương trình kích cầu người dùng mới theo từng thời điểm.

**Independent Test**: Nhấp nút "Mở chiến dịch mới", điền thông tin hợp lệ (mã chiến dịch, mã gói, hạn mức chính, suất dự phòng, thời gian bắt đầu, thời gian kết thúc tùy chọn), gửi form và kiểm tra hệ thống thông báo thành công, chuyển hướng đến trang chi tiết chiến dịch và tự động nạp lại dữ liệu ngân sách chuẩn xác.

**Acceptance Scenarios**:

1. **Given** Quản trị viên mở biểu mẫu "Mở chiến dịch mới", **When** nhập dữ liệu, **Then** giao diện kiểm tra tính hợp lệ ngay lập tức:
   - Mã chiến dịch (`code`): Bắt buộc, độ dài từ 3 đến 64 ký tự, chỉ chứa chữ cái thường (`a-z`), chữ số (`0-9`) và dấu gạch ngang (`-`), phải bắt đầu bằng chữ thường hoặc số (biểu thức chính quy: `^[a-z0-9][a-z0-9-]{2,63}$`).
   - Mã gói cước (`planSlug`): Bắt buộc, không được để trống (hỗ trợ chọn từ danh sách gói cước hoặc nhập mã gói).
   - Hạn mức chính (`quota`): Bắt buộc, số nguyên lớn hơn hoặc bằng 1.
   - Suất dự phòng (`reserve`): Tùy chọn, số nguyên không âm (mặc định là 0).
   - Thời gian bắt đầu (`startsAt`): Bắt buộc, thời điểm có kèm múi giờ rõ ràng (định dạng chuẩn RFC3339 có múi giờ).
   - Thời gian kết thúc (`endsAt`): Tùy chọn (cho phép để trống biểu thị chiến dịch mở không thời hạn); nếu nhập thì phải sau thời gian bắt đầu.
2. **Given** Quản trị viên nhập mã chiến dịch trùng với mã đã tồn tại, **When** gửi yêu cầu tạo, **Then** hệ thống hiển thị thông báo lỗi trực tiếp cạnh ô nhập mã: "Đã tồn tại chiến dịch với mã [code]. Vui lòng chọn một mã khác." (Mã lỗi 409).
3. **Given** biểu mẫu tạo chiến dịch được máy chủ chấp nhận thành công (Mã phản hồi 201), **When** hoàn tất, **Then** hệ thống lập tức chuyển hướng sang màn hình Chi tiết chiến dịch và PHẢI thực hiện gọi lại yêu cầu đọc chi tiết chiến dịch để tải đầy đủ số liệu ngân sách thực tế và tên gói cước hiển thị (tránh sử dụng số liệu tạm thời từ phản hồi ghi).

---

### User Story 4 - Xem Chi Tiết, Chỉnh Sửa Chiến Dịch & Quy Tắc Khóa Hạn Mức Ngân Sách (Priority: P2)

Là một Quản trị viên, tôi muốn xem chi tiết thông số và tiến độ ngân sách của một chiến dịch, đồng thời có thể điều chỉnh thời gian diễn ra hoặc hạn mức (khi chiến dịch chưa phát sinh lượt cấp nào), với cơ chế kiểm soát phiên bản tránh ghi đè dữ liệu (`version`).

**Why this priority**: Đảm bảo an toàn tài chính và tính toàn vẹn dữ liệu khuyến mãi. Ngăn chặn việc sửa đổi hạn mức một khi đã có người nhận gói thực tế, đồng thời bảo vệ tránh xung đột khi nhiều người cùng quản trị một chiến dịch.

**Independent Test**: Mở chi tiết một chiến dịch chưa cấp lượt nào, thử sửa hạn mức `quota` và thời gian, lưu thành công. Mở một chiến dịch đã cấp lượt (`budgetLocked = true`), kiểm tra các ô `quota`, `reserve`, `planSlug` bị vô hiệu hóa kèm thông báo giải thích, chỉ cho phép sửa thời gian bắt đầu và kết thúc.

**Acceptance Scenarios**:

1. **Given** Quản trị viên xem trang chi tiết chiến dịch, **When** dữ liệu nạp xong từ máy chủ, **Then** giao diện trực quan hóa tiến độ ngân sách thông qua thanh đo lường (Progress Bar) chia rõ phần chính (`grantedMainCount` / `quota`) và phần dự phòng (`grantedCompensationCount` / `reserve`), hiển thị rõ trần cứng (`hardCap`), mốc ưu tiên (`watermarkAt`), thời điểm quét bù gần nhất (`lastSweepAt`) và số phiên bản (`version`).
2. **Given** chiến dịch đã cấp ít nhất một lượt cho tài khoản người dùng (`budgetLocked = true`), **When** mở biểu mẫu chỉnh sửa chiến dịch, **Then** hệ thống PHẢI vô hiệu hóa (disable) hoàn toàn 3 trường: Hạn mức chính (`quota`), Suất dự phòng (`reserve`) và Gói áp dụng (`planSlug`), đồng thời hiển thị cảnh báo hướng dẫn rõ ràng: *"Chiến dịch đã cấp — hãy đóng và mở mã mới"*.
3. **Given** chiến dịch đã bị khóa ngân sách, **When** quản trị viên cần gia hạn hoặc thay đổi lịch trình, **Then** vẫn cho phép sửa đổi trường Thời gian bắt đầu (`startsAt`) và Thời gian kết thúc (`endsAt`). Cho phép xóa thời gian kết thúc bằng cách để trống để chuyển thành chiến dịch vô thời hạn.
4. **Given** biểu mẫu chỉnh sửa không cho phép thay đổi Mã chiến dịch (`code`), **When** giao diện hiển thị, **Then** mã chiến dịch chỉ hiển thị dưới dạng văn bản chỉ đọc (không có ô nhập chỉnh sửa mã).
5. **Given** biểu mẫu gửi yêu cầu chỉnh sửa (`PATCH`), **When** quản trị viên bấm Lưu, **Then** hệ thống CHỈ gửi kèm số phiên bản (`version`) hiện tại và những trường dữ liệu thực sự có sự thay đổi (không gửi lại các trường không sửa đổi hoặc các giá trị rỗng không chủ đích).
6. **Given** chiến dịch đã bị một quản trị viên khác cập nhật trước đó khiến số phiên bản bị lệch, **When** gửi yêu cầu sửa, **Then** máy chủ phản hồi lỗi xung đột phiên bản (Mã 412), giao diện PHẢI hiển thị thông báo *"Dữ liệu chiến dịch đã thay đổi bởi thao tác khác. Đang tải lại thông tin mới nhất..."* và tự động nạp lại dữ liệu chi tiết mới nhất để người dùng kiểm tra trước khi thao tác lại.
7. **Given** thao tác chỉnh sửa thành công, **When** nhận phản hồi từ máy chủ, **Then** hệ thống PHẢI tự động gọi lại yêu cầu tra cứu chi tiết (`GET`) để cập nhật số liệu ngân sách và tình trạng mới nhất.

---

### User Story 5 - Đóng Cưỡng Bức Chiến Dịch Tặng Gói Một Chiều (Priority: P2)

Là một Quản trị viên, khi phát hiện ngân sách công ty thay đổi đột xuất, chiến dịch bị lạm dụng hoặc cần dừng chương trình ngay lập tức, tôi muốn thực hiện thao tác đóng cưỡng bức chiến dịch (`close`), với lý do giải trình bắt buộc được ghi nhận vào nhật ký kiểm toán.

**Why this priority**: Cung cấp công tắc dừng khẩn cấp (Emergency Stop) giúp bảo vệ quyền lợi doanh nghiệp ngay tức thì mà không ảnh hưởng tới các quyền lợi đã cấp cho những khách hàng trước đó.

**Independent Test**: Tại trang chi tiết chiến dịch, nhấn nút "Đóng chiến dịch", kiểm tra hộp thoại cảnh báo nguy hiểm mở ra, yêu cầu nhập lý do đóng, gửi yêu cầu và xác nhận chiến dịch chuyển sang trạng thái "Đã đóng" (`closed`), nút Đóng bị ẩn hoặc vô hiệu hóa.

**Acceptance Scenarios**:

1. **Given** chiến dịch chưa bị đóng (`closedAt` là `null`), **When** quản trị viên bấm nút "Đóng chiến dịch", **Then** hệ thống hiển thị hộp thoại xác nhận nghiêm ngặt (Destructive Confirmation Dialog) cảnh báo: *"Thao tác đóng là một chiều, không thể mở lại sau khi đóng. Mọi lượt cấp mới sẽ ngừng ngay lập tức."*
2. **Given** hộp thoại đóng chiến dịch đang mở, **When** người dùng thao tác, **Then** trường Lý do đóng (`reason`) là bắt buộc, không được để trống; nút xác nhận chỉ được kích hoạt khi đã nhập lý do rõ ràng.
3. **Given** quản trị viên xác nhận đóng chiến dịch, **When** gửi yêu cầu, **Then** hệ thống gửi kèm số phiên bản (`version`) và lý do đóng.
4. **Given** yêu cầu đóng thành công, **When** hoàn tất, **Then** giao diện chuyển trạng thái chiến dịch sang `closed` ("Đã đóng"), hiển thị mốc thời gian đóng `closedAt`, hiển thị thông báo thành công và tự động tải lại chi tiết chiến dịch để đồng bộ dữ liệu.
5. **Given** người dùng vô tình bấm gọi lại thao tác đóng trên một chiến dịch đã đóng, **When** máy chủ phản hồi trạng thái thành công idempotent, **Then** giao diện xử lý êm dịu, không báo lỗi gây hoang mang.

---

### User Story 6 - Tra Cứu Danh Sách Lượt Cấp Của Chiến Dịch (Claims Audit) (Priority: P3)

Là một Quản trị viên hoặc Kiểm toán viên nội bộ, tôi muốn xem toàn bộ danh sách các tài khoản người dùng đã được cấp gói trong chiến dịch, lọc theo khoảng thời gian được cấp, để đối chiếu ngân sách thực tế và giải quyết khiếu nại về thứ tự ưu tiên.

**Why this priority**: Mang lại tính minh bạch tuyệt đối cho chương trình khuyến mãi, chứng minh rõ ràng ai đã nhận từ hạn mức chính (`main`) và ai đã nhận từ suất dự phòng (`reserve`).

**Independent Test**: Mở tab "Lượt cấp" trong chi tiết chiến dịch, kiểm tra danh sách hiển thị các tài khoản đã nhận gói, kiểm tra nhãn nguồn (`main` hoặc `reserve`), chọn khoảng ngày lọc theo `from`/`to` và kiểm tra dữ liệu tải chính xác.

**Acceptance Scenarios**:

1. **Given** Quản trị viên mở tab "Danh sách lượt cấp" của một chiến dịch, **When** dữ liệu hiển thị, **Then** bảng cung cấp chi tiết từng lượt cấp: Mã người dùng (`userId`), Tên đăng nhập (`username`), Gói cước (`planSlug`), Nguồn cấp (`source` chỉ nhận giá trị `main` hoặc `reserve`), Thời điểm đăng ký tài khoản (`registeredAt`), Thời điểm được cấp gói (`grantedAt`) và Thời điểm hết hạn gói (`expiresAt`).
2. **Given** quản trị viên quan sát cột Nguồn cấp (`source`), **When** kiểm tra từng dòng, **Then** giao diện hiển thị nhãn phân biệt trực quan: "Hạn mức chính" đối với `main` và "Suất dự phòng" đối với `reserve`.
3. **Given** quản trị viên muốn lọc lượt cấp theo khoảng thời gian, **When** chọn thời điểm bắt đầu (`from`) và kết thúc (`to`), **Then** hệ thống định dạng tham số chuẩn RFC3339 có đầy đủ múi giờ khi gửi lên máy chủ (ví dụ: `2026-10-02T00:00:00+07:00`) để đảm bảo không bị từ chối do lỗi định dạng (Mã 400).
4. **Given** danh sách có nhiều lượt cấp, **When** cuộn hoặc chuyển trang, **Then** hỗ trợ phân trang chuẩn xác với thông tin tổng số lượt cấp (`totalItems`).

---

### User Story 7 - Xem Nhật Ký Kiểm Toán Thao Tác Chiến Dịch (Audit Log) (Priority: P3)

Là một Quản trị viên cấp cao hoặc Trưởng bộ phận vận hành, tôi muốn xem lịch sử toàn bộ các hành động tạo, chỉnh sửa hoặc đóng một chiến dịch (ai đã thực hiện, vào thời điểm nào, từ địa chỉ IP nào, và chi tiết thay đổi Trước → Sau), để đảm bảo trách nhiệm giải trình và kiểm soát tuân thủ nội bộ.

**Why this priority**: Đáp ứng yêu cầu bảo mật, minh bạch và truy vết trách nhiệm khi có sự cố thay đổi hạn mức hoặc đóng chiến dịch ngoài kế hoạch.

**Independent Test**: Mở tab "Nhật ký kiểm toán" của chiến dịch, kiểm tra các dòng ghi nhận hành động `campaign.create`, `campaign.update`, `campaign.close`, kiểm tra khung hiển thị so sánh Before → After và lý do đóng.

**Acceptance Scenarios**:

1. **Given** Quản trị viên xem tab "Nhật ký kiểm toán" của một chiến dịch, **When** dữ liệu nạp xong, **Then** danh sách hiển thị tuần tự theo thời gian gồm: Thời điểm ghi nhận (`createdAt`), Người thực hiện (`actorUserId`), Hành động (`action`), Địa chỉ IP (`requestIp`) và Khung đối chiếu thay đổi.
2. **Given** một dòng nhật ký hành động:
   - Nếu là `campaign.create`: Hiển thị thông số khởi tạo ban đầu của chiến dịch (mã gói, hạn mức, suất dự phòng, thời gian bắt đầu/kết thúc).
   - Nếu là `campaign.update`: Hiển thị bảng đối chiếu rõ ràng giữa Trước (`before`) và Sau (`after`) chỉ cho những trường có sự thay đổi thực tế (`quota`, `reserve`, `startsAt`, `endsAt`, `planSlug`) kèm số phiên bản `version` ở cả hai vế. Trường `endsAt` bị xóa hiển thị rõ dưới dạng nhãn "Không đặt ngày kết thúc".
   - Nếu là `campaign.close`: Hiển thị lý do đóng chiến dịch (`reason`), thời điểm đóng (`closedAt`) và bước tăng phiên bản.
3. **Given** đặc điểm dữ liệu nhật ký kiểm toán máy chủ có trường `targetId` luôn là `null` và mã chiến dịch nằm trong `payload.campaignCode`, **When** giao diện dựng dữ liệu, **Then** xử lý an toàn không dựa vào `targetId` để hiển thị, và trích xuất đúng mã chiến dịch từ `payload`.
4. **Given** cơ chế ghi nhật ký của máy chủ là bất đồng bộ (có thể có độ trễ vài giây sau thao tác), **When** quản trị viên vừa thực hiện thay đổi và mở ngay tab nhật ký, **Then** giao diện hiển thị ghi chú nhắc nhở thân thiện: *"Nhật ký thay đổi được ghi nhận bất đồng bộ, vui lòng làm mới lại sau ít giây nếu chưa thấy dòng cập nhật mới nhất."*

---

### Edge Cases

- **Mất kết nối mạng hoặc máy chủ phản hồi chậm khi thao tác**: Mọi nút bấm gửi form hoặc thực hiện thao tác (Mở, Sửa, Đóng) tự động chuyển sang trạng thái đang xử lý (`loading spinner`, `disabled`), ngăn chặn nhấp đúp (Double-submit). Nếu xảy ra lỗi mạng hoặc lỗi hạ tầng (500), hiển thị thông báo lỗi thân thiện: *"Không thể lưu thông tin chiến dịch. Vui lòng thử lại sau."* và giữ nguyên dữ liệu đã nhập trên form để người dùng không phải gõ lại.
- **Xung đột phiên bản khi nhiều người cùng thao tác (Lỗi HTTP 412 Precondition Failed)**: Khi hai quản trị viên cùng mở màn hình sửa hoặc đóng một chiến dịch, người lưu sau sẽ bị máy chủ từ chối với mã 412. Giao diện PHẢI thông báo rõ ràng rằng dữ liệu đã có sự thay đổi trên hệ thống, tự động tải lại phiên bản mới nhất và hủy bỏ trạng thái lưu cũ để tránh ghi đè dữ liệu sai lệch.
- **Trường hợp chiến dịch đã cấp nhưng người dùng cố tình can thiệp để gửi sửa hạn mức (Lỗi HTTP 422 Unprocessable Entity)**: Mặc dù giao diện đã vô hiệu hóa các ô nhập, nếu máy chủ vẫn trả về lỗi 422 với thông báo cấm sửa hạn mức khi đã cấp, giao diện PHẢI hiển thị chính xác thông báo giải thích từ máy chủ và hướng dẫn người dùng đóng chiến dịch hiện tại để mở mã mới.
- **Trùng lặp mã chiến dịch khi tạo mới (Lỗi HTTP 409 Conflict)**: Khi mã chiến dịch đã tồn tại, hiển thị cảnh báo đỏ trực tiếp tại ô nhập mã chiến dịch: *"Đã tồn tại chiến dịch với mã [code]. Vui lòng chọn một mã khác."*
- **Tra cứu không tìm thấy (Lỗi HTTP 404 Not Found)**:
  - Khi tra cứu bằng mã chiến dịch không tồn tại: Báo lỗi *"Không tìm thấy chiến dịch với mã đã nhận: [code]"*.
  - Khi tra cứu điều kiện của mã người dùng không tồn tại: Báo lỗi *"Không tìm thấy tài khoản người dùng."*.
  - Không bao giờ hiển thị danh sách rỗng hoặc thông báo mơ hồ khiến người dùng không biết sai ở ô nào.
- **Giá trị trạng thái hoặc mã lý do mới/lạ từ máy chủ trong tương lai**:
  - Đối với `status`: Nếu gặp giá trị không nằm trong 6 giá trị chuẩn, giao diện PHẢI có nhánh dự phòng hiển thị nhãn mặc định (ví dụ: "Không xác định") thay vì làm vỡ giao diện.
  - Đối với `reason`: Nếu gặp mã không nằm trong 12 mã chuẩn, giao diện hiển thị thông báo dự phòng mặc định (ví dụ: "Chưa đủ điều kiện nhận ưu đãi") thay vì hiển thị mã chuỗi thô khó hiểu.
- **Cơ chế cấp bị suy giảm nhưng lý do rỗng (`degraded = true`, `degradedReason = ""` )**: Xảy ra khi hệ thống vừa hồi phục một phần nhưng cờ chưa tắt hoàn toàn; giao diện hiển thị thông báo cảnh báo chung: *"Cơ chế cấp gói đang gặp sự cố gián đoạn"* mà không bị lỗi chuỗi rỗng.
- **Chiến dịch không đặt ngày kết thúc (`endsAt = null`)**: Giao diện hiển thị rõ ràng nhãn "Không giới hạn thời gian" hoặc "Vô thời hạn", không hiển thị "null" hoặc để trống khó hiểu.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Hệ thống PHẢI bổ sung mục điều hướng "Chiến dịch tặng gói" trong khu vực Quản trị (`AdminSidebar`), có phân quyền chặt chẽ chỉ cho phép người dùng có vai trò `Admin` truy cập.
- **FR-002**: Hệ thống PHẢI cung cấp màn hình Danh sách Chiến dịch hiển thị đầy đủ các thông số: mã chiến dịch, gói cước áp dụng, hạn mức chính, suất dự phòng, tổng số đã cấp, số lượng còn lại, trần cứng, thời gian diễn ra, trạng thái vòng đời (6 trạng thái), chỉ báo khóa ngân sách và cờ cảnh báo lỗi cấp gói (`degraded`).
- **FR-003**: Hệ thống PHẢI hiển thị cảnh báo mức độ khẩn cấp (Urgent Alert) nổi bật khi một chiến dịch có cờ `degraded: true`, tách biệt hoàn toàn với trạng thái vòng đời của chiến dịch.
- **FR-004**: Hệ thống PHẢI hỗ trợ 6 trạng thái vòng đời chiến dịch theo thứ tự ưu tiên hiển thị: `closed` ("Đã đóng"), `exhausted` ("Đã hết suất"), `expired` ("Đã kết thúc"), `compensation` ("Đang chạy — chỉ còn suất dự phòng"), `running` ("Đang chạy"), `not_started` ("Sắp mở"), kèm nhánh dự phòng cho giá trị không xác định.
- **FR-005**: Hệ thống PHẢI cung cấp công cụ Tra cứu Điều kiện Tài khoản (`/eligibility/{userId}`) cho phép tìm kiếm theo mã chiến dịch và mã khách hàng, hiển thị kết luận cấp gói và lý do chi tiết.
- **FR-006**: Giao diện Tra cứu Điều kiện PHẢI hỗ trợ đầy đủ 6 trạng thái điều kiện (`eligibility`): `granted`, `eligible_pending`, `eligible_but_exhausted`, `not_eligible`, `already_claimed_other_campaign`, `created_by_admin`. Tuyệt đối KHÔNG ĐƯỢC gộp `eligible_pending` vào `eligible_but_exhausted`.
- **FR-007**: Giao diện Tra cứu Điều kiện PHẢI ánh xạ chính xác 12 mã `reason` sang thông điệp tiếng Việt thân thiện, đồng thời xử lý an toàn trường hợp `reason` rỗng đối với trạng thái `granted` và `eligible_pending`.
- **FR-008**: Hệ thống PHẢI cung cấp biểu mẫu Tạo Chiến dịch Mới với các trường: mã chiến dịch (kiểm tra định dạng `^[a-z0-9][a-z0-9-]{2,63}$`), mã gói cước, hạn mức chính (>= 1), suất dự phòng (>= 0), thời gian bắt đầu và kết thúc (chuẩn RFC3339 có múi giờ).
- **FR-009**: Hệ thống PHẢI tự động gọi lại yêu cầu tra cứu chi tiết (`GET /api/v1/admin/campaigns/{code}`) ngay sau mọi thao tác ghi (`POST` tạo, `PATCH` sửa, `POST close`) để nạp số liệu ngân sách và tiến độ cấp thực tế từ máy chủ.
- **FR-010**: Hệ thống PHẢI cung cấp màn hình Chi tiết Chiến dịch hiển thị tiến độ ngân sách trực quan, thông tin mốc ưu tiên (`watermarkAt`), thời gian quét bù cuối (`lastSweepAt`), thời điểm đóng (`closedAt`) và số phiên bản (`version`).
- **FR-011**: Màn hình Chỉnh sửa Chiến dịch PHẢI tự động khóa (disable) các trường `quota`, `reserve` và `planSlug` khi chiến dịch đã cấp ít nhất một lượt (`budgetLocked = true`), kèm thông báo giải thích rõ ràng.
- **FR-012**: Màn hình Chỉnh sửa Chiến dịch PHẢI khóa cố định không cho phép sửa mã chiến dịch (`code`), chỉ gửi lên các trường thực sự thay đổi kèm theo số phiên bản (`version`), và hỗ trợ xóa ngày kết thúc (`endsAt: null`).
- **FR-013**: Hệ thống PHẢI xử lý lỗi xung đột phiên bản (Mã 412) khi chỉnh sửa hoặc đóng chiến dịch bằng cách cảnh báo người dùng và tự động làm mới dữ liệu mới nhất từ máy chủ.
- **FR-014**: Hệ thống PHẢI cung cấp chức năng Đóng Cưỡng Bức Chiến Dịch với hộp thoại cảnh báo hành động một chiều và bắt buộc nhập lý do đóng để lưu vào nhật ký kiểm toán.
- **FR-015**: Hệ thống PHẢI cung cấp tab xem Danh Sách Lượt Cấp (`claims`), hiển thị chi tiết người nhận, nguồn cấp (`main` hoặc `reserve`), ngày đăng ký, ngày cấp, ngày hết hạn và hỗ trợ lọc theo khoảng thời gian chuẩn RFC3339 có múi giờ.
- **FR-016**: Hệ thống PHẢI cung cấp tab xem Nhật Ký Kiểm Toán (`audit`), hiển thị người thực hiện, thời điểm, IP, hành động (`campaign.create`, `campaign.update`, `campaign.close`), lý do đóng và bảng so sánh chi tiết Trước → Sau (`before`/`after`).

---

### Key Entities

- **Campaign (Chiến dịch tặng gói)**: Thực thể đại diện cho một chương trình khuyến mãi cấp gói cước tự động cho tài khoản đăng ký mới. Bao gồm mã định danh duy nhất (`code`), gói cước tặng (`planSlug`, `planName`), hạn mức chính (`quota`), suất dự phòng (`reserve`), các mốc thời gian (`startsAt`, `endsAt`, `closedAt`, `watermarkAt`, `lastSweepAt`), các chỉ số ngân sách đã cấp và còn lại, trạng thái vòng đời (`status`), cờ lỗi cấp gói (`degraded`, `degradedReason`), cờ khóa ngân sách (`budgetLocked`) và số phiên bản kiểm soát đồng thời (`version`).
- **Campaign Claim (Lượt cấp gói)**: Bản ghi ghi nhận một lần cấp gói thành công cho người dùng. Bao gồm mã người dùng (`userId`), tên đăng nhập (`username`), gói cước (`planSlug`), nguồn cấp ngân sách (`source`: `main` hoặc `reserve`), thời điểm đăng ký tài khoản (`registeredAt`), thời điểm được cấp gói (`grantedAt`) và thời điểm hết hạn gói (`expiresAt`).
- **Eligibility Record (Bản ghi điều kiện tài khoản)**: Kết quả tra cứu điều kiện của một tài khoản người dùng đối với một chiến dịch. Bao gồm mã chiến dịch, mã người dùng, ngày đăng ký tài khoản, kết luận có được cấp hay không (`granted`), trạng thái điều kiện (`eligibility`: 6 giá trị), mã lý do (`reason`: 12 giá trị hoặc rỗng) và mốc ưu tiên (`watermarkAt`).
- **Campaign Audit Log (Nhật ký kiểm toán chiến dịch)**: Dòng ghi nhận sự kiện thay đổi cấu hình hoặc trạng thái chiến dịch. Bao gồm mã nhật ký (`id`), người thực hiện (`actorUserId`), loại hành động (`action`: `campaign.create`, `campaign.update`, `campaign.close`), địa chỉ mạng (`requestIp`), thời điểm thao tác (`createdAt`), đối tượng mục tiêu (`targetType` là `campaign`, `targetId` luôn là `null`), và nội dung chi tiết (`payload` chứa mã chiến dịch, dữ liệu trước/sau thay đổi hoặc lý do đóng).

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% nhân viên vận hành và hỗ trợ khách hàng có thể tra cứu và giải đáp trạng thái cấp gói của một tài khoản trong vòng dưới 10 giây thông qua công cụ tra cứu điều kiện.
- **SC-002**: Giảm 100% các khiếu nại sai lệch phát sinh từ việc nhân viên đọc nhầm trạng thái "đang xử lý" (`eligible_pending`) thành "hết suất" (`eligible_but_exhausted`).
- **SC-003**: 100% sự cố gián đoạn cấp gói nền (`degraded = true`) được cảnh báo trực quan bằng màu đỏ ngay trên giao diện danh sách và chi tiết, giúp đội ngũ vận hành nhận biết tức thì mà không cần tra cứu log máy chủ.
- **SC-004**: Ngăn chặn 100% lỗi ghi đè dữ liệu hoặc lỗi vi phạm dữ liệu ngân sách đã khóa thông qua cơ chế khóa ô tự động trên giao diện (`budgetLocked`) và kiểm soát phiên bản lạc quan (`version` / 412 handling).
- **SC-005**: 100% các thao tác thay đổi cấu hình, hạn mức hoặc đóng chiến dịch được lưu vết kiểm toán đầy đủ với đối chiếu Trước → Sau và lý do giải trình rõ ràng.
- **SC-006**: Đảm bảo toàn bộ các biểu mẫu nhập thời gian và bộ lọc ngày tháng gửi dữ liệu chuẩn RFC3339 có múi giờ, tỷ lệ lỗi tham số thời gian (Mã 400) đạt 0%.

---

## Assumptions

- **Vai trò người dùng**: Tính năng này nằm trong phân hệ Quản trị (`/admin/campaigns`), chỉ phục vụ người dùng có vai trò `Admin` đã xác thực; không cung cấp cho người dùng cuối thông thường.
- **Hạ tầng API Backend**: Phía máy chủ đã triển khai hoàn thiện và ổn định toàn bộ 8 endpoint theo tài liệu `025-signup-campaign-grant` và `026-campaign-registry-db` dưới tiền tố `/api/v1/admin/campaigns`.
- **Ngân sách hiển thị**: Do 3 endpoint ghi (`POST`, `PATCH`, `close`) không trả số liệu đếm lượt cấp thật, giao diện luôn tuân thủ nguyên tắc gọi lại API đọc (`GET /{code}`) sau mỗi thao tác ghi để đảm bảo hiển thị con số chính xác nhất.
- **Ngôn ngữ giao diện**: Toàn bộ nhãn, thông báo trạng thái, mã lý do và thông điệp cảnh báo lỗi được bản địa hóa sang tiếng Việt chuẩn mực, chuyên nghiệp và nhất quán với phong cách thiết kế hiện tại của hệ sinh thái Smart Wardrobe.
