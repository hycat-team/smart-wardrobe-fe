"use client";
import { useState, useEffect } from "react";
import { MOCK_FIT_REPORT } from "@/features/ghost-closet/mock/ghostClosetMock";
import { Users, Layers, ArrowRight, ArrowUpRight, TrendingUp, ChevronLeft } from "lucide-react";
import Link from "next/link";

export function ReportClient({ sampleId }: { sampleId: string }) {
  const [report, setReport] = useState(MOCK_FIT_REPORT);
  const [productName, setProductName] = useState("Wardrobe Fit Report");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [actualStats, setActualStats] = useState({ save: 0, waitlist: 0, notMyStyle: 0, swap: 0, keep: 0 });

  useEffect(() => {
    try {
      const existingStr = localStorage.getItem("digital_sample_lab_reports");
      if (existingStr) {
        const reports = JSON.parse(existingStr);
        const data = reports.find((r: any) => r.id === sampleId);
        
        if (data) {
          if (data.productName) setProductName(data.productName);
          if (data.imageUrl) setImageUrl(data.imageUrl);
          
          if (data.variants && data.variants.length > 0) {
            const newVariants = data.variants.map((v: any, index: number) => {
              const mockVariant = MOCK_FIT_REPORT.variantComparison[index] || MOCK_FIT_REPORT.variantComparison[0];
              return {
                variantName: v.name || `Variant ${index + 1}`,
                colorHex: v.color,
                keptRate: mockVariant.keptRate,
                savedRate: mockVariant.savedRate
              };
            });
            
            setReport(prev => ({ ...prev, variantComparison: newVariants }));
          }
        }
      }
    } catch (e) {
      console.error("Error loading sample data", e);
    }
    
    const loadStats = () => {
      try {
        const analyticsStr = localStorage.getItem("closy_ghost_analytics");
        if (analyticsStr) {
          const stats = JSON.parse(analyticsStr);
          if (stats[sampleId]) {
            setActualStats(stats[sampleId]);
          }
        }
      } catch(e) { console.error(e); }
    };
    
    loadStats();
    
    // Listen for storage events across tabs to update stats in real-time
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'closy_ghost_analytics') {
        loadStats();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [sampleId]);

  const toPercent = (num: number) => `${Math.round(num * 100)}%`;

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-10">
      {/* Header */}
      <div>
        <Link href="/brand/digital-sample-lab/report" className="text-[10px] font-mono uppercase tracking-widest text-ink-muted hover:text-ink flex items-center gap-1 mb-6 w-fit">
          <ChevronLeft className="size-3" /> Tất cả Reports
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-ink/10 pb-6">
          <div>
            <h1 className="text-4xl font-['Playfair_Display'] uppercase font-medium text-ink mb-2">{productName}</h1>
            <p className="text-sm font-mono tracking-widest uppercase text-ink-muted border-l-2 border-[#A0522D] pl-3">
              Sample ID: {sampleId}
            </p>
          </div>
          <div className="flex gap-8 text-right">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-ink-muted mb-1">Users Exposed</p>
              <p className="text-2xl font-mono text-ink">{report.usersExposed.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-ink-muted mb-1">Qualified Wardrobes</p>
              <p className="text-2xl font-mono text-[#A0522D]">{report.qualifiedWardrobes.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Key Metrics */}
        <div className="lg:col-span-1 space-y-8">
          {imageUrl && (
            <div className="bg-white p-4 border border-ink/10 shadow-sm">
              <img src={imageUrl} alt={productName} className="w-full h-auto object-contain max-h-80 mx-auto" />
            </div>
          )}

          <div className="bg-white p-6 border border-ink/10 shadow-sm space-y-6">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-ink pb-2 border-b border-ink/10">Utility Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#F4F1EE]/50 p-4 border border-ink/5">
                <p className="text-[10px] font-mono uppercase tracking-widest text-ink-muted mb-2">Outfits Mới</p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-mono text-ink">+{report.medianNewOutfits}</span>
                  <TrendingUp className="size-4 text-green-600" />
                </div>
                <p className="text-[10px] mt-2 text-ink-muted">Median per user</p>
              </div>
              <div className="bg-[#F4F1EE]/50 p-4 border border-ink/5">
                <p className="text-[10px] font-mono uppercase tracking-widest text-ink-muted mb-2">Đồ Phù Hợp</p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-mono text-ink">{report.medianCompatibleItems}</span>
                  <Layers className="size-4 text-ink/40" />
                </div>
                <p className="text-[10px] mt-2 text-ink-muted">Món đồ sở hữu</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Insights */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white p-6 border border-ink/10 shadow-sm">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-ink pb-4 border-b border-ink/10 mb-6">Variant Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-ink/10 text-[10px] font-mono uppercase tracking-widest text-ink-muted">
                    <th className="pb-3 font-normal">Variant</th>
                    <th className="pb-3 font-normal text-right">Kept Rate</th>
                    <th className="pb-3 font-normal text-right">Saved Rate</th>
                    <th className="pb-3 font-normal text-right">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {report.variantComparison.map((v: any, i: number) => (
                    <tr key={i} className="border-b border-ink/5 last:border-0">
                      <td className="py-4 font-medium text-ink flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border border-ink/10" style={{ backgroundColor: v.colorHex || v.variantName.toLowerCase().replace(' ', '') || '#000' }} />
                        {v.variantName}
                        {i === 0 && <span className="ml-2 text-[8px] bg-[#A0522D] text-white px-1.5 py-0.5 uppercase tracking-widest">Top</span>}
                      </td>
                      <td className="py-4 text-right font-mono">{toPercent(v.keptRate)}</td>
                      <td className="py-4 text-right font-mono">{toPercent(v.savedRate)}</td>
                      <td className="py-4 text-right">
                        <div className="w-24 h-1.5 bg-ink/10 ml-auto">
                          <div className="h-full bg-ink" style={{ width: toPercent(v.keptRate) }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 border border-ink/10 shadow-sm space-y-6">
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-ink pb-2 border-b border-ink/10">Engagement Funnel</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-ink">Giữ trong Outfit (Keep)</span>
                    <span className="font-mono">{toPercent(report.keptRate)}</span>
                  </div>
                  <div className="h-2 w-full bg-ink/5">
                    <div className="h-full bg-green-600/80" style={{ width: toPercent(report.keptRate) }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-ink">Lưu / Waitlist</span>
                    <span className="font-mono">{toPercent(report.savedOrWaitlistRate)}</span>
                  </div>
                  <div className="h-2 w-full bg-ink/5">
                    <div className="h-full bg-[#A0522D]" style={{ width: toPercent(report.savedOrWaitlistRate) }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-ink">Đổi món khác (Swap)</span>
                    <span className="font-mono">{toPercent(report.swappedRate)}</span>
                  </div>
                  <div className="h-2 w-full bg-ink/5">
                    <div className="h-full bg-ink/30" style={{ width: toPercent(report.swappedRate) }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 border border-ink/10 shadow-sm space-y-6">
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-ink pb-2 border-b border-ink/10">Thực Tế (Từ AI Stylist)</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm border-b border-ink/5 pb-2">
                  <span className="text-ink">Lưu vào Tủ đồ (Save)</span>
                  <span className="font-mono text-lg">{actualStats.save}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-ink/5 pb-2">
                  <span className="text-ink">Đăng ký Waitlist</span>
                  <span className="font-mono text-lg">{actualStats.waitlist}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-ink/5 pb-2">
                  <span className="text-ink">Giữ lại (Keep)</span>
                  <span className="font-mono text-lg">{actualStats.keep}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-ink/5 pb-2">
                  <span className="text-ink">Không hợp gu</span>
                  <span className="font-mono text-lg text-red-500">{actualStats.notMyStyle}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-ink">Đổi món khác (Swap)</span>
                  <span className="font-mono text-lg text-orange-500">{actualStats.swap}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 border border-ink/10 shadow-sm space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-ink pb-2 border-b border-ink/10">Top Compatible Items</h3>
              <ul className="space-y-3">
                {report.topCompatibleItems.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-ink">
                    <ArrowRight className="size-3 text-[#A0522D]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 border border-ink/10 shadow-sm space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-ink pb-2 border-b border-ink/10">Opportunity Cohorts</h3>
              <ul className="space-y-4">
                {report.opportunityCohorts.map((c, i) => (
                  <li key={i} className="flex justify-between items-center text-sm">
                    <span className="text-ink">{c.label}</span>
                    <span className="font-mono text-ink-muted text-xs bg-[#F4F1EE] px-2 py-1">{c.matchCount} users</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
