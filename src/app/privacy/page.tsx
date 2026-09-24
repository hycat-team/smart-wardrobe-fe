import type { Metadata } from "next";
import Link from "next/link";

// Trang công khai — không yêu cầu đăng nhập (middleware không redirect).
// URL dùng cho Store listing / Play Console: https://closy.hycat.online/privacy
// Nội dung đồng bộ với mobile: lib/features/profile/presentation/privacy_policy_screen.dart
export const metadata: Metadata = {
  title: "Chính sách bảo mật | Closy",
  description:
    "Chính sách bảo mật của Smart Wardrobe (Closy): dữ liệu thu thập, cách sử dụng, chia sẻ và quyền của bạn.",
};

const SUPPORT_EMAIL = "hycat.support@gmail.com";

const sections: { title: string; bullets: string[]; note?: string }[] = [
  {
    title: "1. Dữ liệu chúng tôi thu thập",
    bullets: [
      "Thông tin tài khoản: email, tên, thông tin hồ sơ do bạn cung cấp.",
      "Nội dung của bạn: ảnh trang phục tải lên, dữ liệu tủ đồ và outfit.",
      "Ảnh từ camera/thư viện: chỉ khi bạn chủ động chụp hoặc chọn ảnh để thêm vào tủ đồ.",
      "Thông tin thiết bị và kỹ thuật cần thiết để vận hành app.",
    ],
    note: "Chúng tôi không thu thập vị trí của bạn. App không tích hợp SDK quảng cáo/phân tích của bên thứ ba.",
  },
  {
    title: "2. Cách chúng tôi dùng dữ liệu",
    bullets: [
      "Cung cấp tính năng: quản lý tủ đồ, gợi ý phối đồ, đồng bộ tài khoản.",
      "Lưu trữ ảnh qua hạ tầng lưu trữ đám mây (Cloudinary) và máy chủ của đội.",
      "Bảo mật: mọi dữ liệu truyền qua mạng đều được mã hóa (HTTPS).",
    ],
  },
  {
    title: "3. Chia sẻ dữ liệu",
    bullets: [
      "Chúng tôi không bán dữ liệu của bạn.",
      "Dữ liệu chỉ được xử lý bởi máy chủ của đội và nhà cung cấp hạ tầng lưu ảnh (Cloudinary).",
    ],
  },
  {
    title: "4. Quyền của bạn",
    bullets: [
      "Yêu cầu xem, sửa hoặc xóa dữ liệu tài khoản qua email hỗ trợ bên dưới.",
      "Gỡ cài đặt app không tự động xóa dữ liệu máy chủ — hãy gửi yêu cầu xóa nếu bạn muốn xóa toàn bộ.",
    ],
  },
  {
    title: "5. Thời gian lưu trữ",
    bullets: [
      "Dữ liệu được lưu cho đến khi bạn xóa tài khoản hoặc gửi yêu cầu xóa.",
      "Sau khi xóa, ảnh và dữ liệu tủ đồ của bạn bị gỡ khỏi máy chủ; bản sao lưu kỹ thuật (nếu có) được xóa cuốn chiếu trong vòng 30 ngày.",
    ],
  },
  {
    title: "6. Trẻ em",
    bullets: [
      "App không dành cho trẻ em dưới 13 tuổi. Người dưới 13 tuổi chỉ được dùng app dưới sự giám sát của phụ huynh hoặc người giám hộ.",
    ],
  },
  {
    title: "7. Thay đổi chính sách",
    bullets: [
      "Khi chính sách thay đổi, chúng tôi cập nhật tại trang này kèm ngày hiệu lực mới. Thay đổi quan trọng được thông báo trong app trước khi áp dụng.",
    ],
  },
  {
    title: "8. Liên hệ",
    bullets: [
      `Mọi câu hỏi về chính sách này, vui lòng liên hệ: ${SUPPORT_EMAIL}.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-10">
      <Link href="/" className="text-sm text-muted-foreground hover:underline">
        ← Về trang chủ Closy
      </Link>
      <h1 className="mt-4 text-3xl font-bold">Chính sách bảo mật</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Smart Wardrobe (Closy) tôn trọng và bảo vệ dữ liệu cá nhân của bạn.
        Chính sách này mô tả những dữ liệu chúng tôi thu thập, cách sử
        dụng và quyền của bạn.
      </p>
      <p className="mt-1 text-xs italic text-muted-foreground">
        Cập nhật: tháng 9/2026.
      </p>

      <div className="mt-6 space-y-4">
        {sections.map((s) => (
          <section
            key={s.title}
            className="rounded-2xl border bg-card p-5 shadow-sm"
          >
            <h2 className="text-lg font-semibold">{s.title}</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed">
              {s.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            {s.note && (
              <p className="mt-3 text-xs italic leading-relaxed text-muted-foreground">
                {s.note}
              </p>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
