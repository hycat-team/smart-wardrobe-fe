import { Dispatch, SetStateAction } from "react";
import { cn } from "@/lib/utils";
import { Sparkles, SlidersHorizontal } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export const OCCASIONS = ["Không có", "Ở nhà", "Đi học", "Đi làm", "Hẹn hò", "Tiệc", "Thể thao"];
export const STYLES = ["Không có", "Tối giản", "Thường ngày", "Trang trọng", "Cổ điển", "Đường phố"];
export const SEASONS = ["Không có", "Mùa xuân", "Mùa hạ", "Mùa thu", "Mùa đông"];
export const WEATHERS = ["Không có", "Ấm áp", "Lạnh", "Mưa", "Mát mẻ"];
export const COLOR_TONES = ["Không có", "Sáng", "Tối", "Trung tính", "Nhiều màu"];

export const occasionMap: Record<string, string> = {
  "Đi học": "casual",
  "Đi làm": "formal",
  "Hẹn hò": "casual",
  "Tiệc": "party",
  "Thể thao": "sport",
  "Ở nhà": "casual",
};

interface AIQuickOptionsProps {
  popoverOpen: boolean;
  setPopoverOpen: Dispatch<SetStateAction<boolean>>;
  selectedOccasion: string;
  setSelectedOccasion: Dispatch<SetStateAction<string>>;
  selectedStyle: string;
  setSelectedStyle: Dispatch<SetStateAction<string>>;
  selectedSeason: string;
  setSelectedSeason: Dispatch<SetStateAction<string>>;
  selectedWeather: string;
  setSelectedWeather: Dispatch<SetStateAction<string>>;
  selectedColorTone: string;
  setSelectedColorTone: Dispatch<SetStateAction<string>>;
  handleSendMessage: () => void;
  isGenerating: boolean;
  hasSelectedOptions: boolean;
  chatInput: string;
}

export function AIQuickOptions({
  popoverOpen,
  setPopoverOpen,
  selectedOccasion,
  setSelectedOccasion,
  selectedStyle,
  setSelectedStyle,
  selectedSeason,
  setSelectedSeason,
  selectedWeather,
  setSelectedWeather,
  selectedColorTone,
  setSelectedColorTone,
  handleSendMessage,
  isGenerating,
  hasSelectedOptions,
  chatInput
}: AIQuickOptionsProps) {
  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger className="pl-4 pr-2 text-muted-foreground hover:text-foreground transition-colors outline-none flex items-center justify-center">
        <SlidersHorizontal className="w-4 h-4" />
      </PopoverTrigger>
      <PopoverContent side="top" align="start" className="w-[320px] max-h-[400px] overflow-y-auto p-5 border-border rounded-xl shadow-xl bg-card">
        <div className="flex flex-col gap-6">
          <div className="border-b border-border pb-2">
            <p className="text-[11px] font-bold text-foreground tracking-widest uppercase">THÔNG SỐ NHANH</p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">DỊP (OCCASION)</p>
            <div className="flex flex-wrap gap-1.5">
              {OCCASIONS.map(occ => (
                <button key={occ} onClick={() => setSelectedOccasion(prev => prev === occ ? "" : occ)} className={cn("px-2 py-1 text-[9px] font-bold uppercase tracking-widest transition-colors border rounded-full", selectedOccasion === occ ? "bg-foreground text-background border-foreground" : "bg-transparent text-foreground border-border hover:border-foreground")}>{occ}</button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">PHONG CÁCH (STYLE)</p>
            <div className="flex flex-wrap gap-1.5">
              {STYLES.map(style => (
                <button key={style} onClick={() => setSelectedStyle(prev => prev === style ? "" : style)} className={cn("px-2 py-1 text-[9px] font-bold uppercase tracking-widest transition-colors border rounded-full", selectedStyle === style ? "bg-foreground text-background border-foreground" : "bg-transparent text-foreground border-border hover:border-foreground")}>{style}</button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">MÙA (SEASON)</p>
            <div className="flex flex-wrap gap-1.5">
              {SEASONS.map(s => (
                <button key={s} onClick={() => setSelectedSeason(prev => prev === s ? "" : s)} className={cn("px-2 py-1 text-[9px] font-bold uppercase tracking-widest transition-colors border rounded-full", selectedSeason === s ? "bg-foreground text-background border-foreground" : "bg-transparent text-foreground border-border hover:border-foreground")}>{s}</button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">THỜI TIẾT (WEATHER)</p>
            <div className="flex flex-wrap gap-1.5">
              {WEATHERS.map(w => (
                <button key={w} onClick={() => setSelectedWeather(prev => prev === w ? "" : w)} className={cn("px-2 py-1 text-[9px] font-bold uppercase tracking-widest transition-colors border rounded-full", selectedWeather === w ? "bg-foreground text-background border-foreground" : "bg-transparent text-foreground border-border hover:border-foreground")}>{w}</button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">TÔNG MÀU (COLOR TONE)</p>
            <div className="flex flex-wrap gap-1.5">
              {COLOR_TONES.map(c => (
                <button key={c} onClick={() => setSelectedColorTone(prev => prev === c ? "" : c)} className={cn("px-2 py-1 text-[9px] font-bold uppercase tracking-widest transition-colors border rounded-full", selectedColorTone === c ? "bg-foreground text-background border-foreground" : "bg-transparent text-foreground border-border hover:border-foreground")}>{c}</button>
              ))}
            </div>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={isGenerating || (!chatInput.trim() && !hasSelectedOptions)}
            className="mt-2 w-full bg-primary text-primary-foreground text-[11px] font-bold py-3.5 rounded-full hover:bg-primary/90 transition-colors flex justify-center items-center gap-2 disabled:opacity-50 tracking-widest uppercase"
          >
            <Sparkles className="w-3.5 h-3.5" /> TẠO NGAY
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
