import { Metadata } from "next";
import { LandingClient } from "./components/LandingClient";

export const metadata: Metadata = {
  title: "Closy | Smart Wardrobe",
  description: "Trải nghiệm phong cách thời trang thông minh với AI.",
};

export default function LandingPage() {
  return <LandingClient />;
}
