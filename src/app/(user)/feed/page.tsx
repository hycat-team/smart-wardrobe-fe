"use client";
import { Heart, MessageCircle, Share2, MoreHorizontal, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const TRENDS = ["#Minimalist", "#Y2K", "#Workwear", "#OOTD", "#SummerVibes"];

export default function Feed() {
  return (
    <div className="h-full flex gap-8 max-w-6xl mx-auto animate-in fade-in duration-500">
      {/* Left Sidebar - Trends */}
      <div className="hidden lg:block w-[240px] shrink-0 sticky top-[80px] self-start space-y-8">
        <div>
          <h3 className="font-heading font-bold text-lg mb-4 text-ink">Trending Tags</h3>
          <div className="flex flex-col gap-3">
            {TRENDS.map(tag => (
              <button key={tag} className="text-left text-sm text-ink-muted hover:text-primary font-medium transition-colors">
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-heading font-bold text-lg mb-4 text-ink">Bộ lọc</h3>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-3 text-sm text-ink-muted cursor-pointer hover:text-ink">
              <input type="radio" name="filter" defaultChecked className="accent-primary" /> Tất cả
            </label>
            <label className="flex items-center gap-3 text-sm text-ink-muted cursor-pointer hover:text-ink">
              <input type="radio" name="filter" className="accent-primary" /> OOTD Xã hội
            </label>
            <label className="flex items-center gap-3 text-sm text-ink-muted cursor-pointer hover:text-ink">
              <input type="radio" name="filter" className="accent-primary" /> Bán đồ cũ
            </label>
          </div>
        </div>
      </div>

      {/* Main Feed */}
      <div className="flex-1 max-w-xl mx-auto w-full space-y-6 pb-20">
        <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex items-center gap-4 cursor-pointer hover:bg-secondary/50 transition-colors">
           <div className="size-10 rounded-full bg-muted overflow-hidden shrink-0">
             <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix" alt="avatar" className="w-full h-full object-cover" />
           </div>
           <div className="flex-1 text-sm text-muted-foreground">Chia sẻ outfit hoặc bán đồ...</div>
           <Button variant="outline" className="rounded-full h-9 bg-background">Tạo bài đăng</Button>
        </div>

        {/* Post 1 - Social */}
        <article className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="size-10 rounded-full bg-muted overflow-hidden">
                 <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" className="w-full h-full object-cover" />
               </div>
               <div>
                 <div className="font-bold text-sm text-ink flex items-center gap-1">
                   lan_style <BadgeCheck className="size-3 text-primary" />
                 </div>
                 <div className="text-xs text-muted-foreground">2 giờ trước</div>
               </div>
            </div>
            <button className="text-muted-foreground hover:text-ink p-2"><MoreHorizontal className="size-5" /></button>
          </div>
          
          <div className="aspect-[4/5] bg-muted w-full">
            <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" />
          </div>
          
          <div className="p-4">
            <div className="flex items-center gap-4 mb-3">
              <button className="flex items-center gap-1 text-ink-muted hover:text-red-500 transition-colors">
                <Heart className="size-6 hover:fill-red-500 hover:text-red-500" /> <span className="text-sm font-medium">142</span>
              </button>
              <button className="flex items-center gap-1 text-ink-muted hover:text-ink transition-colors">
                <MessageCircle className="size-6" /> <span className="text-sm font-medium">23</span>
              </button>
              <button className="text-ink-muted hover:text-ink transition-colors ml-auto">
                <Share2 className="size-5" />
              </button>
            </div>
            
            <p className="text-sm text-ink leading-relaxed">
              <span className="font-bold mr-2">lan_style</span>
              Minimalism is not about having less, it's about making room for what matters. 🌿
            </p>
            <p className="text-xs text-primary mt-1 font-medium">#Minimalist #OOTD</p>
          </div>
        </article>

        {/* Post 2 - Resale */}
        <article className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="size-10 rounded-full bg-muted overflow-hidden">
                 <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Jack" className="w-full h-full object-cover" />
               </div>
               <div>
                 <div className="font-bold text-sm text-ink flex items-center gap-2">
                   huy_ngo 
                   <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded uppercase font-bold tracking-wider">🏷️ Bán</span>
                 </div>
                 <div className="text-xs text-muted-foreground">5 giờ trước</div>
               </div>
            </div>
            <button className="text-muted-foreground hover:text-ink p-2"><MoreHorizontal className="size-5" /></button>
          </div>
          
          <div className="p-4 pt-0">
             <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                <div className="w-40 aspect-square rounded-xl overflow-hidden shrink-0 relative">
                  <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=300" className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 right-2 bg-background/90 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold shadow-sm">150.000đ</div>
                </div>
                <div className="w-40 aspect-square rounded-xl overflow-hidden shrink-0 relative">
                  <img src="https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=300" className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 right-2 bg-background/90 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold shadow-sm">200.000đ</div>
                </div>
             </div>
             
             <p className="text-sm text-ink leading-relaxed mt-2">
               <span className="font-bold mr-2">huy_ngo</span>
               Áo thun basic và quần jeans ít mặc, tình trạng 95%. Size M, fit đẹp cho bạn nam 1m70 65kg.
             </p>
             
             <div className="mt-4 flex gap-3">
                <Button className="flex-1 rounded-full bg-ink text-cream hover:bg-ink/90 shadow-sm"><MessageCircle className="size-4 mr-2" /> Nhắn tin</Button>
                <Button variant="outline" className="flex-1 rounded-full border-ink/20 text-ink">Mua ngay</Button>
             </div>
          </div>
        </article>
      </div>

      {/* Right Sidebar - Suggestions */}
      <div className="hidden xl:block w-[280px] shrink-0 sticky top-[80px] self-start">
        <h3 className="font-heading font-bold text-lg mb-4 text-ink">Gợi ý theo dõi</h3>
        <div className="bg-card rounded-2xl border border-border p-4 shadow-sm space-y-4">
           {[1, 2, 3].map(i => (
             <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-full bg-secondary overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${i}`} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-ink truncate w-24">user_style_{i}</span>
                    <span className="text-[10px] text-muted-foreground">Theo dõi bạn</span>
                  </div>
                </div>
                <button className="text-xs font-bold text-primary hover:bg-primary/10 px-3 py-1.5 rounded-full transition-colors">Theo dõi</button>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}


