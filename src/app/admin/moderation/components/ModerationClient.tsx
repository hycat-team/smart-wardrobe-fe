'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminPostsModeration } from './AdminPostsModeration';
import { AdminCommentsModeration } from './AdminCommentsModeration';

export function ModerationClient() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 max-w-[1400px] mx-auto w-full pb-24 text-foreground px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col gap-6 pt-6 border-b border-border pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Kiểm duyệt nội dung cộng đồng
            </h1>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider leading-relaxed border-l-2 border-primary pl-3">
              Quản lý, ẩn và khôi phục các bài đăng phong cách và bình luận vi phạm tiêu chuẩn cộng đồng.
            </p>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm kiếm nội dung, tác giả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 w-full pl-10 pr-4 bg-muted/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary text-xs font-medium transition-all outline-none rounded-full text-foreground placeholder:text-muted-foreground shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="mb-8 rounded-full bg-muted p-1">
          <TabsTrigger
            value="posts"
            className="rounded-full px-6 py-2 font-bold text-xs uppercase tracking-wider data-[state=active]:bg-background data-[state=active]:text-foreground"
          >
            BÀI ĐĂNG PHONG CÁCH
          </TabsTrigger>
          <TabsTrigger
            value="comments"
            className="rounded-full px-6 py-2 font-bold text-xs uppercase tracking-wider data-[state=active]:bg-background data-[state=active]:text-foreground"
          >
            BÌNH LUẬN TOÀN SÀN
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <AdminPostsModeration searchTerm={searchTerm} />
        </TabsContent>

        <TabsContent value="comments">
          <AdminCommentsModeration searchTerm={searchTerm} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
