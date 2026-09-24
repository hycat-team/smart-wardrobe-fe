import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import QueryProvider from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeController } from "@/components/providers/theme-controller";
import { AuthProvider } from "@/components/providers/auth-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Closy | AI Fashion Stylist — Tủ Đồ Thông Minh",
  description: "Closy - Trợ lý thời trang AI và quản lý tủ đồ thông minh của bạn.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/brand/logo-only.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <ThemeController>
            <AuthProvider>
              <TooltipProvider>
                <Suspense fallback={null}>{children}</Suspense>
              </TooltipProvider>
              <Toaster position="bottom-right" duration={2000} />
            </AuthProvider>
          </ThemeController>
        </QueryProvider>
      </body>
    </html>
  );
}
