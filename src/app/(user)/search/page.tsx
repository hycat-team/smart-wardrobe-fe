"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Search, Eye, Heart, MessageCircle, UserPlus, Sparkles, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MOCK_ITEMS } from "../wardrobe/page";

// Mock posts database
const MOCK_POSTS = [
  {
    id: "p1",
    author: "lan_style",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
    type: "social",
    content: "Minimalism is not about having less, it's about making room for what matters. 🌿",
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800",
    tags: ["Minimalist", "OOTD"],
    likes: 142,
    comments: 23,
    time: "2 giờ trước"
  },
  {
    id: "p2",
    author: "huy_ngo",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Jack",
    type: "resale",
    content: "Áo thun basic và quần jeans ít mặc, tình trạng 95%. Size M, fit đẹp cho bạn nam 1m70 65kg.",
    items: [
      { img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=300", price: "150.000đ" },
      { img: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=300", price: "200.000đ" }
    ],
    likes: 18,
    comments: 4,
    time: "5 giờ trước"
  },
  {
    id: "p3",
    author: "clara_fashion",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Clara",
    type: "social",
    content: "Xu hướng blazer ngoại cỡ phong cách Parisian chic cho mùa thu năm nay. Phối cùng thắt lưng bản nhỏ.",
    img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800",
    tags: ["Parisian", "Blazer", "Autumn"],
    likes: 289,
    comments: 45,
    time: "1 ngày trước"
  }
];

// Mock users database
const MOCK_USERS = [
  { id: "u1", username: "lan_style", name: "Lê Cẩm Lan", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100", bio: "Fashion Enthusiast | Slow Fashion Advocate 🌿", followers: 1240, verified: true },
  { id: "u2", username: "huy_ngo", name: "Ngô Huy", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Jack", bio: "Thanh lý tủ đồ nam size M. Đồ cá nhân giữ gìn kỹ.", followers: 320, verified: false },
  { id: "u3", username: "clara_fashion", name: "Clara Trần", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Clara", bio: "Parisian style lover. Stylist based in Saigon.", followers: 4500, verified: true },
  { id: "u4", username: "admin_system", name: "Smart Wardrobe Admin", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Admin", bio: "Official support account for Smart Wardrobe.", followers: 9800, verified: true }
];

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSearchParams = (p: any) => { const q = new URLSearchParams(searchParams.toString()); for(const k in p) q.set(k, p[k]); router.push('?' + q.toString()); };
  
  const query = searchParams.get("q") || "";
  const activeTab = searchParams.get("type") || "all";
  
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: searchInput, type: activeTab });
  };

  const handleTabChange = (tab: string) => {
    setSearchParams({ q: query, type: tab });
  };

  // Searching logic
  const filteredItems = query 
    ? MOCK_ITEMS.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) || 
        item.brand.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()) ||
        item.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const filteredPosts = query
    ? MOCK_POSTS.filter(post => 
        post.content.toLowerCase().includes(query.toLowerCase()) || 
        post.author.toLowerCase().includes(query.toLowerCase()) ||
        post.tags?.some(t => t.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const filteredUsers = query
    ? MOCK_USERS.filter(user => 
        user.username.toLowerCase().includes(query.toLowerCase()) || 
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.bio.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const totalResults = filteredItems.length + filteredPosts.length + filteredUsers.length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-16 font-sans">
      
      {/* Search Input Box */}
      <div className="space-y-4">
        <h1 className="text-3xl font-heading font-medium tracking-wide text-ink">Tìm kiếm toàn cục</h1>
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-ink-muted" />
          <input 
            type="text" 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tìm kiếm quần áo, bài viết, hoặc người dùng..." 
            className="w-full h-14 pl-12 pr-28 rounded-2xl bg-cream-dark/30 border-transparent focus:ring-1 focus:ring-terracotta focus:border-terracotta text-sm transition-all"
          />
          <Button 
            type="submit" 
            className="absolute right-2 top-2 h-10 rounded-xl bg-ink text-cream hover:bg-ink/90 px-6 font-mono text-xs tracking-wider"
          >
            TÌM KIẾM
          </Button>
        </form>
      </div>

      {/* Tabs list */}
      {query && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-cream-dark pb-2">
            <div className="flex overflow-x-auto gap-4 no-scrollbar">
              {[
                { label: `Tất cả (${totalResults})`, value: "all" },
                { label: `Tủ đồ (${filteredItems.length})`, value: "item" },
                { label: `Bài đăng (${filteredPosts.length})`, value: "post" },
                { label: `Thành viên (${filteredUsers.length})`, value: "user" }
              ].map(tab => (
                <button
                  key={tab.value}
                  onClick={() => handleTabChange(tab.value)}
                  className={cn(
                    "pb-3 text-sm font-medium tracking-wider relative transition-all whitespace-nowrap",
                    activeTab === tab.value 
                      ? "text-ink font-semibold" 
                      : "text-ink-muted hover:text-ink"
                  )}
                >
                  {tab.label}
                  {activeTab === tab.value && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-terracotta rounded-full" />
                  )}
                </button>
              ))}
            </div>
            
            <p className="text-xs font-mono text-ink-muted">
              Tìm thấy {totalResults} kết quả cho "{query}"
            </p>
          </div>

          {/* Results Area */}
          {totalResults === 0 ? (
            <div className="text-center py-16 space-y-3 bg-cream-dark/10 rounded-2xl border border-dashed border-cream-dark max-w-md mx-auto">
              <div className="size-12 rounded-full bg-cream-dark flex items-center justify-center mx-auto text-ink-muted">
                <Search className="size-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading text-lg font-bold text-ink">Không có kết quả</h3>
                <p className="text-sm text-ink-muted">
                  Không tìm thấy kết quả nào khớp với "{query}". Vui lòng thử từ khóa khác.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* 1. WARDROBE ITEMS SECTION */}
              {(activeTab === "all" || activeTab === "item") && filteredItems.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xs font-mono uppercase tracking-wider text-ink font-bold flex items-center gap-2">
                    <Grid className="size-4 text-terracotta" /> Tủ đồ cá nhân ({filteredItems.length})
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredItems.map(item => (
                      <div 
                        key={item.id} 
                        onClick={() => router.push(`/wardrobe/item/${item.id}`)}
                        className="group bg-cream-dark/20 hover:bg-cream-dark/30 rounded-xl overflow-hidden border border-cream-dark/50 hover:border-ink-subtle transition-all duration-300 cursor-pointer"
                      >
                        <div className="aspect-[4/5] bg-cream-dark/40 overflow-hidden relative">
                          <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-ink/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="bg-cream text-ink text-xs font-mono px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm font-semibold">
                              <Eye className="size-3.5" /> CHI TIẾT
                            </span>
                          </div>
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium text-sm text-ink truncate">{item.name}</h4>
                          <div className="flex items-center justify-between text-[10px] text-ink-muted mt-1 font-mono">
                            <span>{item.brand}</span>
                            <span>Mặc {item.timesWorn} lần</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. POSTS SECTION */}
              {(activeTab === "all" || activeTab === "post") && filteredPosts.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xs font-mono uppercase tracking-wider text-ink font-bold flex items-center gap-2">
                    <List className="size-4 text-terracotta" /> Bài đăng cộng đồng ({filteredPosts.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredPosts.map(post => (
                      <article 
                        key={post.id} 
                        onClick={() => router.push(`/feed/post/${post.id}`)}
                        className="bg-cream-dark/15 hover:bg-cream-dark/25 rounded-2xl border border-cream-dark/60 p-4 transition-all duration-300 cursor-pointer flex gap-4"
                      >
                        {post.img && (
                          <div className="w-24 h-32 rounded-xl overflow-hidden bg-muted shrink-0">
                            <img src={post.img} className="w-full h-full object-cover" />
                          </div>
                        )}
                        {!post.img && post.items && (
                          <div className="w-24 flex flex-col gap-1 shrink-0">
                            {post.items.map((it, idx) => (
                              <div key={idx} className="h-15 rounded-lg overflow-hidden bg-muted relative">
                                <img src={it.img} className="w-full h-full object-cover" />
                                <div className="absolute inset-x-0 bottom-0 bg-black/60 text-[8px] text-white text-center font-bold">{it.price}</div>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <img src={post.avatar} className="size-6 rounded-full object-cover border border-cream-dark" />
                              <span className="text-xs font-bold text-ink">@{post.author}</span>
                              {post.type === "resale" && (
                                <span className="text-[8px] bg-terracotta/10 text-terracotta px-1.5 py-0.5 rounded font-mono font-bold">SALE</span>
                              )}
                            </div>
                            <p className="text-xs text-ink-muted line-clamp-3 leading-relaxed">
                              {post.content}
                            </p>
                          </div>
                          <div className="flex items-center gap-4 text-[10px] font-mono text-ink-muted pt-2 border-t border-cream-dark/30 mt-2">
                            <span className="flex items-center gap-1"><Heart className="size-3 text-terracotta/80" /> {post.likes}</span>
                            <span className="flex items-center gap-1"><MessageCircle className="size-3" /> {post.comments}</span>
                            <span className="ml-auto">{post.time}</span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. USERS SECTION */}
              {(activeTab === "all" || activeTab === "user") && filteredUsers.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xs font-mono uppercase tracking-wider text-ink font-bold flex items-center gap-2">
                    <UserPlus className="size-4 text-terracotta" /> Thành viên ({filteredUsers.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredUsers.map(user => (
                      <div 
                        key={user.id} 
                        className="bg-cream-dark/20 rounded-2xl border border-cream-dark/50 p-4 flex items-center justify-between hover:bg-cream-dark/30 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3">
                          <img src={user.avatar} className="size-12 rounded-full object-cover border border-cream-dark shadow-sm shrink-0" />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-bold text-ink hover:underline cursor-pointer truncate" onClick={() => router.push(`/profile/${user.username}`)}>
                                {user.name}
                              </span>
                              {user.verified && <Sparkles className="size-3 text-terracotta" />}
                            </div>
                            <p className="text-[11px] font-mono text-ink-muted">@{user.username}</p>
                            <p className="text-xs text-ink-muted line-clamp-1 mt-1 leading-snug">{user.bio}</p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 rounded-lg text-xs font-mono tracking-wider hover:bg-ink hover:text-cream text-ink border border-cream-dark hover:border-ink ml-2"
                        >
                          FOLLOW
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Empty State before search */}
      {!query && (
        <div className="text-center py-20 max-w-md mx-auto space-y-4">
          <div className="size-16 rounded-full bg-cream-dark/30 flex items-center justify-center mx-auto text-ink-muted">
            <Search className="size-8" />
          </div>
          <div className="space-y-1">
            <h2 className="font-heading text-xl font-bold text-ink">Bắt đầu tìm kiếm</h2>
            <p className="text-sm text-ink-muted">
              Nhập từ khóa ở ô phía trên để tra cứu quần áo trong tủ cá nhân, bài viết từ cộng đồng, hay hồ sơ người dùng khác.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}


