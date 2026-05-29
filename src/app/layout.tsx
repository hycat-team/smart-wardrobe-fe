import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import QueryProvider from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeController } from "@/components/providers/theme-controller";
import { AuthProvider } from "@/components/providers/auth-provider";

const cormorant = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Smart Wardrobe",
  description: "Your digital fashion stylist",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${cormorant.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <ThemeController>
            <AuthProvider>
              <Suspense fallback={null}>
                {children}
              </Suspense>
              <Toaster position="top-right" richColors />
            </AuthProvider>
          </ThemeController>
        </QueryProvider>
      </body>
    </html>
  );
}

