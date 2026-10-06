# Feature Specification: 032 Fix Avatar Signature Upload

**Feature Branch**: `032-fix-avatar-signature`

**Created**: 2026-10-06

**Status**: Draft

**Input**: User description: "Bug: upload avatar web lỗi Invalid Signature từ Cloudinary - Endpoint GET /api/v1/me/avatar-signature ký 4 field: timestamp, folder, public_id, overwrite=true (BE dùng public_id = userId để ghi đè avatar cũ). Cloudinary tính lại chữ ký từ đúng các field client gửi lên; thiếu overwrite là lệch chữ ký → Invalid Signature. Web src/lib/cloudinary.ts (hàm uploadToCloudinary, block if (pid)) chỉ append public_id, không append overwrite → lỗi. Mobile gửi đủ cả 2 nên không bị. Fix (web): trong if (pid) { ... } thêm: formData.append(\"overwrite\", \"true\"); Cập nhật src/lib/cloudinary.test.ts: case publicId: 'some-id' phải assert form có public_id và overwrite = 'true'. Nên thêm publicId?: string vào type trả về của profileApi.getAvatarSignature (src/features/profile/api/profile.api.ts:27) cho khớp response. Đối chiếu: docs/api/identity/me-api.md §5 (7 field bắt buộc), mobile gửi đủ tại smart-wardrobe-mobile/lib/features/profile/data/profile_repository.dart:109-112."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Tải lên và cập nhật ảnh đại diện cá nhân thành công (Priority: P1)

Là một người dùng đang sử dụng ứng dụng web Smart Wardrobe, tôi muốn tải lên ảnh đại diện mới từ thiết bị của mình và cập nhật thành công vào hồ sơ cá nhân mà không gặp phải lỗi xác thực chữ ký (Invalid Signature), để hồ sơ của tôi luôn phản ánh đúng hình ảnh cá nhân mới nhất.

**Why this priority**: Chức năng cập nhật ảnh đại diện trên giao diện web đang bị lỗi hoàn toàn khiến người dùng không thể đổi ảnh đại diện. Đây là tính năng cá nhân hóa cơ bản của người dùng, làm suy giảm trải nghiệm nếu không hoạt động.

**Independent Test**: Đăng nhập vào ứng dụng web, truy cập trang hồ sơ cá nhân hoặc trang chỉnh sửa hồ sơ, chọn một tệp ảnh đại diện mới từ máy tính, quan sát quá trình tải lên thành công, thông báo cập nhật hồ sơ hiển thị và ảnh đại diện mới xuất hiện ngay trên giao diện mà không có thông báo lỗi.

**Acceptance Scenarios**:

1. **Given** người dùng đã đăng nhập và đang ở trang hồ sơ cá nhân, **When** người dùng bấm nút thay đổi ảnh đại diện và chọn tệp ảnh hợp lệ (PNG/JPG/WEBP), **Then** hệ thống thực hiện tải ảnh lên kho lưu trữ đám mây thành công với chữ ký hợp lệ và cập nhật ảnh mới vào tài khoản người dùng ngay lập tức.
2. **Given** người dùng đang ở trang chỉnh sửa hồ sơ cá nhân (`/profile/edit`), **When** người dùng chọn ảnh đại diện mới và xác nhận lưu, **Then** ảnh đại diện được cập nhật thành công và hiển thị đồng bộ trên toàn bộ thanh điều hướng cũng như trang cá nhân.
3. **Given** người dùng chọn một tệp không phải hình ảnh (ví dụ: PDF, TXT), **When** người dùng chọn tệp, **Then** hệ thống chặn ngay từ giao diện người dùng và đưa ra thông báo cảnh báo rõ ràng yêu cầu chọn đúng định dạng hình ảnh.

---

### User Story 2 - Ghi đè ảnh cũ theo định danh người dùng và tối ưu lưu trữ (Priority: P1)

Là quản trị viên hệ thống và người dùng, tôi muốn mỗi lần thay đổi ảnh đại diện, tệp mới sẽ ghi đè trực tiếp lên tài nguyên ảnh đại diện của chính người dùng đó thay vì tạo ra hàng loạt tài nguyên ảnh mồ côi (orphaned assets), giúp dữ liệu lưu trữ luôn gọn gàng và tiết kiệm chi phí lưu trữ đám mây.

**Why this priority**: Đảm bảo đúng thiết kế định danh của hệ thống (mỗi người dùng chỉ chiếm một định danh ảnh đại diện duy nhất tương ứng với mã tài khoản), đồng thời tuân thủ hợp đồng bảo mật chữ ký số của nhà cung cấp lưu trữ đám mây.

**Independent Test**: Thực hiện tải lên ảnh đại diện nhiều lần cho cùng một tài khoản người dùng, xác nhận trên dịch vụ lưu trữ đám mây tài nguyên ảnh được cập nhật theo cùng một định danh ảnh duy nhất và cờ ghi đè được áp dụng chính xác.

**Acceptance Scenarios**:

1. **Given** người dùng đã có ảnh đại diện từ trước, **When** người dùng tải lên một ảnh đại diện mới, **Then** hệ thống gửi yêu cầu tải lên kèm cờ ghi đè hợp lệ, thay thế tài nguyên cũ tại cùng mã định danh mà không bị nhà cung cấp đám mây từ chối chữ ký.
2. **Given** người dùng tải lên ảnh lần đầu tiên, **When** quá trình tải lên diễn ra, **Then** tài nguyên mới được tạo với mã định danh người dùng và ảnh đại diện được liên kết chính xác với hồ sơ.

---

### User Story 3 - Đồng bộ hành vi và trải nghiệm giữa Web và Mobile (Priority: P2)

Là một người dùng sử dụng Smart Wardrobe trên cả máy tính lẫn điện thoại, tôi muốn hành vi và độ tin cậy của việc thay đổi ảnh đại diện hoạt động trơn tru và nhất quán như nhau trên cả hai nền tảng web và mobile.

**Why this priority**: Hiện tại ứng dụng di động đã hoạt động ổn định và gửi đủ các tham số cần thiết, trong khi ứng dụng web bị thiếu tham số dẫn đến lỗi. Sự bất nhất này gây thất vọng cho người dùng khi thao tác trên máy tính.

**Independent Test**: So sánh quy trình đổi ảnh đại diện giữa ứng dụng di động và trình duyệt web với cùng một tài khoản người dùng, xác nhận cả hai nền tảng đều hoàn thành đổi ảnh thành công với thời gian phản hồi tương đương.

**Acceptance Scenarios**:

1. **Given** người dùng thử nghiệm đổi ảnh đại diện trên ứng dụng di động thành công, **When** người dùng thao tác tương tự trên trình duyệt web, **Then** giao diện web cũng hoàn thành việc tải lên và lưu ảnh mà không có bất kỳ lỗi "Invalid Signature" nào.

---

### Edge Cases

- **Tệp được chọn không đúng định dạng ảnh**: Giao diện người dùng chặn ngay từ đầu, hiển thị thông báo "Vui lòng chọn file hình ảnh", không gửi yêu cầu lên máy chủ hay kho lưu trữ đám mây.
- **Mất kết nối mạng trong quá trình tải ảnh**: Hệ thống thông báo lỗi thân thiện cho người dùng, hủy trạng thái đang tải (loading) và cho phép người dùng thử lại khi có mạng.
- **Tải lên các tài nguyên khác không phải ảnh đại diện** (ví dụ: ảnh quần áo trong tủ đồ, ảnh bài viết cộng đồng): Hệ thống KHÔNG được gửi cờ ghi đè (`overwrite`) hay định danh tài nguyên cố định (`public_id`), đảm bảo các tài nguyên này luôn tạo mới độc lập và không bị xung đột chữ ký số.
- **Chữ ký tải lên bị hết hạn hoặc lỗi máy chủ**: Hệ thống bắt lỗi nhẹ nhàng, hiển thị thông báo lỗi rõ ràng và mở lại nút chọn ảnh để người dùng thao tác lại.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Hệ thống PHẢI đảm bảo khi gửi yêu cầu tải lên kho lưu trữ đám mây có kèm mã định danh tài sản (`public_id`), bắt buộc PHẢI gửi kèm cờ ghi đè (`overwrite = true`) trong biểu mẫu dữ liệu gửi đi.
- **FR-002**: Hệ thống KHÔNG ĐƯỢC gửi cờ ghi đè (`overwrite`) hoặc mã định danh tài sản (`public_id`) trong biểu mẫu tải lên khi thực hiện tải các tài nguyên khác không có yêu cầu định danh cố định (ví dụ: ảnh tủ đồ, ảnh bài đăng).
- **FR-003**: Dữ liệu phản hồi từ giao diện lập trình cấp chữ ký ảnh đại diện PHẢI bao gồm và phản ánh đầy đủ trường định danh tài sản (`publicId`) để các thành phần giao diện sử dụng chuẩn xác.
- **FR-004**: Khi người dùng tải ảnh đại diện thành công lên kho lưu trữ đám mây, hệ thống PHẢI tự động gửi yêu cầu cập nhật hồ sơ với đường dẫn ảnh (`avatarUrl`) và mã định danh ảnh (`avatarPublicId`) mới.
- **FR-005**: Giao diện người dùng PHẢI hiển thị trạng thái đang xử lý tải lên (loading spinner / disable nút) và mở lại trạng thái bình thường sau khi hoàn tất hoặc khi có lỗi xảy ra.
- **FR-006**: Bộ kiểm thử tự động của dịch vụ tải lên đám mây PHẢI xác nhận đầy đủ tính toàn vẹn của các trường trong biểu mẫu dữ liệu, đảm bảo có mặt đồng thời cả `public_id` và `overwrite = true` khi tham số định danh được cung cấp.

### Key Entities

- **UserAvatar (Ảnh đại diện người dùng)**: Tài nguyên hình ảnh đại diện cá nhân của người dùng, liên kết với tài khoản người dùng thông qua mã định danh cố định và đường dẫn an toàn.
- **UploadSignaturePayload (Dữ liệu xác thực tải lên)**: Tập hợp các tham số bảo mật được cấp từ máy chủ gồm khóa API, dấu thời gian, thư mục lưu trữ, chữ ký số, mã định danh tài sản và cờ ghi đè.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Tỉ lệ tải lên ảnh đại diện thành công trên nền tảng web đạt 100% đối với các tệp ảnh hợp lệ (loại bỏ hoàn toàn lỗi Invalid Signature).
- **SC-002**: Thời gian từ lúc người dùng chọn ảnh đến khi ảnh mới hiển thị trên hồ sơ không vượt quá 3 giây trong điều kiện mạng bình thường.
- **SC-003**: 100% các lần thay đổi ảnh đại diện của cùng một người dùng ghi đè chính xác lên tài nguyên cũ, không tạo thêm tài nguyên rác trên kho lưu trữ đám mây.
- **SC-004**: 100% các ca kiểm thử tự động liên quan đến hợp đồng tải lên có định danh tài sản đều vượt qua với đầy đủ các trường bắt buộc.

## Assumptions

- Máy chủ backend cung cấp chữ ký cho ảnh đại diện theo hợp đồng tại `docs/api/identity/me-api.md §5`, ký 4 trường (`timestamp`, `folder`, `public_id`, `overwrite=true`) với `public_id` chính là mã người dùng (`userId`).
- Dịch vụ lưu trữ đám mây Cloudinary xác thực chữ ký dựa trên tập hợp chính xác các trường nhận được từ client; việc thiếu bất kỳ trường nào đã ký sẽ dẫn đến lỗi "Invalid Signature".
- Chỉ có luồng tải ảnh đại diện cá nhân mới áp dụng cơ chế định danh cố định và ghi đè; các luồng tải ảnh khác trong ứng dụng (tủ đồ, outfit, mạng xã hội) không áp dụng cơ chế này và không bị ảnh hưởng.
- Ứng dụng di động đã tích hợp chính xác và hoạt động ổn định làm chuẩn đối chiếu cho phía web.
