import { GhostItem, WardrobeFitReport } from "../types";

export const MOCK_GHOST_ITEM: GhostItem = {
  id: "ghost-001",
  userId: "system",
  isGhost: true,
  brandName: "Mori Studio",
  brandId: "mori-studio",
  imageUrl:
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop",
  category: { id: "cat-outerwear", name: "Áo khoác", slug: "ao-khoac" },
  color: "Đen",
  colorHex: "#1A1A1A",
  style: "Minimal",
  price: 950000,
  status: 0,
  createdAt: new Date().toISOString(),
  wardrobeImpact: {
    compatibleItemCount: 11,
    newOutfitsUnlocked: 16,
    suitableOccasions: ["Work", "Meeting", "Date"],
    redundancyRisk: "low",
    wardrobeGapFilled: "Outerwear",
    colorCompatibilityScore: 88,
  },
};

export const MOCK_FIT_REPORT: WardrobeFitReport = {
  sampleId: "sample-001",
  usersExposed: 1240,
  qualifiedWardrobes: 786,
  keptRate: 0.64,
  swappedRate: 0.21,
  savedOrWaitlistRate: 0.18,
  medianNewOutfits: 7,
  medianCompatibleItems: 6,
  bestPerformingColor: "Black",
  bestOccasions: ["Work", "Meeting"],
  topCompatibleItems: ["Sơ mi trắng", "Quần âu màu trung tính", "Chân váy đen"],
  wardrobePenetration: 0.63,
  incrementalOutfitValue: 7.2,
  variantComparison: [
    { variantName: "Black", keptRate: 0.68, savedRate: 0.22 },
    { variantName: "Beige", keptRate: 0.51, savedRate: 0.15 },
    { variantName: "Dark Brown", keptRate: 0.44, savedRate: 0.11 },
  ],
  opportunityCohorts: [
    { label: "Minimal workwear users", matchCount: 312 },
    { label: "Thiếu outerwear", matchCount: 198 },
    { label: "Thường mặc đi làm", matchCount: 276 },
    { label: "Nhiều item trung tính, thiếu layer", matchCount: 167 },
  ],
};
