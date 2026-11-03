"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Palette } from "lucide-react";

/**
 * Final onboarding step.
 *
 * Style preferences are NOT collected here: personalization is a membership entitlement, so the style
 * profile lives in its own screen (`/style-profile`) and is reachable at any time from the sidebar and
 * the profile page. Keeping this step free of style pickers is what makes registration short.
 */
export function PreferencesClient() {
  const router = useRouter();

  const handleFinish = () => {
    router.push("/wardrobe/upload");
  };

  return (
    <div className="flex min-h-dvh w-full bg-background relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-2xl mx-auto px-6 py-16 text-center">
        <div className="size-16 rounded-full bg-secondary/60 border border-border flex items-center justify-center">
          <Sparkles className="size-7 text-primary" />
        </div>

        <h1 className="mt-8 font-heading text-4xl md:text-5xl font-bold tracking-tight text-ink">
          Tủ đồ của bạn đã sẵn sàng
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-muted">
          Bắt đầu bằng việc thêm vài món đồ yêu thích. Gu phong cách cá nhân là đặc quyền hội viên và có
          thể khai bất cứ lúc nào trong mục &ldquo;Gu của tôi&rdquo;.
        </p>

        <div className="mt-10 w-full max-w-md rounded-2xl border border-border bg-card p-5 text-left">
          <div className="flex items-center gap-3">
            <Palette className="size-4 text-ink-muted" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-muted">
              Bạn có thể làm sau
            </span>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-ink-muted">
            <li>· Khai gu để gợi ý sát ý bạn hơn</li>
            <li>· Chọn phong cách muốn tránh</li>
            <li>· Xem gợi ý phong cách từ chính tủ đồ</li>
          </ul>
        </div>

        <div className="mt-12 w-full max-w-md">
          <Button
            onClick={handleFinish}
            className="w-full h-14 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-base font-bold shadow-xl shadow-primary/20 group transition-all"
          >
            Bắt đầu trải nghiệm
            <ArrowRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
