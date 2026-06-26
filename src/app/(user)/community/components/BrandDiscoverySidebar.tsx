import React, { useState } from "react";
import { mockBrands } from "@/lib/mock-data/b2b";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";
export function BrandDiscoverySidebar() {
  const [search, setSearch] = useState("");
  const filteredBrands = mockBrands.filter(
    (brand) =>
      brand.name.toLowerCase().includes(search.toLowerCase()) ||
      brand.styles.some((style) => style.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div className="flex flex-col gap-5 border border-black/10 p-6 bg-[#FAFAFA]">
      {" "}
      <h3 className="font-bold text-xl tracking-tight text-black">Khám phá Local Brands</h3>{" "}
      <div className="relative">
        {" "}
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/50" />{" "}
        <Input
          placeholder="Tìm tên hoặc phong cách..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 border-black/20 focus-visible:ring-black rounded-xl h-10"
        />{" "}
      </div>{" "}
      <div className="flex flex-col gap-4 mt-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {" "}
        {filteredBrands.length > 0 ? (
          filteredBrands.map((brand) => (
            <div key={brand.id} className="flex items-center justify-between group">
              {" "}
              <Link href={`/brands/${brand.id}`} className="flex items-center gap-3">
                {" "}
                <Avatar className="w-10 h-10 ring-1 ring-black/5 group-hover:ring-black/20 transition-all rounded-sm">
                  {" "}
                  <AvatarImage src={brand.logoUrl} className="object-cover" />{" "}
                  <AvatarFallback className="bg-[#F5F2EE] text-[#1A1A1A] font-medium text-sm rounded-sm">
                    {" "}
                    {brand.name[0]}{" "}
                  </AvatarFallback>{" "}
                </Avatar>{" "}
                <div className="flex flex-col">
                  {" "}
                  <span className="font-bold text-sm text-black group-hover:underline decoration-1 underline-offset-2">
                    {brand.name}
                  </span>{" "}
                  <span className="text-xs text-black/60 font-medium truncate max-w-[120px]">
                    {brand.styles.join(", ")}
                  </span>{" "}
                </div>{" "}
              </Link>{" "}
            </div>
          ))
        ) : (
          <span className="text-sm text-black/50 italic">Không tìm thấy brand nào.</span>
        )}{" "}
      </div>{" "}
      <div className="pt-2 border-t border-black/10">
        {" "}
        <Link href="/brands">
          {" "}
          <button className="text-[10px] font-bold text-black/60 hover:text-black transition-colors w-full text-center">
            {" "}
            Xem tất cả Brands{" "}
          </button>{" "}
        </Link>{" "}
      </div>{" "}
    </div>
  );
}
