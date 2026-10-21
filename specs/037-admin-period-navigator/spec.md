# Feature Specification: Bộ Chọn Kỳ Dùng Chung Quản Trị Hệ Thống (Admin Shared Period Navigator)

**Feature Branch**: `037-admin-period-navigator`

**Created**: 2026-10-20

**Status**: Draft

**Input**: User description: "Đọc kỹ ../smart-wardrobe-be/specs/029-admin-observability/frontend-guide.md trước khi làm. Prompt này CHỈ chứa yêu cầu bổ sung/khác guide; khi mâu thuẫn, phần dưới đây được ưu tiên. ## Nhánh & ràng buộc repo: Làm trên dev: git checkout dev && git pull origin dev. Không sửa main. Giữ nguyên việc 2 KPI card totalBrands/pendingReviewBrands đang bị comment trên dev; không tự bật lại. Dùng đúng hạ tầng auth hiện có (axios baseURL: '/api/v1' + cookie, serverFetch đọc cookie accessToken); không hardcode Bearer token. Chạy npm run lint và npm test; không commit/push khi chưa được yêu cầu. Nếu thay đổi lớn: trình plan ngắn trước khi code; nếu không: làm luôn rồi báo lại. ## Bộ chọn kỳ dùng chung cho dashboard + activity-events + transactions: Bổ sung/override mục 2.4 và 4.8 của guide: Dùng chung một navigator cho cả 3 màn, tối thiểu gồm: Hôm nay | Tuần này | Tháng này | Năm này | Tuỳ chọn. Mặc định khi không có query param: Tháng này. 'Tuần này' = Thứ 2 → hôm nay; tuần tính Thứ 2–Chủ nhật. 'Năm này' = 01/01 → hôm nay. Hai nút ◀ ▶ đặt hai bên bộ chọn kỳ: Hôm nay: ±1 ngày; Tuần: ±1 tuần; Tháng: ±1 tháng; Năm: ±1 năm. Kỳ quá khứ là đơn vị đầy đủ (tuần đủ Thứ 2–CN, tháng đủ ngày, năm đủ 01/01–31/12). Đang ở kỳ hiện tại: disable ▶; khi tiến về kỳ hiện tại thì kẹp toDate = hôm nay và disable ▶. 'Tuỳ chọn': ◀ ▶ dịch đúng bằng số ngày của range; kẹp toDate ≤ hôm nay; disable ▶ khi toDate = hôm nay. Bấm preset hoặc mũi tên áp dụng ngay; riêng 'Tuỳ chọn' mới cần nút 'Áp dụng'. Lưu preset vào URL cùng fromDate/toDate để share link và back/forward khôi phục đúng cả preset lẫn kỳ; đổi kỳ reset page = 1. Nhãn kỳ dạng 'Tháng 10/2026 · 01/10 – 20/10/2026', lấy từ chính giá trị đã gửi. Responsive, keyboard accessible, aria-label tiếng Việt, chặn chọn ngày tương lai. Khi đổi kỳ: giữ dữ liệu cũ + indicator đang tải (keepPreviousData), không nháy skeleton toàn trang, không reset scroll. ## Kiểm thử bổ sung: Test preset/mũi tên: default 'Tháng này'; tuần bắt đầu Thứ 2; lùi/tiến tháng/năm đúng; clamp không vượt hôm nay; 'Tuỳ chọn' dịch theo đúng số ngày; preset được lưu/khôi phục từ URL."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Chuyển Đổi Kỳ Báo Cáo Nhanh Qua Các Preset Chuẩn Hóa (Priority: P1)

Là Quản trị viên hệ thống (Admin), tôi muốn có một bộ chọn kỳ dùng chung thống nhất trên cả 3 màn hình quan sát (Tổng quan Dashboard, Nhật ký Hoạt động Người dùng, và Giao dịch payOS) với các mốc thời gian nhanh chuẩn hóa (*Hôm nay*, *Tuần này*, *Tháng này*, *Năm này*, *Tuỳ chọn*), trong đó mặc định luôn là *Tháng này*, để theo dõi số liệu vận hành và đối soát nhất quán mà không phải tự chọn ngày thủ công mỗi lần truy cập.

**Why this priority**: Cả 3 màn hình giám sát admin phục vụ nhu cầu kiểm tra sức khỏe hệ thống, doanh thu và đối soát. Hiện tại mỗi trang có cách chọn ngày rời rạc hoặc mặc định 30 ngày cuốn, gây phân mảnh trải nghiệm và sai lệch kỳ đối chiếu. Thống nhất một bộ điều hướng kỳ với mặc định "Tháng này" là nền tảng cốt lõi cho toàn bộ trải nghiệm quan sát.

**Independent Test**: Quản trị viên truy cập vào bất kỳ màn hình nào trong 3 trang (Dashboard, Hoạt động người dùng, Giao dịch payOS) mà không truyền query param trên URL; giao diện tự động chọn preset "Tháng này" với khoảng thời gian từ ngày 01 của tháng hiện tại đến ngày hôm nay (theo giờ Việt Nam), nhãn kỳ hiển thị chính xác "Tháng MM/YYYY · 01/MM – DD/MM/YYYY", và dữ liệu được tải khớp với khoảng ngày này.

**Acceptance Scenarios**:

1. **Given** Quản trị viên truy cập Dashboard (`/admin/dashboard`), Hoạt động người dùng (`/admin/activity-events`) hoặc Giao dịch payOS (`/admin/transactions`) không có query param ngày, **When** trang tải xong, **Then** bộ điều hướng hiển thị trạng thái kích hoạt tại preset "Tháng này", khoảng ngày tự động tính là từ ngày mùng 1 của tháng hiện tại đến ngày hiện tại (giờ Việt Nam +07:00), và nút tiến ▶ bị vô hiệu hóa.
2. **Given** Quản trị viên đang ở bất kỳ màn hình nào trong 3 màn hình trên, **When** nhấn vào preset "Hôm nay", **Then** khoảng ngày áp dụng ngay lập tức là `fromDate = hôm nay` và `toDate = hôm nay`, nhãn kỳ cập nhật định dạng "Hôm nay · DD/MM/YYYY", nút tiến ▶ bị vô hiệu hóa, và trang reset về `page = 1`.
3. **Given** Quản trị viên đang ở preset bất kỳ, **When** nhấn vào preset "Tuần này", **Then** khoảng ngày áp dụng ngay lập tức bắt đầu từ Thứ Hai của tuần hiện tại đến ngày hôm nay, nhãn kỳ hiển thị "Tuần [W]/YYYY · [Thứ 2] – [Hôm nay]", nút tiến ▶ bị vô hiệu hóa, và phân trang reset về `page = 1`.
4. **Given** Quản trị viên đang ở preset bất kỳ, **When** nhấn vào preset "Năm này", **Then** khoảng ngày áp dụng ngay lập tức từ `01/01/[Năm hiện tại]` đến ngày hôm nay, nhãn kỳ hiển thị "Năm YYYY · 01/01 – DD/MM/YYYY", nút tiến ▶ bị vô hiệu hóa.
5. **Given** Quản trị viên chuyển đổi qua lại giữa các preset "Hôm nay", "Tuần này", "Tháng này", "Năm này", **Then** hệ thống áp dụng bộ lọc mới ngay lập tức mà không yêu cầu thêm thao tác nhấn nút phụ.

---

### User Story 2 - Di Chuyển Tiến/Lùi Kỳ Với Đơn Vị Đầy Đủ & Kẹp Ngày Hiện Tại (Priority: P1)

Là Quản trị viên hệ thống, tôi muốn sử dụng hai nút mũi tên điều hướng ◀ (Lùi) và ▶ (Tiến) đặt ở hai bên bộ chọn kỳ để duyệt nhanh về quá khứ hoặc tiến lại về hiện tại theo đúng chu kỳ (ngày, tuần, tháng, năm), đảm bảo các kỳ quá khứ luôn là đơn vị thời gian trọn vẹn và không bao giờ vượt quá ngày hiện tại.

**Why this priority**: Khi xem xét xu hướng dữ liệu hoặc đối soát lịch sử, admin thường xuyên cần so sánh tuần trước, tháng trước, hoặc năm trước. Việc tính toán tự động các chu kỳ tròn (ví dụ: tháng trước đủ từ ngày 01 đến ngày cuối tháng) giúp tiết kiệm thao tác và loại bỏ hoàn toàn sai sót chọn thiếu ngày cuối kỳ.

**Independent Test**: Khi đang ở preset "Tháng này" (ví dụ tháng 10/2026, từ 01/10 đến 20/10/2026), nhấn nút ◀ lùi 1 tháng; hệ thống tự động chuyển sang tháng 09/2026 đầy đủ (01/09/2026 – 30/09/2026), nút ▶ được mở lại; tiếp tục nhấn nút ▶ để tiến, hệ thống trở về tháng 10/2026 kẹp từ 01/10/2026 đến 20/10/2026 và tự động vô hiệu hóa nút ▶.

**Acceptance Scenarios**:

1. **Given** người dùng đang ở preset "Hôm nay", **When** nhấn nút ◀, **Then** hệ thống lùi chính xác 1 ngày (ví dụ từ 20/10 sang 19/10), nút ▶ được kích hoạt cho phép tiến lại; khi nhấn ▶ tiến về hôm nay thì nút ▶ tự động bị vô hiệu hóa.
2. **Given** người dùng đang ở preset "Tuần này" (từ Thứ 2 đến hôm nay), **When** nhấn nút ◀, **Then** hệ thống lùi về tuần trước đó với đầy đủ 7 ngày từ Thứ Hai đến Chủ Nhật (ví dụ 13/10 đến 19/10), nhãn kỳ hiển thị tuần đầy đủ và nút ▶ được kích hoạt.
3. **Given** người dùng đang ở một tuần quá khứ, **When** nhấn nút ▶ tiến dần về tuần hiện tại, **Then** ngày kết thúc (`toDate`) tự động kẹp tại ngày hôm nay (không lấy đến Chủ Nhật trong tương lai) và nút ▶ bị vô hiệu hóa.
4. **Given** người dùng đang ở preset "Tháng này", **When** nhấn nút ◀, **Then** hệ thống lùi về tháng trước với đầy đủ ngày từ ngày 01 đến ngày cuối tháng (28, 29, 30 hoặc 31 ngày tùy tháng), nhãn kỳ hiển thị định dạng "Tháng MM/YYYY · 01/MM – DD/MM/YYYY".
5. **Given** người dùng đang ở một tháng quá khứ, **When** nhấn nút ▶ tiến dần về tháng hiện tại, **Then** ngày kết thúc (`toDate`) được kẹp chính xác tại ngày hôm nay và nút ▶ bị vô hiệu hóa.
6. **Given** người dùng đang ở preset "Năm này", **When** nhấn nút ◀, **Then** hệ thống lùi về năm trước với đầy đủ 365/366 ngày từ 01/01 đến 31/12 của năm đó; khi tiến ▶ về năm hiện tại thì `toDate` được kẹp tại ngày hôm nay và nút ▶ bị vô hiệu hóa.
7. **Given** người dùng đang ở preset "Tuỳ chọn" với khoảng cách N ngày (ví dụ 10 ngày từ 01/10 đến 10/10), **When** nhấn nút ◀, **Then** cả `fromDate` và `toDate` dịch lùi đúng bằng N ngày; khi nhấn ▶ tiến tới khi `toDate = hôm nay` thì nút ▶ bị vô hiệu hóa và không cho phép tiến vượt quá ngày hôm nay.

---

### User Story 3 - Chọn Khoảng Thời Gian Tùy Chọn & Chặn Ngày Tương Lai (Priority: P2)

Là Quản trị viên hệ thống, tôi muốn có khả năng mở lịch chọn một khoảng ngày bất kỳ khi chọn preset "Tuỳ chọn", trong đó giao diện ngăn chặn hoàn toàn việc chọn các ngày trong tương lai và chỉ áp dụng bộ lọc khi tôi xác nhận bấm nút "Áp dụng".

**Why this priority**: Bên cạnh các chu kỳ chuẩn, admin cần điều tra các khoảng thời gian đặc thù (ví dụ: đợt khuyến mãi kéo dài 5 ngày, hoặc khoảng thời gian xảy ra sự cố thanh toán cụ thể). Cơ chế xác nhận rõ ràng giúp tránh gửi các yêu cầu truy vấn dở dang khi đang chọn ngày đầu mà chưa chọn ngày cuối.

**Independent Test**: Quản trị viên bấm vào preset "Tuỳ chọn", bảng lịch mở ra; các ngày trong tương lai sau ngày hôm nay bị làm mờ và không thể click; admin chọn ngày bắt đầu và kết thúc hợp lệ trong quá khứ, nhấn nút "Áp dụng"; hệ thống cập nhật khoảng ngày, nhãn hiển thị và làm mới danh sách dữ liệu.

**Acceptance Scenarios**:

1. **Given** Quản trị viên nhấn vào preset "Tuỳ chọn", **Then** lịch chọn khoảng ngày mở ra hiển thị các ngày với ngôn ngữ tiếng Việt, các ngày sau ngày hôm nay bị vô hiệu hóa hoàn toàn (không thể chọn).
2. **Given** Quản trị viên đang chọn ngày trên lịch, **When** chọn xong ngày bắt đầu hoặc thay đổi ngày, **Then** hệ thống chưa gửi truy vấn dữ liệu mới cho đến khi Quản trị viên nhấn nút "Áp dụng".
3. **Given** Quản trị viên chọn ngày bắt đầu sau ngày kết thúc hoặc dữ liệu ngày không hợp lệ, **Then** nút "Áp dụng" bị vô hiệu hóa hoặc hệ thống cảnh báo rõ ràng bằng tiếng Việt, ngăn chặn gửi tham số lỗi lên máy chủ.
4. **Given** Quản trị viên đã áp dụng khoảng ngày tùy chọn, **When** nhấn nút ◀ hoặc ▶, **Then** hệ thống dịch chuyển khoảng ngày theo đúng tổng số ngày của khoảng thời gian đang chọn (khoảng cách = `toDate - fromDate + 1` ngày) và áp dụng ngay lập tức.

---

### User Story 4 - Lưu Trữ Trạng Thái Vào URL & Khôi Phục Lịch Sử Điều Hướng (Priority: P2)

Là Quản trị viên, tôi muốn preset hiện tại cùng khoảng ngày (`fromDate`, `toDate`) được đồng bộ đầy đủ vào thanh địa chỉ URL để tôi có thể sao chép liên kết chia sẻ cho đồng nghiệp, tải lại trang mà không mất ngữ cảnh, hoặc sử dụng nút Back/Forward của trình duyệt để quay lại các kỳ trước đó một cách chính xác.

**Why this priority**: Quản trị viên làm việc theo nhóm điều tra sự cố. Khi phát hiện một giao dịch lỗi hoặc số liệu bất thường trong một kỳ cụ thể, admin cần chia sẻ URL trực tiếp cho đồng nghiệp; URL phải mở ra đúng chính xác cả preset lẫn khoảng ngày đã lọc.

**Independent Test**: Quản trị viên chọn preset "Tuần này" và lùi 1 tuần trên màn hình Giao dịch payOS, URL được cập nhật dạng `?preset=this_week&fromDate=2026-10-12&toDate=2026-10-18&page=1`. Sao chép URL này dán vào tab trình duyệt mới, trang mở ra đúng tuần 12/10 – 18/10, preset "Tuần này" được hiển thị đúng trạng thái đang chọn.

**Acceptance Scenarios**:

1. **Given** Quản trị viên thay đổi bất kỳ preset hoặc nhấn mũi tên ◀ ▶, **Then** thanh địa chỉ URL được cập nhật ngay lập tức với các tham số `preset`, `fromDate`, `toDate` mà không gây tải lại toàn bộ trang (sử dụng Next.js shallow navigation / client routing).
2. **Given** trang đang ở một trang phân trang khác 1 (ví dụ `page=3`), **When** Quản trị viên thay đổi kỳ thời gian hoặc đổi preset, **Then** tham số phân trang tự động được đặt lại về `page=1`.
3. **Given** Quản trị viên bấm nút Back (quay lại) trên trình duyệt sau khi đã đổi qua nhiều kỳ thời gian, **Then** giao diện bộ điều hướng và dữ liệu hiển thị được khôi phục chính xác tương ứng với trạng thái kỳ trước đó được ghi nhận trên URL.
4. **Given** người dùng truy cập một URL có sẵn `fromDate` và `toDate` nhưng không có `preset`, **Then** hệ thống tự động suy luận preset phù hợp hoặc chuyển về preset "Tuỳ chọn" để hiển thị nhất quán.

---

### User Story 5 - Trải Nghiệm Chuyển Đổi Mượt Mà & Khả Năng Tiếp Cận (Priority: P3)

Là Quản trị viên, tôi muốn khi chuyển đổi giữa các kỳ thời gian, giao diện giữ lại dữ liệu cũ và hiển thị biểu tượng đang tải nhẹ nhàng (không giật nháy màn hình, không trượt vị trí cuộn trang), đồng thời bộ điều hướng hỗ trợ đầy đủ phím bấm và nhãn tiếng Việt dễ tiếp cận.

**Why this priority**: Việc nhấp nháy skeleton toàn trang hoặc nhảy thanh cuộn mỗi khi bấm lùi/tiến kỳ gây mỏi mắt và ức chế trải nghiệm khi admin cần duyệt liên tục nhiều tháng hoặc nhiều tuần. Giữ dữ liệu cũ với chỉ báo tải nhẹ giúp trải nghiệm chuyên nghiệp, mượt mà.

**Independent Test**: Trên trang Dashboard hoặc Giao dịch, cuộn trang xuống một đoạn, bấm nút ◀ để lùi kỳ; bảng dữ liệu hiện tại vẫn hiển thị kèm hiệu ứng mờ nhẹ hoặc xoay spinner nhỏ trên thanh công cụ, không xuất hiện skeleton trắng toàn trang, vị trí cuộn trang giữ nguyên, sau khi dữ liệu mới về bảng cập nhật mượt mà.

**Acceptance Scenarios**:

1. **Given** Quản trị viên chuyển kỳ khi trang đang hiển thị dữ liệu, **Then** hệ thống giữ lại dữ liệu cũ trong lúc chờ dữ liệu mới (`keepPreviousData`), hiển thị chỉ báo đang tải tinh tế tại thanh công cụ hoặc trên bảng, tuyệt đối không hiển thị khung skeleton toàn trang.
2. **Given** Quản trị viên đang cuộn ở giữa trang, **When** chuyển kỳ, **Then** vị trí thanh cuộn (`scroll position`) của trình duyệt được giữ nguyên vẹn, không bị nhảy ngược lên đầu trang.
3. **Given** Quản trị viên điều hướng bằng bàn phím (Tab, Enter, Space), **Then** có thể di chuyển và kích hoạt mọi nút preset, nút ◀ ▶ và nút Áp dụng một cách trực quan với viền focus rõ ràng.
4. **Given** công cụ đọc màn hình (Screen Reader), **Then** các nút ◀ và ▶ có đầy đủ thuộc tính `aria-label` tiếng Việt trực quan ("Kỳ trước", "Kỳ sau") và phản ánh đúng trạng thái `aria-disabled="true"` khi bị vô hiệu hóa.
5. **Given** giao diện trên thiết bị di động hoặc máy tính bảng (màn hình hẹp), **Then** bộ điều hướng hiển thị co giãn linh hoạt (responsive), không bị tràn vỡ giao diện hay mất chữ.

---

### Edge Cases

- **Năm nhuận và số ngày trong tháng**: Khi lùi/tiến về tháng 2 của năm nhuận (29 ngày) hoặc năm không nhuận (28 ngày), hoặc các tháng 30/31 ngày, hệ thống phải tính toán ngày cuối tháng chính xác tuyệt đối theo lịch Việt Nam, không được tràn sang tháng kế tiếp.
- **Tuần giao giữa hai tháng hoặc hai năm**: Tuần bắt đầu từ Thứ Hai và kết thúc Chủ Nhật có thể vắt qua hai tháng (ví dụ 29/09 đến 05/10) hoặc vắt qua hai năm; nhãn kỳ và khoảng ngày phải hiển thị chính xác cả hai mốc ngày.
- **Đang ở ngày đầu năm hoặc đầu tuần**: Khi đang ở ngày Thứ Hai đầu tuần hoặc ngày 01/01 đầu năm, preset "Tuần này" hay "Năm này" có `fromDate = toDate = hôm nay`; khi bấm ◀ hệ thống lùi về trọn vẹn tuần trước hoặc năm trước đó.
- **Dịch chuyển kỳ "Tuỳ chọn" chạm mốc hôm nay**: Khi người dùng chọn khoảng 15 ngày trong quá khứ và bấm ▶ nhiều lần, nếu bước nhảy tiếp theo khiến `toDate` vượt quá ngày hôm nay, hệ thống phải kẹp `toDate = hôm nay` và điều chỉnh `fromDate` tương ứng, đồng thời vô hiệu hóa nút ▶.
- **Người dùng nhập trực tiếp tham số sai trên URL**: Người dùng cố tình sửa URL với `fromDate > toDate` hoặc định dạng ngày sai; hệ thống hiển thị thông báo lỗi bằng tiếng Việt rõ ràng, giữ nguyên giá trị để người dùng sửa hoặc cung cấp nút "Đặt lại về mặc định", không nuốt lỗi im lặng.
- **Xác thực và phân quyền**: Dùng đúng hạ tầng axios và cookie hiện có, không hardcode token; nếu gặp lỗi 401 điều hướng về đăng nhập, nếu 403 hiển thị thông báo không có quyền quản trị.
- **Giữ nguyên hiện trạng 2 thẻ KPI card**: Hai thẻ KPI `totalBrands` và `pendingReviewBrands` đang bị comment trên branch `dev` phải được giữ nguyên vẹn, không được tự ý bỏ comment.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Hệ thống PHẢI xây dựng một thành phần điều hướng kỳ dùng chung (`AdminPeriodNavigator`) được tái sử dụng thống nhất trên 3 màn hình:
  1. Tổng quan Dashboard (`/admin/dashboard`)
  2. Nhật ký Hoạt động Người dùng (`/admin/activity-events`)
  3. Giao dịch payOS (`/admin/transactions`)
- **FR-002**: Thành phần điều hướng PHẢI cung cấp tối thiểu 5 tùy chọn preset:
  1. *Hôm nay* (`today`)
  2. *Tuần này* (`this_week`)
  3. *Tháng này* (`this_month`)
  4. *Năm này* (`this_year`)
  5. *Tuỳ chọn* (`custom`)
- **FR-003**: Hệ thống PHẢI đặt giá trị mặc định là *Tháng này* (`this_month`) trên cả 3 màn hình khi không có tham số kỳ trên URL query parameters.
- **FR-004**: Khoảng ngày của các preset hiện tại PHẢI được tính toán chuẩn xác theo múi giờ Việt Nam (`Asia/Ho_Chi_Minh`, UTC+07:00):
  - *Hôm nay*: `fromDate = hôm nay`, `toDate = hôm nay`.
  - *Tuần này*: `fromDate = Thứ Hai của tuần hiện tại`, `toDate = hôm nay` (tuần tính từ Thứ Hai đến Chủ Nhật).
  - *Tháng này*: `fromDate = ngày 01 của tháng hiện tại`, `toDate = hôm nay`.
  - *Năm này*: `fromDate = 01/01 của năm hiện tại`, `toDate = hôm nay`.
- **FR-005**: Thành phần điều hướng PHẢI trang bị hai nút mũi tên ◀ (Lùi kỳ) và ▶ (Tiến kỳ) đặt ở hai bên bộ chọn kỳ với quy tắc dịch chuyển:
  - Preset *Hôm nay*: ◀ lùi 1 ngày; ▶ tiến 1 ngày.
  - Preset *Tuần này* / Tuần: ◀ lùi 1 tuần; ▶ tiến 1 tuần.
  - Preset *Tháng này* / Tháng: ◀ lùi 1 tháng; ▶ tiến 1 tháng.
  - Preset *Năm này* / Năm: ◀ lùi 1 năm; ▶ tiến 1 năm.
  - Preset *Tuỳ chọn*: ◀ và ▶ dịch chuyển đúng bằng tổng số ngày của khoảng thời gian đang chọn (`toDate - fromDate + 1` ngày).
- **FR-006**: Mọi kỳ trong quá khứ khi lùi về PHẢI là đơn vị thời gian đầy đủ:
  - Tuần quá khứ: Đầy đủ 7 ngày từ Thứ Hai đến Chủ Nhật.
  - Tháng quá khứ: Đầy đủ từ ngày 01 đến ngày cuối cùng của tháng đó (28/29/30/31).
  - Năm quá khứ: Đầy đủ 365/366 ngày từ ngày 01/01 đến 31/12.
- **FR-007**: Hệ thống PHẢI vô hiệu hóa nút tiến ▶ khi kỳ đang chọn chạm mốc hiện tại; khi tiến từ quá khứ về kỳ hiện tại, hệ thống PHẢI kẹp `toDate = hôm nay` và vô hiệu hóa nút ▶.
- **FR-008**: Khi người dùng bấm vào các nút preset hoặc bấm mũi tên ◀ ▶, hệ thống PHẢI áp dụng bộ lọc và truy vấn dữ liệu ngay lập tức. Riêng preset *Tuỳ chọn* mới yêu cầu bấm nút "Áp dụng" sau khi chọn ngày trên lịch.
- **FR-009**: Hệ thống PHẢI lưu trữ đồng bộ trạng thái `preset`, `fromDate` và `toDate` vào URL query parameters trên cả 3 màn hình. Khi người dùng sao chép liên kết hoặc sử dụng nút Back/Forward của trình duyệt, trạng thái kỳ và preset PHẢI được khôi phục chính xác.
- **FR-010**: Khi thay đổi kỳ thời gian (đổi preset hoặc bấm mũi tên), hệ thống PHẢI tự động đặt lại số trang `page = 1` trên các bảng phân trang.
- **FR-011**: Nhãn hiển thị kỳ trên thanh điều hướng PHẢI được suy ra trực tiếp từ chính giá trị `fromDate` và `toDate` đã gửi, định dạng trực quan (ví dụ: "Tháng 10/2026 · 01/10 – 20/10/2026", "Tuần 42/2026 · 13/10 – 19/10/2026", "Năm 2026 · 01/01 – 20/10/2026").
- **FR-012**: Giao diện PHẢI chặn hoàn toàn việc chọn các ngày trong tương lai (sau ngày hôm nay theo giờ Việt Nam) trên bảng lịch.
- **FR-013**: Thành phần điều hướng PHẢI hỗ trợ điều khiển đầy đủ qua bàn phím, đáp ứng chuẩn hiển thị co giãn (responsive), và cung cấp `aria-label` bằng tiếng Việt rõ ràng cho mọi nút chức năng.
- **FR-014**: Khi thay đổi kỳ thời gian, hệ thống PHẢI giữ nguyên dữ liệu đang hiển thị kèm chỉ báo trạng thái đang tải nhẹ nhàng (`keepPreviousData`), KHÔNG làm nhấp nháy khung skeleton toàn trang, và KHÔNG cuộn trang về đầu (`preserve scroll position`).
- **FR-015**: Hệ thống PHẢI tuân thủ nghiêm ngặt ràng buộc bảo mật: dùng đúng hạ tầng xác thực hiện có qua axios baseURL `/api/v1` và cookie phiên (không hardcode Bearer token), đồng thời giữ nguyên việc comment 2 thẻ KPI card `totalBrands` và `pendingReviewBrands` trên nhánh `dev`.

---

### Key Entities *(include if feature involves data)*

- **PeriodPreset**: Định danh kiểu chuỗi đại diện cho preset đang chọn: `'today' | 'this_week' | 'this_month' | 'this_year' | 'custom'`.
- **DateRangeFilter**: Bộ giá trị ngày bao gồm `fromDate` (`YYYY-MM-DD`), `toDate` (`YYYY-MM-DD`), và `preset` (`PeriodPreset`), tính theo giờ Việt Nam (+07:00).
- **PeriodLabelModel**: Dữ liệu hiển thị của nhãn kỳ, gồm tên phân đoạn (ví dụ "Tháng 10/2026", "Tuần 42/2026", "Năm 2026") và khoảng ngày cụ thể ("01/10 – 20/10/2026").

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Quản trị viên có thể chuyển đổi giữa các chu kỳ báo cáo (hôm nay, tuần, tháng, năm) chỉ bằng đúng 1 lần click chuột hoặc 1 thao tác bàn phím, dữ liệu bắt đầu tải ngay lập tức trong vòng dưới 100ms.
- **SC-002**: 100% các kỳ quá khứ khi lùi từ nút ◀ được đảm bảo là đơn vị trọn vẹn (tuần đủ Thứ 2–CN, tháng đủ 01–cuối tháng, năm đủ 01/01–31/12), không xảy ra tình trạng thiếu ngày cuối kỳ.
- **SC-003**: 100% các trường hợp tiến về hiện tại bằng nút ▶ được chặn tuyệt đối không vượt quá ngày hôm nay (`toDate <= todayVN`), nút ▶ tự động chuyển sang trạng thái disabled khi `toDate = todayVN`.
- **SC-004**: 100% các liên kết được sao chép từ thanh địa chỉ URL khôi phục chính xác cả preset được chọn và khoảng ngày `fromDate`/`toDate` khi mở trên tab mới hoặc qua nút Back/Forward trình duyệt.
- **SC-005**: 0% hiện tượng giật nháy skeleton toàn trang hoặc trượt vị trí cuộn trang khi thay đổi kỳ thời gian trên cả 3 màn hình quan sát.
- **SC-006**: Toàn bộ bộ test đơn vị (unit tests) cho tiện ích tính toán kỳ và bộ điều hướng vượt qua 100% kiểm thử (`npm test`) và không có bất kỳ cảnh báo/lỗi lint nào (`npm run lint`).

---

## Assumptions

- Múi giờ chuẩn của toàn bộ hệ thống quản trị là Giờ Việt Nam (`Asia/Ho_Chi_Minh`, GMT+7), mọi tính toán ngày tháng đều căn cứ theo ngày lịch Việt Nam bất kể múi giờ cục bộ của trình duyệt người dùng.
- Tuần làm việc được chuẩn hóa theo chuẩn quốc tế và Việt Nam bắt đầu từ Thứ Hai (Monday) và kết thúc vào Chủ Nhật (Sunday).
- Máy chủ backend đã hỗ trợ đầy đủ các tham số `fromDate` và `toDate` theo định dạng `YYYY-MM-DD` bao gồm cả hai đầu cho các endpoint của 3 màn hình theo tài liệu `frontend-guide.md`.
- Hạ tầng xác thực (cookie accessToken, axios interceptors) hoạt động ổn định trên môi trường dev; không can thiệp hay thay đổi hạ tầng auth này.
- Hai thẻ KPI `totalBrands` và `pendingReviewBrands` tiếp tục được giữ nguyên trạng thái bị comment theo đúng chỉ đạo của người dùng.
