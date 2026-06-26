import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

// Hàm giải mã JWT Token (Base64) ở môi trường Edge Runtime
function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.log(e);
    return null;
  }
}

// Kiểm tra xem token còn hạn không (trước 10 giây để an toàn)
function isTokenExpired(token: string) {
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp <= currentTime + 10;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const headersToForward = new Headers(request.headers);
  let isRefreshFailed = false;
  let newAccessToken = "";
  let newRefreshToken = "";

  // 1. CHẶN VÀ KIỂM TRA HẠN TOKEN
  // Bỏ qua route refresh-token để tránh việc middleware và route handler cùng gọi backend 2 lần
  if (
    (!accessToken || isTokenExpired(accessToken)) &&
    refreshToken &&
    !pathname.includes("/auth/refresh-token")
  ) {
    try {
      // Gọi API refresh token tới Backend
      const refreshRes = await fetch(`${BACKEND_URL}/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `refreshToken=${refreshToken}`,
        },
      });

      if (refreshRes.ok) {
        // Thử lấy token từ JSON body
        try {
          const data = await refreshRes.json();
          if (data) {
            if (typeof data === "string") {
              newAccessToken = data;
            } else if (typeof data === "object") {
              newAccessToken =
                data.accessToken || data.token || data.access_token || data.jwt || data.jwtToken;
              newRefreshToken = data.refreshToken || data.refresh_token;

              if (!newAccessToken) {
                for (const key in data) {
                  if (data[key] && typeof data[key] === "object") {
                    newAccessToken =
                      data[key].accessToken ||
                      data[key].token ||
                      data[key].access_token ||
                      data[key].jwt ||
                      data[key].jwtToken;
                    newRefreshToken =
                      newRefreshToken || data[key].refreshToken || data[key].refresh_token;
                    if (newAccessToken) break;
                  }
                }
              }
            }
          }
        } catch (e) {
          // Bỏ qua nếu không phải JSON
        }

        // Parse từ Cookie trả về từ Backend (nếu Backend dùng Set-Cookie)
        const rawCookies = refreshRes.headers.getSetCookie();
        if (rawCookies && rawCookies.length > 0) {
          for (const cookieStr of rawCookies) {
            const [nameValue] = cookieStr.split(";");
            const [name, ...valueParts] = nameValue.split("=");
            const value = valueParts.join("=");
            if (name.trim() === "accessToken") newAccessToken = value.trim();
            if (name.trim() === "refreshToken") newRefreshToken = value.trim();
          }
        }

        if (newAccessToken) {
          accessToken = newAccessToken; // Cập nhật token hiện tại

          // Ghi đè header Cookie để Server Components (page.tsx) đằng sau nhận token mới
          const updatedCookies = request.cookies.getAll().map((c) => {
            if (c.name === "accessToken") return `accessToken=${newAccessToken}`;
            if (c.name === "refreshToken" && newRefreshToken)
              return `refreshToken=${newRefreshToken}`;
            return `${c.name}=${c.value}`;
          });

          // Nếu chưa có trong header cũ thì push thêm vào
          if (!request.cookies.has("accessToken"))
            updatedCookies.push(`accessToken=${newAccessToken}`);
          if (newRefreshToken && !request.cookies.has("refreshToken"))
            updatedCookies.push(`refreshToken=${newRefreshToken}`);

          headersToForward.set("cookie", updatedCookies.join("; "));
        } else {
          // Backend trả về OK nhưng không parse được token -> Fail
          isRefreshFailed = true;
        }
      } else {
        // Backend trả về lỗi (VD: 401) -> Refresh token cũng đã chết
        isRefreshFailed = true;
      }
    } catch (error) {
      console.error("Middleware refresh token error:", error);
      isRefreshFailed = true;
    }
  }

  // 2. XỬ LÝ NẾU REFRESH THẤT BẠI
  if (isRefreshFailed) {
    // Nếu là API Proxy Request (Client đang gọi)
    if (pathname.startsWith("/api/v1/")) {
      const errorRes = new NextResponse(
        JSON.stringify({ message: "Session expired", detail: "4011" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
      errorRes.cookies.delete("accessToken");
      errorRes.cookies.delete("refreshToken");
      return errorRes;
    }
    // Nếu là Page Request
    else {
      // Không tự động redirect ở middleware để tránh ảnh hưởng các trang public (landing page).
      const response = NextResponse.next({
        request: { headers: headersToForward },
      });
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      return response;
    }
  }

  // 3. ĐIỀU HƯỚNG REQUEST (PROXY HOẶC NEXT)
  let finalResponse = NextResponse.next({
    request: { headers: headersToForward },
  });

  // 4. GẮN COOKIE MỚI VÀO RESPONSE ĐỂ BROWSER LƯU LẠI
  if (newAccessToken) {
    finalResponse.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });
  }

  if (newRefreshToken) {
    finalResponse.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }

  return finalResponse;
}

export const config = {
  matcher: ["/api/v1/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
};
