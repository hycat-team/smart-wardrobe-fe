"use client";
import { useState, useEffect } from "react";
import { Plus, UploadCloud, Pencil, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockBrandPosts } from "@/lib/mock-data/b2b";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function BrandPostsClient() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    caption: "",
    type: "LIFESTYLE",
    imageUrl: "",
  });

  useEffect(() => {
    // Load default mock posts for this brand
    const defaultPosts = mockBrandPosts.filter(p => p.brandId === 'brand_001');
    
    // Load custom posts from localStorage
    try {
      const stored = localStorage.getItem("brand_custom_posts");
      if (stored) {
        const customPosts = JSON.parse(stored);
        setPosts([...customPosts, ...defaultPosts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } else {
        setPosts(defaultPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }
    } catch (e) {
      setPosts(defaultPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenDialog = (post?: any) => {
    if (post) {
      setEditingId(post.id);
      setFormData({
        caption: post.caption,
        type: post.type || "LIFESTYLE",
        imageUrl: post.mediaUrls?.[0] || "",
      });
    } else {
      setEditingId(null);
      setFormData({
        caption: "",
        type: "LIFESTYLE",
        imageUrl: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    try {
      const stored = localStorage.getItem("brand_custom_posts");
      let customPosts: any[] = stored ? JSON.parse(stored) : [];

      if (editingId) {
        const existingIndex = customPosts.findIndex(p => p.id === editingId);
        
        const updatedPost = {
          id: editingId,
          brandId: "brand_001",
          type: formData.type,
          caption: formData.caption,
          mediaUrls: [formData.imageUrl],
          taggedProductIds: [],
          visibility: "PUBLIC",
          likeCount: Math.floor(Math.random() * 500) + 50,
          commentCount: Math.floor(Math.random() * 50) + 5,
          saveCount: Math.floor(Math.random() * 100) + 10,
          createdAt: new Date().toISOString()
        };

        if (existingIndex >= 0) {
          updatedPost.createdAt = customPosts[existingIndex].createdAt;
          updatedPost.likeCount = customPosts[existingIndex].likeCount;
          updatedPost.commentCount = customPosts[existingIndex].commentCount;
          updatedPost.saveCount = customPosts[existingIndex].saveCount;
          customPosts[existingIndex] = updatedPost;
        } else {
          customPosts.push(updatedPost);
        }
      } else {
        const newPost = {
          id: `post_custom_${Date.now()}`,
          brandId: "brand_001",
          type: formData.type,
          caption: formData.caption,
          mediaUrls: [formData.imageUrl],
          taggedProductIds: [],
          visibility: "PUBLIC",
          likeCount: 0,
          commentCount: 0,
          saveCount: 0,
          createdAt: new Date().toISOString()
        };
        customPosts.push(newPost);
      }

      localStorage.setItem("brand_custom_posts", JSON.stringify(customPosts));
      
      const defaultPosts = mockBrandPosts.filter(p => p.brandId === 'brand_001');
      const overriddenIds = customPosts.map(p => p.id);
      const filteredDefaults = defaultPosts.filter(p => !overriddenIds.includes(p.id));
      
      setPosts([...customPosts, ...filteredDefaults].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setIsDialogOpen(false);
    } catch(e) {
      console.error("Error saving post", e);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Bài viết</h1>
        <Button 
          onClick={() => handleOpenDialog()}
          className="rounded-none bg-black hover:bg-black/90 font-bold uppercase tracking-widest flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Viết bài mới
        </Button>
      </div>

      <div className="bg-white border border-black/10 overflow-x-auto">
        <Table className="min-w-[700px]">
          <TableHeader>
            <TableRow className="border-black/10 hover:bg-transparent">
              <TableHead className="font-bold text-xs uppercase tracking-widest text-black/50">Bài viết</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest text-black/50">Loại</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest text-black/50">Ngày đăng</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest text-black/50">Tương tác</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest text-black/50 text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map(post => (
              <TableRow key={post.id} className="border-black/10">
                <TableCell>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-20 bg-[#F5F2EE] overflow-hidden shrink-0">
                      {post.mediaUrls?.[0] ? (
                        <img src={post.mediaUrls[0]} alt="Post media" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-black/5 text-black/20">
                          <ImageIcon className="size-5" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-medium line-clamp-3 min-w-[200px] max-w-md">{post.caption}</p>
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <span className="px-2 py-1 bg-ink/5 text-ink text-[10px] font-bold uppercase tracking-widest">
                    {post.type}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-black/70 font-mono whitespace-nowrap">
                  {formatDate(post.createdAt)}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex gap-4 text-sm font-mono text-black/70">
                    <span>❤️ {post.likeCount}</span>
                    <span>💬 {post.commentCount}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <button 
                    onClick={() => handleOpenDialog(post)}
                    className="text-sm font-bold underline decoration-1 underline-offset-2 text-black/50 hover:text-black flex items-center gap-1 justify-end w-full whitespace-nowrap"
                  >
                    <Pencil className="size-3" /> Sửa
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-none border border-black/10">
          <DialogHeader>
            <DialogTitle className="font-['Playfair_Display'] text-2xl uppercase font-medium">
              {editingId ? "Sửa bài viết" : "Viết bài mới"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="space-y-4">
              {/* Image Upload Area */}
              <label className="block w-full aspect-[4/5] bg-[#F4F1EE] border border-dashed border-ink/20 flex flex-col items-center justify-center text-ink-muted cursor-pointer hover:bg-ink/5 transition-colors group relative overflow-hidden">
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <>
                    <div className="size-10 rounded-full bg-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
                      <UploadCloud className="size-4 text-ink" />
                    </div>
                    <p className="text-[10px] font-mono uppercase tracking-widest font-bold">Upload Ảnh</p>
                  </>
                )}
              </label>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-widest font-bold text-ink">Nội dung (Caption)</label>
                <textarea
                  value={formData.caption}
                  onChange={(e) => setFormData(prev => ({ ...prev, caption: e.target.value }))}
                  placeholder="Hôm nay mặc gì?..."
                  className="w-full min-h-[100px] p-3 text-sm rounded-none border border-ink/10 bg-[#F4F1EE]/50 focus-visible:ring-0 focus-visible:outline-none focus-visible:border-ink resize-none"
                />
              </div>
            </div>

            <Button 
              onClick={handleSave}
              className="w-full bg-black hover:bg-black/90 text-white rounded-none uppercase font-mono tracking-widest text-[11px] h-12"
            >
              Đăng bài
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
