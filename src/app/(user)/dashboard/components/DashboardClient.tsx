"use client";
import Image from "next/image";
import { Search, SlidersHorizontal } from "lucide-react";
export function DashboardClient() {
  return (
    <div className="animate-in fade-in duration-500">
      {" "}
      {/* Page Header & Actions */}{" "}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        {" "}
        <div>
          {" "}
          <h1 className="font-display-lg text-4xl md:text-5xl text-ethos-primary tracking-tight mb-2">
            Tủ đồ của tôi
          </h1>{" "}
          <p className="font-body-lg text-base text-ethos-on-surface-variant">
            142 items curated for you.
          </p>{" "}
        </div>{" "}
        <div className="flex flex-wrap items-center gap-4">
          {" "}
          {/* Search Input */}{" "}
          <div className="relative w-full md:w-64">
            {" "}
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ethos-on-surface-variant w-5 h-5" />{" "}
            <input
              className="w-full bg-ethos-surface-low border-b border-ethos-primary/20 focus:border-ethos-primary focus:bg-ethos-surface-lowest pl-10 pr-4 py-3 rounded-t-lg outline-none transition-colors font-body-sm text-sm text-ethos-primary placeholder:text-ethos-on-surface-variant/60"
              placeholder="Search items..."
              type="text"
            />{" "}
          </div>{" "}
          {/* Filters */}{" "}
          <button className="flex items-center gap-2 px-4 py-3 rounded-lg border border-ethos-outline-variant text-ethos-primary font-body-sm text-sm hover:bg-ethos-surface-low transition-colors">
            {" "}
            <SlidersHorizontal className="w-4 h-4" /> Filters{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
      {/* Categories / Tabs */}{" "}
      <div className="flex overflow-x-auto hide-scrollbar gap-8 mb-8 pb-2 border-b border-ethos-outline-variant/20">
        {" "}
        <button className="font-body-lg text-base font-medium text-ethos-primary border-b-2 border-ethos-primary pb-2 whitespace-nowrap">
          {" "}
          All Items{" "}
        </button>{" "}
        <button className="font-body-lg text-base text-ethos-on-surface-variant hover:text-ethos-primary transition-colors pb-2 whitespace-nowrap">
          {" "}
          Tops{" "}
        </button>{" "}
        <button className="font-body-lg text-base text-ethos-on-surface-variant hover:text-ethos-primary transition-colors pb-2 whitespace-nowrap">
          {" "}
          Bottoms{" "}
        </button>{" "}
        <button className="font-body-lg text-base text-ethos-on-surface-variant hover:text-ethos-primary transition-colors pb-2 whitespace-nowrap">
          {" "}
          Dresses{" "}
        </button>{" "}
        <button className="font-body-lg text-base text-ethos-on-surface-variant hover:text-ethos-primary transition-colors pb-2 whitespace-nowrap">
          {" "}
          Outerwear{" "}
        </button>{" "}
        <button className="font-body-lg text-base text-ethos-on-surface-variant hover:text-ethos-primary transition-colors pb-2 whitespace-nowrap">
          {" "}
          Shoes & Accessories{" "}
        </button>{" "}
      </div>{" "}
      {/* Wardrobe Grid */}{" "}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {" "}
        {/* Item Card 1 */}{" "}
        <div className="group bg-ethos-surface-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-ethos-outline-variant/10 cursor-pointer hover:-translate-y-1">
          {" "}
          <div className="relative aspect-[3/4] bg-ethos-surface-low overflow-hidden">
            {" "}
            <Image
              alt="White silk blouse"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBc0UY91dBEvfD6aO4WTT7IDAl9GH7kRQyIaMCO9Rm8ajIMBB-4nNMkbdvGfGYJ4JLg61QmyWRrNP4ekgKTp4kIEJ2HxrmDtxdMg9lBJTkzpXmODB4tCT7jPT6Br8cN6CaXahyG8GYZ8bgFlj0f960wiIAzcgfBvh2Zqx28mIb8n7kjd6WUfoxb5Rhs8iQAzHiuugt90KUsi93ZB_VYqOgu33WhEeTlpDMfDx5vgnjt7UIWZ7hdT1VBxcRL0VhH1hhYPjITq8m9Uj8"
              width={400}
              height={500}
            />{" "}
            <div className="absolute top-3 left-3 flex gap-2">
              {" "}
              <span className="bg-ethos-secondary/10 text-ethos-secondary font-label-caps text-[10px] px-2 py-1 rounded-sm backdrop-blur-md font-bold">
                {" "}
                ORGANIC SILK{" "}
              </span>{" "}
            </div>{" "}
          </div>{" "}
          <div className="p-4">
            {" "}
            <h3 className="font-title-lg text-base text-ethos-primary truncate font-semibold">
              Minimalist Silk Blouse
            </h3>{" "}
            <p className="font-body-sm text-sm text-ethos-on-surface-variant mt-1">
              Acne Studios
            </p>{" "}
          </div>{" "}
        </div>{" "}
        {/* Item Card 2 */}{" "}
        <div className="group bg-ethos-surface-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-ethos-outline-variant/10 cursor-pointer hover:-translate-y-1">
          {" "}
          <div className="relative aspect-[3/4] bg-ethos-surface-low overflow-hidden">
            {" "}
            <Image
              alt="Beige tailored trousers"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgjt6Ew1Q5nSLBCmDoXGWi6QG4pwbBBnuBfQTQGSh4alKXoBPHGd4TU7ZbEJWdRepwDdPBwbWrrYR7N2GDisj4Y22m1F6T_2-BLiPB4i9YxLpA6Hk6EYH-kF5wvJLU-pX72tseu3ZxR9SyqU6UDlIRMEmrOe1SDR5DGpkVL_yHkEGIx8nOIKhKVOtvujux8bb78CQWIeskNuWF1AOaVkq1bI21CpfVExGNL8rHUuiZ8Gh_4boMKKV49qORMKqwcCcITBJEKhdVOfw"
              width={400}
              height={500}
            />{" "}
            <div className="absolute top-3 left-3 flex gap-2">
              {" "}
              <span className="bg-ethos-secondary/10 text-ethos-secondary font-label-caps text-[10px] px-2 py-1 rounded-sm backdrop-blur-md font-bold">
                {" "}
                WOOL BLEND{" "}
              </span>{" "}
            </div>{" "}
          </div>{" "}
          <div className="p-4">
            {" "}
            <h3 className="font-title-lg text-base text-ethos-primary truncate font-semibold">
              Pleated Wool Trousers
            </h3>{" "}
            <p className="font-body-sm text-sm text-ethos-on-surface-variant mt-1">
              The Row • Size 36
            </p>{" "}
          </div>{" "}
        </div>{" "}
        {/* Item Card 3 (Featured/Wider) */}{" "}
        <div className="group bg-ethos-surface-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-ethos-outline-variant/10 cursor-pointer hover:-translate-y-1 col-span-2 md:col-span-1 lg:col-span-2 lg:row-span-2">
          {" "}
          <div className="relative h-full min-h-[300px] bg-ethos-surface-low overflow-hidden">
            {" "}
            <Image
              alt="Oversized leather jacket"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgFpqic7HpkQgM4OnhULKD_hpW5bD4eQPmMqXLvrZxfiVa_dBpnFmshefaJE8L5ciGxLft4J3Ll92qUEZYaWNwAKcbA5EWGZ42zoMWWglFclbcgC9IWKPBcLznY6o7xWTDaXx7kY0r6wLi2mRcnr1EMIgdBy_bcjfF06DhafcgN-GcNwzASqxt3oZ250Enqw1Nac_VpmQ6e0kNAcg_dLg2ndwdN9pvXndMNDxo7wj7nx56JV2JzkOvtInehDgYIb7zKKilDN-RJGU"
              width={800}
              height={600}
            />{" "}
            <div className="absolute inset-0 bg-gradient-to-t from-ethos-primary/80 to-transparent flex flex-col justify-end p-6">
              {" "}
              <div className="flex gap-2 mb-3">
                {" "}
                <span className="bg-ethos-surface-lowest/20 text-ethos-on-primary font-label-caps text-[10px] px-2 py-1 rounded-sm backdrop-blur-md border border-ethos-on-primary/20 font-bold">
                  {" "}
                  VINTAGE{" "}
                </span>{" "}
                <span className="bg-ethos-surface-lowest/20 text-ethos-on-primary font-label-caps text-[10px] px-2 py-1 rounded-sm backdrop-blur-md border border-ethos-on-primary/20 font-bold">
                  {" "}
                  HEAVY WEAR{" "}
                </span>{" "}
              </div>{" "}
              <h3 className="font-display-lg text-3xl text-ethos-on-primary">
                Oversized Moto Jacket
              </h3>{" "}
              <p className="font-body-sm text-sm text-ethos-on-primary/80 mt-1">
                Vintage Balenciaga • One Size
              </p>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        {/* Item Card 4 */}{" "}
        <div className="group bg-ethos-surface-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-ethos-outline-variant/10 cursor-pointer hover:-translate-y-1">
          {" "}
          <div className="relative aspect-[3/4] bg-ethos-surface-low overflow-hidden">
            {" "}
            <Image
              alt="White sneakers"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB61fjzz5gYRFSQpJrtsuoPBeMnJipC-jdTEeuyswGolIPrpRNKMvxzimaE-fU6Y3STwrW57w9mbfQNaJn4PcHIH4fgd7cOVrr1Kmvt-oKl_1U3Wu2_d9EhxnCsXNI0bU6v08VIgVxbJ-tr1HLORoSymgQYOKYrg1ugcJb2S-Yx-xSR0KPrqv0DI4kKVGvcZgxw3gySTEBauPoZ-D1WfJzFDTDR3Q0ROAbI9pdull0IF4DZhxHlPTfJTlCarSsBjqiY4h8yzPCuDxI"
              width={400}
              height={500}
            />{" "}
          </div>{" "}
          <div className="p-4">
            {" "}
            <h3 className="font-title-lg text-base text-ethos-primary truncate font-semibold">
              Essential Leather Trainers
            </h3>{" "}
            <p className="font-body-sm text-sm text-ethos-on-surface-variant mt-1">
              Common Projects • Size 39
            </p>{" "}
          </div>{" "}
        </div>{" "}
        {/* Item Card 5 */}{" "}
        <div className="group bg-ethos-surface-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-ethos-outline-variant/10 cursor-pointer hover:-translate-y-1">
          {" "}
          <div className="relative aspect-[3/4] bg-ethos-surface-low overflow-hidden">
            {" "}
            <Image
              alt="Black sunglasses"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCH1oofVXCEykdI5UzLvQHNSgBYNOn9pBMec1JBb92JXZuGl--msV7sWMhhx44dOiNsNc2RDnnwiy5mb39GXfpKEvYJkaejan_PloeHOWyqxW8eRcjzrmVlieHOWyqxW8eRcjzrmVlieymrPwZJma73IzOFPyb1kKR0Sp-E8a_-qfGEGqTbPg6q1kQh7uv11m9H7Okt1JJGTUXG2X1Fs5Yz-JdsmKj586uOTAtlAZx2h2WrMioaOQhZeb1PRNu2TrqY-ikPseXxSInrqQl_KtdlqSl-dWZwMo"
              width={400}
              height={500}
            />{" "}
          </div>{" "}
          <div className="p-4">
            {" "}
            <h3 className="font-title-lg text-base text-ethos-primary truncate font-semibold">
              Geometric Sunglasses
            </h3>{" "}
            <p className="font-body-sm text-sm text-ethos-on-surface-variant mt-1">
              Celine • OS
            </p>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Load More */}{" "}
      <div className="mt-12 flex justify-center">
        {" "}
        <button className="px-8 py-3 border border-ethos-primary text-ethos-primary font-body-lg text-base rounded-full hover:bg-ethos-primary hover:text-ethos-on-primary transition-colors duration-300">
          {" "}
          Load More Items{" "}
        </button>{" "}
      </div>{" "}
    </div>
  );
}
