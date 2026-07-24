"use client";
import { Users, Layers, ArrowRight, ArrowUpRight, TrendingUp, ChevronLeft, MessageSquare, Star, Info, Tag } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useGetBrandItemFeedbacks, useGetBrandItemDetail } from "@/features/brand-portal/queries/brand-portal.queries";

export function ReportClient({ sampleId }: { sampleId: string }) {
  const params = useParams();
  const brandId = params.brandId as string;
  const { data: feedbacks, isLoading: isLoadingFeedbacks } = useGetBrandItemFeedbacks(brandId, sampleId);
  const { data: product, isLoading: isLoadingProduct } = useGetBrandItemDetail(brandId, sampleId);

  const displayProductName = product?.name || product?.fashionItem?.style || "Chi tiết sản phẩm";
  const displayImage = product?.fashionItem?.imageUrl || null;
  const displayDesc = product?.description || product?.fashionItem?.description || "Chưa có mô tả chi tiết cho sản phẩm này.";
  const displayPrice = product?.price != null ? `${product.price.toLocaleString('vi-VN')} ₫` : "Liên hệ để biết giá";

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-12">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <Link href={`/brand/${brandId}/digital-sample-lab/report`} className="text-sm font-medium tracking-wide text-ink-muted hover:text-ink flex items-center gap-2 w-fit transition-colors bg-white/50 px-4 py-2 rounded-full border border-ink/5 backdrop-blur-md">
          <ChevronLeft className="size-4" /> Quay lại danh sách
        </Link>
      </div>

      {/* Main Product Hero */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-ink/10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F4F1EE] rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10 items-center">
          {/* Image */}
          <div className="bg-[#F4F1EE]/50 rounded-[2rem] p-8 aspect-square flex items-center justify-center border border-ink/5 relative overflow-hidden">
            {displayImage ? (
              <img src={displayImage} alt={displayProductName} className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl transition-transform duration-700 group-hover:scale-105" />
            ) : (
              <div className="flex flex-col items-center justify-center text-ink-muted">
                <Tag className="size-16 mb-4 opacity-20" />
                <span className="font-mono text-sm uppercase tracking-widest">Không có ảnh</span>
              </div>
            )}
          </div>
          
          {/* Info */}
          <div className="space-y-8 py-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A0522D]/10 text-[#A0522D] text-xs font-mono uppercase tracking-widest font-semibold">
              Thông tin mẫu
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl font-medium tracking-tight text-ink leading-[1.1]">{displayProductName}</h1>
              <p className="text-2xl font-light text-ink/70">{displayPrice}</p>
            </div>

            <p className="text-lg text-ink-muted leading-relaxed font-light max-w-lg">
              {displayDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Feedback Table Section */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-ink/10 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-medium text-ink flex items-center gap-3">
            <MessageSquare className="size-6 text-ink/50" />
            Phản Hồi Từ Người Dùng
          </h3>
          {feedbacks && feedbacks.length > 0 && (
            <span className="text-sm font-mono bg-[#F4F1EE] px-4 py-1.5 rounded-full border border-ink/5 text-ink">
              {feedbacks.length} lượt đánh giá
            </span>
          )}
        </div>
        
        {isLoadingFeedbacks ? (
          <div className="p-16 text-center text-ink-muted flex flex-col items-center gap-4 border border-ink/5 rounded-[2rem] bg-[#F4F1EE]/30">
             <div className="size-8 border-4 border-ink/20 border-t-ink rounded-full animate-spin" />
             <p className="text-sm">Đang tải dữ liệu phản hồi...</p>
          </div>
        ) : (!feedbacks || feedbacks.length === 0) ? (
          <div className="p-16 text-center flex flex-col items-center border border-ink/5 rounded-[2rem] bg-[#F4F1EE]/30">
             <div className="size-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
               <Info className="size-6 text-ink/30" />
             </div>
             <p className="text-ink font-medium text-lg">Chưa có phản hồi nào</p>
             <p className="text-sm text-ink-muted mt-1">Sản phẩm này chưa nhận được ý kiến đánh giá từ người dùng.</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar border border-ink/5 rounded-[2rem] bg-[#F4F1EE]/10">
            <table className="w-full text-left text-sm min-w-[800px]">
              <thead className="bg-[#F4F1EE]/50">
                <tr className="text-xs uppercase tracking-widest text-ink-muted">
                  <th className="py-5 px-6 font-medium whitespace-nowrap">Ngày đánh giá</th>
                  <th className="py-5 px-6 font-medium whitespace-nowrap">Đánh giá chung</th>
                  <th className="py-5 px-6 font-medium whitespace-nowrap">Mức độ hài lòng</th>
                  <th className="py-5 px-6 font-medium">Chi tiết phản hồi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {feedbacks.map((fb: any, i: number) => (
                  <tr key={fb.id || i} className="hover:bg-[#F4F1EE]/30 transition-colors">
                    <td className="py-5 px-6 font-mono text-[11px] uppercase text-ink/60 whitespace-nowrap">
                      {new Date(fb.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-5 px-6 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-[11px] font-bold uppercase tracking-wider ${
                        fb.voteType === 'like' ? 'bg-pink-50 text-pink-700 border border-pink-100' :
                        fb.voteType === 'dislike' ? 'bg-gray-100 text-gray-700 border border-gray-200' :
                        fb.voteType === 'would_buy' ? 'bg-green-50 text-green-700 border border-green-100' :
                        'bg-blue-50 text-blue-700 border border-blue-100'
                      }`}>
                        {
                          fb.voteType === 'like' ? '❤️ Thích' :
                          fb.voteType === 'dislike' ? '👎 Không thích' :
                          fb.voteType === 'would_buy' ? '🛍️ Sẽ mua' :
                          fb.voteType === 'not_interested' ? '🤷 Bỏ qua' : fb.voteType
                        }
                      </span>
                    </td>
                    <td className="py-5 px-6 whitespace-nowrap">
                      {fb.rating ? (
                        <div className="flex gap-1 items-center">
                          {Array.from({length: 5}).map((_, idx) => (
                            <Star key={idx} className={`size-4 ${idx < fb.rating! ? 'fill-[#A0522D] text-[#A0522D]' : 'fill-ink/5 text-ink/10'}`} />
                          ))}
                          <span className="ml-2 font-mono text-ink/60 text-xs">{fb.rating}/5</span>
                        </div>
                      ) : (
                        <span className="text-xs text-ink/30 italic">Không có</span>
                      )}
                    </td>
                    <td className="py-5 px-6">
                      {fb.feedbackText ? (
                        <p className="text-sm text-ink/80 leading-relaxed italic max-w-xl">
                          "{fb.feedbackText}"
                        </p>
                      ) : (
                        <p className="text-sm text-ink/30 italic">Không để lại bình luận chi tiết.</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Scrollbar CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(0,0,0,0.1);
          border-radius: 20px;
        }
      `}} />
    </div>
  );
}

