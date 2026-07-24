import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { OutfitCanvasBoard } from "./OutfitCanvasBoard";
import type { CanvasItem } from "@/features/outfits/hooks/useOutfitCanvas";

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, style }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className} style={style}>{children}</div>
    ),
  },
}));

jest.mock("@/lib/cloudinary", () => ({
  applyCloudinaryTrim: (url: string) => url,
}));

jest.mock("@/features/ghost-closet/components/GhostItemBadge", () => ({
  GhostItemBadge: () => null,
}));

const baseItem: CanvasItem = {
  id: "canvas-1",
  imageUrl: "https://res.cloudinary.com/demo/image/upload/item.png",
  scale: 100,
  x: 0,
  y: 0,
  zIndex: 1,
};

function renderBoard(item: CanvasItem, onFeedback = jest.fn()) {
  return {
    onFeedback,
    ...render(
      <OutfitCanvasBoard
        canvasRef={React.createRef<HTMLDivElement>()}
        selectedItems={[item]}
        updateScale={jest.fn()}
        bringToFront={jest.fn()}
        removeItem={jest.fn()}
        handleDragEnd={jest.fn()}
        onBrandItemFeedbackClick={onFeedback}
      />,
    ),
  };
}

describe("OutfitCanvasBoard brand feedback action", () => {
  it("shows feedback only for a brand item with a brand item id", () => {
    const brandItem = {
      ...baseItem,
      itemContext: "brand_item",
      brandItemId: "brand-item-1",
    };
    const { onFeedback } = renderBoard(brandItem);

    fireEvent.click(screen.getByRole("button", { name: /Đánh giá sản phẩm/i }));
    expect(onFeedback).toHaveBeenCalledWith(brandItem);
  });

  it("uses itemContext as the visibility source even when the id is missing", () => {
    const firstRender = renderBoard({ ...baseItem, itemContext: "user_wardrobe" });
    expect(screen.queryByRole("button", { name: /Đánh giá sản phẩm/i })).toBeNull();

    firstRender.unmount();
    renderBoard({ ...baseItem, itemContext: "brand_item" });
    expect(screen.getByRole("button", { name: /Đánh giá sản phẩm/i })).toBeTruthy();
  });
});