import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { PostMediaGallery } from "./PostMediaGallery";
import type { PostMediaRes } from "../types";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} />
  ),
}));

jest.mock("./VideoPlayer", () => ({
  VideoPlayer: ({ src }: { src: string }) => <div data-testid="video-player" data-src={src} />,
}));

const media: PostMediaRes[] = [
  { id: "m1", mediaType: "image", mediaUrl: "https://cdn/img1.jpg", sortOrder: 3 },
  { id: "m2", mediaType: "video", mediaUrl: "https://cdn/vid1.mp4", sortOrder: 1 },
  { id: "m3", mediaType: "image", mediaUrl: "https://cdn/img2.jpg", sortOrder: 2 },
];

describe("PostMediaGallery", () => {
  it("trả về null khi media rỗng", () => {
    const { container } = render(<PostMediaGallery media={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("hiển thị đủ số tệp theo thứ tự sortOrder tăng dần", () => {
    render(<PostMediaGallery media={media} />);
    // video có sortOrder = 1 -> là ảnh chính (render VideoPlayer)
    expect(screen.getAllByTestId("video-player")).toHaveLength(1);
    // 2 ảnh còn lại (sortOrder 2, 3) nằm trong lưới phụ
    const imgs = screen.getAllByRole("img");
    expect(imgs).toHaveLength(2);
  });

  it("render video bằng VideoPlayer và ảnh bằng next/image", () => {
    render(<PostMediaGallery media={media} />);
    const videos = screen.getAllByTestId("video-player");
    expect(videos).toHaveLength(1);
    expect(videos[0].getAttribute("data-src")).toBe("https://cdn/vid1.mp4");
  });

  it("không hiển thị lưới phụ khi chỉ có 1 tệp", () => {
    render(<PostMediaGallery media={[media[1]]} />);
    expect(screen.getAllByTestId("video-player")).toHaveLength(1);
    // với 1 tệp video, không có ô ảnh phụ
    expect(screen.queryAllByRole("img")).toHaveLength(0);
  });

  it("variant=compact hiển thị tệp đầu + badge số lượng và bọc Link", () => {
    render(<PostMediaGallery media={media} variant="compact" linkHref="/posts/abc" />);
    // compact chỉ render tệp chính (video, sortOrder 1)
    expect(screen.getAllByTestId("video-player")).toHaveLength(1);
    // badge số lượng xuất hiện
    expect(screen.getByText("3")).toBeTruthy();
    // bọc Link điều hướng
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/posts/abc");
  });

  it("lightbox: bấm tệp → mở, hiển thị chỉ số, prev/next và đóng hoạt động", () => {
    render(<PostMediaGallery media={media} />);
    // bấm ô thumbnail "Xem tệp 2" (ảnh sortOrder 2)
    fireEvent.click(screen.getByRole("button", { name: "Xem tệp 2" }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("2/3")).toBeTruthy();
    // nút sau → tệp 3
    fireEvent.click(within(dialog).getByRole("button", { name: "Tệp sau" }));
    expect(within(dialog).getByText("3/3")).toBeTruthy();
    // nút trước → quay lại tệp 2
    fireEvent.click(within(dialog).getByRole("button", { name: "Tệp trước" }));
    expect(within(dialog).getByText("2/3")).toBeTruthy();
    // đóng lightbox
    fireEvent.click(within(dialog).getByRole("button", { name: "Đóng" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("bấm ảnh chính → mở lightbox ở tệp đầu tiên", () => {
    const imageOnly: PostMediaRes[] = [
      { id: "i1", mediaType: "image", mediaUrl: "https://cdn/a.jpg", sortOrder: 1 },
      { id: "i2", mediaType: "image", mediaUrl: "https://cdn/b.jpg", sortOrder: 2 },
    ];
    render(<PostMediaGallery media={imageOnly} />);
    fireEvent.click(screen.getByRole("button", { name: "Xem ảnh chính" }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("1/2")).toBeTruthy();
  });
});