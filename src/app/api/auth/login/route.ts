import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cleanBaseUrl = API_URL?.replace(/^'|'$/g, "")?.replace(/^"|"$/g, "");

    const response = await fetch(`${cleanBaseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // Extract token more robustly
    let token = null;
    let refreshToken = null;

    if (typeof data === "string") {
      token = data;
    } else if (data && typeof data === "object") {
      // Find token at root
      token = data.accessToken || data.token || data.access_token || data.jwt || data.jwtToken;
      refreshToken = data.refreshToken || data.refresh_token;

      // Find token in nested objects (like data.data or data.payload)
      if (!token) {
        for (const key in data) {
          if (data[key] && typeof data[key] === "object") {
            token =
              data[key].accessToken ||
              data[key].token ||
              data[key].access_token ||
              data[key].jwt ||
              data[key].jwtToken;
            refreshToken = data[key].refreshToken || data[key].refresh_token;
            if (token) break;
          }
        }
      }
    }

    // Check setCookies to find token if not in body
    const setCookies = response.headers.getSetCookie ? response.headers.getSetCookie() : [];
    if (setCookies && setCookies.length > 0) {
      for (const cookieStr of setCookies) {
        if (!token && cookieStr.includes("accessToken=")) {
          const match = cookieStr.match(/accessToken=([^;]+)/);
          if (match && match[1]) token = match[1];
        }
        if (!refreshToken && cookieStr.includes("refreshToken=")) {
          const match = cookieStr.match(/refreshToken=([^;]+)/);
          if (match && match[1]) refreshToken = match[1];
        }
      }
    }

    let isAdmin = false;
    if (token) {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = Buffer.from(base64, "base64").toString("utf8");
        const payload = JSON.parse(jsonPayload);
        const role = payload?.role || payload?.roles?.[0] || "";
        isAdmin = role.includes("ADMIN");
      } catch (e) {
        console.error("Failed to parse JWT in login proxy", e);
      }
    }

    const responseData = typeof data === "object" ? { ...data, isAdmin } : { data, isAdmin };
    if (token && !responseData.accessToken) {
      responseData.accessToken = token;
    }

    const res = NextResponse.json(responseData);

    if (token) {
      res.cookies.set("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
      });
    }

    if (refreshToken) {
      res.cookies.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return res;
  } catch (error) {
    console.error("Login Proxy Error:", error);
    return NextResponse.json({ message: "Lỗi máy chủ nội bộ" }, { status: 500 });
  }
}
