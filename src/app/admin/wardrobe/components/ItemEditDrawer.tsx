"use client";
import { useEffect, useState } from "react";
import { X, Save } from "lucide-react";
import { useUpdateSystemWardrobeItem } from "@/features/admin/queries/admin.queries";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ItemEditDrawerProps {
  item: any;
  isOpen: boolean;
  onClose: () => void;
}

export function ItemEditDrawer({ item, isOpen, onClose }: ItemEditDrawerProps) {
  const { mutate: updateItem, isPending } = useUpdateSystemWardrobeItem();
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || item.title || "",
        color: item.color || "",
        material: item.material || "",
        fit: item.fit || "",
        style: item.style || "",
        seasonality: item.seasonality || "",
        pattern: item.pattern || "",
        price: item.price || 0,
        categoryId: item.category?.id || item.categoryId || "",
      });
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (item) {
      updateItem(
        { id: item.id, data: formData },
        { onSuccess: onClose }
      );
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 z-40 bg-white/60 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white border-l border-gray-300 shadow-2xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-300 bg-gray-50">
          <h2 className="font-heading text-2xl font-bold text-black uppercase tracking-tighter">Edit Record</h2>
          <button 
            onClick={onClose}
            className="size-8 flex items-center justify-center border border-gray-300 text-gray-600 hover:border-black hover:text-white hover:bg-black transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {item && (
            <form id="edit-form" onSubmit={handleSubmit} className="space-y-6">
              
              <div className="flex gap-4 mb-8">
                <div className="size-24 border border-gray-300 bg-gray-50">
                  {item.imageUrl && <Image fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" src={item.imageUrl} alt="" className="w-full h-full object-cover mix-blend-multiply opacity-80" />}
                </div>
                <div className="flex flex-col justify-center gap-1">
                  <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">ID: {item.id}</span>
                  <span className="font-mono text-xs text-green-600 uppercase tracking-widest">Status: Mutable</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="font-mono text-[10px] text-gray-500 uppercase tracking-[0.2em]">Name/Title</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white border border-gray-300 focus:border-green-500 text-black p-3 font-mono text-xs outline-none transition-colors"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] text-gray-500 uppercase tracking-[0.2em]">Color</label>
                    <input 
                      type="text" 
                      value={formData.color} 
                      onChange={e => setFormData({...formData, color: e.target.value})}
                      className="w-full bg-white border border-gray-300 focus:border-green-500 text-black p-3 font-mono text-xs outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] text-gray-500 uppercase tracking-[0.2em]">Material</label>
                    <input 
                      type="text" 
                      value={formData.material} 
                      onChange={e => setFormData({...formData, material: e.target.value})}
                      className="w-full bg-white border border-gray-300 focus:border-green-500 text-black p-3 font-mono text-xs outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] text-gray-500 uppercase tracking-[0.2em]">Fit</label>
                    <input 
                      type="text" 
                      value={formData.fit} 
                      onChange={e => setFormData({...formData, fit: e.target.value})}
                      className="w-full bg-white border border-gray-300 focus:border-green-500 text-black p-3 font-mono text-xs outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] text-gray-500 uppercase tracking-[0.2em]">Style</label>
                    <input 
                      type="text" 
                      value={formData.style} 
                      onChange={e => setFormData({...formData, style: e.target.value})}
                      className="w-full bg-white border border-gray-300 focus:border-green-500 text-black p-3 font-mono text-xs outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] text-gray-500 uppercase tracking-[0.2em]">Season</label>
                    <input 
                      type="text" 
                      value={formData.seasonality} 
                      onChange={e => setFormData({...formData, seasonality: e.target.value})}
                      className="w-full bg-white border border-gray-300 focus:border-green-500 text-black p-3 font-mono text-xs outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] text-gray-500 uppercase tracking-[0.2em]">Pattern</label>
                    <input 
                      type="text" 
                      value={formData.pattern} 
                      onChange={e => setFormData({...formData, pattern: e.target.value})}
                      className="w-full bg-white border border-gray-300 focus:border-green-500 text-black p-3 font-mono text-xs outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>

        <div className="p-6 border-t border-gray-300 bg-gray-50">
          <button 
            form="edit-form"
            type="submit"
            disabled={isPending}
            className="w-full py-4 bg-black text-white font-mono text-xs uppercase tracking-widest font-bold hover:bg-green-500 hover:text-black transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {isPending ? "Transmitting..." : <><Save className="size-4" /> Save Record</>}
          </button>
        </div>
      </div>
    </>
  );
}
