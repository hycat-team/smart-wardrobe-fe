# Feature Specification: Nén ảnh WebP sắc nét & Giới hạn dung lượng video tải lên (Media Compression & Video Upload Limits)

**Feature Branch**: `030-media-compression-video-limit`

**Created**: 2026-10-05

**Status**: Draft

**Input**: User description: "ở các phần chức năng upload item wardrobe và community đăng bài bạn hãy làm 1 hàm nén dung lượng ảnh về wedp để giảm tải trọng lượng ảnh nhưng không bị mất nét, về phần upload video ở community thì hãy chặn file lớn hơn 100MB"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Tự động nén ảnh sang định dạng WebP sắc nét khi tải trang phục vào tủ đồ (Priority: P1)

Khi người dùng chuẩn bị tải một hoặc nhiều hình ảnh trang phục (tối đa 5 ảnh) vào tủ đồ cá nhân để AI phân tích hoặc lưu trữ, hệ thống tự động thực hiện nén và chuyển đổi các hình ảnh sang định dạng WebP với mức chất lượng cao ngay trên trình duyệt trước khi gửi tệp lên dịch vụ lưu trữ đám mây. Dung lượng tệp được giảm tải rõ rệt (giảm 50% đến 80% trọng lượng tệp), giúp quá trình truyền tải nhanh hơn đáng kể, tiết kiệm băng thông và tài nguyên lưu trữ nhưng vẫn đảm bảo độ sắc nét, màu sắc và chi tiết đường may, hoa văn của trang phục không bị mờ nhòe hay vỡ hạt.

**Why this priority**: Người dùng thường tải lên các bức ảnh chụp trang phục chất lượng cao từ điện thoại di động có dung lượng rất lớn (từ 3MB đến 10MB mỗi ảnh). Việc nén ảnh sang WebP giúp giảm tối đa thời gian chờ tải ảnh, tránh lỗi ngắt kết nối do mạng chậm và giảm tải chi phí lưu trữ đám mây trong khi vẫn đảm bảo AI nhận diện chính xác các đặc trưng thời trang.

**Independent Test**: Có thể kiểm thử độc lập bằng cách chọn một hoặc nhiều tệp ảnh PNG/JPEG có dung lượng lớn (ví dụ ảnh chụp 4MB - 8MB) tải vào tủ đồ, kiểm tra tệp gửi lên đám mây được chuyển sang định dạng WebP với dung lượng giảm xuống rõ rệt (thường dưới 1MB) và hình ảnh hiển thị trên tủ đồ vẫn giữ trọn vẹn độ nét và màu sắc ban đầu.

**Acceptance Scenarios**:

1. **Given** người dùng chọn 1 đến 5 ảnh trang phục định dạng thông dụng (PNG, JPG, JPEG, WEBP, HEIC) có dung lượng gốc lớn, **When** người dùng bấm xác nhận tải lên và phân tích tủ đồ, **Then** hệ thống tự động nén từng tệp ảnh sang định dạng WebP với chất lượng trực quan sắc nét trước khi tải lên lưu trữ đám mây.
2. **Given** tệp ảnh được chọn có dung lượng sau khi nén giảm tối thiểu 50% so với dung lượng gốc, **When** hoàn tất tải lên, **Then** hình ảnh hiển thị xem trước và dữ liệu nạp vào hệ thống phân tích giữ nguyên chi tiết hoa văn, viền mép và màu sắc trang phục mà không xuất hiện vệt vỡ mờ (artifacts).
3. **Given** tệp ảnh gốc đã có định dạng WebP hoặc dung lượng đã cực nhẹ (dưới 200KB), **When** hệ thống kiểm tra nén, **Then** hệ thống giữ nguyên tối ưu tệp tốn ít dung lượng nhất mà không làm tăng kích thước hoặc làm suy giảm thêm độ phân giải ảnh.
4. **Given** người dùng tải lên ảnh có nền trong suốt (PNG không nền), **When** hệ thống chuyển đổi sang WebP, **Then** lớp nền trong suốt (alpha transparency) vẫn được bảo toàn nguyên vẹn, không bị biến thành nền đen hoặc nền trắng đục.

---

### User Story 2 - Tự động nén ảnh WebP sắc nét khi đăng bài chia sẻ trên cộng đồng (Priority: P1)

Khi người dùng soạn thảo bài viết chia sẻ phong cách trên mạng xã hội cộng đồng và đính kèm hình ảnh (tối đa 10 ảnh), hệ thống tự động áp dụng quy trình nén ảnh WebP sắc nét trước khi tệp được đẩy lên đám mây. Nhờ đó, người dùng đăng bài với nhiều ảnh diễn ra nhanh chóng ngay cả khi dùng mạng 4G/5G, đồng thời người xem bảng tin cộng đồng (feed) tải ảnh mượt mà, nhanh chóng và trải nghiệm hình ảnh thời trang luôn đạt chất lượng thẩm mỹ cao nhất.

**Why this priority**: Bài viết cộng đồng là nơi trình diễn hình ảnh thời trang phong phú với nhiều hình ảnh đính kèm cùng lúc. Việc tối ưu hóa định dạng WebP phía người dùng giúp trải nghiệm đăng bài liền mạch, không bị treo lâu và tối ưu hóa băng thông tải trang cho toàn bộ cộng đồng người dùng.

**Independent Test**: Có thể kiểm thử độc lập bằng cách mở trình soạn thảo bài viết cộng đồng, chọn tải lên 3 đến 5 tệp ảnh lớn, kiểm tra quá trình nén và đăng bài hoàn tất thành công với tệp được lưu trữ dưới định dạng WebP, dung lượng giảm sâu và hiển thị sắc nét trên bài viết vừa đăng.

**Acceptance Scenarios**:

1. **Given** người dùng đang ở trình soạn thảo bài viết cộng đồng (Post Composer) và chọn đính kèm các tệp hình ảnh, **When** các tệp ảnh được tiếp nhận và xử lý tải lên, **Then** hệ thống nén từng ảnh sang WebP sắc nét và gửi lên đám mây theo đúng chữ ký cấp phép.
2. **Given** người dùng chọn tối đa 10 tệp ảnh trong một bài viết, **When** người dùng bấm đăng bài viết, **Then** hệ thống xử lý nén và tải lên song song hoặc tuần tự ổn định, hiển thị trạng thái đang xử lý mượt mà và thông báo thành công khi hoàn tất.
3. **Given** người dùng chỉnh sửa bài viết đã có sẵn hình ảnh và chọn đính kèm thêm ảnh mới, **When** lưu thay đổi bài viết, **Then** chỉ các ảnh mới được nén WebP và tải lên, các ảnh cũ đã tải từ trước vẫn được giữ nguyên.

---

### User Story 3 - Chặn và từ chối tệp video vượt quá 100MB ở bài đăng cộng đồng (Priority: P1)

Khi người dùng soạn thảo bài viết trên cộng đồng và chọn tệp video (định dạng MP4, WebM) để đính kèm, hệ thống lập tức kiểm tra kích thước dung lượng tệp ngay trên thiết bị của người dùng trước khi thực hiện bất kỳ thao tác mạng nào. Nếu tệp video có dung lượng lớn hơn 100MB (104,857,600 bytes), hệ thống lập tức chặn tệp, không cho phép đưa vào danh sách đính kèm của bài viết, không xin chữ ký upload và không đẩy dữ liệu lên máy chủ, đồng thời hiển thị thông báo lỗi rõ ràng bằng tiếng Việt cho người dùng hiểu lý do tệp bị từ chối.

**Why this priority**: Tệp video dung lượng quá lớn làm tốn băng thông nghiêm trọng, gây quá tải lưu trữ, có nguy cơ bị dịch vụ lưu trữ đám mây từ chối ở giữa chừng và làm nghẽn đường truyền mạng của người dùng. Việc chặn tệp lớn hơn 100MB ngay tại nguồn mang lại phản hồi tức thì, bảo vệ hệ thống và giúp người dùng chủ động chọn video phù hợp hơn.

**Independent Test**: Có thể kiểm thử độc lập bằng cách chọn một tệp video có dung lượng 101MB hoặc lớn hơn trong khung chọn media của bài viết cộng đồng, xác nhận tệp bị từ chối ngay lập tức, không xuất hiện trong danh sách media và hiển thị thông báo lỗi nêu rõ tên tệp và giới hạn 100MB.

**Acceptance Scenarios**:

1. **Given** người dùng chọn một tệp video có dung lượng lớn hơn 100MB (ví dụ 105MB), **When** tệp được nạp vào hệ thống, **Then** hệ thống chặn tệp ngay lập tức, không đưa vào danh sách tệp đính kèm và hiển thị thông báo cảnh báo: "Video '[Tên tệp]' vượt quá dung lượng tối đa 100MB. Vui lòng chọn video có dung lượng nhỏ hơn."
2. **Given** người dùng chọn một tệp video có dung lượng nhỏ hơn hoặc bằng 100MB và thời lượng không quá 60 giây, **When** tệp được nạp vào hệ thống, **Then** hệ thống tiếp nhận tệp video hợp lệ, tạo khung xem trước và cho phép người dùng đăng tải bình thường.
3. **Given** người dùng chọn cùng lúc nhiều tệp gồm cả ảnh hợp lệ và một video có dung lượng vượt quá 100MB, **When** hệ thống kiểm tra danh sách tệp đã chọn, **Then** các ảnh hợp lệ vẫn được tiếp nhận và chuẩn bị nén WebP bình thường, trong khi video vượt quá 100MB bị loại trừ kèm thông báo cảnh báo riêng biệt.

---

### Edge Cases

- **Ảnh có độ phân giải gốc cực lớn (Ultra-high resolution)**: Với các ảnh chụp độ phân giải quá cao (ví dụ 48MP, 64MP, chiều rộng > 4000px), cơ chế nén tự động giới hạn chiều dài tối đa (ví dụ 2048px) theo đúng tỷ lệ khung hình ban đầu nhằm tránh lỗi tràn bộ nhớ (browser out-of-memory) trên các thiết bị di động, đồng thời vẫn giữ được độ nét sắc sảo tương đương màn hình hiển thị cao cấp.
- **Trình duyệt cũ hoặc môi trường không hỗ trợ xuất WebP**: Nếu môi trường trình duyệt đặc thù không hỗ trợ xuất ảnh WebP qua canvas, hệ thống tự động sử dụng tệp ảnh gốc hoặc nén sang JPEG chất lượng cao mà không làm sập ứng dụng hay gián đoạn trải nghiệm người dùng.
- **Tệp ảnh bị hỏng cấu trúc (Corrupted Image File)**: Nếu tệp ảnh bị hỏng không thể đọc nạp dữ liệu pixel, hệ thống bắt lỗi an toàn, thông báo tệp ảnh không hợp lệ và tiếp tục cho phép người dùng chọn lại hoặc xử lý các tệp ảnh bình thường khác.
- **Video có dung lượng sát ranh giới 100MB (ví dụ 99.9MB hoặc 100.1MB)**: Hệ thống sử dụng đơn vị tính byte chính xác tuyệt đối (`100 * 1024 * 1024` = 104,857,600 bytes) để so khớp, đảm bảo không xảy ra sai số làm tròn khiến tệp 100.5MB lọt qua hoặc tệp 99.8MB bị chặn nhầm.
- **Video hợp lệ về dung lượng nhưng sai định dạng hoặc quá thời lượng**: Quy tắc chặn video > 100MB hoạt động phối hợp nhịp nhàng với các điều kiện hiện có (chỉ nhận định dạng MP4/WebM và thời lượng tối đa 60 giây).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Hệ thống MUST cung cấp hàm tiện ích nén ảnh phía client có khả năng chuyển đổi các định dạng ảnh thông dụng (PNG, JPG, JPEG, WEBP, HEIC) sang định dạng WebP với mức chất lượng hình ảnh cao, bảo đảm mắt người nhìn không nhận thấy sự suy giảm độ nét (visually lossless).
- **FR-002**: Cơ chế nén ảnh WebP MUST duy trì tỷ lệ khung hình gốc (aspect ratio), màu sắc trung thực và độ tương phản của trang phục, không làm méo mó, biến dạng hoặc gây mờ các chi tiết họa tiết thời trang.
- **FR-003**: Cơ chế nén ảnh WebP MUST bảo toàn kênh độ trong suốt (alpha transparency) đối với các tệp ảnh PNG không nền hoặc đã tách nền.
- **FR-004**: Hệ thống MUST tự động áp dụng hàm nén ảnh WebP trước khi thực hiện tải tệp lên máy chủ/đám mây trong tính năng tải trang phục vào tủ đồ cá nhân (Wardrobe Item Upload).
- **FR-005**: Hệ thống MUST tự động áp dụng hàm nén ảnh WebP trước khi thực hiện tải tệp lên máy chủ/đám mây trong tính năng soạn thảo và chỉnh sửa bài viết cộng đồng (Community Post Composer).
- **FR-006**: Tệp ảnh sau khi nén MUST có định dạng tệp chuẩn `image/webp`, tên tệp có phần mở rộng `.webp` và tương thích 100% với chính sách chữ ký bảo mật tải lên (upload signature allowed_formats) của dịch vụ đám mây.
- **FR-007**: Trong trường hợp tệp ảnh sau khi nén có dung lượng bằng hoặc lớn hơn tệp ảnh ban đầu (ví dụ ảnh gốc đã được tối ưu hóa siêu nhẹ), hệ thống MUST tự động ưu tiên giữ lại tệp có dung lượng nhỏ hơn để tối ưu băng thông.
- **FR-008**: Hệ thống MUST kiểm tra dung lượng của tất cả các tệp video ngay tại thời điểm người dùng chọn tệp hoặc kéo thả tệp vào trình soạn bài viết cộng đồng.
- **FR-009**: Hệ thống MUST chặn và loại bỏ triệt để mọi tệp video có dung lượng lớn hơn 100MB (104,857,600 bytes), không thực hiện xin chữ ký upload và không phát sinh yêu cầu truyền dữ liệu mạng đối với tệp này.
- **FR-010**: Khi một tệp video bị chặn do vượt quá 100MB, hệ thống MUST hiển thị thông báo lỗi rõ ràng bằng tiếng Việt kèm tên tệp và mức dung lượng tối đa cho phép.
- **FR-011**: Khi người dùng chọn nhiều tệp cùng lúc (gồm cả ảnh và video), hệ thống MUST tiếp nhận các tệp hợp lệ bình thường và chỉ từ chối các tệp vi phạm giới hạn dung lượng hoặc sai định dạng.
- **FR-012**: Hệ thống MUST có cơ chế phòng ngừa lỗi (error fallback) an toàn trong quá trình nén ảnh: nếu xảy ra sự cố không lường trước khi đọc ảnh, hệ thống thông báo thân thiện và không làm dừng đột ngột luồng tương tác của người dùng.

### Key Entities *(include if feature involves data)*

- **Kết quả nén hình ảnh (CompressedImageResult)**: Thực thể đại diện cho dữ liệu ảnh sau khi nén, bao gồm tệp nhị phân đầu ra (File hoặc Blob định dạng `image/webp`), tên tệp mới, dung lượng gốc (bytes), dung lượng sau nén (bytes), tỷ lệ tiết kiệm dung lượng (%), và trạng thái hoàn thành.
- **Tệp truyền thông đính kèm (LocalMediaItem)**: Thực thể đại diện cho tệp đính kèm trong bài viết cộng đồng hoặc tủ đồ, bao gồm tệp nhị phân gốc hoặc đã nén, phân loại (image/video), đường dẫn xem trước tạm thời (local preview URL), trạng thái xác thực và thông tin kích thước.
- **Ràng buộc kiểm tra video (VideoValidationRule)**: Bộ quy tắc kiểm tra video cộng đồng, gồm mức trần dung lượng tối đa 100MB (104,857,600 bytes), thời lượng tối đa 60 giây, và danh sách định dạng MIME được cấp phép (`video/mp4`, `video/webm`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Dung lượng trung bình của các tệp ảnh chụp kích thước lớn (> 1MB) sau khi nén sang định dạng WebP giảm từ 50% đến 80%, giúp tốc độ tải ảnh lên mạng nhanh hơn ít nhất 2 lần.
- **SC-002**: Độ nét và độ trung thực thị giác của hình ảnh sau khi nén sang WebP đạt tiêu chuẩn sắc nét cao, không xuất hiện hiện tượng vỡ hạt, mờ nhòe chi tiết trang phục ở mức hiển thị thực tế.
- **SC-003**: 100% các tệp video có dung lượng lớn hơn 100MB được phát hiện và chặn thành công ngay tại bước chọn tệp ở phía người dùng, số lượng yêu cầu upload video quá cỡ gửi lên đám mây đạt 0%.
- **SC-004**: Thông báo lỗi từ chối video quá cỡ 100MB xuất hiện tức thì trong vòng dưới 300 mili-giây kể từ khi người dùng nhả chuột hoặc chọn tệp.
- **SC-005**: Thời gian xử lý nén một bức ảnh hoàn tất trong vòng dưới 1.5 giây trên thiết bị thông thường, đảm bảo giao diện người dùng luôn phản hồi mượt mà không bị đóng băng.

## Assumptions

- Trình duyệt web của người dùng hỗ trợ các hàm canvas tiêu chuẩn của HTML5 để chuyển đổi hình ảnh sang định dạng WebP.
- Mức tham số chất lượng nén ảnh WebP mặc định được thiết lập trong khoảng 0.82 đến 0.88 (khuyến nghị 0.85) kết hợp với giới hạn cạnh phân giải tối đa (ví dụ 2048px) để đảm bảo hình ảnh trang phục luôn sắc nét và dung lượng tối ưu.
- Dịch vụ đám mây (Cloudinary) và chữ ký cấp phép (upload signature) từ backend đã được thiết lập chấp nhận định dạng `webp` trong danh sách định dạng ảnh hợp lệ.
- Giới hạn 100MB cho video áp dụng cho phân hệ bài viết Cộng đồng (Community), đi kèm với quy định thời lượng tối đa 60s sẵn có của hệ thống.
