import { Heart, MessageCircle, Share2, MoreHorizontal, Bookmark, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const FEED_POSTS = [
  {
    id: 1,
    authorName: "Elena Rostova",
    authorSubtitle: "Organic Linen Collection",
    authorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDW7uVjEnDtiDgusPtagkv7bEd-nC-vGk8XUjyr2kAglFizI-BY6P_sbRVXQWppiCL5SMcwQUYYPRup1uohYMycVJyho1Kc0MBdDvveppYJ3R2BWBcltMfuTesRWVMOdxnLXs1uOdHHMcQ1AIOiFSv3K9fraJRSXzcpwjcA-5Df6TDup0K7_BBhX99yMGgsbntJfi_99Q75ycHE_Z7DHHecqvPbPPgnyawUV4sGBRkO0PCMx94pLTUnc2Df0MHIxwg6QgfgpamQRIQ",
    tag: "Vintage",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDe5rfgF6rg5Rb1S1QdM7BluR9eDe1gYAOTZ_MCGP6tb5ktCHnWR_A06eSFaxaAypXh1_HXI-Qx85AE_Y8_eb31urUoNxgzjc0PhhI3GhJ1LiyC-u4t6HzSCeru15FbFIcZw3MjTtL9rLAf6yV2WlrnoFlViWBNvmXVVMjsKpFWcIx5hEWowkCfIlHkth0Uuri9mdYV7emZ1jc0AW-Ab7yo1mlmeJrPRtejDOc_HjWUgRdCl3p9lT_tedjKgJW3axOBjVKogBD31cQ",
    aspectRatio: "aspect-[4/5]",
    likes: 128,
    comments: 24,
    caption: "Loving the new textures and fits from the organic linen collection. Sustainability has never looked this crisp. 🌿🤍",
    topComment: {
      author: "@lucas_style",
      text: "The texture on that blazer is incredible!"
    }
  },
  {
    id: 2,
    authorName: "Studio_A",
    authorSubtitle: "Accessories",
    authorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuA09IvcGdVpOLcdiIx-IUMhQ0EFOYgRK3v0BpwFbMfJeVkVMbEPkB5LWXLzYQd3vGq5G2TeQTbZo1si0qzb3wV9KeiMd3JC0ev5Ga8zvGL3kkOgJ9PhXGSLdJivobD-rsmYvIHVgW9vKGyI49Sf5uJuJ6bONqUzWJ11nDA4GmDcNFn02NCQFDo6qT0lNTNkEuBfeG3Nlz0wX2y4ULtQKKo7yGun4Mv7XC60rKKePLzb-AAwQGP31aIR3QTY63HS9eBcIqzMW0y1-BM",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQJ-d_AQTUjRCGw4yzyHfldqqxkze0l4Al9XxcsLLAByiGK1Ct7IWiqe7FfhGfGFhKA5NDteccAWhGUrUNlEk6FSaj3NxPFDV58D9-ccgIpJiSNmSdkZNisCemmaEQf8ojpwPWLtT_Q2QtCW3QpE1lauswiJnVUtNY-bsS2FqWHQUXibRnjZSt1dmNIC6anOHYlrJgtQh9dn3ZDvvpnLgpGfjdQmTUz-KYEkL9h-tS2uIDBc8_Sp8rn_-Ci0dGCwKSfOCQOsfNq4s",
    aspectRatio: "aspect-square",
    likes: 210,
    comments: 18,
    caption: "Essentials redefined. Cork leather combined with minimalist silver details. What's your daily carry?",
  },
  {
    id: 3,
    authorName: "Community Spotlight",
    authorSubtitle: "Editorial",
    isInitials: true,
    initials: "CS",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHhEA7REjlvAos21e2jZ3-EZGNovuNd7dKOY2Ku_539WCJyhuGRdqyQFMMlxtPIxcb8ePPEpmYnC4M0MkBRq1Az1PG2hQUzyJNaRkjcCyhfh65LAwKbX-nlINu5GX2Fvhjtex-Lj_vD9bAVxyzv9ntpi-aUBfCLgRbsR0znttHe8o36zlJE6ceCUahrsvwVOCUy9TSzoABiKmJ5F8D3WmLoCPdaGaPD9M2gvvTkF9ySuBY7i3GxxUbZ67gZtsQQhEJSaPZ_QjaqTs",
    aspectRatio: "aspect-[16/10]",
    likes: 342,
    comments: 56,
    isArticle: true,
    articleTitle: "The Silhouette of Tomorrow",
    articleDesc: "How structural design is reshaping zero-waste fashion patterns and redefining modern city wear."
  }
];

export const metadata = {
  title: 'Feed | Smart Wardrobe',
  description: 'Inspiration from conscious creators.',
};

export default function Feed() {
  return (
    <div className="flex-1 flex overflow-hidden bg-background">
      {/* Gallery Feed Canvas */}
      <div className="flex-1 overflow-y-auto px-gutter md:px-margin-desktop py-8 md:py-12 scroll-smooth">
        <header className="mb-12 flex justify-between items-end max-w-2xl mx-auto">
          <div>
            <h1 className="font-headline-md md:font-display-lg text-headline-md md:text-display-lg text-primary mb-2">Curated Feed</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Inspiration from conscious creators.</p>
          </div>
          {/* Mobile trigger for connections */}
          <button className="lg:hidden text-primary flex items-center gap-2 font-label-caps text-label-caps uppercase tracking-widest border-b border-primary pb-1">
            Connections <span className="material-symbols-outlined text-[18px]">group</span>
          </button>
        </header>

        {/* Single Column Vertical Feed */}
        <div className="flex flex-col gap-12 max-w-2xl mx-auto">
          {FEED_POSTS.map(post => (
            <article key={post.id} className="group relative rounded-xl overflow-hidden bg-surface shadow-sm hover:shadow-[0_10px_30px_rgba(45,45,45,0.08)] transition-all duration-500 flex flex-col border border-outline-variant/30">
              {/* Post Header */}
              <div className="p-6 bg-surface z-10 flex items-center justify-between border-b border-outline-variant/30">
                <div className="flex items-center gap-4">
                  {post.isInitials ? (
                     <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-title-lg">
                       {post.initials}
                     </div>
                  ) : (
                     <img className="w-10 h-10 rounded-full object-cover" src={post.authorAvatar} alt={post.authorName} />
                  )}
                  <div>
                    <h3 className="font-title-lg text-[14px] leading-tight text-primary">{post.authorName}</h3>
                    <p className="font-body-sm text-[12px] text-on-surface-variant">{post.authorSubtitle}</p>
                  </div>
                </div>
                {post.tag ? (
                   <span className="font-label-caps text-[10px] text-secondary tracking-widest bg-secondary-container/30 px-3 py-1 rounded-full">{post.tag}</span>
                ) : (
                   <button className="text-outline hover:text-primary transition-colors"><MoreHorizontal className="size-5" /></button>
                )}
              </div>

              {/* Post Image */}
              <div className={cn("relative w-full overflow-hidden", post.aspectRatio)}>
                <img 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                  src={post.image} 
                  alt="Post content" 
                />
                {!post.isArticle && (
                  <>
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {/* Actions Overlay */}
                    <div className="absolute bottom-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <button className="w-12 h-12 rounded-full bg-surface/90 backdrop-blur-md flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors">
                        <Heart className="size-6" />
                      </button>
                      <button className="w-12 h-12 rounded-full bg-surface/90 backdrop-blur-md flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors" title="Save to Wardrobe">
                        <span className="material-symbols-outlined">checkroom</span>
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Post Footer/Content */}
              <div className={cn("px-6 py-4 flex flex-col gap-4", post.isArticle ? "bg-surface-container-low py-6" : "bg-surface")}>
                
                {post.isArticle ? (
                   <div>
                     <h2 className="font-headline-md text-[24px] text-primary mb-2 leading-snug">{post.articleTitle}</h2>
                     <p className="font-body-sm text-[15px] text-on-surface-variant">{post.articleDesc}</p>
                   </div>
                ) : (
                   <>
                     <div className="flex items-center justify-between">
                       <div className="flex items-center gap-6">
                         <div className="flex items-center gap-2 cursor-pointer group/icon">
                           <Heart className="size-6 text-on-surface-variant group-hover/icon:text-error group-hover/icon:fill-error transition-colors" />
                           <span className="font-body-sm text-[14px] text-on-surface-variant">{post.likes}</span>
                         </div>
                         <div className="flex items-center gap-2 cursor-pointer group/icon">
                           <MessageCircle className="size-6 text-on-surface-variant group-hover/icon:text-primary transition-colors" />
                           <span className="font-body-sm text-[14px] text-on-surface-variant">{post.comments}</span>
                         </div>
                       </div>
                       <div className="flex items-center gap-4">
                         <Share2 className="size-5 text-on-surface-variant cursor-pointer hover:text-primary transition-colors" />
                         <Bookmark className="size-5 text-on-surface-variant cursor-pointer hover:text-primary transition-colors" />
                       </div>
                     </div>
                     <div className="mt-2">
                       <p className="font-body-sm text-[14px] text-on-surface-variant">
                         <span className="font-bold text-primary mr-2">{post.authorName}</span>
                         {post.caption}
                       </p>
                     </div>
                     {post.topComment && (
                       <div className="bg-surface-container-low/50 p-4 rounded-lg mt-2">
                         <p className="font-body-sm text-[13px] text-on-surface-variant">
                           <span className="font-bold text-primary">{post.topComment.author}:</span> {post.topComment.text}
                         </p>
                       </div>
                     )}
                   </>
                )}

                {/* Article Footer Stats */}
                {post.isArticle && (
                   <div className="mt-4 pt-4 border-t border-outline-variant/30 flex items-center justify-between">
                      <div className="flex items-center gap-6">
                         <div className="flex items-center gap-2 cursor-pointer group/icon">
                           <Heart className="size-6 text-on-surface-variant group-hover/icon:text-error transition-colors" />
                           <span className="font-body-sm text-[14px] text-on-surface-variant">{post.likes}</span>
                         </div>
                         <div className="flex items-center gap-2 cursor-pointer group/icon">
                           <MessageCircle className="size-6 text-on-surface-variant group-hover/icon:text-primary transition-colors" />
                           <span className="font-body-sm text-[14px] text-on-surface-variant">{post.comments}</span>
                         </div>
                       </div>
                       <div className="flex items-center gap-4">
                         <Share2 className="size-5 text-on-surface-variant cursor-pointer hover:text-primary transition-colors" />
                         <Bookmark className="size-5 text-on-surface-variant cursor-pointer hover:text-primary transition-colors" />
                       </div>
                   </div>
                )}
              </div>
            </article>
          ))}
        </div>
        {/* Spacer for bottom */}
        <div className="h-24 md:h-12"></div>
      </div>

      {/* Right Sidebar: Connections (hidden on mobile, visible on lg) */}
      <aside className="hidden lg:flex w-80 bg-surface border-l border-outline-variant/30 flex-col h-[calc(100vh-100px)] sticky top-0">
        <div className="p-6 border-b border-outline-variant/50">
          <h2 className="font-headline-md text-[22px] text-primary">Connections</h2>
          <p className="font-body-sm text-on-surface-variant mt-1">Your conscious circle</p>
        </div>
        <div className="p-6 overflow-y-auto flex-1 no-scrollbar">
          {/* Search minimal */}
          <div className="relative mb-8">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-outline size-5" />
            <input 
              className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary focus:ring-0 pl-8 pb-2 font-body-sm text-primary placeholder:text-outline transition-colors outline-none" 
              placeholder="Find creators..." 
              type="text"
            />
          </div>

          <div className="space-y-6">
            {/* Connection 1 */}
            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <img className="w-10 h-10 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVmMYLmeTdGkQOY0Y1hxQOteZosrB5vQW-m71mNsMw9Jty6fFVdRdCex6V1uK3KWXFkGNcMwHAz2lF9nfygavyuu2nw7iFjFZOlJl3x0uq51CKM8HAHVIUEmwy1sX8PCBN6lsHZBd4OOLJ0iQ4YgCBBhJHaKStX_Z4ehYQcOUlcF_K_FF8aBklc1yWjmUYMr-jexKkCY4szEK2-3vtZDVRXGUX2ZahW0KRV1YiUxxqk1KBeEsGEMcrRla4Jgwh8PGs1q00ws743bI" alt="Sarah Jenkins" />
                <div>
                  <h4 className="font-title-lg text-[14px] text-primary group-hover:text-secondary transition-colors cursor-pointer">Sarah Jenkins</h4>
                  <p className="font-body-sm text-[12px] text-outline">@sarahj_style</p>
                </div>
              </div>
              <button className="text-secondary hover:text-primary transition-colors">
                <MoreHorizontal className="size-5" />
              </button>
            </div>
            
            {/* Connection 2 */}
            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <img className="w-10 h-10 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIAWSsMeFUiNJWAyljmFVeuKXW1T5ZUnmxsd6h1VVxvemL9agvdDl6OJFeZeoxVG4zX3KgLS6o1cttikb-zy2F-N12K3XxYU7S-l6Q-8dKbn7GUm8x_qzWfLuzhmUrQmz_47j74JSsQV6B8HkAOT7RIPteBnScENJw0HRVWON6UnBMXsid3OBeLwD0I0Rc2wjVll_dsK5WQKQsZJwACrYJQox1H3tywQeLeJSlt8nL0I5Z67I6c7SNNokgj_pqiOI79_b_2x6cnZ8" alt="David Chen" />
                <div>
                  <h4 className="font-title-lg text-[14px] text-primary group-hover:text-secondary transition-colors cursor-pointer">David Chen</h4>
                  <p className="font-body-sm text-[12px] text-outline">@dchen_archive</p>
                </div>
              </div>
              <button className="text-secondary hover:text-primary transition-colors">
                <MoreHorizontal className="size-5" />
              </button>
            </div>
            
            {/* Connection 3 */}
            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-title-lg text-[14px]">LV</div>
                <div>
                  <h4 className="font-title-lg text-[14px] text-primary group-hover:text-secondary transition-colors cursor-pointer">Lia V.</h4>
                  <p className="font-body-sm text-[12px] text-outline">@lia_vintage</p>
                </div>
              </div>
              <button className="text-secondary hover:text-primary transition-colors">
                <MoreHorizontal className="size-5" />
              </button>
            </div>
          </div>

          <h3 className="font-label-caps text-label-caps text-outline uppercase tracking-widest mt-10 mb-4">Suggested</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img className="w-10 h-10 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPS8msxZ3gCfXqvv1UcAsSQ01zPeqw203bdFXZaS59SWnkv8thgvZZkdTnuRwESJJzY9c2zA7C98kVHgU_X2dn048nBm5IGCmPjvjENF39QK1U7Fxy_9_-SEDl5pafTXkO5jeDZgP-gmWVv-NlnsKx3Pe0YKpQRNHDcJORvt1zN4CJ2Kb4tJjJ56MoyXYd2hKObLAFZ2xnax8yBVmj39Ek4PB_7o7Dy3H8-xNXl4jWAKiZUgjAs53kr1m1Nqx9KNrBSD7-ig9x-Xk" alt="Aura Boutique" />
                <div>
                  <h4 className="font-title-lg text-[14px] text-primary">Aura Boutique</h4>
                  <p className="font-body-sm text-[12px] text-outline">Curated Pieces</p>
                </div>
              </div>
              <button className="text-[12px] font-title-lg text-primary border border-primary px-3 py-1 rounded-full hover:bg-primary hover:text-on-primary transition-colors">
                Follow
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}


