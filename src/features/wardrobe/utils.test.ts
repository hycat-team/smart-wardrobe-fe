import { getWardrobeItemName, getWardrobeItemTitle } from "./utils";

describe("wardrobe utils", () => {
  describe("getWardrobeItemTitle", () => {
    it("should return item.name when custom name is provided", () => {
      const item = {
        name: "Áo sơ mi vintage",
        fashionItem: {
          category: { name: "Áo sơ mi" },
          color: "Trắng",
        },
      };
      expect(getWardrobeItemTitle(item)).toBe("Áo sơ mi vintage");
    });

    it("should return brandItem.name when available and no custom name", () => {
      const item = {
        brandItem: {
          name: "Áo Polo Nam Slimfit",
        },
        fashionItem: {
          category: { name: "Áo polo" },
          color: "Xanh",
        },
      };
      expect(getWardrobeItemTitle(item)).toBe("Áo Polo Nam Slimfit");
    });

    it("should extract category from fashionItem.category when item.category is undefined", () => {
      const item = {
        fashionItem: {
          category: { name: "Áo thun" },
          color: "Đen",
          style: "Oversize",
        },
      };
      expect(getWardrobeItemTitle(item)).toBe("Áo thun Đen Oversize");
    });

    it("should format title with category and color when style is missing", () => {
      const item = {
        fashionItem: {
          category: { name: "Quần jean" },
          color: "Xanh dương",
        },
      };
      expect(getWardrobeItemTitle(item)).toBe("Quần jean Xanh dương");
    });

    it("should format title with category only when color and style are missing", () => {
      const item = {
        category: { name: "Áo khoác" },
      };
      expect(getWardrobeItemTitle(item)).toBe("Áo khoác");
    });

    it("should fallback to 'Trang phục [attributes]' when category is missing but color/style exists", () => {
      const item = {
        fashionItem: {
          color: "Đỏ",
          style: "Thanh lịch",
        },
      };
      expect(getWardrobeItemTitle(item)).toBe("Trang phục Đỏ Thanh lịch");
    });

    it("should return 'Trang phục chưa phân loại' when completely unclassified", () => {
      const item = {};
      expect(getWardrobeItemTitle(item)).toBe("Trang phục chưa phân loại");
    });

    it("should return 'Trang phục' when item is null or undefined", () => {
      expect(getWardrobeItemTitle(null)).toBe("Trang phục");
      expect(getWardrobeItemTitle(undefined)).toBe("Trang phục");
    });
  });

  describe("getWardrobeItemName", () => {
    it("should extract category from fashionItem.category", () => {
      const item = {
        fashionItem: {
          category: { name: "Váy midi" },
          color: "Hồng",
          style: "Dịu dàng",
        },
      };
      expect(getWardrobeItemName(item)).toBe("Váy midi màu Hồng phong cách Dịu dàng");
    });

    it("should return 'Trang phục chưa phân loại' when item has no category, color, or style", () => {
      const item = {};
      expect(getWardrobeItemName(item)).toBe("Trang phục chưa phân loại");
    });
  });
});
