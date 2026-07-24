import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrandItemFeedbackSheet } from "./BrandItemFeedbackSheet";
import * as queries from "@/features/brands/queries/user-brands.queries";

const mutateAsync = jest.fn();

jest.mock("@/features/brands/queries/user-brands.queries");
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt }: { alt: string }) => <div role="img" aria-label={alt} />,
}));
jest.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
}));
jest.mock("@/components/ui/sheet", () => ({
  Sheet: ({ open, children }: { open: boolean; children: React.ReactNode }) => open ? <div>{children}</div> : null,
  SheetContent: ({ side, children }: { side: string; children: React.ReactNode }) => <div data-testid="feedback-sheet" data-side={side}>{children}</div>,
  SheetHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
  SheetDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
}));

describe("BrandItemFeedbackSheet", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mutateAsync.mockResolvedValue({});
    (queries.useGetBrandItemDetail as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
    });
    (queries.useCreateSampleFeedback as jest.Mock).mockReturnValue({
      mutateAsync,
      isPending: false,
    });
  });

  it("requires a vote and rating, then submits without outfitId", async () => {
    const onClose = jest.fn();
    render(
      <BrandItemFeedbackSheet
        isOpen
        onClose={onClose}
        brandItemId="brand-item-1"
        snapshot={{ id: "brand-item-1", name: "Áo mẫu", price: 500000 }}
      />,
    );

    expect(screen.getByTestId("feedback-sheet" ).getAttribute("data-side" )).toBe("right" );
        const submit = screen.getByRole("button", { name: "Gửi đánh giá" }) as HTMLButtonElement;
    expect(submit.disabled).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: /Sẵn sàng mua/i }));
    expect(submit.disabled).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: "5 sao" }));
    fireEvent.change(screen.getByLabelText(/Nhận xét thêm/i), {
      target: { value: "  Thiết kế đẹp  " },
    });
    expect(submit.disabled).toBe(false);
    fireEvent.click(submit);

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith({
        itemId: "brand-item-1",
        payload: {
          voteType: "would_buy",
          rating: 5,
          feedbackText: "Thiết kế đẹp",
        },
      });
      expect(onClose).toHaveBeenCalled();
    });
    expect(mutateAsync.mock.calls[0][0].payload).not.toHaveProperty("outfitId");
  });

  it.each([
    ["Không thích", "dislike"],
    ["Không quan tâm", "not_interested"],
  ])("submits the %s vote type", async (label, voteType) => {
    render(
      <BrandItemFeedbackSheet
        isOpen
        onClose={jest.fn()}
        brandItemId="brand-item-1"
        snapshot={{ id: "brand-item-1", name: "Áo mẫu" }}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: new RegExp(`^${label}`, "i") }));
    fireEvent.click(screen.getByRole("button", { name: "3 sao" }));
    fireEvent.click(screen.getByRole("button", { name: "Gửi đánh giá" }));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith({
        itemId: "brand-item-1",
        payload: { voteType, rating: 3 },
      });
    });
  });

  it("keeps the sheet open when submission fails", async () => {
    mutateAsync.mockRejectedValueOnce(new Error("Request failed"));
    const onClose = jest.fn();
    render(
      <BrandItemFeedbackSheet
        isOpen
        onClose={onClose}
        brandItemId="brand-item-1"
        snapshot={{ id: "brand-item-1", name: "Áo mẫu" }}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /^Thích/i }));
    fireEvent.click(screen.getByRole("button", { name: "4 sao" }));
    fireEvent.click(screen.getByRole("button", { name: "Gửi đánh giá" }));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith({
        itemId: "brand-item-1",
        payload: { voteType: "like", rating: 4 },
      });
    });
    expect(onClose).not.toHaveBeenCalled();
  });
});