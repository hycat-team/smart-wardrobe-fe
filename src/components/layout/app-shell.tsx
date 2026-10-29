import { MobileBottomNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { GlobalAIChat } from "@/components/chat/GlobalAIChat";
import { BrandRedirector } from "@/app/(user)/components/BrandRedirector";

interface AppShellProps {
  children: React.ReactNode;
  withBrandRedirector?: boolean;
}

export function AppShell({ children, withBrandRedirector = false }: AppShellProps) {
  return (
    <div className="min-h-dvh flex flex-col md:flex-row bg-background font-sans text-foreground">
      {withBrandRedirector && <BrandRedirector />}
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 pb-[72px] md:pb-0 relative">
        <div className="flex-1 w-full flex flex-col">{children}</div>
      </main>
      <MobileBottomNav />
      <GlobalAIChat />
    </div>
  );
}
