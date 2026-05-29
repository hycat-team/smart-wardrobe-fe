import { GuestHeader } from "@/components/layout/guest-header";

export default function GuestLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col bg-background font-sans text-foreground relative">
      <GuestHeader />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}

