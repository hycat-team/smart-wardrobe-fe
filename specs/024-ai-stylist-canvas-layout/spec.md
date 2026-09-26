# Feature Specification: Bố cục Canvas Phối đồ Theo Vai trò Thời trang (Role-Based Outfit Canvas Layout)

**Feature Branch**: `024-ai-stylist-canvas-layout`

**Created**: 2026-09-26

**Status**: Draft

**Input**: User description: "hiện tại giao diện canvas trang /ai-stylist thì đang lỗi vấn đề cái item hiển thị ra bị lộn xộn trên canvas bây giờ bạn hãy dựa vào trường "role": string, trong endpoint http://localhost:3000/api/v1/ai/outfit-recommendations để hiển thị các item lên đúng vị trí. mô tả thêm Vai trò của từng role:
- Tạo thành bộ outfit hợp lệ — prompt quy định 1 outfit phải là: top + bottom + footwear, hoặc fullbody + footwear (synthesis/prompt.go:70).
- outerwear layer thêm, không ràng buộc cặp top/bottom vs fullbody (prompt.go:73).
- accessory, footwear, headwear độc lập, không bị ràng buộc luật phối (prompt.go:74).
- Mỗi role xuất hiện tối đa 1 lần — có bước dedupe theo role (recommendation.go:150-159).
- Loại trừ nhau: nếu outfit có fullbody thì không được có top/bottom — code sẽ filter bỏ top/bottom (recommendation.go:140-148).
- Đảm bảo đủ đồ: nếu thiếu top hoặc bottom, mapper tự chèn thêm candidate tương ứng (recommendation.go:161-198)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Hiển thị bộ phối đồ trực quan trên Canvas theo giải phẫu thời trang chuẩn (Priority: P1)

Khi người dùng yêu cầu AI gợi ý trang phục trong không gian AI Stylist, bộ phối đồ đề xuất được trình bày tự động lên khung vẽ (Canvas) theo đúng thứ tự giải phẫu vóc dáng thời trang:
- Với cấu trúc phối rời (`top` + `bottom` + `footwear`): Áo nằm ở thân trên, quần hoặc chân váy nằm ở thân dưới tiếp giáp hài hòa bên dưới áo, và giày dép đặt ở vị trí chân dưới cùng.
- Với cấu trúc phối liền (`fullbody` + `footwear`): Đầm liền thân hoặc bộ jumpsuit nằm trải dài xuyên suốt trục trung tâm từ ngực xuống thân dưới, và giày dép đặt ở vị trí chân dưới cùng. Hoàn toàn không xuất hiện áo rời hay quần rời gây xung đột thị giác.
Tất cả các món đồ chính đều được sắp đặt ngay ngắn, cân đối và thẩm mỹ, loại bỏ hoàn toàn hiện tượng các món đồ rơi ngẫu nhiên đè chồng lộn xộn lên nhau.

**Why this priority**: Đây là giá trị cốt lõi mang tính thị giác của tính năng Stylist. Người dùng cần nhìn thấy một bộ trang phục hoàn chỉnh được phối hợp tự nhiên như trên ma-nơ-canh hoặc tạp chí thời trang để có thể đánh giá và ra quyết định mặc đẹp.

**Independent Test**: Có thể kiểm thử độc lập bằng cách kích hoạt gợi ý trang phục cho cả hai kịch bản phối (bộ phối áo + quần + giày và bộ phối đầm liền + giày), quan sát khung vẽ canvas và xác nhận các món đồ xuất hiện đúng vị trí giải phẫu tương ứng, không có món nào bị lệch trục hay đè chồng hỗn loạn.

**Acceptance Scenarios**:

1. **Given** hệ thống đề xuất bộ trang phục có các vai trò `top`, `bottom` và `footwear`, **When** hiển thị lên khung vẽ canvas, **Then** món `top` được định vị tại khu vực thân trên, món `bottom` được định vị tại khu vực thân dưới phía dưới áo, và món `footwear` được định vị tại khu vực chân dưới cùng trên cùng một trục phối chính.
2. **Given** hệ thống đề xuất bộ trang phục có vai trò `fullbody` và `footwear`, **When** hiển thị lên khung vẽ canvas, **Then** món `fullbody` chiếm vị trí trung tâm trải dài thân người, món `footwear` nằm ở đáy chân, và trên khung vẽ tuyệt đối không xuất hiện các món mang vai trò `top` hoặc `bottom`.
3. **Given** bất kỳ bộ phối đồ nào được tạo mới, **When** người dùng mở xem trên canvas, **Then** mỗi vai trò trang phục chính chỉ xuất hiện tối đa một lần duy nhất trong bộ phối ban đầu.

---

### User Story 2 - Phối lớp áo khoác ngoài (Outerwear Layering) có chiều sâu thị giác (Priority: P2)

Khi bộ trang phục được bổ sung thêm áo khoác ngoài (`outerwear`) bên cạnh bộ trang phục chính (bộ phối áo + quần hoặc đầm liền thân), áo khoác được đặt ở tầng hiển thị bao quát (phía trước hoặc vạt hai bên) với thứ tự lớp (z-index) cao hơn lớp áo trong. Áo khoác không bị xếp đè lấp mất món đồ bên trong mà tạo cảm giác đa tầng (layering) sống động, giúp người dùng cảm nhận được chiều sâu phong cách của bộ trang phục mùa lạnh hoặc phong cách công sở/dạo phố.

**Why this priority**: Phối nhiều lớp là nghệ thuật quan trọng trong thời trang. Áo khoác là lớp trang phục thường xuyên xuất hiện trong các dịp thời tiết lạnh hoặc phong cách thanh lịch; cần được thể hiện tự nhiên mà không làm lu mờ trang phục bên trong.

**Independent Test**: Kích hoạt đề xuất trang phục mùa đông hoặc có áo khoác (`outerwear`), kiểm tra trên canvas thấy áo khoác nằm ở vị trí thân trên, nổi bật ở lớp trên áo trong/đầm liền nhưng vẫn giữ được độ mở trực quan để người dùng nhận biết rõ ràng cả hai món đồ.

**Acceptance Scenarios**:

1. **Given** bộ trang phục có cả món `top` và món `outerwear`, **When** kết xuất lên khung vẽ canvas, **Then** món `outerwear` có thứ tự tầng hiển thị ưu tiên hơn `top` và được bố trí với độ mở/lệch thị giác tự nhiên để người dùng quan sát được cả áo trong lẫn áo khoác ngoài.
2. **Given** bộ trang phục có cả món `fullbody` và món `outerwear`, **When** kết xuất lên khung vẽ canvas, **Then** món `outerwear` phủ nhẹ ở lớp trên của `fullbody`, tôn dáng bộ đầm mà không che khuất toàn bộ phần thân váy.

---

### User Story 3 - Định vị phụ kiện độc lập (Headwear, Accessory) làm điểm nhấn tinh tế (Priority: P2)

Các món phụ kiện thời trang độc lập bao gồm mũ/nón (`headwear`) và phụ kiện khác (`accessory` như túi xách, kính mắt, trang sức, thắt lưng...) được bố trí ở các khu vực vệ tinh xung quanh bộ trang phục chính:
- Mũ/nón (`headwear`) nằm ở vị trí trên cùng của trục đứng (khu vực đỉnh đầu).
- Phụ kiện (`accessory`) như túi xách hoặc trang sức được đặt khéo léo ở hai bên sườn (bên trái hoặc bên phải hông/eo), tạo thành một bố cục lookbook nghệ thuật hoàn chỉnh như trên sàn diễn thời trang, không che lấp các đường nét chính của quần áo.

**Why this priority**: Phụ kiện là yếu tố hoàn thiện phong cách thời trang cá nhân. Bố trí phụ kiện ở các vị trí ngoại vi hợp lý giúp bức tranh tổng thể cân đối, không gây rối mắt cho người xem.

**Independent Test**: Kích hoạt đề xuất có phụ kiện và mũ nón, xác nhận mũ nón luôn ở đỉnh cao nhất trên trục giữa và phụ kiện (như túi xách) được xếp dạt sang bên cạnh sườn một cách cân xứng.

**Acceptance Scenarios**:

1. **Given** bộ trang phục có món mang vai trò `headwear`, **When** hiển thị lên khung vẽ canvas, **Then** món đồ nằm ở đỉnh cao nhất của trục dọc trung tâm, phía trên khu vực áo hoặc cổ.
2. **Given** bộ trang phục có món mang vai trò `accessory`, **When** hiển thị lên khung vẽ canvas, **Then** món đồ được bố trí ở khu vực bên cạnh sườn của trang phục chính, không bị đè lên chính diện của áo, quần hay đầm.

---

### User Story 4 - Hoán đổi món thay thế (Swap) và tương tác tự do bảo toàn vai trò thời trang (Priority: P3)

Người dùng có thể tương tác trực tiếp với từng món đồ trên canvas: kéo thả di chuyển vị trí, thu nhỏ/phóng to kích cỡ, đưa lên tầng hiển thị trên cùng, hoặc bấm nút "Thay thế" (`Swap`) để đổi sang một lựa chọn khác trong danh sách gợi ý thay thế. Khi đổi món, món thay thế mới kế thừa chính xác vai trò thời trang và vị trí hiện thời của món cũ, giữ nguyên sự cân bằng của toàn bộ trang phục.

**Why this priority**: Mang lại quyền tự do sáng tạo và khả năng cá nhân hóa trải nghiệm phối đồ cho người dùng, giúp người dùng dễ dàng tinh chỉnh bộ trang phục trước khi lưu vào tủ đồ cá nhân.

**Independent Test**: Bấm nút hoán đổi trên một chiếc áo `top`, xác nhận chiếc áo thay thế xuất hiện đúng ngay vị trí của chiếc áo ban đầu, các món đồ khác giữ nguyên vị trí; kéo thả chiếc áo sang vị trí mới và lưu bộ đồ thành công.

**Acceptance Scenarios**:

1. **Given** người dùng chọn hành động hoán đổi trên một món đồ có danh sách thay thế, **When** áp dụng món thay thế kế tiếp, **Then** món đồ mới hiển thị tại đúng vị trí vai trò của món đồ vừa được đổi, các thuộc tính vai trò được bảo toàn liên tục.
2. **Given** người dùng thực hiện thao tác kéo thả di chuyển hoặc điều chỉnh kích thước món đồ trên canvas, **When** kết thúc thao tác, **Then** vị trí và kích thước mới được cập nhật ổn định trên khung vẽ.

---

### User Story 5 - Hiển thị hài hòa món đồ thương hiệu đối tác trong cấu trúc bộ đồ (Priority: P3)

Khi hệ thống gợi ý món đồ đến từ các thương hiệu đối tác hoặc món đồ thử nghiệm mở rộng (Ghost Items), món đồ thương hiệu vẫn được định vị đúng theo vai trò thời trang của nó trong bộ đồ (ví dụ: một chiếc áo thương hiệu vẫn nằm ở vị trí `top` hoặc `outerwear`). Đồng thời, món đồ hiển thị nhãn nhận diện thương hiệu trực tiếp, không bị đẩy ra một cột tách biệt ngoài lề làm phá vỡ phom dáng của bộ trang phục.

**Why this priority**: Giúp người dùng hình dung chân thực cách món đồ thương hiệu kết hợp ăn ý với trang phục sẵn có trong tủ đồ cá nhân của họ, tăng tính gắn kết và động lực mua sắm thời trang.

**Independent Test**: Tạo gợi ý có chứa sản phẩm từ thương hiệu đối tác, xác nhận sản phẩm thương hiệu nằm đúng vị trí vai trò thời trang (áo khoác, giày, túi...) trong phom bộ đồ chính giữa canvas kèm huy hiệu thương hiệu rõ ràng.

**Acceptance Scenarios**:

1. **Given** một món đồ trong bộ gợi ý là sản phẩm thương hiệu đối tác mang vai trò cụ thể (ví dụ: `outerwear` hoặc `footwear`), **When** hiển thị lên khung vẽ canvas, **Then** món đồ được định vị chính xác tại vùng vai trò tương ứng trong bộ outfit, mang theo huy hiệu nhận diện thương hiệu trực quan.

---

### Edge Cases

- **Món đồ mang vai trò không xác định (`other`) hoặc thiếu thông tin vai trò**: Được phân bổ vào khu vực bổ trợ ở lề ngoài của khung vẽ (vùng ngoại vi), tránh chiếm dụng trục trung tâm của bộ trang phục chính.
- **Bộ trang phục có nhiều phụ kiện (`accessory`) cùng xuất hiện**: Tự động phân bổ so le sang hai bên cánh trái và phải hoặc điều chỉnh độ lệch chiều cao để các phụ kiện không che lấp nhau.
- **Kích thước khung vẽ thay đổi theo độ phân giải màn hình (máy tính để bàn, máy tính bảng, điện thoại)**: Toàn bộ cấu trúc bố cục tự động co giãn theo tỷ lệ tương đối của khung vẽ trung tâm, đảm bảo các món đồ không bị văng ra ngoài khung nhìn.
- **Món đồ tải ảnh thất bại hoặc đường dẫn hình ảnh bị gián đoạn**: Hiển thị khung giữ chỗ thời trang tinh gọn có nhãn ghi rõ tên vai trò (ví dụ: "Áo", "Quần", "Giày") để người dùng nhận diện cấu trúc vị trí mà không làm sập giao diện canvas.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Hệ thống MUST tự động phân loại và định vị tọa độ hiển thị ban đầu của từng món đồ trên khung vẽ canvas dựa trên thuộc tính vai trò thời trang chuẩn (`role`), bao gồm 8 nhóm vai trò:
  1. `top`: Áo (phần thân trên)
  2. `bottom`: Quần hoặc chân váy (phần thân dưới)
  3. `fullbody`: Đầm hoặc trang phục liền thân (chiếm toàn bộ thân trên và thân dưới)
  4. `outerwear`: Áo khoác ngoài (mặc phủ lớp ngoài)
  5. `footwear`: Giày dép (phần chân dưới cùng)
  6. `headwear`: Mũ hoặc nón (vị trí đỉnh đầu)
  7. `accessory`: Phụ kiện trang sức, túi xách, khăn, kính (vị trí vệ tinh hai bên)
  8. `other`: Trang phục hoặc vật phẩm khác (vị trí bổ trợ ngoại vi).
- **FR-002**: Khi bộ trang phục thuộc cấu trúc phối rời (`top` + `bottom`), hệ thống MUST định vị `top` ở nửa trên của trục đứng trung tâm và `bottom` ở nửa dưới của trục đứng trung tâm tiếp giáp phía dưới `top`.
- **FR-003**: Khi bộ trang phục thuộc cấu trúc phối liền (`fullbody`), hệ thống MUST định vị món `fullbody` tại vị trí trung tâm trải dài trục đứng và MUST NOT hiển thị bất kỳ món đồ nào mang vai trò `top` hoặc `bottom` trên khung vẽ.
- **FR-004**: Món đồ mang vai trò `footwear` MUST luôn được định vị ở vị trí dưới cùng của trục đứng trung tâm, bên dưới vị trí của `bottom` hoặc `fullbody`.
- **FR-005**: Món đồ mang vai trò `outerwear` MUST được thiết lập thứ tự tầng hiển thị (z-index) cao hơn so với lớp áo trong (`top`) hoặc đầm (`fullbody`), và được căn chỉnh độ lệch trực quan để người dùng quan sát được cả trang phục bên trong và áo khoác ngoài.
- **FR-006**: Món đồ mang vai trò `headwear` MUST được định vị ở đỉnh trên cùng của trục đứng trung tâm, phía trên vị trí của `top` hoặc `outerwear`.
- **FR-007**: Món đồ mang vai trò `accessory` MUST được định vị ở các khu vực vệ tinh hai bên sườn (bên trái hoặc bên phải) của trục đứng trung tâm, không được che khuất chính diện của trang phục chính.
- **FR-008**: Trong trạng thái khởi tạo ban đầu của một bộ phối đồ, hệ thống MUST đảm bảo mỗi vai trò trang phục chính (`headwear`, `top`, `bottom`, `fullbody`, `outerwear`, `footwear`) xuất hiện tối đa một lần duy nhất.
- **FR-009**: Khi người dùng kích hoạt thao tác hoán đổi món thay thế (`Swap`), món đồ mới MUST kế thừa toàn vẹn vai trò (`role`) và vị trí hiện thời của món đồ đang được hoán đổi.
- **FR-010**: Các món đồ đến từ thương hiệu đối tác hoặc món đồ thử nghiệm mở rộng MUST được sắp đặt vào đúng vị trí vai trò thời trang của chúng trong bộ phối trên canvas, đồng thời thể hiện huy hiệu nhận diện thương hiệu trực quan trên món đồ.
- **FR-011**: Khung vẽ canvas MUST bảo toàn đầy đủ các cử chỉ tương tác của người dùng sau khi đã định vị ban đầu, bao gồm: kéo thả tự do, điều chỉnh kích cỡ thu phóng, đưa lên lớp trên, và lưu lại vị trí tùy chỉnh khi lưu bộ outfit.
- **FR-012**: Hệ thống MUST có cơ chế bố trí dự phòng an toàn cho các món đồ mang vai trò `other` hoặc không xác định được vai trò tại các vị trí ngoại vi không gây xung đột với trục giải phẫu chính.

### Key Entities *(include if feature involves data)*

- **FashionRole**: Phân loại vai trò giải phẫu thời trang của món đồ trong bộ phối, bao gồm các định danh: `top`, `bottom`, `fullbody`, `outerwear`, `footwear`, `headwear`, `accessory`, `other`.
- **OutfitCompositionRule**: Bộ quy tắc cấu thành trang phục hợp lệ:
  - Cấu trúc cốt lõi bắt buộc: (`top` + `bottom` + `footwear`) HOẶC (`fullbody` + `footwear`).
  - Lớp bổ trợ tùy chọn: `outerwear` (khoác ngoài), `headwear` (mũ nón), `accessory` (phụ kiện).
  - Quy tắc loại trừ lẫn nhau: Bộ trang phục có `fullbody` sẽ loại trừ hoàn toàn sự hiện diện của `top` và `bottom`.
- **CanvasRoleLayoutNode**: Thực thể biểu diễn vị trí không gian và trạng thái hiển thị của một món đồ trên khung vẽ canvas, bao gồm tọa độ ngang tương đối (X), tọa độ dọc tương đối (Y), thứ tự phân tầng (Z-Index), tỷ lệ kích thước (Scale), và vai trò thời trang liên kết (`role`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% các bộ phối đồ do AI Stylist gợi ý được tự động sắp đặt lên khung vẽ canvas theo đúng trật tự giải phẫu thời trang (mũ ở trên, áo/đầm ở giữa, quần ở dưới, giày ở đáy) ngay lần hiển thị đầu tiên.
- **SC-002**: 0% trường hợp các món đồ bị rơi vào vị trí ngẫu nhiên hoặc đè chồng hỗn loạn lên nhau tại tâm khung vẽ khi dữ liệu vai trò `role` được cung cấp.
- **SC-003**: 100% các bộ phối đồ chứa đầm liền thân (`fullbody`) hiển thị một khối trang phục trung tâm liền mạch duy nhất, hoàn toàn không xuất hiện áo rời hay quần rời gây xung đột.
- **SC-004**: 100% các bộ phối đồ có áo khoác ngoài (`outerwear`) thể hiện rõ tính đa tầng (layering), cho phép người dùng quan sát được cả trang phục bên trong lẫn áo khoác ngoài mà không bị che khuất tuyệt đối.
- **SC-005**: 100% các sản phẩm gợi ý từ thương hiệu đối tác được tích hợp hòa nhập đúng vào phom dáng bộ đồ theo vai trò thời trang, không bị đẩy dồn sang lề ngoài làm vỡ bố cục tổng thể.
- **SC-006**: Thao tác hoán đổi món đồ thay thế (`Swap`) diễn ra mượt mà tức thì với thời gian phản hồi thị giác dưới 200 mili-giây và bảo toàn 100% vị trí vai trò trên canvas.

## Assumptions

- Dữ liệu gợi ý trang phục từ máy chủ cung cấp đầy đủ định danh vai trò `role` cho mỗi món đồ trong danh mục đề xuất, tuân thủ bảng mã vai trò chuẩn (`top`, `bottom`, `fullbody`, `outerwear`, `footwear`, `headwear`, `accessory`, `other`).
- Khung vẽ canvas sử dụng hệ quy chiếu tọa độ tương đối từ tâm khung vẽ, cho phép người dùng tự do tinh chỉnh di chuyển sau khi hệ thống đã định vị ban đầu.
- Hình ảnh của các món trang phục đã được xử lý tách nền trong suốt hoặc có tỷ lệ hiển thị cân đối từ cơ sở dữ liệu tủ đồ và dữ liệu thương hiệu.
