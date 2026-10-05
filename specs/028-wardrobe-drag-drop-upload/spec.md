# Feature Specification: Kéo thả tệp hình ảnh vào tủ đồ (Wardrobe Drag & Drop Upload)

**Feature Branch**: `028-wardrobe-drag-drop-upload`

**Created**: 2026-10-04

**Status**: Draft

**Input**: User description: "phần upload item vào wardrobe hãy thêm tính năng có thể cho người dùng kéo thả file từ thư mục bỏ vào"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Kéo thả tệp hình ảnh từ thư mục vào khu vực tải ảnh trống (Priority: P1)

Khi người dùng mở trang tải đồ mới lên tủ đồ cá nhân và chưa chọn ảnh nào, thay vì bắt buộc phải bấm nút để mở cửa sổ duyệt tệp của hệ điều hành, người dùng có thể mở thư mục trên máy tính, chọn từ 1 đến 5 tệp hình ảnh và kéo thả trực tiếp vào khung tải ảnh. Khung tải ảnh lập tức thay đổi hiệu ứng giao diện trực quan (đổi màu viền, làm nổi bật nền, hiển thị thông điệp đón nhận file) để người dùng biết hành động thả sẽ thành công. Khi người dùng thả chuột, hệ thống lập tức tiếp nhận các hình ảnh hợp lệ, tạo ảnh xem trước và chuyển người dùng sang bước sẵn sàng gửi ảnh cho AI phân tích.

**Why this priority**: Đây là luồng trải nghiệm cốt lõi của tính năng. Giúp người dùng thao tác đưa trang phục vào tủ đồ nhanh chóng, hiện đại và tự nhiên hơn nhiều so với thao tác bấm nút duyệt tệp truyền thống.

**Independent Test**: Có thể kiểm thử độc lập bằng cách mở màn hình tải ảnh tủ đồ khi chưa có ảnh nào, kéo 1 đến 5 tệp ảnh (PNG, JPG, WEBP, HEIC) từ thư mục máy tính thả vào khung tải ảnh, xác nhận giao diện chuyển sang màn hình danh sách xem trước đầy đủ các ảnh vừa thả.

**Acceptance Scenarios**:

1. **Given** người dùng đang ở màn hình tải đồ chưa có ảnh nào, **When** người dùng kéo một hoặc nhiều tệp từ cửa sổ thư mục vào phạm vi khung tải ảnh, **Then** hệ thống hiển thị trạng thái kéo tệp tích cực với viền nổi bật và thông điệp hướng dẫn "Thả file vào đây để tải lên".
2. **Given** người dùng đang rê tệp bên trong khung tải ảnh, **When** người dùng kéo tệp ra ngoài phạm vi hoặc bấm phím hủy thao tác kéo, **Then** khung tải ảnh trở về trạng thái hiển thị bình thường một cách mượt mà, không bị giật nhấp nháy khi lướt qua các icon hoặc dòng chữ con.
3. **Given** người dùng thả từ 1 đến 5 tệp hình ảnh hợp lệ vào khung tải ảnh, **When** chuột được nhả ra, **Then** hệ thống đọc các tệp, tạo hình thu nhỏ xem trước và hiển thị danh sách các món đồ kèm tên tệp sẵn sàng để trích xuất dữ liệu.

---

### User Story 2 - Kéo thả bổ sung hình ảnh trong màn hình xem trước (Priority: P2)

Khi người dùng đã tải lên từ 1 đến 4 ảnh và đang xem danh sách hình thu nhỏ chuẩn bị gửi phân tích, người dùng nhận ra muốn thêm tiếp một số món đồ khác. Người dùng có thể kéo thả trực tiếp các tệp ảnh bổ sung từ thư mục vào khu vực danh sách hoặc vào ô "Thêm ảnh". Hệ thống tự động gộp các ảnh mới vào danh sách hiện tại và cập nhật lại số lượng ảnh đã chọn (ví dụ từ 2/5 lên 4/5) mà không làm mất các ảnh đã chọn trước đó.

**Why this priority**: Mang lại sự liền mạch cho người dùng khi chuẩn bị một lượt phân tích nhiều món, không bắt người dùng phải làm lại từ đầu nếu lỡ quên kéo thả thiếu một vài món đồ.

**Independent Test**: Có thể kiểm thử độc lập bằng cách tải trước 2 ảnh vào màn hình xem trước, sau đó kéo thả thêm 2 ảnh khác từ thư mục máy tính vào giao diện, kiểm tra danh sách có đúng 4 ảnh xem trước và bộ đếm hiển thị "Đã chọn 4/5 ảnh".

**Acceptance Scenarios**:

1. **Given** người dùng đang có dưới 5 ảnh trong danh sách xem trước, **When** người dùng kéo thả thêm các tệp ảnh mới vào khu vực danh sách xem trước hoặc nút thêm ảnh, **Then** hệ thống tiếp nhận, tạo thẻ xem trước cho các ảnh mới và cập nhật bộ đếm số lượng ảnh.
2. **Given** người dùng đang có đủ 5 ảnh (đã đạt giới hạn tối đa của một lượt tải), **When** người dùng kéo thêm ảnh vào giao diện, **Then** hệ thống cảnh báo rằng đã đạt giới hạn tối đa 5 ảnh và không tiếp nhận thêm ảnh mới.
3. **Given** người dùng đang có 3 ảnh và kéo thả thêm 4 ảnh mới cùng lúc (tổng cộng 7 ảnh), **When** hoàn tất thao tác thả, **Then** hệ thống tiếp nhận 2 ảnh đầu tiên để đạt đủ giới hạn 5 ảnh, bỏ qua 2 ảnh còn lại và hiển thị thông báo giải thích rõ ràng cho người dùng.

---

### User Story 3 - Kiểm tra định dạng tệp và thông báo lỗi kéo thả thân thiện (Priority: P1)

Khi người dùng kéo thả các tệp không hợp lệ vào khu vực tải ảnh (ví dụ tệp tài liệu PDF, Word, tệp nén, video, tệp ảnh có dung lượng vượt quá 5MB, hoặc kéo thả nhầm cả thư mục), hệ thống tự động nhận diện và từ chối các tệp không đạt chuẩn, đồng thời hiển thị thông báo bằng ngôn ngữ tự nhiên, thân thiện để người dùng hiểu rõ lý do và cách khắc phục mà không làm treo giao diện.

**Why this priority**: Ngăn chặn dữ liệu hỏng hoặc tệp sai định dạng đi vào quy trình xử lý của hệ thống, đồng thời mang lại phản hồi rõ ràng thay vì im lặng không có tác dụng khiến người dùng bối rối.

**Independent Test**: Có thể kiểm thử độc lập bằng cách kéo thả một tệp PDF hoặc một tệp ảnh lớn hơn 5MB vào vùng tải ảnh, xác nhận hệ thống từ chối tệp đó và hiển thị thông báo lỗi cụ thể qua thông báo nổi trên màn hình.

**Acceptance Scenarios**:

1. **Given** người dùng kéo thả tệp không phải định dạng hình ảnh (ví dụ .pdf, .docx, .zip), **When** thả tệp vào vùng tải ảnh, **Then** hệ thống từ chối tệp và hiển thị thông báo "Chỉ hỗ trợ tệp hình ảnh (PNG, JPG, JPEG, WEBP, HEIC)".
2. **Given** người dùng kéo thả tệp ảnh có dung lượng lớn hơn 5MB, **When** hệ thống kiểm tra tệp, **Then** hệ thống từ chối tệp đó và thông báo "Dung lượng ảnh [Tên tệp] vượt quá giới hạn 5MB".
3. **Given** người dùng kéo thả một tập hợp gồm cả tệp ảnh hợp lệ và tệp không hợp lệ, **When** thả tệp vào hệ thống, **Then** hệ thống vẫn tiếp nhận các tệp ảnh hợp lệ bình thường và chỉ hiển thị cảnh báo đối với các tệp bị loại trừ.
4. **Given** người dùng kéo thả một thư mục từ máy tính vào vùng upload, **When** thả thư mục, **Then** hệ thống tự động trích xuất các tệp hình ảnh hợp lệ bên trong thư mục đó hoặc hiển thị thông báo hướng dẫn người dùng chỉ kéo thả trực tiếp các tệp ảnh.

---

### Edge Cases

- **Hiện tượng nhấp nháy khi rê chuột qua phần tử con (Drag Leave Flicker)**: Khi người dùng kéo tệp di chuyển qua các thành phần văn bản hoặc biểu tượng bên trong vùng thả, hệ thống phải duy trì trạng thái kéo tệp liên tục, không bị nhấp nháy bật tắt trạng thái giữa chừng.
- **Hành vi mặc định của trình duyệt**: Nếu người dùng kéo tệp và vô tình thả trượt ra ngoài vùng thả hoặc thả vào khoảng trống của trang web, hệ thống phải ngăn chặn trình duyệt tự động mở tệp ảnh sang trang mới (làm mất trạng thái hiện tại của người dùng).
- **Kéo thả khi đang tải lên hoặc đang phân tích AI**: Khi hệ thống đang trong quá trình tải ảnh lên đám mây hoặc đang chạy phân tích AI (`isUploading` = true), toàn bộ khu vực kéo thả phải chuyển sang trạng thái vô hiệu hóa, hiển thị con trỏ cấm thao tác và từ chối mọi sự kiện thả tệp mới.
- **Tệp bị trùng lặp**: Nếu người dùng kéo thả một tệp ảnh đã có sẵn trong danh sách xem trước (trùng tên và kích thước), hệ thống cảnh báo hoặc bỏ qua tệp trùng để tránh việc phân tích lặp lại cùng một món đồ.
- **Kéo thả trên thiết bị di động / máy tính bảng**: Màn hình vẫn đảm bảo tính năng bấm để chọn tệp qua bộ nhớ máy hoặc máy ảnh hoạt động ổn định 100%, không bị ảnh hưởng bởi logic kéo thả của máy tính.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Hệ thống MUST hỗ trợ nhận diện thao tác kéo và thả (drag & drop) tệp từ trình quản lý tệp tin của hệ điều hành vào khung tải ảnh ở màn hình khởi tạo khi chưa có ảnh nào.
- **FR-002**: Hệ thống MUST cung cấp phản hồi thị giác trực tiếp (active drag state) khi tệp đang được rê qua vùng thả, bao gồm hiệu ứng viền nổi bật, màu nền tương tác và văn bản hướng dẫn rõ ràng.
- **FR-003**: Hệ thống MUST hỗ trợ tính năng kéo thả bổ sung ảnh khi danh sách xem trước đang có ít hơn 5 ảnh.
- **FR-004**: Hệ thống MUST ngăn chặn triệt để hành vi mặc định của trình duyệt web đối với các sự kiện kéo thả tệp trên trang để tránh việc trình duyệt tự động điều hướng mở xem tệp.
- **FR-005**: Hệ thống MUST chỉ chấp nhận các tệp định dạng hình ảnh hợp lệ: PNG, JPG, JPEG, WEBP, HEIC.
- **FR-006**: Hệ thống MUST kiểm tra dung lượng từng tệp được kéo thả và giới hạn tối đa 5MB mỗi tệp.
- **FR-007**: Hệ thống MUST giới hạn tổng số lượng ảnh được chọn trong một phiên tải lên là tối đa 5 ảnh.
- **FR-008**: Khi số lượng ảnh kéo thả vượt quá hạn mức còn lại (tổng vượt quá 5), hệ thống MUST nhận đủ số lượng tối đa theo thứ tự và thông báo rõ ràng cho người dùng về các ảnh bị bỏ qua.
- **FR-009**: Hệ thống MUST hiển thị thông báo lỗi thân thiện bằng tiếng Việt cho từng trường hợp tệp không hợp lệ (sai định dạng, quá dung lượng, vượt quá số lượng).
- **FR-010**: Hệ thống MUST loại bỏ hiện tượng nhấp nháy giao diện khi con trỏ chuột rê qua các thành phần lồng nhau bên trong vùng thả.
- **FR-011**: Hệ thống MUST duy trì song song phương thức chọn tệp bằng cách nhấp chuột truyền thống để mở cửa sổ duyệt tệp hệ thống.
- **FR-012**: Hệ thống MUST vô hiệu hóa hoàn toàn khu vực kéo thả khi hệ thống đang trong tiến trình tải ảnh lên hoặc đang chờ AI xử lý phân tích.

### Key Entities *(include if feature involves data)*

- **Tệp ảnh kéo thả (Dropped Image Item)**: Thực thể đại diện cho tệp hình ảnh cục bộ do người dùng kéo vào, bao gồm tên tệp gốc, kích thước tệp, loại định dạng (MIME type), đường dẫn tạm thời hiển thị xem trước (local preview URL) và danh mục phân loại mặc định.
- **Trạng thái vùng kéo thả (Dropzone Visual State)**: Biểu diễn trạng thái giao diện của khu vực tải ảnh, gồm các trạng thái: Chờ thao tác (Idle), Đang rê tệp hợp lệ (Active Hover), Đang rê tệp không hợp lệ/đầy bộ nhớ (Warning/Rejected), và Bị vô hiệu hóa khi đang xử lý (Disabled).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% các tệp hình ảnh hợp lệ khi thả vào vùng dropzone được nạp thành công và hiển thị ảnh xem trước trong vòng dưới 1 giây.
- **SC-002**: Tỷ lệ xảy ra lỗi trình duyệt tự động mở tệp ảnh ra trang riêng do thả trượt đạt 0%.
- **SC-003**: 100% các tệp không hợp lệ (sai định dạng, dung lượng trên 5MB, vượt quá 5 ảnh) bị chặn chính xác và có thông báo phản hồi thân thiện tương ứng.
- **SC-004**: Thời gian người dùng đưa từ 1 đến 5 ảnh trang phục vào hệ thống giảm ít nhất 50% so với phương thức mở hộp thoại duyệt tệp nhiều bước.
- **SC-005**: 100% người dùng trên máy tính để bàn và laptop có thể hoàn thành việc chọn ảnh trang phục chỉ bằng một thao tác kéo thả duy nhất.

## Assumptions

- Trình duyệt của người dùng là trình duyệt web hiện đại hỗ trợ đầy đủ các sự kiện kéo thả tệp tiêu chuẩn HTML5 (Chrome, Edge, Firefox, Safari).
- Người dùng sử dụng thiết bị có chuột hoặc bàn rê cảm ứng (trackpad) để thực hiện thao tác kéo thả; người dùng thiết bị cảm ứng di động tiếp tục sử dụng nút bấm chọn ảnh hoặc chụp ảnh từ máy ảnh thông thường.
- Giới hạn dung lượng mỗi ảnh là 5MB và số lượng tối đa mỗi mẻ là 5 ảnh để đảm bảo tốc độ tối ưu khi tải lên đám mây và chạy phân tích AI.
- Hệ thống thông báo sử dụng thành phần thông báo toast sẵn có của ứng dụng để hiển thị các thông điệp cảnh báo và lỗi cho người dùng.
- Thao tác kéo thả không làm thay đổi luồng xử lý phía sau (tự động tách nền, nén tối ưu, và phân tích AI trang phục) mà chỉ nâng cấp trải nghiệm tiếp nhận ảnh đầu vào.
