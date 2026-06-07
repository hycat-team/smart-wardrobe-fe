import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileBottomNav } from "@/components/layout/mobile-nav";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col md:flex-row bg-background font-sans text-foreground">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 pb-[72px] md:pb-0 relative">
        {/* Page Content */}
        <div className="flex-1 px-4 md:px-8 py-6 md:py-8 max-w-[1600px] w-full mx-auto">
          {children}
        </div>
      </main>
      <MobileBottomNav />
    </div>
  );
}

