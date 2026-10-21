# Feature Specification: 022 Community Social Frontend Integration

**Feature Branch**: `022-community-social`

**Created**: 2026-09-26

**Status**: Ready for Planning

**Input**: User description: "tui đã cập nhật BE cho luồng community ở file specs/022-community-social/frontend-integration.md bạn hãy xem sau đó lên plan"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Khám phá bảng tin và xem chi tiết bài đăng (Priority: P1)

Là một thành viên hoặc khách vãng lai yêu thích thời trang, tôi muốn duyệt bảng tin cộng đồng (khám phá xu hướng hoặc xem những người tôi đang theo dõi) và mở xem chi tiết một bài đăng cụ thể để lấy cảm hứng phối đồ và ngắm nhìn các trang phục thực tế.

**Why this priority**: Bảng tin cộng đồng và trang chi tiết bài đăng là trái tim của trải nghiệm mạng xã hội thời trang, kết nối trực tiếp nguồn cảm hứng trang phục với người dùng.

**Independent Test**: Có thể kiểm thử độc lập bằng cách mở trang cộng đồng, chuyển đổi giữa tab "Khám phá" và "Đang theo dõi", lọc sắp xếp theo "Nổi bật" hoặc "Mới nhất", và nhấn vào bài viết bất kỳ để chuyển đến trang chi tiết bài đăng với đầy đủ thông tin tác giả, trang phục liên kết hoặc bộ sưu tập ảnh/video.

**Acceptance Scenarios**:

1. **Given** người dùng đang ở trang bảng tin cộng đồng, **When** chọn tab "Khám phá" và sắp xếp "Mới nhất", **Then** hệ thống hiển thị danh sách các bài viết đã xuất bản theo trình tự thời gian giảm dần với tác giả, tiêu đề, nội dung và hình ảnh/trang phục.
2. **Given** người dùng đã đăng nhập và đang theo dõi tác giả A, **When** chuyển sang tab "Đang theo dõi", **Then** hệ thống hiển thị các bài đăng của tác giả A và bài đăng của chính người dùng.
3. **Given** khách vãng lai chưa đăng nhập, **When** cố gắng chọn tab "Đang theo dõi", **Then** hệ thống thông báo yêu cầu đăng nhập và ngăn chặn truy cập dữ liệu theo dõi cá nhân.
4. **Given** người dùng xem một bài đăng dạng trang phục (`outfit`), **When** mở bài đăng, **Then** hệ thống hiển thị ảnh bìa trang phục và thông tin trang phục liên kết.
5. **Given** người dùng xem một bài đăng dạng đa phương tiện (`media`), **When** bài đăng có video hoặc nhiều hình ảnh, **Then** hệ thống hiển thị đúng trình phát video hoặc lưới ảnh tương ứng.

---

### User Story 2 - Soạn thảo và chia sẻ bài đăng thời trang (Priority: P1)

Là một người dùng đã đăng nhập, tôi muốn tạo bài viết mới bằng cách chọn một bộ trang phục đã phối từ tủ đồ cá nhân hoặc tải lên hình ảnh/video kèm lời chia sẻ, và có thể chỉnh sửa nội dung bài đăng của chính mình sau đó.

**Why this priority**: Cho phép người dùng đóng góp nội dung, thúc đẩy sự tương tác và biến tủ đồ số hóa thành các bộ sưu tập thời trang có giá trị chia sẻ.

**Independent Test**: Đăng nhập, mở trình tạo bài viết, chọn đăng từ bộ trang phục có sẵn trong tủ đồ hoặc tải lên ảnh/video cùng tiêu đề và nội dung, kiểm tra bài viết xuất hiện trên đầu bảng tin; sau đó thử chỉnh sửa nội dung và xác nhận bài đăng được cập nhật.

**Acceptance Scenarios**:

1. **Given** người dùng chọn chia sẻ bài đăng dạng trang phục (`outfit`), **When** chọn một trang phục hợp lệ từ danh sách tủ đồ của mình và nhập nội dung chia sẻ, **Then** bài viết được xuất bản thành công và hiển thị ngay trên bảng tin.
2. **Given** người dùng chọn chia sẻ bài đăng ảnh/video (`media`), **When** tải lên từ 1 đến 10 tệp hình ảnh/video hợp lệ và nhập nội dung chia sẻ, **Then** tệp được xử lý bảo mật và bài viết xuất bản thành công.
3. **Given** người dùng cố gắng xuất bản bài viết trống (không có nội dung chữ và không có hình ảnh/video nào), **When** nhấn nút đăng, **Then** hệ thống chặn hành động và thông báo lỗi rõ ràng.
4. **Given** bài đăng thuộc sở hữu của người dùng hiện tại, **When** người dùng chọn chỉnh sửa tiêu đề hoặc nội dung và lưu lại, **Then** thông tin mới được lưu và cập nhật ngay lập tức mà không làm thay đổi loại bài đăng (`postType`).

---

### User Story 3 - Tương tác Thích và xem danh sách người yêu thích (Priority: P2)

Là một thành viên, tôi muốn nhấn "Thích" hoặc "Bỏ thích" các bài đăng truyền cảm hứng cho mình và xem danh sách những ai đã thích bài đăng đó.

**Why this priority**: Tương tác thả tim tạo phản hồi tức thì và nâng cao động lực sáng tạo cho tác giả.

**Independent Test**: Nhấn nút thích trên bài đăng, kiểm tra số lượt thích và trạng thái icon cập nhật tức thì (phản hồi ngay lập tức trên giao diện); mở danh sách người thích để xem hồ sơ những người đã tương tác.

**Acceptance Scenarios**:

1. **Given** bài viết đang ở trạng thái chưa thích, **When** người dùng nhấn nút Thích, **Then** biểu tượng chuyển sang trạng thái đã thích, số lượt thích tăng lên 1 ngay lập tức.
2. **Given** bài viết đang ở trạng thái đã thích, **When** người dùng nhấn lại nút Thích, **Then** biểu tượng quay về trạng thái chưa thích và số lượt thích giảm đi 1.
3. **Given** người dùng nhấn vào số lượt thích của bài viết, **When** cửa sổ danh sách người thích mở ra, **Then** hệ thống hiển thị danh sách người dùng đã thích bài viết (kèm ảnh đại diện, tên, tên tài khoản, giới tính nếu có) theo trang phân đoạn.

---

### User Story 4 - Thảo luận và trao đổi qua bình luận phân cấp (Priority: P2)

Là một thành viên, tôi muốn gửi bình luận vào bài viết, phản hồi bình luận của người khác (bình luận lồng cấp), chỉnh sửa hoặc xóa bình luận của chính mình để thảo luận về phong cách và cách phối đồ.

**Why this priority**: Bình luận là trung tâm giao tiếp hai chiều giữa người xem và tác giả.

**Independent Test**: Mở modal hoặc khu vực bình luận của bài viết, gửi bình luận gốc, gửi bình luận phản hồi cho một người khác, thử chỉnh sửa nội dung bình luận và thử xóa bình luận.

**Acceptance Scenarios**:

1. **Given** người dùng nhập nội dung bình luận hợp lệ (tối đa 1000 ký tự), **When** gửi bình luận, **Then** bình luận gốc xuất hiện trên đầu danh sách thảo luận và tổng số bình luận của bài viết tăng lên 1.
2. **Given** một bình luận gốc đã có, **When** người dùng nhấn "Trả lời" và gửi phản hồi, **Then** câu trả lời xuất hiện lồng bên dưới bình luận gốc theo thứ tự thời gian cũ nhất đến mới nhất.
3. **Given** người dùng là chủ nhân của một bình luận, **When** chọn chỉnh sửa nội dung bình luận, **Then** nội dung bình luận được cập nhật trực tiếp tại chỗ.
4. **Given** một bình luận gốc có chứa các câu trả lời con, **When** chủ bình luận xóa bình luận gốc đó, **Then** nội dung bình luận gốc hiển thị thông báo "Bình luận đã bị xóa" và các câu trả lời con vẫn được giữ nguyên.
5. **Given** một bình luận đơn lẻ không có câu trả lời nào, **When** tác giả xóa bình luận, **Then** bình luận đó biến mất hoàn toàn khỏi danh sách hiển thị.

---

### User Story 5 - Theo dõi tác giả và xem Trang cá nhân công khai (Priority: P3)

Là một người dùng, tôi muốn theo dõi (Follow) hoặc bỏ theo dõi (Unfollow) các thành viên có phong cách tôi yêu thích, truy cập trang cá nhân công khai của họ để xem các chỉ số (số người theo dõi, đang theo dõi, số bài viết) và toàn bộ bài đăng của họ.

**Why this priority**: Xây dựng đồ thị mạng xã hội người theo dõi (social graph), định vị các nhà sáng tạo phong cách (style curator) nổi bật.

**Independent Test**: Nhấn nút "Theo dõi" trên thẻ bài viết hoặc trang cá nhân của tác giả; mở trang cá nhân công khai `/users/[username]` để duyệt thống kê, danh sách bài viết của họ, và mở danh sách người theo dõi/đang theo dõi.

**Acceptance Scenarios**:

1. **Given** bài đăng của tác giả mà người dùng chưa theo dõi, **When** người dùng nhấn "Theo dõi", **Then** nút chuyển sang trạng thái "Đang theo dõi" và số lượng người theo dõi của tác giả tăng thêm 1.
2. **Given** người dùng truy cập trang cá nhân công khai của người dùng khác (`/users/[username]`), **When** trang tải xong, **Then** hệ thống hiển thị thông tin hồ sơ (ảnh đại diện, tên đầy đủ, tên tài khoản, giới tính), số bài viết, số người theo dõi, số người đang theo dõi và danh sách các bài viết đã xuất bản.
3. **Given** người dùng xem trang cá nhân của chính mình (`isMe = true`), **When** duyệt danh sách bài viết, **Then** người dùng thấy cả các bài viết công khai và các bài viết đang bị ẩn quản trị kèm huy hiệu cảnh báo trạng thái.
4. **Given** người dùng mở danh sách người theo dõi hoặc đang theo dõi, **When** nhập từ khóa vào ô tìm kiếm danh sách, **Then** danh sách lọc chính xác theo tên tài khoản hoặc họ tên.

---

### User Story 6 - Tìm kiếm nội dung bài đăng và người dùng (Priority: P3)

Là một người dùng, tôi muốn tìm kiếm người dùng và các bài viết thời trang theo từ khóa để nhanh chóng tiếp cận những tài khoản phù hợp và các bài viết theo xu hướng gần đây.

**Why this priority**: Giúp nâng cao khả năng khám phá nội dung mới (discoverability) trên toàn nền tảng.

**Independent Test**: Nhập từ khóa vào trang tìm kiếm chung, kiểm tra kết quả phân tách thành hai khu vực: nhóm Người dùng (sắp xếp theo độ phổ biến) và nhóm Bài viết (tìm kiếm trong 30 ngày gần nhất).

**Acceptance Scenarios**:

1. **Given** người dùng nhập từ khóa tìm kiếm (từ 1 ký tự trở lên), **When** thực hiện tìm kiếm, **Then** hệ thống trả về kết quả song song gồm danh sách người dùng phù hợp và danh sách bài viết liên quan.
2. **Given** kết quả tìm kiếm bài viết, **Then** chỉ những bài viết xuất bản trong vòng 30 ngày gần nhất và ở trạng thái hợp lệ mới xuất hiện.
3. **Given** người dùng chuyển bộ lọc tìm kiếm sang chỉ "Người dùng" hoặc chỉ "Bài viết", **Then** hệ thống tập trung phân trang kết quả của nhóm tương ứng mà không gây lỗi phân trang chéo.

---

### User Story 7 - Quản trị và kiểm duyệt nội dung cộng đồng (Priority: P4)

Là một quản trị viên nền tảng, tôi muốn kiểm duyệt danh sách tất cả bài viết và bình luận trong hệ thống, thực hiện ẩn các nội dung vi phạm tiêu chuẩn cộng đồng hoặc khôi phục lại khi phù hợp.

**Why this priority**: Bảo vệ sự lành mạnh và uy tín của cộng đồng thời trang, đảm bảo môi trường mạng xã hội an toàn.

**Independent Test**: Đăng nhập bằng tài khoản quản trị viên, truy cập khu vực kiểm duyệt bài viết và bình luận, thực hiện thao tác ẩn bài viết vi phạm, kiểm tra bài viết đó không còn xuất hiện với người dùng thông thường nhưng tác giả vẫn thấy thông báo bị ẩn.

**Acceptance Scenarios**:

1. **Given** quản trị viên xem danh sách bài viết trong trang quản trị, **When** nhấn "Ẩn bài viết" cho một bài vi phạm, **Then** trạng thái bài chuyển sang "Đã ẩn" (`hidden`), người dùng thông thường truy cập nhận thông báo không tìm thấy (404), tác giả xem sẽ thấy huy hiệu bài bị ẩn.
2. **Given** một bài viết hoặc bình luận đã bị quản trị viên ẩn, **When** quản trị viên kiểm tra lại và nhấn "Khôi phục", **Then** bài viết/bình luận trở lại trạng thái xuất bản bình thường.
3. **Given** một nội dung đã do chính tác giả tự tay xóa, **When** quản trị viên cố gắng khôi phục, **Then** hệ thống từ chối hành động và giải thích nội dung do người dùng tự xóa không thể khôi phục.

---

### Edge Cases

- **Tác giả xem bài viết của chính mình bị ẩn**: Bài viết do quản trị viên ẩn vẫn hiển thị đối với chính tác giả trong feed cá nhân với nhãn `hidden`, giúp tác giả nhận biết nội dung đang bị kiểm duyệt thay vì biến mất đột ngột.
- **Bình luận gốc bị xóa khi đã có câu trả lời**: Không xóa cứng bản ghi để tránh làm đứt gãy luồng thảo luận; hiển thị nội dung thay thế "Bình luận đã bị xóa" và giữ nguyên các phản hồi bên dưới.
- **Giới hạn tần suất thao tác (Rate Limit)**: Khi người dùng vượt ngưỡng cho phép (tạo bài > 10 bài/giờ, bình luận > 60/giờ, theo dõi > 200/giờ, thích > 600/giờ), hệ thống hiển thị thông báo nhẹ nhàng giải thích việc gửi yêu cầu quá nhanh và đề nghị thử lại sau, không làm sập ứng dụng.
- **Tập tin quá dung lượng hoặc thời lượng**: Khi người dùng chọn tải ảnh > 10MB hoặc video > 100MB / > 60 giây, giao diện kiểm tra và cảnh báo ngay lập tức trước khi tải lên Cloudinary để tiết kiệm băng thông và tối ưu trải nghiệm.
- **Mất liên kết trang phục (`outfit`)**: Trường hợp bộ trang phục liên kết bị lỗi tải hoặc đã xóa, bài viết vẫn hiển thị được các thông tin văn bản và thông báo dự phòng an toàn thay vì gây lỗi trắng trang.
- **Tác giả tự theo dõi chính mình**: Giao diện tự động ẩn nút theo dõi đối với các bài viết hoặc hồ sơ của chính người đang đăng nhập; nếu phát sinh yêu cầu, hệ thống từ chối và giữ nguyên trạng thái.
- **Người dùng chưa có ảnh đại diện hoặc giới tính**: Hệ thống hiển thị ảnh đại diện mặc định theo chữ cái đầu và xử lý an toàn khi các trường thông tin phụ bị để trống.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Hệ thống PHẢI cung cấp bảng tin cộng đồng hỗ trợ phân loại theo hai tab: `explore` (Khám phá toàn bộ bài viết xuất bản) và `following` (Chỉ bài viết từ những người đang theo dõi và chính mình).
- **FR-002**: Hệ thống PHẢI hỗ trợ sắp xếp bài viết theo hai tiêu chí: `hot` (Độ thịnh hành/nổi bật) và `latest` (Mới nhất theo thời gian).
- **FR-003**: Hệ thống PHẢI chuẩn hóa loại bài đăng (`postType`) thành đúng hai giá trị chữ thường: `'outfit'` (Bài đăng gắn với bộ trang phục từ tủ đồ) và `'media'` (Bài đăng chia sẻ hình ảnh hoặc video tự do).
- **FR-004**: Hệ thống PHẢI chuẩn hóa loại tệp đính kèm (`mediaType`) thành đúng hai giá trị chữ thường: `'image'` và `'video'`.
- **FR-005**: Mọi đối tượng bài viết (`PostRes`), bình luận (`CommentRes`), và quan hệ theo dõi (`FollowUserRes`) PHẢI đọc thông tin tác giả từ cấu trúc lồng `user` (`userId`, `username`, `firstName`, `lastName`, `avatarUrl`, `gender`), loại bỏ hoàn toàn các trường tác giả phẳng cũ ở cấp gốc.
- **FR-006**: Loại bỏ hoàn toàn các cấu trúc dữ liệu liên quan đến việc bán lại hoặc chuyển nhượng đồ cũ (`items`, `PostItemRes`, `totalPrice`, `contactInfo`, `transferState`, `buyerUserId`, `soldAt`, `declinedAt`, `itemCondition`) ra khỏi giao diện và logic cộng đồng.
- **FR-007**: Khi người dùng tạo bài viết với `postType='outfit'`, hệ thống BẮT BUỘC người dùng phải chọn một bộ trang phục hợp lệ (`outfitId`) từ tủ đồ cá nhân.
- **FR-008**: Khi người dùng tạo bài viết với `postType='media'`, hệ thống PHẢI yêu cầu có ít nhất nội dung chữ không rỗng HOẶC ít nhất 1 tệp hình ảnh/video đính kèm.
- **FR-009**: Hệ thống PHẢI kiểm tra giới hạn độ dài trước khi gửi: Tiêu đề không quá 150 ký tự, Nội dung bài viết không quá 5000 ký tự, Nội dung bình luận không quá 1000 ký tự, Số lượng tệp đính kèm không quá 10 tệp.
- **FR-010**: Quy trình tải tệp PHẢI lấy chữ ký bảo mật kèm tham số loại tài nguyên (`resourceType=image|video`) và gửi đến đúng cổng tiếp nhận tệp tương ứng trên dịch vụ lưu trữ đám mây.
- **FR-011**: Hệ thống PHẢI cung cấp tính năng Thích và Bỏ thích bài viết với cơ chế cập nhật lạc quan (Optimistic Update) trên giao diện để người dùng nhận phản hồi tức thì.
- **FR-012**: Hệ thống PHẢI cung cấp danh sách người thích bài viết theo định dạng phân trang chuẩn, hiển thị thông tin hồ sơ từng người dùng.
- **FR-013**: Hệ thống PHẢI hiển thị danh sách bình luận gốc sắp xếp theo thứ tự mới nhất trước, và danh sách các câu trả lời con bên trong mỗi bình luận gốc sắp xếp theo thứ tự cũ nhất trước.
- **FR-014**: Hệ thống PHẢI cho phép chủ bình luận chỉnh sửa nội dung hoặc xóa bình luận của mình; nếu bình luận gốc bị xóa còn câu trả lời con, hệ thống hiển thị nhãn "Bình luận đã bị xóa" thay vì xóa trắng toàn bộ nhánh phản hồi.
- **FR-015**: Hệ thống PHẢI cung cấp nút Theo dõi/Bỏ theo dõi tác giả ngay trên bài viết và trên trang cá nhân; nút này tự động ẩn nếu người xem chính là tác giả bài viết.
- **FR-016**: Hệ thống PHẢI cung cấp trang cá nhân công khai theo đường dẫn `/users/[username]`, hiển thị đầy đủ các chỉ số thống kê (bài viết, người theo dõi, đang theo dõi) và danh sách bài viết đã đăng của người đó.
- **FR-017**: Danh sách quan hệ theo dõi của một người dùng PHẢI hỗ trợ xem người đang theo dõi (`following`), người theo dõi (`followers`), tìm kiếm theo từ khóa và hiển thị mối quan hệ đối ứng (`relation`).
- **FR-018**: Hệ thống PHẢI thống nhất đường dẫn chia sẻ bài viết (`sharePath`) đồng bộ với định tuyến trang chi tiết bài viết của ứng dụng.
- **FR-019**: Trang tìm kiếm PHẢI gọi dịch vụ tìm kiếm tập trung để hiển thị đồng thời hai khối kết quả: Người dùng phù hợp (ưu tiên theo độ phổ biến) và Bài viết phù hợp (trong vòng 30 ngày gần nhất).
- **FR-020**: Khu vực quản trị viên PHẢI hỗ trợ kiểm duyệt bài viết và bình luận: xem danh sách, lọc theo trạng thái, ẩn nội dung vi phạm tiêu chuẩn, và khôi phục nội dung đã ẩn.
- **FR-021**: Hệ thống PHẢI hiển thị các thông báo lỗi bằng ngôn ngữ tiếng Việt thân thiện, đồng thời xử lý phù hợp các mã phản hồi tiêu chuẩn (400, 401, 403, 404, 429).

### Key Entities

- **CommunityUser**: Đại diện cho hồ sơ thành viên trong mạng xã hội, bao gồm mã định danh tài khoản, tên tài khoản duy nhất, họ tên hiển thị, ảnh đại diện và giới tính (Nam, Nữ, Khác).
- **Post**: Bài đăng chia sẻ thời trang trên cộng đồng, bao gồm mã công khai nhận diện, thông tin tác giả (`CommunityUser`), loại bài đăng (`outfit` hoặc `media`), trạng thái duyệt (`published`, `hidden`, `deleted`), tiêu đề, nội dung, bộ trang phục liên kết, danh sách tệp hình ảnh/video, số lượt thích, số bình luận, trạng thái đã thích của người xem và cờ đang theo dõi tác giả.
- **OutfitBrief**: Thông tin tóm tắt của bộ trang phục liên kết trong bài đăng, gồm mã định danh trang phục, tên bộ phối và ảnh bìa trang phục.
- **Comment**: Bình luận thảo luận dưới bài viết, bao gồm mã định danh, thông tin người bình luận (`CommunityUser`), nội dung, mã bình luận cha (nếu là câu trả lời), số lượng phản hồi con, trạng thái đã bị xóa và thời điểm gửi.
- **FollowRelationship**: Mối quan hệ kết nối giữa hai thành viên, thể hiện trạng thái đang theo dõi hoặc là người theo dõi, kèm thời điểm kết nối.
- **PublicProfile**: Hồ sơ công khai của một thành viên bao gồm thông tin cá nhân, bộ chỉ số đo lường (số bài viết, số follower, số following) và trạng thái tương tác với người xem hiện tại.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Người dùng có thể duyệt bảng tin và nhìn thấy 10 bài viết đầu tiên cùng hình ảnh sắc nét trong vòng dưới 2 giây trên kết nối mạng thông thường.
- **SC-002**: Tương tác Thích và Bỏ thích phản hồi hiển thị trên giao diện ngay lập tức (< 100ms) nhờ cơ chế cập nhật lạc quan mà không gây giật lag.
- **SC-003**: 100% các bài viết dạng trang phục (`outfit`) hiển thị chính xác ảnh bìa trang phục và thông tin phối đồ từ tủ đồ của tác giả.
- **SC-004**: Người dùng có thể hoàn thành việc tạo và xuất bản một bài viết mới (chọn trang phục hoặc đính kèm ảnh) trong vòng dưới 60 giây.
- **SC-005**: Thao tác Theo dõi hoặc Bỏ theo dõi tác giả phản hồi trạng thái nút ngay lập tức và đồng bộ số liệu trên toàn bộ giao diện người dùng.
- **SC-006**: Tất cả các định dạng lỗi từ máy chủ (bao gồm giới hạn tần suất 429 và kiểm tra dữ liệu 400) được hiển thị bằng thông báo tiếng Việt rõ ràng, dễ hiểu cho 100% trường hợp xảy ra.
- **SC-007**: 0% lỗi xảy ra do truy cập sai cấu trúc dữ liệu tác giả nhờ chuyển đổi hoàn toàn sang đối tượng lồng `user`.
- **SC-008**: Tỷ lệ hoàn thành tác vụ tìm kiếm người dùng và bài đăng thành công đạt trên 90% ngay trong lần thử đầu tiên.

## Assumptions

- Người dùng đã có sẵn các bộ trang phục trong tủ đồ nếu muốn sử dụng tính năng đăng bài loại `outfit`.
- Việc lưu trữ và phân phối tệp hình ảnh/video được vận hành thông qua dịch vụ đám mây Cloudinary đã tích hợp sẵn trên hệ thống.
- Khách vãng lai chưa đăng nhập có thể xem nội dung công khai (bảng tin Khám phá, chi tiết bài viết, hồ sơ công khai) nhưng bắt buộc phải đăng nhập để thực hiện các thao tác tương tác (Tạo bài, Thích, Bình luận, Theo dõi).
- Giao diện quản trị viên chỉ mở cho các tài khoản có quyền quản trị hợp lệ từ hệ thống phân quyền của ứng dụng.
