# Feature Specification: 033 Fix PayOS Payment Flow

**Feature Branch**: `033-fix-payos-payment-flow`

**Created**: 2026-10-08

**Status**: Draft

**Input**: User description: "Bạn là agent implement code cho repo frontend Next.js (App Router, React 19, TanStack Query) tại thư mục `smart-wardrobe-fe`. Nhiệm vụ: sửa bug luồng thanh toán PayOS. CHỈ sửa frontend, TUYỆT ĐỐI không sửa backend (`smart-wardrobe-be`).

# Bug
Sau khi thanh toán PayOS thành công hoặc hủy, trình duyệt không quay về đúng trang:
- Luồng nạp ví: PayOS redirect đúng tới `/profile?code=...&cancel=...&status=...&orderCode=...` nhưng ngay sau đó trang bị đá sang trang đăng nhập.
- Luồng mua gói (VietQR ở `/pricing`): PayOS trả thẳng về trang chủ `https://closy.hycat.online/` (root).
- Không có UI thông báo thành công/hủy, không refresh số dư/gói sau khi về.

# Nguyên nhân gốc (đã điều tra kỹ, KHÔNG cần điều tra lại)
1. Cookie phiên `accessToken`/`refreshToken` do BE set với `SameSite=Strict` (xem `smart-wardrobe-be/services/account/internal/modules/identity/presentation/handler/auth_handler.go:162`, tương tự ở các handler login/refresh khác). PayOS redirect là cross-site top-level navigation nên browser KHÔNG gửi cookie Strict trong request đầu tiên. Vì vậy server component `src/app/(user)/profile/components/ProfileData.tsx:7-10` gọi `serverFetch('/me')` bị 401 → `redirect('/auth/login')`; client `src/components/providers/auth-provider.tsx:39-56` cũng push `/auth/login` khi query `/me` lỗi. Đây là lý do "về đúng path rồi bị đá đi". Chính BE đã ghi chú vấn đề này khi làm Google OAuth: `auth_handler.go:270-272` ("cross-site top-level navigation; Strict cookies are dropped in that context") và đã dùng Lax riêng cho Google callback.
2. Luồng mua gói không gửi return/cancel URL: `src/features/subscription/components/PricingCard.tsx:20-22` chỉ gửi `{ planSlug }`, nên BE fallback về config mặc định là root (`smart-wardrobe-be/configs/config.production.yaml:143-144`).
3. Phụ: BE có thể tái sử dụng link PayOS pending cũ thay vì tạo link mới (`services/account/internal/modules/subscription/application/usecase/purchase/checkout.go:39-43` + `checkout_helper.go:30-35`), link cũ giữ return URL cũ tối đa ~15 phút.

# Lý do chọn solution (bắt buộc tuân theo)
- Chủ dự án KHÔNG đồng ý đổi BE sang `SameSite=Lax` (lo ngại bảo mật) và KHÔNG muốn đụng BE.
- Điểm mấu chốt: `SameSite=Strict` chỉ chặn cookie ở cross-site request. Sau khi trang đích đầu tiên đã load xong (trong site), mọi XHR và điều hướng client-side tiếp theo đều là same-site → cookie Strict vẫn được gửi bình thường, phiên không hề mất.
- Vì vậy giải pháp là: cho PayOS trả về một trang kết quả CÔNG KHAI, KHÔNG gọi `/me` phía server (không dính SSR auth guard). Trang này render được kể cả khi request đầu thiếu cookie, sau đó client tự refetch (same-site) và điều hướng về đúng trang/tab.
- Không hardcode domain; dùng `window.location.origin` ở client.

# Việc cần làm
1. Mở rộng types tại `src/features/billing/types/index.ts`:
   - `DirectPurchaseReq`: thêm `returnUrl?: string; cancelUrl?: string;`
   - `TopUpReq`: thêm `returnUrl?: string; cancelUrl?: string;`
   - `PaymentLinkRes`: thêm `orderCode?: number;` (BE trả về field này).
2. `src/features/subscription/components/PricingCard.tsx` (`handlePurchaseDirect`, dòng 20-22): build URL
   `const resultUrl = \`${window.location.origin}/payment/result?flow=purchase&next=${encodeURIComponent('/pricing')}\`;`
   rồi gọi `purchaseDirect.mutate({ planSlug, returnUrl: resultUrl, cancelUrl: resultUrl })`.
3. `src/features/wallet/components/TopUpModal.tsx` (dòng 30-39): thay `window.location.href` ở `returnUrl`/`cancelUrl` bằng URL kết quả với `flow=topup&next=${encodeURIComponent('/profile?tab=wallet')}`.
4. `src/features/billing/components/TopupModal.tsx` + `src/features/billing/queries/billing.queries.ts`: truyền return/cancel URL tương tự (component này hiện không được import ở đâu, nhưng sửa cho đồng bộ hợp đồng API).
5. Tạo trang kết quả công khai (KHÔNG đặt trong route group `(user)`):
   - `src/app/payment/result/page.tsx`: server component bọc `<Suspense>` như pattern `src/app/(user)/profile/page.tsx:11-16`.
   - `src/app/payment/result/components/PaymentResultClient.tsx`: `'use client'`, dùng `useSearchParams` để đọc `code`, `cancel`, `status`, `orderCode`, `flow`, `next`.
     - `isSuccess = code === '00' && cancel !== 'true'`; `isCancelled = cancel === 'true' || status === 'CANCELLED'`; còn lại là đang xử lý/lỗi.
     - Khi success: invalidate + refetch các query key đang dùng trong repo: `['me']` (PROFILE_QUERY_KEY), `['wallet','balance']`, `['wallet','statements']`, `['subscription','me']`, `['subscription','quota']`. Poll ngắn (ví dụ 5 lần × 2s) vì webhook có thể tới trễ, hiển thị "Đang cập nhật...".
     - UI thành công/hủy dùng component sẵn có (`Button`, `Card`, icon `lucide-react`, theme hiện tại); hiển thị `orderCode`.
     - Nút "Tiếp tục": validate `next` phải `startsWith('/')` và không `startsWith('//')` (chặn open redirect), fallback `/profile?tab=wallet`; chỉ `router.replace(next)` SAU khi refetch xong (đảm bảo token đã được axios interceptor refresh nếu cần).
     - KHÔNG gọi `serverFetch`/`/me` phía server ở trang này.
6. Sync tab ví với URL tại `src/app/(user)/profile/components/ProfileClient.tsx`:
   - Khởi tạo `activeTab` từ `?tab=wallet` qua `useSearchParams` (Profile page đã có Suspense sẵn).
   - Khi đổi tab, cập nhật URL bằng `router.replace('/profile?tab=' + val, { scroll: false })` (giữ đơn giản, không phá state hiện tại).

# Ràng buộc
- Không sửa bất kỳ file nào trong `smart-wardrobe-be`; không đổi SameSite, không thêm endpoint.
- Không hardcode `closy.hycat.online` hay localhost; chỉ dùng `window.location.origin` trong client component/handler.
- API dùng axios `baseURL: '/api/v1'` qua Next rewrite (`src/lib/axios.ts`), giữ nguyên.
- Theo convention repo: không thêm comment vào code; theo style hiện có; path tương đối trong báo cáo.
- Lưu ý khi test: nếu tài khoản còn link mua gói pending cũ, BE có thể trả lại link cũ (return URL cũ) tối đa ~15 phút; hãy test với giao dịch mới hoặc chờ link hết hạn.

# Verify
- Chạy: `npm run lint`, `npx tsc --noEmit`, `npm test` (jest) — tất cả phải pass.
- Test tay (dev, PayOS sandbox): 
  1) Nạp ví: success → quay về `/payment/result?flow=topup...` → hiện thành công → bấm tiếp tục → mở `/profile?tab=wallet` đúng tab, số dư cập nhật.
  2) Nạp ví: cancel → hiện trạng thái hủy, không báo thành công.
  3) Mua gói: success → về `/payment/result?flow=purchase...` → tiếp tục → `/pricing`, gói hiện tại cập nhật; cancel → trạng thái hủy.
  4) Kiểm tra không còn bị đá về `/auth/login` và không về root.

# Definition of Done
- Mọi luồng PayOS (mua gói, nạp ví) đều gửi `returnUrl`/`cancelUrl` tới `/payment/result` với `flow` và `next` phù hợp.
- Trang `/payment/result` hoạt động cho cả success và cancel, không phụ thuộc SSR auth, refresh đúng dữ liệu sau webhook.
- Quay về đúng trang/tab; lint + typecheck + test pass; không có thay đổi ngoài `smart-wardrobe-fe`."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Nạp tiền vào ví qua cổng thanh toán và xác nhận số dư mới (Priority: P1)

Là một người dùng Smart Wardrobe muốn nạp tiền vào ví cá nhân, tôi muốn sau khi hoàn tất quét mã QR thanh toán trên cổng PayOS, tôi được tự động đưa về trang thông báo kết quả rõ ràng và số dư ví trong tài khoản được cập nhật mới nhất, thay vì bị đá sang trang đăng nhập hay mất phiên đăng nhập.

**Why this priority**: Lỗi hiện tại khiến người dùng sau khi thanh toán nạp tiền bị đăng xuất/chuyển hướng sang trang đăng nhập do cơ chế cookie phiên cross-site, gây cảm giác hoang mang và lo ngại mất tiền, ảnh hưởng nghiêm trọng tới niềm tin của khách hàng.

**Independent Test**: Đăng nhập tài khoản, mở modal nạp tiền tại trang Hồ sơ tab Ví, nhập số tiền hợp lệ và chuyển sang cổng thanh toán PayOS; thực hiện thanh toán thành công và quan sát trình duyệt quay về trang kết quả nạp tiền, hiển thị thông báo thành công cùng mã đơn hàng; bấm Tiếp tục để trở về tab Ví với số dư mới đã được cập nhật.

**Acceptance Scenarios**:

1. **Given** người dùng đang đăng nhập và mở hộp thoại nạp tiền vào ví, **When** người dùng xác nhận số tiền nạp và chuyển đến cổng thanh toán PayOS, **Then** yêu cầu tạo thanh toán mang theo địa chỉ trả về trỏ tới trang kết quả công khai với luồng nạp tiền và đường dẫn tiếp theo là tab Ví trên trang hồ sơ.
2. **Given** người dùng hoàn tất thanh toán thành công trên cổng PayOS, **When** cổng thanh toán chuyển hướng người dùng trở lại ứng dụng, **Then** người dùng nhìn thấy trang kết quả thông báo giao dịch thành công kèm mã đơn hàng mà không bị chuyển hướng tới trang đăng nhập.
3. **Given** người dùng ở trên trang kết quả thanh toán thành công, **When** dữ liệu giao dịch được xử lý, **Then** hệ thống tự động đồng bộ lại số dư ví và lịch sử giao dịch ở phía trình duyệt, người dùng bấm "Tiếp tục" sẽ được đưa thẳng tới trang hồ sơ cá nhân với tab Ví đang được mở và số dư mới đã phản ánh.

---

### User Story 2 - Đăng ký mua gói hội viên trực tiếp và quay về trang bảng giá (Priority: P1)

Là một người dùng muốn nâng cấp gói dịch vụ hội viên (Pro/VIP) bằng cách quét mã VietQR trên trang Bảng giá, tôi muốn sau khi chuyển khoản thành công, tôi được chuyển về trang kết quả thanh toán và quay lại trang Bảng giá với quyền lợi gói đã được kích hoạt, thay vì bị điều hướng về trang chủ một cách vô định.

**Why this priority**: Luồng mua gói trực tiếp hiện tại không gửi URL trả về khiến hệ thống mặc định đưa người dùng về trang chủ (root), không có thông báo xác nhận trạng thái đơn hàng và không làm mới thông tin gói dịch vụ.

**Independent Test**: Đăng nhập tài khoản, truy cập trang Bảng giá (`/pricing`), chọn thanh toán trực tiếp một gói trả phí, quét mã thanh toán thành công trên PayOS; xác nhận trình duyệt chuyển về trang kết quả mua gói với thông báo thành công và mã giao dịch; nhấn Tiếp tục để quay lại trang Bảng giá với nhãn gói hiện tại đã được nâng cấp.

**Acceptance Scenarios**:

1. **Given** người dùng đang xem các gói dịch vụ tại trang Bảng giá, **When** người dùng nhấn nút nâng cấp gói qua thanh toán trực tiếp, **Then** yêu cầu tạo liên kết gửi kèm địa chỉ quay về và hủy trỏ tới trang kết quả với tham số luồng mua gói và trang đích là trang Bảng giá.
2. **Given** người dùng thanh toán gói thành công trên PayOS, **When** trình duyệt được điều hướng về hệ thống, **Then** trang kết quả hiển thị thông tin thanh toán thành công cùng mã đơn hàng tương ứng.
3. **Given** người dùng ở trang kết quả sau khi mua gói thành công, **When** người dùng nhấn "Tiếp tục", **Then** hệ thống điều hướng người dùng quay lại trang Bảng giá và giao diện hiển thị đúng trạng thái gói hội viên mới cùng hạn ngạch sử dụng đã được làm mới.

---

### User Story 3 - Xử lý thông báo khi hủy hoặc thất bại trong giao dịch thanh toán (Priority: P2)

Là một người dùng khi đang ở cổng thanh toán nếu quyết định bấm nút Hủy hoặc giao dịch gặp trục trặc, tôi muốn được chuyển về trang kết quả với thông báo hủy/thất bại rõ ràng, không bị thông báo sai là thành công và có nút điều hướng để tôi quay lại thao tác tiếp tục một cách an toàn.

**Why this priority**: Giúp người dùng nắm bắt chính xác trạng thái giao dịch, tránh hiểu lầm rằng tiền đã bị trừ hoặc đơn hàng đã hoàn tất khi thực tế giao dịch chưa thành công.

**Independent Test**: Bắt đầu một giao dịch nạp ví hoặc mua gói, tại cổng PayOS bấm nút "Hủy thanh toán", xác nhận trang web chuyển về trang kết quả với biểu tượng và thông điệp hủy giao dịch, không kích hoạt làm mới dữ liệu cộng tiền/gói, và nút điều hướng đưa người dùng về trang trước đó một cách mượt mà.

**Acceptance Scenarios**:

1. **Given** người dùng hủy thanh toán trên cổng PayOS (tham số trả về có `cancel=true` hoặc trạng thái `CANCELLED`), **When** trình duyệt quay về trang kết quả, **Then** giao diện hiển thị trạng thái giao dịch đã bị hủy kèm mã đơn hàng, không báo thành công.
2. **Given** người dùng xem trang kết quả hủy giao dịch, **When** người dùng nhấn nút "Tiếp tục" hoặc quay lại, **Then** hệ thống chuyển người dùng về đúng trang ban đầu theo ngữ cảnh an toàn đã định trước.
3. **Given** cổng thanh toán trả về mã lỗi hoặc trạng thái không xác định, **When** hiển thị trên trang kết quả, **Then** giao diện hiển thị thông báo trạng thái đang xử lý hoặc không thành công và khuyến nghị người dùng kiểm tra lại hoặc liên hệ hỗ trợ.

---

### User Story 4 - Điều hướng và đồng bộ trạng thái tab Ví trên trang Hồ sơ (Priority: P2)

Là một người dùng truy cập trang hồ sơ cá nhân hoặc quay lại từ luồng thanh toán, tôi muốn đường dẫn URL phản ánh chính xác tab đang mở (như tab Ví `?tab=wallet`), và khi chuyển đổi qua lại giữa các tab thì URL được cập nhật mượt mà để tôi có thể chia sẻ liên kết hoặc quay lại đúng tab thông qua lịch sử trình duyệt.

**Why this priority**: Đảm bảo luồng điều hướng sau khi thanh toán đưa người dùng đến đúng vị trí tab Ví mà người dùng vừa thao tác, nâng cao tính trực quan và giảm thiểu số lần nhấn chuột không cần thiết.

**Independent Test**: Truy cập trực tiếp đường dẫn `/profile?tab=wallet` trên trình duyệt, quan sát trang hồ sơ hiển thị ngay nội dung tab Ví; sau đó nhấn chuyển sang tab Tổng quan, quan sát URL cập nhật tương ứng mà không làm gián đoạn hay tải lại toàn bộ trang.

**Acceptance Scenarios**:

1. **Given** người dùng mở đường dẫn hồ sơ có tham số `?tab=wallet`, **When** trang tải xong, **Then** giao diện hiển thị mặc định nội dung tab Ví thay vì tab Tổng quan.
2. **Given** người dùng đang ở trang hồ sơ cá nhân, **When** người dùng chuyển đổi qua lại giữa các thẻ thông tin, **Then** địa chỉ URL trên trình duyệt được cập nhật tương ứng mà không kích hoạt tải lại toàn bộ trang (full reload).

---

### Edge Cases

- **Webhook của cổng thanh toán đến trễ hơn trình duyệt**: Khi người dùng được chuyển hướng về trang kết quả trước khi máy chủ nhận và xử lý xong webhook từ PayOS, hệ thống tự động thực hiện cơ chế kiểm tra định kỳ nhiều lần (polling ngắn hạn) và hiển thị thông báo "Đang cập nhật...", đảm bảo người dùng thấy dữ liệu mới nhất trước khi bấm tiếp tục.
- **Tham số điều hướng đích chứa liên kết ngoài độc hại (Open Redirect)**: Nếu tham số `next` bị kẻ xấu can thiệp hoặc không bắt đầu bằng dấu gạch chéo `/` hợp lệ (hoặc bắt đầu bằng `//`), hệ thống tự động từ chối và sử dụng đường dẫn an toàn mặc định (`/profile?tab=wallet`).
- **Trình duyệt gửi yêu cầu Cross-Site không mang cookie phiên Strict**: Khi chuyển hướng từ miền cổng thanh toán về trang web, yêu cầu đầu tiên bị lược bỏ cookie phiên theo chính sách bảo mật trình duyệt; trang kết quả được thiết kế công khai không phụ thuộc xác thực ở tầng máy chủ (SSR), cho phép tải trang thành công và để trình duyệt thực hiện các truy vấn cùng miền (same-site) sau đó có đầy đủ cookie phiên.
- **Cổng thanh toán tái sử dụng liên kết chờ cũ**: Trong trường hợp người dùng từng tạo một giao dịch đang chờ trong vòng 15 phút trước đó, cổng thanh toán có thể trả lại liên kết cũ; hệ thống xử lý trang kết quả linh hoạt dựa trên các tham số trả về thực tế.
- **Người dùng truy cập trực tiếp trang kết quả mà không có tham số**: Hiển thị trạng thái thông báo không tìm thấy thông tin giao dịch hợp lệ và cung cấp nút điều hướng quay về trang tổng quan an toàn.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Hệ thống MUST bổ sung các trường thông tin đường dẫn trả về (`returnUrl`) và đường dẫn hủy (`cancelUrl`) vào các cấu trúc dữ liệu yêu cầu nạp tiền và yêu cầu mua gói trực tiếp.
- **FR-002**: Khi người dùng bắt đầu giao dịch nạp tiền vào ví, hệ thống MUST tạo đường dẫn trả về và đường dẫn hủy trỏ tới trang kết quả công khai với tham số định danh luồng nạp tiền (`flow=topup`) và đường dẫn tiếp theo trỏ tới tab Ví của hồ sơ cá nhân.
- **FR-003**: Khi người dùng bắt đầu giao dịch mua gói hội viên trực tiếp, hệ thống MUST tạo đường dẫn trả về và đường dẫn hủy trỏ tới trang kết quả công khai với tham số định danh luồng mua gói (`flow=purchase`) và đường dẫn tiếp theo trỏ tới trang bảng giá.
- **FR-004**: Tất cả các đường dẫn chuyển hướng gửi tới cổng thanh toán MUST được xây dựng động dựa trên địa chỉ gốc của trình duyệt (`window.location.origin`), không dùng địa chỉ cố định.
- **FR-005**: Hệ thống MUST cung cấp trang kết quả thanh toán độc lập nằm ngoài nhóm đường dẫn yêu cầu xác thực phía máy chủ, đảm bảo tải trang thành công trong các yêu cầu điều hướng liên miền (cross-site navigation).
- **FR-006**: Trang kết quả thanh toán MUST tiếp nhận và phân tích các tham số trạng thái từ cổng thanh toán, bao gồm mã phản hồi (`code`), cờ hủy (`cancel`), trạng thái (`status`), mã đơn hàng (`orderCode`), loại luồng (`flow`) và đường dẫn chuyển hướng tiếp theo (`next`).
- **FR-007**: Hệ thống MUST xác định chính xác trạng thái giao dịch: thành công khi mã phản hồi là thành công (`code === '00'`) và không bị hủy (`cancel !== 'true'`); đã hủy khi có tín hiệu hủy (`cancel === 'true'` hoặc `status === 'CANCELLED'`); các trường hợp còn lại xác định là lỗi hoặc đang xử lý.
- **FR-008**: Khi giao dịch thành công, trang kết quả MUST tự động yêu cầu trình duyệt cập nhật lại toàn bộ các bộ nhớ đệm dữ liệu liên quan: thông tin tài khoản người dùng, số dư ví, sao kê ví, trạng thái gói hội viên và hạn ngạch sử dụng dịch vụ.
- **FR-009**: Khi giao dịch thành công, hệ thống MUST kích hoạt cơ chế kiểm tra định kỳ ngắn hạn (5 lần cách nhau 2 giây) trong lúc hiển thị trạng thái đang cập nhật để đón nhận kết quả xử lý webhook từ máy chủ.
- **FR-010**: Trang kết quả MUST hiển thị giao diện thông báo trực quan theo đúng phong cách thiết kế hiện tại, bao gồm biểu tượng trạng thái, tiêu đề thông báo, giải thích chi tiết, mã đơn hàng và nút hành động tiếp tục.
- **FR-011**: Nút hành động tiếp tục trên trang kết quả MUST kiểm tra tính hợp lệ của đường dẫn tiếp theo (bắt buộc bắt đầu bằng `/` và không bắt đầu bằng `//`), chỉ cho phép chuyển hướng sau khi hoàn tất chu kỳ cập nhật dữ liệu.
- **FR-012**: Trang hồ sơ cá nhân MUST đọc tham số `?tab=wallet` từ đường dẫn để kích hoạt tab Ví ngay khi người dùng truy cập, đồng thời cập nhật địa chỉ trên thanh trình duyệt tương ứng khi người dùng chuyển đổi tab mà không tải lại toàn bộ trang.

### Key Entities

- **PaymentCallbackParams**: Tập hợp các tham số truy vấn nhận được từ cổng thanh toán khi chuyển hướng về, bao gồm mã kết quả giao dịch, trạng thái hủy, trạng thái thanh toán, mã đơn hàng trên hệ thống thanh toán, loại luồng nghiệp vụ và đường dẫn tiếp tục.
- **PaymentResultState**: Trạng thái hiển thị giao diện của trang kết quả (Thành công, Đã hủy, Đang cập nhật, Thất bại) kèm theo thông tin chi tiết giao dịch để người dùng theo dõi.
- **BillingRequestPayload**: Dữ liệu gửi từ ứng dụng sang máy chủ để khởi tạo giao dịch thanh toán, bao gồm định danh gói hoặc số tiền nạp, kèm hai địa chỉ URL phản hồi (khi thành công và khi hủy).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% các giao dịch nạp tiền vào ví và mua gói dịch vụ từ cổng PayOS chuyển hướng người dùng về đúng trang kết quả, loại bỏ hoàn toàn tình trạng bị đá sang trang đăng nhập hoặc rơi về trang chủ.
- **SC-002**: Thời gian hiển thị giao diện kết quả giao dịch và mã đơn hàng cho người dùng ngay sau khi trở về từ cổng thanh toán đạt dưới 1 giây.
- **SC-003**: 100% các giao dịch nạp ví thành công phản ánh đúng số dư ví mới trên giao diện sau khi người dùng nhấn nút tiếp tục trở về tab Ví.
- **SC-004**: 100% các giao dịch mua gói dịch vụ thành công hiển thị đúng trạng thái gói và hạn ngạch mới trên giao diện sau khi người dùng nhấn tiếp tục trở về trang Bảng giá.
- **SC-005**: 100% các trường hợp hủy giao dịch hoặc thanh toán thất bại hiển thị đúng trạng thái tương ứng, tuyệt đối không phát sinh thông báo thành công sai lệch.
- **SC-006**: 100% các đường dẫn điều hướng sau thanh toán được kiểm tra an toàn, loại bỏ hoàn toàn rủi ro chuyển hướng ra trang ngoài không mong muốn.

## Assumptions

- Phiên đăng nhập của người dùng vẫn còn hợp lệ trên thiết bị tại thời điểm thực hiện giao dịch (chỉ bị trình duyệt tạm thời chặn gửi cookie trên request cross-site đầu tiên).
- Cổng thanh toán PayOS giữ nguyên định dạng tham số truy vấn chuẩn (`code`, `cancel`, `status`, `orderCode`) khi thực hiện chuyển hướng người dùng trở lại hệ thống.
- Máy chủ backend xử lý các thông báo thanh toán (webhook) một cách bất đồng bộ trong vòng từ 1 đến 5 giây sau khi giao dịch hoàn tất.
- Toàn bộ thay đổi và xử lý luồng được thực hiện độc lập tại tầng giao diện ứng dụng web frontend, tuân thủ nghiêm ngặt việc giữ nguyên mã nguồn và cấu hình máy chủ backend.
