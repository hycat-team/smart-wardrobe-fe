import React from "react";
import { render, waitFor } from "@testing-library/react";
import { CallbackClient } from "./CallbackClient";
import { profileApi } from "@/features/profile/api/profile.api";
import * as googleAuthUtils from "@/features/auth/utils/google-auth.utils";

const mockReplace = jest.fn();
let mockSearchParams = new URLSearchParams();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
  useSearchParams: () => mockSearchParams,
}));

const mockInvalidateQueries = jest.fn().mockResolvedValue(undefined);
jest.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({
    invalidateQueries: mockInvalidateQueries,
  }),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

jest.mock("@/features/profile/api/profile.api", () => ({
  profileApi: {
    getProfile: jest.fn(),
  },
}));

describe("CallbackClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams = new URLSearchParams();
  });

  it("redirects standard user to /wardrobe upon successful Google login", async () => {
    (profileApi.getProfile as jest.Mock).mockResolvedValueOnce({
      id: "user-123",
      roleSlug: "user",
    });
    jest.spyOn(googleAuthUtils, "getAndClearReturnUrl").mockReturnValue(null);

    render(<CallbackClient />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/wardrobe");
    });
  });

  it("redirects admin user to /admin/dashboard", async () => {
    (profileApi.getProfile as jest.Mock).mockResolvedValueOnce({
      id: "admin-123",
      roleSlug: "ADMIN",
    });
    jest.spyOn(googleAuthUtils, "getAndClearReturnUrl").mockReturnValue(null);

    render(<CallbackClient />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/admin/dashboard");
    });
  });

  it("redirects to saved returnUrl if available", async () => {
    (profileApi.getProfile as jest.Mock).mockResolvedValueOnce({
      id: "user-123",
      roleSlug: "user",
    });
    jest.spyOn(googleAuthUtils, "getAndClearReturnUrl").mockReturnValue("/saved-path");

    render(<CallbackClient />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/saved-path");
    });
  });

  it("redirects to /auth/login when error param is present", async () => {
    mockSearchParams = new URLSearchParams("error=access_denied");

    render(<CallbackClient />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/auth/login");
    });
  });
});
