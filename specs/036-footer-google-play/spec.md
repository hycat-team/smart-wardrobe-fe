# Feature Specification: 036 Tích hợp Huy hiệu Google Play và Tái cấu trúc Footer

**Feature Branch**: `036-footer-google-play`

**Created**: 2026-10-20

**Status**: Draft

**Input**: User description: "tui đã có link app ch play \"https://play.google.com/store/apps/details?id=online.hycat.closy&pcampaignid=web_share\" bạn hãy làm giao diện component CH play để dưới footer thay cho link tải APK bạn có thể sắp xếp lại giao diện footer"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Tải và truy cập ứng dụng trên Google Play từ Footer (Priority: P1)

Là một người dùng hoặc khách truy cập trang giới thiệu Closy, tôi muốn thấy huy hiệu/nút tải ứng dụng Google Play (CH Play) chính thức và chuyên nghiệp ở phần chân trang (footer), để tôi có thể bấm trực tiếp và cài đặt ứng dụng di động an toàn từ cửa hàng Google Play thay vì phải tải file APK thủ công.

**Why this priority**: Ứng dụng đã chính thức phát hành trên Google Play Store. Việc thay thế liên kết tải APK trực tiếp bằng huy hiệu Google Play chính thức giúp gia tăng niềm tin thương hiệu, nâng cao độ an toàn (bảo vệ thiết bị người dùng khỏi cảnh báo cài đặt nguồn ngoài), và tối ưu tỷ lệ chuyển đổi cài đặt ứng dụng Closy trên di động.

**Independent Test**: Truy cập trang chủ, cuộn xuống chân trang (footer); kiểm tra sự xuất hiện của nút/huy hiệu Google Play; nhấn vào nút và xác nhận trình duyệt điều hướng chính xác tới trang ứng dụng trên Google Play (`https://play.google.com/store/apps/details?id=online.hycat.closy&pcampaignid=web_share`) trong tab mới; đồng thời xác nhận liên kết tải file `.apk` cũ đã được gỡ bỏ hoàn toàn khỏi chân trang.

**Acceptance Scenarios**:

1. **Given** người dùng đang ở chân trang của trang giới thiệu, **When** người dùng quan sát khu vực tải ứng dụng di động, **Then** hệ thống hiển thị nút/huy hiệu chuẩn Google Play kèm biểu tượng đa màu sắc đặc trưng và nhãn văn bản nhận diện (ví dụ: "GET IT ON / TẢI TRÊN Google Play").
2. **Given** huy hiệu Google Play hiển thị ở chân trang, **When** người dùng nhấp chuột hoặc chạm vào nút, **Then** hệ thống mở liên kết Google Play Store trong một thẻ duyệt mới một cách an toàn và bảo mật mà không làm gián đoạn phiên duyệt web hiện tại.
3. **Given** phiên bản chân trang mới được áp dụng, **When** người dùng rà soát danh sách liên kết tại footer, **Then** đường dẫn tải file APK thô cũ không còn xuất hiện.

---

### User Story 2 - Bố cục chân trang được tổ chức lại hiện đại, cân đối và trực quan (Priority: P2)

Là một người dùng lướt web trên máy tính hoặc thiết bị di động, tôi muốn chân trang được sắp xếp lại gọn gàng, phân nhóm thông tin rõ ràng (thương hiệu, liên kết điều hướng & pháp lý, khu vực tải ứng dụng, thông tin bản quyền), giúp giao diện trông sang trọng, chuyên nghiệp và dễ tìm kiếm thông tin cần thiết.

**Why this priority**: Footer hiện tại đang dàn trải các liên kết và chữ trên cùng một hàng ngang/dọc đơn giản, chưa tận dụng tốt không gian và chưa làm nổi bật được ứng dụng di động. Tái cấu trúc footer thành các cột/khối chức năng giúp nâng cao thẩm mỹ toàn trang, tương xứng với định vị thương hiệu thời trang số Closy.

**Independent Test**: Quan sát footer trên nhiều kích thước màn hình (máy tính để bàn, máy tính bảng, điện thoại di động); xác nhận các phần tử được bố trí thành các khối logic: (1) Cột nhận diện thương hiệu & giới thiệu ngắn gọn, (2) Cột liên kết điều hướng & chính sách pháp lý (Chính sách bảo mật, Yêu cầu xóa tài khoản, Liên hệ), (3) Khối tải ứng dụng di động với huy hiệu Google Play, (4) Dòng bản quyền ở dưới cùng; kiểm tra không bị lệch khung hay tràn viền.

**Acceptance Scenarios**:

1. **Given** người dùng truy cập bằng màn hình máy tính để bàn (desktop), **When** cuộn xuống footer, **Then** các khối thông tin (Thương hiệu, Liên kết pháp trị/hỗ trợ, Tải ứng dụng di động) được phân bố dàn đều, cân đối theo chiều ngang với khoảng cách thị giác hài hòa.
2. **Given** người dùng truy cập bằng màn hình di động (mobile), **When** cuộn xuống footer, **Then** các khối thông tin được xếp chồng theo chiều dọc một cách tự nhiên, kích thước nút và vùng chạm đảm bảo thân thiện với thao tác ngón tay, văn bản dễ đọc và không xuất hiện thanh cuộn ngang ngoài ý muốn.
3. **Given** chân trang hiển thị đầy đủ thông tin, **When** người dùng tìm kiếm thông tin liên hệ hay điều khoản, **Then** các mục liên kết được gom nhóm rõ ràng, dễ phân biệt và tương tác thuận tiện.

---

### User Story 3 - Phản hồi tương tác và khả năng tiếp cận (Accessibility & Interaction) (Priority: P3)

Là một người dùng sử dụng chuột, màn hình cảm ứng hoặc phím điều hướng để duyệt web, tôi muốn nút tải Google Play và các liên kết chân trang có hiệu ứng phản hồi rõ ràng khi rê chuột hoặc kích hoạt, kèm theo mô tả trợ năng đầy đủ.

**Why this priority**: Đảm bảo trải nghiệm tương tác mượt mà, phản hồi tinh tế đúng chất thiết kế cao cấp của website, đồng thời hỗ trợ người dùng khiếm thị hoặc người dùng sử dụng phím duyệt web.

**Independent Test**: Rê chuột (hover) vào huy hiệu Google Play; kiểm tra hiệu ứng chuyển đổi trạng thái mượt mà (độ sáng viền hoặc độ nổi); sử dụng phím Tab để điều hướng qua các phần tử footer; xác nhận vòng tiêu điểm (focus ring) hiển thị chuẩn xác và phần mềm đọc màn hình nhận diện đúng vai trò của nút tải ứng dụng.

**Acceptance Scenarios**:

1. **Given** người dùng rê chuột vào nút Google Play, **When** con trỏ chuột nằm trên nút, **Then** nút có phản hồi thị giác nhẹ nhàng (thay đổi độ sáng nền, viền hoặc tỷ lệ vi mô) tạo cảm giác sống động.
2. **Given** người dùng điều hướng bằng bàn phím, **When** di chuyển tiêu điểm đến huy hiệu Google Play, **Then** hiển thị chỉ báo tiêu điểm rõ ràng và nhãn trợ năng mô tả chính xác đích đến là ứng dụng Closy trên Google Play.

---

### Edge Cases

- **Mở liên kết trên thiết bị Android có cài sẵn ứng dụng Google Play**: Liên kết có định dạng chuẩn Play Store (`https://play.google.com/store/apps/details?id=online.hycat.closy...`) phải kích hoạt mở ứng dụng CH Play gốc của hệ điều hành một cách trơn tru, thay vì gặp lỗi vòng lặp hoặc điều hướng hỏng.
- **Màn hình điện thoại có chiều ngang cực nhỏ (320px - 360px)**: Huy hiệu Google Play và các đoạn văn bản trong footer phải tự động co giãn kích thước linh hoạt, không bị vỡ giao diện hoặc tràn lề ngang màn hình.
- **Trường hợp mở trong môi trường trình duyệt nhúng (In-App Browser như Facebook/Zalo)**: Đường dẫn mở thẻ ngoài phải hoạt động an toàn và không bị chặn tải dữ liệu.
- **Người dùng tải trang trong điều kiện đường truyền mạng chập chờn**: Các thành phần biểu tượng và khung nút bấm phải giữ vững kích thước hiển thị định sẵn, không bị giật layout (layout shift) khi tài nguyên đồ họa đang tải.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Hệ thống PHẢI thay thế hoàn toàn đường dẫn tải file APK cũ (`/downloads/closy.apk`) tại chân trang bằng nút/huy hiệu tải ứng dụng từ Google Play Store.
- **FR-002**: Nút/huy hiệu Google Play PHẢI dẫn trực tiếp đến địa chỉ chính thức: `https://play.google.com/store/apps/details?id=online.hycat.closy&pcampaignid=web_share`.
- **FR-003**: Khi nhấp vào nút Google Play, hệ thống PHẢI mở đường dẫn trong thẻ/cửa sổ mới và áp dụng các thuộc tính bảo mật an toàn ngăn chặn truy cập ngữ cảnh trang gốc.
- **FR-004**: Huy hiệu Google Play PHẢI tuân thủ nhận diện thị giác đặc trưng của Google Play (bao gồm biểu tượng tam giác đa sắc và kiểu chữ nhận diện rõ ràng "Google Play").
- **FR-005**: Chân trang PHẢI được tái cấu trúc thành các khu vực chức năng rõ ràng:
  - Khối định vị thương hiệu (Logo/Tên Closy và thông điệp tóm tắt thương hiệu).
  - Khối liên kết điều hướng và chính sách pháp lý (Chính sách bảo mật, Yêu cầu xóa tài khoản, Liên hệ).
  - Khối ứng dụng di động (Kêu gọi tải ứng dụng cùng huy hiệu Google Play nổi bật).
  - Khối thông tin bản quyền và nguồn gốc phát triển sản phẩm.
- **FR-006**: Bố cục chân trang PHẢI tương thích hoàn toàn (responsive) trên mọi kích thước màn hình từ điện thoại di động (tối thiểu 320px) đến màn hình máy tính để bàn rộng lớn.
- **FR-007**: Tất cả các phần tử tương tác trong footer PHẢI cung cấp nhãn trợ năng rõ nghĩa cho các thiết bị hỗ trợ tiếp cận (screen reader) và hỗ trợ trạng thái điều hướng bằng bàn phím.

### Key Entities *(include if feature involves data)*

- **StoreDownloadChannel**: Đại diện cho kênh phát hành ứng dụng di động của Closy.
  - *Tên kênh*: Google Play Store
  - *Đường dẫn đích*: URL ứng dụng chính thức của Closy trên CH Play
  - *Trạng thái phát hành*: Hoạt động (Active)
  - *Nhãn nút hiển thị*: Tải trên Google Play / Get it on Google Play
- **FooterNavigationGroup**: Cụm nhóm các liên kết chức năng tại chân trang.
  - *Nhóm Pháp lý & Hỗ trợ*: Chính sách bảo mật, Yêu cầu xóa tài khoản, Hộp thư liên hệ hỗ trợ.
  - *Nhóm Thương hiệu & Bản quyền*: Tên sản phẩm, đơn vị phát triển, bản quyền năm 2026.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% người dùng khi nhấn vào huy hiệu Google Play được chuyển hướng trực tiếp và chính xác đến trang ứng dụng Closy trên Google Play Store.
- **SC-002**: 0 liên kết tải file APK thô còn sót lại trên chân trang của trang giới thiệu.
- **SC-003**: Giao diện chân trang hiển thị nguyên vẹn, không xảy ra hiện tượng tràn ngang màn hình (0 horizontal overflow) trên mọi dải phân giải màn hình từ 320px đến 4K.
- **SC-004**: Tỷ lệ tương phản của văn bản và biểu tượng trên nền chân trang đạt chuẩn tiếp cận tối thiểu 4.5:1, đảm bảo tính rõ nét và dễ đọc trong môi trường tối (dark theme).
- **SC-005**: Thời gian người dùng nhận biết và thao tác tải ứng dụng trên di động tại chân trang giảm xuống dưới 3 giây nhờ huy hiệu nhận diện rõ ràng.

## Assumptions

- Ứng dụng di động hiện tại chỉ mới có mặt chính thức trên nền tảng Google Play (Android). Phiên bản iOS trên Apple App Store chưa được cung cấp link cụ thể trong yêu cầu này, do đó footer sẽ tập trung làm nổi bật huy hiệu Google Play.
- Màu sắc chủ đạo và phong cách thiết kế của chân trang tiếp tục kế thừa tinh thần tối giản, thanh lịch, sang trọng của Closy (tông màu tối kết hợp viền mờ và điểm nhấn màu be ấm `#D9C5B2`).
- Người dùng không còn nhu cầu tải trực tiếp file APK thủ công tại chân trang sau khi ứng dụng đã được duyệt chính thức trên CH Play.
