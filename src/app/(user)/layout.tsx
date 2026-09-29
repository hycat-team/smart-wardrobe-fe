import { MobileBottomNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { GlobalAIChat } from "@/components/chat/GlobalAIChat";
import { GlobalCartDrawer } from "@/components/cart/GlobalCartDrawer";
import { BrandRedirector } from "./components/BrandRedirector";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col md:flex-row bg-background font-sans text-foreground">
      <BrandRedirector />
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 pb-[72px] md:pb-0 relative">
        {/* <Topbar /> */}
        {/* Page Content */}
        <div className="flex-1 w-full flex flex-col">
          {children}
        </div>
      </main>
      <MobileBottomNav />
      <GlobalAIChat />
      <GlobalCartDrawer />
    </div>
  );
}
