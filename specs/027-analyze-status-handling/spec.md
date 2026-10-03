# Feature Specification: Đồng bộ và xử lý toàn diện trạng thái phân tích ảnh trang phục AI

**Feature Branch**: `027-analyze-status-handling`

**Created**: 2026-10-03

**Status**: Draft

**Input**: User description: "đọc file này để fix tí lỗi phân tích ảnh nha specs\023-analyze-status-handling\frontend-guide.md"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Phân biệt chính xác lý do ảnh không hợp lệ và hướng dẫn tải ảnh thay thế (Priority: P1)

Khi người dùng tải lên ảnh không hợp lệ (ảnh có nhiều món đồ, ảnh chụp toàn thân, hoặc ảnh chụp vật thể không phải trang phục như chuột laptop, điện thoại, sách, ảnh mờ/trắng), hệ thống hiển thị chính xác trạng thái thất bại cùng thông điệp giải thích thân thiện, rõ nghĩa theo từng nguyên nhân. Hệ thống ẩn nút "Thử lại" đối với nhóm ảnh không hợp lệ này (vì việc thử lại cùng một tấm ảnh không hợp lệ sẽ luôn bị máy chủ từ chối), đồng thời hướng dẫn người dùng tải ảnh khác hoặc xóa món đồ lỗi.

**Why this priority**: Đây là điểm nghẽn trải nghiệm lớn nhất. Trước đây ảnh không phải trang phục bị báo nhầm là "nhiều món" và vẫn hiển thị nút "Thử lại" dẫn đến việc người dùng bấm thử lại liên tục trong vô vọng. Việc phân loại chính xác lý do và chặn thử lại sai giúp loại bỏ hoàn toàn vòng lặp lỗi này.

**Independent Test**: Có thể kiểm thử độc lập bằng cách tải lên ảnh một vật thể không phải trang phục (hoặc gán món đồ vào trạng thái lỗi với mã không phải trang phục), xác nhận giao diện hiển thị thông báo "Ảnh không phải trang phục — hãy tải ảnh đúng món đồ", nút "Thử lại" bị ẩn, và người dùng có tùy chọn xóa món hoặc tải ảnh mới.

**Acceptance Scenarios**:

1. **Given** một món đồ có kết quả phân tích thất bại vì không có trang phục nào trong ảnh, **When** người dùng xem thẻ món đồ hoặc trang chi tiết, **Then** hệ thống hiển thị thông điệp "Ảnh không phải trang phục — hãy tải ảnh đúng món đồ", không hiển thị nút "Thử lại", và cung cấp thao tác xóa món hoặc tải ảnh mới.
2. **Given** một món đồ có kết quả phân tích thất bại vì ảnh chụp nhiều món hoặc ảnh chụp toàn thân, **When** người dùng xem món đồ, **Then** hệ thống hiển thị tương ứng "Ảnh có nhiều món — tải ảnh khác" hoặc "Ảnh toàn thân — tải ảnh cận một món", và ẩn nút "Thử lại".
3. **Given** một món đồ có kết quả phân tích thất bại do lỗi kỹ thuật tạm thời hoặc vượt số lần tự động thử lại, **When** người dùng xem món đồ, **Then** hệ thống hiển thị thông điệp lỗi tạm thời và nút "Thử lại" cho phép người dùng gửi lại yêu cầu phân tích mà không cần tải lại ảnh.

---

### User Story 2 - Rà soát và chọn danh mục cho món cần kiểm tra kèm xác thực lại ảnh (Priority: P1)

Khi AI nhận diện được chính xác một món trang phục duy nhất nhưng chưa chắc chắn về danh mục phù hợp, món đồ được chuyển sang trạng thái "Cần rà soát". Người dùng được hướng dẫn chọn một danh mục hợp lệ từ danh sách danh mục có sẵn và bấm "Gửi phân tích lại". Hệ thống chuyển món đồ sang trạng thái "Đang xử lý", áp dụng danh mục cố định đã chọn và theo dõi tiến trình qua luồng thời gian thực. Nếu quá trình phân tích lại xác định ảnh không thể sử dụng được, hệ thống cập nhật về trạng thái thất bại tương ứng và hướng dẫn tải ảnh khác thay vì điều hướng vội vàng coi như đã hoàn tất.

**Why this priority**: Đảm bảo dữ liệu thời trang đưa vào tủ đồ là chính xác. Nếu bỏ qua bước xác thực hoặc tự động điều hướng mà không chờ kết quả phân tích lại, món đồ sai lệch sẽ đi vào kho dữ liệu và làm sai lệch thuật toán gợi ý phối đồ về sau.

**Independent Test**: Có thể kiểm thử độc lập bằng cách mở một món đồ đang ở trạng thái cần rà soát, chọn danh mục phù hợp, bấm gửi phân tích lại, theo dõi quá trình xử lý thời gian thực cho đến khi hoàn tất và món đồ chuyển sang trạng thái sử dụng được trong tủ đồ.

**Acceptance Scenarios**:

1. **Given** một món đồ ở trạng thái cần rà soát danh mục, **When** người dùng xem chi tiết hoặc thẻ rà soát, **Then** hệ thống yêu cầu người dùng chọn một danh mục hợp lệ và vô hiệu hóa nút gửi phân tích lại nếu chưa chọn danh mục.
2. **Given** người dùng đã chọn danh mục hợp lệ và bấm gửi phân tích lại, **When** hệ thống tiếp nhận, **Then** món đồ chuyển sang trạng thái đang xử lý và hiển thị tiến trình chờ kết quả thời gian thực.
3. **Given** một món đồ đang phân tích lại sau khi chọn danh mục, **When** quá trình phân tích lại phát hiện ảnh không hợp lệ, **Then** hệ thống chuyển trạng thái món sang thất bại với lý do cụ thể và hướng dẫn tải ảnh khác, không để món đồ kẹt ở trạng thái đang xử lý hoặc đưa dữ liệu lỗi vào tủ đồ.
4. **Given** một món đồ đang phân tích lại sau khi chọn danh mục, **When** quá trình phân tích lại thành công, **Then** món đồ cập nhật đầy đủ thuộc tính và chuyển sang trạng thái sử dụng được trong tủ đồ.

---

### User Story 3 - Theo dõi tiến trình thời gian thực ổn định và phục hồi khi gián đoạn mạng (Priority: P1)

Người dùng tải lên một hoặc nhiều ảnh cùng lúc, theo dõi tiến trình phân tích trực tiếp theo thời gian thực (đang xử lý từng món, số thứ tự trên tổng số, chuyển đổi trạng thái khi xong từng món). Khi kết nối mạng bị gián đoạn, người dùng tải lại trang hoặc mở lại ứng dụng, hệ thống tự động đồng bộ lại trạng thái chính xác nhất từ máy chủ, không để bất kỳ món đồ nào bị treo vĩnh viễn ở trạng thái "Đang xử lý".

**Why this priority**: Quá trình phân tích AI diễn ra không đồng bộ trong thời gian từ 15 đến 40 giây. Nếu luồng thời gian thực bị ngắt sớm (ví dụ do đếm nhầm sự kiện bắt đầu là sự kiện kết thúc) hoặc không có cơ chế dự phòng khi rớt mạng, giao diện sẽ bị treo và người dùng mất niềm tin vào hệ thống.

**Independent Test**: Có thể kiểm thử độc lập bằng cách tải lên nhiều ảnh, quan sát luồng nhận sự kiện từ lúc bắt đầu xử lý đến khi từng món hoàn tất hoặc thất bại độc lập; thử tải lại trang giữa chừng và xác nhận trạng thái các món được cập nhật đúng với máy chủ sau tối đa 10 giây.

**Acceptance Scenarios**:

1. **Given** người dùng vừa tải lên danh sách ảnh, **When** từng món bắt đầu được đưa vào xử lý, **Then** hệ thống hiển thị chỉ báo "Đang xử lý" kèm thông tin tiến trình mà không ngắt kết nối theo dõi thời gian thực quá sớm.
2. **Given** một lượt tải lên gồm nhiều ảnh với kết quả khác nhau (một số thành công, một số lỗi, một số cần rà soát), **When** sự kiện thời gian thực trả về cho từng món, **Then** hệ thống cập nhật độc lập trạng thái của từng món đó trên giao diện mà không ảnh hưởng đến các món khác.
3. **Given** kết nối thời gian thực bị mất hoặc không nhận được sự kiện mới trong khoảng thời gian quy định, **When** người dùng ở trên trang hoặc quay lại trang tủ đồ, **Then** hệ thống tự động đồng bộ lại toàn bộ danh sách từ máy chủ để đưa tất cả món đồ về trạng thái thực tế cuối cùng.

---

### User Story 4 - Đồng bộ xử lý trạng thái phân tích sản phẩm cho nhãn hàng (Brand Portal) (Priority: P2)

Nhân viên nhãn hàng khi đăng tải sản phẩm lên cổng thông tin nhãn hàng có thể theo dõi rõ ràng các trạng thái phân tích: đang hoạt động (phân tích thành công), nháp chờ duyệt (cần rà soát danh mục), hoặc thất bại (lỗi phân tích). Đối với sản phẩm thất bại do ảnh không hợp lệ, hệ thống ngăn chặn thao tác chuyển đổi trạng thái thủ công thành hoạt động, yêu cầu nhãn hàng tải lại sản phẩm mới với hình ảnh đạt chuẩn.

**Why this priority**: Bảo vệ chất lượng danh mục sản phẩm thời trang của các nhãn hàng đối tác trên sàn, đảm bảo không có sản phẩm bị lỗi hiển thị hoặc thiếu thuộc tính phân loại được bày bán công khai.

**Independent Test**: Có thể kiểm thử độc lập trên cổng nhãn hàng bằng cách kiểm tra một sản phẩm đang ở trạng thái phân tích thất bại, xác nhận các nút chuyển trạng thái thủ công bị vô hiệu hóa/cảnh báo, và sản phẩm yêu cầu tạo mới hoặc thử lại tùy theo loại lỗi.

**Acceptance Scenarios**:

1. **Given** sản phẩm nhãn hàng có phân tích thất bại, **When** nhân viên nhãn hàng xem thông tin sản phẩm, **Then** hệ thống hiển thị rõ lý do thất bại và ngăn chặn đổi trạng thái sản phẩm sang "Đang hoạt động".
2. **Given** sản phẩm nhãn hàng ở trạng thái nháp chờ rà soát danh mục, **When** nhân viên chọn danh mục và kích hoạt phân tích lại, **Then** hệ thống gửi yêu cầu phân tích kèm danh mục và theo dõi kết quả thời gian thực của sản phẩm.

---

### Edge Cases

- Khi người dùng bấm nút "Thử lại" hoặc "Gửi phân tích lại" liên tục: hệ thống vô hiệu hóa nút ngay lập tức và hiển thị trạng thái đang gửi để chống gửi yêu cầu trùng lặp.
- Khi sự kiện hoàn tất đến trước khi màn hình kịp kết nối kênh thời gian thực: hệ thống phát hiện trạng thái đã cập nhật và hiển thị ngay kết quả mới mà không rơi vào trạng thái chờ vô hạn.
- Khi máy chủ trả về mã lý do lỗi lạ chưa được định nghĩa trước: hệ thống hiển thị thông báo lỗi thân thiện mặc định ("Không thể nhận diện trang phục, vui lòng thử lại hoặc tải ảnh khác"), tuyệt đối không hiển thị mã chuỗi thô hay làm vỡ giao diện.
- Khi người dùng xóa một món đồ đang ở trạng thái lỗi hoặc đang cần rà soát: hệ thống xác nhận và xóa món đồ ra khỏi danh sách ngay lập tức, hủy bỏ các tiến trình theo dõi thời gian thực liên quan đến món đồ đó.
- Ảnh gốc của trang phục luôn luôn hiển thị được trong thẻ món đồ và trang chi tiết kể cả khi AI phân tích thất bại hoặc đang chờ rà soát, giúp người dùng nhận biết món đồ để ra quyết định xử lý.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Hệ thống MUST hiển thị rõ ràng 4 trạng thái phân tích của từng món đồ trên giao diện tủ đồ và chi tiết món: Đang xử lý, Hoàn tất (sử dụng được), Cần rà soát (chờ chọn danh mục), và Phân tích thất bại.
- **FR-002**: Hệ thống MUST ánh xạ chính xác các mã lý do thất bại sang thông điệp tiếng Việt thân thiện với người dùng:
  - Mã ảnh không phải trang phục (`no_fashion_item_detected`): "Ảnh không phải trang phục — hãy tải ảnh đúng món đồ".
  - Mã ảnh nhiều món (`multiple_items_detected`): "Ảnh có nhiều món — tải ảnh khác".
  - Mã ảnh toàn thân (`full_body_outfit_detected`): "Ảnh toàn thân — tải ảnh cận một món".
  - Mã lỗi tạm thời (`analysis_temporary_error`): "Lỗi tạm thời — thử lại".
  - Mã vượt số lần thử lại (`auto_retry_exceeded`): "Đã thử nhiều lần — thử lại".
  - Mã lý do cần rà soát (`uncertain_category`): "AI chưa chắc danh mục — chọn danh mục rồi gửi phân tích lại".
  - Mã không xác định: thông báo mặc định thân thiện, không hiển thị mã kỹ thuật thô.
- **FR-003**: Đối với các món đồ thất bại vì ảnh không hợp lệ (ảnh không phải trang phục, ảnh nhiều món, ảnh toàn thân), hệ thống MUST ẩn hoặc vô hiệu hóa nút "Thử lại", đồng thời hướng dẫn người dùng tải ảnh khác hoặc xóa món đồ.
- **FR-004**: Đối với các món đồ thất bại vì lỗi tạm thời hoặc hết lượt thử tự động, hệ thống MUST hiển thị nút "Thử lại" cho phép người dùng kích hoạt phân tích lại trực tiếp.
- **FR-005**: Đối với các món đồ ở trạng thái "Cần rà soát", hệ thống MUST bắt buộc người dùng chọn một danh mục hợp lệ trước khi cho phép kích hoạt thao tác "Gửi phân tích lại".
- **FR-006**: Khi kích hoạt phân tích lại cho món đồ cần rà soát, hệ thống MUST truyền thông tin danh mục đã chọn kèm theo yêu cầu phân tích lại để máy chủ xử lý ở chế độ danh mục cố định.
- **FR-007**: Sau khi gửi phân tích lại cho món đồ cần rà soát, hệ thống MUST duy trì trạng thái chờ và lắng nghe kết quả thời gian thực để cập nhật đúng kết quả cuối cùng (thành công hoặc thất bại nếu ảnh không đạt), không được điều hướng giả định hoàn tất ngay lập tức.
- **FR-008**: Hệ thống MUST duy trì kết nối theo dõi thời gian thực xuyên suốt toàn bộ quá trình xử lý và chỉ đóng kết nối khi tất cả các món đồ thuộc phiên phân tích đã đạt trạng thái cuối cùng (hoàn tất, thất bại, hoặc cần rà soát) hoặc khi kết nối đóng từ phía máy chủ.
- **FR-009**: Hệ thống MUST có cơ chế đồng bộ dự phòng: khi không nhận được sự kiện mới sau một khoảng thời gian chờ hoặc khi tải lại trang, hệ thống tự động đối chiếu và cập nhật lại trạng thái mới nhất từ danh sách của máy chủ để không để món đồ nào kẹt ở "Đang xử lý".
- **FR-010**: Hệ thống MUST hiển thị ảnh gốc của món đồ rõ ràng trong mọi trạng thái phân tích để người dùng có đầy đủ ngữ cảnh quyết định hành động tiếp theo.
- **FR-011**: Hệ thống MUST cho phép người dùng xóa các món đồ đang ở trạng thái thất bại hoặc cần rà soát để dọn dẹp tủ đồ cá nhân.
- **FR-012**: Trên cổng thông tin nhãn hàng, hệ thống MUST thể hiện phân biệt giữa sản phẩm hoạt động, sản phẩm nháp cần rà soát danh mục, và sản phẩm phân tích thất bại; đồng thời chặn hành động kích hoạt thủ công sản phẩm khi đang ở trạng thái phân tích thất bại.

### Key Entities

- **Món đồ tủ đồ (Wardrobe Item)**: Món trang phục của người dùng tải lên, có trạng thái phân tích (Đang xử lý, Sử dụng được, Cần rà soát, Thất bại), mã lý do rà soát/lỗi, ảnh gốc và các thuộc tính thời trang liên quan.
- **Món hàng nhãn hàng (Brand Item)**: Sản phẩm do nhãn hàng đăng tải, có trạng thái nghiệp vụ (Hoạt động, Nháp chờ rà soát, Thất bại, Lưu trữ) và thông tin phân tích AI tương ứng.
- **Tác vụ phân tích (Analysis Task)**: Phiên xử lý phân tích AI được theo dõi thời gian thực qua mã tác vụ, truyền tải các sự kiện tiến trình và trạng thái cuối cùng của từng món đồ.
- **Lý do phân tích (Analysis Reason)**: Mã định danh lý do từ mô hình AI (như chưa chắc danh mục, nhiều món, toàn thân, không phải trang phục, lỗi tạm thời) quyết định hành vi cho phép trên giao diện người dùng.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% món đồ có kết quả phân tích thất bại hiển thị đúng câu thông điệp tiếng Việt thân thiện tương ứng với mã lý do thực tế của món đó.
- **SC-002**: 100% trường hợp ảnh không hợp lệ (không phải trang phục, nhiều món, toàn thân) không hiển thị nút "Thử lại", loại bỏ hoàn toàn các lần bấm thử lại bị máy chủ từ chối lỗi 400.
- **SC-003**: 100% món đồ ở trạng thái cần rà soát danh mục bắt buộc người dùng chọn danh mục hợp lệ trước khi cho phép gửi phân tích lại.
- **SC-004**: 100% lượt gửi phân tích lại từ trạng thái cần rà soát được theo dõi đầy đủ cho đến khi nhận kết quả thực tế, không có tình trạng tự động giả định thành công khi chưa có kết quả.
- **SC-005**: 0% món đồ bị treo vĩnh viễn ở trạng thái "Đang xử lý" trên giao diện khi phiên phân tích trên máy chủ đã kết thúc.
- **SC-006**: Người dùng có thể hoàn thành việc khắc phục hoặc dọn dẹp (thử lại, chọn danh mục, tải ảnh thay thế, hoặc xóa món) cho 100% các món đồ gặp sự cố phân tích.

## Assumptions

- Tài liệu hướng dẫn tích hợp frontend tại `specs\023-analyze-status-handling\frontend-guide.md` (thuộc kho lưu trữ backend) và bản cập nhật Delta 2026-10-01 là tài liệu tham chiếu chuẩn cho hành vi và hợp đồng trạng thái của tính năng này.
- Máy chủ đã triển khai đầy đủ các trạng thái và mã lý do trong đối tượng chi tiết trang phục, bao gồm mã mới `no_fashion_item_detected` và bỏ endpoint cũ `confirm-review`.
- Người dùng thao tác trên giao diện đã đăng nhập hợp lệ và có quyền sở hữu đối với các món đồ trong tủ đồ của mình hoặc sản phẩm trong thương hiệu của mình.
- Mọi thông báo và nhãn giao diện hiển thị cho người dùng cuối sử dụng ngôn ngữ tiếng Việt tự nhiên, lịch sự, không để lộ các thông số mã nguồn kỹ thuật nội bộ.
