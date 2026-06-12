const fs = require('fs');

const file = 'src/app/(user)/wardrobe/components/WardrobeClient.tsx';
let content = fs.readFileSync(file, 'utf8');

const returnRegex = /return \(\s*<div className="animate-in fade-in duration-500[\s\S]*/;

const newReturn = `return (
    <div className="max-w-[1400px] mx-auto space-y-16 pb-32 px-4 sm:px-8 lg:px-12 font-sans selection:bg-ink selection:text-cream">
      {/* High-end Editorial Header */}
      <div className="flex flex-col gap-12 pt-16 md:pt-24 border-b border-ink/10 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-6 max-w-2xl">
            <h1 className="text-6xl md:text-8xl lg:text-[140px] font-heading font-medium tracking-tighter text-ink leading-[0.85] uppercase">
              Wardrobe
            </h1>
            <p className="text-sm md:text-base text-ink-muted font-mono uppercase tracking-[0.2em] max-w-md leading-relaxed border-l border-ink/20 pl-4">
              Your curated collection. 
              {realItems.length > 0 ? \` Documenting \${realItems.length} items.\` : " Start adding pieces."}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted size-4" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-cream border border-ink/20 focus:border-ink focus:ring-0 pl-10 pr-4 py-4 rounded-none outline-none transition-all font-mono text-xs text-ink placeholder:text-ink-muted uppercase tracking-widest"
                placeholder="SEARCH..."
              />
            </form>

            <Button 
              onClick={() => router.push("/wardrobe/upload")}
              className="rounded-none bg-ink text-cream hover:bg-ink/80 text-xs font-mono tracking-[0.15em] h-[50px] px-8 transition-colors uppercase"
            >
              <Plus className="mr-2 size-4" /> Add Item
            </Button>
          </div>
        </div>

        {/* Categories / Tabs - Magazine Index Style */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 pt-4">
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            {CATEGORIES.map((cat, idx) => {
              const label = cat === "Tất cả" ? "All Items" :
                cat === "Áo" ? "Tops" :
                  cat === "Quần" ? "Bottoms" :
                    cat === "Váy" ? "Dresses" :
                      cat === "Áo khoác" ? "Outerwear" :
                        cat === "Phụ kiện" ? "Shoes & Accessories" : cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={cn(
                    "text-xs font-mono uppercase tracking-[0.2em] relative transition-colors group pb-2",
                    categoryParam === cat 
                      ? "text-ink font-bold" 
                      : "text-ink-muted hover:text-ink"
                  )}
                >
                  {label}
                  <span className={cn(
                    "absolute bottom-0 left-0 h-[2px] bg-ink transition-all duration-300",
                    categoryParam === cat ? "w-full" : "w-0 group-hover:w-full"
                  )} />
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4 border border-ink/20 px-4 py-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-ink-muted">Sort</span>
            <select 
              value={sortParam}
              onChange={(e) => setSortParam(e.target.value)}
              className="bg-transparent text-xs font-mono uppercase tracking-widest text-ink font-bold focus:outline-none focus:ring-0 cursor-pointer appearance-none"
            >
              <option value="newest">Latest</option>
              <option value="oldest">Earliest</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      {isLoadingItems ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8">
          <div className="size-24 border border-ink/20 border-t-ink rounded-full animate-spin" />
          <p className="text-[10px] text-ink-muted font-mono tracking-[0.3em] uppercase">Loading Wardrobe...</p>
        </div>
      ) : sortedItems.length > 0 ? (
        <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16 auto-rows-fr transition-all duration-300", (isFetching && !isFetchingNextPage) && "opacity-60 blur-[1px]")}>
          {sortedItems.map((item: any) => {
            const isProcessing = item.status === WardrobeItemStatus.Processing;
            const isFailed = item.status === WardrobeItemStatus.Failed;
            const isLocked = item.isLocked;

            const handleCardClick = () => {
              if (isLocked) {
                toast.error("Trang phục bị khóa do vượt quá hạn ngạch. Vui lòng nâng cấp gói cước!");
                return;
              }
              if (isProcessing) {
                toast.info("AI đang xử lý hình ảnh này. Vui lòng đợi trong giây lát!");
                return;
              }
              router.push(\`/wardrobe/item/\${item.id}\`);
            };

            return (
              <div
                key={item.id}
                onClick={handleCardClick}
                className={cn(
                  "group flex flex-col gap-5 cursor-pointer relative",
                  isLocked && "opacity-75"
                )}
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden bg-cream border border-cream-dark/60 rounded-none">
                  <img
                    alt={getWardrobeItemName(item)}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 mix-blend-multiply"
                    src={item.imageUrl || undefined}
                  />
                  {item.material && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-ink/90 text-cream px-3 py-1.5 text-[10px] font-mono tracking-widest uppercase">
                        {item.material}
                      </span>
                    </div>
                  )}
                  {item.colorHex && (
                    <div className="absolute top-4 right-4 z-10">
                      <div
                        className="w-4 h-4 border border-ink/10 shadow-sm"
                        style={{ backgroundColor: item.colorHex }}
                        title={item.color || "Màu sắc"}
                      />
                    </div>
                  )}

                  {!isLocked && !isProcessing && (
                    <div className="absolute inset-0 bg-ink/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-cream text-ink px-6 py-3 font-mono text-xs uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        View Details
                      </div>
                    </div>
                  )}
                </div>

                {/* Meta */}
                <div className="flex flex-col gap-1 border-t border-ink/10 pt-4">
                  <h3 className="font-heading text-lg text-ink font-medium tracking-tight uppercase truncate">{getWardrobeItemName(item)}</h3>
                  <p className="font-mono text-[10px] text-ink-muted uppercase tracking-widest flex items-center justify-between">
                    <span className="truncate">{item.brand || "Acne Studios"}</span>
                    <span>Size {item.size || "S"}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-8 text-center max-w-md mx-auto">
          <div className="size-24 bg-[#e0dcd5] flex items-center justify-center text-ink/40">
            <Tag className="size-10 stroke-1" />
          </div>
          <div className="space-y-4">
            <h3 className="font-heading text-4xl text-ink uppercase tracking-tight">Void</h3>
            <p className="text-xs font-mono uppercase tracking-widest text-ink-muted leading-relaxed">
              Your wardrobe is empty. Start digitizing your physical pieces to compose new looks.
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => router.push("/wardrobe/upload")} 
            className="rounded-none border-ink text-ink hover:bg-ink hover:text-cream text-xs font-mono tracking-[0.2em] uppercase h-14 px-8 mt-4"
          >
            Add New Item
          </Button>
        </div>
      )}

      {hasNextPage && (
        <div className="mt-32 flex justify-center border-t border-ink/10 pt-16">
          <Button 
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="ghost"
            className="text-xs font-mono tracking-[0.3em] uppercase text-ink hover:bg-transparent hover:text-terracotta disabled:opacity-50 transition-colors"
          >
            {isFetchingNextPage ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  );
}
`;

content = content.replace(returnRegex, newReturn);
fs.writeFileSync(file, content, 'utf8');
console.log('WardrobeClient updated.');
