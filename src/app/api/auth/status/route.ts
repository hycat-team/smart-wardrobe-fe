import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const hasToken = request.cookies.has("accessToken");
  return NextResponse.json({ hasToken });
}
