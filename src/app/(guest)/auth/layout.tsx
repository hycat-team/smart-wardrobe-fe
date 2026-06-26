import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AuthCard from "./AuthCard";
import SplitText from "./SplitText";
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative flex w-full font-inter overflow-hidden bg-ethos-surface-low">
      {" "}
      {/* Back to Home Button */}{" "}
      <Link
        href="/"
        className="absolute top-6 left-6 md:top-8 md:left-8 z-50 flex items-center justify-center h-10 px-4 gap-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-all duration-300 group"
      >
        {" "}
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />{" "}
        <span className="font-inter text-sm font-medium">Quay lại Closy</span>{" "}
      </Link>{" "}
      {/* Background Image */}{" "}
      <div className="absolute inset-0 z-0">
        {" "}
        <Image
          src="/images-login.png"
          alt="Auth Background"
          fill
          priority
          className="object-cover object-[center_65%]"
        />{" "}
        <div className="absolute inset-0 bg-black/10 md:bg-transparent"></div>{" "}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent mix-blend-multiply md:hidden"></div>{" "}
      </div>{" "}
      {/* Content */}{" "}
      <div className="relative z-10 w-full flex min-h-screen">
        {" "}
        {/* Left half - Branding (Hidden on mobile) */}{" "}
        <div className="hidden md:flex md:w-1/2 flex-col p-[64px] pointer-events-none gap-4 mt-8">
          {" "}
          <h2 className="font-playfair text-white drop-shadow-lg tracking-tight">
            {" "}
            <SplitText
              text="Chào mừng đến với Closy"
              className="text-[48px] leading-tight font-semibold"
              delay={40}
              duration={1}
              ease="easeOut"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              textAlign="left"
            />{" "}
          </h2>{" "}
          <div className="max-w-md bg-black/20 p-4 rounded-xl backdrop-blur-sm w-fit">
            {" "}
            <SplitText
              text="Tủ đồ thông minh và AI stylist"
              className="text-[18px] text-white/90 drop-shadow-md"
              delay={30}
              duration={0.8}
              ease="easeOut"
              splitType="words"
              from={{ opacity: 0, y: 20 }}
              to={{ opacity: 1, y: 0 }}
              textAlign="left"
            />{" "}
          </div>{" "}
        </div>{" "}
        {/* Right half - Card Wrapper */}{" "}
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-8 relative">
          {" "}
          {/* Mobile Branding */}{" "}
          <div className="absolute top-8 left-0 w-full flex justify-center md:hidden pointer-events-none">
            {" "}
            <h2 className="font-playfair text-[40px] font-semibold text-white drop-shadow-lg tracking-tight">
              Closy.
            </h2>{" "}
          </div>{" "}
          <AuthCard> {children} </AuthCard>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
