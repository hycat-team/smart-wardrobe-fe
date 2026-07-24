import api from "@/lib/axios";
import { userBrandsApi } from "./user-brands.api";

jest.mock("@/lib/axios", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

describe("userBrandsApi.createBrandItemFeedback", () => {
  it("posts feedback to the brand-item endpoint without adding outfitId", async () => {
    (api.post as jest.Mock).mockResolvedValue({
      data: { data: { id: "feedback-1" } },
    });
    const payload = {
      voteType: "like" as const,
      rating: 5,
      feedbackText: "Great sample",
    };

    await userBrandsApi.createBrandItemFeedback("brand-item-1", payload);

    expect(api.post).toHaveBeenCalledWith(
      "/brand-items/brand-item-1/feedbacks",
      payload,
    );
    expect((api.post as jest.Mock).mock.calls[0][1]).not.toHaveProperty("outfitId");
  });
});